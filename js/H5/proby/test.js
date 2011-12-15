importScripts("ActionManager.js");

var ac = new ActionManager(this, {
    timeout: function (data, callback) {
        setTimeout(function () {
            test();
            callback(data);
        }, data);
    }
});

