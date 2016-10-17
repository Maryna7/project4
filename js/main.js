var menuButtoon = (function(){
	return{
		init: function(){
			$('.open-menu').on('click', function(e){
				e.preventDefault();
				var menuHolder = $('#wrapper');
				menuHolder.toggleClass("show");
			});	
		}
	}
}());

var modalWindow = (function(){
	return{
		init: function(){
			var _this = this;
			$('[data-open]').on('click', function(e){
				e.preventDefault();
				var modalSelector = $(this).attr('data-open')	
				_this.openModal(modalSelector)	
			});
			$('.modal-holder').on('click', '.modal-close, .modal-active', function(e){
				e.preventDefault();
				_this.closeModal()		
			});
		},
		openModal: function (element) {
			var _this = this;
			$('[data-modal=' + element + ']').addClass('active');
			$('.modal-holder').append('<div class="modal-active">')
		},
		closeModal:function() {
			$('.modal.active').removeClass('active');
			$('.modal-active').remove();
		}	
	}
}());

$(document).ready(function(){
	if($('.open-menu').length){
		menuButtoon.init();
	};
	if($('.modal').length){
		modalWindow.init();
	};
	$("#navbar").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
		top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 500);
	});
});


$('.slider-holder').slick({
	mobileFirst: true,
	autoplay:false,
	autoplaySpeed:3000,
	slidesToShow:1,
	slidesToScroll:1,
	responsive: [
	{
		breakpoint: 767,
		settings: {
			slidesToShow: 2,
			slidesToScroll: 2,
		}
	},
	{
		breakpoint: 1023,
		settings: {
			slidesToShow: 3,
			slidesToScroll: 3,
		}
	}
	]
});

// page init
bindReady(function(){
	initFixedScrollBlock();
	initRetinaCover();
	initOpenClose();
	initSameHeight();
});


// open-close init
function initOpenClose() {
	jQuery('.dropdown-block').openClose({
		activeClass: 'active',
		opener: '.btn-dropdown',
		slider: '.dropdown',
		animSpeed: 400,
		effect: 'slide'
	});
}

// align blocks height
function initSameHeight() {
	setSameHeight({
		holder: '.img-holder',
		elements: '.img-wrap',
		flexible: true, 
		multiLine: true
	});
}

// initialize fixed blocks on scroll
function initFixedScrollBlock() {
	jQuery('#wrapper').fixedScrollBlock({
		slideBlock: '.header-nav'
	});
}

function initRetinaCover() {
	jQuery('.bg-stretch').retinaCover();
}

/*
 * jQuery retina cover plugin
 */
 ;(function($) {
 	'use strict';

 	var styleRules = {};
 	var templates = {
 		'2x': [
 			'(-webkit-min-device-pixel-ratio: 1.5)',
 			'(min-resolution: 192dpi)',
 			'(min-device-pixel-ratio: 1.5)',
 			'(min-resolution: 1.5dppx)'
 		],
 		'3x': [
 			'(-webkit-min-device-pixel-ratio: 3)',
 			'(min-resolution: 384dpi)',
 			'(min-device-pixel-ratio: 3)',
 			'(min-resolution: 3dppx)'
 		]
 	};

 	function addSimple(imageSrc, media, id) {
 		var style = buildRule(id, imageSrc);

 		addRule(media, style);
 	}

 	function addRetina(imageData, media, id) {
 		var currentRules = templates[imageData[1]].slice();
 		var patchedRules = currentRules;
 		var style = buildRule(id, imageData[0]);

 		if (media !== 'default') {
 			patchedRules = $.map(currentRules, function(ele, i) {
 				return ele + ' and ' + media;
 			});
 		}

 		media = patchedRules.join(',');
 		
 		addRule(media, style);
 	}

 	function buildRule(id, src) {
 		return '#' + id + '{background-image: url("' + src + '");}';
 	}

 	function addRule(media, rule) {
 		var $styleTag = styleRules[media];
 		var styleTagData;
 		var rules = '';

 		if (media === 'default') {
 			rules = rule + ' ';
 		} else {
 			rules = '@media ' + media + '{' + rule + '}';
 		}

 		if (!$styleTag) {
 			styleRules[media] = $('<style>').text(rules).appendTo('head');
 		} else {
 			styleTagData = $styleTag.text();
 			styleTagData = styleTagData.substring(0, styleTagData.length - 2) + ' }' + rule + '}';
 			$styleTag.text(styleTagData);
 		}
 	}

 	$.fn.retinaCover = function() {
 		return this.each(function() {
 			var $block = $(this);
 			var $items = $block.children('[data-srcset]');
 			var id = 'bg-stretch' + Date.now() + (Math.random() * 1000).toFixed(0);

 			if ($items.length) {
 				$block.attr('id', id);

 				$items.each(function() {
 					var $item = $(this);
 					var data = $item.data('srcset').split(', ');
 					var media = $item.data('media') || 'default';
 					var dataLength = data.length;
 					var itemData;
 					var i;

 					for (i = 0; i < dataLength; i++) {
 						itemData = data[i].split(' ');

 						if (itemData.length === 1) {
 							addSimple(itemData[0], media, id);
 						} else {
 							addRetina(itemData, media, id);
 						}
 					}
 				});
 			}

 			$items.detach();
 		});
 	};
 }(jQuery));

/*
 * FixedScrollBlock
 */
 ;(function($, window) {
 	'use strict';
 	var isMobileDevice = ('ontouchstart' in window) ||
 	(window.DocumentTouch && document instanceof DocumentTouch) ||
 	/Windows Phone/.test(navigator.userAgent);

 	function FixedScrollBlock(options) {
 		this.options = $.extend({
 			fixedActiveClass: 'fixed-position',
 			slideBlock: '[data-scroll-block]',
 			positionType: 'auto',
 			fixedOnlyIfFits: true,
 			container: null,
 			animDelay: 100,
 			animSpeed: 200,
 			extraBottom: 0,
 			extraTop: 0
 		}, options);
 		this.initStructure();
 		this.attachEvents();
 	}
 	FixedScrollBlock.prototype = {
 		initStructure: function() {
			// find elements
			this.win = $(window);
			this.container = $(this.options.container);
			this.slideBlock = this.container.find(this.options.slideBlock);

			// detect method
			if(this.options.positionType === 'auto') {
				this.options.positionType = isMobileDevice ? 'absolute' : 'fixed';
			}
		},
		attachEvents: function() {
			var self = this;

			// bind events
			this.onResize = function() {
				self.resizeHandler();
			};
			this.onScroll = function() {
				self.scrollHandler();
			};

			// handle events
			this.win.on({
				resize: this.onResize,
				scroll: this.onScroll
			});

			// initial handler call
			this.resizeHandler();
		},
		recalculateOffsets: function() {
			var defaultOffset = this.slideBlock.offset(),
			defaultPosition = this.slideBlock.position(),
			holderOffset = this.container.offset(),
			windowSize = this.win.height();

			this.data = {
				windowHeight: this.win.height(),
				windowWidth: this.win.width(),

				blockPositionLeft: defaultPosition.left,
				blockPositionTop: defaultPosition.top,

				blockOffsetLeft: defaultOffset.left,
				blockOffsetTop: defaultOffset.top,
				blockHeight: this.slideBlock.innerHeight(),

				holderOffsetLeft: holderOffset.left,
				holderOffsetTop: holderOffset.top,
				holderHeight: this.container.innerHeight()
			};
		},
		isVisible: function() {
			return this.slideBlock.prop('offsetHeight');
		},
		fitsInViewport: function() {
			if(this.options.fixedOnlyIfFits && this.data) {
				return this.data.blockHeight + this.options.extraTop <= this.data.windowHeight;
			} else {
				return true;
			}
		},
		resizeHandler: function() {
			if(this.isVisible()) {
				FixedScrollBlock.stickyMethods[this.options.positionType].onResize.apply(this, arguments);
				this.scrollHandler();
			}
		},
		scrollHandler: function() {
			if(this.isVisible()) {
				if(!this.data) {
					this.resizeHandler();
					return;
				}
				this.currentScrollTop = this.win.scrollTop();
				this.currentScrollLeft = this.win.scrollLeft();
				FixedScrollBlock.stickyMethods[this.options.positionType].onScroll.apply(this, arguments);
			}
		},
		refresh: function() {
			// refresh dimensions and state if needed
			if(this.data) {
				this.data.holderHeight = this.container.innerHeight();
				this.data.blockHeight = this.slideBlock.innerHeight();
				this.scrollHandler();
			}
		},
		destroy: function() {
			// remove event handlers and styles
			this.slideBlock.removeAttr('style').removeClass(this.options.fixedActiveClass);
			this.win.off({
				resize: this.onResize,
				scroll: this.onScroll
			});
		}
	};

	// sticky methods
	FixedScrollBlock.stickyMethods = {
		fixed: {
			onResize: function() {
				this.slideBlock.removeAttr('style');
				this.recalculateOffsets();
			},
			onScroll: function() {
				if(this.fitsInViewport() && this.currentScrollTop + this.options.extraTop > this.data.blockOffsetTop) {
					if(this.currentScrollTop + this.options.extraTop + this.data.blockHeight > this.data.holderOffsetTop + this.data.holderHeight - this.options.extraBottom) {
						this.slideBlock.css({
							position: 'absolute',
							top: this.data.blockPositionTop + this.data.holderHeight - this.data.blockHeight - this.options.extraBottom - (this.data.blockOffsetTop - this.data.holderOffsetTop),
							left: this.data.blockPositionLeft
						});
					} else {
						this.slideBlock.css({
							position: 'fixed',
							top: this.options.extraTop,
							left: this.data.blockOffsetLeft - this.currentScrollLeft
						});
					}
					this.slideBlock.addClass(this.options.fixedActiveClass);
				} else {
					this.slideBlock.removeClass(this.options.fixedActiveClass).removeAttr('style');
				}
			}
		},
		absolute: {
			onResize: function() {
				this.slideBlock.removeAttr('style');
				this.recalculateOffsets();

				this.slideBlock.css({
					position: 'absolute',
					top: this.data.blockPositionTop,
					left: this.data.blockPositionLeft
				});

				this.slideBlock.addClass(this.options.fixedActiveClass);
			},
			onScroll: function() {
				var self = this;
				clearTimeout(this.animTimer);
				this.animTimer = setTimeout(function() {
					var currentScrollTop = self.currentScrollTop + self.options.extraTop,
					initialPosition = self.data.blockPositionTop - (self.data.blockOffsetTop - self.data.holderOffsetTop),
					maxTopPosition =  self.data.holderHeight - self.data.blockHeight - self.options.extraBottom,
					currentTopPosition = initialPosition + Math.min(currentScrollTop - self.data.holderOffsetTop, maxTopPosition),
					calcTopPosition = self.fitsInViewport() && currentScrollTop > self.data.blockOffsetTop ? currentTopPosition : self.data.blockPositionTop;

					self.slideBlock.stop().animate({
						top: calcTopPosition
					}, self.options.animSpeed);
				}, this.options.animDelay);
			}
		}
	};

	// jQuery plugin interface
	$.fn.fixedScrollBlock = function(options) {
		return this.each(function() {
			var params = $.extend({}, options, {container: this}),
			instance = new FixedScrollBlock(params);
			$.data(this, 'FixedScrollBlock', instance);
		});
	};

	// module exports
	window.FixedScrollBlock = FixedScrollBlock;
}(jQuery, this));

/*
 * jQuery Open/Close plugin
 */
 ;(function($) {
 	function OpenClose(options) {
 		this.options = $.extend({
 			addClassBeforeAnimation: true,
 			hideOnClickOutside: false,
 			activeClass:'active',
 			opener:'.opener',
 			slider:'.slide',
 			animSpeed: 400,
 			effect:'fade',
 			event:'click'
 		}, options);
 		this.init();
 	}
 	OpenClose.prototype = {
 		init: function() {
 			if (this.options.holder) {
 				this.findElements();
 				this.attachEvents();
 				this.makeCallback('onInit', this);
 			}
 		},
 		findElements: function() {
 			this.holder = $(this.options.holder);
 			this.opener = this.holder.find(this.options.opener);
 			this.slider = this.holder.find(this.options.slider);
 		},
 		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.bind(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'over') {
				self.opener.bind('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)){
						self.showSlide();
					}
				});
				self.holder.bind('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).bind('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.removeClass(slideHiddenClass);
			$(document).bind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).unbind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({ display:'' });
			this.opener.unbind(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).unbind('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		return this.each(function() {
			jQuery(this).data('OpenClose', new OpenClose($.extend(opt, { holder: this })));
		});
	};
}(jQuery));


// set same height for blocks
function setSameHeight(opt) {
	// default options
	var options = {
		holder: null,
		skipClass: 'same-height-ignore',
		leftEdgeClass: 'same-height-left',
		rightEdgeClass: 'same-height-right',
		elements: '>*',
		flexible: false,
		multiLine: false,
		useMinHeight: false,
		biggestHeight: false
	};
	for(var p in opt) {
		if(opt.hasOwnProperty(p)) {
			options[p] = opt[p];
		}
	}

	// init script
	if(options.holder) {
		var holders = lib.queryElementsBySelector(options.holder);
		lib.each(holders, function(ind, curHolder){
			var curElements = [], resizeTimer, postResizeTimer;
			var tmpElements = lib.queryElementsBySelector(options.elements, curHolder);

			// get resize elements
			for(var i = 0; i < tmpElements.length; i++) {
				if(!lib.hasClass(tmpElements[i], options.skipClass)) {
					curElements.push(tmpElements[i]);
				}
			}
			if(!curElements.length) return;

			// resize handler
			function doResize() {
				for(var i = 0; i < curElements.length; i++) {
					curElements[i].style[options.useMinHeight && SameHeight.supportMinHeight ? 'minHeight' : 'height'] = '';
				}

				if(options.multiLine) {
					// resize elements row by row
					SameHeight.resizeElementsByRows(curElements, options);
				} else {
					// resize elements by holder
					SameHeight.setSize(curElements, curHolder, options);
				}
			}
			doResize();

			// handle flexible layout / font resize
			function flexibleResizeHandler() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function(){
					doResize();
					clearTimeout(postResizeTimer);
					postResizeTimer = setTimeout(doResize, 100);
				},1);
			}
			if(options.flexible) {
				addEvent(window, 'resize', flexibleResizeHandler);
				addEvent(window, 'orientationchange', flexibleResizeHandler);
				FontResizeEvent.onChange(flexibleResizeHandler);
			}
			// handle complete page load including images and fonts
			addEvent(window, 'load', flexibleResizeHandler);
		});
	}

	// event handler helper functions
	function addEvent(object, event, handler) {
		if(object.addEventListener) object.addEventListener(event, handler, false);
		else if(object.attachEvent) object.attachEvent('on'+event, handler);
	}
}

/*
 * SameHeight helper module
 */
 SameHeight = {
	supportMinHeight: typeof document.documentElement.style.maxHeight !== 'undefined', // detect css min-height support
	setSize: function(boxes, parent, options) {
		var calcHeight, holderHeight = typeof parent === 'number' ? parent : this.getHeight(parent);

		for(var i = 0; i < boxes.length; i++) {
			var box = boxes[i];
			var depthDiffHeight = 0;
			var isBorderBox = this.isBorderBox(box);
			lib.removeClass(box, options.leftEdgeClass);
			lib.removeClass(box, options.rightEdgeClass);

			if(typeof parent != 'number') {
				var tmpParent = box.parentNode;
				while(tmpParent != parent) {
					depthDiffHeight += this.getOuterHeight(tmpParent) - this.getHeight(tmpParent);
					tmpParent = tmpParent.parentNode;
				}
			}
			calcHeight = holderHeight - depthDiffHeight;
			calcHeight -= isBorderBox ? 0 : this.getOuterHeight(box) - this.getHeight(box);
			if(calcHeight > 0) {
				box.style[options.useMinHeight && this.supportMinHeight ? 'minHeight' : 'height'] = calcHeight + 'px';
			}
		}

		lib.addClass(boxes[0], options.leftEdgeClass);
		lib.addClass(boxes[boxes.length - 1], options.rightEdgeClass);
		return calcHeight;
	},
	getOffset: function(obj) {
		if (obj.getBoundingClientRect) {
			var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
			var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
			return {
				top:Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
				left:Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
			};
		} else {
			var posLeft = 0, posTop = 0;
			while (obj.offsetParent) {posLeft += obj.offsetLeft; posTop += obj.offsetTop; obj = obj.offsetParent;}
			return {top:posTop,left:posLeft};
		}
	},
	getStyle: function(el, prop) {
		if (document.defaultView && document.defaultView.getComputedStyle) {
			return document.defaultView.getComputedStyle(el, null)[prop];
		} else if (el.currentStyle) {
			return el.currentStyle[prop];
		} else {
			return el.style[prop];
		}
	},
	getStylesTotal: function(obj) {
		var sum = 0;
		for(var i = 1; i < arguments.length; i++) {
			var val = parseFloat(this.getStyle(obj, arguments[i]));
			if(!isNaN(val)) {
				sum += val;
			}
		}
		return sum;
	},
	getHeight: function(obj) {
		return obj.offsetHeight - this.getStylesTotal(obj, 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom');
	},
	getOuterHeight: function(obj) {
		return obj.offsetHeight;
	},
	isBorderBox: function(obj) {
		var f = this.getStyle, styleValue = f(obj, 'boxSizing') || f(obj, 'WebkitBoxSizing') || f(obj, 'MozBoxSizing');
		return styleValue === 'border-box';
	},
	resizeElementsByRows: function(boxes, options) {
		var currentRow = [], maxHeight, maxCalcHeight = 0, firstOffset = this.getOffset(boxes[0]).top;
		for(var i = 0; i < boxes.length; i++) {
			if(this.getOffset(boxes[i]).top === firstOffset) {
				currentRow.push(boxes[i]);
			} else {
				maxHeight = this.getMaxHeight(currentRow);
				maxCalcHeight = Math.max(maxCalcHeight, this.setSize(currentRow, maxHeight, options));
				firstOffset = this.getOffset(boxes[i]).top;
				currentRow = [boxes[i]];
			}
		}
		if(currentRow.length) {
			maxHeight = this.getMaxHeight(currentRow);
			maxCalcHeight = Math.max(maxCalcHeight, this.setSize(currentRow, maxHeight, options));
		}
		if(options.biggestHeight) {
			for(i = 0; i < boxes.length; i++) {
				boxes[i].style[options.useMinHeight && this.supportMinHeight ? 'minHeight' : 'height'] = maxCalcHeight + 'px';
			}
		}
	},
	getMaxHeight: function(boxes) {
		var maxHeight = 0;
		for(var i = 0; i < boxes.length; i++) {
			maxHeight = Math.max(maxHeight, this.getOuterHeight(boxes[i]));
		}
		return maxHeight;
	}
};

/*
 * FontResize Event
 */
 FontResizeEvent = (function(window,document){
 	var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
 	var resizeFrame = document.createElement('iframe');
 	resizeFrame.id = randomID; resizeFrame.className = 'font-resize-helper';
 	resizeFrame.style.cssText = 'position:absolute;width:100em;height:10px;top:-9999px;left:-9999px;border-width:0';

	// wait for page load
	function onPageReady() {
		document.body.appendChild(resizeFrame);

		// use native IE resize event if possible
		if (/MSIE (6|7|8)/.test(navigator.userAgent)) {
			resizeFrame.onresize = function() {
				window.FontResizeEvent.trigger(resizeFrame.offsetWidth / 100);
			};
		}
		// use script inside the iframe to detect resize for other browsers
		else {
			var doc = resizeFrame.contentWindow.document;
			doc.open();
			doc.write('<scri' + 'pt>window.onload = function(){var em = parent.document.getElementById("' + randomID + '");window.onresize = function(){if(parent.FontResizeEvent){parent.FontResizeEvent.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
			doc.close();
		}
	}
	if(window.addEventListener) window.addEventListener('load', onPageReady, false);
	else if(window.attachEvent) window.attachEvent('onload', onPageReady);

	// public interface
	var callbacks = [];
	return {
		onChange: function(f) {
			if(typeof f === 'function') {
				callbacks.push(f);
			}
		},
		trigger: function(em) {
			for(var i = 0; i < callbacks.length; i++) {
				callbacks[i](em);
			}
		}
	};
}(this, document));

/*
 * Utility module
 */
 lib = {
 	hasClass: function(el,cls) {
 		return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
 	},
 	addClass: function(el,cls) {
 		if (el && !this.hasClass(el,cls)) el.className += " "+cls;
 	},
 	removeClass: function(el,cls) {
 		if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
 	},
 	extend: function(obj) {
 		for(var i = 1; i < arguments.length; i++) {
 			for(var p in arguments[i]) {
 				if(arguments[i].hasOwnProperty(p)) {
 					obj[p] = arguments[i][p];
 				}
 			}
 		}
 		return obj;
 	},
 	each: function(obj, callback) {
 		var property, len;
 		if(typeof obj.length === 'number') {
 			for(property = 0, len = obj.length; property < len; property++) {
 				if(callback.call(obj[property], property, obj[property]) === false) {
 					break;
 				}
 			}
 		} else {
 			for(property in obj) {
 				if(obj.hasOwnProperty(property)) {
 					if(callback.call(obj[property], property, obj[property]) === false) {
 						break;
 					}
 				}
 			}
 		}
 	},
 	event: (function() {
 		var fixEvent = function(e) {
 			e = e || window.event;
 			if(e.isFixed) return e; else e.isFixed = true;
 			if(!e.target) e.target = e.srcElement;
 			e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
 			e.stopPropagation = e.stopPropagation || function() {this.cancelBubble = true;};
 			return e;
 		};
 		return {
 			add: function(elem, event, handler) {
 				if(!elem.events) {
 					elem.events = {};
 					elem.handle = function(e) {
 						var ret, handlers = elem.events[e.type];
 						e = fixEvent(e);
 						for(var i = 0, len = handlers.length; i < len; i++) {
 							if(handlers[i]) {
 								ret = handlers[i].call(elem, e);
 								if(ret === false) {
 									e.preventDefault();
 									e.stopPropagation();
 								}
 							}
 						}
 					};
 				}
 				if(!elem.events[event]) {
 					elem.events[event] = [];
 					if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
 					else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
 				}
 				elem.events[event].push(handler);
 			},
 			remove: function(elem, event, handler) {
 				var handlers = elem.events[event];
 				for(var i = handlers.length - 1; i >= 0; i--) {
 					if(handlers[i] === handler) {
 						handlers.splice(i,1);
 					}
 				}
 				if(!handlers.length) {
 					delete elem.events[event];
 					if(elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
 					else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
 				}
 			}
 		};
 	}()),
 	queryElementsBySelector: function(selector, scope) {
 		scope = scope || document;
 		if(!selector) return [];
 		if(selector === '>*') return scope.children;
 		if(typeof document.querySelectorAll === 'function') {
 			return scope.querySelectorAll(selector);
 		}
 		var selectors = selector.split(',');
 		var resultList = [];
 		for(var s = 0; s < selectors.length; s++) {
 			var currentContext = [scope || document];
 			var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
 			for (var i = 0; i < tokens.length; i++) {
 				token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
 				if (token.indexOf('#') > -1) {
 					var bits = token.split('#'), tagName = bits[0], id = bits[1];
 					var element = document.getElementById(id);
 					if (element && tagName && element.nodeName.toLowerCase() != tagName) {
 						return [];
 					}
 					currentContext = element ? [element] : [];
 					continue;
 				}
 				if (token.indexOf('.') > -1) {
 					var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
 					for (var h = 0; h < currentContext.length; h++) {
 						var elements;
 						if (tagName == '*') {
 							elements = currentContext[h].getElementsByTagName('*');
 						} else {
 							elements = currentContext[h].getElementsByTagName(tagName);
 						}
 						for (var j = 0; j < elements.length; j++) {
 							found[foundCount++] = elements[j];
 						}
 					}
 					currentContext = [];
 					var currentContextIndex = 0;
 					for (var k = 0; k < found.length; k++) {
 						if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
 							currentContext[currentContextIndex++] = found[k];
 						}
 					}
 					continue;
 				}
 				if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
 					var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
 					if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
 						attrName = 'htmlFor';
 					}
 					var found = [], foundCount = 0;
 					for (var h = 0; h < currentContext.length; h++) {
 						var elements;
 						if (tagName == '*') {
 							elements = currentContext[h].getElementsByTagName('*');
 						} else {
 							elements = currentContext[h].getElementsByTagName(tagName);
 						}
 						for (var j = 0; elements[j]; j++) {
 							found[foundCount++] = elements[j];
 						}
 					}
 					currentContext = [];
 					var currentContextIndex = 0, checkFunction;
 					switch (attrOperator) {
 						case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
 						case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
 						case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
 						case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
 						case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
 						case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
 						default : checkFunction = function(e) { return e.getAttribute(attrName) };
 					}
 					currentContext = [];
 					var currentContextIndex = 0;
 					for (var k = 0; k < found.length; k++) {
 						if (checkFunction(found[k])) {
 							currentContext[currentContextIndex++] = found[k];
 						}
 					}
 					continue;
 				}
 				tagName = token;
 				var found = [], foundCount = 0;
 				for (var h = 0; h < currentContext.length; h++) {
 					var elements = currentContext[h].getElementsByTagName(tagName);
 					for (var j = 0; j < elements.length; j++) {
 						found[foundCount++] = elements[j];
 					}
 				}
 				currentContext = found;
 			}
 			resultList = [].concat(resultList,currentContext);
 		}
 		return resultList;
 	},
 	trim: function (str) {
 		return str.replace(/^\s+/, '').replace(/\s+$/, '');
 	},
 	bind: function(f, scope, forceArgs){
 		return function() {return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);};
 	}
 };

// DOM ready handler
function bindReady(handler){
	var called = false;
	var ready = function() {
		if (called) return;
		called = true;
		handler();
	};
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', ready, false);
	} else if (document.attachEvent) {
		if (document.documentElement.doScroll && window == window.top) {
			var tryScroll = function(){
				if (called) return;
				if (!document.body) return;
				try {
					document.documentElement.doScroll('left');
					ready();
				} catch(e) {
					setTimeout(tryScroll, 0);
				}
			};
			tryScroll();
		}
		document.attachEvent('onreadystatechange', function(){
			if (document.readyState === 'complete') {
				ready();
			}
		});
	}
	if (window.addEventListener) window.addEventListener('load', ready, false);
	else if (window.attachEvent) window.attachEvent('onload', ready);
}

/*! Picturefill - v3.0.1 - 2015-09-30
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
 !function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<41&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"	"===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){z[b]=!1,aa()},d.onload=function(){z[b]=1===d.width,aa()},d.src=c,"pending"}function f(){L=!1,O=a.devicePixelRatio,M={},N={},s.DPR=O||1,P.width=Math.max(a.innerWidth||0,y.clientWidth),P.height=Math.max(a.innerHeight||0,y.clientHeight),P.vw=P.width/100,P.vh=P.height/100,r=[P.height,P.width,O].join("-"),P.em=s.getEmValue(),P.rem=P.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===A.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||_(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),W.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):X.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):W.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(S),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(T),m>=l)return n;g=c(U),h=[],","===g.slice(-1)?(g=g.replace(V,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=function(){},u=b.createElement("img"),v=u.getAttribute,w=u.setAttribute,x=u.removeAttribute,y=b.documentElement,z={},A={algorithm:""},B="data-pfsrc",C=B+"set",D=navigator.userAgent,E=/rident/.test(D)||/ecko/.test(D)&&D.match(/rv\:(\d+)/)&&RegExp.$1>35,F="currentSrc",G=/\s+\+?\d+(e\d+)?w/,H=/(\([^)]+\))?\s*(.+)/,I=a.picturefillCFG,J="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",K="font-size:100%!important;",L=!0,M={},N={},O=a.devicePixelRatio,P={px:1,"in":96},Q=b.createElement("a"),R=!1,S=/^[ \t\n\r\u000c]+/,T=/^[, \t\n\r\u000c]+/,U=/^[^ \t\n\r\u000c]+/,V=/[,]+$/,W=/^\d+$/,X=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Y=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},Z=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},$=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=Z(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in M))if(M[b]=!1,d&&(e=b.match(a)))M[b]=e[1]*P[e[2]];else try{M[b]=new Function("e",c(b))(P)}catch(f){}return M[b]}}(),_=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},aa=function(a){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),R=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}};o=a.console&&console.warn?function(a){console.warn(a)}:t,F in u||(F="src"),z["image/jpeg"]=!0,z["image/gif"]=!0,z["image/png"]=!0,z["image/svg+xml"]=b.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in u,s.supSizes="sizes"in u,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){u.srcset="data:,a",a.src="data:,a",s.supSrcset=u.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=A,s.supSrcset&&(s.sel+=",img["+C+"]"),s.DPR=O||1,s.u=P,s.types=z,q=s.supSrcset&&!s.supSizes,s.setSize=t,s.makeUrl=Z(function(a){return Q.href=a,Q.href}),s.qsa=function(a,b){return a.querySelectorAll(b)},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?$(a):!0},s.calcLength=function(a){var b=$(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?z[a]:!0},s.parseSize=Z(function(a){var b=(a||"").match(H);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=y.style.cssText,e=a.style.cssText;c.style.cssText=J,y.style.cssText=K,a.style.cssText=K,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),y.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in N)||A.uT){var b=s.calcLength(n(a));N[a]=b?b:P.width}return N[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)_(b[c],a.sizes)}return b},s.setRes.res=_,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[F],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=E&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=v.call(a,"src"),j.src?w.call(a,B,j.src):x.call(a,B)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=v.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:v.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&G.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g),h&&s.supSrcset&&!j.supported&&(e?(w.call(a,C,e),a.srcset=""):x.call(a,C)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!R||L||O!==a.devicePixelRatio)&&f()},s.supPicture?(aa=t,s.fillImg=t):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=y.clientHeight,i=function(){L=Math.max(a.innerWidth||0,y.clientWidth)!==P.width||y.clientHeight!==h,h=y.clientHeight,L&&s.fillImgs()};Y(a,"resize",g(i,99)),Y(b,"readystatechange",e)}(),s.picturefill=aa,s.fillImgs=aa,s.teardownRun=t,aa._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(A[b]=a[0],R&&s.fillImgs({reselect:!0}))}};for(;I&&I.length;)a.picturefillCFG.push(I.shift());a.picturefill=aa,"object"==typeof module&&"object"==typeof module.exports?module.exports=aa:"function"==typeof define&&define.amd&&define("picturefill",function(){return aa}),s.supPicture||(z["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);