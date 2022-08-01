define(['lodash', 'assert'], function(_, assert) {

    var make_vertex = function() {
        return {outgoing: undefined};
    };

    var make_face = function() {
        return {edge: undefined};
    };

    var make_edge = function() {
        return {
            begin: undefined,
            end: undefined,
            twin: undefined,
            next: undefined,
            prev: undefined,
            face: undefined
        };
    };

    var make_dcel = function(vertices, faces, edges) {
        var outgoing = function(v) {
            assert.ok(0 <= v && v < vertices.length);
            return vertices[v].outgoing;
        };

        var edge = function(f) {
            assert.ok(0 <= f && f < faces.length);
            return faces[f].edge;
        };

        var begin = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].begin;
        };
        var end = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].end;
        };
        var twin = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].twin;
        };
        var next = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].next;
        };
        var prev = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].prev;
        };
        var face = function(e) {
            assert.ok(0 <= e && e < edges.length);
            return edges[e].face;
        };

        var check = function() {
            _.each(vertices, function(_, v) {
                assert.ok(begin(outgoing(v)) == v);
            });

            _.each(faces, function(_, f) {
                assert.ok(face(edge(f)) == f);
            });

            _.each(edges, function(_, e) {
                assert.ok(prev(next(e)) == e);
                assert.ok(next(prev(e)) == e);
                assert.ok(end(e) == begin(next(e)));
                assert.ok(face(e) == face(next(e)));
            });

            _.each(edges, function(_, e1) {
                var e2 = twin(e1);
                if (e2 !== undefined) {
                    assert.ok(twin(e2) == e1);
                    assert.ok(begin(e1) == end(e2));
                }
            });
        };

        var neighbours = function(v, cb) {
            var o = outgoing(v);
            for (var e = o; ; e = twin(prev(e))) {
                cb(end(e));
                if (e == o) {
                    break;
                }
            }
        };

        return {
            n_vertices: vertices.length,
            n_faces: faces.length,
            n_edges: edges.length,
            outgoing: outgoing,
            edge: edge,
            begin: begin,
            end: end,
            twin: twin,
            next: next,
            prev: prev,
            face: face,
            check: check,
            neighbours: neighbours
        };
    };

    var make_builder = function() {
        var vertices = [];
        var faces = [];
        var edges = [];

        var dcel = make_dcel(vertices, faces, edges);

        var append_vertex = function() {
            vertices.push(make_vertex());
            return vertices.length - 1;
        };

        var append_face = function() {
            faces.push(make_face());
            return faces.length - 1;
        };

        var append_edge = function() {
            edges.push(make_edge());
            return edges.length - 1;
        };

        var set_outgoing = function(v, e) {
            assert.ok(0 <= v && v < vertices.length);
            assert.ok(0 <= e && e < edges.length);
            assert.ok(vertices[v].outgoing === undefined);
            vertices[v].outgoing = e;
        };

        var set_edge = function(f, e) {
            assert.ok(0 <= f && f < faces.length);
            assert.ok(0 <= e && e < edges.length);
            assert.ok(faces[f].edge === undefined);
            faces[f].edge = e;
        };

        var set_begin = function(e, v) {
            assert.ok(0 <= e && e < edges.length);
            assert.ok(0 <= v && v < vertices.length);
            assert.ok(edges[e].begin === undefined);
            edges[e].begin = v;
        };

        var set_end = function(e, v) {
            assert.ok(0 <= e && e < edges.length);
            assert.ok(0 <= v && v < vertices.length);
            assert.ok(edges[e].end === undefined);
            edges[e].end = v;
        };

        def set_twins(self, e1, e2):
            assert 0 <= e1 < len(self._edges)
            assert 0 <= e2 < len(self._edges)
            assert self._edges[e1].twin is None
            assert self._edges[e2].twin is None
            self._edges[e1].twin = e2
            self._edges[e2].twin = e1

        def set_face(self, e, f):
            assert 0 <= e < len(self._edges)
            assert 0 <= f < len(self._faces)
            assert self._edges[e].face is None
            self._edges[e].face = f

        def set_next_prev(self, ep, en):
            assert 0 <= ep < len(self._edges)
            assert 0 <= en < len(self._edges)
            assert self._edges[ep].next is None
            assert self._edges[en].prev is None
            self._edges[ep].next = en
            self._edges[en].prev = ep

        @classmethod
        def by_faces(cls, n_vertices, faces):
            b = cls()

            for _ in xrange(n_vertices):
                b.append_vertex()

            edge_index = {}

            for f in faces:
                face = b.append_face()

                edges = [b.append_edge() for _ in f]

                for edge in edges:
                    b.set_face(edge, face)
                b.set_edge(face, edges[0])

                for edge, (begin, end) in zip(edges, utils.pairs(f)):
                    b.set_begin(edge, begin)
                    b.set_end(edge, end)

                    if b.outgoing(begin) is None:
                        b.set_outgoing(begin, edge)

                    assert (begin, end) not in edge_index
                    edge_index[(begin, end)] = edge

                    twin = edge_index.get((end, begin), None)
                    if twin is not None:
                        b.set_twins(edge, twin)

                for p in utils.pairs(edges):
                    b.set_next_prev(*p)

            b.check()
            return b.dcel()
        return {
            dcel: dcel,
        };
    };

    return {
        make_dcel: make_dcel
    };
});

