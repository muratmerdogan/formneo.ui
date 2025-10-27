declare const _default: {
    base: string;
    inherit: boolean;
    rules: ({
        foreground: string;
        token: string;
        fontStyle?: undefined;
        background?: undefined;
    } | {
        fontStyle: string;
        token: string;
        foreground?: undefined;
        background?: undefined;
    } | {
        background: string;
        token: string;
        foreground?: undefined;
        fontStyle?: undefined;
    } | {
        foreground: string;
        background: string;
        token: string;
        fontStyle?: undefined;
    } | {
        foreground: string;
        fontStyle: string;
        token: string;
        background?: undefined;
    })[];
    colors: {
        'editor.foreground': string;
        'editor.background': string;
        'editor.selectionBackground': string;
        'editor.lineHighlightBackground': string;
        'editorCursor.foreground': string;
        'editorWhitespace.foreground': string;
    };
};
export default _default;
