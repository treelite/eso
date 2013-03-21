/**
 * @file  A optimizer for ESL
 * @author cxl(c.xinle@gmail.com)
 */

var path = require('path');
var fs = require('fs');
var util = require('util');
var esprima = require('esprima');

// 默认的config参数
var config = {
        baseUrl: './',
        out: 'main.js',
        name: 'main',
        optimize: false,
        paths: {}
    };

// 待解析模块列表（moduleId数组）
var needParseList = [];

// 解析后的源码集合
// [{moduleId, deps, body}..]
var code = [];

// 关键词
var SYNTAX = esprima.Syntax;

var SYNTAX_DEFINE = 'define';
var SYNTAX_REQUIRE = 'require';
var SYNTAX_EXPORTS = 'exports';
var SYNTAX_MODULE = 'module';

/**
 * debug日志 
 * 默认的日志输出
 *
 * @param {string} msg 日志信息
 */
function log(msg) {
    util.debug('[ESO] ' + msg);
}

/**
 * 组合代码写入文件
 */
function combine() {
    var res = [];
    var item;

    while (item = code.pop()) {
        var str = [];
        var moduleId = item.moduleId;
        str.push("define('" + moduleId + "'");
        str.push(JSON.stringify(item.deps));
        str.push('function ('+ SYNTAX_REQUIRE +', '+ SYNTAX_EXPORTS +', '+ SYNTAX_MODULE +') ');
        // TODO: 代码处理前还需要去除注释, 防止注释中含有define导致替换错误
        var content = item.body.replace(/\bdefine\s*\([^{]*/, str.join(', '));
        res.push(content);
    }
    res = res.join('\n');

    fs.writeFile(
        config.out, 
        res,
        function (error) {
            if (error) {
                config.onerror(error);
            }
            else {
                config.onsuccess();
            }
        }
    );
}

/**
 * 解析文件的AST 
 * 递归寻找requeire的调用
 * 
 * @param {Object} item 语法单元
 * @param {Object} res 解析结果 需要require的模块信息
 *  @param {Array} res.moduleId 模块Id
 *  @param {Array} res.deps 依赖的模块
 */
function parseAST(item, res) {
    if (!item) {
        return;
    }

    if (item.type == SYNTAX.CallExpression) {
        var callee = item.callee.name;
        var args = item.arguments;
        if (callee == SYNTAX_REQUIRE) {
            var value = args[0].value;
            // 插件加载不进行合并
            if (value && value.charAt(0) != '!') {
                // 将require的模块保存到依赖中
                res.deps.push(value);
            }
        }
        else if (callee == SYNTAX_DEFINE) {
            // 虽然参数有明确的先后顺序，但是每个参数类型都不同 
            // 所以在解析的时候就忽略参数的位置了 考类型的区分
            args.forEach(function (o, i) {
                // define的参数是string的话认为是moduleId
                if (typeof o == 'string') {
                    res.moduleId = o;
                }
                else if (util.isArray(o)) {
                    res.deps = res.deps.concat(o);
                }
                else {
                    parseAST(o, res);
                }
            });
        }
        else {
            parseAST(item.arguments, res);
        }
    }
    else if (util.isArray(item)) {
        item.forEach(function (o, i) {
            parseAST(o, res);
        });
    }
    else if (typeof item === 'object') {
        for (var key in item) {
            if (item.hasOwnProperty(key)) {
                parseAST(item[key], res);
            }
        }
    }
}

/**
 * 判断模块是否已经存在
 *
 * @param {string} moduleId 模块Id
 */
function isExistModule(moduleId) {
    var res = false;
    // 在待解析列表中查找
    for (var i = 0, item; item = needParseList[i]; i++) {
        if (moduleId == item.moduleId) {
            res = true;
            break;
        }
    }

    // 在已解析代码中查找
    for (var i = 0, item; item = code[i]; i++) {
        if (item.moduleId == moduleId) {
            res = true;
            break;
        }
    }

    return res;
}

/**
 * 是否是 绝对的 ModuleId
 *
 * @param {string} moduleId
 * @return {boolean}
 */
function isAbsolute(moduleId) {
    return moduleId.charAt(0) == '/' || moduleId.indexOf('http') == 0;
}

/**
 * 是否是 相对的 ModuleId
 *
 * @param {string} moduleId
 * @return {boolean}
 */
function isRelative(moduleId) {
    return moduleId.charAt(0) == '.';
}

/**
 * 反向匹配paths
 *
 * @param {string} moduleId
 * @return {string} 匹配后的moduleId
 */
function unMatchPaths(moduleId) {
    for (var key in config.paths) {
        var value = config.paths[key];
        if (value == moduleId) {
            moduleId = key;
            break;
        }
    }

    return moduleId;
}

/**
 * 匹配paths配置
 *
 * @param {string} moduleId
 * @return {string} 匹配后的moduleId
 */
function matchPaths(moduleId) {
    var prefix = '';
    for (var key in config.paths) {
        if (moduleId.indexOf(key) == 0 && key.length > prefix.length) {
            prefix = key;
        }
    }

    if (prefix) {
        moduleId = moduleId.replace(prefix, config.paths[prefix]);
    }

    return moduleId;
}

/**
 * 解析文件
 * 文件读取后的回调，获取当前模块的依赖并继续读取下一个待加载的文件
 *
 * @param {string} moduleId 模块
 */
function parseFile(moduleId, data) {
    var content = esprima.parse(data).body;
    var res = {deps: []};
    parseAST(content, res);

    moduleId = res.moduleId ? res.moduleId : unMatchPaths(moduleId);
    code.push({
        moduleId: moduleId,
        deps: res.deps[0] == SYNTAX_REQUIRE 
                ? res.deps 
                : [SYNTAX_REQUIRE, SYNTAX_EXPORTS, SYNTAX_MODULE].concat(res.deps),
        body: data
    });

    res.deps.forEach(function (item, index) {
        if (item == SYNTAX_REQUIRE || item == SYNTAX_EXPORTS || item == SYNTAX_MODULE) {
            return;
        }

        if (isRelative(item)) {
            item = path.normalize(path.dirname(moduleId) + '/' + item);
        }
        else if (!isAbsolute(item)) {
            // paths 配置处理
            item = matchPaths(item);
        }

        if (!isAbsolute(item) && !isExistModule(item)) {
            needParseList.push({
                moduleId: item,
                from:   moduleId
            });
        }
    });
    readFile();
}

/** 
 * 读取源码
 */
function readFile() {
    var module = needParseList.shift();
    if (!module) {
        combine();
        return;
    }

    var moduleId = module.moduleId;
    var src = path.normalize(config.baseUrl + '/' + moduleId + '.js');
    if (!fs.existsSync(src)) {
        config.onerror('can not find ' + src + ' in ' + module.from);
    }
    else {
        config.onmessage('parse ' + src);
        fs.readFile(
            src, 
            'utf8', 
            function (error, data) {
                if (error) {
                    config.onerror(error);
                }
                else {
                    parseFile(moduleId, data);
                }
            }
        );
    }
}

/**
 * 合并源码
 *
 * @param {Object} options 选项
 *  @param {string} options.baseUrl
 *  @param {string} options.name 入口模块的moduleId 
 *  @param {string} options.out 输出的文件路径（包含文件后缀）
 *  @param {boolean} options.optimize 是否启用压缩
 *  @param {Object.<string, string>} options.paths paths配置项
 *  @param {Function(string)} options.onerror 合并错误事件
 *  @param {Function(string)} options.onmessage 消息事件
 *  @param {Function(string)} options.onsuccess 合并成功事件
 */
exports.combine = function (options) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            config[key] = options[key];
        }
    }

    config.onerror = config.onerror || log;
    config.onsuccess = config.onsuccess || log;
    config.onmessage = config.onmessage || log;

    needParseList.push({
        moduleId: config.name,
        from: 'main'
    });
    readFile();
};
