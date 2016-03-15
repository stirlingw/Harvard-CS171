
// Global variable with 60 attractions (JSON format)
// console.log(attractionData);

dataFiltering('all');

function dataFiltering(type) {
	var attractions = attractionData;
	attractions.sort(
		function(a, b){
			return b.Visitors - a.Visitors;
		}
	);
	var filteredAttractions = [];
    filteredAttractions = attractions.filter( function(value, index) {
        if(type == "all"){
            return true;
        } else if (value.Category == type){
            return true;
        }else{
            return false;
        }
	});
	filteredAttractions = filteredAttractions.splice(0,5);
	console.log(filteredAttractions);

	renderBarChart(filteredAttractions);

	/* **************************************************
	 *
	 * ADD YOUR CODE HERE (ARRAY/DATA MANIPULATION)
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 * renderBarChart(data)
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/

}

function dataManipulation(){

	var selectBox = document.getElementById("SELECT-ID");
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	dataFiltering(selectedValue)
}