/** 
 * ActionCaller - part of the H5 framework
 * http://h5framework.com
 *
 * @author Jacek Karczmarczyk <jacek@karczmarczyk.pl>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @copyright Copyright © 2011, Jacek Karczmarczyk
 *
 */ 

"use strict";

/**
 * Instance of the ActionCaller class can call the action defined in the 
 * worker file. Result is returned to the calling object after the message
 * from the worker is received, ActionCaller object calls the callback
 * method provided to the caall method with result as the only parameter.
 * 
 * @param {String} filename Name of the worker javascript file
 * @param {Mixed} defaultContext The default context of the callback method. Is used when no callback is provided to the action call
 * @param {Array} actions Array of action names to be registered
 *
 */
function ActionCaller(filename, defaultContext /* = undefined */, actions /* = undefined */) {
    var worker = new WorkerMethodCaller(filename);
    
    /**
     * Creates the {action}Action method and stores the action method
     * returned by the _createActionMethod method
     * 
     * @param {String} action Name of the action
     * @public
     * 
     */
    this.register = function (action) {
        if (this[action + 'Action']) {
            throw "Action " + action + " already registered";
        }
        
        this[action + "Action"] = _createActionMethod(action);
    };
    
    /**
     * Returns the default action caller context
     * 
     * @return {Mixed} Default action caller context
     * @public
     *
     */
    this.getDefaultContext = function () {
        return defaultContext;
    };
    
    /**
     * Calls the actions
     * 
     * @param {String} action Name of the action
     * @param {Mixed} data DData that will be sent to action worker
     * @param {Function} callback Function that will be executed after received result from the action
     * @param {Mixed} context Context of callback function, if not provided the default context will be used
     * @public
     *
     */
    this.call = function (action, data, callback, context) {
        _createActionMethod(action).apply(this, Array.prototype.slice.call(arguments, 1));
    };
    
    /**
     * Returns the method which will be called when action is called
     * 
     * @param {String} action Name of the action
     * @private
     */
    function _createActionMethod(action) {
        return function actionMethod(data, callback, context) {
            var workerData = {
                action: action,
                data: data
            };
            
            // Removes additional parameters from the callback call (like
            // messageId)
            //
            var callbackFn = function (result) {
                callback.call(this, result);
            };
            
            // When context is provided but has false value (null/undefined/...)
            // if will be used as context anyway. To use default context only
            // 2 parameters should be provided to the actionMethod function
            //
            var realContext = arguments.length < 3 ? defaultContext : context;

            worker.sendMessage(workerData, callbackFn, realContext);
        };
    }
    
    if (actions && actions.length) {
        for (var i = 0; i < actions.length; i++) {
            this.register(actions[i]);
        }
    }
}