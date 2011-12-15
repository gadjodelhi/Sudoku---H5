"use strict";

Things.register('Sudoku', function Game(parent) {
    var document = parent.ownerDocument;
    var self = this;
    var commander = new Things.Core.Commander(self);
    var worker;
    var workerCallback;
            
    var _running; 
    var _charTable;
    var _fields;

    // Layout elements
    //
    var _sudokuDiv;
    var _boardDiv;
    var _cursor = {x: 4, y: 4};
    var _controls;

    commander.registerCommands({
        cmdNewGame: function cmdNewGame(callback) {
            if (isRunning() && !confirm("Are you sure you want to cancel current puzzle?")) {
                callback();
                return;
            }

            _controls.disableNewGameButton();

            // Create a new puzzle
            //
            workerCallback = callback;
            worker.postMessage(_controls.getLevel());
        },

        cmdSetUserValue: function cmdSetUserValue(value, callback) {
            self.setUserValueAndCursor(value, _cursor.x, _cursor.y);
            callback();
        },

        cmdRemoveUserValue: function cmdRemoveUserValue(callback) {
            self.setUserValueAndCursor(null, _cursor.x, _cursor.y);
            callback();
        }
    });
    
    function validateUserValue(x, y, value) {
        var i, x0 = Math.floor(x/3)*3, y0 = Math.floor(y/3)*3, collisions = [];
        for (i = 0; i < 9; i++) {
            if (i !== x && _fields[y][i] === value) {
                collisions.push({
                    x: i, 
                    y: y
                });
            }
            if (i !== y && _fields[i][x] === value) {
                collisions.push({
                    x: x, 
                    y: i
                });
            }

            if (x0 + i % 3 !== x && y0 + Math.floor(i/3) !== y && _fields[y0 + Math.floor(i/3)][x0 + i % 3] === value) {
                collisions.push({
                    x: x0 + i % 3, 
                    y: y0 + Math.floor(i/3)
                });
            }
        }

        return collisions;
    }

    this.getUserValueAndCursor = function getUserValueAndCursor() {
        if (!isRunning()) {
            return null;
        }
        return {
            value: _fields[_cursor.y][_cursor.x],
            cursor: {
                x: _cursor.x,
                y: _cursor.y
            }
        }
    };
    
    this.setUserValueAndCursor = function setUserValueAndCursor(value, x, y) {
        var collisions = [];
        if (isRunning() && !_charTable.getCell(x, y).classList.contains('initial')) {
            if (value && _controls.isWarningEnabled()) {
                collisions = validateUserValue(_cursor.x, _cursor.y, value);
            }

            if (collisions.length) {
                showCollisions(collisions);
            }
            else {
                _fields[y][x] = value;
                redrawBoard();
                if (value && isSolved()) {
                    _sudokuDiv.classList.add('solved');
                    _running = false;
                }
            }
        }
    };
    
    commander.setStateCallback('cmdSetUserValue', function getState(callback) {
        callback(this.getUserValueAndCursor());
    }, function restoreState(lastState, callback) {
        this.setUserValueAndCursor(lastState.value, lastState.cursor.x, lastState.cursor.y);
        callback();
    });
    
    function redrawBoard() {
        _charTable.setChars(_fields);
    }
    
    function isSolved() {
        var x, y;
        for (x = 0; x < 9; x++) {
            for (y = 0; y < 9; y++) {
                if (!_fields[y][x] || validateUserValue(x, y, _fields[y][x]).length) {
                    return false;
                }
            }
        }
        return true;
    }

    function isRunning() {
        return _running;
    }

    function setCursor(x, y) {
        _cursor.x = Math.min(Math.max(x, 0), 8);
        _cursor.y = Math.min(Math.max(y, 0), 8)
        _charTable.addClass(_cursor.x, _cursor.y, 'cursor', true);
    }
    
    function hideHoverCursor() {
        _boardDiv.classList.remove('hoverCursorVisible');
    }

    function showHoverCursor() {
        _boardDiv.classList.add('hoverCursorVisible');
    }

    function showCollisions(collisions) {
        var i, j;
        for (i = 0; i < collisions.length; i++) {
            (function (element) {
                element.$sudokuBlinkingField = element.$sudokuBlinkingField || 0;
                for (j = 0; j < 3; j++) {
                    window.setTimeout(function () {
                        element.classList.add('collision');
                        element.$sudokuBlinkingField++;
                    }, 300*j);
                    window.setTimeout(function () {
                        if (!--element.$sudokuBlinkingField) {
                            element.classList.remove('collision');
                        }
                    }, 300*j+150);
                }
            }(_charTable.getCell(collisions[i].x, collisions[i].y)));
        }
    }
    
    function bindKeys() {
        var kbd = new Things.Core.Keyboard(function callback(/* event, arg1, ... */) {
            commander.execute.apply(this, Array.prototype.slice.call(arguments, 1));
            return false;
        });

        kbd.bind('delete', 'cmdRemoveUserValue');
        kbd.bind('backspace', 'cmdRemoveUserValue');
        kbd.bind('n', 'cmdNewGame');
        kbd.bind('ctrl+z', function () {
            commander.undo();
            return false;
        });
        kbd.bind('ctrl+r', function () {
            commander.redo();
            return false;
        });
        kbd.bind('[1-9]', function (event) {
            commander.execute('cmdSetUserValue', event.keyCode - 48);
            return false;
        });
        kbd.bind('arrow-down', function cmdMoveCursorDown() {
            setCursor(_cursor.x, _cursor.y + 1);
            hideHoverCursor();
            return false;
        });
        kbd.bind('arrow-up', function cmdMoveCursorUp() {
            setCursor(_cursor.x, _cursor.y - 1);
            hideHoverCursor();
            return false;
        });
        kbd.bind('arrow-left', function cmdMoveCursorLeft() {
            setCursor(_cursor.x - 1, _cursor.y);
            hideHoverCursor();
            return false;
        });
        kbd.bind('arrow-right', function cmdMoveCursorRight() {
            setCursor(_cursor.x + 1, _cursor.y);
            hideHoverCursor();
            return false;
        });
        kbd.bind('w', _controls.switchWarnings.bind(_controls));
        kbd.bind('l', _controls.increaseLevel.bind(_controls));
        kbd.bind('shift+l', _controls.decreaseLevel.bind(_controls));
    }

    (function __constructor() {
        var container = document.createElement('div');
        var layout = '\n\
<div class="sudoku">\n\
    <div class="panel">\n\
        <div class="controls"></div>\n\
        <div class="help">\n\
            <dl>\n\
                <dt>Arrows</dt>\n\
                <dd>Move the cursor</dd>\n\
                <dt>1-9</dt>\n\
                <dd>Puts the number in the cell</dd>\n\
                <dt>N</dt>\n\
                <dd>Starts new game</dd>\n\
                <dt>L</dt>\n\
                <dd>Increases the level</dd>\n\
                <dt>Shift-L</dt>\n\
                <dd>Decreases the level</dd>\n\
                <dt>W</dt>\n\
                <dd>Toggles warnings</dd>\n\
            </dl>\n\
        </div>\n\
    </div>\n\
    <div class="board hoverCursorVisible"></div>\n\
</div>';
        container.innerHTML = layout;
        
        _sudokuDiv = container.querySelector('.sudoku');
        _boardDiv = container.querySelector('.board');
        
        worker = new Worker('js/Sudoku/GeneratorWorker.js');
        worker.addEventListener('message', function (event) {
            _running = true;
            _fields = event.data;
            _sudokuDiv.classList.remove('solved');
            redrawBoard();
            _charTable.clearClass('initial').addClassToNonEmptyElements('initial');
            _controls.enableNewGameButton();
            workerCallback();
        }, false);
        worker.addEventListener('error', function (event) {
           alert("Error in " + event.filename + " (line " + event.lineno + "): " + event.message);
           workerCallback();
        });

        _controls = new Things.Sudoku.Controls(container.querySelector('.controls'));
        _controls.onNewGame(function () {
            commander.execute('cmdNewGame');
        });

        _charTable = new Things.Sudoku.CharTable(_boardDiv, 9, 9);
        _charTable.addCellsListener('click', setCursor);
        redrawBoard();

        bindKeys();
        document.addEventListener('mousemove', showHoverCursor, false);

        setCursor(4, 4);
        parent.appendChild(_sudokuDiv);
    }());        
});
