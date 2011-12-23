/*

jQuery plugins:

- removable (dodaje ikonke usuwania)
- insertable (dodaje nowy element do listy, taki sam jak ostatni, ale jest delatable ani draggable)
- editable (dodaje ikonke edycji)


Helpery:

postListData(url, listElement, dataGetter, callback)
postDataAndImages(url, data, files, callback)// create overlay etc (dialog)

*/

function command(name, args, callback) {
	$.ajax('/admin/php/admin.php', {
		async: true,
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
	$fieldset.append('<label for="date">Data opublikowania</label><input type="text" name="published" id="published" />');
	
	$fieldset.find("#title").on("change", function () {
		var self = this;
		$('#id, #path', this.form).each(function () {
			this.value = this.value || $.trim(self.value).replace(/ +/, '-');
		});
	});
	
	$fieldset.find(':input', $fieldset).each(function () {
		$(this).val($this.data(this.id));
	});
	
	return $fieldset.parent();
}

function createPhotoDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja zdjecia</legend></fieldset></form>').find('fieldset');
	
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	
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
		.data('big', data.big)
		.data('category', data.category)
		.data('title', data.title)
		.data('description', data.description)
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

function photoSave(callback) {
	var data = {};
	data.title = $('#title', this).val();
	
	//debug
	data.link = 'link';
	data.src = 'test';
	
	command('editphoto', data, function (result) {
		if (result && result.id) {
			callback(result);
		}
		else {
			alert("Blad podczas zapisu zdjecia");
		}
	});	
}

function photoCreateItem(data) {
	var $item = $('<li><a><img /></a></li>');
	$item
		.find('a')
		.attr('href', data.link)
		.attr('title', data.title)
		.find('img')
		.attr('src', data.src)
		.attr('alt', data.title);
	return $item;
}

function sort(what, gallery) {
	var data = {
		gallery: gallery,
		order: []
	};
	$(this).children(':not(.crudable-insert)').each(function () {
		data.order.push(this.id);
	});
	command(what + 'sort', data);
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
	},
	onsort: function () {
		sort.call(this, 'gallery');
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
			id: this.id
		}, callback);
	},
	onsort: function () {
		sort.call(this, 'photo', $(this).data('galleryId'));
	}
});