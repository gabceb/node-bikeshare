var fakeweb = require('node-fakeweb'),
	fs = require('fs'),
	path = require('path');

fakeweb.allowNetConnect = false;
fakeweb.registerUri({uri: 'http://bayareabikeshare.com:80/stations/json', file: path.join(__dirname, 'bayareabikeshare.com.json')});
fakeweb.registerUri({uri: 'http://bayareabikeshare.com:80/stations/json_with_offline_stations', file: path.join(__dirname, 'bayareabikeshare.com_with_offline_stations.json')});
fakeweb.registerUri({uri: 'http://bayareabikeshare.com:80/stations/bad_response', file: path.join(__dirname, 'bayareabikeshare.com_bad_response.json'), statusCode : 500});