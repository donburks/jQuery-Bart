/*
 * jQuery Bart: Annoyification plugin - v0.1 - 08/04/2011
 * http://www.vankoder.com/
 * 
 * Copyright (c) 2011 Don Burks
 * Dual licensed under the MIT and GPL licenses.
 */

(function($){
	//Plugin default values
	var defaults = { 
		'type'			: 'bubble',		//Default type of annoyification
		'style'			: 'error',		//Default style of annoyification
		'vposition'		: 'bottom',		//Default vertical position
		'hposition'		: 'right',		//Default horizontal position
		'opacity'		: '0.8', 		//Default opacity
		'easing'		: 'linear',		//Default easing
		'duration'		: 2000,			//Default duration (in ms)
		'speed',		: 600,			//Default animation speed (in ms)
		'title'			: "D'oh!",		//Default title
		'message'		: 'Cowabunga',	//Default message 
		'sticky'		: false,		//Default stickiness
		'imgDir'		: '/images/'	//Default directory for bart's images
	},
	options = {}, 				//This object will hold our final plugin settings globally
	container,					//Container holds the global $(this)
	wrapper, textSpan, icon, title,	//Variables for caching the DOM elements that make up the annoyifications
	height, width;				//"Global" vars for holding the dimensions of the annoyification

	$.clearClasses = function(elem) {
		var classes = elem.attr('class');
		for (var domclass in classes) {
			//We only want to remove the bart classes
			if (domclass.test(/^bart_/)) {
				elem.removeAttr(domclass);
			}
		}
	}

	//Hide Bart 
	$.detention = function() {
		//Do nothing if he's already in detention 
		if (wrapper.css('opacity') > 0) {
			wrapper.animate({options.vposition: '-'+height, options.hposition: '-'+width, 'opacity': 0}, options.speed, options.easing, function() { wrapper.hide(); });
		}
	}

 	$.fn.bart = function(params) {
		//Store $(this) in a more semantically correct variable. We might need it in other functions anyway
		container = $(this);

		options = $.extend(defaults, params);

		if (!$("#bart_wrapper").length) { //This builds our notification into the DOM if it doesn't already exist
			$("<div>").attr('id', 'bart_wrapper');
			$("<span>").attr('id', 'bart_text').prependTo("#bart_wrapper");
			$("<span>").attr('id', 'bart_icon').after("#bart_text");
			$("<img>").appendTo("#bart_icon");
			$("<h3>").attr('id', 'bart_title').after("#bart_icon");
			$("<span>").attr('id', 'bart_close').appendTo("#bart_wrapper");
			$("<img>").attr('src', options.imgDir+'close.png').appendTo("#bart_close");
			$("#bart_close").click(function() {
				$.detention();
			});
		} else { //Already exists on page
			//Clear any old bart classes out
			$.clearClasses(wrapper);
			$.clearClasses(icon);
		}


		//Cache elements 
		wrapper = $("#bart_wrapper");	
		textSpan = $("#bart_text");
		icon = $("#bart_icon");
		title = $("#bart_title");

		//Modify for proper display
		wrapper.addClass('bart_'+options.type);
		textSpan.html(options.text);
		icon.addClass('bart_'+options.style).find('img').attr('src', options.imgDir+options.style+'.png');
		title.text(options.title);

		wrapper.appendTo('body');

		//Now that we know what style/type it is, we can do some calculations in order to animate properly.
		height = wrapper.height;
		width  = wrapper.width;

		if (isNan(options.vposition)) { //handles top or bottom
			wrapper.css(options.vposition, '-'+height+'px');
		} else {
			wrapper.css('top', options.vposition+'px');
			options.vposition = 'top';
		}

		if (isNan(options.hposition)) { //handles top or bottom
			wrapper.css(options.hposition, '-'+width+'px');
		} else {
			wrapper.css('left', options.hposition+'px');
			options.vposition = 'left';
		}

		wrapper.show().animate({options.vposition: 0, options.hposition: 0, 'opacity': options.opacity}, options.speed, options.easing);

		//Handle stickiness
		if(!options.sticky) {
			setTimeout(function() {
				$.detention();
			}, options.duration);
		}

		//Return jQuery object, for chaining. It IS a plugin after all
		return container;
	}; 
})(jQuery);

