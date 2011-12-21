/*

jQuery plugins:

- removable (dodaje ikonke usuwania)
- insertable (dodaje nowy element do listy, taki sam jak ostatni, ale jest delatable ani draggable)
- editable (dodaje ikonke edycji)


Helpery:

postListData(url, listElement, dataGetter, callback)
postDataAndImages(url, data, files, callback)// create overlay etc (dialog)

*/

function command(name, args) {
	console.log(name, args);
	return true;
}

function createGalleryDialog() {
	var $fieldset = $('<form><fieldset><legend>Edycja galerii</legend></fieldset></form>').find('fieldset');
	
	$fieldset.append('<label for="category">Kategoria</label><select id="category" name="category"><option value="asia">Azja</option><option value="dance">Ze sceny</option><option value="mountains">Gory</option><option value="other">Roznosci</option><option value="hidden">Ukryta</option></select>');
	$fieldset.append('<label for="title">Tytul</label><input type="text" name="title" id="title" />');
	$fieldset.append('<label for="description">Opis</label><input type="text" name="description" id="description" />');
	$fieldset.append('<label for="id">ID</label><input type="text" name="id" id="id" />');
	$fieldset.append('<label for="big">990</label><input type="checkbox" name="big" id="big" value="1" />');
	
	return $fieldset.parent();
}

var $galleryDialog = createGalleryDialog();
var $photoDialog = $('<form>test</form>');

function gallerySave(callback) {
	console.log(this);
	callback({
		id: "ID",
		title: "TITLE",
		description: "DESCRIPTION",
		link: "LINK",
		thumbnail: "SRC",
		alt: "ALT"
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
	console.log('Saving photo...');
	callback({
		link: "LINK", 
		title: "TITLE",
		src: "SRC"
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

$('#galleries > ul').insertableList({
	dialog: $galleryDialog,
	onsave: gallerySave,
	createitem: galleryCreateItem
}).editableList({
	dialog: $galleryDialog,
	onsave: gallerySave,
	createitem: galleryCreateItem
}).removableList({
	onconfirm: function () {
		return confirm('Czy na pewno usunac galerie "' + $(this).find('img').attr('alt') + '"?');
	},
	onclick: function (callback) {
		command('removegallery', {
			id: this.id
		}) && callback();
	}
});