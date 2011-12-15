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

H5.register("Message.Receiver", function H5MessageReceiver(context, receiverStrategy) {
    var currentMessageId = null;
    var queue = [];
   
    function processMessage(message) {
        context[message.method].call(context, message.data, function (result) {
            receiverStrategy.sendResult(result);
        });
    }
   
    if (arguments.length < 3) {
        sequential = true;
    }

    function _callNextHandler() {
        if (queue.length) {
            _callHandler(queue.shift());
        }
    }

    function _callHandler(event) {
        currentMessageId = event.data.messageId;
        handler(event.data.data, function (result) {
            self.postMessage({
                messageId: event.data.messageId,
                data: result
            });
            currentMessageId = null;
            if (sequential) {
                _callNextHandler();
            }
        });
    }

    self.addEventListener('message', function (event) {
        if (sequential && currentMessageId) {
            queue.push(event);
        }
        else {
            _callHandler(event);
        }
    });

    self.addEventListener('error', function (event) {
        if (currentMessageId) {
            self.postMessage({
                messageId: currentMessageId,
                error: event.message
            });
            currentMessageId = null;
            _callNextHandler();
        }
    });
});
