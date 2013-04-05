/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 饼图
 * @author cxl(c.xinle@gmail.com)
 */

define(function (require) {
    var chart = require('./chart');

    function PieChart(chart, options) {
        this.chart = chart;

        this.color = [
            "0xff9000",
            "0x9dcb09",
            "0x71bde9",
            "0xde6829",
            "0xedce00"
        ];

        this.tip = {
            "backgroundColor": "0xe247f4",
            "formatter": "${b}\n${a} : ${c}",
            "type": "single",
            "textStyle": {
                "color": "0xffffff",
                "fontSize": "12",
                "fontFamily": "Arial,simsun"
            }
        };
        var radiusValue = Math.floor(Math.min(options.width, options.height) / 2 * 0.6);
        this.scheme = {
            "minAngle": 2,
            "name": "pie",
            "itemRenderer": "baidu.dv.pie.RingItemElegant",
            "itemStyles": {
                "normalStyle": {
                    "lineThickness": "1",
                    "fillAlpha": "1",
                    "lineAlpha": "1"
                },
                "label": {
                    "show": true,
                    "textStyle": {
                        "color": "#0",
                        "fontSize": "12",
                        "fontFamily": "Arial,simsun"
                    }
                },
                "labelLine": {
                    "show": true,
                    "lineStyle": {
                        "thickness": "2",
                        "alpha": "1",
                        "color": "0x666666"
                    },
                    "length": ".1"
                }
            },
            "center": {
                "y": Math.floor(options.height / 2),
                "x": Math.floor(options.width / 2)
            },
            "radius": radiusValue,
            "startAngle": 0,
            "type": "baidu.dv.pie.PieGraph",
            "tip": {
                "backgroundColor": "0xe247f4",
                "formatter": "${c}%",
                "type": "single",
                "textStyle": {
                    "color": "0xffffff",
                    "fontSize": "14",
                    "fontFamily": "Arial,simsun"
                }
            }
        };
    }

    PieChart.prototype.setValue = function (data) {
        var options = {};

        options.color = this.color;
        //options.tip = this.tip;
        options.data = [this.scheme];
        options.data[0].data = data;

        this.chart.setOption(options);
    };

    return {
        create: function (id, options, callback) {
            var obj = {
                width: options.width,
                height: options.height
            };

            chart.attachLoaded(id, function () {
                var pieChart = new PieChart(chart.get(id), obj);

                callback.call(null, pieChart);
            });
            chart.create(id, options);
        }
    };
});
