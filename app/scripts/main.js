/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/


(function ($) {

  //Scrolling Header Cbange function
$(window).scroll( () => {
  var windowObj = window;
  const nav = $('#navbar');
  if (windowObj.scrollY <= 500) {
    nav.addClass('transparent');
  }else{
    nav.removeClass('transparent');
  }
});

  //Random Text

  var messages = ['Website Development', 'Mobile App Development', 'Web App Development', 'Ionic App Development ', 'Angular App Development', 'React App Development'];
  var rank = 1;
  document.getElementById('myTypewriter').addEventListener('webkitAnimationEnd', changeTxt);
  document.getElementById('myTypewriter').addEventListener('animationend', changeTxt);
  document.getElementById('mobileTypewriter').addEventListener('webkitAnimationEnd', changeTxt);
  document.getElementById('mobileTypewriter').addEventListener('animationend', changeTxt);

  function changeTxt(e) {
    console.log(this);
    var _h1 = this.getElementsByTagName('h1');
    console.log(_h1[0].style);
    _h1[0].style.WebkitAnimation = 'none'; // set element animation to none
    setTimeout(function () { // you surely want a delay before the next message appears
      _h1[0].innerHTML = messages[rank];
      var speed = 3.5 * messages[rank].length / 50; // adjust the speed (3.5 is the original speed, 20 is the original string length
      _h1[0].style.WebkitAnimation = 'typing ' + speed + 's steps(40, end), blink-caret .75s step-end infinite'; //  switch to the original set of animation
      (rank === messages.length - 1) ? rank = 0: rank++; // if you have displayed the last message from the array, go back to the first one, else go to next message
    }, 1000);
  }
})(jQuery);


