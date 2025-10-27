import { TreeNode } from '@designable/core';
export var matchComponent = function (node, name, context) {
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
export var matchChildComponent = function (node, name, context) {
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
export var includesComponent = function (node, names, target) {
    return names.some(function (name) { return matchComponent(node, name, target); });
};
export var queryNodesByComponentPath = function (node, path) {
    if ((path === null || path === void 0 ? void 0 : path.length) === 0)
        return [];
    if ((path === null || path === void 0 ? void 0 : path.length) === 1) {
        if (matchComponent(node, path[0])) {
            return [node];
        }
    }
    return matchComponent(node, path[0])
        ? node.children.reduce(function (buf, child) {
            return buf.concat(queryNodesByComponentPath(child, path.slice(1)));
        }, [])
        : [];
};
export var findNodeByComponentPath = function (node, path) {
    if ((path === null || path === void 0 ? void 0 : path.length) === 0)
        return;
    if ((path === null || path === void 0 ? void 0 : path.length) === 1) {
        if (matchComponent(node, path[0])) {
            return node;
        }
    }
    if (matchComponent(node, path[0])) {
        for (var i = 0; i < node.children.length; i++) {
            var next = findNodeByComponentPath(node.children[i], path.slice(1));
            if (next) {
                return next;
            }
        }
    }
};
export var hasNodeByComponentPath = function (node, path) { return !!findNodeByComponentPath(node, path); };
export var matchArrayItemsNode = function (node) {
    var _a, _b, _c, _d;
    return (((_b = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.type) === 'array' &&
        ((_d = (_c = node === null || node === void 0 ? void 0 : node.parent) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d[0]) === node);
};
export var createNodeId = function (designer, id) {
    var _a;
    return _a = {},
        _a[designer.props.nodeIdAttrName] = id,
        _a;
};
export var createEnsureTypeItemsNode = function (type) { return function (node) {
    var objectNode = node.children.find(function (child) { return child.props['type'] === type; });
    if (objectNode) {
        return objectNode;
    }
    else {
        var newObjectNode = new TreeNode({
            componentName: 'Field',
            props: {
                type: type,
            },
        });
        node.prepend(newObjectNode);
        return newObjectNode;
    }
}; };
