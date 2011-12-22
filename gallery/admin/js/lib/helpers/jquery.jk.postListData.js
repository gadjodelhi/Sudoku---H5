"use strict";

$.postListData = function (url, listElement, dataGetter, callback) {
	var data = [];
	$(listElement).children('li').each(function () {
		var itemData = dataGetter.call(this);
		if (itemData) {
			data.push(itemData);
		}
	});
	$.ajax({
		url: url,
		data: {
			data: JSON.stringify(data)
		},
		async: true,
		method: 'post',
		success: callback,
		error: function () {
			alert('Blad');
		}
	});
}

