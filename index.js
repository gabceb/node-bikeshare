var util = require('util'),
	request = require('request'),
	events = require('events'),
	_und = require('underscore'),
	_und_s = require('underscore.string');

var _my = null;

var debug;

if (/\bbikeshare\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    console.error('BIKESHARE %s', util.format.apply(util, arguments))
  }
} else {
  debug = function() {}
}

var defaultShareUrl = "http://bayareabikeshare.com/stations/json";

var BikeShare = function(url){
	this.url = url || defaultShareUrl;
	_my = { stations : {} };
};

BikeShare.prototype = new events.EventEmitter;

module.exports = BikeShare;

BikeShare.prototype.fetch = function(){
	var self = this;

	request({uri : this.url, json : true }, function(error, response, body){
		if(!error && response.statusCode == 200){
			self.original_response = body;
			self.response = self.original_response.stationBeanList

			initAllProperties.apply(self);

			self.emit("fetch");
		}
		else{
			self.emit("error", error);
		}
	});
};

function initAllProperties()
{
	// title of the page, as string
	this.lastStation = getLastStation.bind(this);

	// array of strings, with every link found on the page
	this.station = getStation.bind(this);

	this.stations = getStationsForCity.bind(this);
}

function getLastStation()
{
	debug("Getting last station");

	if(_my.lastStation === undefined)
	{
		_my.lastStation = _und.last(this.response);
	}
	 
	return _my.lastStation;
}

function getStation(stationId)
{
	debug("Getting station with id " + stationId);
	
	if (_my.stations[stationId] == undefined)
	{
		// Set the station to null to avoid having to look for it again if it is not found
		_my.stations[stationId] = _und.findWhere(this.response, {id : stationId }) || null;
	}
	
	return _my.stations[stationId];
}

function getStationsForCity(cityName)
{
	var stations = null;

	// If the method has no city name we will return all stations
	if(_und.isUndefined(cityName))
	{
		stations = this.response;
	}
	else
	{
		cityName = _und_s.titleize(cityName);

		debug("Getting station for city " + cityName);
		
		if (_my.stations[cityName] == undefined)
		{
			_my.stations[cityName] = _und.where(this.response, { city : cityName }) || null;
		}
		
		stations =  _my.stations[cityName];
	}

	return stations;
}