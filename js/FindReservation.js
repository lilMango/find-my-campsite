var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
console.log("hi")

var ZION_PARKID = "70923";
var COOKIE_URL = "http://www.recreation.gov/camping/watchman-campground-ut/r/campgroundDetails.do?contractCode=NRSO&parkId="+ZION_PARKID;


function getCookie(parkId,cb) {
	var xhr = new XMLHttpRequest();	

	var procCookieReq = function (e) {
		if (xhr.readyState == 4) {
	    	if(xhr.status == 200) {
	        	var cookieHeaderFields = xhr.getResponseHeader("Set-Cookie");
	        	console.log(cookieHeaderFields);
	        	for(var i=0;i< cookieHeaderFields.length;i++) {
	        		var fields = cookieHeaderFields[i].split(';');
					var cookieValue = fields[0];
					// Correct cookie found
					if (cookieValue.includes("JSESSIONID")) {

						console.log("found JsessionID: "+cookieValue);
						cb(ZION_PARKID,cookieValue);
						//return cookieValue;
					}
	        	}
	        	return "";
	    	} else {
	    		console.log("404 err @ procCookieReq");
	    	}
	    } else {
	    	console.log('still fetching @procCookieReq');
	    }
	}
	
	xhr.open('GET', COOKIE_URL, true);	
	xhr.addEventListener("readystatechange", procCookieReq, false);	
	xhr.send();
}

var paramsJson = {
    	"parkId": ZION_PARKID,
    	"contractCode": "NRSO",        
        "siteTypeFilter": "ALL",
        "submitSiteForm": "true",
        "search": "site",
        "submitSiteForm": "true",
        "currentMaximumWindow": "12",
        "arrivalDate": "Fri Aug 26 2016",
        "departureDate": "Sun Aug 28 2016",
        "camping_common_3012": 4
}

function findReservations(parkId,jSessionId) {
	
	console.log('findReservations('+parkId+","+jSessionId+")");
	
	var xhr = new XMLHttpRequest();	

	var paramsURL="";

	//json key vals to parameter string
	for(var prop in paramsJson) {
		if(paramsJson.hasOwnProperty(prop)) {
			if(paramsURL !== "") {
				paramsURL +="&";
			}
			paramsURL = paramsURL + prop + "=" + paramsJson[prop];

		}
	}
	console.log("Parameters:");
	console.log(paramsURL);


	xhr.open('POST', "http://www.recreation.gov/campsiteSearch.do", true);	
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.withCredentials = true;  	
	xhr.crossDomain = true;
	xhr.setRequestHeader("Cookie",jSessionId);

    xhr.send(paramsURL);
   	xhr.addEventListener("readystatechange", function () {
		if (xhr.readyState == 4) {
	    	if(xhr.status == 200) {
	    		var responseText = xhr.responseText;	    		
	    		//var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)<\/div>/);
	    		var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)</);
	    		console.log('result:');
	    		console.log(result[1])
	    		return result[1];
	    	} else {
	    		console.log("404 err @ findReservations");
	    	}
	    } else {
	    	console.log('still fetching');
	    }
   	}, false);
}


getCookie(ZION_PARKID,findReservations);
//findReservations(ZION_PARKID,jSessionId);
