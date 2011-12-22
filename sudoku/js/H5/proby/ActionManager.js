/** 
 * ActionManager - part of the H5 framework
 * http://h5framework.com
 *
 * @author Jacek Karczmarczyk <jacek@karczmarczyk.pl>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @copyright Copyright © 2011, Jacek Karczmarczyk
 *
 */ 

"use strict";

importScripts("WorkerMethodManager.js");

/**
 * 
 * @param {Worker} self Worker process
 * @param {Object} initialActions Actions dictionary {action: action method}
 * @todo Add class description
 */
function ActionManager(self, initialActions) {
    var actions = [];
    
    /**
     * Registers the action - stores the action method in the dictionary
     * 
     * @param {String} action Name of the action
     * @param {Function} method Method to be called on action call
     * @public
     * 
     */
    this.register = function (action, method) {
        if (actions[action]) {
            throw "Action " + action + " already registered";
        }
        
        actions[action] = method;
    };
    
    // Creates listener for the message coming to the worker, data in the
    // message is an object with fields:
    // - action - name of the action to be called
    // - data - data that should be passed to the action method
    //
    // Result of the action is returned to the calling process by calling the
    // callback method (second parametr of the action method. See
    // WorkerMethodManager for details.
    //
    new WorkerMethodManager(self, function actionListener(data, callback) {
        actions[data.action](data.data, callback);
    });
    
    if (arguments.length > 1) {
        for (var action in initialActions) {
            this.register(action, initialActions[action]);
        }
    }
}
