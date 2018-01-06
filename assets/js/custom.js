// Masonry -- BIO
var $grid = $('.grid').masonry({
  itemSelector: '.grid-item-bio',
  stagger: 25
});

$(window).on('load', function () {
  $('.loading').hide();
});

// layout Masonry after each image loads
$grid.imagesLoaded().always( function() {
  $grid.show();
  $grid.masonry();
});

// Masonry -- ARRANGEMENTS
var $grid_arr = $('.grid-arr').masonry({
  itemSelector: '.grid-item-arr',
  stagger: 5
});

// layout Masonry after each image loads
$grid_arr.imagesLoaded().always( function() {
  $grid_arr.show();
  $grid_arr.masonry();
});

// PDFObject
$('#pdf').on('load', function() {
  $("#pdf").show();
});

// Masonry -- PERFORMANCES
var $grid_per = $('.grid-per').masonry({
        itemSelector: '.grid-item-per',
        stagger: 5
    });
    
$grid_per.imagesLoaded().always( function () {
  $grid_per.show();
  $grid_per.masonry();
});

//Reinitialize masonry inside each panel after the relative tab link is clicked - 
$('a[data-toggle=tab]').each(function () {
    var $this = $(this);

    $this.on('shown.bs.tab', function () {
    
        $grid_per.imagesLoaded().always( function () {
          $grid_per.show();
          $grid_per.masonry();
        });

    });
});

// Home page fade in
$(window).on('load', function(){
    $(".name").animate({opacity:1}, 800);
    $(".musician").delay(400).animate({opacity:1}, 800);
    $(".arranger").delay(800).animate({opacity:1}, 800);
    $(".developer").delay(1200).animate({opacity:1}, 800);
});