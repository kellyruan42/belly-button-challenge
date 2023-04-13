// put url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// fetch the json data 
d3.json(url).then(function(data) {
    console.log(data);
  });

// create function for the dashboard
function init() {

    // call the data
    d3.json(url).then(function(data) {

        // store variable for the dropdown list
        var selection = d3.select("#selDataset");

        // each selection for the dropdrown list
        Object.entries(data.names).forEach(([k,v])=>{
            selection.append("option").attr("value", v).text(v);
        });
        
        // set default data 
        let default_data = (data.names[0]);

        // call all the functions
        build_bar(default_data);
        build_bubble(default_data);
        display_metadata(default_data);
    });

}

//create function to log the selection on dropdrown list and call other functions
function optionChanged(x) { 

    // console log the selection
    console.log(x); 

    // call all the functions 
    build_bar(x);
    build_bubble(x);
    display_metadata(x);
}

// create function to build bar chart to display the top 10 OTUs
function build_bar(x){

    // call data
    d3.json(url).then(function(data) {

        // filter sample results
        let sample_data = data.samples.filter(y => y.id == x);

        // store results for first id
        let result = sample_data[0];

        // get the sample value, otu_ids and otu_labels
        let sample_values = result.sample_values.slice(0, 10).reverse();
        let otu_ids = result.otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();
        let otu_labels = result.otu_labels.slice(0,10).reverse();

        // set the trace for bar chart
        let trace = {
            x: sample_values, y: otu_ids, text: otu_labels, type: "bar", orientation: "h"
        };
        
        // set the layout
        let layout = {
            title: `Top 10 OTUs in ${x}`,
        };
        
        // plot
        Plotly.newPlot("bar", [trace], layout);
    });
}

// create function to build the bubble chart 
function build_bubble(x){

    // call data
    d3.json(url).then(function(data) {

        // filter sample results
        let sample_data = data.samples.filter(y => y.id == x);

        // store results for first id
        let result = sample_data[0];

        // get the sample values, otu_ids and otu_labels 
        let sample_values = result.sample_values; 
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;

        // set the trace for the bubble chart
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values, color: otu_ids, colorscale: "Picnic"
            }
        };
        
        // set the layout
        let layout = {title: `Bacteria in ${x}`, xaxis: {title: "OTU ID"}};
        
        // plot
        Plotly.newPlot("bubble", [trace], layout);
    });
}

// create function to display metadata
function display_metadata(x){

    // call data
    d3.json(url).then(function(data) {

        // create a variable
        var panel = d3.select("#sample-metadata");

        // filter sample results
        let sample_data = data.metadata.filter(y => y.id == x);

        // store results for first id
        let result = sample_data[0];

        // clear existing metadata
        panel.html("");

        // load metadata
        Object.entries(result).forEach(([k,v])=>{
            panel.append("h5").text(`${k}: ${v}`);
        });
        
    });
}

// call the function
init();