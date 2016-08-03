var RECREATION_URL = "recreation.gov";
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback,cb) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    
    
    if(url.indexOf(RECREATION_URL) !== -1) {  //sweet we arre on the recreation.gov site, run the script!!      

      cb(ZION_PARKID);
    } else { //current tab not at Recreation.gov. Go to that site so we can by pass CORS problems when running script
      var val = confirm('Navigate to recreation.gov?');
      if(val === true) {
        callback();
      }      
    }
        
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

var ZION_PARKID = "70923";


function findReservations(parkId,err) {

  bglog('findReservations('+parkId+") ------- ");

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
  bglog("Parameters:");
  bglog(paramsURL);


  xhr.open('POST', "http://www.recreation.gov/campsiteSearch.do", true);  
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.send(paramsURL);
  xhr.onload = function() {
  //xhr.addEventListener("readystatechange", function () {
  if (xhr.readyState == 4) {
      if(xhr.status == 200) {
        var responseText = xhr.responseText;          
        var result = responseText.match(/<div class='matchSummary'>([\s\S]*?)</);        
        bglog('result: '+result[1]);
        renderStatus(result[1]);
        return result[1];
      } else {
        bglog("404 err @ findReservations");
      }
    } else {
      bglog('still fetching');
    }
  //}, false);
  }

  xhr.onerror = function() {
    err("Error @ findReservations");
  }
}

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

function renderStatus(statusText) {
  document.getElementById('status').textContent = getTimeStamp()+"  "+statusText;
}

/**
* console.log in the background page (Message passing mechanism aka LOGGING)
*/
var bglog = function(obj) {
  if(chrome && chrome.runtime) {
    chrome.runtime.sendMessage({type: "bglog", obj: obj});
  }
}


var alarmClock = {
        alarmId: "myAlarm",
        createAlarm : function(e) {
            bglog("Alarm: ON");
            chrome.alarms.create(alarmClock.alarmId, {delayInMinutes: 0.1, periodInMinutes: 0.2} );
                    window.close();
        },
        cancelAlarm : function(e) {
            bglog("Alarm: off");
            chrome.alarms.clear(alarmClock.alarmId);
                    window.close();
        },
        setup: function() {
            var a = document.getElementById('alarmOn');
            a.addEventListener('click',  alarmClock.createAlarm );
            var a = document.getElementById('alarmOff');
            a.addEventListener('click',  alarmClock.cancelAlarm );
        }
};

/**
* When the user clicks the chrome extension icon
*/
document.addEventListener('DOMContentLoaded', function() {  

alarmClock.setup();

  getCurrentTabUrl(function() {
    chrome.tabs.update({url: "http://www.recreation.gov"});    
  },
  findReservations);
});



