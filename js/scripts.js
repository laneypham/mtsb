var sapphire = function(){
	var $sections = null;
	var $nav = null;
	var nav_height = null;
	var offset = 700;// At what pixels show Back to Top Button
	var scrollDuration = 900; // Duration of scrolling to top
	var isTouch = false;

	/* fix vertical when not overflow call fullscreenFix() if .fullscreen content changes */
	var fullscreenFix = function (){
		var h = $('body').height();
		// set .fullscreen height
		$(".content-fullscreen").each(function(i){
			if($(this).innerHeight() <= h){
				$(this).closest(".fullscreen").addClass("not-overflow");
			}
		});
	};

	/* resize background images */
	var backgroundResize = function (){
		var windowH = $(window).height();
		$(".background").each(function(i){
			var path = $(this);
			// variables
			var contW = path.width();
			var contH = path.height();
			var imgW = path.attr("data-img-width");
			var imgH = path.attr("data-img-height");
			var ratio = imgW / imgH;
			// overflowing difference
			var diff = parseFloat(path.attr("data-diff"));
			diff = diff ? diff : 0;
			// remaining height to have fullscreen image only on parallax
			var remainingH = 0;
			if(path.hasClass("parallax") && !isTouch){
				var maxH = contH > windowH ? contH : windowH;
				remainingH = windowH - contH;
			}
			// set img values depending on cont
			imgH = contH + remainingH + diff;
			imgW = imgH * ratio;
			// fix when too large
			if(contW > imgW){
				imgW = contW;
				imgH = imgW / ratio;
			}
			//
			path.data("resized-imgW", imgW);
			path.data("resized-imgH", imgH);
			path.css("background-size", imgW + "px " + imgH + "px");
		});
	};
	
	/* set parallax background-position */
	var parallaxPosition = function(e){
		if(isTouch){return;}
		var heightWindow = $(window).height();
		var topWindow = $(window).scrollTop();
		var bottomWindow = topWindow + heightWindow;
		var currentWindow = (topWindow + bottomWindow) / 2;
		$(".parallax").each(function(i){
			var path = $(this);
			var height = path.height();
			var top = path.offset().top;
			var bottom = top + height;
			// only when in range
			if(bottomWindow > top && topWindow < bottom){
				var imgW = path.data("resized-imgW");
				var imgH = path.data("resized-imgH");
				// min when image touch top of window
				var min = 0;
				// max when image touch bottom of window
				var max = - imgH + heightWindow;
				// overflow changes parallax
				var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
				top = top - overflowH;
				bottom = bottom + overflowH;
				// value with linear interpolation
				var value = min + (max - min) * (currentWindow - top) / (bottom - top);
				// set background-position
				var orizontalPosition = path.attr("data-oriz-pos");
				orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
				$(this).css("background-position", orizontalPosition + " " + value + "px");
			}
		});
	};

	var scroll = function(){
		var scrollPosition = $(this).scrollTop();
		
		// jQuery to collapse the navbar on scroll
		if ($(".navbar").offset().top > 100) {
			$(".navbar-fixed-top").addClass("top-nav-collapse");
			$(".navbar-fixed-top-white").addClass("top-nav-collapse-white");
		} else {
			$(".navbar-fixed-top").removeClass("top-nav-collapse");
			$(".navbar-fixed-top-white").removeClass("top-nav-collapse-white");
		}
		
		// Fade Hero Text
		$(".top").css("opacity", 1 - scrollPosition / 300);

		if (scrollPosition > offset) {
			$('.backtop, .backtop-border-line').fadeIn(500); // Time(in Milliseconds) of appearing of the Button when scrolling down.
		} else {
			$('.backtop, .backtop-border-line').fadeOut(500); // Time(in Milliseconds) of disappearing of Button when scrolling up.
		}

		$sections.each(function() {
			var top = $(this).offset().top - nav_height;
			var bottom = top + $(this).outerHeight();

			if (scrollPosition >= top && scrollPosition <= bottom) {
				$nav.find('a').removeClass('active');
				$sections.removeClass('active');
				$(this).addClass('active');
				$nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
			}
		});
		
		// Header - Parallax Effect 
		var transY = (scrollPosition * 0.5), scale = 1 + (scrollPosition * 0.0003), transform = 'translateY(' + transY + 'px) scale(' + scale + ') translate3d(0,0,0)';
		$('#header-parallax .header-parallax-bg').css({opacity: 1 - (scrollPosition * 0.0008),WebkitTransform: transform,MozTransform: transform,msTransform: transform,transform: transform});
		parallaxPosition(); 
	};
	
	
	var textFade = function(){
		var texthd = $(".texthd");
		var texthdIndex = -1;
		
		function showNextTexthd() {
			++texthdIndex;
			texthd.eq(texthdIndex % texthd.length).fadeIn(2000).delay(1000).fadeOut(2000, showNextTexthd);
		}
		
		showNextTexthd();
	};
	
	var init = function(){
		$sections = $('section');
		$nav = $('nav');
		nav_height = $nav.outerHeight();

		if("ontouchstart" in window){
			document.documentElement.className = document.documentElement.className + " touch";
			isTouch = true;
		}

		$(this).scrollTop(0);
		// WOW Animate
		new WOW({ animateClass: 'animated', offset: 250,mobile: false, live: true }).init();
		new WOW().init();
		
		// Header Text Fade Effect
		textFade();
		
		// Popover button
		$("[data-toggle=popover]").popover({html: true});

		// About Tabs
		// if the tabs are in a narrow column in a larger viewport
		$('.sidebar-tabs').tabCollapse({tabsClass: 'visible-tabs', accordionClass: 'hidden-tabs'});

		// if the tabs are in wide columns on larger viewports
		$('.content-tabs').tabCollapse();

		// ABOUT CAROUSEL
		$("#about-carousel").carousel({ interval : 3000, pause: "hover" });

		// PROJECTS CAROUSEL
		$("#projects-carousel").carousel({interval: false, pause: "hover" });

		// TESTIMONIAL CAROUSEL
		$("#testimonial-carousel").carousel({interval: 4000,pause: "hover"});

		// POPUP VIDEO
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({disableOn: 700, type: 'iframe', removalDelay: 300, mainClass: 'mfp-fade', preloader: false, fixedContentPos: false });

		/* background fix */
		fullscreenFix();
		backgroundResize();
		parallaxPosition(); 

		//EVENT BINDING
		
		// Closes the Responsive Menu
		$('.navbar-collapse ul li a').click(function() { $('.navbar-toggle:visible').click(); });
		//jQuery for page scrolling feature
		$('a.page-scroll').click(function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});

		// Back to Top Button 
		// Back to Top Border 
		// Smooth animation when scrolling
		$('.backtop, .backtop-border-line').click(function(event) {
			event.preventDefault();
			$('html, body').animate({ scrollTop: 0}, scrollDuration);
		});

		// initialize tab function
		$('.nav-tabs a').click(function(e) {e.preventDefault();$(this).tab('show');});

		// Navbar - DropDown Hover 
		$('ul.nav li.dropdown').hover(function() {
		   $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
		 }, function() {
		   $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
		});
		
		// Active State of Links in Navigation on Scroll
		// Remove Load More Button on Click
		$('.del').click(function(){ $(this).parent().remove(); });

		if(!isTouch){ $(".parallax").css("background-attachment", "fixed"); }
		
		// Preloader
		$(window).load(function() { $("#preloader").fadeOut(1000); });
		$(window).scroll(scroll);
		$(window).resize(function(){ fullscreenFix(); backgroundResize(); parallaxPosition(); });
		$(window).focus(function(){ backgroundResize(); parallaxPosition(); });
		
		return this;
	}

	return init();
};

var app; 
$(document).ready(function(){
	app = (app || new sapphire());
});