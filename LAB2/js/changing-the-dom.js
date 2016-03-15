
// Write HTML with JS
document.getElementById("content-1").innerHTML = '<h1>Headline</h1>...and some text'

// Loop through array, build HTML block and finally display it on the page
var fruits = ["Orange", "Banana", "Apple"];
var result = '';
for (var i = 0; i < fruits.length; i++) {
    result += fruits[i] + "<br/>";
}
document.getElementById("content-2").innerHTML = result;


function ridePrices(rides){
    rideInfo = '';
    for(a in rides){
       rideInfo += "Name: " + rides[a].name + ", Price: $" + rides[a].price_in_usd + "<br/>";
    }
    return rideInfo;
}
document.getElementById("unique-tag-1").innerHTML = ridePrices(amusementRides);
