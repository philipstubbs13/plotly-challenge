// Function that sorts an array of numbers at a specific index in descending order.
const Comparator = (a, b) => {
  if (a[2] > b[2]) return -1;
  if (a[2] < b[2]) return 1;
  return 0;
};

// Given an id, finds a specific sample from the given dataset.
const findBellyButtonData = (data, id) => {
  let selectedId = id;
  if (!selectedId) {
    const ids = data.samples.map(sample => sample.id);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    selectedId = randomId;
  }

  const selectedSample = data.samples.find(sample => sample.id == selectedId);
  const selectedSampleMetadata = data.metadata.find(sample => sample.id == selectedId);

  return { selectedSample, selectedSampleMetadata };
};

// Function used to populate the demographics panel with metadata.
const populateDemographics = metadata => {
  let demographicsContainer = d3.select('.demographics-container');
  demographicsContainer.html('');
  Object.entries(metadata).forEach(([key, value]) => {
    demographicsContainer.append('div').html(`
      <div class="col-md-3 mt-3">
        <div class="card" style="width: 15rem;">
          <div class="card-body">
            <h5 class="card-title">${key}</h5>
            <p class="card-text mt-3">${value}</p>
          </div>
        </div>
      </div>
    `);
  });
  demographicsContainer.selectAll('.card').style('border', `5px solid ${colors.mainLightColor}`);
};

const buildSampleArrays = selectedSample => {
  let sample_array = selectedSample.sample_values.map((value, index) => [
    selectedSample.otu_ids[index],
    selectedSample.otu_labels[index],
    value,
  ]);

  // Sort the sample array in descending order by sample value (second index).
  sample_array = sample_array.sort(Comparator);

  // After sorting, slice up the sample array so we only get the top 10 ids, labels, and values.
  const sample_array_sliced = sample_array.slice(0, 10);
  const sample_array_sliced_ids = sample_array_sliced.map(sample => `OTU ${sample[0]}`).reverse();
  const sample_array_sliced_labels = sample_array_sliced.map(sample => sample[1]).reverse();
  const sample_array_sliced_values = sample_array_sliced.map(sample => sample[2]).reverse();

  return {
    sample_array_sliced_values,
    sample_array_sliced_ids,
    sample_array_sliced_labels,
  };
};

const buildBarPlot = (sampleArrayObject, id) => {
  const { sample_array_sliced_ids, sample_array_sliced_labels, sample_array_sliced_values } = sampleArrayObject;

  const barPlotTrace = {
    type: 'bar',
    orientation: 'h',
    x: sample_array_sliced_values,
    y: sample_array_sliced_ids,
    text: sample_array_sliced_labels,
    opacity: 0.5,
    height: 800,
    marker: {
      color: '#040224',
      line: {
        color: colors.lightGreen,
        width: 4.0,
      },
    },
  };

  const barPlotData = [barPlotTrace];

  const barPlotLayout = {
    title: `Top ${sample_array_sliced_ids.length} OTUS for Test Subject ${id}`,
    font: {
      family: 'Raleway, sans-serif',
    },
    yaxis: {
      zeroline: false,
      tickfont: {
        size: 16,
        color: colors.mainLightColor,
      },
      linecolor: colors.mainLightColor,
      linewidth: 2,
    },
    xaxis: {
      tickfont: {
        size: 18,
        color: colors.mainLightColor,
      },
      linecolor: colors.mainLightColor,
      linewidth: 2,
    },
    titlefont: {
      size: 20,
      color: colors.mainLightColor,
    },
    bargap: 0.4,
    autosize: true,
    width: 500,
    height: 600,
    plot_bgcolor: colors.mainDarkColor,
    paper_bgcolor: colors.mainDarkColor,
  };
  Plotly.newPlot('bar', barPlotData, barPlotLayout);
};

const buildBubblePlot = selectedSample => {
  const bubblePlotTrace = {
    autosize: true,
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    text: selectedSample.otu_labels,
    mode: 'markers',
    height: 500,
    marker: {
      color: selectedSample.otu_ids,
      size: selectedSample.sample_values,
    },
  };

  const bubblePlotData = [bubblePlotTrace];

  const bubblePlotLayout = {
    plot_bgcolor: colors.mainDarkColor,
    paper_bgcolor: colors.mainDarkColor,
    xaxis: {
      title: 'OTU ID',
      tickfont: {
        size: 18,
        color: colors.mainLightColor,
      },
      titlefont: {
        size: 18,
        color: colors.mainLightColor,
      },
      linecolor: colors.mainLightColor,
      linewidth: 2,
    },
    yaxis: {
      tickfont: {
        size: 16,
        color: colors.mainLightColor,
      },
      linecolor: colors.mainLightColor,
      linewidth: 2,
      automargin: true,
    },
    titlefont: {
      size: 20,
      color: colors.mainLightColor,
    },
  };

  Plotly.newPlot('bubble', bubblePlotData, bubblePlotLayout);
};

const buildGaugePlot = selectedSampleMetadata => {
  const gaugePlotData = [
    {
      type: 'indicator',
      mode: 'gauge+number+delta',
      hole: 0.3,
      value: selectedSampleMetadata.wfreq,
      title: { text: 'Belly Button Washing Frequency', font: { size: 24 } },
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: 'darkblue' },
        bgcolor: colors.white,
        borderwidth: 5,
        bordercolor: colors.lightGreen,
        bar: { color: colors.mainLightColor },
        steps: [
          { range: [0, 1], color: '#C8F08F' },
          { range: [1, 2], color: '#B4E051' },
          { range: [2, 3], color: '#8CD211' },
          { range: [3, 4], color: '#5AA700' },
          { range: [4, 5], color: '#4C8400' },
          { range: [5, 6], color: '#2D660A' },
          { range: [6, 7], color: '#114D14' },
          { range: [7, 8], color: '#0A3C02' },
          { range: [8, 9], color: '#0C2808' },
        ],
      },
    },
  ];

  const gaugePlotLayout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    font: { color: colors.mainLightColor, family: 'Arial' },
    plot_bgcolor: colors.mainDarkColor,
    paper_bgcolor: colors.mainDarkColor,
  };

  Plotly.newPlot('gauge', gaugePlotData, gaugePlotLayout);
};
