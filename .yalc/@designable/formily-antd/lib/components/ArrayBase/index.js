"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArrayBehavior = void 0;
var core_1 = require("@designable/core");
var Field_1 = require("../Field");
var schemas_1 = require("../../schemas");
var locales_1 = require("../../locales");
var createArrayBehavior = function (name) {
    return core_1.createBehavior({
        name: name,
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name; },
        designerProps: {
            droppable: true,
            propsSchema: Field_1.createFieldSchema(schemas_1.AllSchemas[name]),
        },
        designerLocales: locales_1.AllLocales[name],
    }, {
        name: name + ".Addition",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Addition"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: Field_1.createVoidFieldSchema(schemas_1.AllSchemas[name].Addition),
        },
        designerLocales: locales_1.AllLocales.ArrayAddition,
    }, {
        name: name + ".Remove",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Remove"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: Field_1.createVoidFieldSchema(),
        },
        designerLocales: locales_1.AllLocales.ArrayRemove,
    }, {
        name: name + ".Index",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Index"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: Field_1.createVoidFieldSchema(),
        },
        designerLocales: locales_1.AllLocales.ArrayIndex,
    }, {
        name: name + ".MoveUp",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".MoveUp"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: Field_1.createVoidFieldSchema(),
        },
        designerLocales: locales_1.AllLocales.ArrayMoveUp,
    }, {
        name: name + ".MoveDown",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".MoveDown"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === 'ArrayCards';
            },
            propsSchema: Field_1.createVoidFieldSchema(),
        },
        designerLocales: locales_1.AllLocales.ArrayMoveDown,
    });
};
exports.createArrayBehavior = createArrayBehavior;
