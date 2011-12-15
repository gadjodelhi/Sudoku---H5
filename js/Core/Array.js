"use strict";

Things.register('Core.Array', {
    popRandom: function popRandom(array) {
        var rnd, pop;
        rnd = Math.floor(Math.random() * array.length);
        if (rnd === array.length - 1) {
            return array.pop();
        }

        pop = array[rnd];
        array[rnd] = array.pop();
        return pop;
    }
});
