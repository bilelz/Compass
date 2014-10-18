function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.setCenter(place.geometry.location);
    //map.setZoom(15);
    setQibla(place.geometry.location.lat(), place.geometry.location.lng());
    //formatted_address:
    document.getElementById('geoLocality').innerHTML = place.formatted_address;
    document.getElementById('geoCountry').innerHTML = "";
    document.getElementById('geoCity').href = 'geo:'+place.geometry.location.lat()+','+place.geometry.location.lng();  

    hideSearch();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }

}

function hideSearch(){
	document.querySelector("#search").classList.remove('show');
    document.querySelector("#citySearch").value = "";
}