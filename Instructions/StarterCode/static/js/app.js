function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var sampleData = d3.select('#sample-metadata');
    //PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
    var row = sampleData.append('panel-body');
    row.text(`${key}: ${value} \n`);
    });
  });
  
};  


    
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var subjects = data.samples;

    var filterData = subjects.filter(subject => subject.id ===sample);

    sliceData = filterData[0];
    
    reverceData = sliceData;
    //console.log(reverceData.map(object => object.otu_labels));
    console.log(sliceData);
    var trace = {
      x: sliceData.sample_values.slice(0, 10).reverse(),
      y: sliceData.otu_ids.slice(0, 10).reverse(),
      text: sliceData.otu_labels.slice(0, 10).reverse(),
      type:"bar",
      oriantation: "h"


      
    };

    var chart2 = [trace];

    var layout = {
  title: "Top 10 OTU IDS",
  
   margin: {
    t: 30,
    l: 150
  } 
  };
  

   Plotly.newPlot("bar", chart2, layout);
  
  //console.log(samples.otu_ids);

  //var filtersubject = otu_ids.filter(filtersubject);



    //var filterData = subjects.filter(subject => subject.id ===sample);


    //console.log(filterData);



    
     // Build a Bubble Chart
    var xValues = filterData[0].otu_ids;
    var yValues = filterData[0].sample_values;
    var tValues = filterData[0].otu_labels;
    var mSize = filterData[0].sample_values;
    var mClrs = filterData[0].otu_ids;
    
     console.log(xValues);


    var trace1 = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      } 
    };

    var chart = [trace1];
    var layout = {
      xaxis: {title: "OTU ID"}
    };
   Plotly.newPlot('bubble', chart, layout);
  }); 
};   

  




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  // code to populate select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames);
    sampleNames.forEach((sample) => {

    selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    
    //Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample)
   });
 };  


  function optionChanged(newSample) {
//    // Fetch new data each time a new sample is selected 
 //The function call is in the HTML file as <select id="selDataset" onchange="optionChanged(this.value)"></select>
    buildCharts(newSample);
    buildMetadata(newSample);
  
}; 

init();