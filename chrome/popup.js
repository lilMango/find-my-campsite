var RECREATION_URL = "recreation.gov";
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(redirectCb,cb) {
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

      cb();
    } else { //current tab not at Recreation.gov. Go to that site so we can by pass CORS problems when running script
      var val = confirm('Navigate to recreation.gov?');
      if(val === true) {
        redirectCb();
      }      
    }
        
  });
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
        id: "myAlarm",
        createAlarm : function(e) {
            bglog("Alarm: ON");
            chrome.alarms.create(alarmClock.id, {delayInMinutes: 0.1, periodInMinutes: 15.0} );
                    window.close();
        },
        cancelAlarm : function(e) {
            bglog("Alarm: off");
            chrome.alarms.clear(alarmClock.id);
                    window.close();
        },
        setup: function(onEl,offEl) {
            var a = document.getElementById(onEl);
            a.addEventListener('click',  alarmClock.createAlarm );
            var a = document.getElementById(offEl);
            a.addEventListener('click',  alarmClock.cancelAlarm );
        }
};

/**
* When the user clicks the chrome extension icon
*/
document.addEventListener('DOMContentLoaded', function() {  

  alarmClock.setup("alarmOnBtn","alarmOffLink");

  getCurrentTabUrl(function() {
    chrome.tabs.update({url: "http://www.recreation.gov"});    
  },
  function() {
     CAMP.findReservations( function(result) {
        console.log('result: '+result);
          
          var msg = UTILS.getTimeStampPretty()+'  '+result; 
          document.getElementById('status').textContent = msg;

     });
  });
});



