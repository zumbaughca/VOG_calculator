# Value of gain calculator

This simple web app calculates the change in feed cost and value of gain for sheep fed corn grain or grain sorghum. Calculations are based on research data.

# Table of contents
* [Top Banner](#top-banner)
* [Chart](#chart)
* [Data Table](#data-table)
* [Page Scripts](#page-scripts)

# Top Banner
The style for the top banner is contained in banner.css. 

# Chart
The style for the chart is contained in chart.css. The charts are styled to each occupy 50% of the screen width. 

The charts are scripted with Chart.js and scripts are located in index.js. Blank graphs are instantiated when the page is loaded. Each chart will remain empty until all necessary data are entered into input fields. When the mouse hovers over a bar, the current value is displayed, and in the case of feed cost, the cost per pound is also displayed. 

# Data Table
The style for the data table is contained in table.css.

The data table is hidden by default. If the user wishes to view the data table, clicking on the "Show Table" button will display it under the charts.

# Page Scripts
All page scripts are contained in index.js.
