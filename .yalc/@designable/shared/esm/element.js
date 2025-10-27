var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { Point } from './coordinate';
var InlineLayoutTagNames = new Set([
    'A',
    'ABBR',
    'ACRONYM',
    'AUDIO',
    'B',
    'BDI',
    'BDO',
    'BIG',
    'BR',
    'BUTTON',
    'CANVAS',
    'CITE',
    'CODE',
    'DATA',
    'DATALIST',
    'DEL',
    'DFN',
    'EM',
    'EMBED',
    'I',
    'IFRAME',
    'IMG',
    'INS',
    'KBD',
    'LABEL',
    'MAP',
    'MARK',
    'METER',
    'NOSCRIPT',
    'OBJECT',
    'OUTPUT',
    'PICTURE',
    'PROGRESS',
    'Q',
    'RUBY',
    'S',
    'SAMP',
    'SELECT',
    'SLOT',
    'SMALL',
    'STRONG',
    'SUB',
    'SUP',
    'SVG',
    'TEMPLATE',
    'TEXTAREA',
    'TIME',
    'U',
    'TT',
    'VAR',
    'VIDEO',
    'WBR',
    'INPUT',
    'SPAN',
]);
export var calcElementOuterWidth = function (innerWidth, style) {
    return (innerWidth +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight) +
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth));
};
export var calcElementLayout = function (element) {
    if (!element)
        return 'vertical';
    var parent = element.parentElement;
    if (!parent)
        return 'vertical';
    var tagName = element.tagName;
    var parentTagName = parent.tagName;
    var style = getComputedStyle(element);
    var parentStyle = getComputedStyle(parent);
    var isNotFullWidth = function () {
        var innerWidth = element.getBoundingClientRect().width;
        var outerWidth = calcElementOuterWidth(innerWidth, style);
        var parentInnerWidth = parent.getBoundingClientRect().width;
        return outerWidth.toFixed(0) < parentInnerWidth.toFixed(0);
    };
    if (tagName === 'TH' || tagName === 'TD') {
        if (parentTagName === 'TR')
            return 'horizontal';
    }
    if (parentStyle.display === 'flex' && parentStyle.flexDirection === 'row')
        return 'horizontal';
    if (parentStyle.display === 'grid') {
        if (isNotFullWidth()) {
            return 'horizontal';
        }
    }
    if (InlineLayoutTagNames.has(tagName)) {
        if (style.display === 'block') {
            if (style.float === 'left' || style.float === 'right') {
                if (isNotFullWidth()) {
                    return 'horizontal';
                }
            }
            return 'vertical';
        }
        return 'horizontal';
    }
};
export var calcElementTranslate = function (element) {
    var _a, _b, _c;
    var transform = (_a = element === null || element === void 0 ? void 0 : element.style) === null || _a === void 0 ? void 0 : _a.transform;
    if (transform) {
        var _d = __read((_c = (_b = transform
            .match(/translate(?:3d)?\(\s*([-\d.]+)[a-z]+?[\s,]+([-\d.]+)[a-z]+?(?:[\s,]+([-\d.]+))?[a-z]+?\s*\)/)) === null || _b === void 0 ? void 0 : _b.slice(1, 3)) !== null && _c !== void 0 ? _c : [0, 0], 2), x = _d[0], y = _d[1];
        return new Point(Number(x), Number(y));
    }
    else {
        return new Point(Number(element.offsetLeft), Number(element.offsetTop));
    }
};
export var calcElementRotate = function (element) {
    var _a, _b, _c;
    var transform = (_a = element === null || element === void 0 ? void 0 : element.style) === null || _a === void 0 ? void 0 : _a.transform;
    if (transform) {
        return Number((_c = (_b = transform.match(/rotate\(\s*([-\d.]+)/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 0);
    }
    else {
        return 0;
    }
};
export var calcElementScale = function (element) {
    var _a, _b, _c;
    var transform = (_a = element === null || element === void 0 ? void 0 : element.style) === null || _a === void 0 ? void 0 : _a.transform;
    if (transform) {
        return Number((_c = (_b = transform.match(/scale\(\s*([-\d.]+)/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 0);
    }
    else {
        return 0;
    }
};
