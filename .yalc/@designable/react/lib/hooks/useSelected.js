"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelected = void 0;
var useSelection_1 = require("./useSelection");
var useSelected = function (workspaceId) {
    var selection = (0, useSelection_1.useSelection)(workspaceId);
    return (selection === null || selection === void 0 ? void 0 : selection.selected) || [];
};
exports.useSelected = useSelected;
