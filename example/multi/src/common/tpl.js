/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file  esl模板插件
 * @author cxl(chenxinle@baidu.com)
 */

define(function () {
    var encodeHTML = baidu.string.encodeHTML;
    var trim = baidu.string.trim;
    var ajax =baidu.ajax;

    var SPLIT_TOKEN = '-TPL-SPLIT-';

    function Template(str) {
        this.tpl = trim(str);
    }

    /**
     * 渲染模板
     *
     * @param {Object} data 数据
     * @param {DOMElement|string=} container DOM元素或者id
     * @return {string} html
     */
    Template.prototype.render = function (data, container) {
        var html = this.tpl.replace(
            /#{([^}]+)}/g, 
            function ($0, $1) {
                var res = $0;
                var handler = [];

                if ($1.indexOf(':') > 0) {
                    $1 = $1.split(':');
                    handler = $1.splice(1, $1.length - 1);
                    $1 = $1[0];
                }

                if (data.hasOwnProperty($1)) {
                    res = data[$1];
                    for (var i = 0, item; item = handler[i]; i++) {
                        if (item == 'h') {
                            res = encodeHTML(res);
                        }
                    }
                }
                else {
                    res = '';
                }

                return res;
            }
        );

        if (container) {
            if (typeof container == 'string') {
                container = G(container);
            }
            container.innerHTML = html;
        }

        return html
    };

    function TemplateMgr(str) {
        var keys = [];
        str = str.replace(/<!--(.+)-->/g, function ($0, $1) {
            var res;

            $1 = trim($1); 
            if ($1.indexOf('name:') === 0) {
                $1 = $1.replace(/name:\s*/, '');
                keys.push($1);
                res = SPLIT_TOKEN;
            }
            else {
                res = $0;
            }

            return res;
        });

        if (keys.length <= 0) {
            return new Template(str);
        }
        else {
            str = str.split(SPLIT_TOKEN);


            for (var i = 0, item; item = keys[i]; i++) {
                this[item] = new Template(str[i + 1] || '');
            }
        }
    }

    return {
        load: function (resourceId, require, load, config) {
            var url = require.toUrl(resourceId);

            var t = 'req=' + (new Date()).getTime();
            if (url.indexOf('?') >= 0) {
                url += '&' + t;
            }
            else {
                url += '?' + t;
            }

            ajax.get(url, function (req, res) {
                load(new TemplateMgr(res));
            });
        }
    };
});
