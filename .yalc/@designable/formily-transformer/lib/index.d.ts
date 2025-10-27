import { ISchema } from '@formily/json-schema';
import { ITreeNode } from '@designable/core';
export interface ITransformerOptions {
    designableFieldName?: string;
    designableFormName?: string;
}
export interface IFormilySchema {
    schema?: ISchema;
    form?: Record<string, any>;
}
export declare const transformToSchema: (node: ITreeNode, options?: ITransformerOptions) => IFormilySchema;
export declare const transformToTreeNode: (formily?: IFormilySchema, options?: ITransformerOptions) => ITreeNode;
