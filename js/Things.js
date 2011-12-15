/**
 * @todo ctrl-z/ctrl-r nie dzialaja dobrze
 * @todo zamienic implements na createObject? uzyc defineProperty?
 * @todo komentarze, porzadek w kodzie
 * @todo w controls uzyc insertAdjacentHTML
 * @todo offline (manifest), zapisywanie gier (stan aktualny i poczatkowy)
 *
 * @todo pomyslec o frameworku dzialajacym na workerach
 * 
 * @todo galeria - potrzebny do tego serwer php
 */

"use strict";

var Things = new function Things() {
    this.register = function register(namespace, module) {
        var i, part, parts, parent = null, nsobject = this;
        parts = namespace.split('.');
        for (i = 0; i < parts.length; i++) {
            part = parts[i];
            nsobject[part] = nsobject[part] || {};
            parent = nsobject;
            nsobject = nsobject[part];
        }

        if (module.constructor === Function && module.name !== '') {
            nsobject[module.name] = module;
        }
        else {
            parent[part] = module;
        }
    };
};
