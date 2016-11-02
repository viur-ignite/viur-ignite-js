/**
 * VIUR JS FRAMEWORK v1.0.4
 *
 * http://ignite.viur.is
 * https://github.com/viur-ignite/viur-ignite-js
 *
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

/* cookie functions */
var cookie = {
	writeCookie: function (name, value, days, path, domain) {
		var expires;

		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = '; expires=' + date.toGMTString();
		}
		if (path) {
			path = '; path=' + path;
		}
		if (domain) {
			domain = '; domain=' + domain;
		}

		document.cookie = name + '=' + value + expires + path + domain;
	},

	getCookie: function (name) {
		var	nameEQ = name + '=',
			cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			while (cookie.charAt(0) == ' ') {
				cookie = cookie.substring(1);
			}
			if (cookie.indexOf(nameEQ) == 0) {
				return cookie.substring(nameEQ.length, cookie.length);
			}
		}

		return null;
	},

	deleteCookie: function (name) {
		cookie.writeCookie(name, null, -1);
	}
}




/**
 * jQuery extensions
 */
$(function() {
	// scroll to an element
	// #TODO add offset
	$.fn.scrollTo = function (options) {
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
			duration: options.speed,
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
		this.on('click', function(event) {
			event.preventDefault();

			var $this = $(this);

			if (!!$this.data('target'))
				var target = $this.data('target');
			else if (!!$this.prop('href'))
				var target = $this.prop('href');
			else
				return console.error('No Scroll Target');

			return $(target).scrollTo(options);
		});
	};


	// toggle class
	$('[data-scroll-target]').on('click', function (event) {
		event.preventDefault();

		var target	= $(this).data('scroll-target');
		var speed	= $(this).data('scroll-speed');
		var easing	= $(this).data('scroll-easing');
		var $target	= $(target);
		var options = {};

		if (typeof speed != 'undefined') options.speed = speed;
		if (typeof easing != 'undefined') options.easing = easing;

		$target.scrollTo(options);
	});


	// popup
	$.fn.popup = function (options) {
		options = $.extend({
			toggleClass: 'is-active',
			overlayClass: 'popup-overlay',
			onOpen: $.noop,
			onClose: $.noop
		}, options);

		if (! $(this).elementExist() ) {
			return false;
		}

		// use only the first element
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
			title: 'VIUR Popup',
			html: 'This is a VIUR popup',
			footer: '',
			button: [
				{title:'Close', class: 'popup-close'}
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
			options.button.forEach(function (val, index) {
				if (typeof options.button[index].onClick === 'undefined') options.button[index].onClick = $.noop;

				if(!!val.html) {
					button += val.html;
				} else {
					button += __getButtonPrototype()
						.replace('{{class}}', !!val.class ? val.class : '')
						.replace('{{style}}', !!val.style ? val.style : '')
						.replace('{{index}}', index)
						.replace('{{title}}', !!val.title ? val.title : '');
				}
			});
		}

		var popup = __getPopupPrototype()
			.replace('{{header}}', options.title)
			.replace('{{content}}', options.html)
			.replace('{{button}}', button)
			.replace('{{footer}}', options.footer);

		// #FIXME: css-fade-effect doesnt work with this code ...
		var $popup = $(popup)
			.appendTo('body')
			.popup({onOpen: options.onOpen, onClose: options.onClose});

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
	};

	// check if an element exist
	$.fn.elementExist = function() {
		return ($(this).length > 0) === true;
	};

	// toggle class
	$('[data-toggler]').on('click', function (event) {
		event.preventDefault();

		var dataToggle = $(this).data('toggler');
		var $toggleObj = $(dataToggle);
		var toggleClass = $toggleObj.data('toggle');

		$toggleObj.toggleClass(toggleClass);
	});

	// suggestions for an input field
	$.fn.suggestions = function (options) {
		options = $.extend({
			data: [],
			searchType: 'contains', // contains or startWith
			url: '',
			getAttribute: 'q',
			type: 'data', // type: url or data
			caseSensitive: false,
			onSelect: $.noop, // after select
			onType: $.noop // ^= keydown
		}, options);

		var $elements = $(this);

		if ($elements.elementExist()) {
			$elements.each(function (index) {
				var $element	= $(this);
				var offset		= $element.offset();
				var width		= $element.innerWidth(); // use here innerWidth because of the border
				var height		= $element.outerHeight();
				var moveIndex	= 0; // index for key up down

				var $suggestionBox = $( __getSuggestionBoxPrototype() )
					.appendTo('body')
					.width(width)
					.css('left', offset.left)
					.css('top', offset.top + height)
					.hide();

				$element.on('keydown', function(e) {
					var key = e.key;

					switch (key) {
						case 'ArrowUp':
							moveIndex--;
							if (moveIndex === 0) {
								moveIndex = $suggestionBox.find('.suggestion-box-item').length;
							}
							$suggestionBox.find('.suggestion-box-item').removeClass('is-active');
							$( $suggestionBox.find('.suggestion-box-item')[moveIndex - 1] ).addClass('is-active');
							break;

						case 'ArrowDown':
							moveIndex++;
							if (moveIndex > $suggestionBox.find('.suggestion-box-item').length) {
								moveIndex = 1;
							}
							$suggestionBox.find('.suggestion-box-item').removeClass('is-active');
							$( $suggestionBox.find('.suggestion-box-item')[moveIndex - 1] ).addClass('is-active');
							break;

						case 'Enter':
							var text = $suggestionBox.find('.suggestion-box-item.is-active').text();
							$element.val(text);
							$suggestionBox.hide();
							options.onSelect.call(null, this, null);
							break;

						default:
							var input = $element.val();
							__loadSuggestions(input, $suggestionBox, $element);
							moveIndex = 0; // reset moveIndex for new suggestions
							break;
					}

					options.onType.call(null, this, null);
				});
			});
		}

		function __loadSuggestions(input, $suggestionBox, $element) {
			var arr		= __searchSuggestions(input);
			var items	= '';

			arr.forEach(function (value, index) {
				items += __getSuggestionItemPrototype()
					.replace('{{value}}', value);
			})

			$suggestionBox.html(
				__getSuggestionBoxContentPrototype()
					.replace('{{items}}', items)
			).show();

			$suggestionBox.find('.suggestion-box-item').on('click', function(e) {
				var text = $(this).text();
				$element.val(text);
				$suggestionBox.hide();
			})
		}

		function __searchSuggestions(q) {
			if (options.caseSensitive == false) {
				q = q.toLowerCase();
			}

			switch (options.type) {
				case 'url':
					var arr;

					$.ajax({
						url: options.url,
						data: {q: q},
						async: false, // Its deprecated, but async ajax sucks
						dataType: 'json',
						success: function (response) {
							arr = response;
						}
					});

					return arr;
					break;

				case 'data':
					if (typeof options.data != 'undefined' && Array.isArray(options.data)) {
						var data	= options.data;
						var arr		= [];

						data.forEach(function (value, index) {
							var searchvalue = value; // use an extra variable that the value isnt lowercase
							if (options.caseSensitive == false) {
								searchvalue = value.toLowerCase();
							}

							if ((options.searchType == 'contains' && searchvalue.indexOf(q) !== -1) ||
								(options.searchType == 'startWith' && searchvalue.indexOf(q) === 0)
							) {
								arr.push(value)
							}
						})

						return arr;
					}
					break;

				default:
					// function ends here
					// because suggesions are missing
					return this;
					break;
			}
		}

		function __getSuggestionBoxPrototype() {
			return '<div class="suggestion-box"><div>';
		}
		function __getSuggestionBoxContentPrototype() {
			return '<ul class="suggestion-box-items">{{items}}</ul>';
		}
		function __getSuggestionItemPrototype() {
			return '<li class="suggestion-box-item">{{value}}</li>';
		}

		return this;
	};
})
