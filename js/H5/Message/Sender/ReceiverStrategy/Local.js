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

H5.register("Message.Sender.ReceiverStrategy.Local", function H5MessageSenderReceiverStrategyLocal(receiver, caller) {
    this.sendMessage = function sendMessage(messageId, message, callback) {
        receiver.processMessage(message, function resultCallback(result) {
            callback(messageId, result);
        });
    };
    
    this.sendResult = function sendResult(messageId, result) {
        
    };
});

