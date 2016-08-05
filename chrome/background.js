/*
* The background script runs thoughout the lifetime of chrome session (lasts longer than being on active recreation.gov tab)

*/
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


/*
 * Alarm listener where the event was created in popup.js
 * This calls the script everytime the alarm triggers
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
     
    CAMP.findReservations( function(result) {
     		console.log('result: '+result);
	        
	        var msg = UTILS.getTimeStampPretty()+'  '+result; 

	        chrome.notifications.create('reminder', {
		        type: 'basic',
		        iconUrl: 'RecreationDotGovLogo.png',
		        title: 'Find My Campsite Query Status',
		        message: msg
	      	}, function(notificationId) {});
     });

});