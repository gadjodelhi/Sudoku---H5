/** 
 * WorkerMethodCaller - part of the H5 framework
 * http://h5framework.com
 *
 * @author Jacek Karczmarczyk <jacek@karczmarczyk.pl>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @copyright Copyright © 2011, Jacek Karczmarczyk
 *
 */ 

"use strict";

/**
 * Usage:
 * 
 * var wp = new WorkerMethodCaller("file.js");
 * wp.sendMessage({some: data}, function (result, messageId) {
 *     console.log(result);
 *     this.doSomething(); // this === object
 * }, object);
 * 
 * @param {String} filename Name of the worker js file
 * @todo Add class description
 * 
 */
function WorkerMethodCaller(filename) {
    var worker = new Worker(filename);
    var callbacks = {};
    var nextCallbackId = 1;
    
    /**
     * Sends the data to the worker as well as the message id which will
     * be used as a pointer to the callback method which should be 
     * called after the result is received from the worker
     * 
     * @param {Mixed} data Data passed to the worker
     * @param {Function} callback Callback method called after receiving the result
     * @param {Mixed} context Context of the callback method
     * @return {Number} Message id
     * @public
     */
    this.sendMessage = function (data, callback, context) {
        var messageId = nextCallbackId++;
        
        callbacks[messageId] = function (data) {
            callback.call(context, data, messageId);
        };
        
        worker.postMessage({
            messageId: messageId,
            data: data
        });
        
        return messageId;
    };

    // Adds listener to the worker that listens for the message containing
    // the result of the method. After the result is received the callback
    // function is called with two parameters: result and message id.
    //
    worker.addEventListener('message', function (event) {
        var messageId = event.data.messageId;
        callbacks[messageId](event.data.data);
        delete callbacks[messageId];
    }, false);
}
