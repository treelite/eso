/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 折线图
 * @author cxl(c.xinle@gmail.com)
 */

define(function (require) {
    var chart = require('./chart');

    function createLine(data, name) {
        var scheme = {
            "itemRenderer": "baidu.dv.line.LineItemPoint",
            "itemStyles": {
                "emphasizedStyle": {
                    "lineColor": "#e247f4",
                    "lineThickness": "2",
                    "fillAlpha": "1",
                    "lineAlpha": "1",
                    "fillColor": "#ffffff",
                    "size": 5
                },
                "normalStyle": {
                    "lineColor": "#47bef4",
                    "lineThickness": "2",
                    "fillAlpha": "1",
                    "lineAlpha": "1",
                    "fillColor": "#ffffff",
                    "size": 4
                }
            },
            "areaStyle": {
                "lineColor": "#47bef4",
                "lineThickness": "2",
                "fillAlpha": "0.2",
                "lineAlpha": "1",
                "size": 4
            },

            //"stack": "group",
            "name": name,
            "type": "baidu.dv.area.AreaGraph",
            "tip": {
                "backgroundColor": "0xe247f4",
                "formatter": "${a}\n${c}\n${b}",
                "type": "single",
                "textStyle": {
                    "color": "0xffffff",
                    "fontSize": "14",
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

    function LineChart(chart, options) {
        this.chart = chart;

        this.color = [
            '0x47bef4',
            '0x25d16b',
            '0xfb7c00'
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
                    "length": 4
                },
                "axisLabel": {
                    "multiline": false,
                    "padding": 4,
                    "show": true,
                    "textStyle": {
                        "color": "#6b6b6b",
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
                    "show": true
                },
                "placement": "left",
                "splitNumber": 6
            }
        ];

        this.categoryGrid = [
            {
                "splitLine": {
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "#b5b5b5"
                    },
                    "show": true
                },
                "axisTick": {
                    "show": true,
                    "lineStyle": {
                        "thickness": "1",
                        "alpha": "1",
                        "color": "0xb5b5b5"
                    },
                    "length": 6
                },
                "axisLabel": {
                    "multiline": false,
                    "padding": 4,
                    "show": true,
                    "textStyle": {
                        "color": "#6b6b6b",
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
                    "show": true
                },
                "placement": "bottom"
            }
        ];
    }

    LineChart.prototype.setValue = function (data, options) {
        var chartOptions = {};

        chartOptions.config = this.config;
        chartOptions.color = this.color;
        chartOptions.valueGrid = this.valueGrid;
        chartOptions.categoryGrid = this.categoryGrid;
        
        var lines = {};
        var categorys = [];

        for (var i = 0, item; item = data[i]; i++) {
            var key = options.categoryField;
            categorys.push(item[key]);
            for (var j = 0; key = options.valueFields[j]; j++) {
                if (!lines[key]) {
                    lines[key] = [];
                }
                lines[key].push(item[key]);
            }
        }

        chartOptions.data = [];
        for (var i = 0, item; item = options.valueFields[i]; i++) {
            chartOptions.data.push(
                createLine(lines[item], options.valueTitles[i])
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
                var lineChart = new LineChart(chart.get(id), obj);

                callback.call(null, lineChart);
            });

            chart.create(id, options);
        }
    };
});
