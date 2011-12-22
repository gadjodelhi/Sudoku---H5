"use strict";

Things.register('Sudoku', function Generator() {
    /**
     * Creates the puzzle with given level of difficulty
     * 
     * @return {Array} Array of arrays of fields' values (1-9)
     * 
     */
    this.generate = function generate() {
        var fields;
        
        function doIt() {
            var x, 
                y, 
                numbers, 
                fields = [
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null]
                ];

            for (y = 0; y < 9; y++) {
                for (x = 0; x < 9; x++) {
                    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    while (numbers.length) {
                        fields[y][x] = Things.Core.Array.popRandom(numbers);

                        if (checkValue(x, y, fields)) {
                            break;
                        }
                        if (!numbers.length) {
                            return null;
                        }
                    }
                }
            }

            return fields;
        }
        
        while (!(fields = doIt()));
        return fields;
    };
    
    this.generate2 = function generate() {
        var x, 
            y,
            index = 0,
            fields = [
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null]
            ], 
            candidates = [[1, 2, 3, 4, 5, 6, 7, 8, 9]];

        while (index < 81) {
            x = index % 9;
            y = Math.floor(index / 9);
            
            if (!candidates[index].length) {
                fields[y][x] = null;
                --index;
            }
            else {
                fields[y][x] = Things.Core.Array.popRandom(candidates[index]);
                if (checkValue(x, y, fields)) {
                    candidates[++index] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                }
            }
        }
        
        return fields;
    };

    function checkValue(x, y, fields) {
        var ix, iy, numbers;

        // Check row
        //
        numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (ix = 0; ix < 9; ix++) {
            if (fields[y][ix] && numbers[fields[y][ix]]++) {
                return false;
            }
        }

        // Check column
        //
        numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (iy = 0; iy < 9; iy++) {
            if (fields[iy][x] && numbers[fields[iy][x]]++) {
                return false;
            }
        }

        // Check square
        //
        numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        x = Math.floor(x/3)*3;
        y = Math.floor(y/3)*3
        for (ix = x; ix < x + 3; ix++) {
            for (iy = y; iy < y + 3; iy++) {
                if (fields[iy][ix] && ++numbers[fields[iy][ix]] > 1) {
                    return false;
                }
            }
        }

        return true;
    }
});
