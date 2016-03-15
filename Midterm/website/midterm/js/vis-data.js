// Use the Queue.js library to read three files
queue()
    .defer(d3.json, "data/africa.json")
    .defer(d3.csv, "data/global-malaria-2015.csv")
    .defer(d3.json, "data/choropleth-legend.json")
    .await(createVisualization);

// Used for circle graph
var bubbleData = {};
    bubbleData["population"] = [];
    bubbleData["at_risk"] = [];
    bubbleData["at_risk_high"] = [];
    bubbleData["malaria_cases"] = [];
    bubbleData["suspected_malaria_cases"] = [];

var rateById = {};
var nameById = {};
var mapTopo = {};

// Updates data for both charts
function createVisualization(error, mapTopJson, malariaDataCsv, choroplethLegendData){
    malariaDataCsv.forEach(function(d) {
        if(d.WHO_region == "African"){
            countryCode = d.Code.toString();
            //rateByID
            rateById[countryCode] = {}
            rateById[countryCode]["region"] = d.WHO_region;
            rateById[countryCode]["country"] = d.Country;
            rateById[countryCode]["code"] = d.Code.toString();
            rateById[countryCode]["population"] = +d.UN_population;
            if(isNaN(d.At_risk)){
                rateById[countryCode]["at_risk"] = 0;
            }else{
                rateById[countryCode]["at_risk"] = +d.At_risk;
            }
            if(isNaN(d.At_high_risk)){
                rateById[countryCode]["at_risk_high"] = 0;
            }else{
                rateById[countryCode]["at_risk_high"] = +d.At_high_risk;
            }
            if(isNaN(d.Suspected_malaria_cases)){
                rateById[countryCode]["suspected_malaria_cases"] = 0;
            }else{
                rateById[countryCode]["suspected_malaria_cases"] = +d.Suspected_malaria_cases;
            }
            if(isNaN(d.Malaria_cases)){
                rateById[countryCode]["malaria_cases"] = 0;
            }else{
                rateById[countryCode]["malaria_cases"] = +d.Malaria_cases;
            }

            bubbleData["population"].push({
                                        "cases": [[2015, rateById[countryCode]["population"], "population"]],
                                        "total": rateById[countryCode]["population"],
                                        "name": rateById[countryCode]["country"],
                                        "code": rateById[countryCode]["code"]
                                        });
            bubbleData["at_risk"].push({
                                        "cases": [[2015, rateById[countryCode]["at_risk"], "at_risk"]],
                                        "total": rateById[countryCode]["at_risk"],
                                        "name": rateById[countryCode]["country"],
                                        "code": rateById[countryCode]["code"]
                                        });
            bubbleData["at_risk_high"].push({
                                        "cases": [[2015, rateById[countryCode]["at_risk_high", "at_risk_high"]]],
                                        "total": rateById[countryCode]["at_risk_high"],
                                        "name": rateById[countryCode]["country"],
                                        "code": rateById[countryCode]["code"]
                                        });
            bubbleData["malaria_cases"].push({
                                        "cases": [[2015, rateById[countryCode]["malaria_cases"], "malaria_cases"]],
                                        "total": rateById[countryCode]["malaria_cases"],
                                        "name": rateById[countryCode]["country"],
                                        "code": rateById[countryCode]["code"]
                                        });
            bubbleData["suspected_malaria_cases"].push({
                                        "cases": [[2015, rateById[countryCode]["suspected_malaria_cases"], "suspected_malaria_cases"]],
                                        "total": rateById[countryCode]["suspected_malaria_cases"],
                                        "name": rateById[countryCode]["country"],
                                        "code": rateById[countryCode]["code"]
                                        });
        }
    });

    // Updates all Charts
    mapTopo = mapTopJson
    choroplethLegend = choroplethLegendData;
    updateSecondVisualization();
    updateChoropleth();
    updatePopulation();
    updateAtRisk();
    updateAtRiskHigh();
    updateMalariaCases();
    updateSuspectedMalariaCases();
}