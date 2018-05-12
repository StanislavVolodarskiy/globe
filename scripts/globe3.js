define(['lib/d3.v4.12.2'], function(d3) {

    var colorGraticule = '#ccc';
    var colorCountry = '#a00';

    var width = 760;
    var height = 760;

    var scaleFactor = 0.9; // scale of the globe inside the canvas element
    var scale = (scaleFactor * Math.min(width, height)) / 2;

    var canvas = d3
        .select('body')
        .append('canvas')
        .attr('width', width)
        .attr('height', height);

    var context = canvas.node().getContext('2d');
    var sphere = {type: 'Sphere'};
    var graticule = d3.geoGraticule10();

    var toR3 = function(longitude_latitude) {
        var lambda = longitude_latitude[0] / 180 * Math.PI;
        var phi = longitude_latitude[1] / 180 * Math.PI;
        return [
            Math.sin(lambda) * Math.cos(phi),
            Math.sin(phi),
            Math.cos(lambda) * Math.cos(phi)
        ];
    };

    var fromR3 = function(v) {
        var lambda = Math.atan2(v[2], v[0]);
        var phi = Math.atan2(v[1], Math.sqrt(v[0] * v[0] + v[2] * v[2]));
        return [lambda / Math.PI * 180, phi / Math.PI * 180];
    };

    var arc = function(from, to, normal) {
        if (dot(cross(from, to), normal) > 0) {
        } else {
        }
        return [fromR3(from), fromR3(to)];
    };

    var lines = {
        'type': 'MultiLineString',
        'coordinates': [
            [[ 0.0, 0.0], [50.0, 50.0]],
            [[50.0, 0.0], [ 0.0, 50.0]],
            [[175.0, 90.0], [175.0, -80.0]]
        ].concat([arc(toR3([0, 0]), toR3([0, 90]), toR3([90, 0]))])
    };
    console.log(lines);
    var points = {
        "type": "MultiPoint",
        "coordinates": [
            [25.0, 25.0],
            [10.0, 0.0],
            [0.0, 0.0]
        ]
    };

    var projection = d3
        .geoOrthographic()
        .precision(0.1)
        .scale(scale)
        .rotate([0, -20])
        .translate([width / 2, height / 2]);
    var path = d3
        .geoPath(projection)
        .context(context)
        .pointRadius(2);
    context.lineCap = 'round';

    var stroke = function(obj, color, width) {
        context.beginPath();
        path(obj);
        context.strokeStyle = color;
        context.lineWidth = width;
        context.stroke();
    };

    var render = function() {
        context.clearRect(0, 0, width, height);
        stroke(graticule, colorGraticule, 1);
        stroke(sphere, colorGraticule, 2);
        stroke(lines, 'red', 2);
        stroke(points, 'blue', 3);
    };

    var makeDrag = function(scale, projection, render) {
        var startMouse;
        var startRotate;

        var dxdy = (function() {
            var projection = d3.geoOrthographic().scale(scale);
            var t = projection.translate();
            return projection.invert([t[0] + 1, t[1] + 1]);
        })();

        var start = function() {
            startMouse = d3.mouse(this);
            startRotate = projection.rotate();
        };

        var drag = function() {
            var mouse = d3.mouse(this);
            projection.rotate([
                startRotate[0] + dxdy[0] * (mouse[0] - startMouse[0]),
                startRotate[1] + dxdy[1] * (mouse[1] - startMouse[1])
            ]);
            render();
        };

        return d3.drag()
            .on('start', start)
            .on('drag', drag)
            .on('end', function() {})
        ;
    };

    canvas.call(makeDrag(scale, projection, render));

    render();

});
