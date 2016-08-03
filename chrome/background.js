alert("here in background.js");
console.log("Hello, background.js")

var onMessageListener = function(message, sender, sendResponse) {
    switch(message.type) {
        case "bglog":
            console.log(message.obj);
        break;
    }
    return true;
}
chrome.runtime.onMessage.addListener(onMessageListener);




//-----------
var ZION_PARKID = "70923";

function getTimeStamp() {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' +
            (now.getDate()) + '/' +
             now.getFullYear() + " " +
             now.getHours() + ':' +
             ((now.getMinutes() < 10)
                 ? ("0" + now.getMinutes())
                 : (now.getMinutes())) + ':' +
             ((now.getSeconds() < 10)
                 ? ("0" + now.getSeconds())
                 : (now.getSeconds())));
}

function findReservations(parkId,err) {

  console.log('findReservations('+parkId+") ------- ");

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
        console.log('result: '+result[1]);
        
        var msg = getTimeStamp()+'  '+result[1]; 

        chrome.notifications.create('reminder', {
	        type: 'basic',
	        iconUrl: 'RecreationDotGovLogo.png',
	        title: 'Find My Campsite Query Status',
	        message: msg
      	}, function(notificationId) {});

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


/*
 * Alarm listener where the event was created in popup.js
 * This calls the script everytime the alarm triggers
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
     //alert('beep '+ZION_PARKID);
     findReservations(ZION_PARKID);

});