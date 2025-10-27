"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventDriver = void 0;
var types_1 = require("./types");
var subscribable_1 = require("./subscribable");
var globalThisPolyfill_1 = require("./globalThisPolyfill");
var ATTACHED_SYMBOL = Symbol('ATTACHED_SYMBOL');
var EVENTS_SYMBOL = Symbol('__EVENTS_SYMBOL__');
var EVENTS_ONCE_SYMBOL = Symbol('EVENTS_ONCE_SYMBOL');
var EVENTS_BATCH_SYMBOL = Symbol('EVENTS_BATCH_SYMBOL');
var DRIVER_INSTANCES_SYMBOL = Symbol('DRIVER_INSTANCES_SYMBOL');
var isOnlyMode = function (mode) {
    return mode === 'onlyOne' || mode === 'onlyChild' || mode === 'onlyParent';
};
/**
 * 事件驱动器基类
 */
var EventDriver = /** @class */ (function () {
    function EventDriver(engine, context) {
        this.container = document;
        this.contentWindow = globalThisPolyfill_1.globalThisPolyfill;
        this.engine = engine;
        this.context = context;
    }
    EventDriver.prototype.dispatch = function (event) {
        return this.engine.dispatch(event, this.context);
    };
    EventDriver.prototype.subscribe = function (subscriber) {
        return this.engine.subscribe(subscriber);
    };
    EventDriver.prototype.subscribeTo = function (type, subscriber) {
        return this.engine.subscribeTo(type, subscriber);
    };
    EventDriver.prototype.subscribeWith = function (type, subscriber) {
        return this.engine.subscribeWith(type, subscriber);
    };
    EventDriver.prototype.attach = function (container) {
        console.error('attach must implement.');
    };
    EventDriver.prototype.detach = function (container) {
        console.error('attach must implement.');
    };
    EventDriver.prototype.eventTarget = function (type) {
        var _a;
        if (type === 'resize' || type === 'scroll') {
            if (this.container === ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document)) {
                return this.contentWindow;
            }
        }
        return this.container;
    };
    EventDriver.prototype.addEventListener = function (type, listener, options) {
        var _a, _b, _c, _d;
        var target = this.eventTarget(type);
        if (isOnlyMode(options === null || options === void 0 ? void 0 : options.mode)) {
            target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
            var constructor = this['constructor'];
            constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
            var handler = target[EVENTS_ONCE_SYMBOL][type];
            var container = constructor[EVENTS_ONCE_SYMBOL][type];
            if (!handler) {
                if (container) {
                    if (options.mode === 'onlyChild') {
                        if (container.contains(target)) {
                            container.removeEventListener(type, container[EVENTS_ONCE_SYMBOL][type], options);
                            delete container[EVENTS_ONCE_SYMBOL][type];
                        }
                    }
                    else if (options.mode === 'onlyParent') {
                        if (container.contains(target))
                            return;
                    }
                }
                target.addEventListener(type, listener, options);
                target[EVENTS_ONCE_SYMBOL][type] = listener;
                constructor[EVENTS_ONCE_SYMBOL][type] = target;
            }
        }
        else {
            target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
            target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
            if (!((_b = (_a = target[EVENTS_SYMBOL][type]) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a, listener))) {
                target.addEventListener(type, listener, options);
                (_d = (_c = target[EVENTS_SYMBOL][type]) === null || _c === void 0 ? void 0 : _c.set) === null || _d === void 0 ? void 0 : _d.call(_c, listener, true);
            }
        }
    };
    EventDriver.prototype.removeEventListener = function (type, listener, options) {
        var _a, _b;
        var target = this.eventTarget(type);
        if (isOnlyMode(options === null || options === void 0 ? void 0 : options.mode)) {
            var constructor = this['constructor'];
            constructor[EVENTS_ONCE_SYMBOL] = constructor[EVENTS_ONCE_SYMBOL] || {};
            target[EVENTS_ONCE_SYMBOL] = target[EVENTS_ONCE_SYMBOL] || {};
            delete constructor[EVENTS_ONCE_SYMBOL][type];
            delete target[EVENTS_ONCE_SYMBOL][type];
            target.removeEventListener(type, listener, options);
        }
        else {
            target[EVENTS_SYMBOL] = target[EVENTS_SYMBOL] || {};
            target[EVENTS_SYMBOL][type] = target[EVENTS_SYMBOL][type] || new Map();
            (_b = (_a = target[EVENTS_SYMBOL][type]) === null || _a === void 0 ? void 0 : _a.delete) === null || _b === void 0 ? void 0 : _b.call(_a, listener);
            target.removeEventListener(type, listener, options);
        }
    };
    EventDriver.prototype.batchAddEventListener = function (type, listener, options) {
        this.engine[DRIVER_INSTANCES_SYMBOL] =
            this.engine[DRIVER_INSTANCES_SYMBOL] || [];
        if (!this.engine[DRIVER_INSTANCES_SYMBOL].includes(this)) {
            this.engine[DRIVER_INSTANCES_SYMBOL].push(this);
        }
        this.engine[DRIVER_INSTANCES_SYMBOL].forEach(function (driver) {
            var target = driver.eventTarget(type);
            target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
            if (!target[EVENTS_BATCH_SYMBOL][type]) {
                target.addEventListener(type, listener, options);
                target[EVENTS_BATCH_SYMBOL][type] = listener;
            }
        });
    };
    EventDriver.prototype.batchRemoveEventListener = function (type, listener, options) {
        this.engine[DRIVER_INSTANCES_SYMBOL] =
            this.engine[DRIVER_INSTANCES_SYMBOL] || [];
        this.engine[DRIVER_INSTANCES_SYMBOL].forEach(function (driver) {
            var target = driver.eventTarget(type);
            target[EVENTS_BATCH_SYMBOL] = target[EVENTS_BATCH_SYMBOL] || {};
            target.removeEventListener(type, listener, options);
            delete target[EVENTS_BATCH_SYMBOL][type];
        });
    };
    return EventDriver;
}());
exports.EventDriver = EventDriver;
/**
 * 事件引擎
 */
var Event = /** @class */ (function (_super) {
    __extends(Event, _super);
    function Event(props) {
        var _this = _super.call(this) || this;
        _this.drivers = [];
        _this.containers = [];
        if ((0, types_1.isArr)(props === null || props === void 0 ? void 0 : props.effects)) {
            props.effects.forEach(function (plugin) {
                plugin(_this);
            });
        }
        if ((0, types_1.isArr)(props === null || props === void 0 ? void 0 : props.drivers)) {
            _this.drivers = props.drivers;
        }
        return _this;
    }
    Event.prototype.subscribeTo = function (type, subscriber) {
        return this.subscribe(function (event) {
            if (type && event instanceof type) {
                return subscriber(event);
            }
        });
    };
    Event.prototype.subscribeWith = function (type, subscriber) {
        return this.subscribe(function (event) {
            if ((0, types_1.isArr)(type)) {
                if (type.includes(event === null || event === void 0 ? void 0 : event.type)) {
                    return subscriber(event);
                }
            }
            else {
                if (type && (event === null || event === void 0 ? void 0 : event.type) === type) {
                    return subscriber(event);
                }
            }
        });
    };
    Event.prototype.attachEvents = function (container, contentWindow, context) {
        var _this = this;
        if (contentWindow === void 0) { contentWindow = globalThisPolyfill_1.globalThisPolyfill; }
        if (!container)
            return;
        if ((0, types_1.isWindow)(container)) {
            return this.attachEvents(container.document, container, context);
        }
        if (container[ATTACHED_SYMBOL])
            return;
        container[ATTACHED_SYMBOL] = this.drivers.map(function (EventDriver) {
            var driver = new EventDriver(_this, context);
            driver.contentWindow = contentWindow;
            driver.container = container;
            driver.attach(container);
            return driver;
        });
        if (!this.containers.includes(container)) {
            this.containers.push(container);
        }
    };
    Event.prototype.detachEvents = function (container) {
        var _this = this;
        if (!container) {
            this.containers.forEach(function (container) {
                _this.detachEvents(container);
            });
            return;
        }
        if ((0, types_1.isWindow)(container)) {
            return this.detachEvents(container.document);
        }
        if (!container[ATTACHED_SYMBOL])
            return;
        container[ATTACHED_SYMBOL].forEach(function (driver) {
            driver.detach(container);
        });
        this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL] || [];
        this[DRIVER_INSTANCES_SYMBOL] = this[DRIVER_INSTANCES_SYMBOL].reduce(function (drivers, driver) {
            if (driver.container === container) {
                driver.detach(container);
                return drivers;
            }
            return drivers.concat(driver);
        }, []);
        this.containers = this.containers.filter(function (item) { return item !== container; });
        delete container[ATTACHED_SYMBOL];
        delete container[EVENTS_SYMBOL];
        delete container[EVENTS_ONCE_SYMBOL];
        delete container[EVENTS_BATCH_SYMBOL];
    };
    return Event;
}(subscribable_1.Subscribable));
exports.Event = Event;
