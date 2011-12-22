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

var H5 = function H5(namespace) {
    var part, parts = namespace.split('.'), ns = H5;
    while (parts.length > 1) {
        part = parts.shift();
        ns = ns[part] = ns[part] || {};
    }
    return ns;
}

H5.register = function register(namespace, object) {
    var part, parts = namespace.split('.'), ns = H5;
    while (parts.length > 1) {
        part = parts.shift();
        ns = ns[part] = ns[part] || {};
    }

    ns[part] = object;
};
