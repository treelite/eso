/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 应用管理导航
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {

    var ajax = require('../common/ajax');
    
    var G = baidu.dom.g;
    var query = baidu.dom.q;

    var view = {};
    var config = {};

    var tpl = require('tpl!./apps.tpl');

    var URL = {
        MAIN: lxb.root + '/web/apps',
        TEL_HOM: '#',
        TEL_DES: '#',
        TEL_OPT: {
                style: '#',
                setting: '#',
                report: '#',
                financial: '#'
            },
        CB_HOM: '#',
        CB_DES: '#',
        CB_BUY: '#',
        CB_OPT: {
                style: '#',
                setting: '#',
                report: '#',
                financial: '#'
            },
        TRACK_HOM: '#',
        TRACK_DES: '#',
        TRACK_OPT: {
                style: '#',
                setting: '#',
                report: '#',
                financial: '#'
            },
        SMS_DES: '#'
    };

    var handler = {};

    handler.tel = function (data) {
        var res = {
                type: 'tel',
                title: '400增值',
                url: URL.TEL_HOM
            };

        var content = [];

        if (data.status == -1) {
            res.status = tpl.button.render(
                    {
                        type: 'g', 
                        action: 'openTel', 
                        text: '立即开通'
                    }
                );
            content.push(tpl.content.render({content: '400电话时段、地域、人员分析全掌握'}));
            res.opt = tpl.optMore.render({url: URL.TEL_DES});
        }
        else {
            if (data.status > 1) {
                res.status = tpl.invalid.render({text: '400电话欠费暂停'});
            }
            res.opt = tpl.opt.render(URL.TEL_OPT);

            var data = data.telInfo;
            content.push(tpl.content.render({content: data.tel}));
            var str;
            if (data.balance || data.balance === 0) {
                str = '余额：' + data.balance;
            }
            else if (data.minRemain || data.minRemain === 0) {
                str = '剩余分钟数：' + data.minRemain;
            }
            else if (data.expireDate) {
                str = '到期时间：' + data.expireDate;
            }

            str += ' <a href="' + data.buyUrl + '" target="_blank">充值</a>';
            content.push(tpl.content.render({content: str}));
        }

        res.content = content.join('');

        return res;
    };

    handler.callback = function (data) {
        var content = [];
        var res = {
                type: 'callback',
                title: '网页回呼',
                url: URL.CB_HOM
            };

        var invalidMsg = {
                2: '您的百度推广帐户当前状态为未生效/待审核/拒绝，暂时无法使用此应用，帐户状态恢复正常即可正常使用，请您尽快解决，如需要帮助请联系您的百度推广顾问',
                3: {
                    fgs: '您的离线宝余额不足5元，暂时无法使用此应用，请转账或者充值，如需帮助请联系您的百度推广顾问！',
                    dls: '您的离线宝余额为不足5元，暂时无法使用此应用，请联系您的百度推广顾问进行充值'
                },
                4: '您的回呼状态异常，暂时无法使用 此应用，请与离线宝管理员联系',
                6: '您的账户未加V，无法使用回呼，帐户状态恢复正常即可正常使用，请您尽快解决，如需要帮助请联系您的百度推广顾问',
                7: '您的账户星级未达到3星，暂时无法使用此应用，帐户状态恢复正常即可正常使用，请您尽快解决，如需要帮助请联系您的百度推广顾问'
            };

        if (data.status == -1) {
            res.status = tpl.button.render(
                    {
                        type: 'g', 
                        action: 'openCallback', 
                        text: '立即开通'
                    }
                );

            content.push(tpl.content.render({content: '“免费”电话更吸引拨打'}));
            var info = data.couponActivityInfo;
            if (info.fee > 0) {
                content.push(
                    tpl.content.render(
                        {
                            className: 'green', 
                            content: '开通即送'+ info.fee +'分钟通话！'
                        }
                    )
                );
            }
            res.opt = tpl.optMore.render({url: URL.CB_DES});
        }
        else if (data.status == -2) {
            res.status = tpl.button.render(
                    {
                        type: 'b', 
                        action: 'interest', 
                        text: '我感兴趣',
                        attr: ' data-id="callback"'
                    }
                );
            content.push(tpl.content.render({content: '“免费”电话更吸引拨打'}));
            res.opt = tpl.optMore.render({url: URL.CB_DES});
        }
        else {
            var msg = invalidMsg[data.status];
            if (msg) {
                if (data.status == 3) {
                    res.status = tpl.invalid.render({text: msg[config.userType] || msg.fgs});
                }
                else {
                    res.status = tpl.invalid.render({text: msg});
                }
            }
            var info = data.couponInfo;
            if (info.remainFee > 0) {
                content.push(
                    tpl.content.render(
                        {
                            content: '赠送剩余' + info.remainFee + '分钟 '
                                + info.expireTime +'过期'
                        }
                    )
                );
            }
            res.opt = tpl.opt.render(URL.CB_OPT);
        }

        res.content = content.join('');
        return res;
    };

    handler.track = function (data) {
        var res = {
                title: '媒体追踪',
                type: 'track',
                url: URL.TRACK_HOM
            };

        var content = [];

        var invalidMsg = {
                3: '由于离线宝余额不足您所购买的新套餐无法生效，请您尽快充值，如需要帮助请联系您的百度推广顾问',
                5: '套餐已过期，请购买新套餐'
            };

        if (data.status == -1) {
            res.status = tpl.button.render({type: 'g', text: '立即开通', action: 'openTrack'});
            content.push(tpl.content.render({content: '电话来源一清二楚，推广投放省心高效'}));
            res.opt = tpl.optMore.render({url: URL.CB_DES});
        }
        else {
            var msg = invalidMsg[data.status];
            if (msg) {
                res.status = tpl.invalid.render({text: msg});
            }
            var info = data.trackInfo;
            if (info.modeName) {
                content.push(
                    tpl.content.render(
                        {
                            content: '套餐名称：' 
                                + info.modeName 
                                + ' <a href="'+ URL.CB_BUY +'">续购</a>'
                        }
                    )
                );
                content.push(
                    tpl.content.render(
                        {content: '套餐到期：' + info.expiredate}
                    )
                );
            }
            else {
                content.push(tpl.content.render({content: '<a href="'+ URL.CB_BUY +'">续购</a>'}));
            }
            res.opt = tpl.opt.render(URL.TRACK_OPT);
        }
        res.content = content.join('');
        return res;
    };

    handler.sms = function () {
        return {
                type: 'sms',
                title: '短信营销',
                url: URL.SMS_DES,
                status: tpl.button.render({type: 'b', action: 'interest', text: '我感兴趣', attr: 'data-id="sms"'}),
                content: tpl.content.render({content: '二次营销利器，让回头客再回头'}),
                opt: tpl.optMore.render({url: URL.SMS_DES})
            };
    };

    function render(data) {
        var keys = ['callback', 'tel', 'track', 'sms'];

        var html = [];
        for (var i = 0, key; key = keys[i]; i++) {
            if (handler[key]) {
                html.push(tpl.appItem.render(handler[key].call(null, data[key])));
            }
        }

        view.container.innerHTML = '<h3>应用管理</h3>' + html.join('');
    }

    function bindEvents() {
        var items = query('app-item', view.container, 'div');

        function appItemOver() {
            this.className += ' app-item-cur';
        }

        function appItemOut() {
            this.className = this.className.replace(/\s+app-item-cur/g, '');
        }

        for (var i = 0, item; item = items[i]; i++) {
            item.onmouseover = appItemOver;
            item.onmouseout = appItemOut;
        }

        //TODO: view.container事件代理，处理感兴趣等事件
    }

    return {
        init: function (userType, id) {
            config.userType = userType;

            id = id || 'app-info';
            view.container = G(id);

            ajax.get(URL.MAIN, function (data) {
                render(data);
                bindEvents();
            });
        }
    };
});
