/**
 *  Pts Prestashop Theme Framework for Prestashop 1.6.x
 *
 * @package   pspagebuilder
 * @version   5.0
 * @author    http://www.prestabrain.com
 * @copyright Copyright (C) October 2013 prestabrain.com <@emai:prestabrain@gmail.com>
 *               <info@prestabrain.com>.All rights reserved.
 * @license   GNU General Public License version 2
 * 
 */
function ptssocialsharing_twitter_click(message)
{
	if (typeof message === 'undefined')
		message = encodeURIComponent(location.href);
	window.open('https://twitter.com/intent/tweet?text=' + message, 'sharertwt', 'toolbar=0,status=0,width=640,height=445');
}

function ptssocialsharing_facebook_click(message)
{
	window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href), 'sharer', 'toolbar=0,status=0,width=660,height=445');
}

function ptssocialsharing_google_click(message)
{
	window.open('https://plus.google.com/share?url=' + encodeURIComponent(location.href), 'sharergplus', 'toolbar=0,status=0,width=660,height=445');
}

function ptssocialsharing_pinterest_click(message)
{
	window.open('http://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(location.href), 'sharerpinterest', 'toolbar=0,status=0,width=660,height=445');
}

$(document).ready(function() {
	$(".pts-popup").fancybox();
	$('.pts-carousel').carousel();

	$('.pts-tab .nav > li:first').addClass('active');
	$('.pts-tab .tab-content > .tab-pane:first').addClass('active');

	$(".owl-carousel-play .owl-carousel").each( function(){
        var config = {
            navigation : false, // Show next and prev buttons
            slideSpeed : 300,
            paginationSpeed : 400,
            pagination : $(this).data( 'pagination' ),
            autoHeight: false,
            direction: ($('html').attr('dir') && $('html').attr('dir') == 'rtl' ? 'rtl' : 'ltr'),
            afterAction : SetOwlCarouselFirstLast,
            addClassActive : true
        };

        var owl = $(this);
        config.items = $(this).data( 'columns' );
        if ($(this).data('desktop')) {
            config.itemsDesktop = $(this).data('desktop');
        }
        if ($(this).data('desktopsmall')) {
            config.itemsDesktopSmall = $(this).data('desktopsmall');
        }
        if ($(this).data('desktopsmall')) {
            config.itemsTablet = $(this).data('tablet');
        }
        if ($(this).data('tabletsmall')) {
            config.itemsTabletSmall = $(this).data('tabletsmall');
        }
        if ($(this).data('mobile')) {
            config.itemsMobile = $(this).data('mobile');
        }
        $(this).owlCarousel( config );
        $('.left_carousel',$(this).parent()).click(function(){
              owl.trigger('owl.prev');
              return false; 
        });
        $('.right_carousel',$(this).parent()).click(function(){
            owl.trigger('owl.next');
            return false; 
        });
    });

    function SetOwlCarouselFirstLast(el){
        el.find(".owl-item").removeClass("first");
        el.find(".owl-item.active").first().addClass("first");

        el.find(".owl-item").removeClass("last");
        el.find(".owl-item.active").last().addClass("last");
    }

});
