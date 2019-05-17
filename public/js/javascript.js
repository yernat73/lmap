class Location{
  constructor(name, lat, lng){
    this.name = name.split(',')[0];
    this.lat = lat;
    this.lng = lng;
  }
}



var start = null;
var destination = null;
var map = null;
var polylines = [];
var markers = [];
var startMarker = null;
var destinationMarker = null;
var geocoder = null;

function clearOverlays() {
  while(markers.length) {
    markers.pop().setMap(null);
  }
  while(polylines.length) {
    polylines.pop().setMap(null);
  }
}
function clearDirections(){
  if(startMarker){
    startMarker.setMap(null);
    startMarker = null;
  }
  if(destinationMarker){
    destinationMarker.setMap(null);
    destinationMarker = null;
  }
}
function setStartMarker(){
  if(startMarker){
    startMarker.setPosition(new google.maps.LatLng(start.lat, start.lng));
    startMarker.setTitle(start.name);
  }else{
    startMarker = new google.maps.Marker({
      position: new google.maps.LatLng(start.lat, start.lng),
      map: map,
      icon: {
        size: new google.maps.Size(12, 12),
        scaledSize: new google.maps.Size(12, 12),
        url:'/circle-outline.png'
      },
      title: start.name
    });
  }
}
function setDestinationMarker(){
  if(destinationMarker){
    destinationMarker.setPosition(new google.maps.LatLng(destination.lat, destination.lng));
    destinationMarker.setTitle(destination.name);
  }else{
    destinationMarker = new google.maps.Marker({
      position: new google.maps.LatLng(destination.lat, destination.lng),
      map: map,
      icon: {
        size: new google.maps.Size(12, 12),
        scaledSize: new google.maps.Size(12, 12),
        url:'/marker.png'
      },
      title: destination.name
    });
  }
}


$('.ui.sidebar.left').sidebar('setting', 'transition', 'overlay').sidebar('setting', 'dimPage', false);

$('.ui.sidebar.right').sidebar('setting', 'transition', 'overlay').sidebar('setting', 'dimPage', false);


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
      results : 'candidates',
      title   : 'name',
      url     : 'html_url'
    },
    minCharacters : 3,
    onSelect: function(result, response){
      start = new Location(result.name, result.geometry.location.lat, result.geometry.location.lng);
      clearOverlays();
      
      console.log(start);
      setStartMarker();
    }
  });

$('.ui.search.destination')
  .search({
    apiSettings: {
      url: 'http://map.test/api/station/search?q={query}'
    },
    fields: {
      results : 'candidates',
      title   : 'name',
      url     : 'html_url'
    },
    minCharacters : 3,
    onSelect: function(result, response){
      destination = new Location(result.name, result.geometry.location.lat, result.geometry.location.lng);
      
      clearOverlays();
      console.log(destination);
      setDestinationMarker();
     
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
      html += "<div class='item border-left border-dark ml-3'><div class='content'><i class='small circle outline icon point bg-white'></i>"+item.address+"</div></div>"
    });
    html += "";
    displayRoute(result);
    $('#route').html(html);
    $('.ui.sidebar.left').sidebar('show');
    $('#steps').transition('hide');
    $('#route').transition('show');
    $(".back").prop("onclick", null).off("click");
    $('.back').click(function(){
      clearOverlays();
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
  geocoder = new google.maps.Geocoder();
  var options = {
    zoom: 13,
    center: {lat: 43.238949, lng: 76.889709}
  };
  map = new google.maps.Map(document.getElementById('map'), options );


  google.maps.event.addListener(
    map,
    "rightclick",
    function( event ) {
        if(!$('#contextMenu').transition('is visible')){
          $('#contextMenu').transition();
        }
        $('#contextMenu').css('top', event.pixel.y).css('left', event.pixel.x);
        
        var lat = event.latLng.lat();   // give valid lat
        var lng = event.latLng.lng();  // give valid lng
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({'latLng': latlng}, 
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                var location = new Location(results[0].formatted_address, lat, lng);
                console.log(location);

                
                $("#dir_from_button").on('click', function(){
                  $("#start").val(location.name);
                  start = location;
                  setStartMarker(); 
                });
                $("#dir_to_button").on('click', function(){
                  $("#destination").val(location.name);
                  destination = location;
                  setDestinationMarker();
                });
              }
            }
        });

        

    }
  );
  google.maps.event.addListener(map, "click",
    function( event ) {
        if($('#contextMenu').transition('is visible')){
          $('#contextMenu').transition('hide');
        }
    }
  );
  google.maps.event.addListener(map, "drag",
    function( event ) {
        if($('#contextMenu').transition('is visible')){
          $('#contextMenu').transition('hide');
        }
    }
  );
}

function displayRoute(route){
  clearOverlays();
  clearDirections();
  var stationsCount =  route.stations.length;
  for (var i = 0 ; i < stationsCount; i++){
    // 1. Create Marker for each station 
    markers.push(new google.maps.Marker({
      position: new google.maps.LatLng(route.stations[i].lat, route.stations[i].lng),
      map: map,
      icon: {
        size: new google.maps.Size(12, 12),
        scaledSize: new google.maps.Size(12, 12),
        url:'/circle.png'
      },
      title: route.stations[i].address
    }));
    
  }
  for(var i = 0 ; i < stationsCount; i+=2){
    
    //Intialize the Direction Service  
  
    var service = new google.maps.DirectionsService();
    var bounds = new google.maps.LatLngBounds();

    if((i+2) < stationsCount){
      var src = route.stations[i];
      var des = route.stations[i+2];
      service.route({
        origin: src,
        destination: des,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          // new path for the next result
          var path = new google.maps.MVCArray();
          //Set the Path Stroke Color
          // new polyline for the next result
          var poly = new google.maps.Polyline({
            map: map,
            strokeColor: '#000000'
          });
          poly.setPath(path);
          polylines.push(poly);
          for (var k = 0, len = result.routes[0].overview_path.length; k < len; k++) {
            path.push(result.routes[0].overview_path[k]);
            bounds.extend(result.routes[0].overview_path[k]);
            map.fitBounds(bounds);
          }
        } 
        else alert("Directions Service failed:" + status);
      });
    }
    
  }


} 
  