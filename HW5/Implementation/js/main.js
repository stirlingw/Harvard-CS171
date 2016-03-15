
// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
var sortOrder = "True";
var tooltip;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var valueLine = d3.svg.line()
        		.x(function(d) { return x(d.YEAR); })
        		.y(function(d) { return y(d.GOALS); })
        		.interpolate("linear");
// append line to svg graph
svg.append("svg:path").attr("class", "line");

// Add the X Axis
svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis).append("text")

svg.append("g").attr("class", "y axis-label")
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("GOALS");

// add circles
var nodes = svg.selectAll("circles");



// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Select Dropdown On Change Event
d3.select("#data-type").on("change", function() { updateVisualization() });
d3.select("#btn-update").on("click", function() { updateVisualization() });

// Initialize data
loadData();

// FIFA world cup
var data;


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			var newDate = formatDate.parse(d.YEAR);
			d.YEAR = formatDate.parse(d.YEAR);
			//formatDate(newDate);

			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		// Adds initial display data for well
		showEdition(data[0]);

		// Adds Initial Domains
		x.domain(d3.extent(data, function(d) { return d.YEAR; }));
        y.domain([0, d3.max(data, function(d) { return d.GOALS; } )]);

		// Adds ToolTips
		tooltip = d3.tip().html(function(d) { return d.EDITION + ", " + d.GOALS; }).attr("class", "d3-tip");
		svg.call(tooltip);

		// Draw the visualization for the first time
		updateVisualization();
	});
}

// Render visualization
function updateVisualization() {
	// Select and Inputs
	var xSelect = d3.select("#data-type").property("value");
	var yInputMin = formatDate.parse(d3.select("#input-date-min").property("value"));
	var yInputMax = formatDate.parse(d3.select("#input-date-max").property("value"));

	// Gets Data For Min/Max Y Domain
	// This is somewhat for user validation
	if(hasValue("#input-date-min") == false && hasValue("#input-date-max") == false) {
		yInputMin = d3.min(data, function(d) { return d.YEAR; })
		yInputMax =  d3.max(data, function(d) { return d.YEAR; });
	} else if(hasValue("#input-date-min") && hasValue("#input-date-max") == false){
		yInputMax =  d3.max(data, function(d) { return d.YEAR; });
	} else if(hasValue("#input-date-min") == false && hasValue("#input-date-max")){
		yInputMin = d3.min(data, function(d) { return d.YEAR; })
	}

	//Filters Data
	var filteredData = data;
	filteredData = filteredData.filter(function(d) { return d.YEAR >= yInputMin && d.YEAR <= yInputMax; });

	// Domains
	x.domain([yInputMin, yInputMax]);
	y.domain([0, d3.max(filteredData, function(d) { return d[xSelect]; })]);

	// scale axes
	xAxis.scale(x);
	yAxis.scale(y);

	valueLine.y(function(d) { return y(d[xSelect]); });
	svg.select("path.line").transition().duration(800).attr("d", valueLine(filteredData))

	// change the axes
	svg.select(".x.axis").transition().duration(800).call(xAxis);
	svg.select(".y.axis").transition().duration(800).call(yAxis);

	// add circles to line
	//https://github.com/ngzhian/d3-line-chart/blob/master/d3-line-chart.js
	nodes = nodes.data(filteredData, function(d) { return d.YEAR; });
	nodes.enter()
		.append("circle")
		.attr("class", "tooltip-circle")
		.on("click", function(d) { showEdition(d); })
		.on('mouseover', tooltip.show)
		.on('mouseout', tooltip.hide);
	nodes.exit().remove();
	nodes.transition().duration(800)
		.attr("cx", function(d) { return x(d.YEAR); })
		.attr("cy", function(d) { return y(d[xSelect]); })
		.attr("r", 10);

	// add tooltip to circles
	tooltip = d3.tip().html(function(d) { return d.EDITION + ", " + d[xSelect]; }).attr("class", "d3-tip");
	svg.call(tooltip);
}


// Show details for a specific FIFA World Cup
function showEdition(d){
	$("#chart-info-header").text(d.EDITION)
	$("#chart-info-avg-attendance").text(d.AVERAGE_ATTENDANCE)
	$("#chart-info-avg-goals").text(d.AVERAGE_GOALS)
	$("#chart-info-goals").text(d.GOALS)
	$("#chart-info-location").text(d.LOCATION)
	$("#chart-info-matches").text(d.MATCHES)
	$("#chart-info-teams").text(d.TEAMS)
	$("#chart-info-winner").text(d.WINNER)
}

// http://stackoverflow.com/questions/22294112/jquery-check-if-any-text-input-has-value
function hasValue(elem) {
    return $(elem).filter(function() { return $(this).val(); }).length > 0;
}