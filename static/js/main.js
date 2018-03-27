﻿
$(document).ready(function() {
  window.kingpack = {};

  window.kingpack.form = ({

    init: function() {

      var _th = this;

      $('.js-phone').keydown(function(e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
          (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.keyCode >= 35 && e.keyCode <= 40)) {
          return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      });

      $('.js-phone').inputmask("+7 (999) 999 - 99 - 99", {
        placeholder: ' ',
        showMaskOnHover: false,
        showMaskOnFocus: false
      });

      $('.last-slide form').submit(function(e) {
        if (!_th.checkForm($(this))) {
          return false;
        }
      });

      $('.quiz-form').submit(function(e) {
        if (!_th.checkForm($(this))) {
          return false;
        }
      });
    },

    checkForm: function(form) {
      var checkResult = true;
      form.find('.warning').removeClass('warning');
      form.find('input, textarea, select').each(function() {
        if ($(this).data('req')) {
          switch ($(this).data('type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test($(this).val())) {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test($(this).val())) {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
            case 'checkbox':
              if (!$(this).is(':checked')) {
                $(this).parent().addClass('warning');
                checkResult = false;
              }
              break;
            case 'radio':
							if (!$('.jq-radio').hasClass('checked')) {
									$('.jq-radio').addClass('warning');
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
              if ($.trim($(this).val()) === '') {
                $(this).addClass('warning');
                checkResult = false;
              }
              break;
          }
        }
      });
      return checkResult;
    }

  }).init();

  $('.contacts-form__input').on('click ,change, keyup', function() {
    $(this).siblings('label').hide();

    if ($(this).val() === '') {
      $(this).siblings('label').show();
    }
  });

	$('.quiz-input-item input').on('click ,change, keyup', function() {
		$(this).siblings('label').hide();

		if ($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});


  $('input, select').styler();
});
