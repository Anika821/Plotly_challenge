

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var filterData = metadata.filter(sampleObj => sampleObj.id == sample);
    var sliceData = filterData[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sliceData).forEach(function ([key, value]) {
     var row = PANEL.append("h6");
     row.text(`${key}: ${value} \n`);
    });
  });
};

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var filterData = samples.filter(subject => subject.id == sample);
    var subject = filterData[0];

    var otu_ids = subject.otu_ids;
    var otu_labels = subject.otu_labels;
    var sample_values = subject.sample_values;

    // Build a Bubble Chart
    var layout = {
      title: "Bacteria Cultures",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubblechart = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "multi"
        }
      }
    ];

    Plotly.newPlot("bubble", bubblechart, layout);

    var yLinear = otu_ids.slice(0, 10).reverse();
    var barData = [
      {
        y: yLinear,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria",
      margin: { 
        t: 30, 
        l: 150 
      }
    
    };  
  

    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();