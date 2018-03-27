
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5raW5ncGFjayA9IHt9O1xuXG4gIHdpbmRvdy5raW5ncGFjay5mb3JtID0gKHtcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgX3RoID0gdGhpcztcblxuICAgICAgJCgnLmpzLXBob25lJykua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICgkLmluQXJyYXkoZS5rZXlDb2RlLCBbNDYsIDgsIDksIDI3LCAxMywgMTEwLCAxOTBdKSAhPT0gLTEgfHxcbiAgICAgICAgICAoZS5rZXlDb2RlID09IDY1ICYmIChlLmN0cmxLZXkgPT09IHRydWUgfHwgZS5tZXRhS2V5ID09PSB0cnVlKSkgfHxcbiAgICAgICAgICAoZS5rZXlDb2RlID49IDM1ICYmIGUua2V5Q29kZSA8PSA0MCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChlLnNoaWZ0S2V5IHx8IChlLmtleUNvZGUgPCA0OCB8fCBlLmtleUNvZGUgPiA1NykpICYmIChlLmtleUNvZGUgPCA5NiB8fCBlLmtleUNvZGUgPiAxMDUpKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnLmpzLXBob25lJykuaW5wdXRtYXNrKFwiKzcgKDk5OSkgOTk5IC0gOTkgLSA5OVwiLCB7XG4gICAgICAgIHBsYWNlaG9sZGVyOiAnICcsXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXG4gICAgICAgIHNob3dNYXNrT25Gb2N1czogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICAkKCcubGFzdC1zbGlkZSBmb3JtJykuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCFfdGguY2hlY2tGb3JtKCQodGhpcykpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnLnF1aXotZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghX3RoLmNoZWNrRm9ybSgkKHRoaXMpKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNoZWNrRm9ybTogZnVuY3Rpb24oZm9ybSkge1xuICAgICAgdmFyIGNoZWNrUmVzdWx0ID0gdHJ1ZTtcbiAgICAgIGZvcm0uZmluZCgnLndhcm5pbmcnKS5yZW1vdmVDbGFzcygnd2FybmluZycpO1xuICAgICAgZm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3JlcScpKSB7XG4gICAgICAgICAgc3dpdGNoICgkKHRoaXMpLmRhdGEoJ3R5cGUnKSkge1xuICAgICAgICAgICAgY2FzZSAndGVsJzpcbiAgICAgICAgICAgICAgdmFyIHJlID0gL15bXFwrXT9bKF0/WzAtOV17M31bKV0/Wy1cXHNcXC5dP1swLTldezN9Wy1cXHNcXC5dP1swLTldezQsNn0kL2ltO1xuICAgICAgICAgICAgICBpZiAoIXJlLnRlc3QoJCh0aGlzKS52YWwoKSkpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgY2hlY2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgICAgICAgdmFyIHJlID0gL14oW1xcdy1dKyg/OlxcLltcXHctXSspKilAKCg/OltcXHctXStcXC4pKlxcd1tcXHctXXswLDY2fSlcXC4oW2Etel17Miw2fSg/OlxcLlthLXpdezJ9KT8pJC9pO1xuICAgICAgICAgICAgICBpZiAoIXJlLnRlc3QoJCh0aGlzKS52YWwoKSkpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgY2hlY2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnd2FybmluZycpO1xuICAgICAgICAgICAgICAgIGNoZWNrUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyYWRpbyc6XG5cdFx0XHRcdFx0XHRcdGlmICghJCgnLmpxLXJhZGlvJykuaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0JCgnLmpxLXJhZGlvJykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb2JpbGUnOlxuICAgICAgICAgICAgICBpZiAoJC50cmltKCQodGhpcykudmFsKCkpLmxlbmd0aCA8IDIyKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnd2FybmluZycpO1xuICAgICAgICAgICAgICAgIGNoZWNrUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBpZiAoJC50cmltKCQodGhpcykudmFsKCkpID09PSAnJykge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICBjaGVja1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2hlY2tSZXN1bHQ7XG4gICAgfVxuXG4gIH0pLmluaXQoKTtcblxuICAkKCcuY29udGFjdHMtZm9ybV9faW5wdXQnKS5vbignY2xpY2sgLGNoYW5nZSwga2V5dXAnLCBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmhpZGUoKTtcblxuICAgIGlmICgkKHRoaXMpLnZhbCgpID09PSAnJykge1xuICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XG4gICAgfVxuICB9KTtcblxuXHQkKCcucXVpei1pbnB1dC1pdGVtIGlucHV0Jykub24oJ2NsaWNrICxjaGFuZ2UsIGtleXVwJywgZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XG5cblx0XHRpZiAoJCh0aGlzKS52YWwoKSA9PT0gJycpIHtcblx0XHRcdCQodGhpcykuc2libGluZ3MoJ2xhYmVsJykuc2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblxuICAkKCdpbnB1dCwgc2VsZWN0Jykuc3R5bGVyKCk7XG59KTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
