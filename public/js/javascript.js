$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
    'Authorization': 'Bearer ' + $('meta[name="api_token"]').attr('content'),
   }
});

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
  if(start){
    if(destination){
      directions();
    }
    if(startMarker){
      startMarker.setPosition(new google.maps.LatLng(start.lat, start.lng));
      startMarker.setTitle(start.name);
    }else{
      startMarker = new google.maps.Marker({
        position: new google.maps.LatLng(start.lat, start.lng),
        map: map,
        icon: {
          size: new google.maps.Size(15, 15),
          scaledSize: new google.maps.Size(15, 15),
          url:'/circle-outline.png'
        },
        title: start.name
      });
    }
  }else{
    if(startMarker){
      startMarker.setMap(null);
      startMarker = null;
    }
    
  }
  
  
}
function setDestinationMarker(callF = true){
  if(destination){
    if(start && callF){
      directions();
    }
    if(destinationMarker){
      destinationMarker.setPosition(new google.maps.LatLng(destination.lat, destination.lng));
      destinationMarker.setTitle(destination.name);
    }else{
      destinationMarker = new google.maps.Marker({
        position: new google.maps.LatLng(destination.lat, destination.lng),
        map: map,
        icon: {
          size: new google.maps.Size(18, 18),
          scaledSize: new google.maps.Size(18, 18),
          url:'/marker.png'
        },
        title: destination.name
      });
    }
  }else{
    if(destinationMarker){
      destinationMarker.setMap(null);
      destinationMarker = null;
    }
    
  }
  
 
}
function back(){
  clearOverlays();
  $('#route').html('');
  $('#steps').transition('show');
  $('#route').transition('hide');
  $('#header').html('Find route');
  $('.back').click(function(){
    $('.ui.sidebar.left').sidebar('toggle');
  });
}
function directions(){
  $.ajax({
    url: "http://map.test/api/directions",
    type: 'GET',
    data: { 
      start: start,
      destination: destination,
      
     },
    cache: false,
    success: function(data) {
      console.log(data);
    },
  });
  createEvent();
}

function createEvent(){
  if(auth){
    $.ajax({
      url: "http://map.test/api/event/new",
      type: 'POST',
      data: { 
        start: start,
        destination: destination,
       },
      cache: false,
      success: function(data) {
        fetchEvents();
      },
    });
  }

}

function deleteEvent(id){
  if(auth){
    $.ajax({
      url: "http://map.test/api/event/delete",
      type: 'DELETE',
      data: { 
        event_id: id
       },
      cache: false,
      success: function(data) {
        fetchEvents();
      },
    });
  }
  event.stopPropagation();
}

function fetchEvents(){
  $('.ui.dimmer.events').dimmer('show');
  if(auth){
    $.ajax({
      url: "http://map.test/api/events",
      type: 'GET',
      cache: false,
      success: function(data) {
        
        var eventsTmp = '';
        data = data.data;
        if(data.length == 0){
          $("#no_events").show();
        }else{
          $("#no_events").hide();
        }
        var eventTmp = $("#event_template");
        for(var i = 0 ; i < data.length ; i++){
          eventsTmp += eventTmp.html();

        }
        $("#events").html(eventsTmp);
        var events = document.querySelectorAll('#events .item');
        for(var i = 0 ; i < events.length ; i++){
          events[i].id = "event-" + data[i].id;
          var eventId = events[i].id;
          $("#"+eventId+" .from").text(data[i].start.name);
          $("#"+eventId+" .to").text(data[i].destination.name);
          $("#"+eventId+" .date").text(data[i].date);
          $("#"+eventId+" .event__delete").on('click', {id: data[i].id}, eventDeleteCall);
          $("#"+eventId+" .content").on('click',{event: data[i]}, openEvent);
          
          
        }

        function eventDeleteCall(event){
          deleteEvent(event.data.id);
        }
        
        $('.ui.dimmer.events').dimmer('hide');
          },
        });
  }
}

function openEvent(event){
  event = event.data.event;

  document.getElementById("start").value = event.start.name;
  document.getElementById("destination").value = event.destination.name;
  start = new Location(event.start.name, event.start.lat, event.start.lng);
  destination = new Location(event.destination.name, event.destination.lat, event.destination.lng);
  setStartMarker();
  setDestinationMarker(false);
  back();
  $('.ui.sidebar.left').sidebar('show');

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
$('.dropdown').dropdown({action: 'hide'});



$('#swap').click(function(){
 if(start || destination){
  var data1 = document.getElementById("start").value;
  var data2 = document.getElementById("destination").value;
  document.getElementById("start").value = data2;
  document.getElementById("destination").value = data1;
  var tmp = start;
  start = destination;
  destination = tmp;
  setStartMarker();
  setDestinationMarker(false);
 }
});

$('.ui.search.start')
  .search({
    apiSettings: {
      url: 'http://map.test/api/place/search?q={query}'
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
      setStartMarker();
    }
  });

$('.ui.search.destination')
  .search({
    apiSettings: {
      url: 'http://map.test/api/place/search?q={query}'
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
      setDestinationMarker();
     
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
      back();
      
    });


  },
  type: 'routes'
});
$('#refresh').on("click", function(){
  fetchEvents();
});

$(document).ready(function(){
  fetchEvents();
});

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;

function step2(){

}





//map

function initMap(){
  geocoder = new google.maps.Geocoder();
  var options = {
    zoom: 13,
    center: {lat: 43.238949, lng: 76.889709},
    
    disableDefaultUI: true,
    
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
               
                $("#dir_from_button").prop("onclick", null).off("click");    
                $("#dir_to_button").prop("onclick", null).off("click");   

                $("#dir_from_button").on('click', function(){
                  $("#start").val(location.name);
                  start = location;
                  setStartMarker();
                  back();
                  if(!$(".ui.sidebar.left").sidebar("is visible")){
                    $(".ui.sidebar.left").sidebar("toggle")
                  }
                });

                $("#dir_to_button").on('click', function(){
                  $("#destination").val(location.name);
                  destination = location;
                  setDestinationMarker();
                  back();
                  if(!$(".ui.sidebar.left").sidebar("is visible")){
                    $(".ui.sidebar.left").sidebar("toggle")
                  }
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
      map: null,
      icon: {
        size: new google.maps.Size(12, 12),
        scaledSize: new google.maps.Size(12, 12),
        url:'/circle.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 12)
      },
      title: route.stations[i].address
    }));
    
  }
  var minValue = 13, maxValue = 20;

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var zoom = map.getZoom();
      if( zoom > minValue && zoom < maxValue) {
        for (var i = 0; i < markers.length; i++) {    
          markers[i].setMap(map);
        }
      }
      else {
        for (var i = 0; i < markers.length; i++) {    
          markers[i].setMap(null);
        }
      }
  });


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
            strokeColor: '#343a40'
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
  