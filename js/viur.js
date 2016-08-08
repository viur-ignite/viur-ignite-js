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
				triggeredEndCallback = true;
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


	// popup
	$.fn.popup = function (options) {
		options = $.extend({
			toggleClass: 'is-active',
			overlayClass: 'popup-overlay',
			onOpen: $.noop,
			onClose: $.noop
		}, options);

		if (! $(this).elementExist() ) {
			console.error('element doesnt exist');
			return false;
		}

		// use only to the first element
		$this = $(this[0]);

		// open popup
		__open();

		// close on X-click
		$this.find('.popup-close').on('click', __close);

		function __open () {
			$('.' + options.overlayClass).addClass(options.toggleClass); // overlay show
			$this.addClass(options.toggleClass); // popup show
			options.onOpen.call(null, $this, null);
		}

		function __close () {
			$('.' + options.overlayClass).removeClass(options.toggleClass); // overlay hide
			$this.removeClass(options.toggleClass); // popup hide
			options.onClose.call(null, $this, null);
		}

		return this;
	};


	// create new popup
	$.createPopup = function (options) {
		options = $.extend({
			title: 'MESSAGE',
			content: 'THIS IS MY MESSAGE',
			footer: '',
			button: [
				{title:'Close', class: "popup-close"},
			],
			onopen: $.noop,
			onClose: $.noop
		}, options);

		// create overlay if doesnt exist
		if (! $('.popup-overlay').elementExist() )
			$('body').append('<div class="popup-overlay"></div>');

		// remove other popups
		$('.popup').remove();


		var button = '';
		if (Array.isArray( options.button )) {
			options.button.forEach(function(val, key) {
				if (typeof options.button[key].onClick === 'undefined') options.button[key].onClick = $.noop;

				if(!!val.custom) {
					button += val.custom;
				} else {
					button += __getButtonPrototype()
						.replace('{{class}}', !!val.class ? val.class : '')
						.replace('{{style}}', !!val.style ? val.style : '')
						.replace('{{index}}', key)
						.replace('{{title}}', !!val.title ? val.title : '');
				}
			})
		}

		var popup = __getPopupPrototype()
			.replace('{{header}}', options.title)
			.replace('{{content}}', options.content)
			.replace('{{button}}', button)
			.replace('{{footer}}', options.footer);

		var $popup = $(popup)
			.popup({onOpen: options.onOpen, onClose: options.onClose})
			.appendTo('body');

		// action by buttons with data-index
		$popup.find('.formActions > button[data-index]').on('click', function () {
			var index = $(this).data('index');
			var callback = options.button[index].onClick;
			callback($popup);
		});

		function __getPopupPrototype() {
			return '<div class="popup">\
						<div class="popup-box">\
							<header class="popup-header">{{header}}</header>\
							<div class="popup-content">\
								{{content}}\
								<div class="formActions">{{button}}</div>\
							</div>\
							<footer class="popup-footer">{{footer}}</footer>\
							<button class="popup-close has-icon i-cross"></button>\
						</div>\
					</div>';
		}
		function __getButtonPrototype() {
			return '<button class="btn {{class}}" style="{{style}}" data-index="{{index}}">{{title}}</button>';
		}
	}

	// check if an element exist
	$.fn.elementExist = function(obj) {
		return ($(this).length > 0) === true;
	}

	// toggle class
	$('[data-toggler]').on('click', function () {
		var dataToggle = $(this).data('toggler');
		var $toggleObj = $(dataToggle);
		var toggleClass = $toggleObj.data('toggle');

		$toggleObj.toggleClass(toggleClass);
	})

})
