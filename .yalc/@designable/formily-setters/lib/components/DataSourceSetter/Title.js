"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
var react_1 = __importDefault(require("react"));
var shared_1 = require("@formily/shared");
var reactive_react_1 = require("@formily/reactive-react");
var react_2 = require("@designable/react");
var shared_2 = require("./shared");
require("./styles.less");
exports.Title = (0, reactive_react_1.observer)(function (props) {
    var prefix = (0, react_2.usePrefix)('data-source-setter-node-title');
    var getTitleValue = function (dataSource) {
        var optionalKeys = ['label', 'title', 'header'];
        var nodeTitle;
        optionalKeys.some(function (key) {
            var _a;
            var title = (_a = (0, shared_1.toArr)(dataSource).find(function (item) { return item.label === key; })) === null || _a === void 0 ? void 0 : _a.value;
            if (title !== undefined) {
                nodeTitle = title;
                return true;
            }
            return false;
        });
        if (nodeTitle === undefined) {
            (0, shared_1.toArr)(dataSource || []).some(function (item) {
                if (item.value && typeof item.value === 'string') {
                    nodeTitle = item.value;
                    return true;
                }
                return false;
            });
        }
        return nodeTitle;
    };
    var renderTitle = function (dataSource) {
        var nodeTitle = getTitleValue(dataSource);
        if (nodeTitle === undefined)
            return (react_1.default.createElement(react_2.TextWidget, { token: "SettingComponents.DataSourceSetter.defaultTitle" }));
        else
            return nodeTitle + '';
    };
    return (react_1.default.createElement("div", { className: prefix },
        react_1.default.createElement("span", { style: { marginRight: '5px' } }, renderTitle((props === null || props === void 0 ? void 0 : props.map) || [])),
        react_1.default.createElement(react_2.IconWidget, { className: prefix + '-icon', infer: "Remove", onClick: function () {
                var _a;
                var newDataSource = (0, shared_1.clone)((_a = props === null || props === void 0 ? void 0 : props.treeDataSource) === null || _a === void 0 ? void 0 : _a.dataSource);
                (0, shared_2.traverseTree)(newDataSource || [], function (dataItem, i, data) {
                    if (data[i].key === props.duplicateKey)
                        (0, shared_1.toArr)(data).splice(i, 1);
                });
                props.treeDataSource.dataSource = newDataSource;
            } })));
});
