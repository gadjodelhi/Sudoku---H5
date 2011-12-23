/*

jQuery plugins:

- removable (dodaje ikonke usuwania)
- insertable (dodaje nowy element do listy, taki sam jak ostatni, ale jest delatable ani draggable)
- editable (dodaje ikonke edycji)


Helpery:

postListData(url, listElement, dataGetter, callback)
postDataAndImages(url, data, files, callback)// create overlay etc (dialog)

*/

function command(name, args, callback, sync) {
	$.ajax('/admin/php/admin.php', {
		async: sync === true ? false : true,
		cache: false,
		data: {
			command: name,
			data: JSON.stringify(args)
		},
		dataType: 'json',
		type: 'POST',
		error: function () {
			alert('Server error');
		},
		success: function (data) {
			if (!data) {
				alert('Empty response');
			}
			else if (data.type === 'success') {
				callback(data.result);
			}
			else if (data.type === 'error' && data.error) {
				alert(data.error);
			}
			else {
				alert("Unknown response: " + JSON.stringify(data));
			}
		}
	});
}

function createGalleryDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja galerii</legend></fieldset></form>').find('fieldset');
	var currentDesc, $this = $(this);
	
	$fieldset.append('<label for="category">Kategoria</label><select id="category" name="category"><option value="asia">Azja</option><option value="dance">Ze sceny</option><option value="mountains">Gory</option><option value="other">Roznosci</option><option value="hidden">Ukryta</option></select>');
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	$fieldset.append('<label for="description">Opis</label><input type="text" name="description" id="description" />');
	$fieldset.append('<label for="id">ID</label><input type="text" name="id" id="id" />');
	$fieldset.append('<label for="index">Indeks</label><select id="index" name="index"><option value="1">Pokaz</option><option value="0">Ukryj</option></select>');
	$fieldset.append('<label for="big">990</label><select id="big" name="big"><option value="">Auto</option><option value="1">Yes</option><option value="false">Hide</option></select>');
	$fieldset.append('<label for="path">Sciezka</label><input type="text" name="path" id="path" />');
	$fieldset.append('<label for="date">Data wydarzenia</label><input type="text" name="date" id="date" />');
	$fieldset.append('<label for="published">Data opublikowania</label><input type="text" name="published" id="published" />');
	$fieldset.append('<label for="password">Haslo</label><input type="text" name="password" id="password" />');
	
	$fieldset.find("#title").on("change", function () {
		var self = this;
		$('#id, #path', this.form).each(function () {
			this.value = this.value || $.trim(self.value).replace(/ +/, '-');
		});
	});
	
	$fieldset.find('#date, #published').datepicker({
		dateFormat: "yy-mm-dd",
		showOtherMonths: true,
		selectOtherMonths: true,
		showButtonPanel: true
	});
	
	$fieldset.find(':input', $fieldset).each(function () {
		$(this).val($this.data(this.id));
	});
	
	if (!$this.data('id')) {
		$fieldset.find('#published').val((new Date()).getFullYear() + '-' + ((new Date()).getMonth()+1) + '-' + (new Date()).getDate());
	}
	
	return $fieldset.parent();
}

function createPhotoDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja zdjecia</legend></fieldset></form>').find('fieldset');
	var $this = $(this);
	
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	
	$fieldset.find(':input', $fieldset).each(function () {
		$(this).val($this.data(this.id));
	});
	return $fieldset.parent();
}

function gallerySave(callback, $item) {
	var $this = $(this), data = {
		originalid: $item.attr('id')
	};
	$this.find(':input').each(function () {
		data[this.id] = $(this).val(); 
	});
	command('editgallery', data, callback);	
}

function galleryCreateItem(data) {
	var $item = $('<li><a><strong /><img width="160" height="160" /></a></li>');
	$item
		.attr('id', data.id)
		.data('id', data.id)
		.data('published', data.published)
		.data('title', data.title)
		.data('description', data.description)
		.data('big', data.big)
		.data('category', data.category)
		.data('index', data.index)
		.data('path', data.path)
		.data('date', data.date)
		.data('password', data.password)
		.find('strong')
		.html(data.title + "<br />" + data.description);
	$item
		.find('a')
		.attr('href', data.link);
	$item
		.find('img')
		.attr('src', data.thumbnail)
		.attr('alt', data.title);
	return $item;
}

function photoSave(callback, $item) {
	command('editphoto', {
		gallery: $item.parent().data('galleryId'),
		image: $item.data('image'),
		title: $('#title', this).val(),
		originallink: $item.find('a').attr('href') // workaround
	}, callback);	
}

function photoCreateItem(data) {
	var $item = $('<li><a><img /></a></li>');
	$item
		.data('title', data.title)
		.data('image', data.image)
		.find('a')
		.attr('href', data.link)
		.attr('title', data.linktitle)
		.find('img')
		.attr('src', data.imgsrc)
		.attr('alt', data.imgtitle);
	return $item;
}

function sortPhotos(gallery) {
	var result = false, data = {
		gallery: gallery,
		order: []
	};
	$(this).children(':not(.crudable-insert)').each(function () {
		data.order.push($(this).data('image'));
	});
	command('sortphoto', data, function () {
		result = true;
	}, true);
	return result;
}


$('#galleries > ul').crudable({
	dialog: createGalleryDialog,
	onsave: gallerySave,
	createitem: galleryCreateItem,
	beforeremove: function () {
		return confirm('Czy na pewno usunac galerie "' + $(this).find('img').attr('alt') + '"?');
	},
	onremove: function (callback) {
		command('removegallery', {
			id: this.id
		}, callback);
	}
});


$('ul.photoindex').crudable({
	dialog: createPhotoDialog,
	onsave: photoSave,
	createitem: photoCreateItem,
	beforeremove: function () {
		return confirm('Czy na pewno usunac zdjecie "' + $(this).find('img').attr('alt') + '"?');
	},
	onremove: function (callback) {
		command('removephoto', {
			gallery: $(this).parent().data('galleryId'),
			image: $(this).data('image')
		}, callback);
	},
	onsort: function () {
		return sortPhotos.call(this, $(this).data('galleryId'));
	}
});