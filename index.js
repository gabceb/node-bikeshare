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
	this.lastStation = getLastStation.bind(this);

	this.station = getStation.bind(this);

	this.stations = getStationsForCity.bind(this);

	this.emptyStations = getEmptyStations.bind(this);
	this.isEmptyStation = isEmptyStation.bind(this);

	this.fullStations = getFullStations.bind(this);
	this.isFullStation = isFullStation.bind(this);

	this.percentAvailableBikes = percentAvailableBikes.bind(this);

	this.offlineStations = offlineStations.bind(this);

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

function getEmptyStations()
{
	debug("Getting empty stations");
	
	if (_my.empty_stations == undefined)
	{
		_my.empty_stations = _und.where(this.response, { availableBikes : 0 }) || null;
	}
	
	return _my.empty_stations;
}

function isEmptyStation(stationId)
{
	// If we receive a station object instead of an id we will grab the id from it
	if(_und.isObject(stationId))
	{
		stationId = stationId.id;
	}

	return ( getStation.apply(this, [stationId]).availableBikes == 0 );
}

function getFullStations()
{
	debug("Getting full stations");
	
	if (_my.empty_stations == undefined)
	{
		_my.empty_stations = _und.where(this.response, { availableDocks : 0 }) || null;
	}
	
	return _my.empty_stations;
}

function isFullStation(stationId)
{
	// If we receive a station object instead of an id we will grab the id from it
	if(_und.isObject(stationId))
	{
		stationId = stationId.id;
	}

	return ( getStation.apply(this, [stationId]).availableDocks == 0 );
}

function percentAvailableBikes(stationId)
{
	// If we receive a station object instead of an id we will grab the id from it
	if(_und.isObject(stationId))
	{
		stationId = stationId.id;
	}

	var station = getStation.apply(this, [stationId]);

	var available = parseFloat(station.availableBikes);
	var total = parseFloat(station.totalDocks);

	return Number( (available * 100 / total).toFixed(2));
}

function offlineStations()
{
	if (_my.offlineStations == undefined)
	{
		_my.offlineStations = _und.where(this.response, { statusKey : 0 }) || null;
	}
	
	return _my.offlineStations;
}