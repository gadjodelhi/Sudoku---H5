"use strict";

Things.register('Sudoku', (function () {
    function CharTable(parentNode, sizeX, sizeY) {
        var _sizeX = sizeX;
        var _sizeY = sizeY;
        var _node;
        var document = parentNode.ownerDocument;
        var self = this;
        
        /**
         * Returns the number of columns
         * 
         * @return {Number} Number of columns
         */
        this.getSizeX = function () {
            return _sizeX;
        };
        
        /**
         * Returns the number of rows
         * 
         * @return {Number} Number of rows
         */
        this.getSizeY = function () {
            return _sizeY;
        };
        
        /**
         * Returns create HTML node, throws exception if node is not created
         * 
         * @return {HTMLTableElement}
         */
        this.getNode = function () {
            if (!_node) {
                throw "Node not created";
            }
            
            return _node;
        };
        
        /**
         * Removes the table from the document
         * 
         * @return {CharTable} Self object
         */
        this.remove = function () {
            _node.parentNode.removeChild(_node);
            _node = null;
            return this;
        };
        
        /**
         * Create HTML node, does not append it to the document
         * 
         * @return {HTMLTableElement}
         */
        (function __constructor() {
            var tbody = document.createElement('tbody'), x, y, row, cell;
            
            _node = document.createElement('table');
            _node.setAttribute('class', 'charTable');
            _node.appendChild(tbody);
            for(y = 0; y < self.getSizeY(); y++) {
                row = document.createElement('tr');
                for (x = 0; x < self.getSizeX(); x++) {
                    cell = document.createElement('td');
                    row.appendChild(cell);
                }
                tbody.appendChild(row);
            }
            parentNode.appendChild(_node);
        }());
    };

    /**
     * Returns the cell at position xy
     * 
     * @param {Number} x Column number (starting from 0)
     * @param {Number} y Row number (starting from 0)
     * @return {CharTable} Self object
     */
    CharTable.prototype.getCell = function (x, y) {
        return this.getNode().querySelector('tr:nth-child(' + (y + 1) + ') > td:nth-child(' + (x + 1) + ')');
    };

    /**
     * Sets the char on position xy
     * 
     * @param {Number} x Column number (starting from 0)
     * @param {Number} y Row number (starting from 0)
     * @param {String} chr Char
     * @return {CharTable} Self object
     */
    CharTable.prototype.setChar = function (x, y, chr) {
        if (chr === null || chr === undefined) {
            chr = '';
        }
        if (chr.constructor !== String) {
            chr = chr.toString();
        } 
        this.getCell(x, y).innerHTML = chr.length ? chr[0] : '';
        return this;
    };

    /**
     * Sets the chars in the whole row
     * 
     * @param {Number} y Row number (starting from 0)
     * @param {Array} rowChars Chars for the row
     * @return {CharTable} Self object
     */
    CharTable.prototype.setRowChars = function (y, rowChars) {
        var i;
        for (i = 0; i < this.getSizeX(); i++) {
            this.setChar(i, y, rowChars ? rowChars[i] : null);
        }
        return this;
    };

    /**
     * Sets the chars in the whole table
     * 
     * @param {Array} chars Array of array of chars
     * @return {CharTable} Self object
     */
    CharTable.prototype.setChars = function(chars) {
        var i;
        for (i = 0; i < this.getSizeY(); i++) {
            this.setRowChars(i, chars ? chars[i] : null);
        }
        return this;
    };

    /**
     * Adds class to the cell on positon x y
     * 
     * @param {Number} x Column number (starting from 0)
     * @param {Number} y Row number (starting from 0)
     * @param {String} className Class name
     * @param {Boolean} only If true then this class will be removed for other cells
     * @return {CharTable} Self object
     */
    CharTable.prototype.addClass = function (x, y, className, only) {
        var elements;
        if (only === true) {
            elements = this.getNode().getElementsByClassName(className);
            while (elements.length) {
                elements[0].classList.remove(className);
            }
        }
        this.getCell(x, y).classList.add(className);
        return this;
    };

    CharTable.prototype.removeClass = function (x, y, className) {
        this.getCell(x, y).classList.remove(className);        
        return this;
    };
    
    CharTable.prototype.clearClass = function (className) {
        var x, y;
        for (x = 0; x < this.getSizeX(); x++) {
            for (y = 0; y < this.getSizeY(); y++) {
                this.removeClass(x, y, className);
            }
        }
        return this;
    };

    CharTable.prototype.addClassToNonEmptyElements = function (className) {
        var i, cells = this.getNode().getElementsByTagName('td');
        for (i = cells.length - 1; i >= 0; i--) {
            if (cells[i].innerHTML !== '') {
                cells[i].classList.add(className);
            }
            else {
                cells[i].classList.remove(className);
            }
        }
        return this;
    };
    
    CharTable.prototype.addCellsListener = function (eventName, handler) {
        this.getNode().addEventListener(eventName, function (event) {
            var element = event.target, x = 0, y = 0;
            if (element.constructor !== HTMLTableCellElement) {
                return;
            }

            while (element.previousElementSibling) {
                x++;
                element = element.previousElementSibling;
            }

            element = element.parentNode;
            while (element.previousElementSibling) {
                y++;
                element = element.previousElementSibling;
            }

            handler.call(this, x, y);
        }, false);
    }

    return CharTable;
}()));
