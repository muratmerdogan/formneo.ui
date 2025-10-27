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
exports.LoadTemplate = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@designable/react");
var LoadTemplate = function (props) {
    var _a;
    return (react_1.default.createElement(react_2.NodeActionsWidget, null, (_a = props.actions) === null || _a === void 0 ? void 0 : _a.map(function (action, key) {
        return react_1.default.createElement(react_2.NodeActionsWidget.Action, __assign({}, action, { key: key }));
    })));
};
exports.LoadTemplate = LoadTemplate;
