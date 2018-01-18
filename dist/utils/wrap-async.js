"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapAsync(fn) {
    return function (args, cb) {
        fn.call(this, args, cb)
            .then(() => cb())
            .catch((err) => {
            this.log(err.message);
            cb();
        });
    };
}
exports.wrapAsync = wrapAsync;
