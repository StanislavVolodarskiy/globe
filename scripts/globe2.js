define(['lib/d3.v3.5.17'], function(d3) {

    var width = 760,
        height = 760,
        scale = width / 2 - 4;

    var projection = d3.geo.orthographic()
        .scale((width - 10) / 2.)
        .translate([width / 2, height / 2])
        .rotate([45, 45, 45])
        .clipAngle(90)
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var graticule = d3.geo.graticule();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

});
