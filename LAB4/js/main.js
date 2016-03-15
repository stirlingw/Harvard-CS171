

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	$.each( data, function( k, v ) {
		  data[k].Income = +data[k].Income;
		  data[k].LifeExpectancy = +data[k].LifeExpectancy;
		  data[k].Population = +data[k].Population;
    });

	// Larger circles overlap or cover smaller circles. Sort the countries by population before drawing them.
	data.sort(function(a, b) {
		return b.Population - a.Population;
	});

	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	var padding = 10;
	// Margin object with properties for the four directions
	var margin = {top: 20, right: 10, bottom: 20, left: 10};
	// Width and height as the inner dimensions of the chart area
	var width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var svg = d3.select("#chart-area")
				.append("svg")
				.attr("class", "axis")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Create scale functions

	var incomeExtent = d3.extent(data, function(d) { return d.Income; });
	var incomeMax = d3.max(data, function(d) { return d.Income; });
	var incomeMin = d3.min(data, function(d) { return d.Income; });
	var lifeExpectancyExtent = d3.extent(data, function(d) { return d.LifeExpectancy; });
	var lifeExpectancyMax = d3.max(data, function(d) { return d.LifeExpectancy; });
	var lifeExpectancyMin = d3.min(data, function(d) { return d.LifeExpectancy; });
	var populationExtent = d3.extent(data, function(d) { return d.Population; });
	var populationMax = d3.max(data, function(d) { return d.Population; });
	var populationMin = d3.min(data, function(d) { return d.Population; });

	// x-axis
	var incomeScale = d3.scale.log()
						 .clamp(true)
						 .domain([incomeMin - 40, incomeMax])
						 .range([padding + 31, width - padding]);
	// y-axis
	var lifeExpectancyScale = d3.scale.linear()
								 .clamp(true)
								 .domain(lifeExpectancyExtent)
								 .range([(height - padding) - 31, padding])
								 .nice();
	// r
	var populationScale = d3.scale.linear()
							.domain([populationMin, populationMax])
							.range([4, 30]);

	// Color palette
	var colorPalette = d3.scale.category20();
	colorPalette.domain(data.map(function(d) {
		return d.Region;
	}));

	// Examples:
	console.log(incomeScale(5000));      // Returns: 23.2763
	console.log(lifeExpectancyScale(68)); // Returns: 224.7191

	svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                return incomeScale(d.Income);
           })
           .attr("cy", function(d) {
                return lifeExpectancyScale(d.LifeExpectancy);
           })
           .attr("r", function(d) {
                return populationScale(d.Population);
           })
           .attr("fill", function(d) {
                return colorPalette(d.Region);
		   });


	// Create group element
	var group = svg.append("g")
					.attr("transform", "translate(70, 50)");

	var xAxis = d3.svg.axis()
						.scale(incomeScale)
						.orient("bottom")
						.tickFormat(function (d) {
							return incomeScale.tickFormat(4, d3.format(",d") )(d)
						});

	var yAxis = d3.svg.axis()
						.scale(lifeExpectancyScale)
						.orient("left")


	// Draw the axis
	svg.append("g")
			.attr("class", "axis x-axis")
			.call(xAxis)
			.attr("transform", "translate(0, " + (height - 40) + ")")
			.append("text")
			.attr("class", "axis-label")
			.attr("dx", 0)
			.attr("dy", 0)
			.attr("transform", "translate(" + (width / 2) + ", 32)")
			.text("Income");

	svg.append("g")
    		.attr("class", "axis y-axis")
			.call(yAxis)
			.attr("transform", "translate(" + 40 + ", 0)")
			.append("text")
			.attr("class", "axis-label")
			.attr("dx", 0)
			.attr("dy", 0)
			.attr("transform", "translate(-28, " + (height / 2) + ") rotate(-90)")
			.text("Avg Life Expectancy");

});
