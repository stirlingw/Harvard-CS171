

d3.csv("../HW3/data/buildings.csv", function(data) {
    // Sorts data
    data.sort(function(d1, d2) {
        return d2.height_m - d1.height_m;
    });

    var w = 500;
    var h = 500;
    var barPadding = 1;

    // Adds chart to div
    var svg = d3.select("#bar-chart").append("svg").attr("width", w).attr("height", h);

    // Creates Building Labels
    svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function(d) {
                return d.building;
            })
            .attr("x", function(d) {
                return 0;
            })
            .attr("y", function(d, i) {
                return i * (w / data.length) + 30;

            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black");

    // Creates the bars for the chart
    var rectangle = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr({
            x: function(d,i){
                return w / d.height_px + 175;
            },
            y: function(d, i){
                //return i * (w / data.length);
                return i * (w / data.length);
            },
            width: function(d){
                return d.height_px
            },
            height: w / data.length - barPadding,
            fill: "#FF9900"
        })
        .on("click", function(d) {
            showCity(d);
        })
        .on('mouseover', function(d){
            d3.select(this).style({opacity:'0.8'})
            d3.select("text").style({opacity:'0.8'});
        })
        .on('mouseout', function(d){
            d3.select(this).style({opacity:'1.0',})
            d3.select("text").style({opacity:'1.0'});
        });

    // Adds building height label to bar chart
    rectangle.select("rect")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.height_m;
        })
        .attr("x", function(d, i) {
            // I tried a bunch of different math but ran out of time
            // I made this look good for the chart
            // but this will not work if the data changes
            if(i == 0){
                return d.height_px * 1.8 - 60;
            }else if(i == 1){
                return d.height_px * 1.8;
            }else if(i == 2){
                return d.height_px * 1.8 + 20;
            }else{
                return ((h - (h - d.height_px)) * 2) - 2 ;
            }

        })
        .attr("y", function(d, i) {
            return i * (w / data.length) + 30;

        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .style("text-anchor", "middle");

    // Shows initial building & city information
    showCity(data[0])
});

// Changes city when bar is clicked
function showCity(d){
    var html = "";
    html += "<h1>" + d.building + "</h1>";
    html += "<table>"
    html += "<tr><td>Height: "+ d.height_m + " meters</td></tr>"
    html += "<tr><td>City: "+ d.city + "</td></tr>"
    html += "<tr><td>Country: "+ d.country + "</td></tr>"
    html += "<tr><td>Floors: "+ d.floors + "</td></tr>"
    html += "<tr><td>Completed: "+ d.completed + "</td></tr>"
    html += "</table>"
    document.getElementById("chart-img").innerHTML = "<img src=../HW3/data/img/" + d.image + "></img>";
    document.getElementById("chart-data").innerHTML = html;
}