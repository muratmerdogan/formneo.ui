"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLayout = void 0;
var react_1 = require("react");
var context_1 = require("../context");
var shared_1 = require("@designable/shared");
var useLayout = function () {
    return (shared_1.globalThisPolyfill['__DESIGNABLE_LAYOUT__'] ||
        (0, react_1.useContext)(context_1.DesignerLayoutContext));
};
exports.useLayout = useLayout;
