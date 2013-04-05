define(function (require, exports, module) {
    var a = require('base');

    exports.sayHello = function (id, name) {
        a.g(id).innerHTML = 'hello ' + name;
    };
});
