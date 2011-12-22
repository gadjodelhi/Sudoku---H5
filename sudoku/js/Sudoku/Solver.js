"use strict";

(function () {
    function Set(initial) {
        var values = {}, length = 0;
        
        this.getValues = function () {
            var i, result = [];
            for(i in values) {
                (i in {}) || result.push(values[i]); // do not add methods added to Object prototype
            }
            return result;
        };
        
        this.contains = function (value) {
            return values.hasOwnProperty(value) && !(value in {});
        };
        
        this.add = function (value) {
            if (!this.contains(value)) {
                values[value] = value;
                length++;
            }
        };
        
        this.remove = function (value) {
            if (this.contains(value)) {
                delete values[value];
                length--;
                if (!length) {
                    throw "Invalid sudoku";
                }
            }
        };
        
        this.getLength = function () {
            return length;
        }
        
        if (initial) {
            for (length = initial.length - 1; length >= 0; length--) {
                values[initial[length]] = initial[length];
            }
            length = initial.length;
        }
    }
    
    Things.register('Sudoku', function Solver() {
        var solution;
        
        this.solve = function solve(fields) {
            function _() {
                var x, y, result = [[], [], [], [], [], [], [], [], []];
                for (x = 0; x < 9; x++) {
                    for (y = 0; y < 9; y++) {
                        result[y][x] = solution[y][x].getValues().toString();
                    }
                }
                return result;
            }
            
            
            init();
            applyGivenNumbers(fields);
            
            lookForSingletons();
            if (solved()) {
                return getSolution();
            }
            
            pairs();
            if (solved()) {
                return getSolution();
            }
            
            eliminateBadGuesses();
            if (solved()) {
                return getSolution();
            }
            
            ifAllElseFails();

            return getSolution();
        };

        function solved() {
            var x, y;
            for (x = 0; x < 9; x++) {
                for (y = 0; y < 9; y++) {
                    if (solution[y][x].length !== 1) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        function getSolution() {
            var x, y, array = [[], [], [], [], [], [], [], [], []];
            each(function (x, y) {
                if (solution[y][x].getLength() !== 1) {
                    throw "Sudoku solution cannot be found";
                }
                array[y][x] = solution[y][x].getValues()[0]; 
            });
            return array;
        }

        function init() {
            var x, y;
            solution = [
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
                [null, null, null, null, null, null, null, null, null], 
            ];
            for(y = 0; y < 9; y++) {
                for (x = 0; x < 9; x++) {
                    solution[y][x] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                }
            }
        }
        
        function each(method) {
            var x, y;
            for (x = 0; x < 9; x++) {
                for (y = 0; y < 9; y++) {
                    method(x, y);
                }
            }
        }
        
        function debug(array) {
            var x, y, str = [], substr, values;
            for (y = 0; y < 9; y++) {
                substr = [];
                for (x = 0; x < 9; x++) {
                    values = '';
                    if (array[y][x] && array[y][x].constructor === Set) {
                        array[y][x].getValues().forEach(function (value) {
                            values += value.toString();
                        });
                    }
                    else {
                        values = array[y][x];
                    }
                    substr.push(values);
                }
                str.push('[' + substr.toString() + ']');
            }
            console.log(str.toString());
        }
        
        function applyGivenNumbers(fields) {
            each(function (x, y) {
                var i, x0 = Math.floor(x/3)*3, y0 = Math.floor(y/3)*3;
                for (i = 0; i < 9; i++) {
                    if (x !== i ) {
                        solution[y][x].remove(fields[y][i]);
                    }
                    if (y !== i ) {
                        solution[y][x].remove(fields[i][x]);
                    }
                    if (x0 + i % 3 !== x && y0 + Math.floor(i/3) !== y) {
                        solution[y][x].remove(fields[y0 + Math.floor(i/3)][x0 + i % 3]);
                    }
                    if (fields[y][x] && i+1 !== fields[y][x]) {
                        solution[y][x].remove(i+1);
                    }
                }
            });
        }
        
        function lookForSingletons() {
            var i, x, y, anyRemoved, frequency, values, singletons;
            do {
                anyRemoved = false;
                singletons = [
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                    [null, null, null, null, null, null, null, null, null], 
                ];
                
                for (x = 0; x < 9; x++) {
                    frequency = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (y = 0; y < 9; y++) {
                        values = solution[y][x].getValues();
                        for (i = 0; i < values.length; i++) {
                            frequency[values[i]-1]++;
                        }
                    }
                    
                    for (i = 1; i <= 9; i++) {
                        if (frequency[i-1] === 1) {
                            for (y = 0; y < 9; y++) {
                                if (solution[y][x].contains(i) && solution[y][x].getLength() > 1) {
                                    singletons[y][x] = i;
                                    anyRemoved = true;
                                }
                            }
                        }
                    }
                }
                
                applyGivenNumbers(singletons);
                each(function (x, y) {
                    if (solution[y][x].getLength() === 1) {
                        singletons[y][x] = solution[y][x].getValues()[0];
                    }
                });
                applyGivenNumbers(singletons);
            } while (anyRemoved);
        }
        
        function pairs() {
            
        }
        
        function eliminateBadGuesses() {
            
        }
        
        function ifAllElseFails() {
            
        }
    });
}());