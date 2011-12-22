"use strict";

(function () {
    Things.register('Core', function Keyboard(defaultCallback) {
        var _defaultCallback = defaultCallback;
        if (arguments.length && defaultCallback && defaultCallback.constructor !== Function) {
            throw "Default callback should be a function";
        }
        
        this.bind = function bind(key, callback) {
            var args;
            
            if (!arguments.length) {
                throw "Key must be defined";
            }
            
            if (!jwerty || !jwerty.key) {
                throw "jwerty object is not defined";
            }
            
            if (callback && callback.constructor === Function) {
                args = Array.prototype.slice.call(arguments, 2);
            }
            else if (defaultCallback) {
                args = Array.prototype.slice.call(arguments, 1);
                callback = _defaultCallback;
            }
            else {
                throw "Callback should be a function or default callback should be defined";
            }
            
            jwerty.key(key, function jwertyCallback(event) {
                var callbackArgs = args.slice();
                callbackArgs.unshift(event);
                return callback.apply(this, callbackArgs);
            });
        };
    });
}());