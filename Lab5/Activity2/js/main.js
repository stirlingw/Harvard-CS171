
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var sortOrder = "True";
var data;
var svg = d3.select("#chart-area")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var yScale = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().orient("bottom").scale(xScale);
var yAxis = d3.svg.axis().orient("left").scale(yScale);

svg.append("g").attr("class", "y-axis axis");
svg.append("g")
    .attr({
        "class": "x-axis axis",
        "transform": "translate(0," + height + ")"
    })
    .call(xAxis);

svg.append("text")
    .attr({
        "id": "y-axis-label",
        "class": "axis-label",
        "text-anchor": "middle",
        "x": -margin.left / 2,
        "y": -margin.top / 2
    });

// Select Dropdown On Change Event
d3.select("#ranking-type").on("change", function() { updateVisualization() });

// Sort On Click Event
d3.select("#change-sorting").on("click", function() {
    sortOrder = !sortOrder;
    updateVisualization();
});

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {
		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});
		// Store csv data in global variable
		data = csv;
        // Update Visualization
        updateVisualization();
	});
}

var updateVisualization = function(){
    // Select Dropdown
    var xSelect = d3.select("#ranking-type").property("value");
    // Sorting Data
    var sortedData = data.sort(function(d1, d2) { return (sortOrder ? -1 : 1) * (d2[xSelect] - d1[xSelect]); });

    //Update scale domains
    xScale.domain(sortedData.map(function(d) { return d.company; }));
    yScale.domain([0, d3.max(sortedData, function(d) { return d[xSelect] })]);

    // update axis labels
    svg.select(".axis-label").text(xSelect);
    svg.select("g.x-axis").transition().duration(0.5 * 1000).call(xAxis);
    svg.select("g.y-axis").transition().duration(0.5 * 1000).call(yAxis);

    // Adding sorted list to bar
    var bars = svg.selectAll(".bar").data(sortedData);
    // Bars remove
    bars.exit().remove();
    // Bars append
    bars.enter().append("rect").attr("class", "bar");
    // Bars transition
    bars.transition().duration(1000)
        .attr({
            "x": function(d) { return xScale(d.company); },
            "y": function(d) { return yScale(d[xSelect]); },
            "width": function(d, i) { return xScale.rangeBand(); },
            "height": function(d) { return height - yScale(d[xSelect]); }
        });
}

// Initialize data
loadData();