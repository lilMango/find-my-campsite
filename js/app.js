var restify = require('restify');
var CampFinder = require('./CampFinder.js');
var server = restify.createServer();
var nodemailer = require('nodemailer');

//--------------------------------------------
var config = require('../config.json');
var campParamsQueue = config.campParameters; //initial data
var campRequestsQueue = campParamsQueue; // 
//--------------------------------------------
var doSendEmail = false;
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.fromGmailUsername,
        pass: config.fromGmailPassword
    }
});

var mailOptions = {
    from: config.fromGmailUsername,
    to: config.emailRecipient,
    subject: 'Your campsite is available',
    text: "Some text"
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};



//Data base that stores array of camp Querys that a 'daemon will monitor'

function send(req, res, next) {
   res.send('hello ' + req.params.name);
   return next();
}

 server.post('/hello', function create(req, res, next) {
   res.send(201, Math.random().toString(36).substr(3, 8));
   return next();
 });

 server.put('/hello', send);
 server.get('/hello/:name', send);
 server.head('/hello/:name', send);
 server.del('hello/:name', function rm(req, res, next) {
   res.send(204);
   return next();
 });
server.get(/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/, function(req, res, next) {
  console.log(req.params[0]);
  console.log(req.params[1]);
  res.send(200);
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);


  // scan the queue constantly
  setInterval(function(){
	for(var i=0; i < campParamsQueue.length; i++) {
		var campParams = campParamsQueue[i];
		
		function resultRenderer(res) {
			if(!isNaN(res)) {
				if(res>0) {//found the site
					//TODO dequeue 
					mailOptions.text = res+" site(s) available for: "+ campParams.alias;
					mailOptions.text += "\n"+'Arrival Date: '+ campParams.arrivalDate;
					mailOptions.text += "\n" +'Departure Date: '+ campParams.departureDate;
					console.log(mailOptions.text);
					
					if(doSendEmail) {
						transporter.sendMail(mailOptions, function(error, info){
						    if(error){
						        console.log(error);        
						    }else{
						        console.log('Message sent: ' + info.response);       
						    };
						});
					}
				} else {
					console.log(res+" site(s) available for: "+ campParams.alias);
				}
			} else {
				console.log(res+"  not a number.");
			}
		}
		CampFinder.findReservation(campParams).then(resultRenderer);		
	}
  },config.scriptPeriodSeconds*1000)
});