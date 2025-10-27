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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.createPolyInput = void 0;
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var react_2 = require("@designable/react");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var isValid = function (val) { return val !== undefined && val !== null; };
var getEventValue = function (event) {
    if (event === null || event === void 0 ? void 0 : event.target) {
        if (isValid(event.target.value))
            return event.target.value;
        if (isValid(event.target.checked))
            return event.target.checked;
        return;
    }
    return event;
};
var createTypes = function (types, exclude, include) {
    return types.filter(function (_a) {
        var type = _a.type;
        if (Array.isArray(include) && include.length) {
            return include.includes(type);
        }
        if (Array.isArray(exclude) && exclude.length) {
            return !exclude.includes(type);
        }
        return true;
    });
};
function createPolyInput(polyTypes) {
    if (polyTypes === void 0) { polyTypes = []; }
    return function (_a) {
        var _b;
        var className = _a.className, style = _a.style, value = _a.value, onChange = _a.onChange, exclude = _a.exclude, include = _a.include, props = __rest(_a, ["className", "style", "value", "onChange", "exclude", "include"]);
        var prefix = (0, react_2.usePrefix)('poly-input');
        var types = createTypes(polyTypes, exclude, include);
        var _c = __read((0, react_1.useState)((_b = types[0]) === null || _b === void 0 ? void 0 : _b.type), 2), current = _c[0], setCurrent = _c[1];
        var type = types === null || types === void 0 ? void 0 : types.find(function (_a) {
            var type = _a.type;
            return type === current;
        });
        var component = type === null || type === void 0 ? void 0 : type.component;
        var typesValue = (0, react_1.useRef)({});
        (0, react_1.useEffect)(function () {
            types === null || types === void 0 ? void 0 : types.forEach(function (_a) {
                var checker = _a.checker, type = _a.type;
                if (checker(value)) {
                    setCurrent(type);
                }
            });
        }, [value]);
        var getNextType = function () {
            var currentIndex = types === null || types === void 0 ? void 0 : types.findIndex(function (_a) {
                var type = _a.type;
                return type === current;
            });
            var nextIndex = currentIndex + 1 > (types === null || types === void 0 ? void 0 : types.length) - 1 ? 0 : currentIndex + 1;
            return types[nextIndex];
        };
        var transformOnChangeValue = function (value, type) {
            return (type === null || type === void 0 ? void 0 : type.toChangeValue) ? type === null || type === void 0 ? void 0 : type.toChangeValue(value) : value;
        };
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, className), style: style },
            component && (react_1.default.createElement("div", { className: prefix + '-content' }, react_1.default.createElement(component, __assign(__assign({}, props), { value: (type === null || type === void 0 ? void 0 : type.toInputValue) ? type === null || type === void 0 ? void 0 : type.toInputValue(value) : value, onChange: function (event) {
                    var value = getEventValue(event);
                    typesValue.current[type === null || type === void 0 ? void 0 : type.type] = value;
                    onChange === null || onChange === void 0 ? void 0 : onChange(transformOnChangeValue(value, type));
                } })))),
            react_1.default.createElement(antd_1.Button, { className: prefix + '-controller', style: {
                    width: !component ? '100%' : 'auto',
                }, block: true, onClick: function () {
                    var nextType = getNextType();
                    if (nextType === type)
                        return;
                    setCurrent(nextType === null || nextType === void 0 ? void 0 : nextType.type);
                    onChange === null || onChange === void 0 ? void 0 : onChange(transformOnChangeValue(typesValue.current[nextType === null || nextType === void 0 ? void 0 : nextType.type], nextType));
                } }, (type === null || type === void 0 ? void 0 : type.icon) ? (react_1.default.createElement(react_2.IconWidget, { infer: type.icon })) : ((type === null || type === void 0 ? void 0 : type.title) || (type === null || type === void 0 ? void 0 : type.type)))));
    };
}
exports.createPolyInput = createPolyInput;
