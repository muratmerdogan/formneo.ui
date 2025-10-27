"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionInput = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@designable/react");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var PositionInput = function (props) {
    var prefix = (0, react_2.usePrefix)('position-input');
    var _a = __read((0, react_1.useState)(props.value), 2), current = _a[0], setCurrent = _a[1];
    (0, react_1.useEffect)(function () {
        if (!props.value) {
            setCurrent('center');
        }
    }, [props.value]);
    var createCellProps = function (type) { return ({
        className: (0, classnames_1.default)(prefix + '-cell', { active: current === type }),
        onClick: function () {
            var _a;
            setCurrent(type);
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, type);
        },
    }); };
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className), style: props.style },
        react_1.default.createElement("div", { className: prefix + '-row' },
            react_1.default.createElement("div", __assign({}, createCellProps('top')), "\u2533")),
        react_1.default.createElement("div", { className: prefix + '-row' },
            react_1.default.createElement("div", __assign({}, createCellProps('left')), "\u2523"),
            react_1.default.createElement("div", __assign({}, createCellProps('center')), "\u254B"),
            react_1.default.createElement("div", __assign({}, createCellProps('right')), "\u252B")),
        react_1.default.createElement("div", { className: prefix + '-row' },
            react_1.default.createElement("div", __assign({}, createCellProps('bottom')), "\u253B"))));
};
exports.PositionInput = PositionInput;
