var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useContext } from 'react';
import { Input, Upload } from 'antd';
import { usePrefix, IconWidget } from '@designable/react';
import { SettingsFormContext } from '../../shared/context';
import cls from 'classnames';
import './styles.less';
export var ImageInput = function (_a) {
    var className = _a.className, style = _a.style, props = __rest(_a, ["className", "style"]);
    var prefix = usePrefix('image-input');
    var context = useContext(SettingsFormContext);
    return (React.createElement("div", { className: cls(prefix, className), style: style },
        React.createElement(Input, __assign({}, props, { onChange: function (e) {
                var _a, _b;
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = e === null || e === void 0 ? void 0 : e.target) === null || _b === void 0 ? void 0 : _b['value']);
            }, prefix: React.createElement(Upload, { action: context.uploadAction, itemRender: function () { return null; }, maxCount: 1, onChange: function (params) {
                    var _a, _b;
                    var response = (_a = params.file) === null || _a === void 0 ? void 0 : _a.response;
                    var url = (response === null || response === void 0 ? void 0 : response.url) ||
                        (response === null || response === void 0 ? void 0 : response.downloadURL) ||
                        (response === null || response === void 0 ? void 0 : response.imageURL) ||
                        (response === null || response === void 0 ? void 0 : response.thumbUrl);
                    if (!url)
                        return;
                    (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, url);
                } },
                React.createElement(IconWidget, { infer: "CloudUpload", style: { cursor: 'pointer' } })) }))));
};
export var BackgroundImageInput = function (props) {
    var addBgValue = function (value) {
        if (/url\([^)]+\)/.test(value)) {
            return value;
        }
        return "url(".concat(value, ")");
    };
    var removeBgValue = function (value) {
        var matched = String(value).match(/url\(\s*([^)]+)\s*\)/);
        if (matched === null || matched === void 0 ? void 0 : matched[1]) {
            return matched === null || matched === void 0 ? void 0 : matched[1];
        }
        return value;
    };
    return (React.createElement(ImageInput, { value: removeBgValue(props.value), onChange: function (url) {
            var _a;
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, addBgValue(url));
        } }));
};
