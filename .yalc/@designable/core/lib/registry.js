"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRegistry = void 0;
var shared_1 = require("@designable/shared");
var path_1 = require("@formily/path");
var reactive_1 = require("@formily/reactive");
var internals_1 = require("./internals");
var externals_1 = require("./externals");
var externals_2 = require("./externals");
var getISOCode = function (language) {
    var isoCode = DESIGNER_LANGUAGE_STORE.value;
    var lang = (0, internals_1.lowerSnake)(language);
    if (DESIGNER_LOCALES_STORE.value[lang]) {
        return lang;
    }
    (0, shared_1.each)(DESIGNER_LOCALES_STORE.value, function (_, key) {
        if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
            isoCode = key;
            return false;
        }
    });
    return isoCode;
};
var reSortBehaviors = function (target, sources) {
    var findTargetBehavior = function (behavior) { return target.includes(behavior); };
    var findSourceBehavior = function (name) {
        for (var key in sources) {
            var Behavior = sources[key].Behavior;
            for (var i = 0; i < Behavior.length; i++) {
                if (Behavior[i].name === name)
                    return Behavior[i];
            }
        }
    };
    (0, shared_1.each)(sources, function (item) {
        if (!item)
            return;
        if (!(0, externals_1.isBehaviorHost)(item))
            return;
        var Behavior = item.Behavior;
        (0, shared_1.each)(Behavior, function (behavior) {
            if (findTargetBehavior(behavior))
                return;
            var name = behavior.name;
            (0, shared_1.each)(behavior.extends, function (dep) {
                var behavior = findSourceBehavior(dep);
                if (!behavior)
                    throw new Error("No ".concat(dep, " behavior that ").concat(name, " depends on"));
                if (!findTargetBehavior(behavior)) {
                    target.unshift(behavior);
                }
            });
            target.push(behavior);
        });
    });
};
var DESIGNER_BEHAVIORS_STORE = reactive_1.observable.ref([]);
var DESIGNER_ICONS_STORE = reactive_1.observable.ref({});
var DESIGNER_LOCALES_STORE = reactive_1.observable.ref({});
var DESIGNER_LANGUAGE_STORE = reactive_1.observable.ref((0, internals_1.getBrowserLanguage)());
var DESIGNER_GlobalRegistry = {
    setDesignerLanguage: function (lang) {
        DESIGNER_LANGUAGE_STORE.value = lang;
    },
    setDesignerBehaviors: function (behaviors) {
        DESIGNER_BEHAVIORS_STORE.value = behaviors.reduce(function (buf, behavior) {
            if ((0, externals_1.isBehaviorHost)(behavior)) {
                return buf.concat(behavior.Behavior);
            }
            else if ((0, externals_2.isBehaviorList)(behavior)) {
                return buf.concat(behavior);
            }
            return buf;
        }, []);
    },
    getDesignerBehaviors: function (node) {
        return DESIGNER_BEHAVIORS_STORE.value.filter(function (pattern) {
            return pattern.selector(node);
        });
    },
    getDesignerIcon: function (name) {
        return DESIGNER_ICONS_STORE[name];
    },
    getDesignerLanguage: function () {
        return getISOCode(DESIGNER_LANGUAGE_STORE.value);
    },
    getDesignerMessage: function (token, locales) {
        var lang = getISOCode(DESIGNER_LANGUAGE_STORE.value);
        var locale = locales ? locales[lang] : DESIGNER_LOCALES_STORE.value[lang];
        if (!locale) {
            for (var key in DESIGNER_LOCALES_STORE.value) {
                var message = path_1.Path.getIn(DESIGNER_LOCALES_STORE.value[key], (0, internals_1.lowerSnake)(token));
                if (message)
                    return message;
            }
            return;
        }
        return path_1.Path.getIn(locale, (0, internals_1.lowerSnake)(token));
    },
    registerDesignerIcons: function (map) {
        Object.assign(DESIGNER_ICONS_STORE, map);
    },
    registerDesignerLocales: function () {
        var packages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            packages[_i] = arguments[_i];
        }
        packages.forEach(function (locales) {
            (0, internals_1.mergeLocales)(DESIGNER_LOCALES_STORE.value, locales);
        });
    },
    registerDesignerBehaviors: function () {
        var packages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            packages[_i] = arguments[_i];
        }
        var results = [];
        packages.forEach(function (sources) {
            reSortBehaviors(results, sources);
        });
        if (results.length) {
            DESIGNER_BEHAVIORS_STORE.value = results;
        }
    },
};
exports.GlobalRegistry = DESIGNER_GlobalRegistry;
