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
exports.ViewPanel = void 0;
var react_1 = __importStar(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../hooks");
var containers_1 = require("../containers");
var shared_1 = require("@designable/shared");
exports.ViewPanel = (0, reactive_react_1.observer)(function (props) {
    var _a = __read((0, react_1.useState)(true), 2), visible = _a[0], setVisible = _a[1];
    var workbench = (0, hooks_1.useWorkbench)();
    var tree = (0, hooks_1.useTree)();
    (0, react_1.useEffect)(function () {
        if (workbench.type === props.type) {
            (0, shared_1.requestIdle)(function () {
                requestAnimationFrame(function () {
                    setVisible(true);
                });
            });
        }
        else {
            setVisible(false);
        }
    }, [workbench.type]);
    if (workbench.type !== props.type)
        return null;
    var render = function () {
        return props.children(tree, function (payload) {
            tree.from(payload);
            tree.takeSnapshot();
        });
    };
    if (workbench.type === 'DESIGNABLE')
        return (react_1.default.createElement(containers_1.Viewport, { dragTipsDirection: props.dragTipsDirection }, render()));
    return (react_1.default.createElement("div", { style: {
            overflow: props.scrollable ? 'overlay' : 'hidden',
            height: '100%',
            cursor: 'auto',
            userSelect: 'text',
        } }, visible && render()));
});
exports.ViewPanel.defaultProps = {
    scrollable: true,
};
