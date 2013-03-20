define(function (require, exports, module) {
    var a = require('../a/base');

    exports.sayHello = function (id, name) {
        a.g(id).innerHTML = 'hello ' + name;
    };
});
