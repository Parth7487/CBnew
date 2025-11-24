$(document).ready(function(){

     $('.fa-bars').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll',function(){
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if($(window).scrollTop()>35)
        {
            $('.header').css({'background':'rgba(0, 46, 95, 0.95)','box-shadow':'0 .2rem .5rem rgba(0,0,0,.4)'});
        }
        else
        {
            $('.header').css({'background':'transparent','box-shadow':'none'});
        }

        // Scroll animation for items
        $('.item').each(function(){
            var elementPos = $(this).offset().top;
            var viewportBottom = $(window).scrollTop() + $(window).height();
            if(elementPos < viewportBottom){
                $(this).addClass('fade-in');
            }
        });

        // Scroll animation for service cards
        $('.service-card').each(function(){
            var elementPos = $(this).offset().top;
            var viewportBottom = $(window).scrollTop() + $(window).height();
            if(elementPos < viewportBottom){
                $(this).addClass('fade-in');
            }
        });
    });

    const counters = document.querySelectorAll('.counter');
    const speed = 120;
    counters.forEach(counter => {
	const updateCount = () => {
		const target = +counter.getAttribute('data-target');
		const count = +counter.innerText;
		const inc = target / speed;
		if (count < target) {
			counter.innerText = count + inc;
			setTimeout(updateCount, 1);
		} else {
			counter.innerText = target;
		}
	};
	  updateCount();
   });

   function initializeCarousels() {
    if (typeof $.fn.owlCarousel === 'undefined') {
        setTimeout(initializeCarousels, 100);
        return;
    }

    (function ($) {
        "use strict";

        $(".clients-carousel").owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: { 0: {items: 2}, 768: {items: 4}, 900: {items: 6} }
        });

        $(".testimonials-carousel").owlCarousel({
            autoplay: true,
            dots: true,
            loop: true,
            responsive: { 0: {items: 1}, 576: {items: 2}, 768: {items: 3}, 992: {items: 4} }
        });

    })(jQuery);
   }

   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', initializeCarousels);
   } else {
       initializeCarousels();
   }

$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
});
$('.back-to-top').click(function () {
    $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
    return false;
});

$('.accordion-header').click(function(){
    $('.accordion .accordion-body').slideUp(500);
    $(this).next('.accordion-body').slideDown(500);
    $('.accordion .accordion-header span').text('+');
    $(this).children('span').text('-');
});

// Smooth scroll for navigation links
$('a[href^="#"]').on('click', function(e){
    e.preventDefault();
    var target = $(this.getAttribute('href'));
    if(target.length){
        $('html, body').stop().animate({
            scrollTop: target.offset().top - 80
        }, 1000, 'easeInOutExpo');
    }
});

// Counter animation with intersection observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            const counter = entry.target.querySelector('.counter');
            if(counter && !counter.classList.contains('counted')){
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / 120;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                        counter.classList.add('counted');
                    }
                };
                updateCount();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.counters > div').forEach(el => {
    observer.observe(el);
});

// Add hover effects to service items
$('.item').hover(
    function(){
        $(this).css('cursor', 'pointer');
    },
    function(){
        $(this).css('cursor', 'default');
    }
);

// Navbar link active state
$('.navbar a').on('click', function(){
    $('.navbar a').removeClass('active');
    $(this).addClass('active');
});

// Performance optimization: Lazy loading for images
if('IntersectionObserver' in window){
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

});
