"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNpmCDNRegistry = exports.setNpmCDNRegistry = void 0;
var loader_1 = __importDefault(require("@monaco-editor/loader"));
var Registry = {
    cdn: '//cdn.jsdelivr.net/npm',
};
var setNpmCDNRegistry = function (registry) {
    Registry.cdn = registry;
    loader_1.default.config({
        paths: {
            vs: "".concat(registry, "/monaco-editor@0.30.1/min/vs"),
        },
    });
};
exports.setNpmCDNRegistry = setNpmCDNRegistry;
var getNpmCDNRegistry = function () { return String(Registry.cdn).replace(/\/$/, ''); };
exports.getNpmCDNRegistry = getNpmCDNRegistry;
