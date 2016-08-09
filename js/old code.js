<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" charset="utf-8"></script>
<script src="//d3js.org/topojson.v1.min.js"></script>
</head>

<body>
	<script>
	var width = 760;
	var height = 700;
	var canvas = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)

	d3.json("zip.geojson", function(data) {

		var group = canvas.selectAll("g")
			.data(data.features)
			.enter()
			.append("g")

		var projection = d3.geo.albers()
    		.center([0, 47.6062])
    		.rotate([122.3321, 0])
    		.parallels([50, 60])
    		.scale(100000)
    		.translate([width / 2, height / 2]);

    		
		var path = d3.geo.path().projection(projection);

		var areas = group.append("path")
			.attr("d", path)
			.attr("class","area")
			.attr("fill","steelblue");


	canvas.selectAll(".subunit")
    	.data(topojson.feature(data, data.objects.subunits).features)
  		.enter().append("path")
    	.attr("class", function(d) { return "subunit " + d.id; })
    	.attr("d", path);

	});



	</script>
</body>
</html>