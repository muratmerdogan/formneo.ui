export var createUniformSpeedAnimation = function (speed, callback) {
    if (speed === void 0) { speed = 10; }
    var request = null;
    var startTime = null;
    var start = function () {
        if (request)
            return;
        request = requestAnimationFrame(function (timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }
            var deltaTime = timestamp - startTime;
            var delta = (deltaTime / 1000) * speed;
            callback(delta);
            request = null;
            start();
        });
    };
    start();
    return function () {
        if (request) {
            cancelAnimationFrame(request);
            request = null;
        }
        startTime = null;
    };
};
//越接近阈值，速度越小，越远离阈值，速度越大
export var calcSpeedFactor = function (delta, threshold) {
    if (delta === void 0) { delta = 0; }
    if (threshold === void 0) { threshold = Infinity; }
    if (threshold >= delta) {
        return (threshold - delta) / threshold;
    }
    return 0;
};
