
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.mapPosition = _mapPosition;

	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;
	L.Icon.Default.imagePath = 'img';

	vis.map = L.map(vis.parentElement).setView(this.mapPosition, 13);

	L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(vis.map);

	var MBTA_path = 'data/MBTA-Lines.json';

	$.getJSON(MBTA_path, function(data) {
		data.features.forEach(function(line) {
			L.geoJson(line, { weight: line.properties.GRADE + 3, color: line.properties.LINE }).addTo(vis.map);
		});
	});


	vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;
	vis.displayData = vis.data;
	vis.updateVis();
}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
	var vis = this;

	vis.stationMarkers = L.layerGroup().addTo(vis.map);
	vis.displayData.forEach(function(station) {
		vis.stationMarkers.addLayer(
			L.marker([station.lat, station.long])
				.bindPopup("<div>" + station.name + "</div><div>Available bikes: " + station.nbBikes.toString() + "</div><div>Available docks: " + station.nbEmptyDocks.toString() + "</div>")
				.addTo(vis.map)
		);
	});

}
