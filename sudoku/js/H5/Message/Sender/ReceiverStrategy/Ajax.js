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

H5.register("Message.Sender.ReceiverStrategy.Ajax", function H5MessageSenderReceiverStrategyAjax(url) {
    this.sendMessage = function sendMessage(messageId, message, callback) {
        var xhr = new XMLHttpRequest();
        var xhrMessage = this.createXHRMessage(message);

        xhr.open('post', url);
        xhr.send(xhrMessage);
        xhr.onreadystatechange = function (response, request, status) {
            // @todo Implement little bit more
            callback(messageId, response);
        };
    };
    
    this.sendResult = function sendResult(result) {
        // Implementacja za pomoca node.js (server side)
        var http;
        http.sendResponse(JSON.stringify(result));
    };
    
    this.createXHRMessage = function createXHRMessage(message) {
        var i, resultArray = [];
        for (i in message) {
            resultArray.push(i + '=' + encode(message[i]));
        }
        return resultArray.join('&');
    }
});

