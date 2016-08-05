/**
* The alarm module simply sets up the chrome alarm. It triggers an event which a listener (ie. in background.js) acts on
*/
var ALARM = (function() {

    var id="myAlarm";
    var PERIOD_IN_MINUTES = 10.0;
    var createAlarm = function(e) {
          bglog("Alarm: ON");
          chrome.alarms.create(id, {periodInMinutes: PERIOD_IN_MINUTES} );
          window.close();
    }

    var cancelAlarm = function(e) {
          bglog("Alarm: off");
          chrome.alarms.clear(id);
          window.close();
    }

    return {
          id: id,
          createAlarm : createAlarm,
          cancelAlarm :cancelAlarm,
          setup: function(onEl,offEl) {
              var a = document.getElementById(onEl);
              a.addEventListener('click',  createAlarm );
              var a = document.getElementById(offEl);
              a.addEventListener('click',  cancelAlarm );
          }
    };

})(); 