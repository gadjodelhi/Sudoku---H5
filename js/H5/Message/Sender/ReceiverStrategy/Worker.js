/** 
 * Part of the H5 framework
 * http://h5framework.com
 *
 * @author Jacek Karczmarczyk <jacek@karczmarczyk.pl>
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 * @copyright Copyright © 2011, Jacek Karczmarczyk
 *
 */ 

"use strict";

H5.register("Message.Sender.ReceiverStrategy.Worker", function H5MessageSenderReceiverStrategyWorker(filename, self) {
    var worker = new Worker(filename);
    var callbacks = {};

    this.sendMessage = function sendMessage(messageId, message, callback) {
        callbacks[messageId] = callback;
        worker.postMessage({
            messageId: messageId,
            message: message
        });
    };
    
    this.sendResult = function sendResult(messageId, result) {
        self.postMessage({
            messageId: messageId,
            result: result
        });
    };


    // Adds listener to the worker that listens for the message containing
    // the result of the method. After the result is received the callback
    // function is called with two parameters: result and message id.
    //
    worker.addEventListener('message', function messageListener(event) {
        var messageId = event.data.messageId;
        callbacks[messageId](messageId, event.data.data);
        delete callbacks[messageId];
    }, false);
});

