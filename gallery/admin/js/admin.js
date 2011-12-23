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
			alert('Error');
		},
		success: function (data) {
			callback(data);
		}
	});
}

function createGalleryDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja galerii</legend></fieldset></form>').find('fieldset');
	
	$fieldset.append('<label for="category">Kategoria</label><select id="category" name="category"><option value="asia">Azja</option><option value="dance">Ze sceny</option><option value="mountains">Gory</option><option value="other">Roznosci</option><option value="hidden">Ukryta</option></select>');
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	$fieldset.append('<label for="description">Opis</label><input type="text" name="description" id="description" />');
	$fieldset.append('<label for="id">ID</label><input type="text" name="id" id="id" />');
	$fieldset.append('<label for="big">990</label><input type="checkbox" name="big" id="big" value="1" />');
	
	$fieldset.find("#title").on("change", function () {
		if ($('#id', $fieldset).val() === '') {
			$('#id', $fieldset).val($.trim(this.value).replace(/ +/, '-'));
		}
	});
	
	return $fieldset.parent();
}

function createPhotoDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja zdjecia</legend></fieldset></form>').find('fieldset');
	
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	
	return $fieldset.parent();
}

var $galleryDialog = createGalleryDialog();
var $photoDialog = createPhotoDialog();

function gallerySave(callback) {
	var data = {};
	data.id = $('#id', this).val();
	data.title = $('#title', this).val();
	data.description = $('#description', this).val();
	data.category = $('#category', this).val();
	data.big = $('#big', this).val();
	
	//debug
	data.link = '/' + data.id;
	data.thumbnail = 'thumbnail';
	data.alt = data.title;
	
	command('pass', data, function (result) {
		if (result && result.id) {
			callback(result);
		}
		else {
			alert("Blad podczas zapisu galerii");
		}
	});	
}

function galleryCreateItem(data) {
	var $item = $('<li><a><strong /><img width="160" height="160" /></a></li>');
	$item
		.attr('id', data.id)
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
	dialog: $galleryDialog,
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
	dialog: $photoDialog,
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