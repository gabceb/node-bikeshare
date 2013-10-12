## Node-Bikeshare

Node-Bikeshare is an npm package used to interact with the data from the Bay Area Bike Share program

Node-Bikeshare is inspired by the Bikeshare gem by [Zack Shapiro](https://github.com/zackshapiro/bikeshare)

## Usage

```javascript
var client = new Bikeshare();

client.on("fetch", function(){
    console.log("Description: " + client.description());

    console.log("Links: " + client.links().join(","));
});

client.on("error", function(err){
	console.log(error);
});

client.fetch();

```

## Available methods:

- stationInfo
- emptyStations
- empty
- full
- availableBikes
- totalDocks
- percentAvailable
- offlineStations

## ZOMG Fork! Thank you!

You're welcome to fork this project and send pull requests. Just remember to include tests.

Copyright (c) 2009-2012 Gabriel Cebrian, released under the MIT license