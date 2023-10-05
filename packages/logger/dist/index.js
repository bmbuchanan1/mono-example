"use strict";
exports.__esModule = true;
exports.error = exports.log = void 0;
var log = function (str) {
    console.log("logger: " + str);
};
exports.log = log;
var error = function (str) {
    console.error("logger: " + str);
};
exports.error = error;
