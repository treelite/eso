/**
 * lxb 离线宝
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 首页
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var apps = require('./apps');
    var dailyReport = require('./dailyReport');
    var notices = require('./notices');

    var pieChart = require('../common/pieChart');
    var lineChart = require('../common/lineChart');
    var barChart = require('../common/barChart');

    return {
        enter: function (userType) {
            dailyReport.init();
            apps.init(userType);
            notices.init();

            pieChart.create(
                'pieChart', 
                {
                    width: 220,
                    height: 200,
                    container: 'chart1'
                },
                function (chart) {
                    chart.setValue([
                        {label: '北京', value: 30}, 
                        {label: '上海', value: 50}, 
                        {label: '成都', value: 20}
                    ]);
                }
            );

            var datasource = [
                {date: '2012-3-01', beijing: 100, shanghai: 212, chengdu: 98},
                {date: '2012-3-02', beijing: 110, shanghai: 202, chengdu: 198},
                {date: '2012-3-03', beijing: 130, shanghai: 112, chengdu: 208},
                {date: '2012-3-04', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-05', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-06', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-07', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-08', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-09', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-10', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-11', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-12', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-13', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-14', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-15', beijing: 120, shanghai: 312, chengdu: 321},
                {date: '2012-3-16', beijing: 180, shanghai: 210, chengdu: 78}                    
            ];

            lineChart.create(
                'lineChart', 
                {
                    width: 600,
                    height: 250,
                    container: 'chart2'
                },
                function (chart) {
                    chart.setValue(
                        datasource,
                        {
                            categoryField: 'date',
                            valueFields: ['beijing', 'shanghai', 'chengdu'],
                            valueTitles: ['北京', '上海', '成都']
                        }
                    );
                }
            );

            barChart.create(
                'barChart', 
                {
                    width: 600,
                    height: 250,
                    container: 'chart3'
                },
                function (chart) {
                    chart.setValue(
                        datasource,
                        {
                            categoryField: 'date',
                            valueFields: ['beijing', 'shanghai', 'chengdu'],
                            valueTitles: ['北京', '上海', '成都']
                        }
                    );
                }
            );
        }
    };
});
