
/* ### Activity 1 ### */
var w = 500;
var h = 500;

var svg = d3.select("body")
            .append("svg")
            .attr({
                "width": w,
                "height": h
            });

svg.append("rect")
    .attr({
        x: 0,
        y: 0,
        width: 400 + "px",
        height: 200 + "px",
        fill: "green"
    });

d3.select("body").append("div").text("Dynamic Content");

var states = ["Connecticut", "Main", "Massachusetts", "New Hampshire", "Rhode Island"];

d3.select("body").style("background-color", "#EEE");

var p = d3.select("body")
            .selectAll("p")
            .data(states)
            .enter()
            .append("p")
            .text( function (d) { return d; } )
            .attr("class", "custom-paragraph")
            .style("color", "blue")
            .style("font-weight", function(d) {
                if(d == "Massachusetts")
                    return "bold";
                else
                    return "normal";
            });



var numericData = [1, 2, 4, 8, 16];
// Add svg element (drawing space)
var svg = d3.select("body").append("svg")
            .attr("width", 300)
            .attr("height", 50);
// Add rectangle
svg.selectAll("rect")
    .data(numericData)
    .enter()
    .append("rect")
    .attr("fill", "red")
    .attr("width", 50)
    .attr("height", 50)
    .attr("y", 0)
    .attr("x", function(d, index) { return (index * 60); });


/* ### Activity 2 ### */

var w2 = 500;
var h2 = 500;

var sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
];

var svg2 = d3.select("body")
            .append("svg")
            .attr({
                "width": w2,
                "height": h2
            });

svg2.selectAll("circle").data(sandwiches)
    .enter()
    .append("circle")
    .attr("r", function(d, index) {
        var size = 15;
        if(d.size == "small"){
            return size;
        }else{
            return size * 2;
        }
    })
    .attr("cx", function(d, index) {
        return 70 * index + 40;
    })
    .attr("cy", 40)
    .attr("stroke", "black")
    .attr("stroke-width", function(d){
        return d/2;
    })
    .attr("fill", function(d, index) {
        if(d.price < 7.00){
            return "blue"
        }else{
            return "purple"
        }
    });

d3.csv("./data/sandwiches.csv", function(data) {
    console.log("Data loading complete. Work with dataset.");
    console.log(data);
});
console.log("Do something else, without the data");



/* ### Activity 3 ### */


d3.csv("./data/cities.csv", function(data) {

    console.log("Data is stored in JSON format");
    console.log(data);

    data = data.filter(function(el, index) {
        return el.eu === "true";
    });

    data.map(function(el, index) {
        el.population = parseFloat(el.population);
        el.x = parseFloat(el.x);
        el.y = parseFloat(+el.y);
    });

    d3.select("body").append("p").text("The number of EU countries: " + data.length);

    var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 550);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("circle")
        .text(function(d) {
            return d.city;
        })
        .attr("fill", "#aa7243")
        .attr("r", function(d, index) {
            return d.population < 1000000 ? 4 : 8;
        })
        .attr("cx", function(d, index) {
            return d.x;
        })
        .attr("cy", function(d, index) {
            return d.y;
        });

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.city;
        })
        .attr("opacity", function(d, index) {
            return d.population < 1000000 ? 0.0 : 1.0;
        })
        .attr("dx", function(d, index) {
            return d.x;
        })
        .attr("dy", function(d, index) {
            return d.y - 15;
        })
        .attr("class", "city-label");

        var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function(d) { return d.toFixed(2) })
              .direction('nw')
              .offset([0, 3]);
});

