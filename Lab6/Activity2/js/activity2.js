
var width = 1000,height = 600;
var svgMap = d3.select("#map-area").append("svg").attr("width", width).attr("height",height);
// Initialize map projection
var projection = d3.geo.mercator().center([15,10]).translate([width / 2, height / 2]);
var path = d3.geo.path().projection(projection);
var padding = 30;

// Load data parallel
queue().defer(d3.json, "data/world-110m.json")
       .defer(d3.json, "data/airports.json")
       .await(createVisualization);

// Visualize data1 and data2
function createVisualization(error, data1, data2) {
    // Convert TopoJSON to GeoJSON (target object = 'countries')
    var world = topojson.feature(data1, data1.objects.countries).features;

    // Render map by using the path generator
    svgMap.selectAll("path")
            .data(world)
            .enter()
            .append("path")
            .attr("class", "feature")
            .style("fill", "#bba3d0")
            .attr("d", path);

    // put boarder around states
    svgMap.append("path")
          .datum(topojson.mesh(data1, data1.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "mesh")
          .attr("d", path);

    // add circles to svg
    var circles = svgMap.selectAll("circle")
                        .data(data2.nodes)
                        .enter()
                        .append("circle")
                        .attr("class", "circle")
                        .attr("r", "8px")
                        .attr("fill", "yellow")
                        .attr("transform", function(d) {
                            return "translate(" + projection([d.longitude, d.latitude]) + ")";
                        });


    // ToDo
    // Add lines to connect flights
    // Add labels for each dot
    // https://bost.ocks.org/mike/map/
}
