let testSubjectSelect = d3.select("#selDataset");

// Use the D3 library to load in samples.json.
d3.json("../../data/samples.json")
  .then((data) => {
    const names = data.names;
    names.forEach((name) => {
      testSubjectSelect.append('option').attr('value', name).text(name);
    })
  });

const buildBarChart = (subjectId) => {

  const id = subjectId || d3.event.target.value;

  d3.json("../../data/samples.json")
  .then((data) => {

    const selectedSample = data.samples.find(sample => sample.id == id);
    const selectedSampleMetadata = data.metadata.find(sample => sample.id == id);

    let demographicsPanelBody = d3.select(".panel-body");
    demographicsPanelBody.html("");
    Object.entries(selectedSampleMetadata).forEach(([key, value]) => {
      demographicsPanelBody.append('p').text(`${key}: ${value}`);
    })

    const sample_values = selectedSample.sample_values;
    const otu_ids = selectedSample.otu_ids;
    const otu_labels = selectedSample.otu_labels;
    let sample_array = sample_values.map((value, index) => [otu_ids[index], otu_labels[index], value]);

     function Comparator(a, b) {
      if (a[2] > b[2]) return -1;
      if (a[2] < b[2]) return 1;
      return 0;
    }

    sample_array = sample_array.sort(Comparator);

    const sample_array_top_10 = sample_array.slice(0, 10);
    const sample_array_top_10_ids = sample_array_top_10.map(sample => `OTU ${sample[0]}`).reverse();
    const sample_array_top_10_labels = sample_array_top_10.map(sample => sample[1]).reverse();
    const sample_array_top_10_values = sample_array_top_10.map(sample => sample[2]).reverse();

    const barPlotTrace = {
      type: "bar",
      orientation: 'h',
      x: sample_array_top_10_values,
      y: sample_array_top_10_ids,
      text: sample_array_top_10_labels
    };

    const barPlotData = [barPlotTrace];

    const barPlotLayout = {
      title: `Top ${sample_array_top_10_ids.length} OTUS for ${id}`,
    };
    

    Plotly.newPlot("bar", barPlotData, barPlotLayout);

    const bubblePlotTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      height: 500,
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        size: sample_values
      }
    };

    const bubblePlotData = [bubblePlotTrace];

    const bubblePlotLayout = {
      xaxis: { title: "OTU ID"}
    };

    Plotly.newPlot('bubble', bubblePlotData, bubblePlotLayout);

    const gaugePlotData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: selectedSampleMetadata.wfreq,
        title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: '#C8F08F' },
            { range: [1, 2], color: "#B4E051" },
            { range: [2, 3], color: '#8CD211' },
            { range: [3, 4], color: '#5AA700'},
            { range: [4, 5], color: '#4C8400' },
            { range: [5, 6], color: '#2D660A'},
            { range: [6, 7], color: '#114D14'},
            { range: [7, 8], color: '#0A3C02'},
            { range: [8, 9], color: '#0C2808'}
          ],
        }
      }
    ];

    const gaugePlotLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot('gauge', gaugePlotData, gaugePlotLayout);

  });
}

testSubjectSelect.on("change", buildBarChart);

buildBarChart("940");