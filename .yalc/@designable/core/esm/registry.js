import { each } from '@designable/shared';
import { Path } from '@formily/path';
import { observable } from '@formily/reactive';
import { mergeLocales, lowerSnake, getBrowserLanguage } from './internals';
import { isBehaviorHost } from './externals';
import { isBehaviorList } from './externals';
var getISOCode = function (language) {
    var isoCode = DESIGNER_LANGUAGE_STORE.value;
    var lang = lowerSnake(language);
    if (DESIGNER_LOCALES_STORE.value[lang]) {
        return lang;
    }
    each(DESIGNER_LOCALES_STORE.value, function (_, key) {
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
    each(sources, function (item) {
        if (!item)
            return;
        if (!isBehaviorHost(item))
            return;
        var Behavior = item.Behavior;
        each(Behavior, function (behavior) {
            if (findTargetBehavior(behavior))
                return;
            var name = behavior.name;
            each(behavior.extends, function (dep) {
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
var DESIGNER_BEHAVIORS_STORE = observable.ref([]);
var DESIGNER_ICONS_STORE = observable.ref({});
var DESIGNER_LOCALES_STORE = observable.ref({});
var DESIGNER_LANGUAGE_STORE = observable.ref(getBrowserLanguage());
var DESIGNER_GlobalRegistry = {
    setDesignerLanguage: function (lang) {
        DESIGNER_LANGUAGE_STORE.value = lang;
    },
    setDesignerBehaviors: function (behaviors) {
        DESIGNER_BEHAVIORS_STORE.value = behaviors.reduce(function (buf, behavior) {
            if (isBehaviorHost(behavior)) {
                return buf.concat(behavior.Behavior);
            }
            else if (isBehaviorList(behavior)) {
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
                var message = Path.getIn(DESIGNER_LOCALES_STORE.value[key], lowerSnake(token));
                if (message)
                    return message;
            }
            return;
        }
        return Path.getIn(locale, lowerSnake(token));
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
            mergeLocales(DESIGNER_LOCALES_STORE.value, locales);
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
export var GlobalRegistry = DESIGNER_GlobalRegistry;
