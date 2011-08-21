/*
 * jQuery Bart: Annoyification plugin - v0.1 - 08/04/2011
 * http://www.vankoder.com/
 * 
 * Copyright (c) 2011 Don Burks
 * Dual licensed under the MIT and GPL licenses.
 *
 */

;(function($){
	//Plugin default values
	var defaults = { 
		'type'			: 'bubble',		//modal, bubble, or bar
		'style'			: 'error',		//info, notice, warning, error, success
		'vposition'		: 'bottom',		//top or bottom
		'hposition'		: 'right',		//right or left
		'slide'			: 'vertical',	//vertical or horizontal
		'opacity'		: '0.8', 		//0 - 1
		'easing'		: 'linear',		//linear or swing
		'duration'		: 3000,			//Duration (in ms)
		'speed'			: 600,			//Animation speed (in ms)
		'title'			: "D'oh!",		//Title
		'message'		: 'Cowabunga',	//Message (can be HTML)
		'sticky'		: false,		//Boolean
		'imgDir'		: 'images/',	//Default directory for bart's images, with trailing slash
		'css'			: {},			//Any additional CSS parameters, in object notation
		'animate'		: true,			//Whether to use CSS3 animated bg
		'callback'		: function(){}	//Callback function after notification closes
	},
	options = {}, 						//This object will hold our final plugin settings 
	container,							//Container holds the global $(this)
	wrapper, textSpan, icon, title,		//Variables for caching the DOM elements that make up the annoyifications
	height, width,						//"Global" vars for holding the dimensions of the annoyification
	animateSettings = {};				//Will hold settings passed to animate the annoyification

	 var clearClasses = function(elem) {
		var classList = elem.attr('class'),
			pattern = /^bart_/;

		if (classList != undefined) {
			var classes = classList.split(' ');	
			for (var domclass in classes) {
				//We only want to remove the bart classes
				if (pattern.test(classes[domclass])) {
					elem.removeClass(classes[domclass]);
				}
			}
		}
	};

	//Hide Bart 
	var detention = function() {
		//Do nothing if he's already in detention 
		if (wrapper.css('opacity') > 0) {
			if (options.slide == 'vertical') {
				animateSettings[options.vposition] = '-'+height;
			} else {
				animateSettings[options.hposition] = '-'+width;
			}
			animateSettings['opacity'] = 0;
			wrapper.animate(
				animateSettings, 
				options.speed, 
				options.easing, 
				function() { 
					wrapper.hide(); 
				}
			);
			animateSettings = {}; //Empty array so we don't get persistent values
			if ($.isFunction(options.callback)) {
				options.callback.call(container);
			}
		}
	};

 	$.fn.bart = function(params) {
		//Store $(this) in a more semantically correct variable. 
		//We might need it in other functions anyway
		container = $(this);

		//Merge user options with system options
		options = $.extend({}, defaults, params);

		//This builds our notification into the DOM if it doesn't already exist
		if (!$("#bart_wrapper").length) { 
			//Add it to the body now so that we can build on it. 
			//It's hidden by default in the css
			$("<div>").attr('id', 'bart_wrapper')
				.appendTo('body');
			$("<span>").attr('id', 'bart_icon')
				.appendTo("#bart_wrapper");
			$("<img>").appendTo("#bart_icon");
			$("<h3>").attr('id', 'bart_title')
				.insertAfter("#bart_icon");
			$("<span>").attr('id', 'bart_text')
				.appendTo("#bart_wrapper");
			$("<span>").attr('id', 'bart_close')
				.prependTo("#bart_wrapper");
			$("<img>").attr('src', options.imgDir+'close.png')
				.appendTo("#bart_close");
			$("#bart_close").click(function() {
				detention();
			});
		} else { //Already exists on page
			//Clear any old bart classes out
			clearClasses(wrapper);
			clearClasses(icon);

			//Empty style def's to erase any previous animation results
			wrapper.removeAttr('style'); 
		}


		//Cache elements 
		wrapper = $("#bart_wrapper");	
		textSpan = $("#bart_text");
		icon = $("#bart_icon");
		title = $("#bart_title");

		//Modify for proper display
		wrapper.addClass('bart_'+options.type)
			.addClass('bart_'+options.style);

		//Animation?
		if (!options.animate) {
			wrapper.addClass('bart_noAnimate');
		}

		textSpan.html(options.message);
		icon.find('img')
			.attr('src', options.imgDir+options.style+'.png');
		title.text(options.title);

		//Now that we know what style/type it is, we can do some 
		//calculations in order to animate properly.
		height = wrapper.height();
		width  = wrapper.width();

		if (options.type == 'modal') {
			var halfWidth = parseInt(width / 2, 10),
				halfHeight = parseInt(height / 2, 10);

			wrapper.css({
				'top': '50%', 
				'left': '50%', 
				'margin-left': '-'+halfWidth+'px', 
				'margin-top': '-'+halfHeight+'px'
			});
		} else {
			if (isNaN(options.vposition)) { //handles top or bottom
				if (options.slide == 'vertical') {
					wrapper.css(options.vposition, '-'+height+'px');
				} else {
					wrapper.css(options.vposition, 0);
				}
			} else {
				wrapper.css('top', options.vposition+'px');
				options.vposition = 'top';
			}

			if (isNaN(options.hposition)) { //handles right or left
				if (options.slide == 'horizontal') {
					wrapper.css(options.hposition, '-'+width+'px');
				} else {
					wrapper.css(options.hposition, 0);
				}
			} else {
				wrapper.css('left', options.hposition+'px');
				options.vposition = 'left';
			}

			if (options.slide == 'vertical') {
				animateSettings[options.vposition] = 0;
			} else {
				animateSettings[options.hposition] = 0;
			}
		}
		animateSettings['opacity'] = options.opacity;

		//If there's any additional CSS passed, apply it here.
		//All other internal CSS has been applied
		if (!$.isEmptyObject(options.css)) {
			wrapper.css(options.css);
		}

		wrapper.show()
			.animate(
				animateSettings, 
				options.speed, 
				options.easing
			);

		//Handle stickiness
		if(!options.sticky) {
			setTimeout(function() {
				detention();
			}, options.duration);
		}

		//Return jQuery object, for chaining. It IS a plugin after all
		return container;
	}; 
})(jQuery);

