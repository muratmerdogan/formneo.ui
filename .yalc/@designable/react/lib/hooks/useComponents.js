"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComponents = void 0;
var react_1 = require("react");
var context_1 = require("../context");
var useComponents = function () { return (0, react_1.useContext)(context_1.DesignerComponentsContext); };
exports.useComponents = useComponents;
