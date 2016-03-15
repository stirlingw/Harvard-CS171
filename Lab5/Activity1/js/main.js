// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

var svg = d3.select("body").append("svg").attr("width", 600).attr("height", 200);
svg.append("g").attr("id", "order-circles");
svg.append("text").attr({ "id": "order-label", "text-anchor": "middle", "y": 45, "x": 40 }).style("font-family", "Helvetica").text("");

function updateVisualization(orders) {
	console.log(orders);
	var circles = svg.select("#order-circles").selectAll("circle").data(orders);
	circles.enter().append("circle").attr({ "class": "circle", "fill": function(d) { return d.product == "coffee" ? "#3C948B" : "#327972"; } });
	circles.attr({"r": function(d) { return 20; }, "cx": function(d, index) { return (index * 40 + 120); }, "cy": 40});
	circles.exit().remove();
	svg.select("#order-label").text("Orders: " + orders.length);
}