// Masonry -- HOME
var $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  stamp: '.stamp',
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

// Masonry -- ARRANGEMENTS
var $grid_arr = $('.grid-arr').masonry({
  itemSelector: '.grid-item-arr',
  stagger: 5
});

// layout Masonry after each image loads
$grid_arr.imagesLoaded().always( function() {
  $('.loading').hide();
  $grid_arr.show();
  $grid_arr.masonry();
});

// PDFObject
$('#pdf').on('load', function() {
  $('.loading').hide();
  $("#pdf").show();
});