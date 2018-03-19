$(document).ready(function () {
	window.kingpack = {};

	window.kingpack.form = ({

		init: function(){

			var _th = this;

			$('.js-phone').keydown(function (e) {
				if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
					(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
					(e.keyCode >= 35 && e.keyCode <= 40)) {
					return;
				}
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}
			});

			$('.js-phone').inputmask("+7 (999) 999 - 99 - 99", {
				placeholder: ' ',
				showMaskOnHover:false,
				showMaskOnFocus: false
			});

			$('form').submit(function(e){
				if (!_th.checkForm($(this))) {
					return false;
				}
			});
		},

		checkForm: function(form){
			var checkResult = true;
			form.find('.warning').removeClass('warning');
			form.find('input, textarea, select').each(function(){
				if ($(this).data('req')){
					switch($(this).data('type')){
						case 'tel':
							var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
							if (!re.test($(this).val())){
								$(this).addClass('warning');
								checkResult = false;
							}
							break;
						case 'email':
							var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
							if (!re.test($(this).val())){
								$(this).addClass('warning');
								checkResult = false;
							}
							break;
						case 'checkbox':
							if (!$(this).is(':checked')) {
								$(this).siblings('label').addClass('warning');
								checkResult = false;
							}
							break;
						case 'mobile':
							if ($.trim($(this).val()).length < 22) {
								$(this).addClass('warning');
								checkResult = false;
							}
							break;
						default:
							if ($.trim($(this).val()) === ''){
								$(this).addClass('warning');
								checkResult = false;
							}
							break;
					}
				}
			});
			$('.order-online-form__select--req .warning').parent().addClass('warning');
			return checkResult;

		}

	}).init();

	var timeout = 5000,
			promoSlider = $('.js-promo .owl-carousel');

	promoSlider.owlCarousel({
		items: 1,
		dots: true,
		nav: true,
		loop: true,
		autoplay: true,
		autoplayTimeout: timeout,
		dotsContainer: '#owldots',
		onChanged: function () {
			$(function() {
				var loader = $('.js-promo .owl-dot.active .loader').ClassyLoader({
					width: 23,
					height: 23,
					percentage: 100,
					speed: 40,
					animate: true,
					showRemaining: false,
					showText: false,
					diameter: 10,
					lineColor: 'rgb(253,216,53)',
					lineWidth: 3
				});
			})
		}
	});

	var historySlider = $('.js-history .owl-carousel');

	historySlider.owlCarousel({
		items: 2,
		dots: false,
		nav: true,
		loop: false,
		onTranslated: function (event) {
			var eventIndex = event.item.index;
			$('.js-history .owl-item').removeClass('visible');
			$('.js-history .owl-item').eq(eventIndex).addClass('visible');


		}
	});

	var partnersSlider = $('.js-parners .owl-carousel');

	partnersSlider.owlCarousel({
		items: 6,
		dots: false,
		nav: true,
		loop: false
	});

	// localization fancybox

	$("[data-fancybox]").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [
			'close'
		],
		btnTpl : {
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" title="{{PREV}}"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" title="{{NEXT}}"></a>'
		},
	});

	$("[data-fancybox='video']").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [
			'close'
		],
		btnTpl : {
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" title="{{PREV}}" style="display: none"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" title="{{NEXT}}" style="display: none"></a>'
		},
	});

	$("[data-fancybox='base']").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [
			'close'
		],
		btnTpl : {
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" title="{{PREV}}"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" title="{{NEXT}}"></a>'
		},
		thumbs : {
			autoStart   : true,                  // Display thumbnails on opening
			hideOnClose : true,                   // Hide thumbnail grid when closing animation starts
			parentEl    : '.fancybox-inner',  // Container is injected into this element
			axis        : 'x'                     // Vertical (y) or horizontal (x) scrolling
		},
	});

	$(".promo-slider__button[href='#faq'], .faq-page__button").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [],
		btnTpl : {
			smallBtn   : '<a href="" data-fancybox-close="data-fancybox-close" class="popup-close" title="{{CLOSE}}"></a>',
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" style="display:none" title="{{PREV}}"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" style="display:none" title="{{NEXT}}"></a>'
		}
	});

	$(".promo-slider__button[href='#review'], .reviews-client-slider__link-popup").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [],
		btnTpl : {
			smallBtn   : '<a href="" data-fancybox-close="data-fancybox-close" class="popup-close" title="{{CLOSE}}"></a>',
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" style="display:none" title="{{PREV}}"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" style="display:none" title="{{NEXT}}"></a>'
		}
	});

	$(".promo-slider__button[href='#vac'], .vacancy-accordion__button").fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE       : 'Закрыть',
				NEXT        : 'Следующий',
				PREV        : 'Предыдущий',
				ERROR       : 'Запрошенный контент не может быть загружен. <br> Повторите попытку позже.',
				PLAY_START  : 'Начать слайд-шоу',
				PLAY_STOP   : 'Остановить слайд-шоу',
				FULL_SCREEN : 'Полный экран',
				THUMBS      : 'Эскизы',
				DOWNLOAD    : 'Скачать',
				SHARE       : 'Поделиться',
				ZOOM        : 'Увеличить'
			}
		},
		buttons : [],
		btnTpl : {
			smallBtn   : '<a href="" data-fancybox-close="data-fancybox-close" class="popup-close" title="{{CLOSE}}"></a>',
			arrowLeft : '<a href="" data-fancybox-prev class="arrow-prev" style="display:none" title="{{PREV}}"></a>',
			arrowRight : '<a href="" data-fancybox-next class="arrow-next" style="display:none" title="{{NEXT}}"></a>'
		}
	});

	if($('#map-chelyabinsk').length) {
		ymaps.ready(function () {
			var myMap = new ymaps.Map('map-chelyabinsk', {
					center: [55.089470, 61.382629],
					zoom: 17,
					controls: []
				});

				myMap.geoObjects.add(new ymaps.Placemark(myMap.getCenter(), {
					}, {
						iconLayout: 'default#image',
						iconImageHref : './img/pin.png',
						iconImageSize: [52, 69],
						iconImageOffset: [-30, -70],
						cursor: 'default'
				}))
		});
	}

	if($('#map-moscow').length) {
		ymaps.ready(function () {
			var myMap = new ymaps.Map('map-moscow', {
				center: [55.786627, 37.740471],
				zoom: 17,
				controls: []
			});

			myMap.geoObjects.add(new ymaps.Placemark(myMap.getCenter(), {
			}, {
				iconLayout: 'default#image',
				iconImageHref : './img/pin.png',
				iconImageSize: [52, 69],
				iconImageOffset: [-30, -70],
				cursor: 'default'
			}))
		});
	}

	if($('#map-kz').length) {
		ymaps.ready(function () {
			var myMap = new ymaps.Map('map-kz', {
				center: [49.840583, 73.080968],
				zoom: 16,
				controls: []
			});

			myMap.geoObjects.add(new ymaps.Placemark(myMap.getCenter(), {
			}, {
				iconLayout: 'default#image',
				iconImageHref : './img/pin.png',
				iconImageSize: [52, 69],
				iconImageOffset: [-30, -70],
				cursor: 'default'
			}))
		});
	}

	$(".cert__title").dotdotdot({
		height: 50
	});



	$('.contact-form__input').on('change, keyup', function () {
		$(this).siblings('label').hide();

		if($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});

	$('.order-online-form__input').on('change, keyup', function () {
		$(this).siblings('label').hide();

		if($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});

	$('.order-form__input').on('click ,change, keyup', function () {
		$(this).siblings('label').hide();

		if($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});

	$('a[href^="#"]').bind("click", function(e){
		if($(this).attr('href') === '#top') {
			e.preventDefault();
			$('html,body').animate({scrollTop: 0}, 300);
		} else if($(this).attr('href') === '#' || $(this).data('fancybox')) {

		} else {
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 40
			}, 1000);
			e.preventDefault();
		}
	});

	var SliderPackProduct = $('.js-pack-slider-product .owl-carousel');
	var SliderPackPack = $('.js-pack-slider-pack .owl-carousel');

	SliderPackProduct.owlCarousel({
		items: 1,
		dots: true,
		nav: true,
		loop: true,
		dotsContainer: '.owl-custom-pack'
	});

	SliderPackPack.owlCarousel({
		items: 1,
		dots: true,
		nav: true,
		loop: true,
		dotsContainer: '.owl-custom-pack-p'
	});

	/* Индивидуальная упаковка */

	$('.promo-top-tabs__item').on('click', function (event) {
		event.preventDefault();

		var dataTabs = $(this).data('tab');

		$('.promo-top-tabs').find('.promo-top-tabs__item').each(function () {
			$(this).removeClass('active');
		});
		$(this).addClass('active');

		$('.promo-top__sliders').find('.promo-top-slider').each(function () {
			$(this).removeClass('active');

			if($(this).data('tab') === dataTabs) {
				$(this).addClass('active');
			}
		});
	});

	$('.example-accordion__link').on('click', function (event) {
		event.preventDefault();
		if($(this).hasClass('current')) {
			return false;
		}
		var $th = $(this);
		$('.example-accordion__link.current').siblings('.example-accordion__desc').first().slideUp(400);

		$(this).siblings('.example-accordion__desc').first().slideDown(400, function () {
			$('.example-accordion__link.current').removeClass('current');
			$th.addClass('current');
		});
	});

	var qualitySlider = $('.js-quality-slider').find('.owl-carousel');

	qualitySlider.owlCarousel({
		items: 3,
		slideBy: 3,
		dots: false,
		nav: true,
		loop: false,
		margin:30,
		onInitialized: function(e) {
			$('.owl-count').text('1 / ' + this.items().length / 3);
		}
	});
	qualitySlider.on('changed.owl.carousel', function(e) {
		$('.owl-count').text(Math.round(++e.item.index / 3 + 1)  + ' / ' + e.item.count / 3)
	});

	var productionSlider = $('.js-producton-slider').find('.owl-carousel');

	productionSlider.owlCarousel({
		items: 8,
		dots: false,
		nav: true,
		loop: true
	});

	var reviewsSlider = $('.js-reviews-slider').find('.owl-carousel');

	reviewsSlider.owlCarousel({
		items: 1,
		dots: true,
		nav: true,
		loop: true,
		margin: 30,
		autoplay: true,
		autoplayTimeout: timeout,
		dotsContainer: '#owldots',
		onChanged: function () {
			$(function() {
				var loader = $('.js-reviews-slider .owl-dot.active .loader').ClassyLoader({
					width: 23,
					height: 23,
					percentage: 100,
					speed: 40,
					animate: true,
					showRemaining: false,
					showText: false,
					diameter: 10,
					lineColor: 'rgb(253,216,53)',
					lineWidth: 3
				});
			})
		}
	});

	var faqSlider = $('.js-faq-slider').find('.owl-carousel');

	faqSlider.owlCarousel({
		items: 1,
		dots: false,
		nav: true,
		loop: false,
		margin:30,
		onInitialized: function(e) {
			$('.faq-count').text('1 / ' + this.items().length);
		}
	});

	faqSlider.on('changed.owl.carousel', function(e) {
		$('.faq-count').text(++e.item.index  + ' / ' + e.item.count)
	});

	$('.faq-accordion__link').click(function (e) {
		e.preventDefault();
	});

	$('.faq-accordion__item').on('click', function (event) {
		event.preventDefault();

		if ($(this).hasClass('current')) {
			$(this).parent().find('.faq-accordion__desc').slideUp(400);
			$(this).removeClass('current');
		} else {
			var $th = $(this);
			$th.siblings('.faq-accordion__item.current').find('.faq-accordion__desc').first().slideUp(400);

			$th.find('.faq-accordion__desc').first().slideDown(400, function () {
				$(this).parent().parent().find('.faq-accordion__item.current').removeClass('current');
				$th.addClass('current');
			});
		}
	});

	// Delivery

	$('html').on('click', '.delivery-links__item', function (e) {
		e.preventDefault();
		var deliveryData = $(this).data('tab');

		if($(this).hasClass('active')) {
			return false
		}

		$('.delivery-links__item.active').removeClass('active');

		$(this).addClass('active');

		$('.delivery-tabs').find('.delivery-tab').each(function () {
			$(this).removeClass('active');

			if($(this).data('tab') === deliveryData) {
				$(this).addClass('active');
			}
		});
	});

	// Vacancy

	$('.vacancy-accordion__link').click(function (e) {
		e.preventDefault();
	});

	$('.vacancy-accordion__link').on('click', function (event) {
		event.preventDefault();
		var $th = $(this).parent('.vacancy-accordion__item');

		if($th.hasClass('current')) {
			$th.find('.vacancy-accordion__desc').first().slideUp(400);
			$th.removeClass('current');
		} else {
			$th.find('.vacancy-accordion__desc').first().slideDown(400);
			$th.addClass('current');
		}
	});

	//	Catalog category

	$('.js-open-text').click(function () {

		if($(this).hasClass('open')) {
			$(this).removeClass('open');
			$(this).text('Показать ещё');
			$(this).siblings('.description__desc').addClass('hide-text');
		} else {
			$(this).addClass('open');
			$(this).text('Скрыть');
			$(this).siblings('.description__desc').removeClass('hide-text');
		}
	});

	$('.reviews-client-slider__desc p').dotdotdot({
		height: 208
	});

	$('.catalog-item-photo-slider .owl-carousel').owlCarousel({
		items: 3,
		dots: false,
		nav: true,
		loop: false,
		margin: 10
	});

	$('.catalog-item-photo-slider__item').click(function () {
		if($(this).hasClass('active')) {
			return false;
		}
		var $th = $(this),
			fullImg = $th.data('full-img'),
			imgContainer = $('.catalog-item-photo__main').find('img');
		imgContainer.attr('src', fullImg);
		$('.catalog-item-photo-slider__item').each(function () {
			$(this).removeClass('active');
		});
		$th.addClass('active');
	});

	$('.cert-list .owl-carousel').owlCarousel({
		items: 4,
		dots: false,
		nav: true,
		loop: false,
		margin: 30
	});

	$('select').styler();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0d2luZG93LmtpbmdwYWNrID0ge307XG5cblx0d2luZG93LmtpbmdwYWNrLmZvcm0gPSAoe1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcblxuXHRcdFx0dmFyIF90aCA9IHRoaXM7XG5cblx0XHRcdCQoJy5qcy1waG9uZScpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKCQuaW5BcnJheShlLmtleUNvZGUsIFs0NiwgOCwgOSwgMjcsIDEzLCAxMTAsIDE5MF0pICE9PSAtMSB8fFxuXHRcdFx0XHRcdChlLmtleUNvZGUgPT0gNjUgJiYgKCBlLmN0cmxLZXkgPT09IHRydWUgfHwgZS5tZXRhS2V5ID09PSB0cnVlICkgKSB8fFxuXHRcdFx0XHRcdChlLmtleUNvZGUgPj0gMzUgJiYgZS5rZXlDb2RlIDw9IDQwKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoKGUuc2hpZnRLZXkgfHwgKGUua2V5Q29kZSA8IDQ4IHx8IGUua2V5Q29kZSA+IDU3KSkgJiYgKGUua2V5Q29kZSA8IDk2IHx8IGUua2V5Q29kZSA+IDEwNSkpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcuanMtcGhvbmUnKS5pbnB1dG1hc2soXCIrNyAoOTk5KSA5OTkgLSA5OSAtIDk5XCIsIHtcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICcgJyxcblx0XHRcdFx0c2hvd01hc2tPbkhvdmVyOmZhbHNlLFxuXHRcdFx0XHRzaG93TWFza09uRm9jdXM6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYgKCFfdGguY2hlY2tGb3JtKCQodGhpcykpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tGb3JtOiBmdW5jdGlvbihmb3JtKXtcblx0XHRcdHZhciBjaGVja1Jlc3VsdCA9IHRydWU7XG5cdFx0XHRmb3JtLmZpbmQoJy53YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ3JlcScpKXtcblx0XHRcdFx0XHRzd2l0Y2goJCh0aGlzKS5kYXRhKCd0eXBlJykpe1xuXHRcdFx0XHRcdFx0Y2FzZSAndGVsJzpcblx0XHRcdFx0XHRcdFx0dmFyIHJlID0gL15bXFwrXT9bKF0/WzAtOV17M31bKV0/Wy1cXHNcXC5dP1swLTldezN9Wy1cXHNcXC5dP1swLTldezQsNn0kL2ltO1xuXHRcdFx0XHRcdFx0XHRpZiAoIXJlLnRlc3QoJCh0aGlzKS52YWwoKSkpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnZW1haWwnOlxuXHRcdFx0XHRcdFx0XHR2YXIgcmUgPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG5cdFx0XHRcdFx0XHRcdGlmICghcmUudGVzdCgkKHRoaXMpLnZhbCgpKSl7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnd2FybmluZycpO1xuXHRcdFx0XHRcdFx0XHRcdGNoZWNrUmVzdWx0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0XHRcdFx0XHRcdGlmICghJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnbW9iaWxlJzpcblx0XHRcdFx0XHRcdFx0aWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKS5sZW5ndGggPCAyMikge1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0aWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSA9PT0gJycpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCcub3JkZXItb25saW5lLWZvcm1fX3NlbGVjdC0tcmVxIC53YXJuaW5nJykucGFyZW50KCkuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdHJldHVybiBjaGVja1Jlc3VsdDtcblxuXHRcdH1cblxuXHR9KS5pbml0KCk7XG5cblx0dmFyIHRpbWVvdXQgPSA1MDAwLFxuXHRcdFx0cHJvbW9TbGlkZXIgPSAkKCcuanMtcHJvbW8gLm93bC1jYXJvdXNlbCcpO1xuXG5cdHByb21vU2xpZGVyLm93bENhcm91c2VsKHtcblx0XHRpdGVtczogMSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiB0cnVlLFxuXHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdGF1dG9wbGF5VGltZW91dDogdGltZW91dCxcblx0XHRkb3RzQ29udGFpbmVyOiAnI293bGRvdHMnLFxuXHRcdG9uQ2hhbmdlZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGxvYWRlciA9ICQoJy5qcy1wcm9tbyAub3dsLWRvdC5hY3RpdmUgLmxvYWRlcicpLkNsYXNzeUxvYWRlcih7XG5cdFx0XHRcdFx0d2lkdGg6IDIzLFxuXHRcdFx0XHRcdGhlaWdodDogMjMsXG5cdFx0XHRcdFx0cGVyY2VudGFnZTogMTAwLFxuXHRcdFx0XHRcdHNwZWVkOiA0MCxcblx0XHRcdFx0XHRhbmltYXRlOiB0cnVlLFxuXHRcdFx0XHRcdHNob3dSZW1haW5pbmc6IGZhbHNlLFxuXHRcdFx0XHRcdHNob3dUZXh0OiBmYWxzZSxcblx0XHRcdFx0XHRkaWFtZXRlcjogMTAsXG5cdFx0XHRcdFx0bGluZUNvbG9yOiAncmdiKDI1MywyMTYsNTMpJyxcblx0XHRcdFx0XHRsaW5lV2lkdGg6IDNcblx0XHRcdFx0fSk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fSk7XG5cblx0dmFyIGhpc3RvcnlTbGlkZXIgPSAkKCcuanMtaGlzdG9yeSAub3dsLWNhcm91c2VsJyk7XG5cblx0aGlzdG9yeVNsaWRlci5vd2xDYXJvdXNlbCh7XG5cdFx0aXRlbXM6IDIsXG5cdFx0ZG90czogZmFsc2UsXG5cdFx0bmF2OiB0cnVlLFxuXHRcdGxvb3A6IGZhbHNlLFxuXHRcdG9uVHJhbnNsYXRlZDogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHR2YXIgZXZlbnRJbmRleCA9IGV2ZW50Lml0ZW0uaW5kZXg7XG5cdFx0XHQkKCcuanMtaGlzdG9yeSAub3dsLWl0ZW0nKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuXHRcdFx0JCgnLmpzLWhpc3RvcnkgLm93bC1pdGVtJykuZXEoZXZlbnRJbmRleCkuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcblxuXG5cdFx0fVxuXHR9KTtcblxuXHR2YXIgcGFydG5lcnNTbGlkZXIgPSAkKCcuanMtcGFybmVycyAub3dsLWNhcm91c2VsJyk7XG5cblx0cGFydG5lcnNTbGlkZXIub3dsQ2Fyb3VzZWwoe1xuXHRcdGl0ZW1zOiA2LFxuXHRcdGRvdHM6IGZhbHNlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiBmYWxzZVxuXHR9KTtcblxuXHQvLyBsb2NhbGl6YXRpb24gZmFuY3lib3hcblxuXHQkKFwiW2RhdGEtZmFuY3lib3hdXCIpLmZhbmN5Ym94KHtcblx0XHRsYW5nIDogJ3J1Jyxcblx0XHRpMThuIDoge1xuXHRcdFx0J3J1JyA6IHtcblx0XHRcdFx0Q0xPU0UgICAgICAgOiAn0JfQsNC60YDRi9GC0YwnLFxuXHRcdFx0XHRORVhUICAgICAgICA6ICfQodC70LXQtNGD0Y7RidC40LknLFxuXHRcdFx0XHRQUkVWICAgICAgICA6ICfQn9GA0LXQtNGL0LTRg9GJ0LjQuScsXG5cdFx0XHRcdEVSUk9SICAgICAgIDogJ9CX0LDQv9GA0L7RiNC10L3QvdGL0Lkg0LrQvtC90YLQtdC90YIg0L3QtSDQvNC+0LbQtdGCINCx0YvRgtGMINC30LDQs9GA0YPQttC10L0uIDxicj4g0J/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDINC/0L7Qt9C20LUuJyxcblx0XHRcdFx0UExBWV9TVEFSVCAgOiAn0J3QsNGH0LDRgtGMINGB0LvQsNC50LQt0YjQvtGDJyxcblx0XHRcdFx0UExBWV9TVE9QICAgOiAn0J7RgdGC0LDQvdC+0LLQuNGC0Ywg0YHQu9Cw0LnQtC3RiNC+0YMnLFxuXHRcdFx0XHRGVUxMX1NDUkVFTiA6ICfQn9C+0LvQvdGL0Lkg0Y3QutGA0LDQvScsXG5cdFx0XHRcdFRIVU1CUyAgICAgIDogJ9Ct0YHQutC40LfRiycsXG5cdFx0XHRcdERPV05MT0FEICAgIDogJ9Ch0LrQsNGH0LDRgtGMJyxcblx0XHRcdFx0U0hBUkUgICAgICAgOiAn0J/QvtC00LXQu9C40YLRjNGB0Y8nLFxuXHRcdFx0XHRaT09NICAgICAgICA6ICfQo9Cy0LXQu9C40YfQuNGC0YwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRidXR0b25zIDogW1xuXHRcdFx0J2Nsb3NlJ1xuXHRcdF0sXG5cdFx0YnRuVHBsIDoge1xuXHRcdFx0YXJyb3dMZWZ0IDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LXByZXYgY2xhc3M9XCJhcnJvdy1wcmV2XCIgdGl0bGU9XCJ7e1BSRVZ9fVwiPjwvYT4nLFxuXHRcdFx0YXJyb3dSaWdodCA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1uZXh0IGNsYXNzPVwiYXJyb3ctbmV4dFwiIHRpdGxlPVwie3tORVhUfX1cIj48L2E+J1xuXHRcdH0sXG5cdH0pO1xuXG5cdCQoXCJbZGF0YS1mYW5jeWJveD0ndmlkZW8nXVwiKS5mYW5jeWJveCh7XG5cdFx0bGFuZyA6ICdydScsXG5cdFx0aTE4biA6IHtcblx0XHRcdCdydScgOiB7XG5cdFx0XHRcdENMT1NFICAgICAgIDogJ9CX0LDQutGA0YvRgtGMJyxcblx0XHRcdFx0TkVYVCAgICAgICAgOiAn0KHQu9C10LTRg9GO0YnQuNC5Jyxcblx0XHRcdFx0UFJFViAgICAgICAgOiAn0J/RgNC10LTRi9C00YPRidC40LknLFxuXHRcdFx0XHRFUlJPUiAgICAgICA6ICfQl9Cw0L/RgNC+0YjQtdC90L3Ri9C5INC60L7QvdGC0LXQvdGCINC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQt9Cw0LPRgNGD0LbQtdC9LiA8YnI+INCf0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgyDQv9C+0LfQttC1LicsXG5cdFx0XHRcdFBMQVlfU1RBUlQgIDogJ9Cd0LDRh9Cw0YLRjCDRgdC70LDQudC0LdGI0L7RgycsXG5cdFx0XHRcdFBMQVlfU1RPUCAgIDogJ9Ce0YHRgtCw0L3QvtCy0LjRgtGMINGB0LvQsNC50LQt0YjQvtGDJyxcblx0XHRcdFx0RlVMTF9TQ1JFRU4gOiAn0J/QvtC70L3Ri9C5INGN0LrRgNCw0L0nLFxuXHRcdFx0XHRUSFVNQlMgICAgICA6ICfQrdGB0LrQuNC30YsnLFxuXHRcdFx0XHRET1dOTE9BRCAgICA6ICfQodC60LDRh9Cw0YLRjCcsXG5cdFx0XHRcdFNIQVJFICAgICAgIDogJ9Cf0L7QtNC10LvQuNGC0YzRgdGPJyxcblx0XHRcdFx0Wk9PTSAgICAgICAgOiAn0KPQstC10LvQuNGH0LjRgtGMJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnV0dG9ucyA6IFtcblx0XHRcdCdjbG9zZSdcblx0XHRdLFxuXHRcdGJ0blRwbCA6IHtcblx0XHRcdGFycm93TGVmdCA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1wcmV2IGNsYXNzPVwiYXJyb3ctcHJldlwiIHRpdGxlPVwie3tQUkVWfX1cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2E+Jyxcblx0XHRcdGFycm93UmlnaHQgOiAnPGEgaHJlZj1cIlwiIGRhdGEtZmFuY3lib3gtbmV4dCBjbGFzcz1cImFycm93LW5leHRcIiB0aXRsZT1cInt7TkVYVH19XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PC9hPidcblx0XHR9LFxuXHR9KTtcblxuXHQkKFwiW2RhdGEtZmFuY3lib3g9J2Jhc2UnXVwiKS5mYW5jeWJveCh7XG5cdFx0bGFuZyA6ICdydScsXG5cdFx0aTE4biA6IHtcblx0XHRcdCdydScgOiB7XG5cdFx0XHRcdENMT1NFICAgICAgIDogJ9CX0LDQutGA0YvRgtGMJyxcblx0XHRcdFx0TkVYVCAgICAgICAgOiAn0KHQu9C10LTRg9GO0YnQuNC5Jyxcblx0XHRcdFx0UFJFViAgICAgICAgOiAn0J/RgNC10LTRi9C00YPRidC40LknLFxuXHRcdFx0XHRFUlJPUiAgICAgICA6ICfQl9Cw0L/RgNC+0YjQtdC90L3Ri9C5INC60L7QvdGC0LXQvdGCINC90LUg0LzQvtC20LXRgiDQsdGL0YLRjCDQt9Cw0LPRgNGD0LbQtdC9LiA8YnI+INCf0L7QstGC0L7RgNC40YLQtSDQv9C+0L/Ri9GC0LrRgyDQv9C+0LfQttC1LicsXG5cdFx0XHRcdFBMQVlfU1RBUlQgIDogJ9Cd0LDRh9Cw0YLRjCDRgdC70LDQudC0LdGI0L7RgycsXG5cdFx0XHRcdFBMQVlfU1RPUCAgIDogJ9Ce0YHRgtCw0L3QvtCy0LjRgtGMINGB0LvQsNC50LQt0YjQvtGDJyxcblx0XHRcdFx0RlVMTF9TQ1JFRU4gOiAn0J/QvtC70L3Ri9C5INGN0LrRgNCw0L0nLFxuXHRcdFx0XHRUSFVNQlMgICAgICA6ICfQrdGB0LrQuNC30YsnLFxuXHRcdFx0XHRET1dOTE9BRCAgICA6ICfQodC60LDRh9Cw0YLRjCcsXG5cdFx0XHRcdFNIQVJFICAgICAgIDogJ9Cf0L7QtNC10LvQuNGC0YzRgdGPJyxcblx0XHRcdFx0Wk9PTSAgICAgICAgOiAn0KPQstC10LvQuNGH0LjRgtGMJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YnV0dG9ucyA6IFtcblx0XHRcdCdjbG9zZSdcblx0XHRdLFxuXHRcdGJ0blRwbCA6IHtcblx0XHRcdGFycm93TGVmdCA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1wcmV2IGNsYXNzPVwiYXJyb3ctcHJldlwiIHRpdGxlPVwie3tQUkVWfX1cIj48L2E+Jyxcblx0XHRcdGFycm93UmlnaHQgOiAnPGEgaHJlZj1cIlwiIGRhdGEtZmFuY3lib3gtbmV4dCBjbGFzcz1cImFycm93LW5leHRcIiB0aXRsZT1cInt7TkVYVH19XCI+PC9hPidcblx0XHR9LFxuXHRcdHRodW1icyA6IHtcblx0XHRcdGF1dG9TdGFydCAgIDogdHJ1ZSwgICAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IHRodW1ibmFpbHMgb24gb3BlbmluZ1xuXHRcdFx0aGlkZU9uQ2xvc2UgOiB0cnVlLCAgICAgICAgICAgICAgICAgICAvLyBIaWRlIHRodW1ibmFpbCBncmlkIHdoZW4gY2xvc2luZyBhbmltYXRpb24gc3RhcnRzXG5cdFx0XHRwYXJlbnRFbCAgICA6ICcuZmFuY3lib3gtaW5uZXInLCAgLy8gQ29udGFpbmVyIGlzIGluamVjdGVkIGludG8gdGhpcyBlbGVtZW50XG5cdFx0XHRheGlzICAgICAgICA6ICd4JyAgICAgICAgICAgICAgICAgICAgIC8vIFZlcnRpY2FsICh5KSBvciBob3Jpem9udGFsICh4KSBzY3JvbGxpbmdcblx0XHR9LFxuXHR9KTtcblxuXHQkKFwiLnByb21vLXNsaWRlcl9fYnV0dG9uW2hyZWY9JyNmYXEnXSwgLmZhcS1wYWdlX19idXR0b25cIikuZmFuY3lib3goe1xuXHRcdGxhbmcgOiAncnUnLFxuXHRcdGkxOG4gOiB7XG5cdFx0XHQncnUnIDoge1xuXHRcdFx0XHRDTE9TRSAgICAgICA6ICfQl9Cw0LrRgNGL0YLRjCcsXG5cdFx0XHRcdE5FWFQgICAgICAgIDogJ9Ch0LvQtdC00YPRjtGJ0LjQuScsXG5cdFx0XHRcdFBSRVYgICAgICAgIDogJ9Cf0YDQtdC00YvQtNGD0YnQuNC5Jyxcblx0XHRcdFx0RVJST1IgICAgICAgOiAn0JfQsNC/0YDQvtGI0LXQvdC90YvQuSDQutC+0L3RgtC10L3RgiDQvdC1INC80L7QttC10YIg0LHRi9GC0Ywg0LfQsNCz0YDRg9C20LXQvS4gPGJyPiDQn9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMg0L/QvtC30LbQtS4nLFxuXHRcdFx0XHRQTEFZX1NUQVJUICA6ICfQndCw0YfQsNGC0Ywg0YHQu9Cw0LnQtC3RiNC+0YMnLFxuXHRcdFx0XHRQTEFZX1NUT1AgICA6ICfQntGB0YLQsNC90L7QstC40YLRjCDRgdC70LDQudC0LdGI0L7RgycsXG5cdFx0XHRcdEZVTExfU0NSRUVOIDogJ9Cf0L7Qu9C90YvQuSDRjdC60YDQsNC9Jyxcblx0XHRcdFx0VEhVTUJTICAgICAgOiAn0K3RgdC60LjQt9GLJyxcblx0XHRcdFx0RE9XTkxPQUQgICAgOiAn0KHQutCw0YfQsNGC0YwnLFxuXHRcdFx0XHRTSEFSRSAgICAgICA6ICfQn9C+0LTQtdC70LjRgtGM0YHRjycsXG5cdFx0XHRcdFpPT00gICAgICAgIDogJ9Cj0LLQtdC70LjRh9C40YLRjCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJ1dHRvbnMgOiBbXSxcblx0XHRidG5UcGwgOiB7XG5cdFx0XHRzbWFsbEJ0biAgIDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LWNsb3NlPVwiZGF0YS1mYW5jeWJveC1jbG9zZVwiIGNsYXNzPVwicG9wdXAtY2xvc2VcIiB0aXRsZT1cInt7Q0xPU0V9fVwiPjwvYT4nLFxuXHRcdFx0YXJyb3dMZWZ0IDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LXByZXYgY2xhc3M9XCJhcnJvdy1wcmV2XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIiB0aXRsZT1cInt7UFJFVn19XCI+PC9hPicsXG5cdFx0XHRhcnJvd1JpZ2h0IDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LW5leHQgY2xhc3M9XCJhcnJvdy1uZXh0XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIiB0aXRsZT1cInt7TkVYVH19XCI+PC9hPidcblx0XHR9XG5cdH0pO1xuXG5cdCQoXCIucHJvbW8tc2xpZGVyX19idXR0b25baHJlZj0nI3JldmlldyddLCAucmV2aWV3cy1jbGllbnQtc2xpZGVyX19saW5rLXBvcHVwXCIpLmZhbmN5Ym94KHtcblx0XHRsYW5nIDogJ3J1Jyxcblx0XHRpMThuIDoge1xuXHRcdFx0J3J1JyA6IHtcblx0XHRcdFx0Q0xPU0UgICAgICAgOiAn0JfQsNC60YDRi9GC0YwnLFxuXHRcdFx0XHRORVhUICAgICAgICA6ICfQodC70LXQtNGD0Y7RidC40LknLFxuXHRcdFx0XHRQUkVWICAgICAgICA6ICfQn9GA0LXQtNGL0LTRg9GJ0LjQuScsXG5cdFx0XHRcdEVSUk9SICAgICAgIDogJ9CX0LDQv9GA0L7RiNC10L3QvdGL0Lkg0LrQvtC90YLQtdC90YIg0L3QtSDQvNC+0LbQtdGCINCx0YvRgtGMINC30LDQs9GA0YPQttC10L0uIDxicj4g0J/QvtCy0YLQvtGA0LjRgtC1INC/0L7Qv9GL0YLQutGDINC/0L7Qt9C20LUuJyxcblx0XHRcdFx0UExBWV9TVEFSVCAgOiAn0J3QsNGH0LDRgtGMINGB0LvQsNC50LQt0YjQvtGDJyxcblx0XHRcdFx0UExBWV9TVE9QICAgOiAn0J7RgdGC0LDQvdC+0LLQuNGC0Ywg0YHQu9Cw0LnQtC3RiNC+0YMnLFxuXHRcdFx0XHRGVUxMX1NDUkVFTiA6ICfQn9C+0LvQvdGL0Lkg0Y3QutGA0LDQvScsXG5cdFx0XHRcdFRIVU1CUyAgICAgIDogJ9Ct0YHQutC40LfRiycsXG5cdFx0XHRcdERPV05MT0FEICAgIDogJ9Ch0LrQsNGH0LDRgtGMJyxcblx0XHRcdFx0U0hBUkUgICAgICAgOiAn0J/QvtC00LXQu9C40YLRjNGB0Y8nLFxuXHRcdFx0XHRaT09NICAgICAgICA6ICfQo9Cy0LXQu9C40YfQuNGC0YwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRidXR0b25zIDogW10sXG5cdFx0YnRuVHBsIDoge1xuXHRcdFx0c21hbGxCdG4gICA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1jbG9zZT1cImRhdGEtZmFuY3lib3gtY2xvc2VcIiBjbGFzcz1cInBvcHVwLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2E+Jyxcblx0XHRcdGFycm93TGVmdCA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1wcmV2IGNsYXNzPVwiYXJyb3ctcHJldlwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgdGl0bGU9XCJ7e1BSRVZ9fVwiPjwvYT4nLFxuXHRcdFx0YXJyb3dSaWdodCA6ICc8YSBocmVmPVwiXCIgZGF0YS1mYW5jeWJveC1uZXh0IGNsYXNzPVwiYXJyb3ctbmV4dFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgdGl0bGU9XCJ7e05FWFR9fVwiPjwvYT4nXG5cdFx0fVxuXHR9KTtcblxuXHQkKFwiLnByb21vLXNsaWRlcl9fYnV0dG9uW2hyZWY9JyN2YWMnXSwgLnZhY2FuY3ktYWNjb3JkaW9uX19idXR0b25cIikuZmFuY3lib3goe1xuXHRcdGxhbmcgOiAncnUnLFxuXHRcdGkxOG4gOiB7XG5cdFx0XHQncnUnIDoge1xuXHRcdFx0XHRDTE9TRSAgICAgICA6ICfQl9Cw0LrRgNGL0YLRjCcsXG5cdFx0XHRcdE5FWFQgICAgICAgIDogJ9Ch0LvQtdC00YPRjtGJ0LjQuScsXG5cdFx0XHRcdFBSRVYgICAgICAgIDogJ9Cf0YDQtdC00YvQtNGD0YnQuNC5Jyxcblx0XHRcdFx0RVJST1IgICAgICAgOiAn0JfQsNC/0YDQvtGI0LXQvdC90YvQuSDQutC+0L3RgtC10L3RgiDQvdC1INC80L7QttC10YIg0LHRi9GC0Ywg0LfQsNCz0YDRg9C20LXQvS4gPGJyPiDQn9C+0LLRgtC+0YDQuNGC0LUg0L/QvtC/0YvRgtC60YMg0L/QvtC30LbQtS4nLFxuXHRcdFx0XHRQTEFZX1NUQVJUICA6ICfQndCw0YfQsNGC0Ywg0YHQu9Cw0LnQtC3RiNC+0YMnLFxuXHRcdFx0XHRQTEFZX1NUT1AgICA6ICfQntGB0YLQsNC90L7QstC40YLRjCDRgdC70LDQudC0LdGI0L7RgycsXG5cdFx0XHRcdEZVTExfU0NSRUVOIDogJ9Cf0L7Qu9C90YvQuSDRjdC60YDQsNC9Jyxcblx0XHRcdFx0VEhVTUJTICAgICAgOiAn0K3RgdC60LjQt9GLJyxcblx0XHRcdFx0RE9XTkxPQUQgICAgOiAn0KHQutCw0YfQsNGC0YwnLFxuXHRcdFx0XHRTSEFSRSAgICAgICA6ICfQn9C+0LTQtdC70LjRgtGM0YHRjycsXG5cdFx0XHRcdFpPT00gICAgICAgIDogJ9Cj0LLQtdC70LjRh9C40YLRjCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJ1dHRvbnMgOiBbXSxcblx0XHRidG5UcGwgOiB7XG5cdFx0XHRzbWFsbEJ0biAgIDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LWNsb3NlPVwiZGF0YS1mYW5jeWJveC1jbG9zZVwiIGNsYXNzPVwicG9wdXAtY2xvc2VcIiB0aXRsZT1cInt7Q0xPU0V9fVwiPjwvYT4nLFxuXHRcdFx0YXJyb3dMZWZ0IDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LXByZXYgY2xhc3M9XCJhcnJvdy1wcmV2XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIiB0aXRsZT1cInt7UFJFVn19XCI+PC9hPicsXG5cdFx0XHRhcnJvd1JpZ2h0IDogJzxhIGhyZWY9XCJcIiBkYXRhLWZhbmN5Ym94LW5leHQgY2xhc3M9XCJhcnJvdy1uZXh0XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIiB0aXRsZT1cInt7TkVYVH19XCI+PC9hPidcblx0XHR9XG5cdH0pO1xuXG5cdGlmKCQoJyNtYXAtY2hlbHlhYmluc2snKS5sZW5ndGgpIHtcblx0XHR5bWFwcy5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKCdtYXAtY2hlbHlhYmluc2snLCB7XG5cdFx0XHRcdFx0Y2VudGVyOiBbNTUuMDg5NDcwLCA2MS4zODI2MjldLFxuXHRcdFx0XHRcdHpvb206IDE3LFxuXHRcdFx0XHRcdGNvbnRyb2xzOiBbXVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRteU1hcC5nZW9PYmplY3RzLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKG15TWFwLmdldENlbnRlcigpLCB7XG5cdFx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxuXHRcdFx0XHRcdFx0aWNvbkltYWdlSHJlZiA6ICcuL2ltZy9waW4ucG5nJyxcblx0XHRcdFx0XHRcdGljb25JbWFnZVNpemU6IFs1MiwgNjldLFxuXHRcdFx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTMwLCAtNzBdLFxuXHRcdFx0XHRcdFx0Y3Vyc29yOiAnZGVmYXVsdCdcblx0XHRcdFx0fSkpXG5cdFx0fSk7XG5cdH1cblxuXHRpZigkKCcjbWFwLW1vc2NvdycpLmxlbmd0aCkge1xuXHRcdHltYXBzLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBteU1hcCA9IG5ldyB5bWFwcy5NYXAoJ21hcC1tb3Njb3cnLCB7XG5cdFx0XHRcdGNlbnRlcjogWzU1Ljc4NjYyNywgMzcuNzQwNDcxXSxcblx0XHRcdFx0em9vbTogMTcsXG5cdFx0XHRcdGNvbnRyb2xzOiBbXVxuXHRcdFx0fSk7XG5cblx0XHRcdG15TWFwLmdlb09iamVjdHMuYWRkKG5ldyB5bWFwcy5QbGFjZW1hcmsobXlNYXAuZ2V0Q2VudGVyKCksIHtcblx0XHRcdH0sIHtcblx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxuXHRcdFx0XHRpY29uSW1hZ2VIcmVmIDogJy4vaW1nL3Bpbi5wbmcnLFxuXHRcdFx0XHRpY29uSW1hZ2VTaXplOiBbNTIsIDY5XSxcblx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTMwLCAtNzBdLFxuXHRcdFx0XHRjdXJzb3I6ICdkZWZhdWx0J1xuXHRcdFx0fSkpXG5cdFx0fSk7XG5cdH1cblxuXHRpZigkKCcjbWFwLWt6JykubGVuZ3RoKSB7XG5cdFx0eW1hcHMucmVhZHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG15TWFwID0gbmV3IHltYXBzLk1hcCgnbWFwLWt6Jywge1xuXHRcdFx0XHRjZW50ZXI6IFs0OS44NDA1ODMsIDczLjA4MDk2OF0sXG5cdFx0XHRcdHpvb206IDE2LFxuXHRcdFx0XHRjb250cm9sczogW11cblx0XHRcdH0pO1xuXG5cdFx0XHRteU1hcC5nZW9PYmplY3RzLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKG15TWFwLmdldENlbnRlcigpLCB7XG5cdFx0XHR9LCB7XG5cdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcblx0XHRcdFx0aWNvbkltYWdlSHJlZiA6ICcuL2ltZy9waW4ucG5nJyxcblx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzUyLCA2OV0sXG5cdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0zMCwgLTcwXSxcblx0XHRcdFx0Y3Vyc29yOiAnZGVmYXVsdCdcblx0XHRcdH0pKVxuXHRcdH0pO1xuXHR9XG5cblx0JChcIi5jZXJ0X190aXRsZVwiKS5kb3Rkb3Rkb3Qoe1xuXHRcdGhlaWdodDogNTBcblx0fSk7XG5cblxuXG5cdCQoJy5jb250YWN0LWZvcm1fX2lucHV0Jykub24oJ2NoYW5nZSwga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XG5cblx0XHRpZigkKHRoaXMpLnZhbCgpID09PSAnJykge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcub3JkZXItb25saW5lLWZvcm1fX2lucHV0Jykub24oJ2NoYW5nZSwga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XG5cblx0XHRpZigkKHRoaXMpLnZhbCgpID09PSAnJykge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcub3JkZXItZm9ybV9faW5wdXQnKS5vbignY2xpY2sgLGNoYW5nZSwga2V5dXAnLCBmdW5jdGlvbiAoKSB7XG5cdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XG5cblx0XHRpZigkKHRoaXMpLnZhbCgpID09PSAnJykge1xuXHRcdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCdhW2hyZWZePVwiI1wiXScpLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcblx0XHRpZigkKHRoaXMpLmF0dHIoJ2hyZWYnKSA9PT0gJyN0b3AnKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAzMDApO1xuXHRcdH0gZWxzZSBpZigkKHRoaXMpLmF0dHIoJ2hyZWYnKSA9PT0gJyMnIHx8ICQodGhpcykuZGF0YSgnZmFuY3lib3gnKSkge1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBhbmNob3IgPSAkKHRoaXMpO1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcblx0XHRcdFx0c2Nyb2xsVG9wOiAkKGFuY2hvci5hdHRyKCdocmVmJykpLm9mZnNldCgpLnRvcCAtIDQwXG5cdFx0XHR9LCAxMDAwKTtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdH0pO1xuXG5cdHZhciBTbGlkZXJQYWNrUHJvZHVjdCA9ICQoJy5qcy1wYWNrLXNsaWRlci1wcm9kdWN0IC5vd2wtY2Fyb3VzZWwnKTtcblx0dmFyIFNsaWRlclBhY2tQYWNrID0gJCgnLmpzLXBhY2stc2xpZGVyLXBhY2sgLm93bC1jYXJvdXNlbCcpO1xuXG5cdFNsaWRlclBhY2tQcm9kdWN0Lm93bENhcm91c2VsKHtcblx0XHRpdGVtczogMSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiB0cnVlLFxuXHRcdGRvdHNDb250YWluZXI6ICcub3dsLWN1c3RvbS1wYWNrJ1xuXHR9KTtcblxuXHRTbGlkZXJQYWNrUGFjay5vd2xDYXJvdXNlbCh7XG5cdFx0aXRlbXM6IDEsXG5cdFx0ZG90czogdHJ1ZSxcblx0XHRuYXY6IHRydWUsXG5cdFx0bG9vcDogdHJ1ZSxcblx0XHRkb3RzQ29udGFpbmVyOiAnLm93bC1jdXN0b20tcGFjay1wJ1xuXHR9KTtcblxuXHQvKiDQmNC90LTQuNCy0LjQtNGD0LDQu9GM0L3QsNGPINGD0L/QsNC60L7QstC60LAgKi9cblxuXHQkKCcucHJvbW8tdG9wLXRhYnNfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGRhdGFUYWJzID0gJCh0aGlzKS5kYXRhKCd0YWInKTtcblxuXHRcdCQoJy5wcm9tby10b3AtdGFicycpLmZpbmQoJy5wcm9tby10b3AtdGFic19faXRlbScpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0fSk7XG5cdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHQkKCcucHJvbW8tdG9wX19zbGlkZXJzJykuZmluZCgnLnByb21vLXRvcC1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0XHRpZigkKHRoaXMpLmRhdGEoJ3RhYicpID09PSBkYXRhVGFicykge1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0JCgnLmV4YW1wbGUtYWNjb3JkaW9uX19saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdjdXJyZW50JykpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0dmFyICR0aCA9ICQodGhpcyk7XG5cdFx0JCgnLmV4YW1wbGUtYWNjb3JkaW9uX19saW5rLmN1cnJlbnQnKS5zaWJsaW5ncygnLmV4YW1wbGUtYWNjb3JkaW9uX19kZXNjJykuZmlyc3QoKS5zbGlkZVVwKDQwMCk7XG5cblx0XHQkKHRoaXMpLnNpYmxpbmdzKCcuZXhhbXBsZS1hY2NvcmRpb25fX2Rlc2MnKS5maXJzdCgpLnNsaWRlRG93big0MDAsIGZ1bmN0aW9uICgpIHtcblx0XHRcdCQoJy5leGFtcGxlLWFjY29yZGlvbl9fbGluay5jdXJyZW50JykucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHRcdCR0aC5hZGRDbGFzcygnY3VycmVudCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR2YXIgcXVhbGl0eVNsaWRlciA9ICQoJy5qcy1xdWFsaXR5LXNsaWRlcicpLmZpbmQoJy5vd2wtY2Fyb3VzZWwnKTtcblxuXHRxdWFsaXR5U2xpZGVyLm93bENhcm91c2VsKHtcblx0XHRpdGVtczogMyxcblx0XHRzbGlkZUJ5OiAzLFxuXHRcdGRvdHM6IGZhbHNlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiBmYWxzZSxcblx0XHRtYXJnaW46MzAsXG5cdFx0b25Jbml0aWFsaXplZDogZnVuY3Rpb24oZSkge1xuXHRcdFx0JCgnLm93bC1jb3VudCcpLnRleHQoJzEgLyAnICsgdGhpcy5pdGVtcygpLmxlbmd0aCAvIDMpO1xuXHRcdH1cblx0fSk7XG5cdHF1YWxpdHlTbGlkZXIub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24oZSkge1xuXHRcdCQoJy5vd2wtY291bnQnKS50ZXh0KE1hdGgucm91bmQoKytlLml0ZW0uaW5kZXggLyAzICsgMSkgICsgJyAvICcgKyBlLml0ZW0uY291bnQgLyAzKVxuXHR9KTtcblxuXHR2YXIgcHJvZHVjdGlvblNsaWRlciA9ICQoJy5qcy1wcm9kdWN0b24tc2xpZGVyJykuZmluZCgnLm93bC1jYXJvdXNlbCcpO1xuXG5cdHByb2R1Y3Rpb25TbGlkZXIub3dsQ2Fyb3VzZWwoe1xuXHRcdGl0ZW1zOiA4LFxuXHRcdGRvdHM6IGZhbHNlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiB0cnVlXG5cdH0pO1xuXG5cdHZhciByZXZpZXdzU2xpZGVyID0gJCgnLmpzLXJldmlld3Mtc2xpZGVyJykuZmluZCgnLm93bC1jYXJvdXNlbCcpO1xuXG5cdHJldmlld3NTbGlkZXIub3dsQ2Fyb3VzZWwoe1xuXHRcdGl0ZW1zOiAxLFxuXHRcdGRvdHM6IHRydWUsXG5cdFx0bmF2OiB0cnVlLFxuXHRcdGxvb3A6IHRydWUsXG5cdFx0bWFyZ2luOiAzMCxcblx0XHRhdXRvcGxheTogdHJ1ZSxcblx0XHRhdXRvcGxheVRpbWVvdXQ6IHRpbWVvdXQsXG5cdFx0ZG90c0NvbnRhaW5lcjogJyNvd2xkb3RzJyxcblx0XHRvbkNoYW5nZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdCQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBsb2FkZXIgPSAkKCcuanMtcmV2aWV3cy1zbGlkZXIgLm93bC1kb3QuYWN0aXZlIC5sb2FkZXInKS5DbGFzc3lMb2FkZXIoe1xuXHRcdFx0XHRcdHdpZHRoOiAyMyxcblx0XHRcdFx0XHRoZWlnaHQ6IDIzLFxuXHRcdFx0XHRcdHBlcmNlbnRhZ2U6IDEwMCxcblx0XHRcdFx0XHRzcGVlZDogNDAsXG5cdFx0XHRcdFx0YW5pbWF0ZTogdHJ1ZSxcblx0XHRcdFx0XHRzaG93UmVtYWluaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRzaG93VGV4dDogZmFsc2UsXG5cdFx0XHRcdFx0ZGlhbWV0ZXI6IDEwLFxuXHRcdFx0XHRcdGxpbmVDb2xvcjogJ3JnYigyNTMsMjE2LDUzKScsXG5cdFx0XHRcdFx0bGluZVdpZHRoOiAzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSlcblx0XHR9XG5cdH0pO1xuXG5cdHZhciBmYXFTbGlkZXIgPSAkKCcuanMtZmFxLXNsaWRlcicpLmZpbmQoJy5vd2wtY2Fyb3VzZWwnKTtcblxuXHRmYXFTbGlkZXIub3dsQ2Fyb3VzZWwoe1xuXHRcdGl0ZW1zOiAxLFxuXHRcdGRvdHM6IGZhbHNlLFxuXHRcdG5hdjogdHJ1ZSxcblx0XHRsb29wOiBmYWxzZSxcblx0XHRtYXJnaW46MzAsXG5cdFx0b25Jbml0aWFsaXplZDogZnVuY3Rpb24oZSkge1xuXHRcdFx0JCgnLmZhcS1jb3VudCcpLnRleHQoJzEgLyAnICsgdGhpcy5pdGVtcygpLmxlbmd0aCk7XG5cdFx0fVxuXHR9KTtcblxuXHRmYXFTbGlkZXIub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24oZSkge1xuXHRcdCQoJy5mYXEtY291bnQnKS50ZXh0KCsrZS5pdGVtLmluZGV4ICArICcgLyAnICsgZS5pdGVtLmNvdW50KVxuXHR9KTtcblxuXHQkKCcuZmFxLWFjY29yZGlvbl9fbGluaycpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblxuXHQkKCcuZmFxLWFjY29yZGlvbl9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRpZiAoJCh0aGlzKS5oYXNDbGFzcygnY3VycmVudCcpKSB7XG5cdFx0XHQkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5mYXEtYWNjb3JkaW9uX19kZXNjJykuc2xpZGVVcCg0MDApO1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgJHRoID0gJCh0aGlzKTtcblx0XHRcdCR0aC5zaWJsaW5ncygnLmZhcS1hY2NvcmRpb25fX2l0ZW0uY3VycmVudCcpLmZpbmQoJy5mYXEtYWNjb3JkaW9uX19kZXNjJykuZmlyc3QoKS5zbGlkZVVwKDQwMCk7XG5cblx0XHRcdCR0aC5maW5kKCcuZmFxLWFjY29yZGlvbl9fZGVzYycpLmZpcnN0KCkuc2xpZGVEb3duKDQwMCwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYXEtYWNjb3JkaW9uX19pdGVtLmN1cnJlbnQnKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuXHRcdFx0XHQkdGguYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gRGVsaXZlcnlcblxuXHQkKCdodG1sJykub24oJ2NsaWNrJywgJy5kZWxpdmVyeS1saW5rc19faXRlbScsIGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciBkZWxpdmVyeURhdGEgPSAkKHRoaXMpLmRhdGEoJ3RhYicpO1xuXG5cdFx0aWYoJCh0aGlzKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblxuXHRcdCQoJy5kZWxpdmVyeS1saW5rc19faXRlbS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cblx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuXHRcdCQoJy5kZWxpdmVyeS10YWJzJykuZmluZCgnLmRlbGl2ZXJ5LXRhYicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cblx0XHRcdGlmKCQodGhpcykuZGF0YSgndGFiJykgPT09IGRlbGl2ZXJ5RGF0YSkge1xuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cblx0Ly8gVmFjYW5jeVxuXG5cdCQoJy52YWNhbmN5LWFjY29yZGlvbl9fbGluaycpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR9KTtcblxuXHQkKCcudmFjYW5jeS1hY2NvcmRpb25fX2xpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciAkdGggPSAkKHRoaXMpLnBhcmVudCgnLnZhY2FuY3ktYWNjb3JkaW9uX19pdGVtJyk7XG5cblx0XHRpZigkdGguaGFzQ2xhc3MoJ2N1cnJlbnQnKSkge1xuXHRcdFx0JHRoLmZpbmQoJy52YWNhbmN5LWFjY29yZGlvbl9fZGVzYycpLmZpcnN0KCkuc2xpZGVVcCg0MDApO1xuXHRcdFx0JHRoLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0aC5maW5kKCcudmFjYW5jeS1hY2NvcmRpb25fX2Rlc2MnKS5maXJzdCgpLnNsaWRlRG93big0MDApO1xuXHRcdFx0JHRoLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cdFx0fVxuXHR9KTtcblxuXHQvL1x0Q2F0YWxvZyBjYXRlZ29yeVxuXG5cdCQoJy5qcy1vcGVuLXRleHQnKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuJykpIHtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdCQodGhpcykudGV4dCgn0J/QvtC60LDQt9Cw0YLRjCDQtdGJ0ZEnKTtcblx0XHRcdCQodGhpcykuc2libGluZ3MoJy5kZXNjcmlwdGlvbl9fZGVzYycpLmFkZENsYXNzKCdoaWRlLXRleHQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnb3BlbicpO1xuXHRcdFx0JCh0aGlzKS50ZXh0KCfQodC60YDRi9GC0YwnKTtcblx0XHRcdCQodGhpcykuc2libGluZ3MoJy5kZXNjcmlwdGlvbl9fZGVzYycpLnJlbW92ZUNsYXNzKCdoaWRlLXRleHQnKTtcblx0XHR9XG5cdH0pO1xuXG5cdCQoJy5yZXZpZXdzLWNsaWVudC1zbGlkZXJfX2Rlc2MgcCcpLmRvdGRvdGRvdCh7XG5cdFx0aGVpZ2h0OiAyMDhcblx0fSk7XG5cblx0JCgnLmNhdGFsb2ctaXRlbS1waG90by1zbGlkZXIgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcblx0XHRpdGVtczogMyxcblx0XHRkb3RzOiBmYWxzZSxcblx0XHRuYXY6IHRydWUsXG5cdFx0bG9vcDogZmFsc2UsXG5cdFx0bWFyZ2luOiAxMFxuXHR9KTtcblxuXHQkKCcuY2F0YWxvZy1pdGVtLXBob3RvLXNsaWRlcl9faXRlbScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHR2YXIgJHRoID0gJCh0aGlzKSxcblx0XHRcdGZ1bGxJbWcgPSAkdGguZGF0YSgnZnVsbC1pbWcnKSxcblx0XHRcdGltZ0NvbnRhaW5lciA9ICQoJy5jYXRhbG9nLWl0ZW0tcGhvdG9fX21haW4nKS5maW5kKCdpbWcnKTtcblx0XHRpbWdDb250YWluZXIuYXR0cignc3JjJywgZnVsbEltZyk7XG5cdFx0JCgnLmNhdGFsb2ctaXRlbS1waG90by1zbGlkZXJfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXHRcdCR0aC5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdH0pO1xuXG5cdCQoJy5jZXJ0LWxpc3QgLm93bC1jYXJvdXNlbCcpLm93bENhcm91c2VsKHtcblx0XHRpdGVtczogNCxcblx0XHRkb3RzOiBmYWxzZSxcblx0XHRuYXY6IHRydWUsXG5cdFx0bG9vcDogZmFsc2UsXG5cdFx0bWFyZ2luOiAzMFxuXHR9KTtcblxuXHQkKCdzZWxlY3QnKS5zdHlsZXIoKTtcbn0pO1xuIl0sImZpbGUiOiJtYWluLmpzIn0=
