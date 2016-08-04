var CAMP = (function() {

	var parkId = "70923";//zion

	var defaultParamsJson = {
		"parkId": parkId,
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
	/* 
	 * Pulls out the result string from the post call, then pass result to callback 
	 */
	var findReservations = function(cb,params,err) {

	  var paramsJson = defaultParamsJson;
	  if(params) {
	  	paramsJson = params;
	  }

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
	  
	  xhr.send(paramsURL);
	  xhr.onload = function() {
	  //xhr.addEventListener("readystatechange", function () {
	  if (xhr.readyState == 4) {
	      if(xhr.status == 200) {
	        var responseText = xhr.responseText;          
	        var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)</);        
	        cb(result[1]);	       

	        return result[1];
	      } else {
	        console.log("404 err @ findReservations");
	      }
	    } else {
	      console.log('still fetching');
	    }
	  //}, false);
	  }

	  xhr.onerror = function() {
	    err("Error @ findReservations");
	  }
	}

	return {
		findReservations:findReservations,
	}

})();