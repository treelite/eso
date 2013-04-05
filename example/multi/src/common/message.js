/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 系统消息
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var G = baidu.dom.g;
    var createDom = baidu.dom.create;
    var attachEvent = baidu.event.on;
    var stopPropagation = baidu.event.stopPropagation;
    var encodeHTML = baidu.string.encodeHTML;

    var ajax = require('./ajax');
    var URL = lxb.root + '/web/getUnreadMessages';
    var view = {};

    // data = {total: xxx, messages: []}
    function update(data) {
        var html = [];
        for (var i = 0, item; item = data.messages[i]; i++) {
            html.push('<li><a href="#'+ item.id +'">' + encodeHTML(item.message) + '</a></li>');
        }


        var total = +data.total;
        if (total <= 0) {
            view.btn.innerHTML = '';
            view.tip.innerHTML = '暂无消息';
            view.tip.style.display = '';
            view.list.style.display = 'none';
        }
        else {
            view.btn.innerHTML = '<span>' 
                + (total > 99 ? '+99' : total) 
                + '</span>';
            view.list.innerHTML = html.join('');
            view.list.style.display = '';
            view.tip.style.display = 'none';
        }

        // TODO 更多信息显示
    }

    function initView(btnId, msgListId) {
        var ele = view.layer = G(msgListId);

        ele.style.display = 'none';

        view.tip = createDom('p', {className: 'tip'});
        view.tip.innerHTML = '正在加载，请稍后...';
        ele.appendChild(view.tip);

        view.list = createDom('ol');
        view.list.style.display = 'none';
        ele.appendChild(view.list);
        
        ele.appendChild(createDom('span', {className: 'icon icon-cursor'}));

        view.btn = G(btnId);
    }

    function bindEvents() {
        attachEvent(document.body, 'click', function () {
            if (view.layer.style.display == '') {
                view.layer.style.display = 'none';
            }
        });

        attachEvent(view.btn, 'click', function (e) {
            view.layer.style.display = '';
            stopPropagation(e);
        });
    }

    return {
        init: function (btnId, msgListId) {
            btnId = btnId || 'header-opt-msg';
            msgListId = msgListId || 'msg-list';

            initView(btnId, msgListId);
            bindEvents();

            ajax.get(URL, update);
        }
    };
});
