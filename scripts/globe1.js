define(['lib/d3.v3.4.11'], function(d3) {

    var width = 760,
        height = 760,
        scale = width / 2 - 4;

    var canvas = d3.select("body").append("canvas")
        .attr("width", width)
        .attr("height", height);

    var context = canvas.node().getContext("2d");

    var sphere = {type: "Sphere"},
        graticule = d3.geo.graticule()();

    var picture = {
        "type": "MultiLineString",
        "coordinates": [
            [[ 0.0, 0.0], [50.0, 50.0]],
            [[50.0, 0.0], [ 0.0, 50.0]],
            [[175.0, 90.0], [175.0, -80.0]]
        ]
    };

    d3.timer(function(elapsed) {
      var render = d3.geo.pipeline()
          .source(d3.geo.jsonSource)
          .pipe(d3.geo.rotate, 0, -.5, 0)
          .pipe(d3.geo.rotate, elapsed / 3000, 0, 0)
          .pipe(d3.geo.clipCircle, Math.PI / 2)
          .pipe(d3.geo.project, d3.geo.orthographic, .3 / scale)
          .sink(d3.geom.contextSink, context);

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      context.scale(scale, -scale);

      context.beginPath();
      render(graticule);
      context.lineWidth = 1 / scale;
      context.stroke();

      context.beginPath();
      render(sphere);
      context.lineWidth = 2.5 / scale;
      context.stroke();

      context.beginPath();
      render(picture);
      context.lineWidth = 1.5 / scale;
      context.strokeStyle = 'red';
      context.stroke();

      context.restore();
    });

    d3.select(self.frameElement).style("height", height + "px");

});
