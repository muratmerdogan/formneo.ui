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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlineTreeNode = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
var reactive_1 = require("@formily/reactive");
var reactive_react_1 = require("@formily/reactive-react");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var NodeTitleWidget_1 = require("../NodeTitleWidget");
var context_1 = require("./context");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.OutlineTreeNode = (0, reactive_react_1.observer)(function (_a) {
    var _b, _c;
    var node = _a.node, className = _a.className, style = _a.style, workspaceId = _a.workspaceId;
    var prefix = (0, hooks_1.usePrefix)('outline-tree-node');
    var engine = (0, hooks_1.useDesigner)();
    var ref = (0, react_1.useRef)();
    var ctx = (0, react_1.useContext)(context_1.NodeContext);
    var request = (0, react_1.useRef)(null);
    var cursor = (0, hooks_1.useCursor)();
    var selection = (0, hooks_1.useSelection)(workspaceId);
    var moveHelper = (0, hooks_1.useMoveHelper)(workspaceId);
    (0, react_1.useEffect)(function () {
        return engine.subscribeTo(core_1.DragMoveEvent, function () {
            var _a;
            var closestNodeId = (_a = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.closestNode) === null || _a === void 0 ? void 0 : _a.id;
            var closestDirection = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.outlineClosestDirection;
            var id = node.id;
            if (!ref.current)
                return;
            if (closestNodeId === id &&
                closestDirection === core_1.ClosestPosition.Inner) {
                if (!ref.current.classList.contains('droppable')) {
                    ref.current.classList.add('droppable');
                }
                if (!ref.current.classList.contains('expanded')) {
                    if (request.current) {
                        clearTimeout(request.current);
                        request.current = null;
                    }
                    request.current = setTimeout(function () {
                        ref.current.classList.add('expanded');
                    }, 600);
                }
            }
            else {
                if (request.current) {
                    clearTimeout(request.current);
                    request.current = null;
                }
                if (ref.current.classList.contains('droppable')) {
                    ref.current.classList.remove('droppable');
                }
            }
        });
    }, [node, moveHelper, cursor]);
    (0, react_1.useEffect)(function () {
        return (0, reactive_1.autorun)(function () {
            var _a;
            var selectedIds = (selection === null || selection === void 0 ? void 0 : selection.selected) || [];
            var id = node.id;
            if (!ref.current)
                return;
            if (selectedIds.includes(id)) {
                if (!ref.current.classList.contains('selected')) {
                    ref.current.classList.add('selected');
                }
            }
            else {
                if (ref.current.classList.contains('selected')) {
                    ref.current.classList.remove('selected');
                }
            }
            if (cursor.status === core_1.CursorStatus.Dragging &&
                ((_a = moveHelper === null || moveHelper === void 0 ? void 0 : moveHelper.dragNodes) === null || _a === void 0 ? void 0 : _a.length)) {
                if (ref.current.classList.contains('selected')) {
                    ref.current.classList.remove('selected');
                }
            }
        });
    }, [node, selection, moveHelper]);
    if (!node)
        return null;
    var renderIcon = function (node) {
        var _a;
        var icon = node.designerProps.icon;
        if (icon) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: icon, size: 12 });
        }
        if (node === (node === null || node === void 0 ? void 0 : node.root)) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Page", size: 12 });
        }
        else if ((_a = node.designerProps) === null || _a === void 0 ? void 0 : _a.droppable) {
            return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Container", size: 12 });
        }
        return react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Component", size: 12 });
    };
    var renderTitle = function (node) {
        if ((0, shared_1.isFn)(ctx.renderTitle))
            return ctx.renderTitle(node);
        return (react_1.default.createElement("span", null,
            react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: node })));
    };
    var renderActions = function (node) {
        if ((0, shared_1.isFn)(ctx.renderActions))
            return ctx.renderActions(node);
    };
    return (react_1.default.createElement("div", { style: style, ref: ref, className: (0, classnames_1.default)(prefix, className, 'expanded'), "data-designer-outline-node-id": node.id },
        react_1.default.createElement("div", { className: prefix + '-header' },
            react_1.default.createElement("div", { className: prefix + '-header-head', style: {
                    left: -node.depth * 16,
                    width: node.depth * 16,
                } }),
            react_1.default.createElement("div", { className: prefix + '-header-content' },
                react_1.default.createElement("div", { className: prefix + '-header-base' },
                    (((_b = node === null || node === void 0 ? void 0 : node.children) === null || _b === void 0 ? void 0 : _b.length) > 0 || node === node.root) && (react_1.default.createElement("div", { className: prefix + '-expand', onClick: function (e) {
                            var _a, _b, _c, _d;
                            e.preventDefault();
                            e.stopPropagation();
                            if ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains('expanded')) {
                                (_c = ref.current) === null || _c === void 0 ? void 0 : _c.classList.remove('expanded');
                            }
                            else {
                                (_d = ref.current) === null || _d === void 0 ? void 0 : _d.classList.add('expanded');
                            }
                        } },
                        react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Expand", size: 10 }))),
                    react_1.default.createElement("div", { className: prefix + '-icon' }, renderIcon(node)),
                    react_1.default.createElement("div", { className: prefix + '-title' }, renderTitle(node))),
                react_1.default.createElement("div", { className: prefix + '-header-actions', "data-click-stop-propagation": true },
                    renderActions(node),
                    node !== node.root && (react_1.default.createElement(IconWidget_1.IconWidget, { className: (0, classnames_1.default)(prefix + '-hidden-icon', {
                            hidden: node.hidden,
                        }), infer: node.hidden ? 'EyeClose' : 'Eye', size: 14, onClick: function () {
                            node.hidden = !node.hidden;
                        } }))))),
        react_1.default.createElement("div", { className: prefix + '-children' }, (_c = node.children) === null || _c === void 0 ? void 0 : _c.map(function (child) {
            return (react_1.default.createElement(exports.OutlineTreeNode, { node: child, key: child.id, workspaceId: workspaceId }));
        }))));
});
