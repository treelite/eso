/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 异步请求封装
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var ejson = require('./ejson');
    var defFailHandler = {
            '1': function () {
                esui.Dialog.alert({
                    title : '错误',
                    content : '系统开小差了...(>_<)... 请稍后重试...'
                });
            },

            def: function () {
                esui.Dialog.alert({
                    title : '错误',
                    content : '系统开小差了...(>_<)... 请稍后重试...'
                }); 
            }
        };

    function createFailureHandler(customHandler) {
        return function (status, obj) {
            if (status < 200) {
                if (customHandler) {
                    customHandler.call(null, status, obj);
                }
                return;
            }

            var handler = defFailHandler[status];
            if (handler) {
                handler.call(null, status, obj);
            }
            else {
                defFailHandler.def.call(null, status, obj);
            }
        };
    }

    function request (url, options) {
        options.onfailure = createFailureHandler(options.onfailure);
        return ejson.request(url, options);
    }

    return {
        request: request,

        post: function (url, postData, onsuccess, onfailure) {
            var opt =  {
                    method      : 'post', 
                    data        : postData, 
                    onsuccess   : onsuccess, 
                    onfailure   : onfailure
            };

            return request(url, opt);
        },

        get: function (url, onsuccess, onfailure) {
            var t = + new Date().getTime();

            if (url.indexOf('?') >= 0) {
                url = url.split('?');
                url[1] = baidu.url.queryToJson(url[1]);
                url[1].req = t;
                url = url[0] 
                    + '?' 
                    + baidu.url.jsonToQuery(url[1], encodeURIComponent);
            }
            else {
                url += '?req=' + t;
            }

            var opt =  {
                    method      : 'get',
                    onsuccess   : onsuccess, 
                    onfailure   : onfailure
                };

            return request(url, opt);
        }
    };
});
