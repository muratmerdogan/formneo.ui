import { isFn, KeyCode } from '@designable/shared';
export { KeyCode };
var Shortcut = /** @class */ (function () {
    function Shortcut(props) {
        this.codes = this.parseCodes(props.codes);
        this.handler = props.handler;
        this.matcher = props.matcher;
    }
    Shortcut.prototype.parseCodes = function (codes) {
        var results = [];
        codes.forEach(function (code) {
            if (Array.isArray(code)) {
                results.push(code);
            }
            else {
                results.push([code]);
            }
        });
        return results;
    };
    Shortcut.prototype.preventCodes = function (codes) {
        var _a;
        if (this.codes.length) {
            for (var i = 0; i < codes.length; i++) {
                var sequence = (_a = this.codes[i]) !== null && _a !== void 0 ? _a : [];
                for (var j = 0; j < sequence.length; j++) {
                    if (!Shortcut.matchCode(codes[j], sequence[j])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };
    Shortcut.prototype.matched = function (matched, context) {
        if (isFn(this.handler) && matched) {
            this.handler(context);
        }
        return matched;
    };
    Shortcut.prototype.match = function (codes, context) {
        var _this = this;
        return this.codes.some(function (sequence) {
            var sortedSelf = Shortcut.sortCodes(sequence);
            var sortedTarget = Shortcut.sortCodes(codes);
            if (isFn(_this.matcher)) {
                return _this.matched(_this.matcher(sortedTarget), context);
            }
            if (sortedTarget.length !== sortedSelf.length)
                return _this.matched(false, context);
            for (var i = 0; i < sortedSelf.length; i++) {
                if (!Shortcut.matchCode(sortedTarget[i], sortedSelf[i])) {
                    return _this.matched(false, context);
                }
            }
            return _this.matched(true, context);
        });
    };
    Shortcut.matchCode = function (code1, code2) {
        var _a, _b;
        return ((_a = code1 === null || code1 === void 0 ? void 0 : code1.toLocaleLowerCase) === null || _a === void 0 ? void 0 : _a.call(code1)) === ((_b = code2 === null || code2 === void 0 ? void 0 : code2.toLocaleLowerCase) === null || _b === void 0 ? void 0 : _b.call(code2));
    };
    Shortcut.sortCodes = function (codes) {
        return codes.map(function (code) { return code.toLocaleLowerCase(); }).sort();
    };
    return Shortcut;
}());
export { Shortcut };
