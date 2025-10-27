/**
 * A doubly linked list-based Least Recently Used (LRU) cache. Will keep most
 * recently used items while discarding least recently used items when its limit
 * is reached.
 *
 * Licensed under MIT. Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 * See README.md for details.
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 */
/* eslint-disable */
var NEWER = Symbol('newer');
var OLDER = Symbol('older');
function Entry(key, value) {
    this.key = key;
    this.value = value;
    this[NEWER] = undefined;
    this[OLDER] = undefined;
}
var LRUMap = /** @class */ (function () {
    function LRUMap(limit, entries) {
        if (typeof limit !== 'number') {
            // called as (entries)
            entries = limit;
            limit = 0;
        }
        this.size = 0;
        this.limit = limit;
        this.oldest = this.newest = undefined;
        this._keymap = new Map();
        if (entries) {
            this.assign(entries);
            if (limit < 1) {
                this.limit = this.size;
            }
        }
    }
    LRUMap.prototype._markEntryAsUsed = function (entry) {
        if (entry === this.newest) {
            // Already the most recenlty used entry, so no need to update the list
            return;
        }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry[NEWER]) {
            if (entry === this.oldest) {
                this.oldest = entry[NEWER];
            }
            entry[NEWER][OLDER] = entry[OLDER]; // C <-- E.
        }
        if (entry[OLDER]) {
            entry[OLDER][NEWER] = entry[NEWER]; // C. --> E
        }
        entry[NEWER] = undefined; // D --x
        entry[OLDER] = this.newest; // D. --> E
        if (this.newest) {
            this.newest[NEWER] = entry; // E. <-- D
        }
        this.newest = entry;
    };
    LRUMap.prototype.assign = function (entries) {
        var entry;
        var limit = this.limit || Number.MAX_VALUE;
        this._keymap.clear();
        var it = entries[Symbol.iterator]();
        for (var itv = it.next(); !itv.done; itv = it.next()) {
            var e = new Entry(itv.value[0], itv.value[1]);
            this._keymap.set(e.key, e);
            if (!entry) {
                this.oldest = e;
            }
            else {
                entry[NEWER] = e;
                e[OLDER] = entry;
            }
            entry = e;
            if (limit-- === 0) {
                throw new Error('overflow');
            }
        }
        this.newest = entry;
        this.size = this._keymap.size;
    };
    LRUMap.prototype.get = function (key) {
        // First, find our cache entry
        var entry = this._keymap.get(key);
        if (!entry) {
            return;
        } // Not cached. Sorry.
        // As <key> was found in the cache, register it as being requested recently
        this._markEntryAsUsed(entry);
        return entry.value;
    };
    LRUMap.prototype.set = function (key, value) {
        var entry = this._keymap.get(key);
        if (entry) {
            // update existing
            entry.value = value;
            this._markEntryAsUsed(entry);
            return this;
        }
        // new entry
        this._keymap.set(key, (entry = new Entry(key, value)));
        if (this.newest) {
            // link previous tail to the new tail (entry)
            this.newest[NEWER] = entry;
            entry[OLDER] = this.newest;
        }
        else {
            // we're first in -- yay
            this.oldest = entry;
        }
        // add new entry to the end of the linked list -- it's now the freshest entry.
        this.newest = entry;
        ++this.size;
        if (this.size > this.limit) {
            // we hit the limit -- remove the head
            this.shift();
        }
        return this;
    };
    LRUMap.prototype.shift = function () {
        // todo: handle special case when limit == 1
        var entry = this.oldest;
        if (entry) {
            if (this.oldest[NEWER]) {
                // advance the list
                this.oldest = this.oldest[NEWER];
                this.oldest[OLDER] = undefined;
            }
            else {
                // the cache is exhausted
                this.oldest = undefined;
                this.newest = undefined;
            }
            // Remove last strong reference to <entry> and remove links from the purged
            // entry being returned:
            entry[NEWER] = entry[OLDER] = undefined;
            this._keymap.delete(entry.key);
            --this.size;
            return [entry.key, entry.value];
        }
    };
    LRUMap.prototype.find = function (key) {
        var e = this._keymap.get(key);
        return e ? e.value : undefined;
    };
    LRUMap.prototype.has = function (key) {
        return this._keymap.has(key);
    };
    LRUMap.prototype.delete = function (key) {
        var entry = this._keymap.get(key);
        if (!entry) {
            return;
        }
        this._keymap.delete(entry.key);
        if (entry[NEWER] && entry[OLDER]) {
            // relink the older entry with the newer entry
            entry[OLDER][NEWER] = entry[NEWER];
            entry[NEWER][OLDER] = entry[OLDER];
        }
        else if (entry[NEWER]) {
            // remove the link to us
            entry[NEWER][OLDER] = undefined;
            // link the newer entry to head
            this.oldest = entry[NEWER];
        }
        else if (entry[OLDER]) {
            // remove the link to us
            entry[OLDER][NEWER] = undefined;
            // link the newer entry to head
            this.newest = entry[OLDER];
        }
        else {
            // if(entry[OLDER] === undefined && entry.newer === undefined) {
            this.oldest = this.newest = undefined;
        }
        this.size--;
        return entry.value;
    };
    LRUMap.prototype.clear = function () {
        // Not clearing links should be safe, as we don't expose live links to user
        this.oldest = this.newest = undefined;
        this.size = 0;
        this._keymap.clear();
    };
    LRUMap.prototype.keys = function () {
        return new KeyIterator(this.oldest);
    };
    LRUMap.prototype.values = function () {
        return new ValueIterator(this.oldest);
    };
    LRUMap.prototype.entries = function () { };
    LRUMap.prototype.forEach = function (fun, thisObj) {
        if (typeof thisObj !== 'object') {
            thisObj = this;
        }
        var entry = this.oldest;
        while (entry) {
            fun.call(thisObj, entry.value, entry.key, this);
            entry = entry[NEWER];
        }
    };
    LRUMap.prototype.toJSON = function () {
        var s = new Array(this.size);
        var i = 0;
        var entry = this.oldest;
        while (entry) {
            s[i++] = { key: entry.key, value: entry.value };
            entry = entry[NEWER];
        }
        return s;
    };
    LRUMap.prototype.toString = function () {
        var s = '';
        var entry = this.oldest;
        while (entry) {
            s += String(entry.key) + ':' + entry.value;
            entry = entry[NEWER];
            if (entry) {
                s += ' < ';
            }
        }
        return s;
    };
    LRUMap.prototype[Symbol.iterator] = function () {
        return new EntryIterator(this.oldest);
    };
    return LRUMap;
}());
export { LRUMap };
var EntryIterator = /** @class */ (function () {
    function EntryIterator(oldestEntry) {
        this.entry = oldestEntry;
    }
    EntryIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    EntryIterator.prototype.next = function () {
        var ent = this.entry;
        if (ent) {
            this.entry = ent[NEWER];
            return { done: false, value: [ent.key, ent.value] };
        }
        else {
            return { done: true, value: undefined };
        }
    };
    return EntryIterator;
}());
var KeyIterator = /** @class */ (function () {
    function KeyIterator(oldestEntry) {
        this.entry = oldestEntry;
    }
    KeyIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    KeyIterator.prototype.next = function () {
        var ent = this.entry;
        if (ent) {
            this.entry = ent[NEWER];
            return { done: false, value: ent.key };
        }
        else {
            return { done: true, value: undefined };
        }
    };
    return KeyIterator;
}());
var ValueIterator = /** @class */ (function () {
    function ValueIterator(oldestEntry) {
        this.entry = oldestEntry;
    }
    ValueIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    ValueIterator.prototype.next = function () {
        var ent = this.entry;
        if (ent) {
            this.entry = ent[NEWER];
            return { done: false, value: ent.value };
        }
        else {
            return { done: true, value: undefined };
        }
    };
    return ValueIterator;
}());
