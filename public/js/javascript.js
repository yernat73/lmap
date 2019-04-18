$('.left-sidebar-toggle').click(function(){
  $('.ui.sidebar.left ')
  .sidebar('setting', 'transition', 'overlay')
  .sidebar('toggle');

  $('.back').click(function(){
    $('.ui.sidebar.left ')
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
  });
});

$('.right-sidebar-toggle').click(function(){
  $('.ui.sidebar.right ')
  .sidebar('setting', 'transition', 'overlay')
  .sidebar('toggle')
;
});