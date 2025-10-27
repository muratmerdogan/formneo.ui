var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState, useRef, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { TextWidget, IconWidget, usePrefix, useTheme } from '@designable/react';
import { Tooltip } from 'antd';
import { parseExpression, parse } from '@babel/parser';
import { uid } from '@designable/shared';
import { format } from './format';
import cls from 'classnames';
import './styles.less';
import './config';
import { initMonaco } from './config';
export var MonacoInput = function (_a) {
    var className = _a.className, language = _a.language, defaultLanguage = _a.defaultLanguage, width = _a.width, helpLink = _a.helpLink, helpCode = _a.helpCode, helpCodeViewWidth = _a.helpCodeViewWidth, height = _a.height, onMount = _a.onMount, onChange = _a.onChange, props = __rest(_a, ["className", "language", "defaultLanguage", "width", "helpLink", "helpCode", "helpCodeViewWidth", "height", "onMount", "onChange"]);
    var _b = __read(useState(false), 2), loaded = _b[0], setLoaded = _b[1];
    var theme = useTheme();
    var valueRef = useRef('');
    var validateRef = useRef(null);
    var submitRef = useRef(null);
    var declarationRef = useRef([]);
    var extraLibRef = useRef(null);
    var monacoRef = useRef();
    var editorRef = useRef();
    var computedLanguage = useRef(language || defaultLanguage);
    var realLanguage = useRef('');
    var unmountedRef = useRef(false);
    var changedRef = useRef(false);
    var uidRef = useRef(uid());
    var prefix = usePrefix('monaco-input');
    var input = props.value || props.defaultValue;
    useEffect(function () {
        unmountedRef.current = false;
        initMonaco();
        return function () {
            if (extraLibRef.current) {
                extraLibRef.current.dispose();
            }
            unmountedRef.current = true;
        };
    }, []);
    useEffect(function () {
        if (monacoRef.current && props.extraLib) {
            updateExtraLib();
        }
    }, [props.extraLib]);
    var updateExtraLib = function () {
        if (extraLibRef.current) {
            extraLibRef.current.dispose();
        }
        extraLibRef.current =
            monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(props.extraLib, "".concat(uidRef.current, ".d.ts"));
    };
    var isFileLanguage = function () {
        var lang = computedLanguage.current;
        return lang === 'javascript' || lang === 'typescript';
    };
    var isExpLanguage = function () {
        var lang = computedLanguage.current;
        return lang === 'javascript.expression' || lang === 'typescript.expression';
    };
    var renderHelper = function () {
        var getHref = function () {
            if (typeof helpLink === 'string')
                return helpLink;
            if (isFileLanguage()) {
                return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript';
            }
            if (isExpLanguage()) {
                return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators';
            }
        };
        if (helpLink === false)
            return null;
        var href = getHref();
        return (href && (React.createElement(Tooltip, { title: React.createElement(TextWidget, { token: "SettingComponents.MonacoInput.helpDocument" }) },
            React.createElement("div", { className: prefix + '-helper' },
                React.createElement("a", { target: "_blank", href: href, rel: "noreferrer" },
                    React.createElement(IconWidget, { infer: "Help" }))))));
    };
    var onMountHandler = function (editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        onMount === null || onMount === void 0 ? void 0 : onMount(editor, monaco);
        var model = editor.getModel();
        var currentValue = editor.getValue();
        model['getDesignerLanguage'] = function () { return computedLanguage.current; };
        if (currentValue) {
            format(computedLanguage.current, currentValue)
                .then(function (content) {
                editor.setValue(content);
                setLoaded(true);
            })
                .catch(function () {
                setLoaded(true);
            });
        }
        else {
            setLoaded(true);
        }
        if (props.extraLib) {
            updateExtraLib();
        }
        editor.onDidChangeModelContent(function () {
            onChangeHandler(editor.getValue());
        });
    };
    var submit = function () {
        clearTimeout(submitRef.current);
        submitRef.current = setTimeout(function () {
            onChange === null || onChange === void 0 ? void 0 : onChange(valueRef.current);
        }, 1000);
    };
    var validate = function () {
        if (realLanguage.current === 'typescript') {
            clearTimeout(validateRef.current);
            validateRef.current = setTimeout(function () {
                try {
                    if (valueRef.current) {
                        if (isFileLanguage()) {
                            parse(valueRef.current, {
                                sourceType: 'module',
                                plugins: ['typescript', 'jsx'],
                            });
                        }
                        else if (isExpLanguage()) {
                            parseExpression(valueRef.current, {
                                plugins: ['typescript', 'jsx'],
                            });
                        }
                    }
                    monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), computedLanguage.current, []);
                    declarationRef.current = editorRef.current.deltaDecorations(declarationRef.current, [
                        {
                            range: new monacoRef.current.Range(1, 1, 1, 1),
                            options: {},
                        },
                    ]);
                    submit();
                }
                catch (e) {
                    declarationRef.current = editorRef.current.deltaDecorations(declarationRef.current, [
                        {
                            range: new monacoRef.current.Range(e.loc.line, e.loc.column, e.loc.line, e.loc.column),
                            options: {
                                isWholeLine: true,
                                glyphMarginClassName: 'monaco-error-highline',
                            },
                        },
                    ]);
                    monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), computedLanguage.current, [
                        {
                            code: '1003',
                            severity: 8,
                            startLineNumber: e.loc.line,
                            startColumn: e.loc.column,
                            endLineNumber: e.loc.line,
                            endColumn: e.loc.column,
                            message: e.message,
                        },
                    ]);
                }
            }, 240);
        }
        else {
            submit();
            declarationRef.current = editorRef.current.deltaDecorations(declarationRef.current, [
                {
                    range: new monacoRef.current.Range(1, 1, 1, 1),
                    options: {},
                },
            ]);
        }
    };
    var onChangeHandler = function (value) {
        changedRef.current = true;
        valueRef.current = value;
        validate();
    };
    computedLanguage.current = language || defaultLanguage;
    realLanguage.current = /(?:javascript|typescript)/gi.test(computedLanguage.current)
        ? 'typescript'
        : computedLanguage.current;
    var renderHelpCode = function () {
        if (!helpCode)
            return null;
        return (React.createElement("div", { className: prefix + '-view', style: { width: helpCodeViewWidth || '50%' } },
            React.createElement(Editor, { value: helpCode, theme: theme === 'dark' ? 'monokai' : 'chrome-devtools', defaultLanguage: realLanguage.current, language: realLanguage.current, options: __assign(__assign({}, props.options), { lineNumbers: 'off', readOnly: true, glyphMargin: false, folding: false, lineDecorationsWidth: 0, lineNumbersMinChars: 0, minimap: {
                        enabled: false,
                    }, tabSize: 2, smoothScrolling: true, scrollbar: {
                        verticalScrollbarSize: 5,
                        horizontalScrollbarSize: 5,
                        alwaysConsumeMouseWheel: false,
                    } }), width: "100%", height: "100%" })));
    };
    return (React.createElement("div", { className: cls(prefix, className, {
            loaded: loaded,
        }), style: { width: width, height: height } },
        renderHelper(),
        React.createElement("div", { className: prefix + '-view' },
            React.createElement(Editor, __assign({}, props, { theme: theme === 'dark' ? 'monokai' : 'chrome-devtools', defaultLanguage: realLanguage.current, language: realLanguage.current, options: __assign(__assign({ glyphMargin: true }, props.options), { tabSize: 2, smoothScrolling: true, scrollbar: {
                        verticalScrollbarSize: 5,
                        horizontalScrollbarSize: 5,
                        alwaysConsumeMouseWheel: false,
                    } }), value: input, width: "100%", height: "100%", onMount: onMountHandler }))),
        renderHelpCode()));
};
MonacoInput.loader = loader;
