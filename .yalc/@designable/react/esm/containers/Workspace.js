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
import React, { useMemo, useRef, Fragment } from 'react';
import { useDesigner } from '../hooks';
import { WorkspaceContext } from '../context';
export var Workspace = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, props = __rest(_a, ["id", "title", "description"]);
    var oldId = useRef();
    var designer = useDesigner();
    var workspace = useMemo(function () {
        if (!designer)
            return;
        if (oldId.current && oldId.current !== id) {
            var old = designer.workbench.findWorkspaceById(oldId.current);
            if (old)
                old.viewport.detachEvents();
        }
        var workspace = {
            id: id || 'index',
            title: title,
            description: description,
        };
        designer.workbench.ensureWorkspace(workspace);
        oldId.current = workspace.id;
        return workspace;
    }, [id, designer]);
    return (React.createElement(Fragment, null,
        React.createElement(WorkspaceContext.Provider, { value: workspace }, props.children)));
};
