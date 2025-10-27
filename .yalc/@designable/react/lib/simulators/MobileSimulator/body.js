"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileBody = void 0;
var reactive_react_1 = require("@formily/reactive-react");
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var MockupImages = {
    dark: [
        '//img.alicdn.com/imgextra/i3/O1CN01zXMc8W26oJZGUaCK1_!!6000000007708-55-tps-946-459.svg',
        '//img.alicdn.com/imgextra/i3/O1CN012KWk2i1DLduN7InSK_!!6000000000200-55-tps-459-945.svg',
    ],
    light: [
        '//img.alicdn.com/imgextra/i4/O1CN01vuXGe31tEy00v2xBx_!!6000000005871-55-tps-946-459.svg',
        '//img.alicdn.com/imgextra/i4/O1CN01ehfzMc1QPqY6HONTJ_!!6000000001969-55-tps-459-945.svg',
    ],
};
exports.MobileBody = (0, reactive_react_1.observer)(function (props) {
    var screen = (0, hooks_1.useScreen)();
    var theme = (0, hooks_1.useTheme)();
    var prefix = (0, hooks_1.usePrefix)('mobile-simulator-body');
    var getContentStyles = function () {
        if (screen.flip) {
            return {
                position: 'absolute',
                width: 736,
                height: 414,
                top: 43.3333,
                left: 106.667,
                overflow: 'hidden',
            };
        }
        return {
            position: 'absolute',
            width: 414,
            height: 736,
            top: 126.667,
            left: 23.3333,
            overflow: 'hidden',
        };
    };
    return (react_1.default.createElement("div", { className: prefix, style: {
            alignItems: screen.flip ? 'center' : '',
            minWidth: screen.flip ? 1000 : 0,
        } },
        react_1.default.createElement("div", { className: prefix + '-wrapper', style: {
                position: 'relative',
                minHeight: screen.flip ? 0 : 1000,
            } },
            react_1.default.createElement("img", { src: screen.flip ? MockupImages[theme][0] : MockupImages[theme][1], style: {
                    display: 'block',
                    margin: '20px 0',
                    width: screen.flip ? 946.667 : 460,
                    height: screen.flip ? 460 : 946.667,
                    boxShadow: '0 0 20px #0000004d',
                    borderRadius: 60,
                    backfaceVisibility: 'hidden',
                } }),
            react_1.default.createElement("div", { className: prefix + '-content', style: getContentStyles() }, props.children))));
});
exports.MobileBody.defaultProps = {};
