import React from 'react';
import { EditorProps, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import './styles.less';
import './config';
export declare type Monaco = typeof monaco;
export interface MonacoInputProps extends EditorProps {
    helpLink?: string | boolean;
    helpCode?: string;
    helpCodeViewWidth?: number | string;
    extraLib?: string;
    onChange?: (value: string) => void;
}
export declare const MonacoInput: React.FC<MonacoInputProps> & {
    loader?: typeof loader;
};
