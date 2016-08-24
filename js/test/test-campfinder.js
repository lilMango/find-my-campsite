var campfinder = require('../campfinder');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var Promise = require('bluebird');

describe('findReservation', function() {
	this.timeout(7000);
	it('should return a positive integer value');
	it('should return 0 found sites', function(){
		var tmp = campfinder.findReservation(campfinder.sampleParams);
		return tmp.should.eventually.equal('0');
	});
	  	
  	it('should return a page not found', function(){
		var tmp = campfinder.findReservation({});
		return tmp.should.be.rejected;
	}); 
});
