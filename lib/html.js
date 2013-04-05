/**
 * ESO —— A optimizer for ESL
 *
 * @file html处理
 * @author cxl(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');

function find(dir, suffix, htmls) {
    var files = fs.readdirSync(dir);

    files.forEach(function(item) {
        if (item.charAt(0) == '.') {
            return;
        }

        var fPath = path.resolve(dir, item);
        var stat = fs.statSync(fPath);

        var extName;
        if (stat.isFile() && (extName = path.extname(item))) {
            extName = extName.substring(1);
            if (suffix.indexOf(extName) >= 0) {
                htmls.push(fPath);
            }
        }
        else if (stat.isDirectory()) {
            find(fPath, suffix, htmls);
        }
    });
}

function parseHTML(file) {
    var source = fs.readFileSync(file, 'utf8');

    var res = {name: path.basename(file)};
    res.source = source;

    // 正则匹配JS 
    // 很不靠谱的....
    res.jsModules = [];
    var str = source.split(/<\/?script[^>]*>/);
    var js = [];
    for (var i = 1; i < str.length; i += 2) {
        if (str[i]) {
            js.push(str[i]);
        }
    }
    js.join('').replace(
        /\brequire\s*\(\s*\[([^\]]+)\]/g, 
        function ($0, $1) {
            $1 = $1.replace(/["']/g, '').split(/\s*,\s*/);
            res.jsModules = res.jsModules.concat($1);
        }
    );

    return res;
}

function handle(str) {
    return str;
}

function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
}

/**
 * 处理所有的html文件
 * 
 */
exports.handle = function (config) {
    var js = require('./js');
    var css = require('./css');

    var htmls = [];
    var entryOptions = config.entry;
    var suffix = entryOptions.suffix || ['html'];
    suffix.join('|');

    find(entryOptions.src, suffix, htmls);
    htmls.forEach(function (item) {
        var code = parseHTML(item);

        if (code.jsModules && code.jsModules.length > 0) {
            var jsOptions = extend({}, config);
            jsOptions.modules = code.jsModules;
            js.combine(jsOptions);
        }

        if (code.css && code.css.length > 0) {
            var cssOptions = extend({}, config);
            cssOptions.css = code.css;
            css.combine(cssOptions);
        }

        code.source = handle(code.source, config);

        var dir = entryOptions.out || config.outDir;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        
        var file = path.resolve(dir, code.name);
        fs.writeFileSync(file, code.source, 'utf8');
    });
};
