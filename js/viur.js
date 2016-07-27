/**
 * VIUR JS FRAMEWORK
 * http://ignite.viur.is
 * https://github.com/viur-ignite/viur-ignite-js
 * Copyleft Mausbrand Infosys
 * Released under the GLP-3.0 license
 */


/**
 * PURE JS FUNCTIONS
 */
var root = function (base, decimals) {
	return Math.pow(base, 1 / decimals);
};
Math.root = Math.root || root;


function formatBytes (bytes, decimals) {
	if (bytes == 0) return '0 Byte';
	var k = 1000;
	var dm = decimals || 3;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



/**
 * jQuery extensions
 */
$(function() {
	// scroll to an element
	$.fn.scrollto = function (options) {
		options = $.extend({
			speed: 1000,
			easing: 'swing',
			onScrollStart: $.noop,
			onScrollEnd: $.noop
		}, options);

		// scroll only to the first element
		$this = $(this[0]);

		var thisTop = $this.offset().top;
		var bodyTop = $('body').offset().top;
		var place = thisTop - bodyTop;
	
		// need to avoid trigger callback twice, caused by the double animation of body,html	
		var triggeredStartCallback = triggeredEndCallback = false;
		
		$('html,body').animate({
			scrollTop: place
		}, {
			duration: options.duration,
			easing: options.easing,
			start: function() {
				if (!triggeredStartCallback) options.onScrollStart.call(null, $this, null);
				triggeredStartCallback = true;
			},
			complete: function() {
				if (!triggeredEndCallback) options.onScrollEnd.call(null, $this, null);
				triggeredStartCallback = true;
			}
		});

		return this;
	};

	// enable scroll anchor for an element
	$.fn.scrollAnchor = function (options) {
		this.on('click', function(e) {
			e.preventDefault();
			var $this = $(this);
			
			if (!!$this.data('target'))
				var target = $this.data('target');
			else if (!!$this.attr('href'))
				var target = $this.attr('href');
			else
				return console.error('No Scroll Target');
			
			return $(target).scrollto(options);
		});
	};
});



/*
function scrolltoPlace (place, duration, effect) {
	try {
		if (typeof place !== 'number') throw 'Invalid value "' + place + '" for scrolltoNode'
		duration = typeof duration === 'number' ? duration : 1000; 

		$('html,body').animate({
			scrollTop: place
		}, {
			duration: duration
		});

		return true;
	} 
	catch(e) {
		console.error(e);
		return false;
	}
}
*/
