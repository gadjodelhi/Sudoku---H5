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

H5.register("Message.Sender", function H5MessageSender(messageStrategy, receiverStrategy) {
    var nextCallbackId = 1;
    
    /**
     * Sends the data to the worker as well as the message id which will
     * be used as a pointer to the callback method which should be 
     * called after the result is received from the worker
     * 
     * @public
     */
    this.sendMessage = function sendMessage() {
        var parameters = messageStrategy.createParameters(nextCallbackId, arguments);
        var receiverCallback = function receiverCallback(messageId, result) {
            parameters.callback.call(parameters.context, result, messageId);
        };

        receiverStrategy.sendMessage(nextCallbackId, messageStrategy.createMessage(parameters.message), receiverCallback);
        nextCallbackId++;
    };
});

