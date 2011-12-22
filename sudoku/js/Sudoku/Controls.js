"use strict";

Things.register('Sudoku', function Controls(parentNode) {
    var document = parentNode.ownerDocument;
    var _newGameHandler;
    var _newGameButton;
    var _warningCheckbox;
    var _levelSelect;

    this.onNewGame = function onNewGame(handler) {
        _newGameHandler = handler;
    }    

    this.disableNewGameButton = function disableNewGameButton() {
        _newGameButton.disabled = true;
    };

    this.enableNewGameButton = function enableNewGameButton() {
        _newGameButton.disabled = false;
    };

    this.isWarningEnabled = function isWarningEnabled() {
        return _warningCheckbox.checked;
    };

    this.switchWarnings = function switchWarnings() {
        _warningCheckbox.checked = !_warningCheckbox.checked;
    };

    this.getLevel = function getLevel() {
        return _levelSelect.options[_levelSelect.selectedIndex].value;
    };

    this.increaseLevel = function increaseLevel() {
        if (_levelSelect.selectedIndex + 1 < _levelSelect.options.length) {
            _levelSelect.selectedIndex++;
        }
    };

    this.decreaseLevel = function decreaseLevel() {
        if (_levelSelect.selectedIndex > 0) {
            _levelSelect.selectedIndex--;
        }
    };

    function createNewGameButton() {
        _newGameButton = document.createElement('button');
        _newGameButton.setAttribute('type', 'button');
        _newGameButton.innerHTML = "Create a <u>n</u>ew puzzle";
        _newGameButton.addEventListener('click', function newGameClick() {
            if (_newGameHandler) {
                _newGameHandler();
            }
        }, false);
        parentNode.appendChild(_newGameButton);
    }

    function createWarningCheckbox() {
        var label = document.createElement('label');
        _warningCheckbox = document.createElement('input');
        label.innerHTML = "<u>W</u>arnings enabled";
        _warningCheckbox.setAttribute('type', 'checkbox');
        _warningCheckbox.setAttribute('checked', 'checked');
        label.appendChild(_warningCheckbox);
        parentNode.appendChild(label);
    }

    function createLevelSelect() {
        var i, label = document.createElement('label');
        label.innerHTML = "<u>L</u>evel";
        _levelSelect = document.createElement('select');
        for (i = 1; i <= 8; i++) {
            _levelSelect.add(new Option(i, Math.pow(2, i) - 1));
        }
        label.appendChild(_levelSelect);
        parentNode.appendChild(label);
    }

    createNewGameButton();
    createLevelSelect();
    createWarningCheckbox();
});
