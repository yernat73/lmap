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
var stations = null;
var routes = null;
var stationMarkers = [];


//map

function initMap(){
  geocoder = new google.maps.Geocoder();
  var options = {
    zoom: 13,
    center: {lat: 43.238949, lng: 76.889709},
    
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'poi.business',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{visibility: 'off'}]
      }
    ],
    
  };
  map = new google.maps.Map(document.getElementById('map'), options );  
  fetchStations();
  fetchRoutes();
  google.maps.event.addListener(map, "rightclick",
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
function getRouteById(id){
  var routesCount = routes.length;
  for(var i = 0; i < routesCount; i++){
    if(routes[i].id == id){
      return routes[i];
    }
  }
}



function displaySatationInfo(){
  
  clearOverlays();
  clearDirections();
  var station = this.station;
  var arrivalsCount = station.arrivals.length;
  var html = '';
  console.log(station);
  $('#header').html("<h3> <i class='bus icon'></i>"+ station.address + "</h3>");

  $('#station-routes-count').text(arrivalsCount);

  for(var i = 0; i < arrivalsCount; i++ ){
    
    html += '<div class="link item" id="route-'+station.arrivals[i].track.route_id+'"><div class="row"><div class="col-9"><div class="ui large label ml-2">'+ (getRouteById(station.arrivals[i].track.route_id)).name+'</div></div><div class="col-3 text-success pt-2 text-right">'+station.arrivals[i].arrival_time+'</div></div></div>';
  }
  $('#station .routes').html(html);
  for(var i = 0; i < arrivalsCount; i++ ){
    $("#route-"+station.arrivals[i].track.route_id).off().on('click', {route_id: station.arrivals[i].track.route_id}, callDisplayRoute);
  }
  function callDisplayRoute(event){
    displayRoute(getRouteById(event.data.route_id));
  }

 

  $('#directions').transition('hide');
  $('#route').transition('hide');
  
  $('#route-direction-change').transition('hide');
  $('#option').transition('hide');
  $('#station').transition('show');
  $(".back").prop("onclick", null).off("click");
  $('.back').click(function(){ back(); });
  $('.ui.sidebar.left').sidebar('show');
}


function displayStations(){
  var stationsCount = stations.length;
  var busStationIcon = {
    scaledSize: new google.maps.Size(12, 12),
    url:'/bus-station.png',
    origin: new google.maps.Point(0,0), 
    anchor: new google.maps.Point(6,6) 
  };
  
  for (var i = 0 ; i < stationsCount; i++){
    // 1. Create Marker for each station 

    var marker = new google.maps.Marker({
      position: stations[i],
      map: null,
      icon: busStationIcon,
      title: stations[i].address
    });
    marker.station = stations[i];
    google.maps.event.addListener(marker, 'click', function() {
      if($('#contextMenu').transition('is visible')){
        $('#contextMenu').transition('hide');
      }
      displaySatationInfo.call(this);
    });


    stationMarkers.push(marker);
    var minValue = 14, maxValue = 20;

    google.maps.event.addListener(map, 'zoom_changed', function() {
      var zoom = map.getZoom();
        if( zoom > minValue && zoom < maxValue) {
          for (var i = 0; i < stationMarkers.length; i++) {    
            stationMarkers[i].setMap(map);
          }
        }
        else {
          for (var i = 0; i < stationMarkers.length; i++) {    
            stationMarkers[i].setMap(null);
          }
        }
    });

    
  }

}

function displayRouteOnMap(route, start, end){
  var service = new google.maps.DirectionsService();
  var bounds = new google.maps.LatLngBounds();
  
  var stationsCount = end.pivot.order - start.pivot.order;
  var src = start;
  var des = end;

  var iteration = Math.ceil(stationsCount / 25);
  var waypts = [];
  
  var busRoundIcon = {
    scaledSize: new google.maps.Size(22, 22),
    url:'/bus-round.png',
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(11, 11)
  };
  
  var circleIcon = {
    scaledSize: new google.maps.Size(16, 16),
    url:'/circle.png',
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(8, 8)
  };
  for(var i = start.pivot.order ; i < end.pivot.order-iteration; i+=iteration){
    waypts.push({
      location: new google.maps.LatLng(route.stations[i].lat, route.stations[i].lng),
      stopover: true
    });
    
  }

  service.route(
    {
      origin: src,
      destination: des,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      waypoints: waypts,
      optimizeWaypoints: true,
    }, 
    function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // new path for the next result
        var path = new google.maps.MVCArray();
        //Set the Path Stroke Color
        // new polyline for the next result
        
        var poly = new google.maps.Polyline({
          map: map,
          strokeColor: '#343a40',
          strokeWeight: 7
        });
        poly.setPath(path);
        polylines.push(poly);
        poly = new google.maps.Polyline({
          map: map,
          strokeColor: '#ffffff',
          strokeWeight: 5
        });
        poly.setPath(path);
        polylines.push(poly);
        for (var k = 0, len = result.routes[0].overview_path.length; k < len; k++) {
          path.push(result.routes[0].overview_path[k]);
          bounds.extend(result.routes[0].overview_path[k]);
          map.fitBounds(bounds);
        }

        markers.push(
          new google.maps.Marker(
            {
              position: path.getAt(0),
              map: map,
              icon: busRoundIcon,
              title: route.stations[0].address
            }
          ),
          new google.maps.Marker(
            {
              position: path.getAt(path.getLength()-1),
              map: map,
              icon: circleIcon,
              title: route.stations[stationsCount-1].address
            }
          )
      
        );
      } 
      else alert("Directions Service failed:" + status);
    }
  );
}

function getReversedRoute(id){
  for(var i = 0 ; i < routes.length; i++){
    if(routes[i].name == routes[id-1].name && routes[i].direction != routes[id-1].direction){
      return routes[i];
    }
  }
  return null;
}

function displayRoute(route){
  console.log(route);
  clearOverlays();
  clearDirections();
  $('#header').html("<h3><i class='bus icon'></i>"+route.name+"</h3>");
  var html = "";
  $.each(route.stations, function(index, item){
    html += "<div class='link item border-left border-dark ml-3' id='station-"+item.id+"'><div class='row'><div class='col-8'><i class='small circle outline icon point bg-white'></i>"+item.address+"</div><div class='col-4 text-right text-success'>"+item.arrivals[0].arrival_time+"</div></div></div>";
  });
  html += "";
  $('#route').html(html);
  var size = route.stations.length;
  for(var i = 0; i < size; i++){
    $("#station-"+route.stations[i].id).on('click',{lat:route.stations[i].lat, lng:route.stations[i].lng}, function(e){
      map.setCenter({lat:e.data.lat, lng:e.data.lng});
      map.setZoom(15);
    });
  }
  $('#route-direction-change').off().on('click', {id: route.id}, function(e){
    var reversedRoute = getReversedRoute(e.data.id);
    if(reversedRoute != null){
      displayRoute(reversedRoute);
    }
  } 
  );


  
  $('#route-direction-change').transition('show');
  $('.ui.sidebar.left').sidebar('show');
  $('#directions').transition('hide');
  $('#station').transition('hide');  
  $('#option').transition('hide');
  $('#route').transition('show');
  $(".back").prop("onclick", null).off("click");
  $('.back').click(function(){ back(); });
  if(route.stations.length > 0){
    displayRouteOnMap(route, route.stations[0], route.stations[route.stations.length-1]);
  }
  
} 

function displayWalker(ws, wd){
  var  goo = google.maps, directionsService = new goo.DirectionsService;
  var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
  };
  directionsService.route({
    origin: new google.maps.LatLng(ws.lat, ws.lng),
    destination: new google.maps.LatLng(wd.lat, wd.lng),
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#343a40',
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }]
      });
      polylines.push(polyline);
      var bounds = new google.maps.LatLngBounds();
      
      
      var legs = response.routes[0].legs;
      for (i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (j=0;j<steps.length;j++) {
          var nextSegment = steps[j].path;
          for (k=0;k<nextSegment.length;k++) {
            polyline.getPath().push(nextSegment[k]);
            bounds.extend(nextSegment[k]);
          }
        }
      }
      
      polyline.setMap(map);
      map.fitBounds(bounds);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function displayOption(option, id){
  console.log(option);
  var html = '';
  if(option.mode == "walk"){
    displayWalker(start, destination);
    html+= '<div class="item"><div class="ui header"> <span>'+millisecondsToStr(option.duration*1000)+'</span> <span class="text-secondary font-weight-light">('+option.distance.toFixed(1) + ' km)</span></div> <div class="extra text-secondary">via '+option.routes[0].summary+'</div></div></div>';
    html+= '<div class="item"><div class="ui header">'+ option.start.name +' </div></div>';

    var size = option.routes[0].legs[0].steps.length;
    for(var i = 0 ; i < size; i++){
      var text = $($.parseHTML(option.routes[0].legs[0].steps[i].html_instructions)).slice(0,4);
      console.log(text);
      
      html += "<div class='link item pl-4' id='step-"+i+"'><div class='ui tiny image'> <i class='ui info icon'></i></div> <div class='middle aligned content'><div class='description' style='line-height: 1.3rem!important;'> "+ text.text()+"</div>";
      html += "<div class='extra text-secondary mt-2'>"+option.routes[0].legs[0].steps[i].distance.text+"</div>"
      
      html += " </div></div>";
    }
    html += '<div class="item"><div class="ui header">'+ option.end.name +' </div></div>';


  }
  else if (option.mode == "transit"){
    html += '<div class="item border-bottom"><div class="ui header"> <span>'+option.departure_time.text+' - '+option.arrival_time.text+'</span> <span class="text-secondary font-weight-light"> (' + millisecondsToStr(option.duration*1000)+ ') </span></div> <div class="extra">'+ $('#option-'+id + ' .summary').html()+'</div></div></div>';
    html += '<div class="p-3"><div class="content"><div class="row m-0"><div class="col-3 p-3 text-center">'+option.departure_time.text+'</div><div class="col-1 py-3 px-0"><i class="dot circle outline icon bg-white"></i> <div class="walking-line"> </div></div><div class="col-8 border-bottom p-3"><h4> '+start.name+' </h4> </div></div> </div>';

    var size = option.steps.length;
    for(var i = 0 ; i < size ; i++){
      if(option.steps[i].mode == "walk"){
        html+='<div>';
        if(option.steps[i].duration <= 100){
          html += '<div class="content"> <div class="row m-0"><div class="col-3 text-right"></i></div><div class="col-1 px-0"><div class="walking-line"></div></div><div class="col-8 border-bottom"> </div></div> </div>';

        }else{
          html += '<div class="content"> <div class="row m-0"><div class="col-3 p-3 text-right"><i class="fas fa-walking"></i></div><div class="col-1 py-3 px-0"><div class="walking-line"></div></div><div class="col-8 p-3 border-bottom ">Walk <div class="extra text-secondary">About '+millisecondsToStr(option.steps[i].duration * 1000)+', '+option.steps[i].distance.toFixed(1) + ' km </div> </div></div> </div>';
        
        }
        html+='</div>';
        displayWalker(option.steps[i].start, option.steps[i].end);
      }
      else if(option.steps[i].mode == "transit"){
        html += '<div><div class="content"><div class="row m-0"><div class="col-3 p-3 text-center">'+option.steps[i].departure_time.text+'</div><div class="col-1 py-3 px-0"><i class="circle outline icon"></i><div class="transit-line"></div>  </div><div class="col-8 p-3 border-bottom"><h4>'+option.steps[i].start.address+'</h4></div></div> </div>';
        html += '<div class="content"> <div class="row m-0"><div class="col-3 p-3 text-right"><i class="ui small bus icon"></i></div><div class="col-1 py-3 px-0"><div class="transit-line"></div></div><div class="col-8 p-3"><div class="ui label">'+option.steps[i].route.name+'</div> <div class="extra text-secondary">'+ millisecondsToStr(option.steps[i].duration * 1000) +' ('+ (option.steps[i].end.pivot.order-option.steps[i].start.pivot.order) +' stops)</div></div></div> </div>';
       
        for(var j = option.steps[i].start.pivot.order ; j < option.steps[i].end.pivot.order-1; j++){
          html += '<div class="content"><div class="row m-0"><div class="col-3 p-3 text-right"></div><div class="col-1 py-3 px-0"> <i class="ui small circle outline icon bg-white"></i><div class="transit-line"></div> </div><div class="col-8 p-3">'+option.steps[i].route.stations[j].address+'</div></div> </div>';
        }

        html += '<div class="content"><div class="row m-0"><div class="col-3 p-3 text-center">'+option.steps[i].arrival_time.text+'</div><div class="col-1 py-3 px-0"><i class="circle outline icon"></i><div class="walking-line"></div> </div><div class="col-8 p-3 border-top"><h4>'+option.steps[i].end.address+'</h4></div></div> </div></div>';
        displayRouteOnMap(option.steps[i].route, option.steps[i].start, option.steps[i].end );
      }
    }

    
    html += '<div class="content"><div class="row m-0"><div class="col-3 p-3 text-center">'+option.arrival_time.text+'</div><div class="col-1 py-3 px-0"><i class=" map marker alternate icon"></i> </div><div class="col-8 p-3"><h4> '+destination.name+' </h4> </div></div> </div> </div>';

  }

  $("#option").html(html);

  $("#header").html($("#summary-template").html());
  $("#header .from").html(start.name);
  $("#header .to").html(destination.name);
  
  $('#directions').transition('hide');
  $('#option').transition('show');

  $(".back").prop("onclick", null).off("click");
  $('.back').click(function(){ back(); });
}



function millisecondsToStr (milliseconds) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();

  function numberEnding (number) {
      return (number > 1) ? 's' : '';
  }

  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years) {
      return years + ' year' + numberEnding(years);
  }
  //TODO: Months! Maybe weeks? 
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
      return days + ' day' + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
      return hours + ' hour' + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
      return minutes + ' min.';
  }
  return 'less than a second'; //'just now' //or other string you like;
}



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
    start = null;
    $("#start").val('');
  }
  if(destinationMarker){
    destinationMarker.setMap(null);
    destinationMarker = null;
    destination = null;
    $("#destination").val('');
  }
  $("#options").html("");
}
function setStartMarker(){
  var circleOutlineIcon = {
    scaledSize: new google.maps.Size(15, 15),
    url:'/circle-outline.png',
    origin: new google.maps.Point(0,0), 
    anchor: new google.maps.Point(7.5, 7.5) 
  };
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
        icon: circleOutlineIcon,
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
  var markerIcon = {
    scaledSize: new google.maps.Size(15, 15),
    url:'/marker.png',
  };
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
        icon: markerIcon ,
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
  $('#directions').transition('show');
  $('#route').transition('hide');
  $('#station').transition('hide');
  $('#option').transition('hide');
  $('#route-direction-change').transition('hide');
  $('#header').html('<h3>Find route</h3>');
  $('.back').click(function(){
    $('.ui.sidebar.left').sidebar('toggle');
  });
}

function optionSelectCall(event){
  displayOption(event.data.option, event.data.id);
}

function directions(){
  $('.ui.dimmer.directions').dimmer('show');
  $.ajax({
    url: "/api/directions",
    type: 'GET',
    data: { 
      start: start,
      destination: destination,
     },
    cache: false,
    success: function(data) {
      console.log(data);
      var walker = '<i class="fas fa-walking"></i>';
      var divider = '<i class="right angle icon divider"></i>';
      var bus = '<i class="bus icon"></i>';
      var optionsTmp = '';
      var length = data.options.length;
      if(length == 0){
        $("#no_directions .start").html(start.name);
        $("#no_directions .destination").html(destination.name);
        $("#no_directions").show();
      }else{
        $("#no_directions").hide();
      }
      var optionTmp = $("#option-template");
      for(var i = 0; i < length; i++){
        optionsTmp += optionTmp.html();
      }
      $("#options").html(optionsTmp);
      var options = document.querySelectorAll('#options .item');
      for(var i = 0; i < length; i++){
        options[i].id = "option-"+i;
        var optionId = options[i].id;
        if(data.options[i].mode == "transit"){
          $("#" + optionId +" .two").html(bus);
          var stepsCount = data.options[i].steps.length;
          var stepsIcons = '<div class="ui breadcrumb" style="background-color: inherit !important;">';
          for(var j = 0; j < stepsCount; j++){
            if(data.options[i].steps[j].mode == "transit"){
              stepsIcons += '<div class="ui label">'+ bus + data.options[i].steps[j].route.name +'</div>';
            }
            else if(data.options[i].steps[j].mode == "walk"){
              if(data.options[i].steps[j].duration < 60){
                continue;
              }
              stepsIcons += walker;
            }
            if(j == stepsCount - 1){
              break;
            }
            stepsIcons += divider;
          }
          stepsIcons += '</div>';
          $("#" + optionId +" .left").html(data.options[i].departure_time.text + " - " + data.options[i].arrival_time.text);
          $("#" + optionId +" .right").html(millisecondsToStr(data.options[i].duration*1000));
          $("#" + optionId +" .summary").html(stepsIcons);
        }
        else if(data.options[i].mode == "walk"){
          $("#" + optionId +" .two").html(walker);
          $("#" + optionId +" .right").html(millisecondsToStr(data.options[i].duration*1000));
          $("#" + optionId +" .left").html(data.options[i].distance.toFixed(1) + " km");
        }
        $("#"+optionId).on('click', {option: data.options[i], id: i}, optionSelectCall);
      }
      $('.ui.dimmer.directions').dimmer('hide');
    },
  });
  createEvent();
}


function fetchStations(){
  $.ajax({
    url: "/api/station/all",
    type: 'GET',
    data: { 
      
     },
    cache: false,
    success: function(data) {
      stations = data.data;
      
      displayStations();
    },
  });
}
function fetchRoutes(){
  $.ajax({
    url: "/api/route/all",
    type: 'GET',
    data: { 
      
     },
    cache: false,
    success: function(data) {
      routes = data.data;
      console.log(routes);
    },
  });

}


function createEvent(){
  if(auth){
    $.ajax({
      url: "/api/event/new",
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
      url: "/api/event/delete",
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
      url: "/api/event/all",
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


$("#no_directions").hide();

$('#route').transition('hide');
$('#station').transition('hide');
$('#option').transition('hide');
$('#route-direction-change').transition('hide');
$('.ui.sidebar.left').sidebar({dimPage: false,closable: false,transition: 'overlay'});

$('.ui.sidebar.right').sidebar({dimPage: false,transition: 'overlay'});


$('.left-sidebar-toggle').click(function(){
  $('.ui.sidebar.left')
    .sidebar('toggle');
});
$('.back').click(function(){
  $('.ui.sidebar.left')
  .sidebar('toggle');
});

$('.right-sidebar-toggle').click(function(){
  $('.ui.sidebar.right')
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
      url: '/api/place/search?q={query}'
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
      url: '/api/place/search?q={query}'
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
    url: '/api/route/search?q={query}'
  },
  fields: {
    results : 'data',
    title   : 'name',
    url     : 'html_url'
  },
  minCharacters : 1,
  onSelect: function(result, response){
    displayRoute(result);
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



