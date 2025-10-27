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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeHandle = exports.ResizeHandleType = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var classnames_1 = __importDefault(require("classnames"));
var ResizeHandleType;
(function (ResizeHandleType) {
    ResizeHandleType["Resize"] = "RESIZE";
    ResizeHandleType["ResizeWidth"] = "RESIZE_WIDTH";
    ResizeHandleType["ResizeHeight"] = "RESIZE_HEIGHT";
})(ResizeHandleType = exports.ResizeHandleType || (exports.ResizeHandleType = {}));
var ResizeHandle = function (props) {
    var _a, _b;
    var prefix = (0, hooks_1.usePrefix)('resize-handle');
    var designer = (0, hooks_1.useDesigner)();
    return (react_1.default.createElement("div", __assign({}, props, (_a = {}, _a[designer.props.screenResizeHandlerAttrName] = props.type, _a), { className: (0, classnames_1.default)(prefix, (_b = {},
            _b["".concat(prefix, "-").concat(props.type)] = !!props.type,
            _b)) }), props.children));
};
exports.ResizeHandle = ResizeHandle;
