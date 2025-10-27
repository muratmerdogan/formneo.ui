"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var NodeTitleWidget_1 = require("../NodeTitleWidget");
var antd_1 = require("antd");
var reactive_react_1 = require("@formily/reactive-react");
var useMouseHover = function (ref, enter, leave) {
    (0, react_1.useEffect)(function () {
        var timer = null;
        var unmounted = false;
        var onMouseOver = function (e) {
            var target = e.target;
            clearTimeout(timer);
            timer = setTimeout(function () {
                var _a;
                if (unmounted)
                    return;
                if ((_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.contains(target)) {
                    enter && enter();
                }
                else {
                    leave && leave();
                }
            }, 100);
        };
        document.addEventListener('mouseover', onMouseOver);
        return function () {
            unmounted = true;
            document.removeEventListener('mouseover', onMouseOver);
        };
    }, []);
};
exports.Selector = (0, reactive_react_1.observer)(function (_a) {
    var node = _a.node;
    var hover = (0, hooks_1.useHover)();
    var _b = __read((0, react_1.useState)(false), 2), expand = _b[0], setExpand = _b[1];
    var ref = (0, react_1.useRef)(null);
    var selection = (0, hooks_1.useSelection)();
    var prefix = (0, hooks_1.usePrefix)('aux-selector');
    var renderIcon = function (node) {
        var _a;
        var icon = node.designerProps.icon;
        if (icon) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: icon });
        }
        if (node === node.root) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Page" });
        }
        else if ((_a = node.designerProps) === null || _a === void 0 ? void 0 : _a.droppable) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Container" });
        }
        return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Component" });
    };
    var renderMenu = function () {
        var parents = node.getParents();
        return (react_1.default.createElement("div", { className: prefix + '-menu', style: {
                position: 'absolute',
                top: '100%',
                left: 0,
            } }, parents.slice(0, 4).map(function (parent) {
            return (react_1.default.createElement(antd_1.Button, { key: parent.id, type: "primary", onClick: function () {
                    selection.select(parent.id);
                }, onMouseEnter: function () {
                    hover.setHover(parent);
                } },
                renderIcon(parent),
                react_1.default.createElement("span", { style: { transform: 'scale(0.85)', marginLeft: 2 } },
                    react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: parent }))));
        })));
    };
    useMouseHover(ref, function () {
        setExpand(true);
    }, function () {
        setExpand(false);
    });
    return (react_1.default.createElement("div", { ref: ref, className: prefix },
        react_1.default.createElement(antd_1.Button, { className: prefix + '-title', type: "primary", onMouseEnter: function () {
                hover.setHover(node);
            } },
            renderIcon(node),
            react_1.default.createElement("span", null,
                react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: node }))),
        expand && renderMenu()));
});
exports.Selector.displayName = 'Selector';
