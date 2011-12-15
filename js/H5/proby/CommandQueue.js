/** 
 * CommandQueue - part of the H5 framework
 * http://h5framework.com
 *
 * @author Jacek Karczmarczyk <jacek@karczmarczyk.pl>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @copyright Copyright © 2011, Jacek Karczmarczyk
 *
 */ 

"use strict";

// Co sie stalo z isBlockable?
function CommandQueue(defaultContext) {
    var self = this;
    var commands = {};
    var queue = [];
    var busy = false;
    var actionCallers = {};


    var defaultCommandOptions = {
        blocking: true,
        blockable: true,
        queueable: true,
        stackable: true
    };
    var emptyObject = {};
    function Command(actionCaller, action, initialOptions) {
        var options = {};

        this.getActionCaller = function getActionCaller() {
            return actionCaller;
        };

        this.getAction = function getAction() {
            return action;
        };

        this.setOption = function setOption(option, value) {
            if (this.getDefaultOption(option) === undefined) {
                throw "Invalid option name (" + option + ")";
            }
            options[option] = value;
        };

        this.setOptions = function setOptions(options) {
            var option;
            for (option in options) {
                this.setOption(option, options[option]);
            }
        };

        this.getDefaultOption = function getDefaultOption(option) {
            return emptyObject.hasOwnProperty(option) ? undefined : defaultCommandOptions[option];
        };

        this.getOption = function getOption(option) {
            return options.hasOwnProperty(option) ? options[option] : this.getDefaultOption(option);
        };

        this.setOptions(initialOptions);
    }


    this.registerActionCaller = function registerActionCaller(name, actionCaller) {
        if (actionCallers[name]) {
            throw "Action caller " + name + "already registered";
        }
        
        actionCallers[name] = actionCaller;
    };

    this.registerCommand = function registerCommand(command, actionCaller, action, options) {
        if (commands[command]) {
            throw "Command " + command + "already registered";
        }
        
        commands[command] = new Command(actionCaller, action, options);
    };
    
    this.call = function call(command, data, callback, context) {
        var commandArguments = Array.prototype.slice.apply(arguments);

        // If the 4th parameter (context) is not provided use the default context.
        // If it's provided but has false value (null, undefined, ...) it will be
        // used as a context
        //
        if (commandArguments.length <= 3) {
            commandArguments[3] = _getCommandContext(command, context);
        }
        
        
        if (commands[command].getOption('queueable') && _isBusy()) {
            _pushOnQueue.apply(this, commandArguments);
            return true;
        }
        else if (!_isBusy()) {
            _execute.apply(this, commandArguments);
            return true;
        }
        return false;
    };
    
    this.undo = function () {
        throw "To be implemented";
    };
    
    this.redo = function () {
        throw "To be implemented";
    };
    
    
    function _isBusy() {
        return busy;
    }    

    function _setBusy(state) {
        busy = !!state;
    }
    
    function _getDefaultContext() {
        return defaultContext;
    }
    
    function _doCall(command, data, callback, context) {
        var actionCaller = commands[command].getActionCaller();
        var action = commands[command].getAction();
        actionCaller.call(action, data, function (result) {
            _setBusy(false);
            callback.call(context, result);
            if (queue.length) {
                _execute.apply(self, queue.shift());
            }
        }, context);
    }
    
    function _pushOnQueue(command, data, callback, context) {
        queue.push(arguments);
    }
    
    function _getCommandContext(command, context) {
        return context || commands[command].getActionCaller().getDefaultContext() || _getDefaultContext();
    }
    
    function _execute(command, data, callback, context) {
        if (commands[command].getOption('blocking')) {
            _setBusy(true);
        }
        
        if (commands[command].getOption('stackable') && commands[command].getOption('onGetState')) {
            self.getState(command, (function (_arguments) {
                return function getStateCallback() {
                    _doCall.apply(self, _arguments);
                }
            }(arguments)));
        }
        else {
            _doCall.apply(self, arguments);
        }
    }
}