var querystring = require('querystring');
var http = require('http');
var Promise = require('bluebird');
var Request = Promise.promisify(require('request'),{multiArgs:true});

var parkId = "70923";//zion
var COOKIE_URL = "http://www.recreation.gov/camping/watchman-campground-ut/r/campgroundDetails.do?contractCode=NRSO&parkId="+parkId;

var defaultParamsJson = {
	"parkId": parkId,
	"contractCode": "NRSO",        
	"siteTypeFilter": "ALL",
	"submitSiteForm": "true",
	"search": "site",
	"submitSiteForm": "true",
	"currentMaximumWindow": "12",
	"arrivalDate": "Fri Sep 09 2016",
	"departureDate": "Sun Sep 11 2016",
	"camping_common_3012": 4
}

/*
* Expects callback 'cb' to determine what to do with integer parsed result
*/
function findReservation(campOptions,cb) {	

	var queryParams = {};

	//white list for request query parameters
	for(key in campOptions)	{
		if(key in defaultParamsJson) {
			queryParams[key] = campOptions[key];
		}
	}
	console.log('querying: '+ JSON.stringify(queryParams));
	
	var getCookie = function() {
	    var reqOptionsCookie = {
	        url: 'http://www.recreation.gov/camping/watchman-campground-ut/r/campgroundDetails.do',
	        qs: queryParams, 
	        method: 'GET'    
	    }

	    return new Request(reqOptionsCookie).spread(function (response) {
	        if (response.statusCode == 200) {            

	            var cookieHeaderFields = response.headers['set-cookie'];
	        
	            for(var i=0;i< cookieHeaderFields.length;i++) {
	                var fields = cookieHeaderFields[i].split(';');
	                var cookieValue = fields[0];
	                // Correct cookie found
	                if (cookieValue.includes("JSESSIONID")) {                    
	                    return cookieValue;
	                }
	            }   
	                    
	            return "";
	        } else {
	            // TODO 200 is not the only successful code
	            throw new Error("getCookie() -> HTTP Error: " + response.statusCode );
	        }
	    });
	}

	// returns number of sites available
	var queryReservation = function(jSessionId) {

	    var reqOptions = {
	        url: 'http://www.recreation.gov/campsiteSearch.do',
	        qs: queryParams,
	        method:'POST',
	        headers:{
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Cookie':jSessionId            
	        }
	    }

	    return new Request(reqOptions).spread(function (response) {
	        if (response.statusCode == 200) {    
	            var responseText = response.body;
	            //var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)</); //gets sentence
	            var result = responseText.match(/<div class='matchSummary'>([\d]*?) site/); //parses number out
	                
	            return result[1];
	        } else {
	            // TODO 200 is not the only successful code
	            throw new Error("QueryReservation() -> HTTP Error: " + response.statusCode );
	        }
	    });
	    
	}

	getCookie().then(queryReservation).then(cb).catch(function(err){
	    console.log('err on Bluebird promise')
	    console.log(err);
	});
}

module.exports.findReservation = findReservation;


