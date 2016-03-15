
// Margin object with properties for the four directions
var barMargin = {top: 40, right: 60, bottom: 60, left: 80};

// Width and height as the inner dimensions of the chart area
var barWidth = 600 - barMargin.left - barMargin.right;
var barHeight = 500 - barMargin.bottom - barMargin.top;

// x - Axis
var shelterTypes = ["Caravans", "Both", "Tents"];
// y - Axis
var shelterPercentages = [79.68, 10.81, 9.51];

// Scales
var shelterTypesScale = d3.scale.linear().domain(shelterTypes).range([0, barWidth]);
var shelterPercentageScale = d3.scale.linear().domain([0, 100]).range([barHeight, 0]);

// create a svg
var barSVG = d3.select("#chart-bar")
                .append("svg")
                .attr({
                    "width": barWidth + barMargin.left + barMargin.right,
                    "height": barHeight + barMargin.bottom + barMargin.top
                })
                .append("g")
                .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

addAnAxis();
addRectangles();

function addRectangles() {
    for (var i = 0; i < shelterTypes.length; i++) {
        var g = barSVG.append("g");
        g.append("text")
            .attr({
                "class": "shelter-label",
                "dx": function(d) { return (i + 1) * barWidth / 4; },
                "dy": function(d) { return barHeight + 20; },
                "text-anchor": "middle"
            })
            .text(function(d) { return shelterTypes[i]; });

        g.append("text")
            .attr({
                "class": "shelter-label",
                "dx": function(d) { return (i + 1) * barWidth / 4; },
                "dy": function(d) { return shelterPercentageScale(shelterPercentages[i]) - 10; },
                "text-anchor": "middle"
            })
            .text(function(d) { return shelterPercentages[i];   });

        g.append("rect")
            .attr({
                "class": "bar",
                "fill": "#bba3d0",
                "width": function(d, i) { return barWidth / 6; },
                "height": function(d) { return barHeight - shelterPercentageScale(shelterPercentages[i]); },
                "x": function(d) { return (i + 1 - 1/3) * barWidth / 4; },
                "y": function(d) { return shelterPercentageScale(shelterPercentages[i]); }
            });
    }
}

function addAnAxis() {
    var xAxis = d3.svg.axis().scale(shelterTypesScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(shelterPercentageScale).orient("left");

    barSVG.append("g")
        .attr({
            "class": "x-axis",
            "transform": "translate(0," + barHeight + ")"
        })
        .call(xAxis);

    barSVG.append("g").attr("class", "y-axis").call(yAxis);

    barSVG.append("text")
        .attr({
            "class": "axis-label",
            "text-anchor": "middle",
            "x": barWidth / 2,
            "y": barHeight + 40
        })
        .text("Shelter Types");

    barSVG.append("text")
        .attr({
            "class":"axis-label",
            "text-anchor": "middle",
            "transform": "rotate(-90)",
            "y": -45,
            "dy": ".75em",
            "x": -barHeight / 2
        })
        .text("Percentage (%)");

    barSVG.selectAll(".x-axis text").attr("transform", function(d) { return "translate(" + this.getBBox().height * -2 + "," + ( this.getBBox().height ) + ")rotate(-25)"; });
}