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
