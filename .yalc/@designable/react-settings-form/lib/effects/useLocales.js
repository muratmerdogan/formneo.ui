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
exports.useLocales = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@formily/core");
var core_2 = require("@designable/core");
var shared_1 = require("@designable/shared");
var react_2 = require("@designable/react");
var takeIcon = function (message) {
    if (!(0, shared_1.isStr)(message))
        return;
    var matched = message.match(/@([^:\s]+)(?:\s*\:\s*([\s\S]+))?/);
    if (matched)
        return [matched[1], matched[2]];
    return;
};
var mapEnum = function (dataSource) { return function (item, index) {
    var _a, _b, _c;
    var label = dataSource[index] || dataSource[item.value] || item.label;
    var icon = takeIcon(label);
    return __assign(__assign({}, item), { value: (_a = item === null || item === void 0 ? void 0 : item.value) !== null && _a !== void 0 ? _a : null, label: icon ? (react_1.default.createElement(react_2.IconWidget, { infer: icon[0], tooltip: icon[1] })) : ((_c = (_b = label === null || label === void 0 ? void 0 : label.label) !== null && _b !== void 0 ? _b : label) !== null && _c !== void 0 ? _c : 'Unknow') });
}; };
var useLocales = function (node) {
    (0, core_1.onFieldReact)('*', function (field) {
        var _a, _b;
        var path = field.path.toString().replace(/\.[\d+]/g, '');
        var takeMessage = function (prop) {
            var token = "settings.".concat(path).concat(prop ? ".".concat(prop) : '');
            return node.getMessage(token) || core_2.GlobalRegistry.getDesignerMessage(token);
        };
        var title = takeMessage('title') || takeMessage();
        var description = takeMessage('description');
        var tooltip = takeMessage('tooltip');
        var dataSource = takeMessage('dataSource');
        var placeholder = takeMessage('placeholder');
        if (title) {
            field.title = title;
        }
        if (description) {
            field.description = description;
        }
        if (tooltip) {
            field.decorator[1] = field.decorator[1] || [];
            field.decorator[1].tooltip = tooltip;
        }
        if (placeholder) {
            field.component[1] = field.component[1] || [];
            field.component[1].placeholder = placeholder;
        }
        if (!(0, core_1.isVoidField)(field)) {
            if (dataSource === null || dataSource === void 0 ? void 0 : dataSource.length) {
                if ((_a = field.dataSource) === null || _a === void 0 ? void 0 : _a.length) {
                    field.dataSource = field.dataSource.map(mapEnum(dataSource));
                }
                else {
                    field.dataSource = dataSource.slice();
                }
            }
            else {
                field.dataSource = (_b = field.dataSource) === null || _b === void 0 ? void 0 : _b.filter(Boolean);
            }
        }
    });
};
exports.useLocales = useLocales;
