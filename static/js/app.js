let testSubjectSelect = d3.select('#selDataset');
testSubjectSelect.style('width', '20%');

const buildDashboard = () => {
  let id = '';
  if (d3.event && d3.event.target && d3.event.target.value) {
    id = d3.event.target.value;
  }

  // Use the D3 library to load in samples.json.
  d3.json('../../samples.json').then(data => {
    // Populate the select dropdown with ids.
    const names = data.names;
    names.forEach(name =>
      testSubjectSelect
        .append('option')
        .attr('value', name)
        .text(name),
    );

    const bellyButtonData = findBellyButtonData(data, id);
    const { selectedSample, selectedSampleMetadata } = bellyButtonData;

    populateDemographics(selectedSampleMetadata);

    const sampleArrayObject = buildSampleArrays(selectedSample);

    const { sample_array_sliced_values, sample_array_sliced_ids, sample_array_sliced_labels } = sampleArrayObject;

    buildBarPlot(sampleArrayObject, id);

    buildBubblePlot(selectedSample);

    buildGaugePlot(selectedSampleMetadata);
  });
};

testSubjectSelect.on('change', buildDashboard);

buildDashboard();
