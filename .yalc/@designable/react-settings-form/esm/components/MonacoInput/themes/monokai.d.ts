declare const _default: {
    base: string;
    inherit: boolean;
    rules: ({
        foreground: string;
        token: string;
        fontStyle?: undefined;
        background?: undefined;
    } | {
        foreground: string;
        fontStyle: string;
        token: string;
        background?: undefined;
    } | {
        foreground: string;
        background: string;
        token: string;
        fontStyle?: undefined;
    })[];
    colors: {
        'editor.foreground': string;
        'editor.background': string;
        'editor.selectionBackground': string;
        'editor.lineHighlightBackground': string;
        'editorCursor.foreground': string;
        'editorWhitespace.foreground': string;
        'editorIndentGuide.activeBackground': string;
        'editor.selectionHighlightBorder': string;
    };
};
export default _default;
