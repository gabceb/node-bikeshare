## Node-Bikeshare

Node-Bikeshare is an npm package used to interact with the data from the Bay Area Bike Share program

Node-Bikeshare is inspired by the Bikeshare gem by [Zack Shapiro](https://github.com/zackshapiro/bikeshare)

## Usage

```javascript
var client = new Bikeshare();

client.on("fetch", function(){
    console.log("Stations count: " + client.stations().length);

    console.log("San Francisco stations count: " + client.stations("San Francisco").length );
});

client.on("error", function(err){
	console.log(error);
});

client.fetch();

```

## Available methods:

- station
- stations
- lastStation
- emptyStations
- isEmptyStation
- fullStations
- isFullStation
- percentAvailableBikes
- offlineStations

## ZOMG Fork! Thank you!

You're welcome to fork this project and send pull requests. Just remember to include tests.

Copyright (c) 2009-2013 Gabriel Cebrian, released under the MIT license