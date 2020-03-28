# Plotly Challenge

An interactive dashboard that explore belly button biodiversity and uses a dataset that catalogs the microbes that colonize human navels.

## Deployment

The dashboard is deployed to Heroku at the following URL: <https://belly-button-visualizations.herokuapp.com/>.

## About the data

The [dataset](./samples.json) used for this dashboard reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

Hulcr, J. et al.(2012) *A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable*. Retrieved from: http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/

## Technologies Used

The dashboard is built using:

* D3
* Plotly
* JavaScript
* HTML
* CSS.

## Visualizations

The dashboard includes the following visualizations (which were built using Plotly):

* A horizontal bar chart with a dropdown menu that displays the top 10 OTUs found for a specific individual.
* A bubble chart that displays each sample.
* A gauge chart that shows the weekly washing frequency of the individual selected from the dropdown menu.

All of the visualizations update any time that a new sample is selected from the dropdown menu.

In addition, the dashboard includes an individual's demographic information.