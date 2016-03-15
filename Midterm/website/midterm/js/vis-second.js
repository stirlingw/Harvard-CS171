
// Borrowed parts of this chart from this source: http://neuralengr.com/asifr/journals/
// Data from this graph comes from data/vis-data;

var margin = {top: 15, right: 300, bottom: 0, left: 20},
	width = 40,
	height = 1000,
    start_year = 2015,
    end_year = 2015;

// color scale
var c = d3.scale.category20c();
// x scale
var x = d3.scale.linear().range([0, width]);
var formatYears = d3.format("0000");
// x axis
var xAxis = d3.svg.axis().scale(x).orient("top");
xAxis.tickFormat(formatYears);

// Updates Chart and sections of the page
function updateSecondVisualization(){
    var selectBox = document.getElementById("type-id");
    var type = selectBox.options[selectBox.selectedIndex].value;
    type = type.replace("_", " ");
    $("#sec-chart-header")[0].innerHTML = "<h3>"+type.replace("_", " ").toUpperCase()+"</h3>";

    var newType = type.replace(" ", "-");
    newType = newType.replace(" ", "-");
    newType = newType.replace("_", "-");
    $(".sec-graph").hide(1000);
    $("#sec-chart-" + newType).show(1000);
}

// Updates population graph
function updatePopulation(){
	var svgPopulation = d3.select("#vis-sec-population")
							.append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.style("margin-left", margin.left + "px")
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var data = bubbleData["population"];
	addChartInfo(data, svgPopulation);
}

// Updates at risk graph
function updateAtRisk(){
	var svgAtRisk = d3.select("#vis-sec-at-risk")
						.append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.style("margin-left", margin.left + "px")
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var data = bubbleData["at_risk"];
	addChartInfo(data, svgAtRisk);
}

// Updates high at risk graph
function updateAtRiskHigh(){
	var svgAtRiskHigh = d3.select("#vis-sec-at-risk-high")
							.append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.style("margin-left", margin.left + "px")
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var data = bubbleData["at_risk_high"];
	addChartInfo(data, svgAtRiskHigh);
}

// Updates malaria cases graph
function updateMalariaCases(){
	var svgMalariaCases = d3.select("#vis-sec-malaria-cases")
							.append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.style("margin-left", margin.left + "px")
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var data = bubbleData["malaria_cases"];
	addChartInfo(data, svgMalariaCases);
}

// Updates suspected malaria cases graph
function updateSuspectedMalariaCases(){
	var svgSuspectedMalariaCases = d3.select("#vis-sec-suspected-malaria-cases")
                                        .append("svg")
                                        .attr("width", width + margin.left + margin.right)
                                        .attr("height", height + margin.top + margin.bottom)
                                        .style("margin-left", margin.left + "px")
                                        .append("g")
                                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var data = bubbleData["suspected_malaria_cases"];
	addChartInfo(data, svgSuspectedMalariaCases);
}

// Adds chart data and circles for each graph
// *re-useable

function addChartInfo(data, svgChartInfo){
    var selectBox = document.getElementById("type-id");
    var type = selectBox.options[selectBox.selectedIndex].value;

	x.domain([start_year, end_year]);
	var xScale = d3.scale.linear().domain([start_year, end_year]).range([0, width]);
	svgChartInfo.append("g").attr("class", "x axis").attr("transform", "translate(0," + 0 + ")").call(xAxis);

	for (var j = 0; j < data.length; j++) {
		var g = svgChartInfo.append("g").attr("class","journal");
		var circles = g.selectAll("circle")
		                .data(data[j]['cases'])
		                .enter()
		                .append("circle");
		var text = g.selectAll("text")
		                .data(data[j]['cases'])
		                .enter()
		                .append("text");

//        var rScale = d3.scale.linear()
//                        .domain([0, d3.max(data[j]['articles'], function(d) { return d[1]; })])
//                        .range([2, 9]);


		circles.attr("cx", function(d, i) { return xScale(d[0]); })
		        .attr("cy", j*20+20)
		        .attr("r", function(d) {
		            // Custom scaling because the math in rScale wasn't working correctly
		            // to convert to the scale needed
                    var scaled = 0
                    if(d[2] == "population"){
                        scaled = Math.sqrt(d[1]) * 0.001;
                    }else if(d[2] == "malaria_cases" || d[2] == "suspected_malaria_cases"){
                        scaled = Math.sqrt(d[1]) * 0.0019;
                    }else{
                        scaled = d[1] * 0.10
                    }
		            return scaled;
                })
		        .style("fill", function(d) { return c(j); });

		text.attr("y", j*20+25)
		    .attr("x",function(d, i) { return xScale(d[0])-5; })
		    .attr("class","value").text(function(d){ return d[1]; })
		    .style("fill", function(d) { return c(j); })
		    .style("display","none");

		g.append("text")
		    .attr("y", j*20+25)
		    .attr("x",width+20)
		    .attr("class","label")
		    .text(truncate(data[j]['name'],30,"..."))
		    .style("fill", function(d) { return c(j); })
		    .on("mouseover", mouseover)
		    .on("mouseout", mouseout);
	};
}

function mouseover(p) {
	var g = d3.select(this).node().parentNode;
	d3.select(g).selectAll("circle").style("display","none");
	d3.select(g).selectAll("text.value").style("display","block");
}

function mouseout(p) {
	var g = d3.select(this).node().parentNode;
	d3.select(g).selectAll("circle").style("display","block");
	d3.select(g).selectAll("text.value").style("display","none");
}

function truncate(str, maxLength, suffix) {
	if(str.length > maxLength) {
		str = str.substring(0, maxLength + 1);
		str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
		str = str + suffix;
	}
	return str;
}

