var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
console.log("hi")

var ZION_PARKID = "70923";
var COOKIE_URL = "http://www.recreation.gov/camping/watchman-campground-ut/r/campgroundDetails.do?contractCode=NRSO&parkId="+ZION_PARKID;
var xhr = new XMLHttpRequest();

function getCookie(parkId) {
	
	var procCookieReq = function (e) {
		if (xhr.readyState == 4) {
	    	if(xhr.status == 200) {
	        	//console.log(xhr.responseText);
	        	console.log('all response headers')
	        	console.log(xhr.getAllResponseHeaders());	
	        	console.log('Set-Cookie')
	        	var cookieHeaderFields = xhr.getResponseHeader("Set-Cookie");
	        	console.log(cookieHeaderFields);
	        	for(var i=0;i< cookieHeaderFields.length;i++) {
	        		var fields = cookieHeaderFields[i].split(';');
	        		console.log('fields:')
	        		console.log(fields)
					var cookieValue = fields[0];
					console.log('cookieValue:')
					console.log(cookieValue);
					// Correct cookie found
					if (cookieValue.includes("JSESSIONID")) {

						console.log("found JsessionID");
						return cookieValue;
					}
	        	}
	        	return "";
	    	}
	    } else {
	    	console.log('failed request');
	    }
	}
	
	xhr.open('GET', COOKIE_URL, true);
	xhr.send();
	xhr.addEventListener("readystatechange", procCookieReq, false);	
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
    //xhr.setRequestHeader("Content-Length", paramsURL.length);
    //xhr.setRequestHeader("Cookie", jSessionId);

    xhr.send(paramsURL);
   	xhr.addEventListener("readystatechange", function () {
		if (xhr.readyState == 4) {
	    	if(xhr.status == 200) {
	    		var LINE_LENGTH=15;
	    	
	    		var responseText = xhr.responseText;	    		
	    		console.log('-----------------------------------')
	    		//console.log(responseText)
	    		console.log('----------------------------------- End response')

	    		var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)<\/div>/); //result
	    		console.log('result:');
	    		console.log(result[1])
	    	}
	    } else {
	    	console.log('failed request');
	    }
   	}, false);
}


var jSessionId = getCookie(ZION_PARKID);
findReservations(ZION_PARKID,jSessionId);
