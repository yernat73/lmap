var start = null;
var destination = null;

$('.ui.sidebar.left')
  .sidebar('setting', 'transition', 'overlay')
  .sidebar('setting', 'dimPage', false);

$('.ui.sidebar.right')
  .sidebar('setting', 'transition', 'overlay');


$('.left-sidebar-toggle').click(function(){
  $('.ui.sidebar.left')
    .sidebar('toggle');
});
$('.back').click(function(){
  $('.ui.sidebar.left')
  .sidebar('toggle');
});

$('.right-sidebar-toggle').click(function(){
  $('.ui.sidebar.right ')
  .sidebar('toggle')
;
});
$('#swap').click(function(){
  var data1 = document.getElementById("start").value;
  var data2 = document.getElementById("destination").value;
  document.getElementById("start").value = data2;
  document.getElementById("destination").value = data1;
  var tmp = start;
  start = destination;
  destination = tmp;

});

$('.ui.search.start')
  .search({
    apiSettings: {
      url: 'http://map.test/api/station/search?q={query}'
    },
    fields: {
      results : 'data',
      title   : 'address',
      url     : 'html_url'
    },
    minCharacters : 3,
    onSelect: function(result, response){
      start = result;
      if(start && destination){
        alert("all set");
      }
    }
  });

$('.ui.search.destination')
  .search({
    apiSettings: {
      url: 'http://map.test/api/station/search?q={query}'
    },
    fields: {
      results : 'data',
      title   : 'address',
      url     : 'html_url'
    },
    minCharacters : 3,
    onSelect: function(result, response){
      destination = result;
      if(start && destination){
        alert("all set");
      }
    }
  });
$.fn.search.settings.templates.routes = function(response) {
  // do something with response
  html = '';
  $.each(response.data, function(index, item) {
    html+= "<a class='result'><div class='content'><div class='title'><i class='bus icon'></i>  "+item.name+"</div></div></a>";
  });
    return html;
  };

$('.ui.search.route')
.search({
  apiSettings: {
    url: 'http://map.test/api/route/search?q={query}'
  },
  fields: {
    results : 'data',
    title   : 'name',
    url     : 'html_url'
  },
  minCharacters : 1,
  onSelect: function(result, response){
    
    console.log(result);
    $('#header').html("<i class='bus icon'></i>"+result.name);
    var html = "";
    $.each(result.stations, function(index, item){
      html += "<div class='item border-left border-dark ml-3'><div class='content'><i class='small circle icon point'></i>"+item.address+"</div></div>"
      
    });
    html += "";
    $('#route').html(html);
    $('.ui.sidebar.left').sidebar('show');
    $('#steps').transition('hide');
    $('#route').transition('show');
    $(".back").prop("onclick", null).off("click");
    $('.back').click(function(){
      $('#route').html('');
      $('#steps').transition('show');
      $('#route').transition('hide');
      $('#header').html('Find route');
      $('.back').click(function(){
        $('.ui.sidebar.left').sidebar('toggle');
      });
    });


  },
  type: 'routes'
});

  

function step2(){

}



//map

function initMap(){
  var options = {
    zoom: 13,
    center: {lat: 43.238949, lng: 76.889709}
  };

  var map = new google.maps.Map(
    document.getElementById('map'), options );
  // The marker, positioned at Uluru

}
  