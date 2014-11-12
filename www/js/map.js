var map, maxZoomService, autocomplete, geodesicPoly;


 

function initializeMap(lat,lng) {
    var zoomTmp = (map==undefined)?16:map.getZoom(); // keep current zoom if available
  var mapOptions = {
    zoom: zoomTmp,
    center: new google.maps.LatLng(lat,lng),
    disableDefaultUI: true
  };

  document.querySelector("body").classList.add('mapReady');

  map = new google.maps.Map(document.getElementById('geoMapInner'), mapOptions);

  var marker = new google.maps.Marker({
        position: new google.maps.LatLng(21.422515,39.826175),
        title:"Mekkah!",
        icon: 'img/kabah.png'
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);

  maxZoomService = new google.maps.MaxZoomService();
  maxZoomService.getMaxZoomAtLatLng(new google.maps.LatLng(lat,lng), 
                                        function(data){
                                            // test if current map has a good zoom
                                            if(data.zoom < map.getZoom()){
                                                map.setZoom(data.zoom);
                                            }
                                    }); 

  //autocomplete
    autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('citySearch')),
      {
        types: ['(cities)']
      });
  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);

  google.maps.event.addListener(map, 'center_changed', onCenterChanged);

  //draw great circle
  var geodesicOptions = {
    strokeColor: '#4486F6',
    strokeOpacity: 1,
    strokeWeight: 2,
    geodesic: true,
    map: map
  };
  geodesicPoly = new google.maps.Polyline(geodesicOptions);
  updateGreatCircle(lat,lng);
}

function centerMap(lat, lng){

}
var onCenterChangedTimeout = setTimeout();
function onCenterChanged() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    clearTimeout(onCenterChangedTimeout);
    onCenterChangedTimeout = window.setTimeout(function() {
    	//setCityFromLatLng(map.getCenter().lat(), map.getCenter().lng() );
    	//qibla
    setQibla(map.getCenter().lat(), map.getCenter().lng());
    updateGreatCircle(map.getCenter().lat(), map.getCenter().lng()); 
    getCityNameFromGPS(map.getCenter().lat(), map.getCenter().lng()); 
    }, 300);
 }


 function getCityNameFromGPS(lat,lng, fromGeoloc){
 	var latlng = new google.maps.LatLng(lat, lng);
                        
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var arrAddress = results[0].address_components;

            for (var index = 0; index < arrAddress.length; ++index) {
                console.log(arrAddress[index]);
                if (arrAddress[index].types[0] == "locality") {
                    document.getElementById('geoLocality').innerHTML = arrAddress[index].long_name;

                    if(fromGeoloc){
                    	document.getElementById('nearCity').innerHTML = arrAddress[index].long_name;
                    }
                    
                }
                if (arrAddress[index].types[0] == "country") {
                    document.getElementById('geoCountry').innerHTML = arrAddress[index].long_name;
                    if(fromGeoloc){
                    	document.getElementById('nearCountry').innerHTML = ", "+arrAddress[index].long_name;
                    }
                }
            }
          } else {
            log("No results found");
          }
        } else {
          log("Geocoder failed due to: " + status);
        }
      });
 }

// https://developers.google.com/maps/documentation/javascript/examples/geometry-headings
 function updateGreatCircle(lat,lng) {
  var path = [new google.maps.LatLng(lat, lng), new google.maps.LatLng(qiblaLat, qiblaLng)];
  //poly.setPath(path);
  geodesicPoly.setPath(path);
  var heading = google.maps.geometry.spherical.computeHeading(path[0],path[1]);
  //document.getElementById('heading').value = heading;
  //document.getElementById('origin').value = path[0].toString();
  //document.getElementById('destination').value = path[1].toString();
}