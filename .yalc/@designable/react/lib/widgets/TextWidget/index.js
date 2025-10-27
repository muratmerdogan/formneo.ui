"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextWidget = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@designable/shared");
var core_1 = require("@designable/core");
var reactive_react_1 = require("@formily/reactive-react");
exports.TextWidget = (0, reactive_react_1.observer)(function (props) {
    var takeLocale = function (message) {
        if ((0, shared_1.isStr)(message))
            return message;
        if ((0, shared_1.isPlainObj)(message)) {
            var lang = core_1.GlobalRegistry.getDesignerLanguage();
            for (var key in message) {
                if (key.toLocaleLowerCase() === lang)
                    return message[key];
            }
            return;
        }
        return message;
    };
    var takeMessage = function (token) {
        if (!token)
            return;
        var message = (0, shared_1.isStr)(token)
            ? core_1.GlobalRegistry.getDesignerMessage(token)
            : token;
        if (message)
            return takeLocale(message);
        return token;
    };
    return (react_1.default.createElement(react_1.Fragment, null, takeMessage(props.children) ||
        takeMessage(props.token) ||
        takeMessage(props.defaultMessage)));
});
