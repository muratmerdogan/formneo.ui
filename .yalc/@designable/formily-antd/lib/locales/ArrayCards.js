"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCards = void 0;
var core_1 = require("@designable/core");
var Card_1 = require("./Card");
exports.ArrayCards = core_1.createLocales(Card_1.Card, {
    'zh-CN': {
        title: '自增卡片',
        addIndex: '添加索引',
        addOperation: '添加操作',
    },
    'en-US': {
        title: 'Array Cards',
        addIndex: 'Add Index',
        addOperation: 'Add Operations',
    },
    'ko-KR': {
        title: '배열 카드',
        addIndex: '색인 추가',
        addOperation: '작업 추가',
    },
});
