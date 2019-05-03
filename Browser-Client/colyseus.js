(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Colyseus = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Schema_1 = require("./Schema");
var ArraySchema_1 = require("./types/ArraySchema");
var MapSchema_1 = require("./types/MapSchema");
var ChangeTree = /** @class */ (function () {
    function ChangeTree(parentField, parent, trackAllChanges) {
        if (parentField === void 0) { parentField = null; }
        if (trackAllChanges === void 0) { trackAllChanges = false; }
        this.changed = false;
        this.changes = [];
        this.allChanges = [];
        this.linkedTrees = [];
        this.parent = parent;
        this.parentField = parentField;
        this.trackAllChanges = trackAllChanges;
    }
    ChangeTree.prototype.link = function (linkedTree) {
        this.linkedTrees.push(linkedTree);
    };
    ChangeTree.prototype.change = function (field, isDelete) {
        if (isDelete === void 0) { isDelete = false; }
        this.changed = true;
        if (this.changes.indexOf(field) === -1) {
            this.changes.push(field);
        }
        var allChangesIndex = this.allChanges.indexOf(field);
        if (!isDelete && allChangesIndex === -1) {
            this.allChanges.push(field);
        }
        else if (isDelete && allChangesIndex >= 0) {
            // discard all-changes for removed items.
            this.allChanges.splice(allChangesIndex, 1);
        }
        if (this.parent) {
            this.parent.change(this.parentField);
        }
    };
    ChangeTree.prototype.mapIndex = function (instance, key) {
        if (!this.indexMap) {
            this.indexMap = new Map();
            this.indexChange = new Map();
        }
        this.indexMap.set(instance, key);
    };
    ChangeTree.prototype.getIndex = function (instance) {
        return this.indexMap && this.indexMap.get(instance);
    };
    ChangeTree.prototype.deleteIndex = function (instance) {
        this.indexMap.delete(instance);
    };
    ChangeTree.prototype.mapIndexChange = function (instance, key) {
        this.indexChange.set(instance, key);
    };
    ChangeTree.prototype.getIndexChange = function (instance) {
        return this.indexChange && this.indexChange.get(instance);
    };
    ChangeTree.prototype.deleteIndexChange = function (instance) {
        this.indexChange.delete(instance);
    };
    ChangeTree.prototype.changeAll = function (obj) {
        if (obj instanceof Schema_1.Schema) {
            var schema = obj._schema;
            for (var field in schema) {
                // ensure ArraySchema and MapSchema already initialized
                // on its structure have a valid parent.
                if ((obj[field] instanceof Schema_1.Schema ||
                    obj[field] instanceof ArraySchema_1.ArraySchema ||
                    obj[field] instanceof MapSchema_1.MapSchema) &&
                    !obj[field].$changes.parent.parent) {
                    obj[field].$changes.parent = this;
                }
                this.change(field);
            }
        }
        else {
            var keys = Object.keys(obj);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                this.change(key);
            }
        }
    };
    ChangeTree.prototype.discard = function () {
        this.changed = false;
        this.changes = [];
        if (this.indexChange) {
            this.indexChange.clear();
        }
    };
    return ChangeTree;
}());
exports.ChangeTree = ChangeTree;

},{"./Schema":3,"./types/ArraySchema":9,"./types/MapSchema":10}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var annotations_1 = require("./annotations");
var Schema_1 = require("./Schema");
var ArraySchema_1 = require("./types/ArraySchema");
var MapSchema_1 = require("./types/MapSchema");
var reflectionContext = new annotations_1.Context();
/**
 * Reflection
 */
var ReflectionField = /** @class */ (function (_super) {
    __extends(ReflectionField, _super);
    function ReflectionField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        annotations_1.type("string", reflectionContext)
    ], ReflectionField.prototype, "name", void 0);
    __decorate([
        annotations_1.type("string", reflectionContext)
    ], ReflectionField.prototype, "type", void 0);
    __decorate([
        annotations_1.type("uint8", reflectionContext)
    ], ReflectionField.prototype, "referencedType", void 0);
    return ReflectionField;
}(Schema_1.Schema));
exports.ReflectionField = ReflectionField;
var ReflectionType = /** @class */ (function (_super) {
    __extends(ReflectionType, _super);
    function ReflectionType() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = new ArraySchema_1.ArraySchema();
        return _this;
    }
    __decorate([
        annotations_1.type("uint8", reflectionContext)
    ], ReflectionType.prototype, "id", void 0);
    __decorate([
        annotations_1.type([ReflectionField], reflectionContext)
    ], ReflectionType.prototype, "fields", void 0);
    return ReflectionType;
}(Schema_1.Schema));
exports.ReflectionType = ReflectionType;
var Reflection = /** @class */ (function (_super) {
    __extends(Reflection, _super);
    function Reflection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.types = new ArraySchema_1.ArraySchema();
        return _this;
    }
    Reflection.encode = function (instance) {
        var rootSchemaType = instance.constructor;
        var reflection = new Reflection();
        reflection.rootType = rootSchemaType._typeid;
        var buildType = function (currentType, schema) {
            for (var fieldName in schema) {
                var field = new ReflectionField();
                field.name = fieldName;
                var fieldType = void 0;
                if (typeof (schema[fieldName]) === "string") {
                    fieldType = schema[fieldName];
                }
                else {
                    var isSchema = typeof (schema[fieldName]) === "function";
                    var isArray = Array.isArray(schema[fieldName]);
                    var isMap = !isArray && schema[fieldName].map;
                    var childTypeSchema = void 0;
                    if (isSchema) {
                        fieldType = "ref";
                        childTypeSchema = schema[fieldName];
                    }
                    else if (isArray) {
                        fieldType = "array";
                        if (typeof (schema[fieldName][0]) === "string") {
                            fieldType += ":" + schema[fieldName][0]; // array:string
                        }
                        else {
                            childTypeSchema = schema[fieldName][0];
                        }
                    }
                    else if (isMap) {
                        fieldType = "map";
                        if (typeof (schema[fieldName].map) === "string") {
                            fieldType += ":" + schema[fieldName].map; // array:string
                        }
                        else {
                            childTypeSchema = schema[fieldName].map;
                        }
                    }
                    field.referencedType = (childTypeSchema)
                        ? childTypeSchema._typeid
                        : 255;
                }
                field.type = fieldType;
                currentType.fields.push(field);
            }
            reflection.types.push(currentType);
        };
        var types = rootSchemaType._context.types;
        for (var typeid in types) {
            var type_1 = new ReflectionType();
            type_1.id = Number(typeid);
            buildType(type_1, types[typeid]._schema);
        }
        return reflection.encodeAll();
    };
    Reflection.decode = function (bytes) {
        var context = new annotations_1.Context();
        var reflection = new Reflection();
        reflection.decode(bytes);
        var schemaTypes = reflection.types.reduce(function (types, reflectionType) {
            types[reflectionType.id] = /** @class */ (function (_super) {
                __extends(_, _super);
                function _() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return _;
            }(Schema_1.Schema));
            return types;
        }, {});
        reflection.types.forEach(function (reflectionType, i) {
            reflectionType.fields.forEach(function (field) {
                var schemaType = schemaTypes[reflectionType.id];
                if (field.referencedType !== undefined) {
                    var refType = schemaTypes[field.referencedType];
                    // map or array of primitive type (255)
                    if (!refType) {
                        refType = field.type.split(":")[1];
                    }
                    if (field.type.indexOf("array") === 0) {
                        annotations_1.type([refType], context)(schemaType.prototype, field.name);
                    }
                    else if (field.type.indexOf("map") === 0) {
                        annotations_1.type({ map: refType }, context)(schemaType.prototype, field.name);
                    }
                    else if (field.type === "ref") {
                        annotations_1.type(refType, context)(schemaType.prototype, field.name);
                    }
                }
                else {
                    annotations_1.type(field.type, context)(schemaType.prototype, field.name);
                }
            });
        });
        var rootType = schemaTypes[reflection.rootType];
        var rootInstance = new rootType();
        /**
         * auto-initialize referenced types on root type
         * to allow registering listeners immediatelly on client-side
         */
        for (var fieldName in rootType._schema) {
            var fieldType = rootType._schema[fieldName];
            if (typeof (fieldType) !== "string") {
                var isSchema = typeof (fieldType) === "function";
                var isArray = Array.isArray(fieldType);
                var isMap = !isArray && fieldType.map;
                rootInstance[fieldName] = (isArray)
                    ? new ArraySchema_1.ArraySchema()
                    : (isMap)
                        ? new MapSchema_1.MapSchema()
                        : (isSchema)
                            ? new fieldType()
                            : undefined;
            }
        }
        return rootInstance;
    };
    __decorate([
        annotations_1.type([ReflectionType], reflectionContext)
    ], Reflection.prototype, "types", void 0);
    __decorate([
        annotations_1.type("uint8", reflectionContext)
    ], Reflection.prototype, "rootType", void 0);
    return Reflection;
}(Schema_1.Schema));
exports.Reflection = Reflection;

},{"./Schema":3,"./annotations":4,"./types/ArraySchema":9,"./types/MapSchema":10}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var spec_1 = require("./spec");
var encode = require("./encoding/encode");
var decode = require("./encoding/decode");
var ArraySchema_1 = require("./types/ArraySchema");
var MapSchema_1 = require("./types/MapSchema");
var ChangeTree_1 = require("./ChangeTree");
var EncodeSchemaError = /** @class */ (function (_super) {
    __extends(EncodeSchemaError, _super);
    function EncodeSchemaError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EncodeSchemaError;
}(Error));
function assertType(value, type, klass, field) {
    var typeofTarget;
    var allowNull = false;
    switch (type) {
        case "number":
        case "int8":
        case "uint8":
        case "int16":
        case "uint16":
        case "int32":
        case "uint32":
        case "int64":
        case "uint64":
        case "float32":
        case "float64":
            typeofTarget = "number";
            break;
        case "string":
            typeofTarget = "string";
            allowNull = true;
            break;
        case "boolean":
            // boolean is always encoded as true/false based on truthiness
            return;
    }
    if (typeof (value) !== typeofTarget && (!allowNull || (allowNull && value !== null))) {
        var foundValue = "'" + JSON.stringify(value) + "'" + (value && value.constructor && " (" + value.constructor.name + ")");
        throw new EncodeSchemaError("a '" + typeofTarget + "' was expected, but " + foundValue + " was provided in " + klass.constructor.name + "#" + field);
    }
}
function assertInstanceType(value, type, klass, field) {
    if (!(value instanceof type)) {
        throw new EncodeSchemaError("a '" + type.name + "' was expected, but '" + value.constructor.name + "' was provided in " + klass.constructor.name + "#" + field);
    }
}
function encodePrimitiveType(type, bytes, value, klass, field) {
    var encodeFunc = encode[type];
    if (value === undefined) {
        bytes.push(spec_1.NIL);
    }
    else {
        assertType(value, type, klass, field);
    }
    if (encodeFunc) {
        encodeFunc(bytes, value);
        return true;
    }
    else {
        return false;
    }
}
function decodePrimitiveType(type, bytes, it) {
    var decodeFunc = decode[type];
    if (decodeFunc) {
        return decodeFunc(bytes, it);
    }
    else {
        return null;
    }
}
/**
 * Schema encoder / decoder
 */
var Schema = /** @class */ (function () {
    // allow inherited classes to have a constructor
    function Schema() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // fix enumerability of fields for end-user
        Object.defineProperties(this, {
            $changes: { value: new ChangeTree_1.ChangeTree(), enumerable: false, writable: true },
        });
        var descriptors = this._descriptors;
        if (descriptors) {
            Object.defineProperties(this, descriptors);
        }
    }
    Object.defineProperty(Schema.prototype, "_schema", {
        get: function () { return this.constructor._schema; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_descriptors", {
        get: function () { return this.constructor._descriptors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_indexes", {
        get: function () { return this.constructor._indexes; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "_filters", {
        get: function () { return this.constructor._filters; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "$changed", {
        get: function () { return this.$changes.changed; },
        enumerable: true,
        configurable: true
    });
    Schema.prototype.decode = function (bytes, it) {
        if (it === void 0) { it = { offset: 0 }; }
        var changes = [];
        var schema = this._schema;
        var indexes = this._indexes;
        var fieldsByIndex = {};
        Object.keys(indexes).forEach(function (key) {
            var value = indexes[key];
            fieldsByIndex[value] = key;
        });
        var totalBytes = bytes.length;
        // skip TYPE_ID of existing instances
        if (bytes[it.offset] === spec_1.TYPE_ID) {
            it.offset += 2;
        }
        var _loop_1 = function () {
            var index = bytes[it.offset++];
            if (index === spec_1.END_OF_STRUCTURE) {
                return "break";
            }
            var field = fieldsByIndex[index];
            var type = schema[field];
            var value = void 0;
            var change = void 0; // for triggering onChange 
            var hasChange = false;
            if (type._schema) {
                if (decode.nilCheck(bytes, it)) {
                    it.offset++;
                    value = null;
                }
                else {
                    value = this_1["_" + field] || this_1.createTypeInstance(bytes, it, type);
                    value.decode(bytes, it);
                }
                hasChange = true;
            }
            else if (Array.isArray(type)) {
                type = type[0];
                change = [];
                var valueRef_1 = this_1["_" + field] || new ArraySchema_1.ArraySchema();
                value = valueRef_1.clone();
                var newLength_1 = decode.number(bytes, it);
                var numChanges = Math.min(decode.number(bytes, it), newLength_1);
                hasChange = (numChanges > 0);
                // FIXME: this may not be reliable. possibly need to encode this variable during
                // serializagion
                var hasIndexChange = false;
                // ensure current array has the same length as encoded one
                if (value.length > newLength_1) {
                    // decrease removed items from number of changes.
                    // no need to iterate through them, as they're going to be removed.
                    value.splice(newLength_1).forEach(function (itemRemoved, i) {
                        if (itemRemoved && itemRemoved.onRemove) {
                            itemRemoved.onRemove();
                        }
                        if (valueRef_1.onRemove) {
                            valueRef_1.onRemove(itemRemoved, newLength_1 + i);
                        }
                    });
                }
                for (var i = 0; i < numChanges; i++) {
                    var newIndex = decode.number(bytes, it);
                    var indexChangedFrom = void 0; // index change check
                    if (decode.indexChangeCheck(bytes, it)) {
                        decode.uint8(bytes, it);
                        indexChangedFrom = decode.number(bytes, it);
                        hasIndexChange = true;
                    }
                    var isNew = (!hasIndexChange && !value[newIndex]) || (hasIndexChange && indexChangedFrom === undefined);
                    if (type.prototype instanceof Schema) {
                        var item = void 0;
                        if (isNew) {
                            item = this_1.createTypeInstance(bytes, it, type);
                        }
                        else if (indexChangedFrom !== undefined) {
                            item = valueRef_1[indexChangedFrom];
                        }
                        else {
                            item = valueRef_1[newIndex];
                        }
                        if (!item) {
                            item = this_1.createTypeInstance(bytes, it, type);
                            isNew = true;
                        }
                        if (decode.nilCheck(bytes, it)) {
                            it.offset++;
                            if (valueRef_1.onRemove) {
                                valueRef_1.onRemove(item, newIndex);
                            }
                            continue;
                        }
                        item.decode(bytes, it);
                        value[newIndex] = item;
                    }
                    else {
                        value[newIndex] = decodePrimitiveType(type, bytes, it);
                    }
                    if (isNew) {
                        if (valueRef_1.onAdd) {
                            valueRef_1.onAdd(value[newIndex], newIndex);
                        }
                    }
                    else if (valueRef_1.onChange) {
                        valueRef_1.onChange(value[newIndex], newIndex);
                    }
                    change.push(value[newIndex]);
                }
            }
            else if (type.map) {
                type = type.map;
                var valueRef = this_1["_" + field] || new MapSchema_1.MapSchema();
                value = valueRef.clone();
                var length = decode.number(bytes, it);
                hasChange = (length > 0);
                // FIXME: this may not be reliable. possibly need to encode this variable during
                // serializagion
                var hasIndexChange = false;
                var previousKeys = Object.keys(valueRef);
                for (var i = 0; i < length; i++) {
                    // `encodeAll` may indicate a higher number of indexes it actually encodes
                    // TODO: do not encode a higher number than actual encoded entries
                    if (bytes[it.offset] === undefined ||
                        bytes[it.offset] === spec_1.END_OF_STRUCTURE) {
                        break;
                    }
                    // index change check
                    var previousKey = void 0;
                    if (decode.indexChangeCheck(bytes, it)) {
                        decode.uint8(bytes, it);
                        previousKey = previousKeys[decode.number(bytes, it)];
                        hasIndexChange = true;
                    }
                    var hasMapIndex = decode.numberCheck(bytes, it);
                    var isSchemaType = typeof (type) !== "string";
                    var newKey = (hasMapIndex)
                        ? previousKeys[decode.number(bytes, it)]
                        : decode.string(bytes, it);
                    var item = void 0;
                    var isNew = (!hasIndexChange && !valueRef[newKey]) || (hasIndexChange && previousKey === undefined && hasMapIndex);
                    if (isNew && isSchemaType) {
                        item = this_1.createTypeInstance(bytes, it, type);
                    }
                    else if (previousKey !== undefined) {
                        item = valueRef[previousKey];
                    }
                    else {
                        item = valueRef[newKey];
                    }
                    if (decode.nilCheck(bytes, it)) {
                        it.offset++;
                        if (item && item.onRemove) {
                            item.onRemove();
                        }
                        if (valueRef.onRemove) {
                            valueRef.onRemove(item, newKey);
                        }
                        delete value[newKey];
                        continue;
                    }
                    else if (!isSchemaType) {
                        value[newKey] = decodePrimitiveType(type, bytes, it);
                    }
                    else {
                        item.decode(bytes, it);
                        value[newKey] = item;
                    }
                    if (isNew) {
                        if (valueRef.onAdd) {
                            valueRef.onAdd(item, newKey);
                        }
                    }
                    else if (valueRef.onChange) {
                        valueRef.onChange(item, newKey);
                    }
                }
            }
            else {
                value = decodePrimitiveType(type, bytes, it);
                hasChange = true;
            }
            if (hasChange && this_1.onChange) {
                changes.push({
                    field: field,
                    value: change || value,
                    previousValue: this_1["_" + field]
                });
            }
            this_1["_" + field] = value;
        };
        var this_1 = this;
        while (it.offset < totalBytes) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        if (this.onChange && changes.length > 0) {
            this.onChange(changes);
        }
        return this;
    };
    Schema.prototype.encode = function (root, encodeAll, client) {
        var _this = this;
        if (root === void 0) { root = this; }
        if (encodeAll === void 0) { encodeAll = false; }
        var encodedBytes = [];
        var endStructure = function () {
            if (_this !== root) {
                encodedBytes.push(spec_1.END_OF_STRUCTURE);
            }
        };
        // skip if nothing has changed
        if (!this.$changes.changed && !encodeAll) {
            endStructure();
            return encodedBytes;
        }
        var schema = this._schema;
        var indexes = this._indexes;
        var filters = this._filters;
        var changes = (encodeAll || client)
            ? this.$changes.allChanges
            : this.$changes.changes;
        var _loop_2 = function (i, l) {
            var field = changes[i];
            var type = schema[field];
            var filter = (filters && filters[field]);
            // const value = (filter && this.$allChanges[field]) || changes[field];
            var value = this_2["_" + field];
            var fieldIndex = indexes[field];
            // skip unchagned fields
            if (value === undefined) {
                return "continue";
            }
            var bytes = [];
            if (type._schema) {
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                encode.number(bytes, fieldIndex);
                // encode child object
                if (value) {
                    assertInstanceType(value, type, this_2, field);
                    this_2.tryEncodeTypeId(bytes, type, value.constructor);
                    bytes = bytes.concat(value.encode(root, encodeAll, client));
                }
                else {
                    // value has been removed
                    encode.uint8(bytes, spec_1.NIL);
                }
            }
            else if (Array.isArray(type)) {
                encode.number(bytes, fieldIndex);
                // total of items in the array
                encode.number(bytes, value.length);
                var arrayChanges = ((encodeAll || client)
                    ? value.$changes.allChanges
                    : value.$changes.changes).filter(function (index) { return _this["_" + field][index] !== undefined; });
                // ensure number of changes doesn't exceed array length
                var numChanges = arrayChanges.length;
                // number of changed items
                encode.number(bytes, numChanges);
                var isChildSchema = typeof (type[0]) !== "string";
                // assert ArraySchema was provided
                assertInstanceType(this_2["_" + field], ArraySchema_1.ArraySchema, this_2, field);
                // encode Array of type
                for (var j = 0; j < numChanges; j++) {
                    var index = arrayChanges[j];
                    var item = this_2["_" + field][index];
                    if (item === undefined) {
                        continue;
                    }
                    if (client && filter) {
                        // skip if not allowed by custom filter
                        if (!filter.call(this_2, client, item, root)) {
                            continue;
                        }
                    }
                    if (isChildSchema) { // is array of Schema
                        encode.number(bytes, index);
                        var indexChange = value.$changes.getIndexChange(item);
                        if (indexChange !== undefined) {
                            encode.uint8(bytes, spec_1.INDEX_CHANGE);
                            encode.number(bytes, indexChange);
                        }
                        assertInstanceType(item, type[0], this_2, field);
                        this_2.tryEncodeTypeId(bytes, type[0], item.constructor);
                        bytes = bytes.concat(item.encode(root, encodeAll, client));
                    }
                    else {
                        encode.number(bytes, index);
                        if (!encodePrimitiveType(type[0], bytes, item, this_2, field)) {
                            console.log("cannot encode", schema[field]);
                            continue;
                        }
                    }
                }
                if (!encodeAll) {
                    value.$changes.discard();
                }
            }
            else if (type.map) {
                // encode Map of type
                encode.number(bytes, fieldIndex);
                // TODO: during `encodeAll`, removed entries are not going to be encoded
                var keys = (encodeAll || client)
                    ? value.$changes.allChanges
                    : value.$changes.changes;
                encode.number(bytes, keys.length);
                var previousKeys = Object.keys(this_2["_" + field]);
                var isChildSchema = typeof (type.map) !== "string";
                // assert MapSchema was provided
                assertInstanceType(this_2["_" + field], MapSchema_1.MapSchema, this_2, field);
                for (var i_1 = 0; i_1 < keys.length; i_1++) {
                    var key = (typeof (keys[i_1]) === "number" && previousKeys[keys[i_1]]) || keys[i_1];
                    var item = this_2["_" + field][key];
                    var mapItemIndex = this_2["_" + field]._indexes.get(key);
                    if (client && filter) {
                        // skip if not allowed by custom filter
                        if (!filter.call(this_2, client, item, root)) {
                            continue;
                        }
                    }
                    if (encodeAll) {
                        if (item !== undefined) {
                            mapItemIndex = undefined;
                        }
                        else {
                            // previously deleted items are skipped during `encodeAll`
                            continue;
                        }
                    }
                    // encode index change
                    var indexChange = value.$changes.getIndexChange(item);
                    if (item && indexChange !== undefined) {
                        encode.uint8(bytes, spec_1.INDEX_CHANGE);
                        encode.number(bytes, this_2["_" + field]._indexes.get(indexChange));
                    }
                    if (mapItemIndex !== undefined) {
                        encode.number(bytes, mapItemIndex);
                    }
                    else {
                        // TODO: remove item
                        encode.string(bytes, key);
                    }
                    if (item && isChildSchema) {
                        assertInstanceType(item, type.map, this_2, field);
                        this_2.tryEncodeTypeId(bytes, type.map, item.constructor);
                        bytes = bytes.concat(item.encode(root, encodeAll, client));
                    }
                    else if (item !== undefined) {
                        encodePrimitiveType(type.map, bytes, item, this_2, field);
                    }
                    else {
                        encode.uint8(bytes, spec_1.NIL);
                    }
                }
                if (!encodeAll) {
                    value.$changes.discard();
                    // TODO: track array/map indexes per client?
                    if (!client) {
                        this_2["_" + field]._updateIndexes();
                    }
                }
            }
            else {
                if (client && filter) {
                    // skip if not allowed by custom filter
                    if (!filter.call(this_2, client, value, root)) {
                        return "continue";
                    }
                }
                encode.number(bytes, fieldIndex);
                if (!encodePrimitiveType(type, bytes, value, this_2, field)) {
                    console.log("cannot encode", schema[field]);
                    return "continue";
                }
            }
            encodedBytes = encodedBytes.concat(bytes);
        };
        var this_2 = this;
        for (var i = 0, l = changes.length; i < l; i++) {
            _loop_2(i, l);
        }
        // flag end of Schema object structure
        endStructure();
        if (!encodeAll && !client) {
            this.$changes.discard();
        }
        return encodedBytes;
    };
    Schema.prototype.encodeFiltered = function (client) {
        return this.encode(this, false, client);
    };
    Schema.prototype.encodeAll = function () {
        return this.encode(this, true);
    };
    Schema.prototype.encodeAllFiltered = function (client) {
        return this.encode(this, true, client);
    };
    Schema.prototype.clone = function () {
        var cloned = new (this.constructor);
        var schema = this._schema;
        for (var field in schema) {
            cloned[field] = this[field];
        }
        return cloned;
    };
    Schema.prototype.triggerAll = function () {
        if (!this.onChange) {
            return;
        }
        var changes = [];
        var schema = this._schema;
        for (var field in schema) {
            if (this[field] !== undefined) {
                changes.push({
                    field: field,
                    value: this[field],
                    previousValue: undefined
                });
            }
        }
        this.onChange(changes);
    };
    Schema.prototype.toJSON = function () {
        var schema = this._schema;
        var obj = {};
        for (var field in schema) {
            obj[field] = this["_" + field];
        }
        return obj;
    };
    Schema.prototype.tryEncodeTypeId = function (bytes, type, targetType) {
        if (type._typeid !== targetType._typeid) {
            encode.uint8(bytes, spec_1.TYPE_ID);
            encode.uint8(bytes, targetType._typeid);
        }
    };
    Schema.prototype.createTypeInstance = function (bytes, it, type) {
        if (bytes[it.offset] === spec_1.TYPE_ID) {
            it.offset++;
            var anotherType = this.constructor._context.get(decode.uint8(bytes, it));
            return new anotherType();
        }
        else {
            return new type();
        }
    };
    return Schema;
}());
exports.Schema = Schema;

},{"./ChangeTree":1,"./encoding/decode":5,"./encoding/encode":6,"./spec":8,"./types/ArraySchema":9,"./types/MapSchema":10}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChangeTree_1 = require("./ChangeTree");
var Schema_1 = require("./Schema");
var Context = /** @class */ (function () {
    function Context() {
        this.types = {};
        this.schemas = new Map();
    }
    Context.prototype.has = function (schema) {
        return this.schemas.has(schema);
    };
    Context.prototype.get = function (typeid) {
        return this.types[typeid];
    };
    Context.prototype.add = function (schema) {
        schema._typeid = this.schemas.size;
        this.types[schema._typeid] = schema;
        this.schemas.set(schema, schema._typeid);
    };
    return Context;
}());
exports.Context = Context;
exports.globalContext = new Context();
/**
 * `@type()` decorator for proxies
 */
function type(type, context) {
    if (context === void 0) { context = exports.globalContext; }
    return function (target, field) {
        var constructor = target.constructor;
        constructor._context = context;
        /*
         * static schema
         */
        if (!context.has(constructor)) {
            context.add(constructor);
            // support inheritance
            constructor._schema = Object.assign({}, constructor._schema || {});
            constructor._indexes = Object.assign({}, constructor._indexes || {});
            constructor._descriptors = Object.assign({}, constructor._descriptors || {});
        }
        constructor._indexes[field] = Object.keys(constructor._schema).length;
        constructor._schema[field] = type;
        /**
         * TODO: `isSchema` / `isArray` / `isMap` is repeated on many places!
         * need to refactor all of them.
         */
        var isArray = Array.isArray(type);
        var isMap = !isArray && type.map;
        var fieldCached = "_" + field;
        constructor._descriptors[fieldCached] = {
            enumerable: false,
            configurable: false,
            writable: true,
        };
        constructor._descriptors[field] = {
            get: function () {
                return this[fieldCached];
            },
            set: function (value) {
                /**
                 * Create Proxy for array or map items
                 */
                if (isArray || isMap) {
                    value = new Proxy(value, {
                        get: function (obj, prop) { return obj[prop]; },
                        set: function (obj, prop, setValue) {
                            if (prop !== "length" && prop !== "$changes") {
                                // ensure new value has a parent
                                var key = (isArray) ? Number(prop) : String(prop);
                                var previousIndex = obj.$changes.getIndex(setValue);
                                if (previousIndex !== undefined) {
                                    obj.$changes.mapIndexChange(setValue, previousIndex);
                                }
                                obj.$changes.mapIndex(setValue, key);
                                if (setValue instanceof Schema_1.Schema) {
                                    // new items are flagged with all changes
                                    if (!setValue.$changes.parent) {
                                        setValue.$changes = new ChangeTree_1.ChangeTree(key, obj.$changes);
                                        setValue.$changes.changeAll(setValue);
                                    }
                                }
                                else {
                                    obj[prop] = setValue;
                                }
                                // apply change on ArraySchema / MapSchema
                                obj.$changes.change(key);
                            }
                            else if (setValue !== obj[prop]) {
                                // console.log("SET NEW LENGTH:", setValue);
                                // console.log("PREVIOUS LENGTH: ", obj[prop]);
                            }
                            obj[prop] = setValue;
                            return true;
                        },
                        deleteProperty: function (obj, prop) {
                            var deletedValue = obj[prop];
                            // TODO: 
                            // remove deleteIndex of property being deleted as well.
                            // obj.$changes.deleteIndex(deletedValue);
                            // obj.$changes.deleteIndexChange(deletedValue);
                            delete obj[prop];
                            var key = (isArray) ? Number(prop) : String(prop);
                            obj.$changes.change(key, true);
                            return true;
                        },
                    });
                }
                // skip if value is the same as cached.
                if (value === this[fieldCached]) {
                    return;
                }
                this[fieldCached] = value;
                if (Array.isArray(constructor._schema[field])) {
                    // directly assigning an array of items as value.
                    this.$changes.change(field);
                    value.$changes = new ChangeTree_1.ChangeTree(field, this.$changes);
                    for (var i = 0; i < value.length; i++) {
                        if (value[i] instanceof Schema_1.Schema) {
                            value[i].$changes = new ChangeTree_1.ChangeTree(i, value.$changes);
                            value[i].$changes.changeAll(value[i]);
                        }
                        value.$changes.mapIndex(value[i], i);
                        value.$changes.change(i);
                    }
                }
                else if (constructor._schema[field].map) {
                    // directly assigning a map
                    value.$changes = new ChangeTree_1.ChangeTree(field, this.$changes);
                    this.$changes.change(field);
                    for (var key in value) {
                        if (value[key] instanceof Schema_1.Schema) {
                            value[key].$changes = new ChangeTree_1.ChangeTree(key, value.$changes);
                            value[key].$changes.changeAll(value[key]);
                        }
                        value.$changes.mapIndex(value[key], key);
                        value.$changes.change(key);
                    }
                }
                else if (typeof (constructor._schema[field]) === "function") {
                    // directly assigning a `Schema` object
                    // value may be set to null
                    this.$changes.change(field);
                    if (value) {
                        value.$changes = new ChangeTree_1.ChangeTree(field, this.$changes);
                        value.$changes.changeAll(value);
                    }
                }
                else {
                    // directly assigning a primitive type
                    this.$changes.change(field);
                }
            },
            enumerable: true,
            configurable: true
        };
    };
}
exports.type = type;
/**
 * `@filter()` decorator for defining data filters per client
 */
function filter(cb) {
    return function (target, field) {
        var constructor = target.constructor;
        /*
        * static filters
        */
        if (!constructor._filters) {
            constructor._filters = {};
        }
        constructor._filters[field] = cb;
    };
}
exports.filter = filter;

},{"./ChangeTree":1,"./Schema":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spec_1 = require("../spec");
function utf8Read(bytes, offset, length) {
    var string = '', chr = 0;
    for (var i = offset, end = offset + length; i < end; i++) {
        var byte = bytes[i];
        if ((byte & 0x80) === 0x00) {
            string += String.fromCharCode(byte);
            continue;
        }
        if ((byte & 0xe0) === 0xc0) {
            string += String.fromCharCode(((byte & 0x1f) << 6) |
                (bytes[++i] & 0x3f));
            continue;
        }
        if ((byte & 0xf0) === 0xe0) {
            string += String.fromCharCode(((byte & 0x0f) << 12) |
                ((bytes[++i] & 0x3f) << 6) |
                ((bytes[++i] & 0x3f) << 0));
            continue;
        }
        if ((byte & 0xf8) === 0xf0) {
            chr = ((byte & 0x07) << 18) |
                ((bytes[++i] & 0x3f) << 12) |
                ((bytes[++i] & 0x3f) << 6) |
                ((bytes[++i] & 0x3f) << 0);
            if (chr >= 0x010000) { // surrogate pair
                chr -= 0x010000;
                string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
            }
            else {
                string += String.fromCharCode(chr);
            }
            continue;
        }
        throw new Error('Invalid byte ' + byte.toString(16));
    }
    return string;
}
function int8(bytes, it) {
    return uint8(bytes, it) << 24 >> 24;
}
exports.int8 = int8;
;
function uint8(bytes, it) {
    return bytes[it.offset++];
}
exports.uint8 = uint8;
;
function int16(bytes, it) {
    return uint16(bytes, it) << 16 >> 16;
}
exports.int16 = int16;
;
function uint16(bytes, it) {
    return bytes[it.offset++] | bytes[it.offset++] << 8;
}
exports.uint16 = uint16;
;
function int32(bytes, it) {
    return bytes[it.offset++] | bytes[it.offset++] << 8 | bytes[it.offset++] << 16 | bytes[it.offset++] << 24;
}
exports.int32 = int32;
;
function uint32(bytes, it) {
    return int32(bytes, it) >>> 0;
}
exports.uint32 = uint32;
;
function float32(bytes, it) {
    return readFloat32(bytes, it);
}
exports.float32 = float32;
function float64(bytes, it) {
    return readFloat64(bytes, it);
}
exports.float64 = float64;
function int64(bytes, it) {
    var low = uint32(bytes, it);
    var high = int32(bytes, it) * Math.pow(2, 32);
    return high + low;
}
exports.int64 = int64;
;
function uint64(bytes, it) {
    var low = uint32(bytes, it);
    var high = uint32(bytes, it) * Math.pow(2, 32);
    return high + low;
}
exports.uint64 = uint64;
;
// force little endian to facilitate decoding on multiple implementations
var _isLittleEndian = true; // new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
var _int32 = new Int32Array(2);
var _float32 = new Float32Array(_int32.buffer);
var _float64 = new Float64Array(_int32.buffer);
function readFloat32(bytes, it) {
    _int32[0] = int32(bytes, it);
    return _float32[0];
}
exports.readFloat32 = readFloat32;
;
function readFloat64(bytes, it) {
    _int32[_isLittleEndian ? 0 : 1] = int32(bytes, it);
    _int32[_isLittleEndian ? 1 : 0] = int32(bytes, it);
    return _float64[0];
}
exports.readFloat64 = readFloat64;
;
function boolean(bytes, it) {
    return uint8(bytes, it) > 0;
}
exports.boolean = boolean;
;
function string(bytes, it) {
    var prefix = bytes[it.offset++];
    var length;
    if (prefix < 0xc0) {
        // fixstr
        length = prefix & 0x1f;
    }
    else if (prefix === 0xd9) {
        length = uint8(bytes, it);
    }
    else if (prefix === 0xda) {
        length = uint16(bytes, it);
    }
    else if (prefix === 0xdb) {
        length = uint32(bytes, it);
    }
    var value = utf8Read(bytes, it.offset, length);
    it.offset += length;
    return value;
}
exports.string = string;
function stringCheck(bytes, it) {
    var prefix = bytes[it.offset];
    return (
    // fixstr
    (prefix < 0xc0 && prefix > 0xa0) ||
        // str 8
        prefix === 0xd9 ||
        // str 16
        prefix === 0xda ||
        // str 32
        prefix === 0xdb);
}
exports.stringCheck = stringCheck;
function number(bytes, it) {
    var prefix = bytes[it.offset++];
    if (prefix < 0x80) {
        // positive fixint
        return prefix;
    }
    else if (prefix === 0xca) {
        // float 32
        return readFloat32(bytes, it);
    }
    else if (prefix === 0xcb) {
        // float 64
        return readFloat64(bytes, it);
    }
    else if (prefix === 0xcc) {
        // uint 8
        return uint8(bytes, it);
    }
    else if (prefix === 0xcd) {
        // uint 16
        return uint16(bytes, it);
    }
    else if (prefix === 0xce) {
        // uint 32
        return uint32(bytes, it);
    }
    else if (prefix === 0xcf) {
        // uint 64
        return uint64(bytes, it);
    }
    else if (prefix === 0xd0) {
        // int 8
        return int8(bytes, it);
    }
    else if (prefix === 0xd1) {
        // int 16
        return int16(bytes, it);
    }
    else if (prefix === 0xd2) {
        // int 32
        return int32(bytes, it);
    }
    else if (prefix === 0xd3) {
        // int 64
        return int64(bytes, it);
    }
    else if (prefix > 0xdf) {
        // negative fixint
        return (0xff - prefix + 1) * -1;
    }
}
exports.number = number;
;
function numberCheck(bytes, it) {
    var prefix = bytes[it.offset];
    // positive fixint - 0x00 - 0x7f
    // float 32        - 0xca
    // float 64        - 0xcb
    // uint 8          - 0xcc
    // uint 16         - 0xcd
    // uint 32         - 0xce
    // uint 64         - 0xcf
    // int 8           - 0xd0
    // int 16          - 0xd1
    // int 32          - 0xd2
    // int 64          - 0xd3
    return (prefix < 0x80 ||
        (prefix >= 0xca && prefix <= 0xd3));
}
exports.numberCheck = numberCheck;
function arrayCheck(bytes, it) {
    return bytes[it.offset] < 0xa0;
    // const prefix = bytes[it.offset] ;
    // if (prefix < 0xa0) {
    //   return prefix;
    // // array
    // } else if (prefix === 0xdc) {
    //   it.offset += 2;
    // } else if (0xdd) {
    //   it.offset += 4;
    // }
    // return prefix;
}
exports.arrayCheck = arrayCheck;
function nilCheck(bytes, it) {
    return bytes[it.offset] === spec_1.NIL;
}
exports.nilCheck = nilCheck;
function indexChangeCheck(bytes, it) {
    return bytes[it.offset] === spec_1.INDEX_CHANGE;
}
exports.indexChangeCheck = indexChangeCheck;

},{"../spec":8}],6:[function(require,module,exports){
"use strict";
/**
 * Copyright (c) 2018 Endel Dreyer
 * Copyright (c) 2014 Ion Drive Software Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * msgpack implementation highly based on notepack.io
 * https://github.com/darrachequesne/notepack
 */
function utf8Length(str) {
    var c = 0, length = 0;
    for (var i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            length += 1;
        }
        else if (c < 0x800) {
            length += 2;
        }
        else if (c < 0xd800 || c >= 0xe000) {
            length += 3;
        }
        else {
            i++;
            length += 4;
        }
    }
    return length;
}
function utf8Write(view, offset, str) {
    var c = 0;
    for (var i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            view[offset++] = c;
        }
        else if (c < 0x800) {
            view[offset++] = 0xc0 | (c >> 6);
            view[offset++] = 0x80 | (c & 0x3f);
        }
        else if (c < 0xd800 || c >= 0xe000) {
            view[offset++] = 0xe0 | (c >> 12);
            view[offset++] = 0x80 | (c >> 6 & 0x3f);
            view[offset++] = 0x80 | (c & 0x3f);
        }
        else {
            i++;
            c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            view[offset++] = 0xf0 | (c >> 18);
            view[offset++] = 0x80 | (c >> 12 & 0x3f);
            view[offset++] = 0x80 | (c >> 6 & 0x3f);
            view[offset++] = 0x80 | (c & 0x3f);
        }
    }
}
exports.utf8Write = utf8Write;
function int8(bytes, value) {
    bytes.push(value);
}
exports.int8 = int8;
;
function uint8(bytes, value) {
    bytes.push(value);
}
exports.uint8 = uint8;
;
function int16(bytes, value) {
    bytes.push(value);
    bytes.push(value >> 8);
}
exports.int16 = int16;
;
function uint16(bytes, value) {
    bytes.push(value);
    bytes.push(value >> 8);
}
exports.uint16 = uint16;
;
function int32(bytes, value) {
    bytes.push(value);
    bytes.push(value >> 8);
    bytes.push(value >> 16);
    bytes.push(value >> 24);
}
exports.int32 = int32;
;
function uint32(bytes, value) {
    var b4 = value >> 24;
    var b3 = value >> 16;
    var b2 = value >> 8;
    var b1 = value;
    bytes.push(b1);
    bytes.push(b2);
    bytes.push(b3);
    bytes.push(b4);
}
exports.uint32 = uint32;
;
function int64(bytes, value) {
    var high = Math.floor(value / Math.pow(2, 32));
    var low = value >>> 0;
    uint32(bytes, low);
    uint32(bytes, high);
}
exports.int64 = int64;
;
function uint64(bytes, value) {
    var high = (value / Math.pow(2, 32)) >> 0;
    var low = value >>> 0;
    uint32(bytes, low);
    uint32(bytes, high);
}
exports.uint64 = uint64;
;
function float32(bytes, value) {
    writeFloat32(bytes, value);
}
exports.float32 = float32;
function float64(bytes, value) {
    writeFloat64(bytes, value);
}
exports.float64 = float64;
// force little endian to facilitate decoding on multiple implementations
var _isLittleEndian = true; // new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
var _int32 = new Int32Array(2);
var _float32 = new Float32Array(_int32.buffer);
var _float64 = new Float64Array(_int32.buffer);
function writeFloat32(bytes, value) {
    _float32[0] = value;
    int32(bytes, _int32[0]);
}
exports.writeFloat32 = writeFloat32;
;
function writeFloat64(bytes, value) {
    _float64[0] = value;
    int32(bytes, _int32[_isLittleEndian ? 0 : 1]);
    int32(bytes, _int32[_isLittleEndian ? 1 : 0]);
}
exports.writeFloat64 = writeFloat64;
;
function boolean(bytes, value) {
    return uint8(bytes, value ? 1 : 0);
}
exports.boolean = boolean;
;
function string(bytes, value) {
    // encode `null` strings as empty.
    if (!value) {
        value = "";
    }
    var length = utf8Length(value);
    var size = 0;
    // fixstr
    if (length < 0x20) {
        bytes.push(length | 0xa0);
        size = 1;
    }
    // str 8
    else if (length < 0x100) {
        bytes.push(0xd9);
        uint8(bytes, length);
        size = 2;
    }
    // str 16
    else if (length < 0x10000) {
        bytes.push(0xda);
        uint16(bytes, length);
        size = 3;
    }
    // str 32
    else if (length < 0x100000000) {
        bytes.push(0xdb);
        uint32(bytes, length);
        size = 5;
    }
    else {
        throw new Error('String too long');
    }
    utf8Write(bytes, bytes.length, value);
    return size + length;
}
exports.string = string;
function number(bytes, value) {
    if (isNaN(value)) {
        console.error("trying to encode a NaN value. will be encoded as `0`.");
        return number(bytes, 0);
    }
    else if (!isFinite(value)) {
        return number(bytes, (value > 0) ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER);
    }
    else if (Math.floor(value) !== value || !isFinite(value)) {
        // float 64
        /**
         * TODO:
         * is it possible to differentiate between float32 / float64 here?
         */
        bytes.push(0xcb);
        writeFloat64(bytes, value);
        return 9;
    }
    if (value >= 0) {
        // positive fixnum
        if (value < 0x80) {
            uint8(bytes, value);
            return 1;
        }
        // uint 8
        if (value < 0x100) {
            bytes.push(0xcc);
            uint8(bytes, value);
            return 2;
        }
        // uint 16
        if (value < 0x10000) {
            bytes.push(0xcd);
            uint16(bytes, value);
            return 3;
        }
        // uint 32
        if (value < 0x100000000) {
            bytes.push(0xce);
            uint32(bytes, value);
            return 5;
        }
        // uint 64
        bytes.push(0xcf);
        uint64(bytes, value);
        return 9;
    }
    else {
        // negative fixnum
        if (value >= -0x20) {
            bytes.push(value);
            return 1;
        }
        // int 8
        if (value >= -0x80) {
            bytes.push(0xd0);
            int8(bytes, value);
            return 2;
        }
        // int 16
        if (value >= -0x8000) {
            bytes.push(0xd1);
            int16(bytes, value);
            return 3;
        }
        // int 32
        if (value >= -0x80000000) {
            bytes.push(0xd2);
            int32(bytes, value);
            return 5;
        }
        // int 64
        bytes.push(0xd3);
        int64(bytes, value);
        return 9;
    }
}
exports.number = number;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Schema_1 = require("./Schema");
exports.Schema = Schema_1.Schema;
var MapSchema_1 = require("./types/MapSchema");
exports.MapSchema = MapSchema_1.MapSchema;
var ArraySchema_1 = require("./types/ArraySchema");
exports.ArraySchema = ArraySchema_1.ArraySchema;
// Reflection
var Reflection_1 = require("./Reflection");
exports.Reflection = Reflection_1.Reflection;
exports.ReflectionType = Reflection_1.ReflectionType;
exports.ReflectionField = Reflection_1.ReflectionField;
var annotations_1 = require("./annotations");
// Annotations
exports.type = annotations_1.type;
exports.filter = annotations_1.filter;
// Types
exports.Context = annotations_1.Context;

},{"./Reflection":2,"./Schema":3,"./annotations":4,"./types/ArraySchema":9,"./types/MapSchema":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.END_OF_STRUCTURE = 0xc1; // (msgpack spec: never used)
exports.NIL = 0xc0;
exports.INDEX_CHANGE = 0xd4;
exports.TYPE_ID = 0xd5;

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ArraySchema = /** @class */ (function (_super) {
    __extends(ArraySchema, _super);
    function ArraySchema() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _this = _super.apply(this, items) || this;
        Object.setPrototypeOf(_this, Object.create(ArraySchema.prototype));
        Object.defineProperties(_this, {
            $changes: { value: undefined, enumerable: false, writable: true },
            onAdd: { value: undefined, enumerable: false, writable: true },
            onRemove: { value: undefined, enumerable: false, writable: true },
            onChange: { value: undefined, enumerable: false, writable: true },
            triggerAll: {
                value: function () {
                    if (!_this.onAdd) {
                        return;
                    }
                    for (var i = 0; i < _this.length; i++) {
                        _this.onAdd(_this[i], i);
                    }
                }
            },
            clone: {
                value: function () {
                    var arr = new (ArraySchema.bind.apply(ArraySchema, [void 0].concat(_this)))();
                    arr.onAdd = _this.onAdd;
                    arr.onRemove = _this.onRemove;
                    arr.onChange = _this.onChange;
                    return arr;
                }
            }
        });
        return _this;
    }
    Object.defineProperty(ArraySchema, Symbol.species, {
        get: function () { return Array; },
        enumerable: true,
        configurable: true
    });
    return ArraySchema;
}(Array));
exports.ArraySchema = ArraySchema;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapSchema = /** @class */ (function () {
    function MapSchema(obj) {
        if (obj === void 0) { obj = {}; }
        var _this = this;
        for (var key in obj) {
            this[key] = obj[key];
        }
        Object.defineProperties(this, {
            $changes: { value: undefined, enumerable: false, writable: true },
            onAdd: { value: undefined, enumerable: false, writable: true },
            onRemove: { value: undefined, enumerable: false, writable: true },
            onChange: { value: undefined, enumerable: false, writable: true },
            clone: {
                value: function () {
                    var map = Object.assign(new MapSchema(), _this);
                    map.onAdd = _this.onAdd;
                    map.onRemove = _this.onRemove;
                    map.onChange = _this.onChange;
                    return map;
                }
            },
            triggerAll: {
                value: function () {
                    if (!_this.onAdd) {
                        return;
                    }
                    for (var key in _this) {
                        _this.onAdd(_this[key], key);
                    }
                }
            },
            _indexes: { value: new Map(), enumerable: false, writable: true },
            _updateIndexes: {
                value: function () {
                    var index = 0;
                    var indexes = new Map();
                    for (var key in _this) {
                        indexes.set(key, index++);
                    }
                    _this._indexes = indexes;
                }
            },
        });
    }
    return MapSchema;
}());
exports.MapSchema = MapSchema;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlotList_1 = require("./SlotList");
var Slot_1 = require("./Slot");
var OnceSignal = (function () {
    function OnceSignal() {
        var valueClasses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valueClasses[_i] = arguments[_i];
        }
        this.slots = SlotList_1.SlotList.NIL;
        this.valueClasses = valueClasses.length === 1 && valueClasses[0] instanceof Array ? valueClasses[0] : valueClasses;
    }
    Object.defineProperty(OnceSignal.prototype, "valueClasses", {
        get: function () {
            return this._valueClasses;
        },
        set: function (value) {
            this._valueClasses = value ? value.slice() : [];
            for (var i = this._valueClasses.length; i--;) {
                if (!(this._valueClasses[i] instanceof Object)) {
                    throw new Error("Invalid valueClasses argument: " +
                        "item at index " +
                        i +
                        " should be a Class but was:<" +
                        this._valueClasses[i] +
                        ">." +
                        this._valueClasses[i]);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OnceSignal.prototype, "numListeners", {
        get: function () {
            return this.slots.length;
        },
        enumerable: true,
        configurable: true
    });
    OnceSignal.prototype.addOnce = function (listener) {
        return this.registerListener(listener, true);
    };
    OnceSignal.prototype.once = function (listener) {
        return this.addOnce(listener);
    };
    OnceSignal.prototype.remove = function (listener) {
        var slot = this.slots.find(listener);
        if (!slot) {
            return null;
        }
        this.slots = this.slots.filterNot(listener);
        return slot;
    };
    OnceSignal.prototype.removeAll = function () {
        this.slots = SlotList_1.SlotList.NIL;
    };
    OnceSignal.prototype.dispatch = function () {
        var valueObjects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valueObjects[_i] = arguments[_i];
        }
        var numValueClasses = this._valueClasses.length;
        var numValueObjects = valueObjects.length;
        if (numValueObjects < numValueClasses) {
            throw new Error("Incorrect number of arguments. " + "Expected at least " + numValueClasses + " but received " + numValueObjects + ".");
        }
        for (var i = 0; i < numValueClasses; i++) {
            if (valueObjects[i] === null ||
                (valueObjects[i] instanceof this._valueClasses[i] || valueObjects[i].constructor === this._valueClasses[i])) {
                continue;
            }
            throw new Error("Value object <" + valueObjects[i] + "> is not an instance of <" + this._valueClasses[i] + ">.");
        }
        var slotsToProcess = this.slots;
        if (slotsToProcess.nonEmpty) {
            while (slotsToProcess.nonEmpty) {
                slotsToProcess.head.execute(valueObjects);
                slotsToProcess = slotsToProcess.tail;
            }
        }
    };
    OnceSignal.prototype.registerListener = function (listener, once) {
        if (once === void 0) { once = false; }
        if (this.registrationPossible(listener, once)) {
            var newSlot = new Slot_1.Slot(listener, this, once);
            this.slots = this.slots.prepend(newSlot);
            return newSlot;
        }
        return this.slots.find(listener);
    };
    OnceSignal.prototype.registrationPossible = function (listener, once) {
        if (!this.slots.nonEmpty) {
            return true;
        }
        var existingSlot = this.slots.find(listener);
        if (!existingSlot) {
            return true;
        }
        if (existingSlot.once !== once) {
            throw new Error("You cannot addOnce() then add() the same listener without removing the relationship first.");
        }
        return false;
    };
    return OnceSignal;
}());
exports.OnceSignal = OnceSignal;

},{"./Slot":13,"./SlotList":14}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var OnceSignal_1 = require("./OnceSignal");
var Signal = (function (_super) {
    __extends(Signal, _super);
    function Signal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Signal.prototype.add = function (listener) {
        return this.registerListener(listener);
    };
    return Signal;
}(OnceSignal_1.OnceSignal));
exports.Signal = Signal;

},{"./OnceSignal":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Slot = (function () {
    function Slot(listener, signal, once, priority) {
        if (once === void 0) { once = false; }
        if (priority === void 0) { priority = 0; }
        this._enabled = true;
        this._once = false;
        this._priority = 0;
        this._listener = listener;
        this._once = once;
        this._signal = signal;
        this._priority = priority;
        this.verifyListener(listener);
    }
    Slot.prototype.execute0 = function () {
        if (!this._enabled) {
            return;
        }
        if (this._once) {
            this.remove();
        }
        if (this._params && this._params.length) {
            this._listener.apply(null, this._params);
            return;
        }
        this._listener();
    };
    Slot.prototype.execute1 = function (value) {
        if (!this._enabled) {
            return;
        }
        if (this._once) {
            this.remove();
        }
        if (this._params && this._params.length) {
            this._listener.apply(null, [value].concat(this._params));
            return;
        }
        this._listener(value);
    };
    Slot.prototype.execute = function (valueObjects) {
        if (!this._enabled) {
            return;
        }
        if (this._once) {
            this.remove();
        }
        if (this._params && this._params.length) {
            valueObjects = valueObjects.concat(this._params);
        }
        var numValueObjects = valueObjects.length;
        if (numValueObjects === 0) {
            this._listener();
        }
        else if (numValueObjects === 1) {
            this._listener(valueObjects[0]);
        }
        else if (numValueObjects === 2) {
            this._listener(valueObjects[0], valueObjects[1]);
        }
        else if (numValueObjects === 3) {
            this._listener(valueObjects[0], valueObjects[1], valueObjects[2]);
        }
        else {
            this._listener.apply(null, valueObjects);
        }
    };
    Object.defineProperty(Slot.prototype, "listener", {
        get: function () {
            return this._listener;
        },
        set: function (value) {
            if (null == value) {
                throw new Error("Given listener is null.\nDid you want to set enabled to false instead?");
            }
            this.verifyListener(value);
            this._listener = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "once", {
        get: function () {
            return this._once;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Slot.prototype.toString = function () {
        return ("[Slot listener: " +
            this._listener +
            ", once: " +
            this._once +
            ", priority: " +
            this._priority +
            ", enabled: " +
            this._enabled +
            "]");
    };
    Object.defineProperty(Slot.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (value) {
            this._params = value;
        },
        enumerable: true,
        configurable: true
    });
    Slot.prototype.remove = function () {
        this._signal.remove(this._listener);
    };
    Slot.prototype.verifyListener = function (listener) {
        if (null == listener) {
            throw new Error("Given listener is null.");
        }
        if (null == this._signal) {
            throw new Error("Internal signal reference has not been set yet.");
        }
    };
    return Slot;
}());
exports.Slot = Slot;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SlotList = (function () {
    function SlotList(head, tail) {
        if (tail === void 0) { tail = null; }
        this.nonEmpty = false;
        if (!head && !tail) {
            if (SlotList.NIL) {
                throw new Error("Parameters head and tail are null. Use the NIL element instead.");
            }
            this.nonEmpty = false;
        }
        else if (!head) {
            throw new Error("Parameter head cannot be null.");
        }
        else {
            this.head = head;
            this.tail = tail || SlotList.NIL;
            this.nonEmpty = true;
        }
    }
    Object.defineProperty(SlotList.prototype, "length", {
        get: function () {
            if (!this.nonEmpty) {
                return 0;
            }
            if (this.tail === SlotList.NIL) {
                return 1;
            }
            var result = 0;
            var p = this;
            while (p.nonEmpty) {
                ++result;
                p = p.tail;
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    SlotList.prototype.prepend = function (slot) {
        return new SlotList(slot, this);
    };
    SlotList.prototype.append = function (slot) {
        if (!slot) {
            return this;
        }
        if (!this.nonEmpty) {
            return new SlotList(slot);
        }
        if (this.tail === SlotList.NIL) {
            return new SlotList(slot).prepend(this.head);
        }
        var wholeClone = new SlotList(this.head);
        var subClone = wholeClone;
        var current = this.tail;
        while (current.nonEmpty) {
            subClone = subClone.tail = new SlotList(current.head);
            current = current.tail;
        }
        subClone.tail = new SlotList(slot);
        return wholeClone;
    };
    SlotList.prototype.insertWithPriority = function (slot) {
        if (!this.nonEmpty) {
            return new SlotList(slot);
        }
        var priority = slot.priority;
        if (priority > this.head.priority) {
            return this.prepend(slot);
        }
        var wholeClone = new SlotList(this.head);
        var subClone = wholeClone;
        var current = this.tail;
        while (current.nonEmpty) {
            if (priority > current.head.priority) {
                subClone.tail = current.prepend(slot);
                return wholeClone;
            }
            subClone = subClone.tail = new SlotList(current.head);
            current = current.tail;
        }
        subClone.tail = new SlotList(slot);
        return wholeClone;
    };
    SlotList.prototype.filterNot = function (listener) {
        if (!this.nonEmpty || listener == null) {
            return this;
        }
        if (listener === this.head.listener) {
            return this.tail;
        }
        var wholeClone = new SlotList(this.head);
        var subClone = wholeClone;
        var current = this.tail;
        while (current.nonEmpty) {
            if (current.head.listener === listener) {
                subClone.tail = current.tail;
                return wholeClone;
            }
            subClone = subClone.tail = new SlotList(current.head);
            current = current.tail;
        }
        return this;
    };
    SlotList.prototype.contains = function (listener) {
        if (!this.nonEmpty) {
            return false;
        }
        var p = this;
        while (p.nonEmpty) {
            if (p.head.listener === listener) {
                return true;
            }
            p = p.tail;
        }
        return false;
    };
    SlotList.prototype.find = function (listener) {
        if (!this.nonEmpty) {
            return null;
        }
        var p = this;
        while (p.nonEmpty) {
            if (p.head.listener === listener) {
                return p.head;
            }
            p = p.tail;
        }
        return null;
    };
    SlotList.prototype.toString = function () {
        var buffer = "";
        var p = this;
        while (p.nonEmpty) {
            buffer += p.head + " -> ";
            p = p.tail;
        }
        buffer += "NIL";
        return "[List " + buffer + "]";
    };
    SlotList.NIL = new SlotList(null, null);
    return SlotList;
}());
exports.SlotList = SlotList;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OnceSignal_1 = require("./OnceSignal");
exports.OnceSignal = OnceSignal_1.OnceSignal;
var Signal_1 = require("./Signal");
exports.Signal = Signal_1.Signal;
var Slot_1 = require("./Slot");
exports.Slot = Slot_1.Slot;
var SlotList_1 = require("./SlotList");
exports.SlotList = SlotList_1.SlotList;

},{"./OnceSignal":11,"./Signal":12,"./Slot":13,"./SlotList":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compare_1 = require("./compare");
var StateContainer = /** @class */ (function () {
    function StateContainer(state) {
        this.listeners = [];
        this.matcherPlaceholders = {
            ":id": /^([a-zA-Z0-9\-_]+)$/,
            ":number": /^([0-9]+)$/,
            ":string": /^(\w+)$/,
            ":axis": /^([xyz])$/,
            ":*": /(.*)/,
        };
        this.state = state;
        this.reset();
    }
    StateContainer.prototype.set = function (newState) {
        var patches = compare_1.compare(this.state, newState);
        this.state = newState;
        this.checkPatches(patches, this.listeners, this.defaultListener);
        return patches;
    };
    StateContainer.prototype.registerPlaceholder = function (placeholder, matcher) {
        this.matcherPlaceholders[placeholder] = matcher;
    };
    StateContainer.prototype.listen = function (segments, callback, immediate) {
        var _this = this;
        var rules;
        if (typeof (segments) === "function") {
            rules = [];
            callback = segments;
        }
        else {
            rules = segments.split("/");
        }
        if (callback.length > 1) {
            console.warn(".listen() accepts only one parameter.");
        }
        var listener = {
            callback: callback,
            rawRules: rules,
            rules: rules.map(function (segment) {
                if (typeof (segment) === "string") {
                    // replace placeholder matchers
                    return (segment.indexOf(":") === 0)
                        ? _this.matcherPlaceholders[segment] || _this.matcherPlaceholders[":*"]
                        : new RegExp("^" + segment + "$");
                }
                else {
                    return segment;
                }
            })
        };
        if (rules.length === 0) {
            this.defaultListener = listener;
        }
        else {
            this.listeners.push(listener);
        }
        // immediatelly try to trigger this listener.
        if (immediate) {
            this.checkPatches(compare_1.compare({}, this.state), [listener]);
        }
        return listener;
    };
    StateContainer.prototype.removeListener = function (listener) {
        for (var i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
            }
        }
    };
    StateContainer.prototype.removeAllListeners = function () {
        this.reset();
    };
    StateContainer.prototype.checkPatches = function (patches, listeners, defaultListener) {
        for (var j = 0, len = listeners.length; j < len; j++) {
            var listener = listeners[j];
            for (var i = patches.length - 1; i >= 0; i--) {
                var pathVariables = listener && this.getPathVariables(patches[i], listener);
                if (pathVariables) {
                    listener.callback({
                        path: pathVariables,
                        rawPath: patches[i].path,
                        operation: patches[i].operation,
                        value: patches[i].value
                    });
                    patches[i].matched = true;
                }
            }
        }
        // trigger default listener callback with each unmatched patch
        if (defaultListener) {
            for (var i = patches.length - 1; i >= 0; i--) {
                if (!patches[i].matched) {
                    defaultListener.callback(patches[i]);
                }
            }
        }
    };
    StateContainer.prototype.getPathVariables = function (patch, listener) {
        // skip if rules count differ from patch
        if (patch.path.length !== listener.rules.length) {
            return false;
        }
        var path = {};
        for (var i = 0, len = listener.rules.length; i < len; i++) {
            var matches = patch.path[i].match(listener.rules[i]);
            if (!matches || matches.length === 0 || matches.length > 2) {
                return false;
            }
            else if (listener.rawRules[i].substr(0, 1) === ":") {
                path[listener.rawRules[i].substr(1)] = matches[1];
            }
        }
        return path;
    };
    StateContainer.prototype.reset = function () {
        this.listeners = [];
    };
    return StateContainer;
}());
exports.StateContainer = StateContainer;

},{"./compare":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compare(tree1, tree2) {
    var patches = [];
    generate(tree1, tree2, patches, []);
    return patches;
}
exports.compare = compare;
function concat(arr, value) {
    var newArr = arr.slice();
    newArr.push(value);
    return newArr;
}
function objectKeys(obj) {
    if (Array.isArray(obj)) {
        var keys_1 = new Array(obj.length);
        for (var k = 0; k < keys_1.length; k++) {
            keys_1[k] = "" + k;
        }
        return keys_1;
    }
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keys = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            keys.push(i);
        }
    }
    return keys;
}
;
// Dirty check if obj is different from mirror, generate patches and update mirror
function generate(mirror, obj, patches, path) {
    var newKeys = objectKeys(obj);
    var oldKeys = objectKeys(mirror);
    var deleted = false;
    for (var t = oldKeys.length - 1; t >= 0; t--) {
        var key = oldKeys[t];
        var oldVal = mirror[key];
        if (obj.hasOwnProperty(key) && !(obj[key] === undefined && oldVal !== undefined && Array.isArray(obj) === false)) {
            var newVal = obj[key];
            if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
                generate(oldVal, newVal, patches, concat(path, key));
            }
            else {
                if (oldVal !== newVal) {
                    patches.push({
                        operation: "replace",
                        path: concat(path, key),
                        value: newVal,
                        previousValue: oldVal
                    });
                }
            }
        }
        else {
            patches.push({ operation: "remove", path: concat(path, key) });
            deleted = true; // property has been deleted
        }
    }
    if (!deleted && newKeys.length == oldKeys.length) {
        return;
    }
    for (var t = newKeys.length - 1; t >= 0; t--) {
        var key = newKeys[t];
        if (!mirror.hasOwnProperty(key) && obj[key] !== undefined) {
            var newVal = obj[key];
            var addPath = concat(path, key);
            // compare deeper additions
            if (typeof newVal == "object" && newVal != null) {
                generate({}, newVal, patches, addPath);
            }
            patches.push({ operation: "add", path: addPath, value: newVal });
        }
    }
}

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateContainer_1 = require("./StateContainer");
exports.StateContainer = StateContainer_1.StateContainer;

},{"./StateContainer":16}],19:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.createBackoff=createBackoff;var backoff={exponential:function exponential(attempt,delay){return Math.floor(Math.random()*Math.pow(2,attempt)*delay);},fibonacci:function fibonacci(attempt,delay){var current=1;if(attempt>current){var prev=1,current=2;for(var index=2;index<attempt;index++){var next=prev+current;prev=current;current=next;}}return Math.floor(Math.random()*current*delay);}};function createBackoff(type,options){return new Backoff(backoff[type],options);}function Backoff(func,options){this.func=func;this.attempts=0;this.delay=typeof options.initialDelay!=="undefined"?options.initialDelay:100;}Backoff.prototype.backoff=function(){setTimeout(this.onReady,this.func(++this.attempts,this.delay));};
},{}],20:[function(require,module,exports){
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var createBackoff=require('./backoff').createBackoff;var WebSocketImpl=typeof WebSocket!=="undefined"?WebSocket:require('ws');var WebSocketClient=function(){/**
   * @param url DOMString The URL to which to connect; this should be the URL to which the WebSocket server will respond.
   * @param protocols DOMString|DOMString[] Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol). If you don't specify a protocol string, an empty string is assumed.
   */function WebSocketClient(url,protocols){var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};_classCallCheck(this,WebSocketClient);this.url=url;this.protocols=protocols;this.reconnectEnabled=true;this.listeners={};this.backoff=createBackoff(options.backoff||'exponential',options);this.backoff.onReady=this.onBackoffReady.bind(this);if(typeof options.connect==="undefined"||options.connect){this.open();}}_createClass(WebSocketClient,[{key:'open',value:function open(){var reconnect=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;this.isReconnect=reconnect;// keep binaryType used on previous WebSocket connection
var binaryType=this.ws&&this.ws.binaryType;this.ws=new WebSocketImpl(this.url,this.protocols);this.ws.onclose=this.onCloseCallback.bind(this);this.ws.onerror=this.onErrorCallback.bind(this);this.ws.onmessage=this.onMessageCallback.bind(this);this.ws.onopen=this.onOpenCallback.bind(this);if(binaryType){this.ws.binaryType=binaryType;}}/**
   * @ignore
   */},{key:'onBackoffReady',value:function onBackoffReady(number,delay){// console.log("onBackoffReady", number + ' ' + delay + 'ms');
this.open(true);}/**
   * @ignore
   */},{key:'onCloseCallback',value:function onCloseCallback(e){if(!this.isReconnect&&this.listeners['onclose']){this.listeners['onclose'].apply(null,arguments);}if(this.reconnectEnabled&&e.code<3000){this.backoff.backoff();}}/**
   * @ignore
   */},{key:'onErrorCallback',value:function onErrorCallback(){if(this.listeners['onerror']){this.listeners['onerror'].apply(null,arguments);}}/**
   * @ignore
   */},{key:'onMessageCallback',value:function onMessageCallback(){if(this.listeners['onmessage']){this.listeners['onmessage'].apply(null,arguments);}}/**
   * @ignore
   */},{key:'onOpenCallback',value:function onOpenCallback(){if(this.listeners['onopen']){this.listeners['onopen'].apply(null,arguments);}if(this.isReconnect&&this.listeners['onreconnect']){this.listeners['onreconnect'].apply(null,arguments);}this.isReconnect=false;}/**
   * The number of bytes of data that have been queued using calls to send()
   * but not yet transmitted to the network. This value does not reset to zero
   * when the connection is closed; if you keep calling send(), this will
   * continue to climb.
   *
   * @type unsigned long
   * @readonly
   */},{key:'close',/**
   * Closes the WebSocket connection or connection attempt, if any. If the
   * connection is already CLOSED, this method does nothing.
   *
   * @param code A numeric value indicating the status code explaining why the connection is being closed. If this parameter is not specified, a default value of 1000 (indicating a normal "transaction complete" closure) is assumed. See the list of status codes on the CloseEvent page for permitted values.
   * @param reason A human-readable string explaining why the connection is closing. This string must be no longer than 123 bytes of UTF-8 text (not characters).
   *
   * @return void
   */value:function close(code,reason){if(typeof code=='undefined'){code=1000;}this.reconnectEnabled=false;this.ws.close(code,reason);}/**
   * Transmits data to the server over the WebSocket connection.
   * @param data DOMString|ArrayBuffer|Blob
   * @return void
   */},{key:'send',value:function send(data){this.ws.send(data);}/**
   * An event listener to be called when the WebSocket connection's readyState changes to CLOSED. The listener receives a CloseEvent named "close".
   * @param listener EventListener
   */},{key:'bufferedAmount',get:function get(){return this.ws.bufferedAmount;}/**
   * The current state of the connection; this is one of the Ready state constants.
   * @type unsigned short
   * @readonly
   */},{key:'readyState',get:function get(){return this.ws.readyState;}/**
   * A string indicating the type of binary data being transmitted by the
   * connection. This should be either "blob" if DOM Blob objects are being
   * used or "arraybuffer" if ArrayBuffer objects are being used.
   * @type DOMString
   */},{key:'binaryType',get:function get(){return this.ws.binaryType;},set:function set(binaryType){this.ws.binaryType=binaryType;}/**
   * The extensions selected by the server. This is currently only the empty
   * string or a list of extensions as negotiated by the connection.
   * @type DOMString
   */},{key:'extensions',get:function get(){return this.ws.extensions;},set:function set(extensions){this.ws.extensions=extensions;}/**
   * A string indicating the name of the sub-protocol the server selected;
   * this will be one of the strings specified in the protocols parameter when
   * creating the WebSocket object.
   * @type DOMString
   */},{key:'protocol',get:function get(){return this.ws.protocol;},set:function set(protocol){this.ws.protocol=protocol;}},{key:'onclose',set:function set(listener){this.listeners['onclose']=listener;},get:function get(){return this.listeners['onclose'];}/**
   * An event listener to be called when an error occurs. This is a simple event named "error".
   * @param listener EventListener
   */},{key:'onerror',set:function set(listener){this.listeners['onerror']=listener;},get:function get(){return this.listeners['onerror'];}/**
   * An event listener to be called when a message is received from the server. The listener receives a MessageEvent named "message".
   * @param listener EventListener
   */},{key:'onmessage',set:function set(listener){this.listeners['onmessage']=listener;},get:function get(){return this.listeners['onmessage'];}/**
   * An event listener to be called when the WebSocket connection's readyState changes to OPEN; this indicates that the connection is ready to send and receive data. The event is a simple one with the name "open".
   * @param listener EventListener
   */},{key:'onopen',set:function set(listener){this.listeners['onopen']=listener;},get:function get(){return this.listeners['onopen'];}/**
   * @param listener EventListener
   */},{key:'onreconnect',set:function set(listener){this.listeners['onreconnect']=listener;},get:function get(){return this.listeners['onreconnect'];}}]);return WebSocketClient;}();/**
 * The connection is not yet open.
 */WebSocketClient.CONNECTING=WebSocketImpl.CONNECTING;/**
 * The connection is open and ready to communicate.
 */WebSocketClient.OPEN=WebSocketImpl.OPEN;/**
 * The connection is in the process of closing.
 */WebSocketClient.CLOSING=WebSocketImpl.CLOSING;/**
 * The connection is closed or couldn't be opened.
 */WebSocketClient.CLOSED=WebSocketImpl.CLOSED;exports.default=WebSocketClient;
},{"./backoff":19,"ws":21}],21:[function(require,module,exports){

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msgpack = require("./msgpack");
var signals_1 = require("@gamestdio/signals");
var Connection_1 = require("./Connection");
var Protocol_1 = require("./Protocol");
var Room_1 = require("./Room");
var Storage_1 = require("./Storage");
var Client = /** @class */ (function () {
    function Client(url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        // signals
        this.onOpen = new signals_1.Signal();
        this.onClose = new signals_1.Signal();
        this.onError = new signals_1.Signal();
        this.rooms = {};
        this.connectingRooms = {};
        this.requestId = 0;
        this.roomsAvailableRequests = {};
        this.hostname = url;
        Storage_1.getItem('colyseusid', function (colyseusid) { return _this.connect(colyseusid, options); });
    }
    Client.prototype.join = function (roomName, options) {
        if (options === void 0) { options = {}; }
        return this.createRoomRequest(roomName, options);
    };
    Client.prototype.rejoin = function (roomName, options) {
        if (!options.sessionId) {
            throw new Error("'sessionId' options is required for 'rejoin'.");
        }
        return this.join(roomName, options);
    };
    Client.prototype.getAvailableRooms = function (roomName, callback) {
        var _this = this;
        // reject this promise after 15 seconds.
        var requestId = ++this.requestId;
        var removeRequest = function () { return delete _this.roomsAvailableRequests[requestId]; };
        var rejectionTimeout = setTimeout(function () {
            removeRequest();
            callback([], 'timeout');
        }, 15000);
        // send the request to the server.
        this.connection.send([Protocol_1.Protocol.ROOM_LIST, requestId, roomName]);
        this.roomsAvailableRequests[requestId] = function (roomsAvailable) {
            removeRequest();
            clearTimeout(rejectionTimeout);
            callback(roomsAvailable);
        };
    };
    Client.prototype.close = function () {
        this.connection.close();
    };
    Client.prototype.createRoom = function (roomName, options) {
        if (options === void 0) { options = {}; }
        return new Room_1.Room(roomName, options);
    };
    Client.prototype.createRoomRequest = function (roomName, options, reuseRoomInstance, retryCount) {
        var _this = this;
        options.requestId = ++this.requestId;
        var room = reuseRoomInstance || this.createRoom(roomName, options);
        // remove references on leaving
        room.onLeave.addOnce(function () {
            delete _this.rooms[room.id];
            delete _this.connectingRooms[options.requestId];
        });
        //
        // retry joining the room in case the server couldn't matchmake into it
        //
        // TODO: improve match-making routine https://github.com/gamestdio/colyseus/issues/176
        //
        if (options.retryTimes) {
            room.onError.addOnce(function () {
                retryCount = retryCount || 0;
                if (!room.hasJoined && retryCount <= options.retryTimes) {
                    retryCount++;
                    _this.createRoomRequest(roomName, options, room, retryCount);
                }
            });
        }
        this.connectingRooms[options.requestId] = room;
        this.connection.send([Protocol_1.Protocol.JOIN_REQUEST, roomName, options]);
        return room;
    };
    Client.prototype.connect = function (colyseusid, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.id = colyseusid || '';
        this.connection = new Connection_1.Connection(this.buildEndpoint('', options));
        this.connection.onmessage = this.onMessageCallback.bind(this);
        this.connection.onclose = function (e) { return _this.onClose.dispatch(e); };
        this.connection.onerror = function (e) { return _this.onError.dispatch(e); };
        // check for id on cookie
        this.connection.onopen = function () {
            if (_this.id) {
                _this.onOpen.dispatch();
            }
        };
    };
    Client.prototype.buildEndpoint = function (path, options) {
        if (path === void 0) { path = ''; }
        if (options === void 0) { options = {}; }
        // append colyseusid to connection string.
        var params = ["colyseusid=" + this.id];
        for (var name_1 in options) {
            if (!options.hasOwnProperty(name_1)) {
                continue;
            }
            params.push(name_1 + "=" + options[name_1]);
        }
        return this.hostname + "/" + path + "?" + params.join('&');
    };
    /**
     * @override
     */
    Client.prototype.onMessageCallback = function (event) {
        if (!this.previousCode) {
            var view = new DataView(event.data);
            var code = view.getUint8(0);
            if (code === Protocol_1.Protocol.USER_ID) {
                this.id = Protocol_1.utf8Read(view, 1);
                Storage_1.setItem('colyseusid', this.id);
                this.onOpen.dispatch();
            }
            else if (code === Protocol_1.Protocol.JOIN_REQUEST) {
                var requestId = view.getUint8(1);
                var room = this.connectingRooms[requestId];
                var processPath = '';
                if (!room) {
                    console.warn('colyseus.js: client left room before receiving session id.');
                    return;
                }
                room.id = Protocol_1.utf8Read(view, 2);
                this.rooms[room.id] = room;
                var nextIndex = 3 + room.id.length;
                if (view.byteLength > nextIndex) {
                    processPath = Protocol_1.utf8Read(view, nextIndex) + "/";
                }
                room.connect(this.buildEndpoint(processPath + room.id, room.options));
                delete this.connectingRooms[requestId];
            }
            else if (code === Protocol_1.Protocol.JOIN_ERROR) {
                var err = Protocol_1.utf8Read(view, 1);
                console.error('colyseus.js: server error:', err);
                // general error
                this.onError.dispatch(err);
            }
            else if (code === Protocol_1.Protocol.ROOM_LIST) {
                this.previousCode = code;
            }
        }
        else {
            if (this.previousCode === Protocol_1.Protocol.ROOM_LIST) {
                var _a = msgpack.decode(new Uint8Array(event.data)), requestId = _a[0], rooms = _a[1];
                if (this.roomsAvailableRequests[requestId]) {
                    this.roomsAvailableRequests[requestId](rooms);
                }
                else {
                    console.warn('receiving ROOM_LIST after timeout:', rooms);
                }
            }
            this.previousCode = undefined;
        }
    };
    return Client;
}());
exports.Client = Client;

},{"./Connection":23,"./Protocol":24,"./Room":25,"./Storage":26,"./msgpack":29,"@gamestdio/signals":15}],23:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("@gamestdio/websocket");
var msgpack = require("./msgpack");
var Connection = /** @class */ (function (_super) {
    __extends(Connection, _super);
    function Connection(url, autoConnect) {
        if (autoConnect === void 0) { autoConnect = true; }
        var _this = _super.call(this, url, undefined, { connect: autoConnect }) || this;
        _this._enqueuedCalls = [];
        return _this;
    }
    Connection.prototype.onOpenCallback = function (event) {
        _super.prototype.onOpenCallback.call(this);
        this.binaryType = 'arraybuffer';
        if (this._enqueuedCalls.length > 0) {
            for (var _i = 0, _a = this._enqueuedCalls; _i < _a.length; _i++) {
                var _b = _a[_i], method = _b[0], args = _b[1];
                this[method].apply(this, args);
            }
            // clear enqueued calls.
            this._enqueuedCalls = [];
        }
    };
    Connection.prototype.send = function (data) {
        if (this.ws.readyState === websocket_1.default.OPEN) {
            return _super.prototype.send.call(this, msgpack.encode(data));
        }
        else {
            // WebSocket not connected.
            // Enqueue data to be sent when readyState == OPEN
            this._enqueuedCalls.push(['send', [data]]);
        }
    };
    return Connection;
}(websocket_1.default));
exports.Connection = Connection;

},{"./msgpack":29,"@gamestdio/websocket":20}],24:[function(require,module,exports){
"use strict";
// Use codes between 0~127 for lesser throughput (1 byte)
Object.defineProperty(exports, "__esModule", { value: true });
var Protocol;
(function (Protocol) {
    // User-related (0~8)
    Protocol[Protocol["USER_ID"] = 1] = "USER_ID";
    // Room-related (9~19)
    Protocol[Protocol["JOIN_REQUEST"] = 9] = "JOIN_REQUEST";
    Protocol[Protocol["JOIN_ROOM"] = 10] = "JOIN_ROOM";
    Protocol[Protocol["JOIN_ERROR"] = 11] = "JOIN_ERROR";
    Protocol[Protocol["LEAVE_ROOM"] = 12] = "LEAVE_ROOM";
    Protocol[Protocol["ROOM_DATA"] = 13] = "ROOM_DATA";
    Protocol[Protocol["ROOM_STATE"] = 14] = "ROOM_STATE";
    Protocol[Protocol["ROOM_STATE_PATCH"] = 15] = "ROOM_STATE_PATCH";
    // Match-making related (20~29)
    Protocol[Protocol["ROOM_LIST"] = 20] = "ROOM_LIST";
    // Generic messages (50~60)
    Protocol[Protocol["BAD_REQUEST"] = 50] = "BAD_REQUEST";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
function utf8Read(view, offset) {
    var length = view.getUint8(offset++);
    var string = '', chr = 0;
    for (var i = offset, end = offset + length; i < end; i++) {
        var byte = view.getUint8(i);
        if ((byte & 0x80) === 0x00) {
            string += String.fromCharCode(byte);
            continue;
        }
        if ((byte & 0xe0) === 0xc0) {
            string += String.fromCharCode(((byte & 0x1f) << 6) |
                (view.getUint8(++i) & 0x3f));
            continue;
        }
        if ((byte & 0xf0) === 0xe0) {
            string += String.fromCharCode(((byte & 0x0f) << 12) |
                ((view.getUint8(++i) & 0x3f) << 6) |
                ((view.getUint8(++i) & 0x3f) << 0));
            continue;
        }
        if ((byte & 0xf8) === 0xf0) {
            chr = ((byte & 0x07) << 18) |
                ((view.getUint8(++i) & 0x3f) << 12) |
                ((view.getUint8(++i) & 0x3f) << 6) |
                ((view.getUint8(++i) & 0x3f) << 0);
            if (chr >= 0x010000) { // surrogate pair
                chr -= 0x010000;
                string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
            }
            else {
                string += String.fromCharCode(chr);
            }
            continue;
        }
        throw new Error('Invalid byte ' + byte.toString(16));
    }
    return string;
}
exports.utf8Read = utf8Read;
// Faster for short strings than Buffer.byteLength
function utf8Length(str) {
    if (str === void 0) { str = ''; }
    var c = 0;
    var length = 0;
    for (var i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            length += 1;
        }
        else if (c < 0x800) {
            length += 2;
        }
        else if (c < 0xd800 || c >= 0xe000) {
            length += 3;
        }
        else {
            i++;
            length += 4;
        }
    }
    return length + 1;
}
exports.utf8Length = utf8Length;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signals_1 = require("@gamestdio/signals");
var msgpack = require("./msgpack");
var Connection_1 = require("./Connection");
var Serializer_1 = require("./serializer/Serializer");
var Protocol_1 = require("./Protocol");
var FossilDeltaSerializer_1 = require("./serializer/FossilDeltaSerializer");
var Room = /** @class */ (function () {
    function Room(name, options) {
        var _this = this;
        // Public signals
        this.onJoin = new signals_1.Signal();
        this.onStateChange = new signals_1.Signal();
        this.onMessage = new signals_1.Signal();
        this.onError = new signals_1.Signal();
        this.onLeave = new signals_1.Signal();
        this.id = null;
        this.name = name;
        this.options = options;
        // TODO: remove default serializer. it should arrive only after JOIN_ROOM.
        this.serializer = new FossilDeltaSerializer_1.FossilDeltaSerializer();
        this.onLeave.add(function () { return _this.removeAllListeners(); });
    }
    Room.prototype.connect = function (endpoint) {
        var _this = this;
        this.connection = new Connection_1.Connection(endpoint, false);
        this.connection.reconnectEnabled = false;
        this.connection.onmessage = this.onMessageCallback.bind(this);
        this.connection.onclose = function (e) { return _this.onLeave.dispatch(e); };
        this.connection.onerror = function (e) {
            console.warn("Possible causes: room's onAuth() failed or maxClients has been reached.");
            _this.onError.dispatch(e);
        };
        this.connection.open();
    };
    Room.prototype.leave = function (consented) {
        if (consented === void 0) { consented = true; }
        if (this.connection) {
            if (consented) {
                this.connection.send([Protocol_1.Protocol.LEAVE_ROOM]);
            }
            else {
                this.connection.close();
            }
        }
        else {
            this.onLeave.dispatch();
        }
    };
    Room.prototype.send = function (data) {
        this.connection.send([Protocol_1.Protocol.ROOM_DATA, this.id, data]);
    };
    Object.defineProperty(Room.prototype, "state", {
        get: function () {
            return this.serializer.getState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Room.prototype, "hasJoined", {
        get: function () {
            return this.sessionId !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    // TODO: deprecate / move somewhere else
    // this method is useful only for FossilDeltaSerializer
    Room.prototype.listen = function (segments, callback, immediate) {
        if (this.serializerId === "schema") {
            console.error("'" + this.serializerId + "' serializer doesn't support .listen() method.");
            return;
        }
        else if (!this.serializerId) {
            console.warn("room.Listen() should be called after room.onJoin has been called (DEPRECATION WARNING)");
        }
        return this.serializer.api.listen(segments, callback, immediate);
    };
    // TODO: deprecate / move somewhere else
    // this method is useful only for FossilDeltaSerializer
    Room.prototype.removeListener = function (listener) {
        return this.serializer.api.removeListener(listener);
    };
    Room.prototype.removeAllListeners = function () {
        if (this.serializer) {
            this.serializer.teardown();
        }
        this.onJoin.removeAll();
        this.onStateChange.removeAll();
        this.onMessage.removeAll();
        this.onError.removeAll();
        this.onLeave.removeAll();
    };
    Room.prototype.onMessageCallback = function (event) {
        if (!this.previousCode) {
            var view = new DataView(event.data);
            var code = view.getUint8(0);
            if (code === Protocol_1.Protocol.JOIN_ROOM) {
                var offset = 1;
                this.sessionId = Protocol_1.utf8Read(view, offset);
                offset += Protocol_1.utf8Length(this.sessionId);
                this.serializerId = Protocol_1.utf8Read(view, offset);
                offset += Protocol_1.utf8Length(this.serializerId);
                // get serializer implementation
                var serializer = Serializer_1.getSerializer(this.serializerId);
                if (!serializer) {
                    throw new Error("missing serializer: " + this.serializerId);
                }
                // TODO: remove this check
                if (this.serializerId !== "fossil-delta") {
                    this.serializer = new serializer();
                }
                if (view.buffer.byteLength > offset && this.serializer.handshake) {
                    var bytes = Array.from(new Uint8Array(view.buffer.slice(offset)));
                    this.serializer.handshake(bytes);
                }
                this.onJoin.dispatch();
            }
            else if (code === Protocol_1.Protocol.JOIN_ERROR) {
                this.onError.dispatch(Protocol_1.utf8Read(view, 1));
            }
            else if (code === Protocol_1.Protocol.LEAVE_ROOM) {
                this.leave();
            }
            else {
                this.previousCode = code;
            }
        }
        else {
            if (this.previousCode === Protocol_1.Protocol.ROOM_STATE) {
                // TODO: improve here!
                this.setState(Array.from(new Uint8Array(event.data)));
            }
            else if (this.previousCode === Protocol_1.Protocol.ROOM_STATE_PATCH) {
                this.patch(Array.from(new Uint8Array(event.data)));
            }
            else if (this.previousCode === Protocol_1.Protocol.ROOM_DATA) {
                this.onMessage.dispatch(msgpack.decode(event.data));
            }
            this.previousCode = undefined;
        }
    };
    Room.prototype.setState = function (encodedState) {
        this.serializer.setState(encodedState);
        this.onStateChange.dispatch(this.serializer.getState());
    };
    Room.prototype.patch = function (binaryPatch) {
        this.serializer.patch(binaryPatch);
        this.onStateChange.dispatch(this.serializer.getState());
    };
    return Room;
}());
exports.Room = Room;

},{"./Connection":23,"./Protocol":24,"./msgpack":29,"./serializer/FossilDeltaSerializer":30,"./serializer/Serializer":32,"@gamestdio/signals":15}],26:[function(require,module,exports){
"use strict";
/**
 * We do not assign 'storage' to window.localStorage immediatelly for React
 * Native compatibility. window.localStorage is not present when this module is
 * loaded.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var storage;
function getStorage() {
    if (!storage) {
        storage = (typeof (cc) !== 'undefined' && cc.sys && cc.sys.localStorage)
            ? cc.sys.localStorage // compatibility with cocos creator
            : typeof (window) !== "undefined" && window.localStorage //RN does have window object at this point, but localStorage is not defined
                ? window.localStorage // regular browser environment
                : {
                    cache: {},
                    setItem: function (key, value) { this.cache[key] = value; },
                    getItem: function (key) { this.cache[key]; },
                };
    }
    return storage;
}
function setItem(key, value) {
    getStorage().setItem(key, value);
}
exports.setItem = setItem;
function getItem(key, callback) {
    var value = getStorage().getItem(key);
    if (typeof (Promise) === 'undefined' || // old browsers
        !(value instanceof Promise)) {
        // browser has synchronous return
        callback(value);
    }
    else {
        // react-native is asynchronous
        value.then(function (id) { return callback(id); });
    }
}
exports.getItem = getItem;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./legacy");
var Client_1 = require("./Client");
exports.Client = Client_1.Client;
var Protocol_1 = require("./Protocol");
exports.Protocol = Protocol_1.Protocol;
var Room_1 = require("./Room");
exports.Room = Room_1.Room;
/*
 * Serializers
 */
var FossilDeltaSerializer_1 = require("./serializer/FossilDeltaSerializer");
exports.FossilDeltaSerializer = FossilDeltaSerializer_1.FossilDeltaSerializer;
var SchemaSerializer_1 = require("./serializer/SchemaSerializer");
exports.SchemaSerializer = SchemaSerializer_1.SchemaSerializer;
var Serializer_1 = require("./serializer/Serializer");
exports.registerSerializer = Serializer_1.registerSerializer;
var schema_1 = require("@colyseus/schema");
exports.Schema = schema_1.Schema;
exports.type = schema_1.type;
Serializer_1.registerSerializer('fossil-delta', FossilDeltaSerializer_1.FossilDeltaSerializer);
Serializer_1.registerSerializer('schema', SchemaSerializer_1.SchemaSerializer);
/**
 * Experimental sync helpers
 */
var helpers_1 = require("./sync/helpers");
exports.initializeSync = helpers_1.initializeSync;
exports.sync = helpers_1.sync;
exports.syncMap = helpers_1.syncMap;
exports.syncObject = helpers_1.syncObject;
exports.syncVar = helpers_1.syncVar;
exports.syncList = helpers_1.syncList;
exports.key = helpers_1.key;
exports.room = helpers_1.room;
exports.listen = helpers_1.listen;

},{"./Client":22,"./Protocol":24,"./Room":25,"./legacy":28,"./serializer/FossilDeltaSerializer":30,"./serializer/SchemaSerializer":31,"./serializer/Serializer":32,"./sync/helpers":33,"@colyseus/schema":7}],28:[function(require,module,exports){
//
// Polyfills for legacy environments
//
/*
 * Support Android 4.4.x
 */
if (!ArrayBuffer.isView) {
    ArrayBuffer.isView = function (a) {
        return a !== null && typeof (a) === 'object' && a.buffer instanceof ArrayBuffer;
    };
}

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msgpackDecode = require("notepack.io/browser/decode");
var msgpackEncode = require("notepack.io/browser/encode");
exports.decode = msgpackDecode;
exports.encode = msgpackEncode;

},{"notepack.io/browser/decode":36,"notepack.io/browser/encode":37}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_listener_1 = require("@gamestdio/state-listener");
var fossilDelta = require("fossil-delta");
var msgpack = require("../msgpack");
var FossilDeltaSerializer = /** @class */ (function () {
    function FossilDeltaSerializer() {
        this.api = new state_listener_1.StateContainer({});
    }
    FossilDeltaSerializer.prototype.getState = function () {
        return this.api.state;
    };
    FossilDeltaSerializer.prototype.setState = function (encodedState) {
        this.previousState = new Uint8Array(encodedState);
        this.api.set(msgpack.decode(this.previousState));
    };
    FossilDeltaSerializer.prototype.patch = function (binaryPatch) {
        // apply patch
        this.previousState = new Uint8Array(fossilDelta.apply(this.previousState, binaryPatch));
        // trigger update callbacks
        this.api.set(msgpack.decode(this.previousState));
    };
    FossilDeltaSerializer.prototype.teardown = function () {
        this.api.removeAllListeners();
    };
    return FossilDeltaSerializer;
}());
exports.FossilDeltaSerializer = FossilDeltaSerializer;

},{"../msgpack":29,"@gamestdio/state-listener":18,"fossil-delta":35}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("@colyseus/schema");
var SchemaSerializer = /** @class */ (function () {
    function SchemaSerializer() {
    }
    SchemaSerializer.prototype.setState = function (rawState) {
        this.state.decode(rawState);
    };
    SchemaSerializer.prototype.getState = function () {
        return this.state;
    };
    SchemaSerializer.prototype.patch = function (patches) {
        this.state.decode(patches);
    };
    SchemaSerializer.prototype.teardown = function () {
        // this.state.onRemove
    };
    SchemaSerializer.prototype.handshake = function (bytes) {
        this.state = schema_1.Reflection.decode(bytes);
    };
    return SchemaSerializer;
}());
exports.SchemaSerializer = SchemaSerializer;

},{"@colyseus/schema":7}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serializers = {};
function registerSerializer(id, serializer) {
    serializers[id] = serializer;
}
exports.registerSerializer = registerSerializer;
function getSerializer(id) {
    return serializers[id];
}
exports.getSerializer = getSerializer;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var listeners = require("./listeners");
function initializeSync(roomInstance, synchable) {
    createBindings(roomInstance, synchable, synchable);
}
exports.initializeSync = initializeSync;
function syncMap(type, addCallback, removeCallback) {
    return sync(type, 'map', addCallback, removeCallback);
}
exports.syncMap = syncMap;
function syncObject(type, addCallback, removeCallback) {
    return sync(type, 'object', addCallback, removeCallback);
}
exports.syncObject = syncObject;
function syncVar(type, addCallback, removeCallback) {
    return sync(type, 'var');
}
exports.syncVar = syncVar;
function syncList(type, addCallback, removeCallback) {
    return sync(type, 'list', addCallback, removeCallback);
}
exports.syncList = syncList;
function key() {
    return sync(undefined, 'key');
}
exports.key = key;
function room() {
    return function (proto, attr) {
        Object.defineProperty(proto, attr, {
            configurable: true,
            enumerable: true,
            get: function () { return proto.constructor.$room; },
        });
    };
}
exports.room = room;
function sync(type, holderType, addCallback, removeCallback) {
    if (holderType === void 0) { holderType = 'var'; }
    return function (target, propertyKey) {
        if (!target.constructor.properties) {
            target.constructor.properties = {};
        }
        var variable = propertyKey;
        if (typeof (type) === 'string') {
            variable = propertyKey;
            propertyKey = type;
            type = undefined;
        }
        target.constructor.properties[propertyKey] = {
            addCallback: addCallback,
            holderType: holderType,
            removeCallback: removeCallback,
            type: type,
            variable: variable,
        };
    };
}
exports.sync = sync;
function listen(path, op) {
    return function (target, methodName, descriptor) {
        if (!target.constructor.listeners) {
            target.constructor.listeners = {};
        }
        target.constructor.listeners[path] = { methodName: methodName, op: op };
    };
}
exports.listen = listen;
var listenersMap = {};
function createBindings(roomInstance, synchable, synchableRoot, parentSegment) {
    bindProperties(synchable.constructor.properties || synchable.properties, roomInstance, synchable, synchableRoot, parentSegment);
    bindListeners(synchable.constructor.listeners, roomInstance, synchable);
}
exports.createBindings = createBindings;
function bindProperties(properties, roomInstance, synchable, synchableRoot, parentSegment) {
    // no properties to sync
    if (!properties) {
        return;
    }
    // room reference
    Object.defineProperty(synchable, '$room', {
        configurable: true,
        enumerable: false,
        value: roomInstance,
        writable: true,
    });
    synchable.$room = roomInstance;
    // create bindings for properties
    for (var segment in properties) {
        if (!properties.hasOwnProperty(segment)) {
            continue;
        }
        var property = properties[segment];
        var path = (parentSegment)
            ? parentSegment + "/" + segment
            : segment;
        if (property.holderType === 'map') {
            path += '/:id';
        }
        // skip if duplicate listenersMap
        if (listenersMap[path]) {
            return;
        }
        else {
            listenersMap[path] = true;
        }
        var listener = listeners[property.holderType + "Listener"];
        if (listener) {
            roomInstance.listen(path, listener(roomInstance, property, synchable, synchableRoot, path));
            if (property.type) {
                createBindings(roomInstance, property.type, synchable, path);
            }
        }
    }
}
function bindListeners(listenersToBind, roomInstance, synchable) {
    if (!listenersToBind) {
        return;
    }
    var _loop_1 = function (path) {
        if (!listenersToBind.hasOwnProperty(path)) {
            return "continue";
        }
        var listener = listenersToBind[path];
        var callback = (listener.op)
            ? (function (change) {
                if (change.operation === listener.op) {
                    synchable[listener.methodName](change);
                }
            })
            : synchable[listener.methodName].bind(synchable);
        roomInstance.listen(path, callback);
    };
    for (var path in listenersToBind) {
        _loop_1(path);
    }
}
exports.bindListeners = bindListeners;

},{"./listeners":34}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
function assign(instance, property, propName, value, key) {
    if (property.holderType === 'var') {
        instance[propName] = value;
    }
    else if (property.holderType === 'key') {
        // mapListener only
        instance[propName] = key;
    }
}
function assignMultiple(instance, properties, value, key) {
    for (var prop in properties) {
        if (!properties.hasOwnProperty(prop)) {
            continue;
        }
        assign(instance, properties[prop], prop, value[prop], key);
    }
}
function getInstanceContainer(root, path, offset) {
    if (offset === void 0) { offset = 0; }
    var instance = root;
    for (var i = 0, len = path.length; i < len + offset; i++) {
        if (typeof (instance[path[i]]) !== 'object') {
            break;
        }
        instance = instance[path[i]];
    }
    return instance;
}
function objectListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        if (change.operation === 'add') {
            var newType = new property.type();
            // assign all variables to new instance type
            for (var prop in change.value) {
                if (!change.value.hasOwnProperty(prop)) {
                    continue;
                }
                newType[prop] = change.value[prop];
            }
            // bind @listen annotations
            helpers_1.bindListeners(property.type.listeners, room, newType);
            synchable[property.variable] = newType;
            if (property.addCallback) {
                property.addCallback.call(synchableRoot, synchableRoot, newType, change);
            }
        }
        else if (change.operation === 'replace') {
            synchableRoot[this.rawRules[0]][property.variable] = change.value;
        }
        else if (change.operation === 'remove') {
            if (property.removeCallback) {
                property.removeCallback.call(synchableRoot, synchableRoot, synchable[property.variable][change.path.id], change);
            }
            delete synchable[property.variable];
        }
    };
}
exports.objectListener = objectListener;
function mapListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        var instance = getInstanceContainer(synchableRoot, change.rawPath);
        if (change.operation === 'add') {
            var newType = new property.type();
            // define __mapParent as non-enumerable.
            Object.defineProperty(newType, '__mapParent', {
                configurable: true,
                enumerable: false,
                value: getInstanceContainer(synchableRoot, change.rawPath, -2),
                writable: true,
            });
            // bind @listen annotations
            helpers_1.bindListeners(property.type.listeners, room, newType);
            instance[change.path.id] = newType;
            // assign all variables to new instance type
            assignMultiple(newType, property.type.properties, change.value, change.path.id);
            if (property.addCallback) {
                property.addCallback.call(newType.__mapParent, newType.__mapParent, newType, change);
            }
        }
        else if (change.operation === 'replace') {
            assign(instance, property, property.variable, change.value);
        }
        else if (change.operation === 'remove') {
            if (property.removeCallback) {
                property.removeCallback.call(instance.__mapParent, instance.__mapParent, instance, change);
            }
            delete synchable[property.variable][change.path.id];
        }
    };
}
exports.mapListener = mapListener;
function varListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        var target = getInstanceContainer(synchableRoot, change.rawPath);
        if (change.operation !== 'remove') {
            assign(target, property, property.variable, change.value);
        }
        else if (change.operation === 'remove') {
            delete target[property.variable];
        }
    };
}
exports.varListener = varListener;

},{"./helpers":33}],35:[function(require,module,exports){
// Fossil SCM delta compression algorithm
// ======================================
//
// Format:
// http://www.fossil-scm.org/index.html/doc/tip/www/delta_format.wiki
//
// Algorithm:
// http://www.fossil-scm.org/index.html/doc/tip/www/delta_encoder_algorithm.wiki
//
// Original implementation:
// http://www.fossil-scm.org/index.html/artifact/d1b0598adcd650b3551f63b17dfc864e73775c3d
//
// LICENSE
// -------
//
// Copyright 2014 Dmitry Chestnykh (JavaScript port)
// Copyright 2007 D. Richard Hipp  (original C version)
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or
// without modification, are permitted provided that the
// following conditions are met:
//
//   1. Redistributions of source code must retain the above
//      copyright notice, this list of conditions and the
//      following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above
//      copyright notice, this list of conditions and the
//      following disclaimer in the documentation and/or other
//      materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHORS ``AS IS'' AND ANY EXPRESS
// OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
// BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
// OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation
// are those of the authors and contributors and should not be interpreted
// as representing official policies, either expressed or implied, of anybody
// else.
//
(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.fossilDelta = factory();
})(this, function() {
'use strict';

var fossilDelta = {};

// Hash window width in bytes. Must be a power of two.
var NHASH = 16;

function RollingHash() {
  this.a = 0; // hash     (16-bit unsigned)
  this.b = 0; // values   (16-bit unsigned)
  this.i = 0; // start of the hash window (16-bit unsigned)
  this.z = new Array(NHASH); // the values that have been hashed.
}

// Initialize the rolling hash using the first NHASH bytes of
// z at the given position.
RollingHash.prototype.init = function(z, pos) {
  var a = 0, b = 0, i, x;
  for(i = 0; i < NHASH; i++){
    x = z[pos+i];
    a = (a + x) & 0xffff;
    b = (b + (NHASH-i)*x) & 0xffff;
    this.z[i] = x;
  }
  this.a = a & 0xffff;
  this.b = b & 0xffff;
  this.i = 0;
};

// Advance the rolling hash by a single byte "c".
RollingHash.prototype.next = function(c) {
  var old = this.z[this.i];
  this.z[this.i] = c;
  this.i = (this.i+1)&(NHASH-1);
  this.a = (this.a - old + c) & 0xffff;
  this.b = (this.b - NHASH*old + this.a) & 0xffff;
};

// Return a 32-bit hash value.
RollingHash.prototype.value = function() {
  return ((this.a & 0xffff) | (this.b & 0xffff)<<16)>>>0;
};

var zDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~".
                split('').map(function (x) { return x.charCodeAt(0); });

var zValue = [
  -1, -1, -1, -1, -1, -1, -1, -1,   -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1,   -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1,   -1, -1, -1, -1, -1, -1, -1, -1,
   0,  1,  2,  3,  4,  5,  6,  7,    8,  9, -1, -1, -1, -1, -1, -1,
  -1, 10, 11, 12, 13, 14, 15, 16,   17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32,   33, 34, 35, -1, -1, -1, -1, 36,
  -1, 37, 38, 39, 40, 41, 42, 43,   44, 45, 46, 47, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 58, 59,   60, 61, 62, -1, -1, -1, 63, -1
];

// Reader reads bytes, chars, ints from array.
function Reader(array) {
  this.a = array; // source array
  this.pos = 0;   // current position in array
}

Reader.prototype.haveBytes = function() {
  return this.pos < this.a.length;
};

Reader.prototype.getByte = function() {
  var b = this.a[this.pos];
  this.pos++;
  if (this.pos > this.a.length) throw new RangeError('out of bounds');
  return b;
};

Reader.prototype.getChar = function() {
  return String.fromCharCode(this.getByte());
};

// Read base64-encoded unsigned integer.
Reader.prototype.getInt = function(){
  var v = 0, c;
  while(this.haveBytes() && (c = zValue[0x7f & this.getByte()]) >= 0) {
     v = (v<<6) + c;
  }
  this.pos--;
  return v >>> 0;
};


// Write writes an array.
function Writer() {
  this.a = [];
}

Writer.prototype.toArray = function() {
  return this.a;
};

Writer.prototype.putByte = function(b) {
  this.a.push(b & 0xff);
};

// Write an ASCII character (s is a one-char string).
Writer.prototype.putChar = function(s) {
  this.putByte(s.charCodeAt(0));
};

// Write a base64 unsigned integer.
Writer.prototype.putInt = function(v){
  var i, j, zBuf = [];
  if (v === 0) {
    this.putChar('0');
    return;
  }
  for (i = 0; v > 0; i++, v >>>= 6)
    zBuf.push(zDigits[v&0x3f]);
  for (j = i-1; j >= 0; j--)
    this.putByte(zBuf[j]);
};

// Copy from array at start to end.
Writer.prototype.putArray = function(a, start, end) {
  for (var i = start; i < end; i++) this.a.push(a[i]);
};

// Return the number digits in the base64 representation of a positive integer.
function digitCount(v){
  var i, x;
  for (i = 1, x = 64; v >= x; i++, x <<= 6){ /* nothing */ }
  return i;
}

// Return a 32-bit checksum of the array.
function checksum(arr) {
  var sum0 = 0, sum1 = 0, sum2 = 0, sum3 = 0,
      z = 0, N = arr.length;
  //TODO measure if this unrolling is helpful.
  while (N >= 16) {
    sum0 = sum0 + arr[z+0] | 0;
    sum1 = sum1 + arr[z+1] | 0;
    sum2 = sum2 + arr[z+2] | 0;
    sum3 = sum3 + arr[z+3] | 0;

    sum0 = sum0 + arr[z+4] | 0;
    sum1 = sum1 + arr[z+5] | 0;
    sum2 = sum2 + arr[z+6] | 0;
    sum3 = sum3 + arr[z+7] | 0;

    sum0 = sum0 + arr[z+8] | 0;
    sum1 = sum1 + arr[z+9] | 0;
    sum2 = sum2 + arr[z+10] | 0;
    sum3 = sum3 + arr[z+11] | 0;

    sum0 = sum0 + arr[z+12] | 0;
    sum1 = sum1 + arr[z+13] | 0;
    sum2 = sum2 + arr[z+14] | 0;
    sum3 = sum3 + arr[z+15] | 0;

    z += 16;
    N -= 16;
  }
  while (N >= 4) {
    sum0 = sum0 + arr[z+0] | 0;
    sum1 = sum1 + arr[z+1] | 0;
    sum2 = sum2 + arr[z+2] | 0;
    sum3 = sum3 + arr[z+3] | 0;
    z += 4;
    N -= 4;
  }
  sum3 = (((sum3 + (sum2 << 8) | 0) + (sum1 << 16) | 0) + (sum0 << 24) | 0);
  /* jshint -W086 */
  switch (N) {
    case 3: sum3 = sum3 + (arr[z+2] <<  8) | 0; /* falls through */
    case 2: sum3 = sum3 + (arr[z+1] << 16) | 0; /* falls through */
    case 1: sum3 = sum3 + (arr[z+0] << 24) | 0; /* falls through */
  }
  return sum3 >>> 0;
}

// Create a new delta from src to out.
fossilDelta.create = function(src, out) {
  var zDelta = new Writer();
  var lenOut = out.length;
  var lenSrc = src.length;
  var i, lastRead = -1;

  zDelta.putInt(lenOut);
  zDelta.putChar('\n');

  // If the source is very small, it means that we have no
  // chance of ever doing a copy command.  Just output a single
  // literal segment for the entire target and exit.
  if (lenSrc <= NHASH) {
    zDelta.putInt(lenOut);
    zDelta.putChar(':');
    zDelta.putArray(out, 0, lenOut);
    zDelta.putInt(checksum(out));
    zDelta.putChar(';');
    return zDelta.toArray();
  }

  // Compute the hash table used to locate matching sections in the source.
  var nHash = Math.ceil(lenSrc / NHASH);
  var collide =  new Array(nHash);
  var landmark = new Array(nHash);
  for (i = 0; i < collide.length; i++) collide[i] = -1;
  for (i = 0; i < landmark.length; i++) landmark[i] = -1;
  var hv, h = new RollingHash();
  for (i = 0; i < lenSrc-NHASH; i += NHASH) {
    h.init(src, i);
    hv = h.value() % nHash;
    collide[i/NHASH] = landmark[hv];
    landmark[hv] = i/NHASH;
  }

  var base = 0;
  var iSrc, iBlock, bestCnt, bestOfst, bestLitsz;
  while (base+NHASH<lenOut) {
    bestOfst=0;
    bestLitsz=0;
    h.init(out, base);
    i = 0; // Trying to match a landmark against zOut[base+i]
    bestCnt = 0;
    while(1) {
      var limit = 250;
      hv = h.value() % nHash;
      iBlock = landmark[hv];
      while (iBlock >= 0 && (limit--)>0 ) {
        //
        // The hash window has identified a potential match against
        // landmark block iBlock.  But we need to investigate further.
        //
        // Look for a region in zOut that matches zSrc. Anchor the search
        // at zSrc[iSrc] and zOut[base+i].  Do not include anything prior to
        // zOut[base] or after zOut[outLen] nor anything after zSrc[srcLen].
        //
        // Set cnt equal to the length of the match and set ofst so that
        // zSrc[ofst] is the first element of the match.  litsz is the number
        // of characters between zOut[base] and the beginning of the match.
        // sz will be the overhead (in bytes) needed to encode the copy
        // command.  Only generate copy command if the overhead of the
        // copy command is less than the amount of literal text to be copied.
        //
        var cnt, ofst, litsz;
        var j, k, x, y;
        var sz;

        // Beginning at iSrc, match forwards as far as we can.
        // j counts the number of characters that match.
        iSrc = iBlock*NHASH;
        for (j = 0, x = iSrc, y = base+i; x < lenSrc && y < lenOut; j++, x++, y++) {
          if (src[x] !== out[y]) break;
        }
        j--;

        // Beginning at iSrc-1, match backwards as far as we can.
        // k counts the number of characters that match.
        for (k = 1; k < iSrc && k <= i; k++) {
          if (src[iSrc-k] !== out[base+i-k]) break;
        }
        k--;

        // Compute the offset and size of the matching region.
        ofst = iSrc-k;
        cnt = j+k+1;
        litsz = i-k;  // Number of bytes of literal text before the copy
        // sz will hold the number of bytes needed to encode the "insert"
        // command and the copy command, not counting the "insert" text.
        sz = digitCount(i-k)+digitCount(cnt)+digitCount(ofst)+3;
        if (cnt >= sz && cnt > bestCnt) {
          // Remember this match only if it is the best so far and it
          // does not increase the file size.
          bestCnt = cnt;
          bestOfst = iSrc-k;
          bestLitsz = litsz;
        }

        // Check the next matching block
        iBlock = collide[iBlock];
      }

      // We have a copy command that does not cause the delta to be larger
      // than a literal insert.  So add the copy command to the delta.
      if (bestCnt > 0) {
        if (bestLitsz > 0) {
          // Add an insert command before the copy.
          zDelta.putInt(bestLitsz);
          zDelta.putChar(':');
          zDelta.putArray(out, base, base+bestLitsz);
          base += bestLitsz;
        }
        base += bestCnt;
        zDelta.putInt(bestCnt);
        zDelta.putChar('@');
        zDelta.putInt(bestOfst);
        zDelta.putChar(',');
        if (bestOfst + bestCnt -1 > lastRead) {
          lastRead = bestOfst + bestCnt - 1;
        }
        bestCnt = 0;
        break;
      }

      // If we reach this point, it means no match is found so far
      if (base+i+NHASH >= lenOut){
        // We have reached the end and have not found any
        // matches.  Do an "insert" for everything that does not match
        zDelta.putInt(lenOut-base);
        zDelta.putChar(':');
        zDelta.putArray(out, base, base+lenOut-base);
        base = lenOut;
        break;
      }

      // Advance the hash by one character. Keep looking for a match.
      h.next(out[base+i+NHASH]);
      i++;
    }
  }
  // Output a final "insert" record to get all the text at the end of
  // the file that does not match anything in the source.
  if(base < lenOut) {
    zDelta.putInt(lenOut-base);
    zDelta.putChar(':');
    zDelta.putArray(out, base, base+lenOut-base);
  }
  // Output the final checksum record.
  zDelta.putInt(checksum(out));
  zDelta.putChar(';');
  return zDelta.toArray();
};

// Return the size (in bytes) of the output from applying a delta.
fossilDelta.outputSize = function(delta){
  var zDelta = new Reader(delta);
  var size = zDelta.getInt();
  if (zDelta.getChar() !== '\n')
    throw new Error('size integer not terminated by \'\\n\'');
  return size;
};

// Apply a delta.
fossilDelta.apply = function(src, delta, opts) {
  var limit, total = 0;
  var zDelta = new Reader(delta);
  var lenSrc = src.length;
  var lenDelta = delta.length;

  limit = zDelta.getInt();
  if (zDelta.getChar() !== '\n')
    throw new Error('size integer not terminated by \'\\n\'');
  var zOut = new Writer();
  while(zDelta.haveBytes()) {
    var cnt, ofst;
    cnt = zDelta.getInt();

    switch (zDelta.getChar()) {
      case '@':
        ofst = zDelta.getInt();
        if (zDelta.haveBytes() && zDelta.getChar() !== ',')
          throw new Error('copy command not terminated by \',\'');
        total += cnt;
        if (total > limit)
          throw new Error('copy exceeds output file size');
        if (ofst+cnt > lenSrc)
          throw new Error('copy extends past end of input');
        zOut.putArray(src, ofst, ofst+cnt);
        break;

      case ':':
        total += cnt;
        if (total > limit)
          throw new Error('insert command gives an output larger than predicted');
        if (cnt > lenDelta)
          throw new Error('insert count exceeds size of delta');
        zOut.putArray(zDelta.a, zDelta.pos, zDelta.pos+cnt);
        zDelta.pos += cnt;
        break;

      case ';':
        var out = zOut.toArray();
        if ((!opts || opts.verifyChecksum !== false) && cnt !== checksum(out))
          throw new Error('bad checksum');
        if (total !== limit)
          throw new Error('generated size does not match predicted size');
        return out;

      default:
        throw new Error('unknown delta operator');
    }
  }
  throw new Error('unterminated delta');
};

return fossilDelta;

});

},{}],36:[function(require,module,exports){
'use strict';

function Decoder(buffer) {
  this._offset = 0;
  if (buffer instanceof ArrayBuffer) {
    this._buffer = buffer;
    this._view = new DataView(this._buffer);
  } else if (ArrayBuffer.isView(buffer)) {
    this._buffer = buffer.buffer;
    this._view = new DataView(this._buffer, buffer.byteOffset, buffer.byteLength);
  } else {
    throw new Error('Invalid argument');
  }
}

function utf8Read(view, offset, length) {
  var string = '', chr = 0;
  for (var i = offset, end = offset + length; i < end; i++) {
    var byte = view.getUint8(i);
    if ((byte & 0x80) === 0x00) {
      string += String.fromCharCode(byte);
      continue;
    }
    if ((byte & 0xe0) === 0xc0) {
      string += String.fromCharCode(
        ((byte & 0x1f) << 6) |
        (view.getUint8(++i) & 0x3f)
      );
      continue;
    }
    if ((byte & 0xf0) === 0xe0) {
      string += String.fromCharCode(
        ((byte & 0x0f) << 12) |
        ((view.getUint8(++i) & 0x3f) << 6) |
        ((view.getUint8(++i) & 0x3f) << 0)
      );
      continue;
    }
    if ((byte & 0xf8) === 0xf0) {
      chr = ((byte & 0x07) << 18) |
        ((view.getUint8(++i) & 0x3f) << 12) |
        ((view.getUint8(++i) & 0x3f) << 6) |
        ((view.getUint8(++i) & 0x3f) << 0);
      if (chr >= 0x010000) { // surrogate pair
        chr -= 0x010000;
        string += String.fromCharCode((chr >>> 10) + 0xD800, (chr & 0x3FF) + 0xDC00);
      } else {
        string += String.fromCharCode(chr);
      }
      continue;
    }
    throw new Error('Invalid byte ' + byte.toString(16));
  }
  return string;
}

Decoder.prototype._array = function (length) {
  var value = new Array(length);
  for (var i = 0; i < length; i++) {
    value[i] = this._parse();
  }
  return value;
};

Decoder.prototype._map = function (length) {
  var key = '', value = {};
  for (var i = 0; i < length; i++) {
    key = this._parse();
    value[key] = this._parse();
  }
  return value;
};

Decoder.prototype._str = function (length) {
  var value = utf8Read(this._view, this._offset, length);
  this._offset += length;
  return value;
};

Decoder.prototype._bin = function (length) {
  var value = this._buffer.slice(this._offset, this._offset + length);
  this._offset += length;
  return value;
};

Decoder.prototype._parse = function () {
  var prefix = this._view.getUint8(this._offset++);
  var value, length = 0, type = 0, hi = 0, lo = 0;

  if (prefix < 0xc0) {
    // positive fixint
    if (prefix < 0x80) {
      return prefix;
    }
    // fixmap
    if (prefix < 0x90) {
      return this._map(prefix & 0x0f);
    }
    // fixarray
    if (prefix < 0xa0) {
      return this._array(prefix & 0x0f);
    }
    // fixstr
    return this._str(prefix & 0x1f);
  }

  // negative fixint
  if (prefix > 0xdf) {
    return (0xff - prefix + 1) * -1;
  }

  switch (prefix) {
    // nil
    case 0xc0:
      return null;
    // false
    case 0xc2:
      return false;
    // true
    case 0xc3:
      return true;

    // bin
    case 0xc4:
      length = this._view.getUint8(this._offset);
      this._offset += 1;
      return this._bin(length);
    case 0xc5:
      length = this._view.getUint16(this._offset);
      this._offset += 2;
      return this._bin(length);
    case 0xc6:
      length = this._view.getUint32(this._offset);
      this._offset += 4;
      return this._bin(length);

    // ext
    case 0xc7:
      length = this._view.getUint8(this._offset);
      type = this._view.getInt8(this._offset + 1);
      this._offset += 2;
      return [type, this._bin(length)];
    case 0xc8:
      length = this._view.getUint16(this._offset);
      type = this._view.getInt8(this._offset + 2);
      this._offset += 3;
      return [type, this._bin(length)];
    case 0xc9:
      length = this._view.getUint32(this._offset);
      type = this._view.getInt8(this._offset + 4);
      this._offset += 5;
      return [type, this._bin(length)];

    // float
    case 0xca:
      value = this._view.getFloat32(this._offset);
      this._offset += 4;
      return value;
    case 0xcb:
      value = this._view.getFloat64(this._offset);
      this._offset += 8;
      return value;

    // uint
    case 0xcc:
      value = this._view.getUint8(this._offset);
      this._offset += 1;
      return value;
    case 0xcd:
      value = this._view.getUint16(this._offset);
      this._offset += 2;
      return value;
    case 0xce:
      value = this._view.getUint32(this._offset);
      this._offset += 4;
      return value;
    case 0xcf:
      hi = this._view.getUint32(this._offset) * Math.pow(2, 32);
      lo = this._view.getUint32(this._offset + 4);
      this._offset += 8;
      return hi + lo;

    // int
    case 0xd0:
      value = this._view.getInt8(this._offset);
      this._offset += 1;
      return value;
    case 0xd1:
      value = this._view.getInt16(this._offset);
      this._offset += 2;
      return value;
    case 0xd2:
      value = this._view.getInt32(this._offset);
      this._offset += 4;
      return value;
    case 0xd3:
      hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
      lo = this._view.getUint32(this._offset + 4);
      this._offset += 8;
      return hi + lo;

    // fixext
    case 0xd4:
      type = this._view.getInt8(this._offset);
      this._offset += 1;
      if (type === 0x00) {
        this._offset += 1;
        return void 0;
      }
      return [type, this._bin(1)];
    case 0xd5:
      type = this._view.getInt8(this._offset);
      this._offset += 1;
      return [type, this._bin(2)];
    case 0xd6:
      type = this._view.getInt8(this._offset);
      this._offset += 1;
      return [type, this._bin(4)];
    case 0xd7:
      type = this._view.getInt8(this._offset);
      this._offset += 1;
      if (type === 0x00) {
        hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
        lo = this._view.getUint32(this._offset + 4);
        this._offset += 8;
        return new Date(hi + lo);
      }
      return [type, this._bin(8)];
    case 0xd8:
      type = this._view.getInt8(this._offset);
      this._offset += 1;
      return [type, this._bin(16)];

    // str
    case 0xd9:
      length = this._view.getUint8(this._offset);
      this._offset += 1;
      return this._str(length);
    case 0xda:
      length = this._view.getUint16(this._offset);
      this._offset += 2;
      return this._str(length);
    case 0xdb:
      length = this._view.getUint32(this._offset);
      this._offset += 4;
      return this._str(length);

    // array
    case 0xdc:
      length = this._view.getUint16(this._offset);
      this._offset += 2;
      return this._array(length);
    case 0xdd:
      length = this._view.getUint32(this._offset);
      this._offset += 4;
      return this._array(length);

    // map
    case 0xde:
      length = this._view.getUint16(this._offset);
      this._offset += 2;
      return this._map(length);
    case 0xdf:
      length = this._view.getUint32(this._offset);
      this._offset += 4;
      return this._map(length);
  }

  throw new Error('Could not parse');
};

function decode(buffer) {
  var decoder = new Decoder(buffer);
  var value = decoder._parse();
  if (decoder._offset !== buffer.byteLength) {
    throw new Error((buffer.byteLength - decoder._offset) + ' trailing bytes');
  }
  return value;
}

module.exports = decode;

},{}],37:[function(require,module,exports){
'use strict';

function utf8Write(view, offset, str) {
  var c = 0;
  for (var i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i);
    if (c < 0x80) {
      view.setUint8(offset++, c);
    }
    else if (c < 0x800) {
      view.setUint8(offset++, 0xc0 | (c >> 6));
      view.setUint8(offset++, 0x80 | (c & 0x3f));
    }
    else if (c < 0xd800 || c >= 0xe000) {
      view.setUint8(offset++, 0xe0 | (c >> 12));
      view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
      view.setUint8(offset++, 0x80 | (c & 0x3f));
    }
    else {
      i++;
      c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      view.setUint8(offset++, 0xf0 | (c >> 18));
      view.setUint8(offset++, 0x80 | (c >> 12) & 0x3f);
      view.setUint8(offset++, 0x80 | (c >> 6) & 0x3f);
      view.setUint8(offset++, 0x80 | (c & 0x3f));
    }
  }
}

function utf8Length(str) {
  var c = 0, length = 0;
  for (var i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i);
    if (c < 0x80) {
      length += 1;
    }
    else if (c < 0x800) {
      length += 2;
    }
    else if (c < 0xd800 || c >= 0xe000) {
      length += 3;
    }
    else {
      i++;
      length += 4;
    }
  }
  return length;
}

function _encode(bytes, defers, value) {
  var type = typeof value, i = 0, l = 0, hi = 0, lo = 0, length = 0, size = 0;

  if (type === 'string') {
    length = utf8Length(value);

    // fixstr
    if (length < 0x20) {
      bytes.push(length | 0xa0);
      size = 1;
    }
    // str 8
    else if (length < 0x100) {
      bytes.push(0xd9, length);
      size = 2;
    }
    // str 16
    else if (length < 0x10000) {
      bytes.push(0xda, length >> 8, length);
      size = 3;
    }
    // str 32
    else if (length < 0x100000000) {
      bytes.push(0xdb, length >> 24, length >> 16, length >> 8, length);
      size = 5;
    } else {
      throw new Error('String too long');
    }
    defers.push({ _str: value, _length: length, _offset: bytes.length });
    return size + length;
  }
  if (type === 'number') {
    // TODO: encode to float 32?

    // float 64
    if (Math.floor(value) !== value || !isFinite(value)) {
      bytes.push(0xcb);
      defers.push({ _float: value, _length: 8, _offset: bytes.length });
      return 9;
    }

    if (value >= 0) {
      // positive fixnum
      if (value < 0x80) {
        bytes.push(value);
        return 1;
      }
      // uint 8
      if (value < 0x100) {
        bytes.push(0xcc, value);
        return 2;
      }
      // uint 16
      if (value < 0x10000) {
        bytes.push(0xcd, value >> 8, value);
        return 3;
      }
      // uint 32
      if (value < 0x100000000) {
        bytes.push(0xce, value >> 24, value >> 16, value >> 8, value);
        return 5;
      }
      // uint 64
      hi = (value / Math.pow(2, 32)) >> 0;
      lo = value >>> 0;
      bytes.push(0xcf, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
      return 9;
    } else {
      // negative fixnum
      if (value >= -0x20) {
        bytes.push(value);
        return 1;
      }
      // int 8
      if (value >= -0x80) {
        bytes.push(0xd0, value);
        return 2;
      }
      // int 16
      if (value >= -0x8000) {
        bytes.push(0xd1, value >> 8, value);
        return 3;
      }
      // int 32
      if (value >= -0x80000000) {
        bytes.push(0xd2, value >> 24, value >> 16, value >> 8, value);
        return 5;
      }
      // int 64
      hi = Math.floor(value / Math.pow(2, 32));
      lo = value >>> 0;
      bytes.push(0xd3, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
      return 9;
    }
  }
  if (type === 'object') {
    // nil
    if (value === null) {
      bytes.push(0xc0);
      return 1;
    }

    if (Array.isArray(value)) {
      length = value.length;

      // fixarray
      if (length < 0x10) {
        bytes.push(length | 0x90);
        size = 1;
      }
      // array 16
      else if (length < 0x10000) {
        bytes.push(0xdc, length >> 8, length);
        size = 3;
      }
      // array 32
      else if (length < 0x100000000) {
        bytes.push(0xdd, length >> 24, length >> 16, length >> 8, length);
        size = 5;
      } else {
        throw new Error('Array too large');
      }
      for (i = 0; i < length; i++) {
        size += _encode(bytes, defers, value[i]);
      }
      return size;
    }

    // fixext 8 / Date
    if (value instanceof Date) {
      var time = value.getTime();
      hi = Math.floor(time / Math.pow(2, 32));
      lo = time >>> 0;
      bytes.push(0xd7, 0, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
      return 10;
    }

    if (value instanceof ArrayBuffer) {
      length = value.byteLength;

      // bin 8
      if (length < 0x100) {
        bytes.push(0xc4, length);
        size = 2;
      } else
      // bin 16
      if (length < 0x10000) {
        bytes.push(0xc5, length >> 8, length);
        size = 3;
      } else
      // bin 32
      if (length < 0x100000000) {
        bytes.push(0xc6, length >> 24, length >> 16, length >> 8, length);
        size = 5;
      } else {
        throw new Error('Buffer too large');
      }
      defers.push({ _bin: value, _length: length, _offset: bytes.length });
      return size + length;
    }

    if (typeof value.toJSON === 'function') {
      return _encode(bytes, defers, value.toJSON());
    }

    var keys = [], key = '';

    var allKeys = Object.keys(value);
    for (i = 0, l = allKeys.length; i < l; i++) {
      key = allKeys[i];
      if (typeof value[key] !== 'function') {
        keys.push(key);
      }
    }
    length = keys.length;

    // fixmap
    if (length < 0x10) {
      bytes.push(length | 0x80);
      size = 1;
    }
    // map 16
    else if (length < 0x10000) {
      bytes.push(0xde, length >> 8, length);
      size = 3;
    }
    // map 32
    else if (length < 0x100000000) {
      bytes.push(0xdf, length >> 24, length >> 16, length >> 8, length);
      size = 5;
    } else {
      throw new Error('Object too large');
    }

    for (i = 0; i < length; i++) {
      key = keys[i];
      size += _encode(bytes, defers, key);
      size += _encode(bytes, defers, value[key]);
    }
    return size;
  }
  // false/true
  if (type === 'boolean') {
    bytes.push(value ? 0xc3 : 0xc2);
    return 1;
  }
  // fixext 1 / undefined
  if (type === 'undefined') {
    bytes.push(0xd4, 0, 0);
    return 3;
  }
  throw new Error('Could not encode');
}

function encode(value) {
  var bytes = [];
  var defers = [];
  var size = _encode(bytes, defers, value);
  var buf = new ArrayBuffer(size);
  var view = new DataView(buf);

  var deferIndex = 0;
  var deferWritten = 0;
  var nextOffset = -1;
  if (defers.length > 0) {
    nextOffset = defers[0]._offset;
  }

  var defer, deferLength = 0, offset = 0;
  for (var i = 0, l = bytes.length; i < l; i++) {
    view.setUint8(deferWritten + i, bytes[i]);
    if (i + 1 !== nextOffset) { continue; }
    defer = defers[deferIndex];
    deferLength = defer._length;
    offset = deferWritten + nextOffset;
    if (defer._bin) {
      var bin = new Uint8Array(defer._bin);
      for (var j = 0; j < deferLength; j++) {
        view.setUint8(offset + j, bin[j]);
      }
    } else if (defer._str) {
      utf8Write(view, offset, defer._str);
    } else if (defer._float !== undefined) {
      view.setFloat64(offset, defer._float);
    }
    deferIndex++;
    deferWritten += deferLength;
    if (defers[deferIndex]) {
      nextOffset = defers[deferIndex]._offset;
    }
  }
  return buf;
}

module.exports = encode;

},{}]},{},[27])(27)
});
