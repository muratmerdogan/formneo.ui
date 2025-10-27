"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsureTypeItemsNode = exports.createNodeId = exports.matchArrayItemsNode = exports.hasNodeByComponentPath = exports.findNodeByComponentPath = exports.queryNodesByComponentPath = exports.includesComponent = exports.matchChildComponent = exports.matchComponent = void 0;
var core_1 = require("@designable/core");
var matchComponent = function (node, name, context) {
    var _a;
    if (name === '*')
        return true;
    var componentName = (_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a['x-component'];
    if (typeof name === 'function')
        return name(componentName || '', node, context);
    if (Array.isArray(name))
        return name.includes(componentName);
    return componentName === name;
};
exports.matchComponent = matchComponent;
var matchChildComponent = function (node, name, context) {
    var _a;
    if (name === '*')
        return true;
    var componentName = (_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a['x-component'];
    if (!componentName)
        return false;
    if (typeof name === 'function')
        return name(componentName || '', node, context);
    if (Array.isArray(name))
        return name.includes(componentName);
    return componentName.indexOf(name + ".") > -1;
};
exports.matchChildComponent = matchChildComponent;
var includesComponent = function (node, names, target) {
    return names.some(function (name) { return exports.matchComponent(node, name, target); });
};
exports.includesComponent = includesComponent;
var queryNodesByComponentPath = function (node, path) {
    if ((path === null || path === void 0 ? void 0 : path.length) === 0)
        return [];
    if ((path === null || path === void 0 ? void 0 : path.length) === 1) {
        if (exports.matchComponent(node, path[0])) {
            return [node];
        }
    }
    return exports.matchComponent(node, path[0])
        ? node.children.reduce(function (buf, child) {
            return buf.concat(exports.queryNodesByComponentPath(child, path.slice(1)));
        }, [])
        : [];
};
exports.queryNodesByComponentPath = queryNodesByComponentPath;
var findNodeByComponentPath = function (node, path) {
    if ((path === null || path === void 0 ? void 0 : path.length) === 0)
        return;
    if ((path === null || path === void 0 ? void 0 : path.length) === 1) {
        if (exports.matchComponent(node, path[0])) {
            return node;
        }
    }
    if (exports.matchComponent(node, path[0])) {
        for (var i = 0; i < node.children.length; i++) {
            var next = exports.findNodeByComponentPath(node.children[i], path.slice(1));
            if (next) {
                return next;
            }
        }
    }
};
exports.findNodeByComponentPath = findNodeByComponentPath;
var hasNodeByComponentPath = function (node, path) { return !!exports.findNodeByComponentPath(node, path); };
exports.hasNodeByComponentPath = hasNodeByComponentPath;
var matchArrayItemsNode = function (node) {
    var _a, _b, _c, _d;
    return (((_b = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.type) === 'array' &&
        ((_d = (_c = node === null || node === void 0 ? void 0 : node.parent) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d[0]) === node);
};
exports.matchArrayItemsNode = matchArrayItemsNode;
var createNodeId = function (designer, id) {
    var _a;
    return _a = {},
        _a[designer.props.nodeIdAttrName] = id,
        _a;
};
exports.createNodeId = createNodeId;
var createEnsureTypeItemsNode = function (type) { return function (node) {
    var objectNode = node.children.find(function (child) { return child.props['type'] === type; });
    if (objectNode) {
        return objectNode;
    }
    else {
        var newObjectNode = new core_1.TreeNode({
            componentName: 'Field',
            props: {
                type: type,
            },
        });
        node.prepend(newObjectNode);
        return newObjectNode;
    }
}; };
exports.createEnsureTypeItemsNode = createEnsureTypeItemsNode;
