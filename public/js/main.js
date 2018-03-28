
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

      $('.quiz-btn--next').click(function() {
        if (!_th.checkForm($('.owl-item.active .quiz-form'))) {
          return false;
        } else {
          $('.quiz').trigger('next.owl.carousel');
        }
      });

      $('.quiz').submit(function(e) {
        if (!_th.checkForm($('.owl-item.active .last-slide'))) {
          return false;
        } // $.ajax({})
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
              if (!$('.active').find('.jq-radio').hasClass('checked')) {
                $(this).parent().addClass('warning');
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
  $(function() {
    $('.quiz').owlCarousel({
      loop: false,
      margin: 100,
      nav: true,
      items: 1,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      onInitialized: counter,
      onTranslated: counter,

    })

    function counter(event) {
      var element = event.target;
      var items = event.item.count - 2;
      var item = event.item.index;
      var persent = (100 / items) * event.item.index;
      $('.active').find('#counter').html("вопрос " + item + "/" + items);
      $('.active').find('progress').val(persent);
    }
  });

  $('.main-slide__btn').click(function() {
    $('.quiz').trigger('next.owl.carousel');
  })

  $('.quiz-btn--prev').click(function() {
    $('.quiz').trigger('prev.owl.carousel');
  })

  $('input, select').styler();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5raW5ncGFjayA9IHt9O1xuXG4gIHdpbmRvdy5raW5ncGFjay5mb3JtID0gKHtcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgX3RoID0gdGhpcztcblxuICAgICAgJCgnLmpzLXBob25lJykua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICgkLmluQXJyYXkoZS5rZXlDb2RlLCBbNDYsIDgsIDksIDI3LCAxMywgMTEwLCAxOTBdKSAhPT0gLTEgfHxcbiAgICAgICAgICAoZS5rZXlDb2RlID09IDY1ICYmIChlLmN0cmxLZXkgPT09IHRydWUgfHwgZS5tZXRhS2V5ID09PSB0cnVlKSkgfHxcbiAgICAgICAgICAoZS5rZXlDb2RlID49IDM1ICYmIGUua2V5Q29kZSA8PSA0MCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChlLnNoaWZ0S2V5IHx8IChlLmtleUNvZGUgPCA0OCB8fCBlLmtleUNvZGUgPiA1NykpICYmIChlLmtleUNvZGUgPCA5NiB8fCBlLmtleUNvZGUgPiAxMDUpKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnLmpzLXBob25lJykuaW5wdXRtYXNrKFwiKzcgKDk5OSkgOTk5IC0gOTkgLSA5OVwiLCB7XG4gICAgICAgIHBsYWNlaG9sZGVyOiAnICcsXG4gICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXG4gICAgICAgIHNob3dNYXNrT25Gb2N1czogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICAkKCcubGFzdC1zbGlkZSBmb3JtJykuc3VibWl0KGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCFfdGguY2hlY2tGb3JtKCQodGhpcykpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnLnF1aXotYnRuLS1uZXh0JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghX3RoLmNoZWNrRm9ybSgkKCcub3dsLWl0ZW0uYWN0aXZlIC5xdWl6LWZvcm0nKSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCgnLnF1aXonKS50cmlnZ2VyKCduZXh0Lm93bC5jYXJvdXNlbCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJCgnLnF1aXonKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIV90aC5jaGVja0Zvcm0oJCgnLm93bC1pdGVtLmFjdGl2ZSAubGFzdC1zbGlkZScpKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSAvLyAkLmFqYXgoe30pXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2hlY2tGb3JtOiBmdW5jdGlvbihmb3JtKSB7XG4gICAgICB2YXIgY2hlY2tSZXN1bHQgPSB0cnVlO1xuICAgICAgZm9ybS5maW5kKCcud2FybmluZycpLnJlbW92ZUNsYXNzKCd3YXJuaW5nJyk7XG4gICAgICBmb3JtLmZpbmQoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQodGhpcykuZGF0YSgncmVxJykpIHtcbiAgICAgICAgICBzd2l0Y2ggKCQodGhpcykuZGF0YSgndHlwZScpKSB7XG4gICAgICAgICAgICBjYXNlICd0ZWwnOlxuICAgICAgICAgICAgICB2YXIgcmUgPSAvXltcXCtdP1soXT9bMC05XXszfVspXT9bLVxcc1xcLl0/WzAtOV17M31bLVxcc1xcLl0/WzAtOV17NCw2fSQvaW07XG4gICAgICAgICAgICAgIGlmICghcmUudGVzdCgkKHRoaXMpLnZhbCgpKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICBjaGVja1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICAgICAgICB2YXIgcmUgPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG4gICAgICAgICAgICAgIGlmICghcmUudGVzdCgkKHRoaXMpLnZhbCgpKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICBjaGVja1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgICAgICBpZiAoISQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgY2hlY2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgICAgICAgICAgaWYgKCEkKCcuYWN0aXZlJykuZmluZCgnLmpxLXJhZGlvJykuaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICBjaGVja1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9iaWxlJzpcbiAgICAgICAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKS5sZW5ndGggPCAyMikge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICBjaGVja1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgY2hlY2tSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY2hlY2tSZXN1bHQ7XG4gICAgfVxuXG4gIH0pLmluaXQoKTtcblxuICAkKCcuY29udGFjdHMtZm9ybV9faW5wdXQnKS5vbignY2xpY2sgLGNoYW5nZSwga2V5dXAnLCBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmhpZGUoKTtcblxuICAgIGlmICgkKHRoaXMpLnZhbCgpID09PSAnJykge1xuICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5zaG93KCk7XG4gICAgfVxuICB9KTtcblxuICAkKCcucXVpei1pbnB1dC1pdGVtIGlucHV0Jykub24oJ2NsaWNrICxjaGFuZ2UsIGtleXVwJywgZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5oaWRlKCk7XG5cbiAgICBpZiAoJCh0aGlzKS52YWwoKSA9PT0gJycpIHtcbiAgICAgICQodGhpcykuc2libGluZ3MoJ2xhYmVsJykuc2hvdygpO1xuICAgIH1cbiAgfSk7XG4gICQoZnVuY3Rpb24oKSB7XG4gICAgJCgnLnF1aXonKS5vd2xDYXJvdXNlbCh7XG4gICAgICBsb29wOiBmYWxzZSxcbiAgICAgIG1hcmdpbjogMTAwLFxuICAgICAgbmF2OiB0cnVlLFxuICAgICAgaXRlbXM6IDEsXG4gICAgICBtb3VzZURyYWc6IGZhbHNlLFxuICAgICAgdG91Y2hEcmFnOiBmYWxzZSxcbiAgICAgIHB1bGxEcmFnOiBmYWxzZSxcbiAgICAgIG9uSW5pdGlhbGl6ZWQ6IGNvdW50ZXIsXG4gICAgICBvblRyYW5zbGF0ZWQ6IGNvdW50ZXIsXG5cbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gY291bnRlcihldmVudCkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgICB2YXIgaXRlbXMgPSBldmVudC5pdGVtLmNvdW50IC0gMjtcbiAgICAgIHZhciBpdGVtID0gZXZlbnQuaXRlbS5pbmRleDtcbiAgICAgIHZhciBwZXJzZW50ID0gKDEwMCAvIGl0ZW1zKSAqIGV2ZW50Lml0ZW0uaW5kZXg7XG4gICAgICAkKCcuYWN0aXZlJykuZmluZCgnI2NvdW50ZXInKS5odG1sKFwi0LLQvtC/0YDQvtGBIFwiICsgaXRlbSArIFwiL1wiICsgaXRlbXMpO1xuICAgICAgJCgnLmFjdGl2ZScpLmZpbmQoJ3Byb2dyZXNzJykudmFsKHBlcnNlbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgJCgnLm1haW4tc2xpZGVfX2J0bicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICQoJy5xdWl6JykudHJpZ2dlcignbmV4dC5vd2wuY2Fyb3VzZWwnKTtcbiAgfSlcblxuICAkKCcucXVpei1idG4tLXByZXYnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAkKCcucXVpeicpLnRyaWdnZXIoJ3ByZXYub3dsLmNhcm91c2VsJyk7XG4gIH0pXG5cbiAgJCgnaW5wdXQsIHNlbGVjdCcpLnN0eWxlcigpO1xufSk7XG4iXSwiZmlsZSI6Im1haW4uanMifQ==
