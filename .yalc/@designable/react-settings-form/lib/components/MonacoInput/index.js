"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoInput = void 0;
var react_1 = __importStar(require("react"));
var react_2 = __importStar(require("@monaco-editor/react"));
var react_3 = require("@designable/react");
var antd_1 = require("antd");
var parser_1 = require("@babel/parser");
var shared_1 = require("@designable/shared");
var format_1 = require("./format");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
require("./config");
var config_1 = require("./config");
var MonacoInput = function (_a) {
    var className = _a.className, language = _a.language, defaultLanguage = _a.defaultLanguage, width = _a.width, helpLink = _a.helpLink, helpCode = _a.helpCode, helpCodeViewWidth = _a.helpCodeViewWidth, height = _a.height, onMount = _a.onMount, onChange = _a.onChange, props = __rest(_a, ["className", "language", "defaultLanguage", "width", "helpLink", "helpCode", "helpCodeViewWidth", "height", "onMount", "onChange"]);
    var _b = __read((0, react_1.useState)(false), 2), loaded = _b[0], setLoaded = _b[1];
    var theme = (0, react_3.useTheme)();
    var valueRef = (0, react_1.useRef)('');
    var validateRef = (0, react_1.useRef)(null);
    var submitRef = (0, react_1.useRef)(null);
    var declarationRef = (0, react_1.useRef)([]);
    var extraLibRef = (0, react_1.useRef)(null);
    var monacoRef = (0, react_1.useRef)();
    var editorRef = (0, react_1.useRef)();
    var computedLanguage = (0, react_1.useRef)(language || defaultLanguage);
    var realLanguage = (0, react_1.useRef)('');
    var unmountedRef = (0, react_1.useRef)(false);
    var changedRef = (0, react_1.useRef)(false);
    var uidRef = (0, react_1.useRef)((0, shared_1.uid)());
    var prefix = (0, react_3.usePrefix)('monaco-input');
    var input = props.value || props.defaultValue;
    (0, react_1.useEffect)(function () {
        unmountedRef.current = false;
        (0, config_1.initMonaco)();
        return function () {
            if (extraLibRef.current) {
                extraLibRef.current.dispose();
            }
            unmountedRef.current = true;
        };
    }, []);
    (0, react_1.useEffect)(function () {
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
        return (href && (react_1.default.createElement(antd_1.Tooltip, { title: react_1.default.createElement(react_3.TextWidget, { token: "SettingComponents.MonacoInput.helpDocument" }) },
            react_1.default.createElement("div", { className: prefix + '-helper' },
                react_1.default.createElement("a", { target: "_blank", href: href, rel: "noreferrer" },
                    react_1.default.createElement(react_3.IconWidget, { infer: "Help" }))))));
    };
    var onMountHandler = function (editor, monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        onMount === null || onMount === void 0 ? void 0 : onMount(editor, monaco);
        var model = editor.getModel();
        var currentValue = editor.getValue();
        model['getDesignerLanguage'] = function () { return computedLanguage.current; };
        if (currentValue) {
            (0, format_1.format)(computedLanguage.current, currentValue)
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
                            (0, parser_1.parse)(valueRef.current, {
                                sourceType: 'module',
                                plugins: ['typescript', 'jsx'],
                            });
                        }
                        else if (isExpLanguage()) {
                            (0, parser_1.parseExpression)(valueRef.current, {
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
        return (react_1.default.createElement("div", { className: prefix + '-view', style: { width: helpCodeViewWidth || '50%' } },
            react_1.default.createElement(react_2.default, { value: helpCode, theme: theme === 'dark' ? 'monokai' : 'chrome-devtools', defaultLanguage: realLanguage.current, language: realLanguage.current, options: __assign(__assign({}, props.options), { lineNumbers: 'off', readOnly: true, glyphMargin: false, folding: false, lineDecorationsWidth: 0, lineNumbersMinChars: 0, minimap: {
                        enabled: false,
                    }, tabSize: 2, smoothScrolling: true, scrollbar: {
                        verticalScrollbarSize: 5,
                        horizontalScrollbarSize: 5,
                        alwaysConsumeMouseWheel: false,
                    } }), width: "100%", height: "100%" })));
    };
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, className, {
            loaded: loaded,
        }), style: { width: width, height: height } },
        renderHelper(),
        react_1.default.createElement("div", { className: prefix + '-view' },
            react_1.default.createElement(react_2.default, __assign({}, props, { theme: theme === 'dark' ? 'monokai' : 'chrome-devtools', defaultLanguage: realLanguage.current, language: realLanguage.current, options: __assign(__assign({ glyphMargin: true }, props.options), { tabSize: 2, smoothScrolling: true, scrollbar: {
                        verticalScrollbarSize: 5,
                        horizontalScrollbarSize: 5,
                        alwaysConsumeMouseWheel: false,
                    } }), value: input, width: "100%", height: "100%", onMount: onMountHandler }))),
        renderHelpCode()));
};
exports.MonacoInput = MonacoInput;
exports.MonacoInput.loader = react_2.loader;
