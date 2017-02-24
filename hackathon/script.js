
// var wrap = $("#header");

// wrap.on("scroll", function(e) {

// 	alert();

// 	console.log(this.scollTop);
    
//   if (this.scrollTop > 147) {
//     wrap.addClass("header-footer--fixed");
//   } else {
//     wrap.removeClass("header-footer--fixed");
//   }
  
// });

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

window.onload = function () {
    var scrolledElement = document.querySelector('#header');
    var top = scrolledElement.offsetTop;
    var listener = debounce(function () {

        var y = window.pageYOffset;

        if (y >= top) {
            scrolledElement.classList.add('header-footer--fixed');
        } else {
            scrolledElement.classList.remove('header-footer--fixed');
        }
    }, 17);
    window.addEventListener('scroll', listener, false);
}

$(document).ready(function(){
	var $collectPlusBtn = $('#collectPlusBtn');

	$('input[type=radio][name=delivery]').change(function() {
		$collectPlusBtn.toggleClass('collectPlus-btn--show', this.value == 'cp');
    });

    var footerModalTerm = new shopdirect.ui.modal({
        title: 'Click &amp; Collect',
        content:'<img src="Click-Collect-1.png" id="collect1">'
    });

    $collectPlusBtn.click(function(){
    	footerModalTerm.show();
    	return false;
    });

    $(document).on('click', '#collect1', function(){
    	$(this).attr('src', 'Click-Collect-2.png').attr('id', 'collect2');
    });

    $(document).on('click', '#collect2', function(){
    	$(this).attr('src', 'Click-Collect-Map.png').attr('id', 'collect3');
    });

    $(document).on('click', '#collect3', function(){
    	$(this).attr('src', 'Click-Collect-3.png').attr('id', 'collect4');
    });

    $(document).on('click', '#collect4', function(){
    	$collectPlusBtn.hide();
    	$('#collectPlusAddress').show();
    	$('#collectPlusChoose').hide();
    	$('#collectPlusInfo').show();
    	$('#deliveryCost').text('Free');
    	footerModalTerm.hide();
    });


});