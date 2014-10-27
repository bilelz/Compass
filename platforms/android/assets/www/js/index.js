/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var geocoder;
var mapType = "ROADMAP";
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        var compassNumber = 0;
        // paint compass
        for(var i=0;i<180;i++){
            compassNumber = i*2;
            compassNumber = (compassNumber==0)?"N":compassNumber;
            compassNumber = (compassNumber==90)?"E":compassNumber;
            compassNumber = (compassNumber==180)?"S":compassNumber;
            compassNumber = (compassNumber==270)?"W":compassNumber;

            document.getElementById('ring').innerHTML += '<span style="-webkit-transform: rotate('+i*2+'deg) translateX(10em);">'
                                                            +'<span class="compassNumber">'+compassNumber+'</span>'
                                                        +'</span>';
        }

        document.getElementById('searchLocation').onclick = function(){
            navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);
        };

        document.getElementById('getGeo').onclick = function(){
            window.scrollTo(0,0);
            document.querySelector("#search").classList.add('show');
            document.querySelector("#citySearch").focus();
        };

        document.getElementById('hideSearch').onclick = function(){
            hideSearch();
        };

        document.getElementById('search').onblur = function(){
            hideSearch();
        };



        document.getElementById('mapOut').onclick = function() {
                map.setZoom(map.getZoom()-1);
        };

        /*document.getElementById('mapMan').onclick = function() {
                map.setZoom(16);
        };*/

        document.getElementById('mapIn').onclick = function() {
                map.setZoom(map.getZoom()+1);
        };

        document.getElementById('mapSat').onclick = function() {
            if(mapType == "ROADMAP"){
                map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                mapType = "SATELLITE";
                document.querySelector("body").classList.add('mapSat');
            }else{
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                mapType = "ROADMAP";
                document.querySelector("body").classList.remove('mapSat');

            }
        };


    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
		navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);

        document.querySelector("body").classList.remove('notready');
        document.querySelector("body").classList.add('ready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:inline-block;');

        //log('Received Event: ' + id);
    }
};

var headingOld = 0, headingTmp = 0;
function onSuccess(heading) {

    

   /* console.log('magneticHeading: ' + heading.magneticHeading 
						+ '<br/>trueHeading: '+ heading.trueHeading
						+ '<br/>headingAccuracy: '+ heading.headingAccuracy
						+ '<br/>timestamp: '+ heading.timestamp);*/

    headingTmp = Math.floor(heading.trueHeading+0.5);
    //headingTmp = heading.trueHeading.toFixed(1);
    
   /* document.getElementById('headingAccuracy').innerHTML = "headingTmp: "+ headingTmp + "°<br/>"
                                                        + "magneticHeading: "+heading.magneticHeading + "°<br/>"
                                                       + "trueHeading: "+heading.trueHeading + "°<br/>"
                                                        + "headingAccuracy: "+heading.headingAccuracy + "°";
	*/
//if(headingOld<360 && heading.trueHeading>0)
    

	document.getElementById('compass').style.webkitTransform = "rotate(-"+headingTmp+"deg)";
    document.getElementById('geoMapInner').style.webkitTransform = "rotate(-"+headingTmp+"deg)";
    document.getElementById('center').style.webkitTransform = "rotate("+headingTmp+"deg)";
    document.getElementById('info').style.webkitTransform = "rotate("+headingTmp+"deg)";

    document.querySelector("#ring > :nth-child(1) .compassNumber").style.webkitTransform = "rotate("+(headingTmp+90)+"deg)";
    document.querySelector("#ring > :nth-child(46) .compassNumber").style.webkitTransform = "rotate("+(headingTmp+0)+"deg)";
    document.querySelector("#ring > :nth-child(91) .compassNumber").style.webkitTransform = "rotate("+(headingTmp+270)+"deg)";
    document.querySelector("#ring > :nth-child(136) .compassNumber").style.webkitTransform = "rotate("+(headingTmp+180)+"deg)";

    document.getElementById('headingNumber').innerHTML = parseInt(headingTmp,10) + "°";



    // pour une meilleur transition entre les valeurs avant et aprés zéro


    headingOld = heading.trueHeading;
};

function onError(compassError) {
    log('Compass error: ' + compassError.code);
};

var options = {
    frequency: 100
}; // ms


// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccessGeo = function(position) {
    console.log('Latitude: '          + position.coords.latitude          + '<br/>'
												+ 'Longitude: '         + position.coords.longitude         + '<br/>' 
												+ 'Altitude: '          + position.coords.altitude          + '<br/>' 
												+ 'Accuracy: '          + position.coords.accuracy          + '<br/>' 
												+'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br/>' 
												+'Heading: '           + position.coords.heading           + '<br/>' 
												+'Speed: '             + position.coords.speed             + '<br/>' 
												+'Timestamp: '         + position.timestamp                + '<br/>');

    geocoder = new google.maps.Geocoder();
    setCityFromLatLng(position.coords.latitude,position.coords.longitude );
    hideSearch();
};

// onError Callback receives a PositionError object
//
function onErrorGeo(error) {
    log('code: '    + error.code    + '<br/> message: ' + error.message + '<br/>');
}



function setCityFromLatLng(lat,lng){
    document.getElementById('geoCity').href = 'geo:'+lat+','+lng;                           
    document.getElementById('geoLocality').innerHTML = parseFloat(lat).toFixed(2)+','+parseFloat(lng).toFixed(2);  
    document.getElementById('geoCountry').innerHTML = '';    
    /*document.getElementById('geoMapInner').style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?center='+lat+','+lng+'&markers=%7C21.422515,39.826175&size=500x500&scale=2&style=gamma:2&zoom=16&key=AIzaSyBk8ZqXadQlSHZlqlKu4OR5MfveoA-hatQ)';*/
    
    //qibla
    setQibla(lat, lng);

    initializeMap(lat,lng);

    var latlng = new google.maps.LatLng(lat, lng);
                        
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var arrAddress = results[0].address_components;

            for (var index = 0; index < arrAddress.length; ++index) {
                console.log(arrAddress[index]);
                if (arrAddress[index].types[0] == "locality") {
                    document.getElementById('geoLocality').innerHTML = arrAddress[index].long_name;
                }
                if (arrAddress[index].types[0] == "country") {
                    document.getElementById('geoCountry').innerHTML = arrAddress[index].long_name;
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

function log(txt){
    console.log(txt);
    document.getElementById('log').innerHTML = txt+"<br/>"+document.getElementById('log').innerHTML;
}

var map, maxZoomService, autocomplete;
function initializeMap(lat,lng) {
  var mapOptions = {
    zoom: 16,
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

  /*maxZoomService = new google.maps.MaxZoomService();
  maxZoomService.getMaxZoomAtLatLng(new google.maps.LatLng(lat,lng), 
                                        function(data){
                                            document.getElementById('mapZoom').max = data.zoom;
                                    }); */

  //autocomplete
    autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('citySearch')),
      {
        types: ['(cities)']
      });
  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
}