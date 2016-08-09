
window.onload = function(){

//Map dimensions (in pixels)
var width = 283,
    height = 600;

//Map projection
var projection = d3.geo.conicEqualArea()
    .scale(103653.33118397206)
    .center([-122.32075080703528,47.62051411136642]) //projection center
    .parallels([47.463074999999996,47.77792193076489]) //parallels for conic projection
    .rotate([122.32075080703528]) //rotation for conic projection
    .translate([-94430.00137541037,-94870.74015679878]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("#heatmap").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([7,329])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

//Create a tooltip, hidden at the start
var tooltip = d3.select("#heatmap").append("div").attr("class","tooltip");

d3.json("final.topojson",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console

  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(topojson.feature(geodata,geodata.objects.collection).features) //generate features from TopoJSON
    .enter()
    .append("path")
    .attr("d",path)
    .attr("class", function(d) { return (typeof color(d.properties.value) == "string" ? color(d.properties.value) : ""); })
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);

});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {
  d3.select("#zipinfo #zip")
  .text(d.properties.ZCTA5CE10)

  d3.select("#zipinfo #value")
  .text(d.properties.value + " Bikes Stolen")
  
}


//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 2 / zoom.scale() + "px" );
}


//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
      .text(d.properties.value);
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}
}