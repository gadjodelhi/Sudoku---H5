importScripts('../Things.js');
importScripts('../Core/Array.js')
importScripts('Generator.js');
importScripts('Solver.js');

var generator = new Things.Sudoku.Generator();
var solver = new Things.Sudoku.Solver();
var global = this;


/**
 * Adds an event handler that generates a puzzle after getting a message
 * 
 */
function main() {
    global.addEventListener("message", function (event) {
        var fields;
        fields = generator.generate();
        //fields = generator.generate2();
        hideFields(fields, event.data); // event.data == level
        global.postMessage(fields);
    }, false);
}

/**
 * Hides some fields on the board
 * 
 * @param {Array} fields Board with all fields visible
 * @param {Number} level 1 - easiest, 255 - hardest
 */
function hideFields(fields, level) {
    var x, y, candidates = [], lastRemoved;

    for (x = 0; x < 9; x++) {
        for (y = 0; y < 9; y++) {
            candidates.push({x: x, y: y, value: fields[y][x]});
        }
    }

    level = Math.min(Math.max(Math.floor(level >>> 0), 1), 255);
    while (level && candidates.length) {
        lastRemoved = Things.Core.Array.popRandom(candidates);
        fields[lastRemoved.y][lastRemoved.x] = null;
        try {
            solver.solve(fields);
        }
        catch (e) {
            fields[lastRemoved.y][lastRemoved.x] = lastRemoved.value;
            level--;
        }
    }
}

main();

