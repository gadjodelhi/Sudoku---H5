/**
 * @see http://www.google.com/support/forum/p/Google+Analytics/thread?tid=4f166221a4857871&hl=en
 */

var _gaq = _gaq || [];
var ga = true; // Google Analytics

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

if (document.location.search === '?ga=false' || readCookie('ga') === 'false') {
	createCookie('ga', 'false', 365);
	ga = false;
}

if (document.location.search === '?ga=true' || readCookie('ga') !== 'false') {
	eraseCookie('ga');
	ga = true;
}

ga && (function initGoogleAnalytics() {
	if (console && console.debug) {
		console.debug('ga');
	}
	_gaq.push(['_setAccount', 'UA-1191889-6']);
	
	var ref = document.referrer;
	if (ref.search(/(images|www)\.google\.([^\/]+)\/(images|imghp|imgres|imglanding)/) != -1 && ref.search(/prev/) != -1) {
		var regex = new RegExp("google\.([^\/]+)/.*&prev=([^&]+)&");
		var match = regex.exec(ref);

		_gaq.push(['_addOrganic','images.google.'+match[1],'q',true]);
		_gaq.push(['_setReferrerOverride', 'http://images.google.'+match[1]+unescape(match[2])]);
	}
	if (typeof _setCustomVar == 'function') {
		_setCustomVar();
	}
	_gaq.push(['_trackPageview']);

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function initArrowKeys() {
	var links, i, evs = [], rel;
	
	links = document.getElementsByTagName('link');
	if (links.length && links[0].getAttribute) {
		for(i=links.length-1; i>=0; i--) {
			rel = links[i].getAttribute('rel');
			if (rel === 'prev' || rel === 'next') {
				evs[rel == 'prev' ? 37 : 39] = links[i].getAttribute('href');
			}
		}
	}
	
	document.onkeyup = function (e) {
		if ((e = e || window.event || null) && (e.keyCode in evs)) {
			window.location = evs[e.keyCode];
		}
	};
}());

(function initDownloadLink() {
	var navs, strongs, img, a;
	
	function log(text) {
		if (typeof window.console !== 'undefined') {
			console.log(text);
		}
	}
	
	img = document.getElementById('photo');
	if (!img || (img.tagName !== 'img' && img.tagName !== 'IMG')) {
		return;
	}
	
	navs = document.getElementsByTagName('nav');
	if (!navs.length || navs[0].className !== 'breadcrumb') {
		return;
	}
	
	strongs = navs[0].getElementsByTagName('strong');
	if (!strongs.length) {
		return;
	}
	
	a = document.createElement('a');
	a.href = img.hasAttribute('data-big') ? img.getAttribute('data-big') : img.src;
	a.innerHTML = strongs[0].innerHTML;
	strongs[0].innerHTML = '';
	strongs[0].appendChild(a);
}());


(function timeToGo() {
	var serverTime = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(document.getElementsByTagName('html')[0].getAttribute('data-time'));
	var timeToGoDiv = document.getElementsByClassName ? document.getElementsByClassName('time-to-go')[0] : void 0;
	var launchDate = new Date(2011, 9, 12, 11, 5, 0);
	var launchDiff;
	var startDate = new Date();
	var startDiff = 0;
	var _s, _i, _h, _d;
	var content;
	
	if (!timeToGoDiv || !serverTime) {
		return;
	}
	
	content = timeToGoDiv.innerHTML;
	serverTime = new Date(serverTime[1], serverTime[2]-1, serverTime[3], serverTime[4], serverTime[5], serverTime[6]);
	launchDiff = launchDate - serverTime;

	(function show(diff) {
		diff = launchDiff - (new Date() - startDate);
	
		if (diff < 0) {
			timeToGoDiv.innerHTML = content;
			return;
		}
		
		diff = Math.floor(diff / 1000);
		_s = diff - Math.floor(diff / 60) * 60;
		diff = (diff - _s) / 60;
		_i = diff - Math.floor(diff / 60) * 60;
		diff = (diff - _i) / 60;
		_h = diff - Math.floor(diff / 24) * 24;
		diff = (diff - _h) / 24;
		_d = diff;
		
		timeToGoDiv.innerHTML = '<p>Odjazd za ' + _d + 'd ' + _h + 'h ' + _i + 'm ' + _s + 's</p>';
		
		setTimeout(show, 1000);
	}());
	
}());