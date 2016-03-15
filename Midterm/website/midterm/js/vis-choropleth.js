

// Data from this graph comes from data/vis-data
// Parts of this graph have been borrowed from http://bl.ocks.org/mbostock/3306362
// and
// http://bl.ocks.org/KoGor/5685876

var width = 500,
    height = 450;
var legendHeight = 400;

// Create Tool Tip
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-20, -330])
            .html(function(d) {
                var content;
                if(d.properties.adm0_a3_is in rateById){
                    if(rateById[d.properties.adm0_a3_is].hasOwnProperty("code")){
                        content = rateById[d.properties.adm0_a3_is].code + " : " + rateById[d.properties.adm0_a3_is].country;
                    }
                }else{
                    content = d.properties.adm0_a3_is + " : " + d.properties.name_long
                }
                return content;
            });

// Create Map SVG
var svgMap = d3.select("#map-area").append("svg").attr("width", width).attr("height", height).style("margin", "10px auto");

// Add Tooltip To SVG
svgMap.call(tip);

// Initialize map projection
var projection = d3.geo.mercator().scale(300).translate([200, 210]);
var path = d3.geo.path().projection(projection);

// Legend Colors
var color_domain = [];
var color_range = [];
var ext_color_domain = [];
var legend_labels = [];
var choroplethLegend = {};

// Initial Dropdown Type
var type = "population";

// Update the chart
function updateChoropleth() {
    // Dropdown select box updates
    var selectBox = document.getElementById("type-id");
    type = selectBox.options[selectBox.selectedIndex].value;

    // Gets JSON data from data/choropleth-legend.json
    var color_types = choroplethLegend;
    var color = d3.scale.threshold().domain(color_types[type].color_domain).range(color_types[type].color_range);

    //Updates choropleth chart
    svgMap.append("g")
            .attr("class", "region")
            .selectAll("path")
            .data(mapTopo.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
                if(d.properties.adm0_a3_is in rateById){
                    return color(rateById[d.properties.adm0_a3_is][type]);
                }else{
                    return "#FFF"
                }
            })
            .style("opacity", 0.8)
            .on("mouseover", function(d){
                d3.select(this).transition().duration(300).style("opacity", 1);
                tip.show(d)
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(300).style("opacity", 0.8);
                tip.hide()
            });

    //Exit legend text and rect
    svgMap.selectAll("g.legend").remove();
    // Update Legend
    var legend =  svgMap.selectAll("g.legend").data(color_types[type].ext_color_domain).enter().append("g").attr("class", "legend");
    // Height and widths for legend
    var ls_w = 20, ls_h = 20;

    // Adds/Updates Rectangles for legend
    legend.append("rect")
        .attr("x", 10)
        .attr("y", function(d, i){ return legendHeight - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return color(d); })
        .style("opacity", 0.8);

    // Adds/Updates Text for legend
    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return legendHeight - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return color_types[type].legend_labels[i]; });
}
