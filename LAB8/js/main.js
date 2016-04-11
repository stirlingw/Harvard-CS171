
var allData = {};

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {
    // Hubway XML station feed
    var url = 'https://www.thehubway.com/data/stations/bikeStations.xml';

    // TO-DO: LOAD DATA
    // XML to JSON
    var yql = 'http://query.yahooapis.com/v1/public/yql?q='
                + encodeURIComponent('SELECT * FROM xml WHERE url="' + url + '"')
                + '&format=json&callback=?';

    // Send an asynchronous HTTP request with jQuery
    $.getJSON(yql, function(jsonData){

        allData.stations = jsonData.query.results.stations.station;

        allData.stations.forEach(function(d){
            d.id = parseInt(d.id);
            d.installDate = parseInt(d.installDate);
            d.lastCommWithServer = parseInt(d.lastCommWithServer);
            d.lat = parseFloat(d.lat);
            d.latestUpdateTime = parseInt(d.latestUpdateTime);
            d.long = parseFloat(d.long);
            d.nbBikes = parseInt(d.nbBikes)
            d.nbEmptyDocks = parseInt(d.nbEmptyDocks)
        });

        $("#station-count").html(allData.stations.length);

        createVis();
    });


}


function createVis() {
    // TO-DO: INSTANTIATE VISUALIZATION
    stationMap = new StationMap("station-map", allData.stations, [42.3601, -71.0589])

}