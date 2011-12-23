$.fn.crudable = function (options) {
	function initCrudableItem() {
		$(this)
			.prepend('<li class="crudable-insert">Dodaj element</li>')
			.addClass('crudable')
			.on('click', '.crudable-edit-icon', function () {
				editHandler.apply(this.parentNode, arguments);
			})
			.on('click', '.crudable-insert', editHandler)
			.on('click', '.crudable-remove-icon', function () {
				removeHandler.apply(this.parentNode, arguments);
			})
			.trigger('crudable.changed');
	}
	
	function changedHandler() {
		$('.crudable-edit-icon, .crudable-remove-icon', this).remove();
		$(this).children(':not(.crudable-insert)').addClass('crudable-item').append('<span class="crudable-edit-icon" />').append('<span class="crudable-remove-icon" />');
	}
	
	function removeHandler() {
		// this = li
		// event = click
		//
		
		var $li = $(this);
		
		$li.addClass('crudable-removing');
		if (options.beforeremove && options.beforeremove.constructor === Function) {
			if (!options.beforeremove.call(this)) {
				$(this).removeClass('crudable-removing');
				return;
			}
		}
		
		options.onremove.call(this, function () {
			$li.fadeOut(300, function () {
				this.parentNode.removeChild(this);
			});
		});
	}

	function editHandler() {
		// this = li
		// event = click
		//
		
		var $this = $(this);
		var dialog = options.dialog.constructor === Function ? options.dialog.call(this) : options.dialog;
		
		$this.addClass('crudable-editing');
		dialog.dialog({
			modal: true,
			buttons: {
				"Zapisz": function () {
					var $dialog = $(this);
					options.onsave.call(this, function (data) {
						var $parent = $this.parent();
						if ($this.is('.crudable-insert')) {
							$(options.createitem.call(this, data)).insertAfter($this);
						}
						else {
							$this.replaceWith(options.createitem.call(this, data));
						}
						$parent.trigger('crudable.changed');
						$dialog.dialog("destroy");
					}, $this);
				},
				"Anuluj": function () {
					$(this).dialog("destroy");
				}
			},
			onclose: function () {
				$this.removeClass('crudable-editing');
			},
			title: "Edycja"
		});
	}

	this.filter('ul, ol').not('.crudable').on('crudable.changed', changedHandler).each(initCrudableItem).sortable({
		items: '> :not(.crudable-insert)',
		update: function (event, ui) {
			options.onsort.call(this);
		}
	});
	return this;
};
