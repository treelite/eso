/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 柱状图
 * @author cxl(c.xinle@gmail.com)
 */

define(function (require) {
    var chart = require('./chart');

    function createBar(data, name) {
        var scheme = {
            "itemRenderer": "baidu.dv.bar.BarItem",
            "itemStyles": {
                "emphasizedStyle": {
                    "lineColor": "#dd4ff4",
                    "fillColor": "#fb7c00",
                    "lineThickness": "2",
                    "fillAlpha": "1",
                    "lineAlpha": "1"
                },
                "normalStyle": {
                    "lineThickness": "1",
                    "fillAlpha": "1",
                    "lineAlpha": "1"
                }
            },
            "stack": "group",
            "name": name,
            "type": "baidu.dv.bar.BarGraphTween",
            "tip": {
                "backgroundColor": "0xdd4ff4",
                "formatter": "${b}\n${a} : ${c}",
                "type": "single",
                "textStyle": {
                    "color": "0xffffff",
                    "fontSize": "12",
                    "fontFamily": "Arial,simsun"
                }
            }
        };

        scheme.data = [];
        for (var i = 0, value; value = data[i]; i++) {
            scheme.data.push({value: value});
        }

        return scheme;
    }

    function BarChart(chart, options) {
        this.chart = chart;

        this.valueGrid = [
            {
                "splitLine": {
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "#DCDCDC"
                    },
                    "show": true
                },
                "gapOfMax": 0.1,
                "axisTick": {
                    "show": true,
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "#333333"
                    },
                    "length": 0
                },
                "axisLabel": {
                    "multiline": false,
                    "padding": 4,
                    "show": true,
                    "textStyle": {
                        "color": "#b2b2b2",
                        "fontSize": "12",
                        "fontFamily": "Arial,simsun"
                    }
                },
                "axisLine": {
                    "lineStyle": {
                        "thickness": "2",
                        "alpha": "1",
                        "color": "0x666666"
                    },
                    "show": false
                },
                "placement": "left",
                "splitNumber": 5
            }
        ];

        var paddingLeft = 40;
        var paddingRight = 40;
        var paddingTop = 10;
        var paddingbottom = 20;
        this.config = {
            x: paddingLeft,
            y: paddingTop,
            width: options.width - paddingLeft - paddingRight,
            height: options.height - paddingTop - paddingbottom
        };

        this.categoryGrid = [
            {
                "splitLine": {
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "#DCDCDC"
                    },
                    "show": false
                },
                "axisTick": {
                    "show": true,
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "0xcbcbcb"
                    },
                    "length": 0
                },
                "axisLabel": {
                    "multiline": false,
                    "padding": 4,
                    "show": true,
                    "textStyle": {
                        "color": "#b2b2b2",
                        "fontSize": "12",
                        "fontFamily": "Arial,simsun"
                    }
                },
                "axisLine": {
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "0xcbcbcb"
                    },
                    "show": true
                },
                "placement": "bottom"
            }
        ];

        this.color = [
            "0xfb7c00",
            "0x25d16b",
            "0x47bef4"
        ];
    }

    BarChart.prototype.setValue = function (data, options) {
        var chartOptions = {};

        chartOptions.config = this.config;
        chartOptions.color = this.color;
        chartOptions.valueGrid = this.valueGrid;
        chartOptions.categoryGrid = this.categoryGrid;
        
        var bars = {};
        var categorys = [];

        for (var i = 0, item; item = data[i]; i++) {
            var key = options.categoryField;
            categorys.push(item[key]);
            for (var j = 0; key = options.valueFields[j]; j++) {
                if (!bars[key]) {
                    bars[key] = [];
                }
                bars[key].push(item[key]);
            }
        }

        chartOptions.data = [];
        for (var i = 0, item; item = options.valueFields[i]; i++) {
            chartOptions.data.push(
                createBar(bars[item], options.valueTitles[i])
            );
        }

        chartOptions.categoryGrid[0].data = categorys;
        
        this.chart.setOption(chartOptions);
    };

    return {
        create: function (id, options, callback) {
            var obj = {
                width: options.width,
                height: options.height
            };

            chart.attachLoaded(id, function () {
                var barChart = new BarChart(chart.get(id), obj);

                callback.call(null, barChart);
            });
            chart.create(id, options);
        }
    };
});
