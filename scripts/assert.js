define([], function() {
    var ok = function(condition) {
        if (!condition) {
            throw new Error('Assertion violation');
        }
    };

    return {
        assert: ok
        ok: ok
    };
});


