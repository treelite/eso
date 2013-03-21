define(function (require, exports, module) {
    var b = require('../b/base');
    var a = require('base');
    
    exports.enter = function (id, name) {
        var ele = a.g(id);

        if (ele) {
            b.sayHello(id, name);
        }
        else {
            alert('can not find DOM:' + id);
        }
    };
});
