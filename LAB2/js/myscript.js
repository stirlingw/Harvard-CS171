
var amusementRides = [
    {
        "id": 0,
        "name": "Mr. Freeze",
        "price_in_usd": 3.00,
        "opening_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "limited_children_access": "yes"
    },{
        "id": 1,
        "name": "Superman",
        "price_in_usd": 1.00,
        "opening_days": ["Saturday", "Sunday"],
        "limited_children_access": "no"
    },{
        "id": 2,
        "name": "Space Mountain",
        "price_in_usd": 4.00,
        "opening_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "limited_children_access": "yes"
    }
]

console.log("My debug message");
var debugId = 12; console.log("Another debug message with id: " + debugId);

console.log("Name of the ﬁrst amusement ride: " + amusementRides[0].name);
console.log("All days when the second attraction is open: " + amusementRides[1].opening_days);
console.log("First item of the list of opening days from the second amusement ride: " + amusementRides[1].opening_days[1]);
console.log("There is a 50% discount for your third attraction: "+amusementRides[2].price_in_usd * 0.50);


// Calling the function
var amusementRidesDouble = doublePrices(amusementRides);
// Implementation of the function
function doublePrices(amusementRides) {
    for(a in amusementRides){
        if(a != 1){
            amusementRides[a].price_in_usd = amusementRides[a].price_in_usd * 2
        }
    }
    return amusementRides
}

console.log(amusementRidesDouble);

function debugAmusementRides(){
    for(a in amusementRides){
        console.log("Name: " + amusementRides[a].name + ", Price: $" + amusementRides[a].price_in_usd );
    }
}

debugAmusementRides();

