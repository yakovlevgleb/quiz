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
						case 'radio':
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
			// $('.order-online-form__select--req .warning').parent().addClass('warning');
			return checkResult;

		}

	}).init();


	$('input, select').styler();
});



// $('.vacancy-accordion__link').on('click', function (event) {
// 	event.preventDefault();
// 	var $th = $(this).parent('.vacancy-accordion__item');
//
// 	if($th.hasClass('current')) {
// 		$th.find('.vacancy-accordion__desc').first().slideUp(400);
// 		$th.removeClass('current');
// 	} else {
// 		$th.find('.vacancy-accordion__desc').first().slideDown(400);
// 		$th.addClass('current');
// 	}
// });

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0d2luZG93LmtpbmdwYWNrID0ge307XG5cblx0d2luZG93LmtpbmdwYWNrLmZvcm0gPSAoe1xuXG5cdFx0aW5pdDogZnVuY3Rpb24oKXtcblxuXHRcdFx0dmFyIF90aCA9IHRoaXM7XG5cblx0XHRcdCQoJy5qcy1waG9uZScpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0aWYgKCQuaW5BcnJheShlLmtleUNvZGUsIFs0NiwgOCwgOSwgMjcsIDEzLCAxMTAsIDE5MF0pICE9PSAtMSB8fFxuXHRcdFx0XHRcdChlLmtleUNvZGUgPT0gNjUgJiYgKCBlLmN0cmxLZXkgPT09IHRydWUgfHwgZS5tZXRhS2V5ID09PSB0cnVlICkgKSB8fFxuXHRcdFx0XHRcdChlLmtleUNvZGUgPj0gMzUgJiYgZS5rZXlDb2RlIDw9IDQwKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoKGUuc2hpZnRLZXkgfHwgKGUua2V5Q29kZSA8IDQ4IHx8IGUua2V5Q29kZSA+IDU3KSkgJiYgKGUua2V5Q29kZSA8IDk2IHx8IGUua2V5Q29kZSA+IDEwNSkpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkKCcuanMtcGhvbmUnKS5pbnB1dG1hc2soXCIrNyAoOTk5KSA5OTkgLSA5OSAtIDk5XCIsIHtcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICcgJyxcblx0XHRcdFx0c2hvd01hc2tPbkhvdmVyOmZhbHNlLFxuXHRcdFx0XHRzaG93TWFza09uRm9jdXM6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0JCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYgKCFfdGguY2hlY2tGb3JtKCQodGhpcykpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Y2hlY2tGb3JtOiBmdW5jdGlvbihmb3JtKXtcblx0XHRcdHZhciBjaGVja1Jlc3VsdCA9IHRydWU7XG5cdFx0XHRmb3JtLmZpbmQoJy53YXJuaW5nJykucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ3JlcScpKXtcblx0XHRcdFx0XHRzd2l0Y2goJCh0aGlzKS5kYXRhKCd0eXBlJykpe1xuXHRcdFx0XHRcdFx0Y2FzZSAndGVsJzpcblx0XHRcdFx0XHRcdFx0dmFyIHJlID0gL15bXFwrXT9bKF0/WzAtOV17M31bKV0/Wy1cXHNcXC5dP1swLTldezN9Wy1cXHNcXC5dP1swLTldezQsNn0kL2ltO1xuXHRcdFx0XHRcdFx0XHRpZiAoIXJlLnRlc3QoJCh0aGlzKS52YWwoKSkpe1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnZW1haWwnOlxuXHRcdFx0XHRcdFx0XHR2YXIgcmUgPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG5cdFx0XHRcdFx0XHRcdGlmICghcmUudGVzdCgkKHRoaXMpLnZhbCgpKSl7XG5cdFx0XHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnd2FybmluZycpO1xuXHRcdFx0XHRcdFx0XHRcdGNoZWNrUmVzdWx0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlICdjaGVja2JveCc6XG5cdFx0XHRcdFx0XHRcdGlmICghJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xuXHRcdFx0XHRcdFx0XHRcdCQodGhpcykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdFx0XHRcdFx0XHRjaGVja1Jlc3VsdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAncmFkaW8nOlxuXHRcdFx0XHRcdFx0XHRpZiAoISQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tSZXN1bHQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgJ21vYmlsZSc6XG5cdFx0XHRcdFx0XHRcdGlmICgkLnRyaW0oJCh0aGlzKS52YWwoKSkubGVuZ3RoIDwgMjIpIHtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tSZXN1bHQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdGlmICgkLnRyaW0oJCh0aGlzKS52YWwoKSkgPT09ICcnKXtcblx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tSZXN1bHQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Ly8gJCgnLm9yZGVyLW9ubGluZS1mb3JtX19zZWxlY3QtLXJlcSAud2FybmluZycpLnBhcmVudCgpLmFkZENsYXNzKCd3YXJuaW5nJyk7XG5cdFx0XHRyZXR1cm4gY2hlY2tSZXN1bHQ7XG5cblx0XHR9XG5cblx0fSkuaW5pdCgpO1xuXG5cblx0JCgnaW5wdXQsIHNlbGVjdCcpLnN0eWxlcigpO1xufSk7XG5cblxuXG4vLyAkKCcudmFjYW5jeS1hY2NvcmRpb25fX2xpbmsnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vIFx0dmFyICR0aCA9ICQodGhpcykucGFyZW50KCcudmFjYW5jeS1hY2NvcmRpb25fX2l0ZW0nKTtcbi8vXG4vLyBcdGlmKCR0aC5oYXNDbGFzcygnY3VycmVudCcpKSB7XG4vLyBcdFx0JHRoLmZpbmQoJy52YWNhbmN5LWFjY29yZGlvbl9fZGVzYycpLmZpcnN0KCkuc2xpZGVVcCg0MDApO1xuLy8gXHRcdCR0aC5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuLy8gXHR9IGVsc2Uge1xuLy8gXHRcdCR0aC5maW5kKCcudmFjYW5jeS1hY2NvcmRpb25fX2Rlc2MnKS5maXJzdCgpLnNsaWRlRG93big0MDApO1xuLy8gXHRcdCR0aC5hZGRDbGFzcygnY3VycmVudCcpO1xuLy8gXHR9XG4vLyB9KTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
