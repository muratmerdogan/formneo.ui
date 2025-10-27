"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@designable/core");
var icons_1 = __importDefault(require("./icons"));
var panels_1 = __importDefault(require("./panels"));
var global_1 = __importDefault(require("./global"));
var operations_1 = __importDefault(require("./operations"));
core_1.GlobalRegistry.registerDesignerLocales(icons_1.default, panels_1.default, global_1.default, operations_1.default);
