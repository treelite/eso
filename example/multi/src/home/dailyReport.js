/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 首页-每日数据汇总区
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var ajax = require('../common/ajax');
    var URL = lxb.root + '/web/todayCall';

    var G = baidu.dom.g;

    var view = {};

    var tpl = require('tpl!./dailyReport.tpl');

    function render(data) {
        var res = {};
        var info = data.totaldata;
        res.total = info.app ? info.callCount : '?';
        res.misTotal = info.app ? info.callMissed : '?';

        info = data.teldata;
        res.telCount = info.app ? info.callCount : '?';
        res.telMis = info.app ? info.callMissed : '?';

        info = data.callbackdata;
        res.cbCount = info.app ? info.callCount : '?';
        res.cbMis = info.app ? info.callMissed : '?';

        info = data.yesterdaydata;
        res.yTotal = info.callCount;
        res.yMisTotal = info.callMissed;

        tpl.render(res, view.container);
    }

    return {
        init: function (id) {
            id = id || 'daily-report';
            view.container = G(id);
            ajax.get(URL, render);
        }
    };
});
