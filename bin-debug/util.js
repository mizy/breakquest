// TypeScript file
var util = {
    getVectorLength: function (arr) {
        return Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1]);
    },
    dot: function (arr, arr1) {
        return arr[0] * arr1[0] + arr[1] * arr1[1];
    },
    addVector: function (arr, arr1) {
        return [arr[0] + arr1[0], arr[1] + arr1[1]];
    },
    multiplyFloat: function (arr, val) {
        return [arr[0] * val, arr[1] * val];
    },
    subVector: function (arr, arr1) {
        return [arr[0] - arr1[0], arr[1] - arr1[1]];
    },
    normalize: function (arr) {
        var length = util.getVectorLength(arr);
        return [arr[0] / length, arr[1] / length];
    }
};
//# sourceMappingURL=util.js.map