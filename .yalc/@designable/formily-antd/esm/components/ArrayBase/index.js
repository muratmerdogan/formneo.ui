import { createBehavior } from '@designable/core';
import { createFieldSchema, createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export var createArrayBehavior = function (name) {
    return createBehavior({
        name: name,
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name; },
        designerProps: {
            droppable: true,
            propsSchema: createFieldSchema(AllSchemas[name]),
        },
        designerLocales: AllLocales[name],
    }, {
        name: name + ".Addition",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Addition"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: createVoidFieldSchema(AllSchemas[name].Addition),
        },
        designerLocales: AllLocales.ArrayAddition,
    }, {
        name: name + ".Remove",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Remove"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: createVoidFieldSchema(),
        },
        designerLocales: AllLocales.ArrayRemove,
    }, {
        name: name + ".Index",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".Index"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: createVoidFieldSchema(),
        },
        designerLocales: AllLocales.ArrayIndex,
    }, {
        name: name + ".MoveUp",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".MoveUp"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === name;
            },
            propsSchema: createVoidFieldSchema(),
        },
        designerLocales: AllLocales.ArrayMoveUp,
    }, {
        name: name + ".MoveDown",
        extends: ['Field'],
        selector: function (node) { return node.props['x-component'] === name + ".MoveDown"; },
        designerProps: {
            allowDrop: function (parent) {
                return parent.props['x-component'] === 'ArrayCards';
            },
            propsSchema: createVoidFieldSchema(),
        },
        designerLocales: AllLocales.ArrayMoveDown,
    });
};
