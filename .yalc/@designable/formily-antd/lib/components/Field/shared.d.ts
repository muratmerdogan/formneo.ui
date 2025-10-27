/// <reference types="react" />
import { ISchema } from '@formily/json-schema';
export declare const createComponentSchema: (component: ISchema, decorator: ISchema) => {
    'component-group': {
        type: string;
        'x-component': string;
        'x-reactions': {
            fulfill: {
                state: {
                    visible: string;
                };
            };
        };
        properties: {
            'x-component-props': import("@formily/json-schema").Stringify<{
                version?: string;
                name?: import("react").ReactText;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import("@formily/json-schema").SchemaTypes;
                enum?: import("@formily/json-schema").SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import("@formily/json-schema").Stringify<any>;
                patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                additionalProperties?: import("@formily/json-schema").Stringify<any>;
                "x-value"?: any;
                "x-index"?: number;
                "x-pattern"?: any;
                "x-display"?: any;
                "x-validator"?: any;
                "x-decorator"?: any;
                "x-decorator-props"?: any;
                "x-component"?: any;
                "x-component-props"?: any;
                "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                "x-content"?: any;
                "x-data"?: any;
                "x-visible"?: boolean;
                "x-hidden"?: boolean;
                "x-disabled"?: boolean;
                "x-editable"?: boolean;
                "x-read-only"?: boolean;
                "x-read-pretty"?: boolean;
            }>;
        };
    };
    'decorator-group': {
        type: string;
        'x-component': string;
        'x-component-props': {
            defaultExpand: boolean;
        };
        'x-reactions': {
            fulfill: {
                state: {
                    visible: string;
                };
            };
        };
        properties: {
            'x-decorator-props': import("@formily/json-schema").Stringify<{
                version?: string;
                name?: import("react").ReactText;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import("@formily/json-schema").SchemaTypes;
                enum?: import("@formily/json-schema").SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import("@formily/json-schema").Stringify<any>;
                patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                additionalProperties?: import("@formily/json-schema").Stringify<any>;
                "x-value"?: any;
                "x-index"?: number;
                "x-pattern"?: any;
                "x-display"?: any;
                "x-validator"?: any;
                "x-decorator"?: any;
                "x-decorator-props"?: any;
                "x-component"?: any;
                "x-component-props"?: any;
                "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                "x-content"?: any;
                "x-data"?: any;
                "x-visible"?: boolean;
                "x-hidden"?: boolean;
                "x-disabled"?: boolean;
                "x-editable"?: boolean;
                "x-read-only"?: boolean;
                "x-read-pretty"?: boolean;
            }>;
        };
    };
    'component-style-group': {
        type: string;
        'x-component': string;
        'x-component-props': {
            defaultExpand: boolean;
        };
        'x-reactions': {
            fulfill: {
                state: {
                    visible: string;
                };
            };
        };
        properties: {
            'x-component-props.style': import("@formily/json-schema").Stringify<{
                version?: string;
                name?: import("react").ReactText;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import("@formily/json-schema").SchemaTypes;
                enum?: import("@formily/json-schema").SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import("@formily/json-schema").Stringify<any>;
                patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                additionalProperties?: import("@formily/json-schema").Stringify<any>;
                "x-value"?: any;
                "x-index"?: number;
                "x-pattern"?: any;
                "x-display"?: any;
                "x-validator"?: any;
                "x-decorator"?: any;
                "x-decorator-props"?: any;
                "x-component"?: any;
                "x-component-props"?: any;
                "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                "x-content"?: any;
                "x-data"?: any;
                "x-visible"?: boolean;
                "x-hidden"?: boolean;
                "x-disabled"?: boolean;
                "x-editable"?: boolean;
                "x-read-only"?: boolean;
                "x-read-pretty"?: boolean;
            }>;
        };
    };
    'decorator-style-group': {
        type: string;
        'x-component': string;
        'x-component-props': {
            defaultExpand: boolean;
        };
        'x-reactions': {
            fulfill: {
                state: {
                    visible: string;
                };
            };
        };
        properties: {
            'x-decorator-props.style': import("@formily/json-schema").Stringify<{
                version?: string;
                name?: import("react").ReactText;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import("@formily/json-schema").SchemaTypes;
                enum?: import("@formily/json-schema").SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import("@formily/json-schema").Stringify<any>;
                patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                additionalProperties?: import("@formily/json-schema").Stringify<any>;
                "x-value"?: any;
                "x-index"?: number;
                "x-pattern"?: any;
                "x-display"?: any;
                "x-validator"?: any;
                "x-decorator"?: any;
                "x-decorator-props"?: any;
                "x-component"?: any;
                "x-component-props"?: any;
                "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                "x-content"?: any;
                "x-data"?: any;
                "x-visible"?: boolean;
                "x-hidden"?: boolean;
                "x-disabled"?: boolean;
                "x-editable"?: boolean;
                "x-read-only"?: boolean;
                "x-read-pretty"?: boolean;
            }>;
        };
    };
};
export declare const createFieldSchema: (component?: ISchema, decorator?: ISchema) => ISchema;
export declare const createVoidFieldSchema: (component?: ISchema, decorator?: ISchema) => {
    type: string;
    properties: {
        'component-group': {
            type: string;
            'x-component': string;
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            };
            properties: {
                'x-component-props': import("@formily/json-schema").Stringify<{
                    version?: string;
                    name?: import("react").ReactText;
                    title?: any;
                    description?: any;
                    default?: any;
                    readOnly?: boolean;
                    writeOnly?: boolean;
                    type?: import("@formily/json-schema").SchemaTypes;
                    enum?: import("@formily/json-schema").SchemaEnum<any>;
                    const?: any;
                    multipleOf?: number;
                    maximum?: number;
                    exclusiveMaximum?: number;
                    minimum?: number;
                    exclusiveMinimum?: number;
                    maxLength?: number;
                    minLength?: number;
                    pattern?: string | RegExp;
                    maxItems?: number;
                    minItems?: number;
                    uniqueItems?: boolean;
                    maxProperties?: number;
                    minProperties?: number;
                    required?: string | boolean | string[];
                    format?: string;
                    $ref?: string;
                    $namespace?: string;
                    definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                    additionalItems?: import("@formily/json-schema").Stringify<any>;
                    patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    additionalProperties?: import("@formily/json-schema").Stringify<any>;
                    "x-value"?: any;
                    "x-index"?: number;
                    "x-pattern"?: any;
                    "x-display"?: any;
                    "x-validator"?: any;
                    "x-decorator"?: any;
                    "x-decorator-props"?: any;
                    "x-component"?: any;
                    "x-component-props"?: any;
                    "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                    "x-content"?: any;
                    "x-data"?: any;
                    "x-visible"?: boolean;
                    "x-hidden"?: boolean;
                    "x-disabled"?: boolean;
                    "x-editable"?: boolean;
                    "x-read-only"?: boolean;
                    "x-read-pretty"?: boolean;
                }>;
            };
        };
        'decorator-group': {
            type: string;
            'x-component': string;
            'x-component-props': {
                defaultExpand: boolean;
            };
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            };
            properties: {
                'x-decorator-props': import("@formily/json-schema").Stringify<{
                    version?: string;
                    name?: import("react").ReactText;
                    title?: any;
                    description?: any;
                    default?: any;
                    readOnly?: boolean;
                    writeOnly?: boolean;
                    type?: import("@formily/json-schema").SchemaTypes;
                    enum?: import("@formily/json-schema").SchemaEnum<any>;
                    const?: any;
                    multipleOf?: number;
                    maximum?: number;
                    exclusiveMaximum?: number;
                    minimum?: number;
                    exclusiveMinimum?: number;
                    maxLength?: number;
                    minLength?: number;
                    pattern?: string | RegExp;
                    maxItems?: number;
                    minItems?: number;
                    uniqueItems?: boolean;
                    maxProperties?: number;
                    minProperties?: number;
                    required?: string | boolean | string[];
                    format?: string;
                    $ref?: string;
                    $namespace?: string;
                    definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                    additionalItems?: import("@formily/json-schema").Stringify<any>;
                    patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    additionalProperties?: import("@formily/json-schema").Stringify<any>;
                    "x-value"?: any;
                    "x-index"?: number;
                    "x-pattern"?: any;
                    "x-display"?: any;
                    "x-validator"?: any;
                    "x-decorator"?: any;
                    "x-decorator-props"?: any;
                    "x-component"?: any;
                    "x-component-props"?: any;
                    "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                    "x-content"?: any;
                    "x-data"?: any;
                    "x-visible"?: boolean;
                    "x-hidden"?: boolean;
                    "x-disabled"?: boolean;
                    "x-editable"?: boolean;
                    "x-read-only"?: boolean;
                    "x-read-pretty"?: boolean;
                }>;
            };
        };
        'component-style-group': {
            type: string;
            'x-component': string;
            'x-component-props': {
                defaultExpand: boolean;
            };
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            };
            properties: {
                'x-component-props.style': import("@formily/json-schema").Stringify<{
                    version?: string;
                    name?: import("react").ReactText;
                    title?: any;
                    description?: any;
                    default?: any;
                    readOnly?: boolean;
                    writeOnly?: boolean;
                    type?: import("@formily/json-schema").SchemaTypes;
                    enum?: import("@formily/json-schema").SchemaEnum<any>;
                    const?: any;
                    multipleOf?: number;
                    maximum?: number;
                    exclusiveMaximum?: number;
                    minimum?: number;
                    exclusiveMinimum?: number;
                    maxLength?: number;
                    minLength?: number;
                    pattern?: string | RegExp;
                    maxItems?: number;
                    minItems?: number;
                    uniqueItems?: boolean;
                    maxProperties?: number;
                    minProperties?: number;
                    required?: string | boolean | string[];
                    format?: string;
                    $ref?: string;
                    $namespace?: string;
                    definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                    additionalItems?: import("@formily/json-schema").Stringify<any>;
                    patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    additionalProperties?: import("@formily/json-schema").Stringify<any>;
                    "x-value"?: any;
                    "x-index"?: number;
                    "x-pattern"?: any;
                    "x-display"?: any;
                    "x-validator"?: any;
                    "x-decorator"?: any;
                    "x-decorator-props"?: any;
                    "x-component"?: any;
                    "x-component-props"?: any;
                    "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                    "x-content"?: any;
                    "x-data"?: any;
                    "x-visible"?: boolean;
                    "x-hidden"?: boolean;
                    "x-disabled"?: boolean;
                    "x-editable"?: boolean;
                    "x-read-only"?: boolean;
                    "x-read-pretty"?: boolean;
                }>;
            };
        };
        'decorator-style-group': {
            type: string;
            'x-component': string;
            'x-component-props': {
                defaultExpand: boolean;
            };
            'x-reactions': {
                fulfill: {
                    state: {
                        visible: string;
                    };
                };
            };
            properties: {
                'x-decorator-props.style': import("@formily/json-schema").Stringify<{
                    version?: string;
                    name?: import("react").ReactText;
                    title?: any;
                    description?: any;
                    default?: any;
                    readOnly?: boolean;
                    writeOnly?: boolean;
                    type?: import("@formily/json-schema").SchemaTypes;
                    enum?: import("@formily/json-schema").SchemaEnum<any>;
                    const?: any;
                    multipleOf?: number;
                    maximum?: number;
                    exclusiveMaximum?: number;
                    minimum?: number;
                    exclusiveMinimum?: number;
                    maxLength?: number;
                    minLength?: number;
                    pattern?: string | RegExp;
                    maxItems?: number;
                    minItems?: number;
                    uniqueItems?: boolean;
                    maxProperties?: number;
                    minProperties?: number;
                    required?: string | boolean | string[];
                    format?: string;
                    $ref?: string;
                    $namespace?: string;
                    definitions?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    properties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    items?: import("@formily/json-schema").SchemaItems<any, any, any, any, any, any, any, any>;
                    additionalItems?: import("@formily/json-schema").Stringify<any>;
                    patternProperties?: Record<string, import("@formily/json-schema").Stringify<any>>;
                    additionalProperties?: import("@formily/json-schema").Stringify<any>;
                    "x-value"?: any;
                    "x-index"?: number;
                    "x-pattern"?: any;
                    "x-display"?: any;
                    "x-validator"?: any;
                    "x-decorator"?: any;
                    "x-decorator-props"?: any;
                    "x-component"?: any;
                    "x-component-props"?: any;
                    "x-reactions"?: import("@formily/json-schema").SchemaReactions<any>;
                    "x-content"?: any;
                    "x-data"?: any;
                    "x-visible"?: boolean;
                    "x-hidden"?: boolean;
                    "x-disabled"?: boolean;
                    "x-editable"?: boolean;
                    "x-read-only"?: boolean;
                    "x-read-pretty"?: boolean;
                }>;
            };
        };
        'field-group': {
            type: string;
            'x-component': string;
            properties: {
                name: {
                    type: string;
                    'x-decorator': string;
                    'x-component': string;
                };
                title: {
                    type: string;
                    'x-decorator': string;
                    'x-component': string;
                    'x-reactions': {
                        fulfill: {
                            state: {
                                hidden: string;
                            };
                        };
                    };
                };
                description: {
                    type: string;
                    'x-decorator': string;
                    'x-component': string;
                    'x-reactions': {
                        fulfill: {
                            state: {
                                hidden: string;
                            };
                        };
                    };
                };
                'x-display': {
                    type: string;
                    enum: string[];
                    'x-decorator': string;
                    'x-component': string;
                    'x-component-props': {
                        defaultValue: string;
                    };
                };
                'x-pattern': {
                    type: string;
                    enum: string[];
                    'x-decorator': string;
                    'x-component': string;
                    'x-component-props': {
                        defaultValue: string;
                    };
                };
                'x-reactions': {
                    'x-decorator': string;
                    'x-component': import("react").FC<import("@designable/formily-setters").IReactionsSetterProps>;
                };
                'x-decorator': {
                    type: string;
                    'x-decorator': string;
                    'x-component': import("react").FC<import("../../common/FormItemSwitcher").IFormItemSwitcherProps>;
                };
            };
        };
    };
};
