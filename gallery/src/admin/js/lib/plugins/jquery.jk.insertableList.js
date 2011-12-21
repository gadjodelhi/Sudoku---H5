/**
 * options: editorMethod, onsave
 */
$.fn.insertableList = function () {
	function initInsertableList() {
	}
	
	this.filter('ul, ol').each(initInsertableList);
	return this;
};

