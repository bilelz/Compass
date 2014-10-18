


var qiblaLat = 21.422515;
var qiblaLng = 39.826175; 



function setQibla(lat, lng){
	//qibla
    var qibla = getQiblaDirectionV2(lat, lng);
    document.getElementById('qiblaDistance').innerHTML = getQiblaDistance(lat, lng) + "km";

    document.getElementById('qibla').style.webkitTransform = "rotate("+qibla+"deg)";
    document.getElementById('qibla').style.display = "block";
    document.getElementById('qiblaNumber').innerHTML = qibla.toFixed(0) + "°";
    document.getElementById('qiblaNumber').title = qibla.toFixed(0) + "°";
    document.getElementById('qiblaInfo').style.display = 'inline-block';
}

// find the direction

function getQibla(lat1, lng1){
	var qiblaDirection =  getDirection(lat1, lng1, qiblaLat, qiblaLng);
	
	if(qiblaDirection<0){
		qiblaDirection = -qiblaDirection;
	}

	return qiblaDirection;
}

function getQiblaDistance(lat1, lng1){
	return distance(lat1, lng1, qiblaLat, qiblaLng, "K").toFixed(0);
}

function getDirection(lat1, lng1, lat2, lng2) 
{
	var dLng = lng1- lng2;
	return rtd(getDirectionRad(dtr(lat1), dtr(lat2), dtr(dLng)));
}

function getDirectionRad(lat1, lat2, dLng) 
{
	return Math.atan2(Math.sin(dLng), Math.cos(lat1)* Math.tan(lat2)- Math.sin(lat1)* Math.cos(dLng));
}





//v2, algo from http://eqibla.com/

// compute the direction between two points
function getDirectionV2(lat1, lng1, lat2,  lng2) {
	var lat1 = dtr(lat1);
	var lat2 = dtr(lat2);
	var dLng = dtr(lng2)- dtr(lng1);
	var angle = Math.atan2(Math.sin(dLng), Math.cos(lat1)* Math.tan(lat2)- Math.sin(lat1)* Math.cos(dLng));
	return (angle* 180.0)/ Math.PI;
}

// reurn qibla direction for a given location
function getQiblaDirectionV2(lat, lng) {
	var qiblaDir = getDirectionV2(lat, lng, qiblaLat, qiblaLng);
	if (qiblaDir < 0) 
		qiblaDir += 360;
	return qiblaDir;
}

//end : v2

//-------------------------- Angle Unit Conversion -----------------------


// degree to radian
function dtr(d)
{
    return (d* Math.PI)/ 180.0;
}

// radian to degree
function rtd(r)
{
    return (r* 180.0)/ Math.PI;
}


/* from : http://www.zipcodeworld.com/samples/distance.js.html */
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}   