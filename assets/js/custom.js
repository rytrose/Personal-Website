// Initialize masonry
var $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  stagger: 25
});

// layout Masonry after each image loads
$grid.imagesLoaded().always( function() {
  $('.loading').hide();
  $grid.show();
  $grid.masonry();
});

// On click logic
$grid.on( 'click', '.grid-item', function() {
  // change size of item via class
  $(this).toggleClass('grid-item-gigante');
  // trigger layout
  $grid.masonry();
});

// Initialize audio.js
audiojs.events.ready(function() {
    var as = audiojs.createAll();
  });
