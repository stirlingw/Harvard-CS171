

// DATASETS

// Global variable with 1198 pizza deliveries
//console.log(deliveryData);

// Global variable with 200 customer feedbacks
//console.log(feedbackData);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {

	var num_pizza_deliveries = deliveryData.length;
	var num_pizzas_delivered_sum = 0;
	var delivery_time_sum = 0;
	var total_sales_usd = 0;
	deliveryData.filter(  function(value, index) {
        num_pizzas_delivered_sum += value.count;
        delivery_time_sum += value.delivery_time;
        total_sales_usd += value.price;
	});
	var delivery_time_avg = delivery_time_sum / num_pizza_deliveries
	var feedback_entries_sum = feedbackData.length
    var feedbackLowCount = 0;
    var feedbackMediumCount = 0;
    var feedbackHighCount = 0;
	feedbackData.filter(function (val) {
        if(val.quality === "low")
            feedbackLowCount = feedbackLowCount + 1;
        if(val.quality === "medium")
            feedbackMediumCount = feedbackMediumCount + 1;
        if(val.quality === "high")
            feedbackHighCount = feedbackHighCount + 1;
    });

    renderBarChart(deliveryData);
}

function updateVisualization() {
    var areaSelectBox = document.getElementById("area-select-id");
    var areaSelectedValue = areaSelectBox.options[areaSelectBox.selectedIndex].value;

    var typeSelectBox = document.getElementById("order-type-id");
    var typeSelectedValue = typeSelectBox.options[typeSelectBox.selectedIndex].value;

    var filter = {};
    if(areaSelectedValue !== "all")
        filter["area"] = areaSelectedValue
    if(typeSelectedValue !== "all")
        filter["order_type"] = typeSelectedValue

    /*
        Following function taken from:
        http://stackoverflow.com/a/31831801/5385726
    */
    newDeliveryData = deliveryData.filter(function(item) {
        for(var key in filter) {
            if(item[key] === undefined || item[key] != filter[key])
                return false;
        }
        return true;
    });

    renderBarChart(newDeliveryData);
}

