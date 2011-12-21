/**
 * options: onedit, onsave
 */
$.fn.editableList = function (options) {
	function initEditableList() {
		$(this).addClass('jk-editablelist-list').on('click', '.jk-editablelist-edit-icon', function () {
			editHandler.apply(this.parentNode, arguments);
		}).trigger('jk.changed');
	}
	
	function changedHandler() {
		$('.jk-editablelist-edit-icon', this).remove();
		$(this).children().addClass('jk-editablelist-item').append('<span class="jk-editablelist-edit-icon" />');
	}
	
	function editHandler() {
		// this = li
		// event = click
		//
		
		var $this = $(this);
		
		$this.addClass('jk-editablelist-editing');
		options.dialog.dialog({
			modal: true,
			buttons: {
				"Zapisz": function () {
					var $dialog = $(this);
					options.onsave.call(this, function (data) {
						var $parent = $this.parent();
						$this.replaceWith(options.createitem.call(this, data))
						$parent.trigger('jk.changed');
						$dialog.dialog("close");
					});
				},
				"Anuluj": function () {
					$(this).dialog("close");
				}
			},
			onclose: function () {
				$this.removeClass('jk-editablelist-editing');
			},
			title: "Edycja"
		});
	}

	this.filter('ul, ol').on('jk.changed', changedHandler).each(initEditableList);
	return this;
};
