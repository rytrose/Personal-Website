// Initialize masonry
var $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: 400,
  stagger: 25
});

// layout Masonry after each image loads
$grid.imagesLoaded().always( function() {
  $grid.masonry();
});

// On click logic
$grid.on( 'click', '.grid-item', function() {
  // change size of item via class
  $(this).toggleClass('grid-item--gigante');
  // trigger layocdut
  $grid.masonry();
});
