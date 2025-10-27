"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
var core_1 = require("@designable/core");
var Input_1 = require("./Input");
exports.Password = core_1.createLocales(Input_1.Input, {
    'zh-CN': {
        title: '密码输入',
    },
    'en-US': {
        title: 'Password',
    },
    'ko-KR': {
        title: '비밀번호',
    },
});
