"use strict";

Things.register('Core', (function () {
    function Command(method) {
        var onGetState, onRestoreState;

        this.setStateCallback = function setStateCallback(getStateCallback, restoreStateCallback) {
            onGetState = getStateCallback;
            onRestoreState = restoreStateCallback;
            return this;
        };

        this.getState = function getState(context, callback) {
            if (onGetState) {
                onGetState.call(context, callback);
            }
            else {
                callback();
            }
        };

        this.restoreState = function restoreState(context, state, callback) {
            if (onRestoreState) {
                onRestoreState.call(context, state, callback);
            }
            else {
                callback();
            }
        };

        this.execute = function execute(context, args, callback) {
            var argsCopy = args.slice();
            argsCopy.push(callback);
            method.apply(context, argsCopy);
        };
    }

    return function Commander(context) {
        var commands = {};
        var commandQueue = [];
        var stack = [];
        var stackIndex = 0;
        var busy = false;
        var self = this;

        /**
         * Registers the name of the command (and optionally sets the 
         * alternative method to be called on command execution
         * 
         * @param {String} name Command name
         * @param {Function} method Command function (optional)
         * @return {Command} Command object
         */
        this.registerCommand = function registerCommand(name, method) {
            if (commands.hasOwnProperty(name)) {
                throw "Command '" + name + "' already registered";
            }

            commands[name] = new Command(arguments.length >= 2 ? method : context.constructor.prototype[name]);
            return this;
        };

        this.registerCommands = function registerCommands(commands) {
            var command;
            for (command in commands) {
                this.registerCommand(command, commands[command]);
            }
        };

        /**
         * Sets the getState and restoreState callbacks
         * 
         * @param {String} command Command name
         * @param {Function} getStateCallback Callback function for getting context object's state
         * @param {Function} restoreStateCallback Callback function for restoring context object's state
         * @return {Commander} Self object
         */
        this.setStateCallback = function setStateCallback(command, getStateCallback, restoreStateCallback) {
            commands[command].setStateCallback(getStateCallback, restoreStateCallback);
            return this;
        };

        /**
         * Stores the context's state (if method for storing state is
         * provided), executes the command and stores info in undo stack
         * 
         * @param {String} command Command name
         */
        this.execute = function execute(command/**, arg1, ...*/) {
            var commandArguments = Array.prototype.slice.call(arguments, 1);

            if (!commands.hasOwnProperty(command)) {
                throw "Unknown command: " + command;
            }

            if (busy) {
                commandQueue.push(arguments);
                return;
            }

            busy = true;
            commands[command].getState(context, function afterGetStateCallback(state) {
                _storeStateAndDoExecute(state, command, commandArguments);
            });
        };

        /**
         * Undos the last executed command (restores the state from before
         * command execution)
         * 
         */
        this.undo = function undo() {
            var last = stack[stackIndex - 1];
            if (!busy && last) {
                busy = 1;
                commands[last.command].restoreState(context, last.state, function afterRestoreStateCallback() {
                    busy = 0;
                    stackIndex--;
                });
            }
        };

        /**
         * Executes the undoed command once again
         * 
         */
       this.redo = function redo() {
            var args;
            if (stackIndex < stack.length) {
                args = stack[stackIndex].args;
                args.unshift(stack[stackIndex].command);
                stackIndex++;

                this.execute.apply(this, args);
            }
        };
        
        function _storeStateAndDoExecute(state, command, args) {
            // Undefined state means that the command shouldn't be added to the stack
            //
            if (state !== void 0) {
                // Clean redo stack if the new command is different then undoed
                //
                if (stackIndex < stack.length && (stack[stackIndex].args.toString() !== args.toString() || stack[stackIndex].command !== command)) {
                    stack = stack.splice(0, stackIndex);
                }
                
                // Store command parameters on undo stack
                //
                stack[stackIndex++] = {
                    command: command, 
                    args: args,
                    state: state
                };
            }
            
            commands[command].execute(context, args, function afterExecuteCallback() {
                busy = false;
                if (commandQueue.length) {
                    self.execute.apply(self, commandQueue.shift());
                }
            });
        }
    };
}()));
