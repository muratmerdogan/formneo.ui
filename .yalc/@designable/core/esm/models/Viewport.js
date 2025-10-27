import { calcBoundingRect, calcElementLayout, isHTMLElement, isPointInRect, requestIdle, cancelIdle, globalThisPolyfill, Rect, isRectInRect, } from '@designable/shared';
import { action, define, observable } from '@formily/reactive';
/**
 * 视口模型
 */
var Viewport = /** @class */ (function () {
    function Viewport(props) {
        var _a, _b;
        this.scrollX = 0;
        this.scrollY = 0;
        this.width = 0;
        this.height = 0;
        this.mounted = false;
        this.nodeElementsStore = {};
        this.workspace = props.workspace;
        this.engine = props.engine;
        this.moveSensitive = (_a = props.moveSensitive) !== null && _a !== void 0 ? _a : false;
        this.moveInsertionType = (_b = props.moveInsertionType) !== null && _b !== void 0 ? _b : 'all';
        this.viewportElement = props.viewportElement;
        this.contentWindow = props.contentWindow;
        this.nodeIdAttrName = props.nodeIdAttrName;
        this.digestViewport();
        this.makeObservable();
        this.attachEvents();
    }
    Object.defineProperty(Viewport.prototype, "isScrollLeft", {
        get: function () {
            return this.scrollX === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollTop", {
        get: function () {
            return this.scrollY === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollRight", {
        get: function () {
            var _a, _b, _c;
            if (this.isIframe) {
                return (this.width + this.contentWindow.scrollX >=
                    ((_c = (_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.scrollWidth));
            }
            else if (this.viewportElement) {
                return (this.viewportElement.offsetWidth + this.scrollX >=
                    this.viewportElement.scrollWidth);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollBottom", {
        get: function () {
            var _a, _b;
            if (this.isIframe) {
                if (!((_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body))
                    return false;
                return (this.height + this.contentWindow.scrollY >=
                    this.contentWindow.document.body.scrollHeight);
            }
            else if (this.viewportElement) {
                if (!this.viewportElement)
                    return false;
                return (this.viewportElement.offsetHeight + this.viewportElement.scrollTop >=
                    this.viewportElement.scrollHeight);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "viewportRoot", {
        get: function () {
            var _a, _b;
            return this.isIframe
                ? (_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body
                : this.viewportElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isMaster", {
        get: function () {
            return this.contentWindow === globalThisPolyfill;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isIframe", {
        get: function () {
            var _a;
            return !!((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.frameElement) && !this.isMaster;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "scrollContainer", {
        get: function () {
            return this.isIframe ? this.contentWindow : this.viewportElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "rect", {
        get: function () {
            var viewportElement = this.viewportElement;
            if (viewportElement)
                return viewportElement.getBoundingClientRect();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "innerRect", {
        get: function () {
            var rect = this.rect;
            return new Rect(0, 0, rect === null || rect === void 0 ? void 0 : rect.width, rect === null || rect === void 0 ? void 0 : rect.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "offsetX", {
        get: function () {
            var rect = this.rect;
            if (!rect)
                return 0;
            return rect.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "offsetY", {
        get: function () {
            var rect = this.rect;
            if (!rect)
                return 0;
            return rect.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "scale", {
        get: function () {
            if (!this.viewportElement)
                return 1;
            var clientRect = this.viewportElement.getBoundingClientRect();
            var offsetWidth = this.viewportElement.offsetWidth;
            if (!clientRect.width || !offsetWidth)
                return 1;
            return Math.round(clientRect.width / offsetWidth);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "dragScrollXDelta", {
        get: function () {
            return this.scrollX - this.dragStartSnapshot.scrollX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "dragScrollYDelta", {
        get: function () {
            return this.scrollY - this.dragStartSnapshot.scrollY;
        },
        enumerable: false,
        configurable: true
    });
    Viewport.prototype.cacheElements = function () {
        var _this = this;
        var _a;
        this.nodeElementsStore = {};
        (_a = this.viewportRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll("*[".concat(this.nodeIdAttrName, "]")).forEach(function (element) {
            var id = element.getAttribute(_this.nodeIdAttrName);
            _this.nodeElementsStore[id] = _this.nodeElementsStore[id] || [];
            _this.nodeElementsStore[id].push(element);
        });
    };
    Viewport.prototype.clearCache = function () {
        this.nodeElementsStore = {};
    };
    Viewport.prototype.getCurrentData = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var data = {};
        if (this.isIframe) {
            data.scrollX = ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollX) || 0;
            data.scrollY = ((_b = this.contentWindow) === null || _b === void 0 ? void 0 : _b.scrollY) || 0;
            data.width = ((_c = this.contentWindow) === null || _c === void 0 ? void 0 : _c.innerWidth) || 0;
            data.height = ((_d = this.contentWindow) === null || _d === void 0 ? void 0 : _d.innerHeight) || 0;
        }
        else if (this.viewportElement) {
            data.scrollX = ((_e = this.viewportElement) === null || _e === void 0 ? void 0 : _e.scrollLeft) || 0;
            data.scrollY = ((_f = this.viewportElement) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0;
            data.width = ((_g = this.viewportElement) === null || _g === void 0 ? void 0 : _g.clientWidth) || 0;
            data.height = ((_h = this.viewportElement) === null || _h === void 0 ? void 0 : _h.clientHeight) || 0;
        }
        return data;
    };
    Viewport.prototype.takeDragStartSnapshot = function () {
        this.dragStartSnapshot = this.getCurrentData();
    };
    Viewport.prototype.digestViewport = function () {
        Object.assign(this, this.getCurrentData());
    };
    Viewport.prototype.elementFromPoint = function (point) {
        var _a;
        if ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) {
            return this.contentWindow.document.elementFromPoint(point.x, point.y);
        }
    };
    Viewport.prototype.matchViewport = function (target) {
        var _a;
        if (this.isIframe) {
            return (target === this.viewportElement ||
                target === this.contentWindow ||
                target === ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
        }
        else {
            return target === this.viewportElement;
        }
    };
    Viewport.prototype.attachEvents = function () {
        var _this = this;
        var engine = this.engine;
        cancelIdle(this.attachRequest);
        this.attachRequest = requestIdle(function () {
            if (!engine)
                return;
            if (_this.isIframe) {
                _this.workspace.attachEvents(_this.contentWindow, _this.contentWindow);
            }
            else if (isHTMLElement(_this.viewportElement)) {
                _this.workspace.attachEvents(_this.viewportElement, _this.contentWindow);
            }
        });
    };
    Viewport.prototype.detachEvents = function () {
        if (this.isIframe) {
            this.workspace.detachEvents(this.contentWindow);
            this.workspace.detachEvents(this.viewportElement);
        }
        else if (this.viewportElement) {
            this.workspace.detachEvents(this.viewportElement);
        }
    };
    Viewport.prototype.onMount = function (element, contentWindow) {
        this.mounted = true;
        this.viewportElement = element;
        this.contentWindow = contentWindow;
        this.attachEvents();
        this.digestViewport();
    };
    Viewport.prototype.onUnmount = function () {
        this.mounted = false;
        this.detachEvents();
    };
    Viewport.prototype.isPointInViewport = function (point, sensitive) {
        if (!this.rect)
            return false;
        if (!this.containsElement(document.elementFromPoint(point.x, point.y))) {
            return false;
        }
        return isPointInRect(point, this.rect, sensitive);
    };
    Viewport.prototype.isRectInViewport = function (rect) {
        if (!this.rect)
            return false;
        if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
            return false;
        }
        return isRectInRect(rect, this.rect);
    };
    Viewport.prototype.isPointInViewportArea = function (point, sensitive) {
        if (!this.rect)
            return false;
        return isPointInRect(point, this.rect, sensitive);
    };
    Viewport.prototype.isOffsetPointInViewport = function (point, sensitive) {
        if (!this.innerRect)
            return false;
        if (!this.containsElement(document.elementFromPoint(point.x, point.y)))
            return false;
        return isPointInRect(point, this.innerRect, sensitive);
    };
    Viewport.prototype.isOffsetRectInViewport = function (rect) {
        if (!this.innerRect)
            return false;
        if (!this.containsElement(document.elementFromPoint(rect.x, rect.y))) {
            return false;
        }
        return isRectInRect(rect, this.innerRect);
    };
    Viewport.prototype.makeObservable = function () {
        define(this, {
            scrollX: observable.ref,
            scrollY: observable.ref,
            width: observable.ref,
            height: observable.ref,
            digestViewport: action,
            viewportElement: observable.ref,
            contentWindow: observable.ref,
        });
    };
    Viewport.prototype.findElementById = function (id) {
        var _a;
        if (!id)
            return;
        if (this.nodeElementsStore[id])
            return this.nodeElementsStore[id][0];
        return (_a = this.viewportRoot) === null || _a === void 0 ? void 0 : _a.querySelector("*[".concat(this.nodeIdAttrName, "='").concat(id, "']"));
    };
    Viewport.prototype.findElementsById = function (id) {
        var _a, _b;
        if (!id)
            return [];
        if (this.nodeElementsStore[id])
            return this.nodeElementsStore[id];
        return Array.from((_b = (_a = this.viewportRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll("*[".concat(this.nodeIdAttrName, "='").concat(id, "']"))) !== null && _b !== void 0 ? _b : []);
    };
    Viewport.prototype.containsElement = function (element) {
        var root = this.viewportElement;
        if (root === element)
            return true;
        return root === null || root === void 0 ? void 0 : root.contains(element);
    };
    Viewport.prototype.getOffsetPoint = function (topPoint) {
        var data = this.getCurrentData();
        return {
            x: topPoint.x - this.offsetX + data.scrollX,
            y: topPoint.y - this.offsetY + data.scrollY,
        };
    };
    //相对于页面
    Viewport.prototype.getElementRect = function (element) {
        var rect = element.getBoundingClientRect();
        var offsetWidth = element['offsetWidth']
            ? element['offsetWidth']
            : rect.width;
        var offsetHeight = element['offsetHeight']
            ? element['offsetHeight']
            : rect.height;
        return new Rect(rect.x, rect.y, this.scale !== 1 ? offsetWidth : rect.width, this.scale !== 1 ? offsetHeight : rect.height);
    };
    //相对于页面
    Viewport.prototype.getElementRectById = function (id) {
        var _this = this;
        var elements = this.findElementsById(id);
        var rect = calcBoundingRect(elements.map(function (element) { return _this.getElementRect(element); }));
        if (rect) {
            if (this.isIframe) {
                return new Rect(rect.x + this.offsetX, rect.y + this.offsetY, rect.width, rect.height);
            }
            else {
                return new Rect(rect.x, rect.y, rect.width, rect.height);
            }
        }
    };
    //相对于视口
    Viewport.prototype.getElementOffsetRect = function (element) {
        var elementRect = element.getBoundingClientRect();
        if (elementRect) {
            if (this.isIframe) {
                return new Rect(elementRect.x + this.contentWindow.scrollX, elementRect.y + this.contentWindow.scrollY, elementRect.width, elementRect.height);
            }
            else {
                return new Rect((elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
                    this.scale, (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
                    this.scale, elementRect.width, elementRect.height);
            }
        }
    };
    //相对于视口
    Viewport.prototype.getElementOffsetRectById = function (id) {
        var _this = this;
        var elements = this.findElementsById(id);
        if (!elements.length)
            return;
        var elementRect = calcBoundingRect(elements.map(function (element) { return _this.getElementRect(element); }));
        if (elementRect) {
            if (this.isIframe) {
                return new Rect(elementRect.x + this.contentWindow.scrollX, elementRect.y + this.contentWindow.scrollY, elementRect.width, elementRect.height);
            }
            else {
                return new Rect((elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
                    this.scale, (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
                    this.scale, elementRect.width, elementRect.height);
            }
        }
    };
    Viewport.prototype.getValidNodeElement = function (node) {
        var _this = this;
        var getNodeElement = function (node) {
            if (!node)
                return;
            var ele = _this.findElementById(node.id);
            if (ele) {
                return ele;
            }
            else {
                return getNodeElement(node.parent);
            }
        };
        return getNodeElement(node);
    };
    Viewport.prototype.getChildrenRect = function (node) {
        var _this = this;
        var _a;
        if (!((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length))
            return;
        return calcBoundingRect(node.children.reduce(function (buf, child) {
            var rect = _this.getValidNodeRect(child);
            if (rect) {
                return buf.concat(rect);
            }
            return buf;
        }, []));
    };
    Viewport.prototype.getChildrenOffsetRect = function (node) {
        var _this = this;
        var _a;
        if (!((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length))
            return;
        return calcBoundingRect(node.children.reduce(function (buf, child) {
            var rect = _this.getValidNodeOffsetRect(child);
            if (rect) {
                return buf.concat(rect);
            }
            return buf;
        }, []));
    };
    Viewport.prototype.getValidNodeRect = function (node) {
        if (!node)
            return;
        var rect = this.getElementRectById(node.id);
        if (node && node === node.root && node.isInOperation) {
            if (!rect)
                return this.rect;
            return calcBoundingRect([this.rect, rect]);
        }
        if (rect) {
            return rect;
        }
        else {
            return this.getChildrenRect(node);
        }
    };
    Viewport.prototype.getValidNodeOffsetRect = function (node) {
        if (!node)
            return;
        var rect = this.getElementOffsetRectById(node.id);
        if (node && node === node.root && node.isInOperation) {
            if (!rect)
                return this.innerRect;
            return calcBoundingRect([this.innerRect, rect]);
        }
        if (rect) {
            return rect;
        }
        else {
            return this.getChildrenOffsetRect(node);
        }
    };
    Viewport.prototype.getValidNodeLayout = function (node) {
        var _a, _b;
        if (!node)
            return 'vertical';
        if ((_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.designerProps) === null || _b === void 0 ? void 0 : _b.inlineChildrenLayout)
            return 'horizontal';
        return calcElementLayout(this.findElementById(node.id));
    };
    return Viewport;
}());
export { Viewport };
