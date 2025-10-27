"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@designable/core");
var zh_CN_1 = __importDefault(require("./zh-CN"));
var en_US_1 = __importDefault(require("./en-US"));
var ko_KR_1 = __importDefault(require("./ko-KR"));
core_1.GlobalRegistry.registerDesignerLocales(zh_CN_1.default, en_US_1.default, ko_KR_1.default);
