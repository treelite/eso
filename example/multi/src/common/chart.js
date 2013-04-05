/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 图表基础控制
 * @author cxl(c.xinle@gmail.com)
 */

define(function (require) {

    var extend = baidu.object.extend;
    var swf = baidu.swf;

    var loadedCallback = {};

    var SWF_URL = lxb.root + '/swf/JSMixChart.swf';

    window.onFlashLoaded = function (id) {
        var callback = loadedCallback[id];

        if (callback) {
            callback.call();
        }
    };

    return {
        create: function (id, options) {
            options = extend({}, options);
            options.id = id;
            options.ver = '9.0.28';
            options.errorMessage = '请下载最新的Flash播放器！';
            options.url = SWF_URL;
            options.bgcolor = '#FFF';
            options.wmode = 'window';

            swf.create(options, options.container);
        },

        get: baidu.swf.getMovie,

        attachLoaded: function (id, callback) {
            loadedCallback[id] = callback;
        }
    };
});
