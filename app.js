var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("../../Data/data.csv", function(err, data) {
    if (err) throw err;
  // Step 1: Parse Data/Cast as numbers
   // ==============================
    data.forEach(function(data) {
    data.median_income = +data.median_income;
    data.depression = +data.depression;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.median_income)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.depression)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.median_income))
  .attr("cy", d => yLinearScale(d.depression))
  .attr("r", "10")
  .attr("fill", "skyblue")
  .attr("opacity", ".8");

  chartGroup.selectAll(null)
  .data(data)
  .enter()
  .append("text")
  .text(function(d)  {return d.abbr})
  .attr("x", function(d) {return xLinearScale(d.median_income)})
  .attr("y", function(d) {return yLinearScale(d.depression)})
  .attr("text-anchor", "middle")
  .attr("font-family", "sans-serif")
  .attr("font-size", "5px")
  .attr("stroke-width", "2px")
  .attr("color", "black");

  // Step 6: Initialize tool tip
  // ==============================
   var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Median Income: ${d.median_income}<br>Risk of depression: ${d.depression}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Risk of Depression");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Median Household income");
}); 
