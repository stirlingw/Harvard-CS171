// Margin object with properties for the four directions
var areaMargin = {top: 40, right: 60, bottom: 60, left: 80};
// Width and height as the inner dimensions of the chart area
var areaWidth = 600 - areaMargin.left - areaMargin.right;
var areaHeight = 500 - areaMargin.top - areaMargin.bottom;

// x-axis Scale
var scaleDate = d3.time.scale();
// y-axis
var scalePopulation = d3.scale.linear();

// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", function(data){

	$.each( data, function( k, v ) {
		  var format = d3.time.format("%Y-%m-%d");
		  data[k].date = format.parse(data[k].date);
		  data[k].population = +data[k].population;
    });

	var svg = d3.select("#chart-area")
    				.append("svg")
    				.attr("width", areaWidth + areaMargin.left + areaMargin.right)
    				.attr("height", areaHeight + areaMargin.top + areaMargin.bottom)
    				.append("g")
    				.attr("transform", "translate(" + areaMargin.left + "," + areaMargin.top + ")");

	var dateMax = d3.max(data, function(d) { return d.date; });
	var dateMin = d3.min(data, function(d) { return d.date; });
	var populationMax = d3.max(data, function(d) { return d.population; });
	var populationMin = d3.min(data, function(d) { return d.population; });

	// x-axis Scale
    scaleDate.domain([dateMin, dateMax]).range([0, areaWidth]);
	// y-axis
	scalePopulation.domain([0, populationMax]).range([areaHeight, 0]);

	addPath(data, svg);
	addAxis(svg);
	addTip(svg, areaHeight, areaWidth, scaleDate, scalePopulation, data);

});


function addPath(data, svg) {
  var area = d3.svg.area()
				.x(function(d) { return scaleDate(d.date); })
				.y0(areaHeight)
				.y1(function(d) { return scalePopulation(d.population); });

  svg.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area)
		.attr("fill", "#bba3d0");
}

function addAxis(svg) {

	// Months
  	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  	// Add Scales
  	var xAxis = d3.svg.axis().scale(scaleDate).orient("bottom").tickFormat(function(d) { return (1900 + d.getYear())  + " " + months[d.getMonth()]; });
  	var yAxis = d3.svg.axis().scale(scalePopulation).orient("left");

	// Axis
	svg.append("g").attr({"class": "x-axis", "transform": "translate(0," + areaHeight + ")"}).call(xAxis);
	svg.append("g").attr("class", "y-axis").call(yAxis);
	svg.append("text").attr({ "class": "axis-label", "text-anchor": "middle", "x": areaWidth / 2, "y": areaHeight + 50}).text("Dates");
	svg.append("text").attr({ "class": "axis-label", "text-anchor": "middle", "transform": "rotate(-90)", "x": -areaHeight / 2, "y": -65,"dy": ".75em"}).text("Zaatari Refugee Camp Population");

	// Labels
	svg.selectAll(".x-axis text")  // select all the text elements for the xaxis
		.attr("transform", function(d) {
			return "translate(" + this.getBBox().height * -2 + "," + (this.getBBox().height) + ")rotate(-25)";
		});
}


function addTip(svg, areaHeight, areaWidth, scaleDate, scalePopulation, data) {
	// Define the line
	var lineValue = d3.svg.line().x(function(d) { return scaleDate(d.date); }).y(function(d) { return 0; });
	var lineSVG = svg.append("g").append("path").attr({"class": "line", "d": lineValue(data)});
	var focusOnThis = svg.append("g").style("display", "none");
	var dateBisect = d3.bisector(function(d) { return d.date; }).left;
	var dateFormat = d3.time.format("%b-%d");

	// append the rectangle to capture mouse
	svg.append("rect")
			.attr({ "width": areaWidth, "height": areaHeight })
			.style({ "fill": "none", "pointer-events": "all" })
			.on({
				"mouseover": function() { focusOnThis.style("display", null); },
				"mouseout": function() { focusOnThis.style("display", "none"); },
				"mousemove": mousemove
			});

	function mousemove() {
		var x0 = scaleDate.invert(d3.mouse(this)[0]),
			i = dateBisect(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;

		// Focus Select
		focusOnThis.select("text.y1").attr("transform", "translate(" + scaleDate(d.date) + "," + scalePopulation(d.population) + ")").text(d.population);
		focusOnThis.select("text.y2").attr("transform", "translate(" + scaleDate(d.date) + "," + scalePopulation(d.population) + ")").text(d.population);
		focusOnThis.select("text.y3").attr("transform", "translate(" + scaleDate(d.date) + "," + scalePopulation(d.population) + ")").text(dateFormat(d.date));
		focusOnThis.select("text.y4").attr("transform", "translate(" + scaleDate(d.date) + "," + scalePopulation(d.population) + ")").text(dateFormat(d.date));
		focusOnThis.select(".x").attr("transform", "translate(" +scaleDate(d.date) + "," + scalePopulation(d.population) + ")").attr("y2", areaHeight - scalePopulation(d.population));
		focusOnThis.select(".y").attr("transform", "translate(" + areaWidth * -1 + "," + scalePopulation(d.population) + ")").attr("x2", areaWidth + areaWidth);
	}

	// Focus Append
	focusOnThis.append("line").attr({ "class": "x", "y1": 0, "y2": areaHeight }).style({ "stroke": "#508b1a", "stroke-dasharray": "3,3", "opacity": 0.5 });
	focusOnThis.append("line").attr({ "x1": areaWidth, "x2": areaWidth, "class": "y" }).style({ "stroke": "#508b1a", "stroke-dasharray": "3,3", "opacity": 0.5 });
	focusOnThis.append("text").attr({ "class": "y1", "dx": 8, "dy": "-.3em" }).style({ "stroke": "#eee8f3", "stroke-width": "3.5px", "opacity": 0.8 });
	focusOnThis.append("text").attr({ "dx": 8, "dy": "-.3em", "class": "y2"});
	focusOnThis.append("text").attr({ "class": "y3", "dx": 8, "dy": "1em" }).style({ "stroke": "#eee8f3", "stroke-width": "3.5px", "opacity": 0.8 });
	focusOnThis.append("text").attr({ "class": "y4", "dx": 8, "dy": "1em" });
}