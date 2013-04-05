/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 首页-公告区
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var G = baidu.dom.g;
    var formatStr = baidu.string.format;
    var encodeHTML = baidu.string.encodeHTML;
    var ajax = require('../common/ajax');
    
    var view = {};

    var URL = lxb.root + '/web/getNoticeList';

    function render(data) {
        var html = ['<h3>公告区</h3><ul>'];

        var tpl = '<li><a href="http://#{url}" target="_blank">#{title}</a></li>';

        for (var i = 0, item; item = data[i]; i++) {
            html.push(
                formatStr(
                    tpl, 
                    {
                        url: item.url, 
                        title: encodeHTML(item.title)
                    }
                )
            );
        }

        html.push('</ul>');

        view.container.innerHTML = html.join('');
    }

    return {
        init: function (id) {
            id = id || 'notice-area';
            view.container = G(id);
            ajax.get(URL, render);
        }
    };
});
