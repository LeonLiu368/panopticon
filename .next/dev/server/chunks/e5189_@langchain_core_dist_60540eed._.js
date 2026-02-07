module.exports = [
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") for(var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++){
        key = keys[i];
        if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ((k)=>from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
//#endregion
exports.__export = __export;
exports.__toESM = __toESM;
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/map_keys.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const decamelize = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/decamelize/index.js [app-route] (ecmascript)"));
const camelcase = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/camelcase/index.js [app-route] (ecmascript)"));
//#region src/load/map_keys.ts
function keyToJson(key, map) {
    return map?.[key] || (0, decamelize.default)(key);
}
function keyFromJson(key, map) {
    return map?.[key] || (0, camelcase.default)(key);
}
function mapKeys(fields, mapper, map) {
    const mapped = {};
    for(const key in fields)if (Object.hasOwn(fields, key)) mapped[mapper(key, map)] = fields[key];
    return mapped;
}
//#endregion
exports.keyFromJson = keyFromJson;
exports.keyToJson = keyToJson;
exports.mapKeys = mapKeys; //# sourceMappingURL=map_keys.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/validation.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/load/validation.ts
/**
* Sentinel key used to mark escaped user objects during serialization.
*
* When a plain object contains 'lc' key (which could be confused with LC objects),
* we wrap it as `{"__lc_escaped__": {...original...}}`.
*/ const LC_ESCAPED_KEY = "__lc_escaped__";
/**
* Check if an object needs escaping to prevent confusion with LC objects.
*
* An object needs escaping if:
* 1. It has an `'lc'` key (could be confused with LC serialization format)
* 2. It has only the escape key (would be mistaken for an escaped object)
*/ function needsEscaping(obj) {
    return "lc" in obj || Object.keys(obj).length === 1 && LC_ESCAPED_KEY in obj;
}
/**
* Wrap an object in the escape marker.
*
* @example
* ```typescript
* {"key": "value"}  // becomes {"__lc_escaped__": {"key": "value"}}
* ```
*/ function escapeObject(obj) {
    return {
        [LC_ESCAPED_KEY]: obj
    };
}
/**
* Check if an object is an escaped user object.
*
* @example
* ```typescript
* {"__lc_escaped__": {...}}  // is an escaped object
* ```
*/ function isEscapedObject(obj) {
    return Object.keys(obj).length === 1 && LC_ESCAPED_KEY in obj;
}
/**
* Check if an object looks like a Serializable instance (duck typing).
*/ function isSerializableLike(obj) {
    return obj !== null && typeof obj === "object" && "lc_serializable" in obj && typeof obj.toJSON === "function";
}
/**
* Create a "not_implemented" serialization result for objects that cannot be serialized.
*/ function createNotImplemented(obj) {
    let id;
    if (obj !== null && typeof obj === "object") if ("lc_id" in obj && Array.isArray(obj.lc_id)) id = obj.lc_id;
    else id = [
        obj.constructor?.name ?? "Object"
    ];
    else id = [
        typeof obj
    ];
    return {
        lc: 1,
        type: "not_implemented",
        id
    };
}
/**
* Escape a value if it needs escaping (contains `lc` key).
*
* This is a simpler version of `serializeValue` that doesn't handle Serializable
* objects - it's meant to be called on kwargs values that have already been
* processed by `toJSON()`.
*
* @param value - The value to potentially escape.
* @param pathSet - WeakSet to track ancestor objects in the current path to detect circular references.
*                  Objects are removed after processing to allow shared references (same object in
*                  multiple places) while still detecting true circular references (ancestor in descendant).
* @returns The value with any `lc`-containing objects wrapped in escape markers.
*/ function escapeIfNeeded(value, pathSet = /* @__PURE__ */ new WeakSet()) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        if (pathSet.has(value)) return createNotImplemented(value);
        if (isSerializableLike(value)) return value;
        pathSet.add(value);
        const record = value;
        if (needsEscaping(record)) {
            pathSet.delete(value);
            return escapeObject(record);
        }
        const result = {};
        for (const [key, val] of Object.entries(record))result[key] = escapeIfNeeded(val, pathSet);
        pathSet.delete(value);
        return result;
    }
    if (Array.isArray(value)) return value.map((item)=>escapeIfNeeded(item, pathSet));
    return value;
}
/**
* Unescape a value, processing escape markers in object values and arrays.
*
* When an escaped object is encountered (`{"__lc_escaped__": ...}`), it's
* unwrapped and the contents are returned AS-IS (no further processing).
* The contents represent user data that should not be modified.
*
* For regular objects and arrays, we recurse to find any nested escape markers.
*
* @param obj - The value to unescape.
* @returns The unescaped value.
*/ function unescapeValue(obj) {
    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
        const record = obj;
        if (isEscapedObject(record)) return record[LC_ESCAPED_KEY];
        const result = {};
        for (const [key, value] of Object.entries(record))result[key] = unescapeValue(value);
        return result;
    }
    if (Array.isArray(obj)) return obj.map((item)=>unescapeValue(item));
    return obj;
}
//#endregion
exports.escapeIfNeeded = escapeIfNeeded;
exports.isEscapedObject = isEscapedObject;
exports.unescapeValue = unescapeValue; //# sourceMappingURL=validation.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/serializable.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_map_keys = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/map_keys.cjs [app-route] (ecmascript)");
const require_validation = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/validation.cjs [app-route] (ecmascript)");
//#region src/load/serializable.ts
var serializable_exports = {};
require_rolldown_runtime.__export(serializable_exports, {
    Serializable: ()=>Serializable,
    get_lc_unique_name: ()=>get_lc_unique_name
});
function shallowCopy(obj) {
    return Array.isArray(obj) ? [
        ...obj
    ] : {
        ...obj
    };
}
function replaceSecrets(root, secretsMap) {
    const result = shallowCopy(root);
    for (const [path, secretId] of Object.entries(secretsMap)){
        const [last, ...partsReverse] = path.split(".").reverse();
        let current = result;
        for (const part of partsReverse.reverse()){
            if (current[part] === void 0) break;
            current[part] = shallowCopy(current[part]);
            current = current[part];
        }
        if (current[last] !== void 0) current[last] = {
            lc: 1,
            type: "secret",
            id: [
                secretId
            ]
        };
    }
    return result;
}
/**
* Get a unique name for the module, rather than parent class implementations.
* Should not be subclassed, subclass lc_name above instead.
*/ function get_lc_unique_name(serializableClass) {
    const parentClass = Object.getPrototypeOf(serializableClass);
    const lcNameIsSubclassed = typeof serializableClass.lc_name === "function" && (typeof parentClass.lc_name !== "function" || serializableClass.lc_name() !== parentClass.lc_name());
    if (lcNameIsSubclassed) return serializableClass.lc_name();
    else return serializableClass.name;
}
var Serializable = class Serializable {
    lc_serializable = false;
    lc_kwargs;
    /**
	* The name of the serializable. Override to provide an alias or
	* to preserve the serialized module name in minified environments.
	*
	* Implemented as a static method to support loading logic.
	*/ static lc_name() {
        return this.name;
    }
    /**
	* The final serialized identifier for the module.
	*/ get lc_id() {
        return [
            ...this.lc_namespace,
            get_lc_unique_name(this.constructor)
        ];
    }
    /**
	* A map of secrets, which will be omitted from serialization.
	* Keys are paths to the secret in constructor args, e.g. "foo.bar.baz".
	* Values are the secret ids, which will be used when deserializing.
	*/ get lc_secrets() {
        return void 0;
    }
    /**
	* A map of additional attributes to merge with constructor args.
	* Keys are the attribute names, e.g. "foo".
	* Values are the attribute values, which will be serialized.
	* These attributes need to be accepted by the constructor as arguments.
	*/ get lc_attributes() {
        return void 0;
    }
    /**
	* A map of aliases for constructor args.
	* Keys are the attribute names, e.g. "foo".
	* Values are the alias that will replace the key in serialization.
	* This is used to eg. make argument names match Python.
	*/ get lc_aliases() {
        return void 0;
    }
    /**
	* A manual list of keys that should be serialized.
	* If not overridden, all fields passed into the constructor will be serialized.
	*/ get lc_serializable_keys() {
        return void 0;
    }
    constructor(kwargs, ..._args){
        if (this.lc_serializable_keys !== void 0) this.lc_kwargs = Object.fromEntries(Object.entries(kwargs || {}).filter(([key])=>this.lc_serializable_keys?.includes(key)));
        else this.lc_kwargs = kwargs ?? {};
    }
    toJSON() {
        if (!this.lc_serializable) return this.toJSONNotImplemented();
        if (this.lc_kwargs instanceof Serializable || typeof this.lc_kwargs !== "object" || Array.isArray(this.lc_kwargs)) return this.toJSONNotImplemented();
        const aliases = {};
        const secrets = {};
        const kwargs = Object.keys(this.lc_kwargs).reduce((acc, key)=>{
            acc[key] = key in this ? this[key] : this.lc_kwargs[key];
            return acc;
        }, {});
        for(let current = Object.getPrototypeOf(this); current; current = Object.getPrototypeOf(current)){
            Object.assign(aliases, Reflect.get(current, "lc_aliases", this));
            Object.assign(secrets, Reflect.get(current, "lc_secrets", this));
            Object.assign(kwargs, Reflect.get(current, "lc_attributes", this));
        }
        Object.keys(secrets).forEach((keyPath)=>{
            let read = this;
            let write = kwargs;
            const [last, ...partsReverse] = keyPath.split(".").reverse();
            for (const key of partsReverse.reverse()){
                if (!(key in read) || read[key] === void 0) return;
                if (!(key in write) || write[key] === void 0) {
                    if (typeof read[key] === "object" && read[key] != null) write[key] = {};
                    else if (Array.isArray(read[key])) write[key] = [];
                }
                read = read[key];
                write = write[key];
            }
            if (last in read && read[last] !== void 0) write[last] = write[last] || read[last];
        });
        const escapedKwargs = {};
        const pathSet = /* @__PURE__ */ new WeakSet();
        pathSet.add(this);
        for (const [key, value] of Object.entries(kwargs))escapedKwargs[key] = require_validation.escapeIfNeeded(value, pathSet);
        const kwargsWithSecrets = Object.keys(secrets).length ? replaceSecrets(escapedKwargs, secrets) : escapedKwargs;
        const processedKwargs = require_map_keys.mapKeys(kwargsWithSecrets, require_map_keys.keyToJson, aliases);
        return {
            lc: 1,
            type: "constructor",
            id: this.lc_id,
            kwargs: processedKwargs
        };
    }
    toJSONNotImplemented() {
        return {
            lc: 1,
            type: "not_implemented",
            id: this.lc_id
        };
    }
};
//#endregion
exports.Serializable = Serializable;
exports.get_lc_unique_name = get_lc_unique_name;
Object.defineProperty(exports, 'serializable_exports', {
    enumerable: true,
    get: function() {
        return serializable_exports;
    }
}); //# sourceMappingURL=serializable.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/content/data.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/messages/content/data.ts
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function isDataContentBlock(content_block) {
    return typeof content_block === "object" && content_block !== null && "type" in content_block && typeof content_block.type === "string" && "source_type" in content_block && (content_block.source_type === "url" || content_block.source_type === "base64" || content_block.source_type === "text" || content_block.source_type === "id");
}
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function isURLContentBlock(content_block) {
    return isDataContentBlock(content_block) && content_block.source_type === "url" && "url" in content_block && typeof content_block.url === "string";
}
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function isBase64ContentBlock(content_block) {
    return isDataContentBlock(content_block) && content_block.source_type === "base64" && "data" in content_block && typeof content_block.data === "string";
}
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function isPlainTextContentBlock(content_block) {
    return isDataContentBlock(content_block) && content_block.source_type === "text" && "text" in content_block && typeof content_block.text === "string";
}
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function isIDContentBlock(content_block) {
    return isDataContentBlock(content_block) && content_block.source_type === "id" && "id" in content_block && typeof content_block.id === "string";
}
/**
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function convertToOpenAIImageBlock(content_block) {
    if (isDataContentBlock(content_block)) {
        if (content_block.source_type === "url") return {
            type: "image_url",
            image_url: {
                url: content_block.url
            }
        };
        if (content_block.source_type === "base64") {
            if (!content_block.mime_type) throw new Error("mime_type key is required for base64 data.");
            const mime_type = content_block.mime_type;
            return {
                type: "image_url",
                image_url: {
                    url: `data:${mime_type};base64,${content_block.data}`
                }
            };
        }
    }
    throw new Error("Unsupported source type. Only 'url' and 'base64' are supported.");
}
/**
* Utility function for ChatModelProviders. Parses a mime type into a type, subtype, and parameters.
*
* @param mime_type - The mime type to parse.
* @returns An object containing the type, subtype, and parameters.
*
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function parseMimeType(mime_type) {
    const parts = mime_type.split(";")[0].split("/");
    if (parts.length !== 2) throw new Error(`Invalid mime type: "${mime_type}" - does not match type/subtype format.`);
    const type = parts[0].trim();
    const subtype = parts[1].trim();
    if (type === "" || subtype === "") throw new Error(`Invalid mime type: "${mime_type}" - type or subtype is empty.`);
    const parameters = {};
    for (const parameterKvp of mime_type.split(";").slice(1)){
        const parameterParts = parameterKvp.split("=");
        if (parameterParts.length !== 2) throw new Error(`Invalid parameter syntax in mime type: "${mime_type}".`);
        const key = parameterParts[0].trim();
        const value = parameterParts[1].trim();
        if (key === "") throw new Error(`Invalid parameter syntax in mime type: "${mime_type}".`);
        parameters[key] = value;
    }
    return {
        type,
        subtype,
        parameters
    };
}
/**
* Utility function for ChatModelProviders. Parses a base64 data URL into a typed array or string.
*
* @param dataUrl - The base64 data URL to parse.
* @param asTypedArray - Whether to return the data as a typed array.
* @returns The parsed data and mime type, or undefined if the data URL is invalid.
*
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function parseBase64DataUrl({ dataUrl: data_url, asTypedArray = false }) {
    const formatMatch = data_url.match(/^data:(\w+\/\w+);base64,([A-Za-z0-9+/]+=*)$/);
    let mime_type;
    if (formatMatch) {
        mime_type = formatMatch[1].toLowerCase();
        const data = asTypedArray ? Uint8Array.from(atob(formatMatch[2]), (c)=>c.charCodeAt(0)) : formatMatch[2];
        return {
            mime_type,
            data
        };
    }
    return void 0;
}
/**
* Convert from a standard data content block to a provider's proprietary data content block format.
*
* Don't override this method. Instead, override the more specific conversion methods and use this
* method unmodified.
*
* @param block - The standard data content block to convert.
* @returns The provider data content block.
* @throws An error if the standard data content block type is not supported.
*
* @deprecated Don't use data content blocks. Use {@link ContentBlock.Multimodal.Data} instead.
*/ function convertToProviderContentBlock(block, converter) {
    if (block.type === "text") {
        if (!converter.fromStandardTextBlock) throw new Error(`Converter for ${converter.providerName} does not implement \`fromStandardTextBlock\` method.`);
        return converter.fromStandardTextBlock(block);
    }
    if (block.type === "image") {
        if (!converter.fromStandardImageBlock) throw new Error(`Converter for ${converter.providerName} does not implement \`fromStandardImageBlock\` method.`);
        return converter.fromStandardImageBlock(block);
    }
    if (block.type === "audio") {
        if (!converter.fromStandardAudioBlock) throw new Error(`Converter for ${converter.providerName} does not implement \`fromStandardAudioBlock\` method.`);
        return converter.fromStandardAudioBlock(block);
    }
    if (block.type === "file") {
        if (!converter.fromStandardFileBlock) throw new Error(`Converter for ${converter.providerName} does not implement \`fromStandardFileBlock\` method.`);
        return converter.fromStandardFileBlock(block);
    }
    throw new Error(`Unable to convert content block type '${block.type}' to provider-specific format: not recognized.`);
}
//#endregion
exports.convertToOpenAIImageBlock = convertToOpenAIImageBlock;
exports.convertToProviderContentBlock = convertToProviderContentBlock;
exports.isBase64ContentBlock = isBase64ContentBlock;
exports.isDataContentBlock = isDataContentBlock;
exports.isIDContentBlock = isIDContentBlock;
exports.isPlainTextContentBlock = isPlainTextContentBlock;
exports.isURLContentBlock = isURLContentBlock;
exports.parseBase64DataUrl = parseBase64DataUrl;
exports.parseMimeType = parseMimeType; //# sourceMappingURL=data.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/messages/block_translators/utils.ts
function _isContentBlock(block, type) {
    return _isObject(block) && block.type === type;
}
function _isObject(value) {
    return typeof value === "object" && value !== null;
}
function _isArray(value) {
    return Array.isArray(value);
}
function _isString(value) {
    return typeof value === "string";
}
function _isNumber(value) {
    return typeof value === "number";
}
function _isBytesArray(value) {
    return value instanceof Uint8Array;
}
function safeParseJson(value) {
    try {
        return JSON.parse(value);
    } catch  {
        return void 0;
    }
}
const iife = (fn)=>fn();
//#endregion
exports._isArray = _isArray;
exports._isBytesArray = _isBytesArray;
exports._isContentBlock = _isContentBlock;
exports._isNumber = _isNumber;
exports._isObject = _isObject;
exports._isString = _isString;
exports.iife = iife;
exports.safeParseJson = safeParseJson; //# sourceMappingURL=utils.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/anthropic.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/anthropic.ts
function convertAnthropicAnnotation(citation) {
    if (citation.type === "char_location" && require_utils._isString(citation.document_title) && require_utils._isNumber(citation.start_char_index) && require_utils._isNumber(citation.end_char_index) && require_utils._isString(citation.cited_text)) {
        const { document_title, start_char_index, end_char_index, cited_text, ...rest } = citation;
        return {
            ...rest,
            type: "citation",
            source: "char",
            title: document_title ?? void 0,
            startIndex: start_char_index,
            endIndex: end_char_index,
            citedText: cited_text
        };
    }
    if (citation.type === "page_location" && require_utils._isString(citation.document_title) && require_utils._isNumber(citation.start_page_number) && require_utils._isNumber(citation.end_page_number) && require_utils._isString(citation.cited_text)) {
        const { document_title, start_page_number, end_page_number, cited_text, ...rest } = citation;
        return {
            ...rest,
            type: "citation",
            source: "page",
            title: document_title ?? void 0,
            startIndex: start_page_number,
            endIndex: end_page_number,
            citedText: cited_text
        };
    }
    if (citation.type === "content_block_location" && require_utils._isString(citation.document_title) && require_utils._isNumber(citation.start_block_index) && require_utils._isNumber(citation.end_block_index) && require_utils._isString(citation.cited_text)) {
        const { document_title, start_block_index, end_block_index, cited_text, ...rest } = citation;
        return {
            ...rest,
            type: "citation",
            source: "block",
            title: document_title ?? void 0,
            startIndex: start_block_index,
            endIndex: end_block_index,
            citedText: cited_text
        };
    }
    if (citation.type === "web_search_result_location" && require_utils._isString(citation.url) && require_utils._isString(citation.title) && require_utils._isString(citation.encrypted_index) && require_utils._isString(citation.cited_text)) {
        const { url, title, encrypted_index, cited_text, ...rest } = citation;
        return {
            ...rest,
            type: "citation",
            source: "url",
            url,
            title,
            startIndex: Number(encrypted_index),
            endIndex: Number(encrypted_index),
            citedText: cited_text
        };
    }
    if (citation.type === "search_result_location" && require_utils._isString(citation.source) && require_utils._isString(citation.title) && require_utils._isNumber(citation.start_block_index) && require_utils._isNumber(citation.end_block_index) && require_utils._isString(citation.cited_text)) {
        const { source, title, start_block_index, end_block_index, cited_text, ...rest } = citation;
        return {
            ...rest,
            type: "citation",
            source: "search",
            url: source,
            title: title ?? void 0,
            startIndex: start_block_index,
            endIndex: end_block_index,
            citedText: cited_text
        };
    }
    return void 0;
}
/**
* Converts an Anthropic content block to a standard V1 content block.
*
* This function handles the conversion of Anthropic-specific content blocks
* (document and image blocks) to the standardized V1 format. It supports
* various source types including base64 data, URLs, file IDs, and text data.
*
* @param block - The Anthropic content block to convert
* @returns A standard V1 content block if conversion is successful, undefined otherwise
*
* @example
* ```typescript
* const anthropicBlock = {
*   type: "image",
*   source: {
*     type: "base64",
*     media_type: "image/png",
*     data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
*   }
* };
*
* const standardBlock = convertToV1FromAnthropicContentBlock(anthropicBlock);
* // Returns: { type: "image", mimeType: "image/png", data: "..." }
* ```
*/ function convertToV1FromAnthropicContentBlock(block) {
    if (require_utils._isContentBlock(block, "document") && require_utils._isObject(block.source) && "type" in block.source) {
        if (block.source.type === "base64" && require_utils._isString(block.source.media_type) && require_utils._isString(block.source.data)) return {
            type: "file",
            mimeType: block.source.media_type,
            data: block.source.data
        };
        else if (block.source.type === "url" && require_utils._isString(block.source.url)) return {
            type: "file",
            url: block.source.url
        };
        else if (block.source.type === "file" && require_utils._isString(block.source.file_id)) return {
            type: "file",
            fileId: block.source.file_id
        };
        else if (block.source.type === "text" && require_utils._isString(block.source.data)) return {
            type: "file",
            mimeType: String(block.source.media_type ?? "text/plain"),
            data: block.source.data
        };
    } else if (require_utils._isContentBlock(block, "image") && require_utils._isObject(block.source) && "type" in block.source) {
        if (block.source.type === "base64" && require_utils._isString(block.source.media_type) && require_utils._isString(block.source.data)) return {
            type: "image",
            mimeType: block.source.media_type,
            data: block.source.data
        };
        else if (block.source.type === "url" && require_utils._isString(block.source.url)) return {
            type: "image",
            url: block.source.url
        };
        else if (block.source.type === "file" && require_utils._isString(block.source.file_id)) return {
            type: "image",
            fileId: block.source.file_id
        };
    }
    return void 0;
}
/**
* Converts an array of content blocks from Anthropic format to v1 standard format.
*
* This function processes each content block in the input array, attempting to convert
* Anthropic-specific block formats (like image blocks with source objects, document blocks, etc.)
* to the standardized v1 content block format. If a block cannot be converted, it is
* passed through as-is with a type assertion to ContentBlock.Standard.
*
* @param content - Array of content blocks in Anthropic format to be converted
* @returns Array of content blocks in v1 standard format
*/ function convertToV1FromAnthropicInput(content) {
    function* iterateContent() {
        for (const block of content){
            const stdBlock = convertToV1FromAnthropicContentBlock(block);
            if (stdBlock) yield stdBlock;
            else yield block;
        }
    }
    return Array.from(iterateContent());
}
/**
* Converts an Anthropic AI message to an array of v1 standard content blocks.
*
* This function processes an AI message containing Anthropic-specific content blocks
* and converts them to the standardized v1 content block format.
*
* @param message - The AI message containing Anthropic-formatted content blocks
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const message = new AIMessage([
*   { type: "text", text: "Hello world" },
*   { type: "thinking", text: "Let me think about this..." },
*   { type: "tool_use", id: "123", name: "calculator", input: { a: 1, b: 2 } }
* ]);
*
* const standardBlocks = convertToV1FromAnthropicMessage(message);
* // Returns:
* // [
* //   { type: "text", text: "Hello world" },
* //   { type: "reasoning", reasoning: "Let me think about this..." },
* //   { type: "tool_call", id: "123", name: "calculator", args: { a: 1, b: 2 } }
* // ]
* ```
*/ function convertToV1FromAnthropicMessage(message) {
    function* iterateContent() {
        const content = typeof message.content === "string" ? [
            {
                type: "text",
                text: message.content
            }
        ] : message.content;
        for (const block of content){
            if (require_utils._isContentBlock(block, "text") && require_utils._isString(block.text)) {
                const { text, citations, ...rest } = block;
                if (require_utils._isArray(citations) && citations.length) {
                    const _citations = citations.reduce((acc, item)=>{
                        const citation = convertAnthropicAnnotation(item);
                        if (citation) return [
                            ...acc,
                            citation
                        ];
                        return acc;
                    }, []);
                    yield {
                        ...rest,
                        type: "text",
                        text,
                        annotations: _citations
                    };
                    continue;
                } else {
                    yield {
                        ...rest,
                        type: "text",
                        text
                    };
                    continue;
                }
            } else if (require_utils._isContentBlock(block, "thinking") && require_utils._isString(block.thinking)) {
                const { thinking, signature, ...rest } = block;
                yield {
                    ...rest,
                    type: "reasoning",
                    reasoning: thinking,
                    signature
                };
                continue;
            } else if (require_utils._isContentBlock(block, "redacted_thinking")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "tool_use") && require_utils._isString(block.name) && require_utils._isString(block.id)) {
                yield {
                    type: "tool_call",
                    id: block.id,
                    name: block.name,
                    args: block.input
                };
                continue;
            } else if (require_utils._isContentBlock(block, "input_json_delta")) {
                if (_isAIMessageChunk(message) && message.tool_call_chunks?.length) {
                    const tool_call_chunk = message.tool_call_chunks[0];
                    yield {
                        type: "tool_call_chunk",
                        id: tool_call_chunk.id,
                        name: tool_call_chunk.name,
                        args: tool_call_chunk.args,
                        index: tool_call_chunk.index
                    };
                    continue;
                }
            } else if (require_utils._isContentBlock(block, "server_tool_use") && require_utils._isString(block.name) && require_utils._isString(block.id)) {
                const { name, id } = block;
                if (name === "web_search") {
                    const query = require_utils.iife(()=>{
                        if (typeof block.input === "string") return block.input;
                        else if (require_utils._isObject(block.input) && require_utils._isString(block.input.query)) return block.input.query;
                        else if (require_utils._isString(block.partial_json)) {
                            const json = require_utils.safeParseJson(block.partial_json);
                            if (json?.query) return json.query;
                        }
                        return "";
                    });
                    yield {
                        id,
                        type: "server_tool_call",
                        name: "web_search",
                        args: {
                            query
                        }
                    };
                    continue;
                } else if (block.name === "code_execution") {
                    const code = require_utils.iife(()=>{
                        if (typeof block.input === "string") return block.input;
                        else if (require_utils._isObject(block.input) && require_utils._isString(block.input.code)) return block.input.code;
                        else if (require_utils._isString(block.partial_json)) {
                            const json = require_utils.safeParseJson(block.partial_json);
                            if (json?.code) return json.code;
                        }
                        return "";
                    });
                    yield {
                        id,
                        type: "server_tool_call",
                        name: "code_execution",
                        args: {
                            code
                        }
                    };
                    continue;
                }
            } else if (require_utils._isContentBlock(block, "web_search_tool_result") && require_utils._isString(block.tool_use_id) && require_utils._isArray(block.content)) {
                const { content: content$1, tool_use_id } = block;
                const urls = content$1.reduce((acc, content$2)=>{
                    if (require_utils._isContentBlock(content$2, "web_search_result")) return [
                        ...acc,
                        content$2.url
                    ];
                    return acc;
                }, []);
                yield {
                    type: "server_tool_call_result",
                    name: "web_search",
                    toolCallId: tool_use_id,
                    status: "success",
                    output: {
                        urls
                    }
                };
                continue;
            } else if (require_utils._isContentBlock(block, "code_execution_tool_result") && require_utils._isString(block.tool_use_id) && require_utils._isObject(block.content)) {
                yield {
                    type: "server_tool_call_result",
                    name: "code_execution",
                    toolCallId: block.tool_use_id,
                    status: "success",
                    output: block.content
                };
                continue;
            } else if (require_utils._isContentBlock(block, "mcp_tool_use")) {
                yield {
                    id: block.id,
                    type: "server_tool_call",
                    name: "mcp_tool_use",
                    args: block.input
                };
                continue;
            } else if (require_utils._isContentBlock(block, "mcp_tool_result") && require_utils._isString(block.tool_use_id) && require_utils._isObject(block.content)) {
                yield {
                    type: "server_tool_call_result",
                    name: "mcp_tool_use",
                    toolCallId: block.tool_use_id,
                    status: "success",
                    output: block.content
                };
                continue;
            } else if (require_utils._isContentBlock(block, "container_upload")) {
                yield {
                    type: "server_tool_call",
                    name: "container_upload",
                    args: block.input
                };
                continue;
            } else if (require_utils._isContentBlock(block, "search_result")) {
                yield {
                    id: block.id,
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "tool_result")) {
                yield {
                    id: block.id,
                    type: "non_standard",
                    value: block
                };
                continue;
            } else {
                const stdBlock = convertToV1FromAnthropicContentBlock(block);
                if (stdBlock) {
                    yield stdBlock;
                    continue;
                }
            }
            yield {
                type: "non_standard",
                value: block
            };
        }
    }
    return Array.from(iterateContent());
}
const ChatAnthropicTranslator = {
    translateContent: convertToV1FromAnthropicMessage,
    translateContentChunk: convertToV1FromAnthropicMessage
};
function _isAIMessageChunk(message) {
    return typeof message?._getType === "function" && typeof message.concat === "function" && message._getType() === "ai";
}
//#endregion
exports.ChatAnthropicTranslator = ChatAnthropicTranslator;
exports.convertToV1FromAnthropicInput = convertToV1FromAnthropicInput; //# sourceMappingURL=anthropic.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/data.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_data = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/content/data.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/data.ts
function convertToV1FromDataContentBlock(block) {
    if (require_data.isURLContentBlock(block)) return {
        type: block.type,
        mimeType: block.mime_type,
        url: block.url,
        metadata: block.metadata
    };
    if (require_data.isBase64ContentBlock(block)) return {
        type: block.type,
        mimeType: block.mime_type ?? "application/octet-stream",
        data: block.data,
        metadata: block.metadata
    };
    if (require_data.isIDContentBlock(block)) return {
        type: block.type,
        mimeType: block.mime_type,
        fileId: block.id,
        metadata: block.metadata
    };
    return block;
}
function convertToV1FromDataContent(content) {
    return content.map(convertToV1FromDataContentBlock);
}
function isOpenAIDataBlock(block) {
    if (require_utils._isContentBlock(block, "image_url") && require_utils._isObject(block.image_url)) return true;
    if (require_utils._isContentBlock(block, "input_audio") && require_utils._isObject(block.input_audio)) return true;
    if (require_utils._isContentBlock(block, "file") && require_utils._isObject(block.file)) return true;
    return false;
}
function convertToV1FromOpenAIDataBlock(block) {
    if (require_utils._isContentBlock(block, "image_url") && require_utils._isObject(block.image_url) && require_utils._isString(block.image_url.url)) {
        const parsed = require_data.parseBase64DataUrl({
            dataUrl: block.image_url.url
        });
        if (parsed) return {
            type: "image",
            mimeType: parsed.mime_type,
            data: parsed.data
        };
        else return {
            type: "image",
            url: block.image_url.url
        };
    } else if (require_utils._isContentBlock(block, "input_audio") && require_utils._isObject(block.input_audio) && require_utils._isString(block.input_audio.data) && require_utils._isString(block.input_audio.format)) return {
        type: "audio",
        data: block.input_audio.data,
        mimeType: `audio/${block.input_audio.format}`
    };
    else if (require_utils._isContentBlock(block, "file") && require_utils._isObject(block.file) && require_utils._isString(block.file.data)) {
        const parsed = require_data.parseBase64DataUrl({
            dataUrl: block.file.data
        });
        if (parsed) return {
            type: "file",
            data: parsed.data,
            mimeType: parsed.mime_type
        };
        else if (require_utils._isString(block.file.file_id)) return {
            type: "file",
            fileId: block.file.file_id
        };
    }
    return block;
}
//#endregion
exports.convertToV1FromDataContent = convertToV1FromDataContent;
exports.convertToV1FromOpenAIDataBlock = convertToV1FromOpenAIDataBlock;
exports.isOpenAIDataBlock = isOpenAIDataBlock; //# sourceMappingURL=data.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/openai.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
const require_data = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/data.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/openai.ts
/**
* Converts a ChatOpenAICompletions message to an array of v1 standard content blocks.
*
* This function processes an AI message from ChatOpenAICompletions API format
* and converts it to the standardized v1 content block format. It handles both
* string content and structured content blocks, as well as tool calls.
*
* @param message - The AI message containing ChatOpenAICompletions formatted content
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const message = new AIMessage("Hello world");
* const standardBlocks = convertToV1FromChatCompletions(message);
* // Returns: [{ type: "text", text: "Hello world" }]
* ```
*
* @example
* ```typescript
* const message = new AIMessage([
*   { type: "text", text: "Hello" },
*   { type: "image_url", image_url: { url: "https://example.com/image.png" } }
* ]);
* message.tool_calls = [
*   { id: "call_123", name: "calculator", args: { a: 1, b: 2 } }
* ];
*
* const standardBlocks = convertToV1FromChatCompletions(message);
* // Returns:
* // [
* //   { type: "text", text: "Hello" },
* //   { type: "image", url: "https://example.com/image.png" },
* //   { type: "tool_call", id: "call_123", name: "calculator", args: { a: 1, b: 2 } }
* // ]
* ```
*/ function convertToV1FromChatCompletions(message) {
    const blocks = [];
    if (typeof message.content === "string") blocks.push({
        type: "text",
        text: message.content
    });
    else blocks.push(...convertToV1FromChatCompletionsInput(message.content));
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
/**
* Converts a ChatOpenAICompletions message chunk to an array of v1 standard content blocks.
*
* This function processes an AI message chunk from OpenAI's chat completions API and converts
* it to the standardized v1 content block format. It handles both string and array content,
* as well as tool calls that may be present in the chunk.
*
* @param message - The AI message chunk containing OpenAI-formatted content blocks
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const chunk = new AIMessage("Hello");
* const standardBlocks = convertToV1FromChatCompletionsChunk(chunk);
* // Returns: [{ type: "text", text: "Hello" }]
* ```
*
* @example
* ```typescript
* const chunk = new AIMessage([
*   { type: "text", text: "Processing..." }
* ]);
* chunk.tool_calls = [
*   { id: "call_456", name: "search", args: { query: "test" } }
* ];
*
* const standardBlocks = convertToV1FromChatCompletionsChunk(chunk);
* // Returns:
* // [
* //   { type: "text", text: "Processing..." },
* //   { type: "tool_call", id: "call_456", name: "search", args: { query: "test" } }
* // ]
* ```
*/ function convertToV1FromChatCompletionsChunk(message) {
    const blocks = [];
    if (typeof message.content === "string") blocks.push({
        type: "text",
        text: message.content
    });
    else blocks.push(...convertToV1FromChatCompletionsInput(message.content));
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
/**
* Converts an array of ChatOpenAICompletions content blocks to v1 standard content blocks.
*
* This function processes content blocks from OpenAI's Chat Completions API format
* and converts them to the standardized v1 content block format. It handles both
* OpenAI-specific data blocks (which require conversion) and standard blocks
* (which are passed through with type assertion).
*
* @param blocks - Array of content blocks in ChatOpenAICompletions format
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const openaiBlocks = [
*   { type: "text", text: "Hello world" },
*   { type: "image_url", image_url: { url: "https://example.com/image.png" } }
* ];
*
* const standardBlocks = convertToV1FromChatCompletionsInput(openaiBlocks);
* // Returns:
* // [
* //   { type: "text", text: "Hello world" },
* //   { type: "image", url: "https://example.com/image.png" }
* // ]
* ```
*/ function convertToV1FromChatCompletionsInput(blocks) {
    const convertedBlocks = [];
    for (const block of blocks)if (require_data.isOpenAIDataBlock(block)) convertedBlocks.push(require_data.convertToV1FromOpenAIDataBlock(block));
    else convertedBlocks.push(block);
    return convertedBlocks;
}
function convertResponsesAnnotation(annotation) {
    if (annotation.type === "url_citation") {
        const { url, title, start_index, end_index } = annotation;
        return {
            type: "citation",
            url,
            title,
            startIndex: start_index,
            endIndex: end_index
        };
    }
    if (annotation.type === "file_citation") {
        const { file_id, filename, index } = annotation;
        return {
            type: "citation",
            title: filename,
            startIndex: index,
            endIndex: index,
            fileId: file_id
        };
    }
    return annotation;
}
/**
* Converts a ChatOpenAIResponses message to an array of v1 standard content blocks.
*
* This function processes an AI message containing OpenAI Responses-specific content blocks
* and converts them to the standardized v1 content block format. It handles reasoning summaries,
* text content with annotations, tool calls, and various tool outputs including code interpreter,
* web search, file search, computer calls, and MCP-related blocks.
*
* @param message - The AI message containing OpenAI Responses-formatted content blocks
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const message = new AIMessage({
*   content: [{ type: "text", text: "Hello world", annotations: [] }],
*   tool_calls: [{ id: "123", name: "calculator", args: { a: 1, b: 2 } }],
*   additional_kwargs: {
*     reasoning: { summary: [{ text: "Let me calculate this..." }] },
*     tool_outputs: [
*       {
*         type: "code_interpreter_call",
*         code: "print('hello')",
*         outputs: [{ type: "logs", logs: "hello" }]
*       }
*     ]
*   }
* });
*
* const standardBlocks = convertToV1FromResponses(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me calculate this..." },
* //   { type: "text", text: "Hello world", annotations: [] },
* //   { type: "tool_call", id: "123", name: "calculator", args: { a: 1, b: 2 } },
* //   { type: "code_interpreter_call", code: "print('hello')" },
* //   { type: "code_interpreter_result", output: [{ type: "code_interpreter_output", returnCode: 0, stdout: "hello" }] }
* // ]
* ```
*/ function convertToV1FromResponses(message) {
    function* iterateContent() {
        if (require_utils._isObject(message.additional_kwargs?.reasoning) && require_utils._isArray(message.additional_kwargs.reasoning.summary)) {
            const summary = message.additional_kwargs.reasoning.summary.reduce((acc, item)=>{
                if (require_utils._isObject(item) && require_utils._isString(item.text)) return `${acc}${item.text}`;
                return acc;
            }, "");
            yield {
                type: "reasoning",
                reasoning: summary
            };
        }
        const content = typeof message.content === "string" ? [
            {
                type: "text",
                text: message.content
            }
        ] : message.content;
        for (const block of content)if (require_utils._isContentBlock(block, "text")) {
            const { text, annotations, ...rest } = block;
            if (Array.isArray(annotations)) yield {
                ...rest,
                type: "text",
                text: String(text),
                annotations: annotations.map(convertResponsesAnnotation)
            };
            else yield {
                ...rest,
                type: "text",
                text: String(text)
            };
        }
        for (const toolCall of message.tool_calls ?? [])yield {
            type: "tool_call",
            id: toolCall.id,
            name: toolCall.name,
            args: toolCall.args
        };
        if (require_utils._isObject(message.additional_kwargs) && require_utils._isArray(message.additional_kwargs.tool_outputs)) for (const toolOutput of message.additional_kwargs.tool_outputs){
            if (require_utils._isContentBlock(toolOutput, "web_search_call")) {
                yield {
                    id: toolOutput.id,
                    type: "server_tool_call",
                    name: "web_search",
                    args: {
                        query: toolOutput.query
                    }
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "file_search_call")) {
                yield {
                    id: toolOutput.id,
                    type: "server_tool_call",
                    name: "file_search",
                    args: {
                        query: toolOutput.query
                    }
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "computer_call")) {
                yield {
                    type: "non_standard",
                    value: toolOutput
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "code_interpreter_call")) {
                if (require_utils._isString(toolOutput.code)) yield {
                    id: toolOutput.id,
                    type: "server_tool_call",
                    name: "code_interpreter",
                    args: {
                        code: toolOutput.code
                    }
                };
                if (require_utils._isArray(toolOutput.outputs)) {
                    const returnCode = require_utils.iife(()=>{
                        if (toolOutput.status === "in_progress") return void 0;
                        if (toolOutput.status === "completed") return 0;
                        if (toolOutput.status === "incomplete") return 127;
                        if (toolOutput.status === "interpreting") return void 0;
                        if (toolOutput.status === "failed") return 1;
                        return void 0;
                    });
                    for (const output of toolOutput.outputs)if (require_utils._isContentBlock(output, "logs")) {
                        yield {
                            type: "server_tool_call_result",
                            toolCallId: toolOutput.id ?? "",
                            status: "success",
                            output: {
                                type: "code_interpreter_output",
                                returnCode: returnCode ?? 0,
                                stderr: [
                                    0,
                                    void 0
                                ].includes(returnCode) ? void 0 : String(output.logs),
                                stdout: [
                                    0,
                                    void 0
                                ].includes(returnCode) ? String(output.logs) : void 0
                            }
                        };
                        continue;
                    }
                }
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "mcp_call")) {
                yield {
                    id: toolOutput.id,
                    type: "server_tool_call",
                    name: "mcp_call",
                    args: toolOutput.input
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "mcp_list_tools")) {
                yield {
                    id: toolOutput.id,
                    type: "server_tool_call",
                    name: "mcp_list_tools",
                    args: toolOutput.input
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "mcp_approval_request")) {
                yield {
                    type: "non_standard",
                    value: toolOutput
                };
                continue;
            } else if (require_utils._isContentBlock(toolOutput, "image_generation_call")) {
                if (require_utils._isString(toolOutput.result)) yield {
                    type: "image",
                    mimeType: "image/png",
                    data: toolOutput.result,
                    id: require_utils._isString(toolOutput.id) ? toolOutput.id : void 0,
                    metadata: {
                        status: require_utils._isString(toolOutput.status) ? toolOutput.status : void 0
                    }
                };
                yield {
                    type: "non_standard",
                    value: toolOutput
                };
                continue;
            }
            if (require_utils._isObject(toolOutput)) yield {
                type: "non_standard",
                value: toolOutput
            };
        }
    }
    return Array.from(iterateContent());
}
/**
* Converts a ChatOpenAIResponses message chunk to an array of v1 standard content blocks.
*
* This function processes an AI message chunk containing OpenAI-specific content blocks
* and converts them to the standardized v1 content block format. It handles both the
* regular message content and tool call chunks that are specific to streaming responses.
*
* @param message - The AI message chunk containing OpenAI-formatted content blocks
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const messageChunk = new AIMessageChunk({
*   content: [{ type: "text", text: "Hello" }],
*   tool_call_chunks: [
*     { id: "call_123", name: "calculator", args: '{"a": 1' }
*   ]
* });
*
* const standardBlocks = convertToV1FromResponsesChunk(messageChunk);
* // Returns:
* // [
* //   { type: "text", text: "Hello" },
* //   { type: "tool_call_chunk", id: "call_123", name: "calculator", args: '{"a": 1' }
* // ]
* ```
*/ function convertToV1FromResponsesChunk(message) {
    function* iterateContent() {
        yield* convertToV1FromResponses(message);
        for (const toolCallChunk of message.tool_call_chunks ?? [])yield {
            type: "tool_call_chunk",
            id: toolCallChunk.id,
            name: toolCallChunk.name,
            args: toolCallChunk.args
        };
    }
    return Array.from(iterateContent());
}
const ChatOpenAITranslator = {
    translateContent: (message)=>{
        if (typeof message.content === "string") return convertToV1FromChatCompletions(message);
        return convertToV1FromResponses(message);
    },
    translateContentChunk: (message)=>{
        if (typeof message.content === "string") return convertToV1FromChatCompletionsChunk(message);
        return convertToV1FromResponsesChunk(message);
    }
};
//#endregion
exports.ChatOpenAITranslator = ChatOpenAITranslator;
exports.convertToV1FromChatCompletionsInput = convertToV1FromChatCompletionsInput; //# sourceMappingURL=openai.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/message.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/messages/message.ts
/**
* Type guard to check if a value is a valid Message object.
*
* @param message - The value to check
* @returns true if the value is a valid Message object, false otherwise
*/ function isMessage(message) {
    return typeof message === "object" && message !== null && "type" in message && "content" in message && (typeof message.content === "string" || Array.isArray(message.content));
}
//#endregion
exports.isMessage = isMessage; //# sourceMappingURL=message.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/format.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/messages/format.ts
function convertToFormattedString(message, format = "pretty") {
    if (format === "pretty") return convertToPrettyString(message);
    return JSON.stringify(message);
}
function convertToPrettyString(message) {
    const lines = [];
    const title = ` ${message.type.charAt(0).toUpperCase() + message.type.slice(1)} Message `;
    const sepLen = Math.floor((80 - title.length) / 2);
    const sep = "=".repeat(sepLen);
    const secondSep = title.length % 2 === 0 ? sep : `${sep}=`;
    lines.push(`${sep}${title}${secondSep}`);
    if (message.type === "ai") {
        const aiMessage = message;
        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
            lines.push("Tool Calls:");
            for (const tc of aiMessage.tool_calls){
                lines.push(`  ${tc.name} (${tc.id})`);
                lines.push(` Call ID: ${tc.id}`);
                lines.push("  Args:");
                for (const [key, value] of Object.entries(tc.args))lines.push(`    ${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
            }
        }
    }
    if (message.type === "tool") {
        const toolMessage = message;
        if (toolMessage.name) lines.push(`Name: ${toolMessage.name}`);
    }
    if (typeof message.content === "string" && message.content.trim()) {
        if (lines.length > 1) lines.push("");
        lines.push(message.content);
    }
    return lines.join("\n");
}
//#endregion
exports.convertToFormattedString = convertToFormattedString; //# sourceMappingURL=format.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_load_serializable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/serializable.cjs [app-route] (ecmascript)");
const require_data = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/content/data.cjs [app-route] (ecmascript)");
const require_anthropic = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/anthropic.cjs [app-route] (ecmascript)");
const require_data$1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/data.cjs [app-route] (ecmascript)");
const require_openai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/openai.cjs [app-route] (ecmascript)");
const require_message = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/message.cjs [app-route] (ecmascript)");
const require_format = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/format.cjs [app-route] (ecmascript)");
//#region src/messages/base.ts
/** @internal */ const MESSAGE_SYMBOL = Symbol.for("langchain.message");
function mergeContent(firstContent, secondContent) {
    if (typeof firstContent === "string") {
        if (firstContent === "") return secondContent;
        if (typeof secondContent === "string") return firstContent + secondContent;
        else if (Array.isArray(secondContent) && secondContent.length === 0) return firstContent;
        else if (Array.isArray(secondContent) && secondContent.some((c)=>require_data.isDataContentBlock(c))) return [
            {
                type: "text",
                source_type: "text",
                text: firstContent
            },
            ...secondContent
        ];
        else return [
            {
                type: "text",
                text: firstContent
            },
            ...secondContent
        ];
    } else if (Array.isArray(secondContent)) return _mergeLists(firstContent, secondContent) ?? [
        ...firstContent,
        ...secondContent
    ];
    else if (secondContent === "") return firstContent;
    else if (Array.isArray(firstContent) && firstContent.some((c)=>require_data.isDataContentBlock(c))) return [
        ...firstContent,
        {
            type: "file",
            source_type: "text",
            text: secondContent
        }
    ];
    else return [
        ...firstContent,
        {
            type: "text",
            text: secondContent
        }
    ];
}
/**
* 'Merge' two statuses. If either value passed is 'error', it will return 'error'. Else
* it will return 'success'.
*
* @param {"success" | "error" | undefined} left The existing value to 'merge' with the new value.
* @param {"success" | "error" | undefined} right The new value to 'merge' with the existing value
* @returns {"success" | "error"} The 'merged' value.
*/ function _mergeStatus(left, right) {
    if (left === "error" || right === "error") return "error";
    return "success";
}
function stringifyWithDepthLimit(obj, depthLimit) {
    function helper(obj$1, currentDepth) {
        if (typeof obj$1 !== "object" || obj$1 === null || obj$1 === void 0) return obj$1;
        if (currentDepth >= depthLimit) {
            if (Array.isArray(obj$1)) return "[Array]";
            return "[Object]";
        }
        if (Array.isArray(obj$1)) return obj$1.map((item)=>helper(item, currentDepth + 1));
        const result = {};
        for (const key of Object.keys(obj$1))result[key] = helper(obj$1[key], currentDepth + 1);
        return result;
    }
    return JSON.stringify(helper(obj, 0), null, 2);
}
/**
* Base class for all types of messages in a conversation. It includes
* properties like `content`, `name`, and `additional_kwargs`. It also
* includes methods like `toDict()` and `_getType()`.
*/ var BaseMessage = class extends require_load_serializable.Serializable {
    lc_namespace = [
        "langchain_core",
        "messages"
    ];
    lc_serializable = true;
    get lc_aliases() {
        return {
            additional_kwargs: "additional_kwargs",
            response_metadata: "response_metadata"
        };
    }
    [MESSAGE_SYMBOL] = true;
    id;
    /** @inheritdoc */ name;
    content;
    additional_kwargs;
    response_metadata;
    /**
	* @deprecated Use .getType() instead or import the proper typeguard.
	* For example:
	*
	* ```ts
	* import { isAIMessage } from "@langchain/core/messages";
	*
	* const message = new AIMessage("Hello!");
	* isAIMessage(message); // true
	* ```
	*/ _getType() {
        return this.type;
    }
    /**
	* @deprecated Use .type instead
	* The type of the message.
	*/ getType() {
        return this._getType();
    }
    constructor(arg){
        const fields = typeof arg === "string" || Array.isArray(arg) ? {
            content: arg
        } : arg;
        if (!fields.additional_kwargs) fields.additional_kwargs = {};
        if (!fields.response_metadata) fields.response_metadata = {};
        super(fields);
        this.name = fields.name;
        if (fields.content === void 0 && fields.contentBlocks !== void 0) {
            this.content = fields.contentBlocks;
            this.response_metadata = {
                output_version: "v1",
                ...fields.response_metadata
            };
        } else if (fields.content !== void 0) {
            this.content = fields.content ?? [];
            this.response_metadata = fields.response_metadata;
        } else {
            this.content = [];
            this.response_metadata = fields.response_metadata;
        }
        this.additional_kwargs = fields.additional_kwargs;
        this.id = fields.id;
    }
    /** Get text content of the message. */ get text() {
        if (typeof this.content === "string") return this.content;
        if (!Array.isArray(this.content)) return "";
        return this.content.map((c)=>{
            if (typeof c === "string") return c;
            if (c.type === "text") return c.text;
            return "";
        }).join("");
    }
    get contentBlocks() {
        const blocks = typeof this.content === "string" ? [
            {
                type: "text",
                text: this.content
            }
        ] : this.content;
        const parsingSteps = [
            require_data$1.convertToV1FromDataContent,
            require_openai.convertToV1FromChatCompletionsInput,
            require_anthropic.convertToV1FromAnthropicInput
        ];
        const parsedBlocks = parsingSteps.reduce((blocks$1, step)=>step(blocks$1), blocks);
        return parsedBlocks;
    }
    toDict() {
        return {
            type: this.getType(),
            data: this.toJSON().kwargs
        };
    }
    static lc_name() {
        return "BaseMessage";
    }
    get _printableFields() {
        return {
            id: this.id,
            content: this.content,
            name: this.name,
            additional_kwargs: this.additional_kwargs,
            response_metadata: this.response_metadata
        };
    }
    static isInstance(obj) {
        return typeof obj === "object" && obj !== null && MESSAGE_SYMBOL in obj && obj[MESSAGE_SYMBOL] === true && require_message.isMessage(obj);
    }
    _updateId(value) {
        this.id = value;
        this.lc_kwargs.id = value;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.lc_name();
    }
    [Symbol.for("nodejs.util.inspect.custom")](depth) {
        if (depth === null) return this;
        const printable = stringifyWithDepthLimit(this._printableFields, Math.max(4, depth));
        return `${this.constructor.lc_name()} ${printable}`;
    }
    toFormattedString(format = "pretty") {
        return require_format.convertToFormattedString(this, format);
    }
};
function isOpenAIToolCallArray(value) {
    return Array.isArray(value) && value.every((v)=>typeof v.index === "number");
}
/**
* Default keys that should be preserved (not merged) when concatenating message chunks.
* These are identification and timestamp fields that shouldn't be summed or concatenated.
*/ const DEFAULT_MERGE_IGNORE_KEYS = [
    "index",
    "created",
    "timestamp"
];
function _mergeDicts(left, right, options) {
    /**
	* The keys to ignore during merging.
	*/ const ignoreKeys = options?.ignoreKeys ?? DEFAULT_MERGE_IGNORE_KEYS;
    if (left == null && right == null) return void 0;
    if (left == null || right == null) return left ?? right;
    const merged = {
        ...left
    };
    for (const [key, value] of Object.entries(right))if (merged[key] == null) merged[key] = value;
    else if (value == null) continue;
    else if (typeof merged[key] !== typeof value || Array.isArray(merged[key]) !== Array.isArray(value)) throw new Error(`field[${key}] already exists in the message chunk, but with a different type.`);
    else if (typeof merged[key] === "string") if (key === "type") continue;
    else if ([
        "id",
        "name",
        "output_version",
        "model_provider"
    ].includes(key)) {
        if (value) merged[key] = value;
    } else if (ignoreKeys.includes(key)) continue;
    else merged[key] += value;
    else if (typeof merged[key] === "number") {
        if (ignoreKeys.includes(key)) continue;
        merged[key] = merged[key] + value;
    } else if (typeof merged[key] === "object" && !Array.isArray(merged[key])) merged[key] = _mergeDicts(merged[key], value, options);
    else if (Array.isArray(merged[key])) merged[key] = _mergeLists(merged[key], value, options);
    else if (merged[key] === value) continue;
    else console.warn(`field[${key}] already exists in this message chunk and value has unsupported type.`);
    return merged;
}
function _mergeLists(left, right, options) {
    if (left == null && right == null) return void 0;
    else if (left == null || right == null) return left || right;
    else {
        const merged = [
            ...left
        ];
        for (const item of right)if (typeof item === "object" && item !== null && "index" in item && typeof item.index === "number") {
            const toMerge = merged.findIndex((leftItem)=>{
                const isObject = typeof leftItem === "object";
                const indiciesMatch = "index" in leftItem && leftItem.index === item.index;
                const idsMatch = "id" in leftItem && "id" in item && leftItem?.id === item?.id;
                const eitherItemMissingID = !("id" in leftItem) || !leftItem?.id || !("id" in item) || !item?.id;
                return isObject && indiciesMatch && (idsMatch || eitherItemMissingID);
            });
            if (toMerge !== -1 && typeof merged[toMerge] === "object" && merged[toMerge] !== null) merged[toMerge] = _mergeDicts(merged[toMerge], item, options);
            else merged.push(item);
        } else if (typeof item === "object" && item !== null && "text" in item && item.text === "") continue;
        else merged.push(item);
        return merged;
    }
}
function _mergeObj(left, right, options) {
    if (left == null && right == null) return void 0;
    if (left == null || right == null) return left ?? right;
    else if (typeof left !== typeof right) throw new Error(`Cannot merge objects of different types.\nLeft ${typeof left}\nRight ${typeof right}`);
    else if (typeof left === "string" && typeof right === "string") return left + right;
    else if (Array.isArray(left) && Array.isArray(right)) return _mergeLists(left, right, options);
    else if (typeof left === "object" && typeof right === "object") return _mergeDicts(left, right, options);
    else if (left === right) return left;
    else throw new Error(`Can not merge objects of different types.\nLeft ${left}\nRight ${right}`);
}
/**
* Represents a chunk of a message, which can be concatenated with other
* message chunks. It includes a method `_merge_kwargs_dict()` for merging
* additional keyword arguments from another `BaseMessageChunk` into this
* one. It also overrides the `__add__()` method to support concatenation
* of `BaseMessageChunk` instances.
*/ var BaseMessageChunk = class BaseMessageChunk extends BaseMessage {
    static isInstance(obj) {
        if (!super.isInstance(obj)) return false;
        let proto = Object.getPrototypeOf(obj);
        while(proto !== null){
            if (proto === BaseMessageChunk.prototype) return true;
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    }
};
function _isMessageFieldWithRole(x) {
    return typeof x.role === "string";
}
/**
* @deprecated Use {@link BaseMessage.isInstance} instead
*/ function isBaseMessage(messageLike) {
    return typeof messageLike?._getType === "function";
}
/**
* @deprecated Use {@link BaseMessageChunk.isInstance} instead
*/ function isBaseMessageChunk(messageLike) {
    return BaseMessageChunk.isInstance(messageLike);
}
//#endregion
exports.BaseMessage = BaseMessage;
exports.BaseMessageChunk = BaseMessageChunk;
exports.DEFAULT_MERGE_IGNORE_KEYS = DEFAULT_MERGE_IGNORE_KEYS;
exports._isMessageFieldWithRole = _isMessageFieldWithRole;
exports._mergeDicts = _mergeDicts;
exports._mergeLists = _mergeLists;
exports._mergeObj = _mergeObj;
exports._mergeStatus = _mergeStatus;
exports.isBaseMessage = isBaseMessage;
exports.isBaseMessageChunk = isBaseMessageChunk;
exports.isOpenAIToolCallArray = isOpenAIToolCallArray;
exports.mergeContent = mergeContent; //# sourceMappingURL=base.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/tool.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/tool.ts
var tool_exports = {};
require_rolldown_runtime.__export(tool_exports, {
    ToolMessage: ()=>ToolMessage,
    ToolMessageChunk: ()=>ToolMessageChunk,
    defaultToolCallParser: ()=>defaultToolCallParser,
    isDirectToolOutput: ()=>isDirectToolOutput,
    isToolMessage: ()=>isToolMessage,
    isToolMessageChunk: ()=>isToolMessageChunk
});
function isDirectToolOutput(x) {
    return x != null && typeof x === "object" && "lc_direct_tool_output" in x && x.lc_direct_tool_output === true;
}
/**
* Represents a tool message in a conversation.
*/ var ToolMessage = class extends require_base.BaseMessage {
    static lc_name() {
        return "ToolMessage";
    }
    get lc_aliases() {
        return {
            tool_call_id: "tool_call_id"
        };
    }
    lc_direct_tool_output = true;
    type = "tool";
    /**
	* Status of the tool invocation.
	* @version 0.2.19
	*/ status;
    tool_call_id;
    metadata;
    /**
	* Artifact of the Tool execution which is not meant to be sent to the model.
	*
	* Should only be specified if it is different from the message content, e.g. if only
	* a subset of the full tool output is being passed as message content but the full
	* output is needed in other parts of the code.
	*/ artifact;
    constructor(fields, tool_call_id, name){
        const toolMessageFields = typeof fields === "string" || Array.isArray(fields) ? {
            content: fields,
            name,
            tool_call_id
        } : fields;
        super(toolMessageFields);
        this.tool_call_id = toolMessageFields.tool_call_id;
        this.artifact = toolMessageFields.artifact;
        this.status = toolMessageFields.status;
        this.metadata = toolMessageFields.metadata;
    }
    static isInstance(message) {
        return super.isInstance(message) && message.type === "tool";
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            tool_call_id: this.tool_call_id,
            artifact: this.artifact
        };
    }
};
/**
* Represents a chunk of a tool message, which can be concatenated
* with other tool message chunks.
*/ var ToolMessageChunk = class extends require_base.BaseMessageChunk {
    type = "tool";
    tool_call_id;
    /**
	* Status of the tool invocation.
	* @version 0.2.19
	*/ status;
    /**
	* Artifact of the Tool execution which is not meant to be sent to the model.
	*
	* Should only be specified if it is different from the message content, e.g. if only
	* a subset of the full tool output is being passed as message content but the full
	* output is needed in other parts of the code.
	*/ artifact;
    constructor(fields){
        super(fields);
        this.tool_call_id = fields.tool_call_id;
        this.artifact = fields.artifact;
        this.status = fields.status;
    }
    static lc_name() {
        return "ToolMessageChunk";
    }
    concat(chunk) {
        const Cls = this.constructor;
        return new Cls({
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_base._mergeDicts(this.response_metadata, chunk.response_metadata),
            artifact: require_base._mergeObj(this.artifact, chunk.artifact),
            tool_call_id: this.tool_call_id,
            id: this.id ?? chunk.id,
            status: require_base._mergeStatus(this.status, chunk.status)
        });
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            tool_call_id: this.tool_call_id,
            artifact: this.artifact
        };
    }
};
function defaultToolCallParser(rawToolCalls) {
    const toolCalls = [];
    const invalidToolCalls = [];
    for (const toolCall of rawToolCalls)if (!toolCall.function) continue;
    else {
        const functionName = toolCall.function.name;
        try {
            const functionArgs = JSON.parse(toolCall.function.arguments);
            toolCalls.push({
                name: functionName || "",
                args: functionArgs || {},
                id: toolCall.id
            });
        } catch  {
            invalidToolCalls.push({
                name: functionName,
                args: toolCall.function.arguments,
                id: toolCall.id,
                error: "Malformed args."
            });
        }
    }
    return [
        toolCalls,
        invalidToolCalls
    ];
}
/**
* @deprecated Use {@link ToolMessage.isInstance} instead
*/ function isToolMessage(x) {
    return typeof x === "object" && x !== null && "getType" in x && typeof x.getType === "function" && x.getType() === "tool";
}
/**
* @deprecated Use {@link ToolMessageChunk.isInstance} instead
*/ function isToolMessageChunk(x) {
    return x._getType() === "tool";
}
//#endregion
exports.ToolMessage = ToolMessage;
exports.ToolMessageChunk = ToolMessageChunk;
exports.defaultToolCallParser = defaultToolCallParser;
exports.isDirectToolOutput = isDirectToolOutput;
exports.isToolMessage = isToolMessage;
exports.isToolMessageChunk = isToolMessageChunk;
Object.defineProperty(exports, 'tool_exports', {
    enumerable: true,
    get: function() {
        return tool_exports;
    }
}); //# sourceMappingURL=tool.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/tools/utils.ts
function _isToolCall(toolCall) {
    return !!(toolCall && typeof toolCall === "object" && "type" in toolCall && toolCall.type === "tool_call");
}
function _configHasToolCallId(config) {
    return !!(config && typeof config === "object" && "toolCall" in config && config.toolCall != null && typeof config.toolCall === "object" && "id" in config.toolCall && typeof config.toolCall.id === "string");
}
/**
* Custom error class used to handle exceptions related to tool input parsing.
* It extends the built-in `Error` class and adds an optional `output`
* property that can hold the output that caused the exception.
*/ var ToolInputParsingException = class extends Error {
    output;
    constructor(message, output){
        super(message);
        this.output = output;
    }
};
//#endregion
exports.ToolInputParsingException = ToolInputParsingException;
exports._configHasToolCallId = _configHasToolCallId;
exports._isToolCall = _isToolCall; //# sourceMappingURL=utils.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/errors/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
//#region src/errors/index.ts
var errors_exports = {};
require_rolldown_runtime.__export(errors_exports, {
    ModelAbortError: ()=>ModelAbortError,
    addLangChainErrorFields: ()=>addLangChainErrorFields
});
function addLangChainErrorFields(error, lc_error_code) {
    error.lc_error_code = lc_error_code;
    error.message = `${error.message}\n\nTroubleshooting URL: https://docs.langchain.com/oss/javascript/langchain/errors/${lc_error_code}/\n`;
    return error;
}
/**
* Error thrown when a model invocation is aborted via an AbortSignal.
* Contains any partial output that was generated before the abort.
*/ var ModelAbortError = class ModelAbortError extends Error {
    name = "ModelAbortError";
    lc_error_code = "MODEL_ABORTED";
    /**
	* The partial message output that was accumulated before the abort.
	* This allows callers to access whatever content was generated
	* before the operation was cancelled.
	*/ partialOutput;
    constructor(message, partialOutput){
        super(message);
        this.partialOutput = partialOutput;
        if (Error.captureStackTrace) Error.captureStackTrace(this, ModelAbortError);
    }
    /**
	* Type guard to check if an error is a ModelAbortError
	*/ static isInstance(error) {
        return typeof error === "object" && error !== null && "name" in error && error.name === "ModelAbortError" && "lc_error_code" in error && error.lc_error_code === "MODEL_ABORTED";
    }
};
//#endregion
exports.ModelAbortError = ModelAbortError;
exports.addLangChainErrorFields = addLangChainErrorFields;
Object.defineProperty(exports, 'errors_exports', {
    enumerable: true,
    get: function() {
        return errors_exports;
    }
}); //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/json.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/json.ts
function parseJsonMarkdown(s, parser = parsePartialJson) {
    s = s.trim();
    const firstFenceIndex = s.indexOf("```");
    if (firstFenceIndex === -1) return parser(s);
    let contentAfterFence = s.substring(firstFenceIndex + 3);
    if (contentAfterFence.startsWith("json\n")) contentAfterFence = contentAfterFence.substring(5);
    else if (contentAfterFence.startsWith("json")) contentAfterFence = contentAfterFence.substring(4);
    else if (contentAfterFence.startsWith("\n")) contentAfterFence = contentAfterFence.substring(1);
    const closingFenceIndex = contentAfterFence.indexOf("```");
    let finalContent = contentAfterFence;
    if (closingFenceIndex !== -1) finalContent = contentAfterFence.substring(0, closingFenceIndex);
    return parser(finalContent.trim());
}
/**
* Recursive descent partial JSON parser.
* @param s - The string to parse.
* @returns The parsed value.
* @throws Error if the input is a malformed JSON string.
*/ function strictParsePartialJson(s) {
    try {
        return JSON.parse(s);
    } catch  {}
    const buffer = s.trim();
    if (buffer.length === 0) throw new Error("Unexpected end of JSON input");
    let pos = 0;
    function skipWhitespace() {
        while(pos < buffer.length && /\s/.test(buffer[pos]))pos += 1;
    }
    function parseString() {
        if (buffer[pos] !== "\"") throw new Error(`Expected '"' at position ${pos}, got '${buffer[pos]}'`);
        pos += 1;
        let result = "";
        let escaped = false;
        while(pos < buffer.length){
            const char = buffer[pos];
            if (escaped) {
                if (char === "n") result += "\n";
                else if (char === "t") result += "	";
                else if (char === "r") result += "\r";
                else if (char === "\\") result += "\\";
                else if (char === "\"") result += "\"";
                else if (char === "b") result += "\b";
                else if (char === "f") result += "\f";
                else if (char === "/") result += "/";
                else if (char === "u") {
                    const hex = buffer.substring(pos + 1, pos + 5);
                    if (/^[0-9A-Fa-f]{0,4}$/.test(hex)) {
                        if (hex.length === 4) result += String.fromCharCode(Number.parseInt(hex, 16));
                        else result += `u${hex}`;
                        pos += hex.length;
                    } else throw new Error(`Invalid unicode escape sequence '\\u${hex}' at position ${pos}`);
                } else throw new Error(`Invalid escape sequence '\\${char}' at position ${pos}`);
                escaped = false;
            } else if (char === "\\") escaped = true;
            else if (char === "\"") {
                pos += 1;
                return result;
            } else result += char;
            pos += 1;
        }
        if (escaped) result += "\\";
        return result;
    }
    function parseNumber() {
        const start = pos;
        let numStr = "";
        if (buffer[pos] === "-") {
            numStr += "-";
            pos += 1;
        }
        if (pos < buffer.length && buffer[pos] === "0") {
            numStr += "0";
            pos += 1;
            if (buffer[pos] >= "0" && buffer[pos] <= "9") throw new Error(`Invalid number at position ${start}`);
        }
        if (pos < buffer.length && buffer[pos] >= "1" && buffer[pos] <= "9") while(pos < buffer.length && buffer[pos] >= "0" && buffer[pos] <= "9"){
            numStr += buffer[pos];
            pos += 1;
        }
        if (pos < buffer.length && buffer[pos] === ".") {
            numStr += ".";
            pos += 1;
            while(pos < buffer.length && buffer[pos] >= "0" && buffer[pos] <= "9"){
                numStr += buffer[pos];
                pos += 1;
            }
        }
        if (pos < buffer.length && (buffer[pos] === "e" || buffer[pos] === "E")) {
            numStr += buffer[pos];
            pos += 1;
            if (pos < buffer.length && (buffer[pos] === "+" || buffer[pos] === "-")) {
                numStr += buffer[pos];
                pos += 1;
            }
            while(pos < buffer.length && buffer[pos] >= "0" && buffer[pos] <= "9"){
                numStr += buffer[pos];
                pos += 1;
            }
        }
        if (numStr === "-") return -0;
        const num = Number.parseFloat(numStr);
        if (Number.isNaN(num)) {
            pos = start;
            throw new Error(`Invalid number '${numStr}' at position ${start}`);
        }
        return num;
    }
    function parseValue() {
        skipWhitespace();
        if (pos >= buffer.length) throw new Error(`Unexpected end of input at position ${pos}`);
        const char = buffer[pos];
        if (char === "{") return parseObject();
        if (char === "[") return parseArray();
        if (char === "\"") return parseString();
        if ("null".startsWith(buffer.substring(pos, pos + 4))) {
            pos += Math.min(4, buffer.length - pos);
            return null;
        }
        if ("true".startsWith(buffer.substring(pos, pos + 4))) {
            pos += Math.min(4, buffer.length - pos);
            return true;
        }
        if ("false".startsWith(buffer.substring(pos, pos + 5))) {
            pos += Math.min(5, buffer.length - pos);
            return false;
        }
        if (char === "-" || char >= "0" && char <= "9") return parseNumber();
        throw new Error(`Unexpected character '${char}' at position ${pos}`);
    }
    function parseArray() {
        if (buffer[pos] !== "[") throw new Error(`Expected '[' at position ${pos}, got '${buffer[pos]}'`);
        const arr = [];
        pos += 1;
        skipWhitespace();
        if (pos >= buffer.length) return arr;
        if (buffer[pos] === "]") {
            pos += 1;
            return arr;
        }
        while(pos < buffer.length){
            skipWhitespace();
            if (pos >= buffer.length) return arr;
            arr.push(parseValue());
            skipWhitespace();
            if (pos >= buffer.length) return arr;
            if (buffer[pos] === "]") {
                pos += 1;
                return arr;
            } else if (buffer[pos] === ",") {
                pos += 1;
                continue;
            }
            throw new Error(`Expected ',' or ']' at position ${pos}, got '${buffer[pos]}'`);
        }
        return arr;
    }
    function parseObject() {
        if (buffer[pos] !== "{") throw new Error(`Expected '{' at position ${pos}, got '${buffer[pos]}'`);
        const obj = {};
        pos += 1;
        skipWhitespace();
        if (pos >= buffer.length) return obj;
        if (buffer[pos] === "}") {
            pos += 1;
            return obj;
        }
        while(pos < buffer.length){
            skipWhitespace();
            if (pos >= buffer.length) return obj;
            const key = parseString();
            skipWhitespace();
            if (pos >= buffer.length) return obj;
            if (buffer[pos] !== ":") throw new Error(`Expected ':' at position ${pos}, got '${buffer[pos]}'`);
            pos += 1;
            skipWhitespace();
            if (pos >= buffer.length) return obj;
            obj[key] = parseValue();
            skipWhitespace();
            if (pos >= buffer.length) return obj;
            if (buffer[pos] === "}") {
                pos += 1;
                return obj;
            } else if (buffer[pos] === ",") {
                pos += 1;
                continue;
            }
            throw new Error(`Expected ',' or '}' at position ${pos}, got '${buffer[pos]}'`);
        }
        return obj;
    }
    const value = parseValue();
    skipWhitespace();
    if (pos < buffer.length) throw new Error(`Unexpected character '${buffer[pos]}' at position ${pos}`);
    return value;
}
function parsePartialJson(s) {
    try {
        if (typeof s === "undefined") return null;
        return strictParsePartialJson(s);
    } catch  {
        return null;
    }
}
//#endregion
exports.parseJsonMarkdown = parseJsonMarkdown;
exports.parsePartialJson = parsePartialJson; //# sourceMappingURL=json.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/chat.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/chat.ts
/**
* Represents a chat message in a conversation.
*/ var ChatMessage = class ChatMessage extends require_base.BaseMessage {
    static lc_name() {
        return "ChatMessage";
    }
    type = "generic";
    role;
    static _chatMessageClass() {
        return ChatMessage;
    }
    constructor(fields, role){
        if (typeof fields === "string" || Array.isArray(fields)) fields = {
            content: fields,
            role
        };
        super(fields);
        this.role = fields.role;
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "generic";
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            role: this.role
        };
    }
};
/**
* Represents a chunk of a chat message, which can be concatenated with
* other chat message chunks.
*/ var ChatMessageChunk = class extends require_base.BaseMessageChunk {
    static lc_name() {
        return "ChatMessageChunk";
    }
    type = "generic";
    role;
    constructor(fields, role){
        if (typeof fields === "string" || Array.isArray(fields)) fields = {
            content: fields,
            role
        };
        super(fields);
        this.role = fields.role;
    }
    concat(chunk) {
        const Cls = this.constructor;
        return new Cls({
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_base._mergeDicts(this.response_metadata, chunk.response_metadata),
            role: this.role,
            id: this.id ?? chunk.id
        });
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "generic";
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            role: this.role
        };
    }
};
/**
* @deprecated Use {@link ChatMessage.isInstance} instead
*/ function isChatMessage(x) {
    return x._getType() === "generic";
}
/**
* @deprecated Use {@link ChatMessageChunk.isInstance} instead
*/ function isChatMessageChunk(x) {
    return x._getType() === "generic";
}
//#endregion
exports.ChatMessage = ChatMessage;
exports.ChatMessageChunk = ChatMessageChunk;
exports.isChatMessage = isChatMessage;
exports.isChatMessageChunk = isChatMessageChunk; //# sourceMappingURL=chat.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/function.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/function.ts
/**
* Represents a function message in a conversation.
*/ var FunctionMessage = class extends require_base.BaseMessage {
    static lc_name() {
        return "FunctionMessage";
    }
    type = "function";
    name;
    constructor(fields){
        super(fields);
        this.name = fields.name;
    }
};
/**
* Represents a chunk of a function message, which can be concatenated
* with other function message chunks.
*/ var FunctionMessageChunk = class extends require_base.BaseMessageChunk {
    static lc_name() {
        return "FunctionMessageChunk";
    }
    type = "function";
    concat(chunk) {
        const Cls = this.constructor;
        return new Cls({
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_base._mergeDicts(this.response_metadata, chunk.response_metadata),
            name: this.name ?? "",
            id: this.id ?? chunk.id
        });
    }
};
function isFunctionMessage(x) {
    return x._getType() === "function";
}
function isFunctionMessageChunk(x) {
    return x._getType() === "function";
}
//#endregion
exports.FunctionMessage = FunctionMessage;
exports.FunctionMessageChunk = FunctionMessageChunk;
exports.isFunctionMessage = isFunctionMessage;
exports.isFunctionMessageChunk = isFunctionMessageChunk; //# sourceMappingURL=function.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/human.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/human.ts
/**
* Represents a human message in a conversation.
*/ var HumanMessage = class extends require_base.BaseMessage {
    static lc_name() {
        return "HumanMessage";
    }
    type = "human";
    constructor(fields){
        super(fields);
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "human";
    }
};
/**
* Represents a chunk of a human message, which can be concatenated with
* other human message chunks.
*/ var HumanMessageChunk = class extends require_base.BaseMessageChunk {
    static lc_name() {
        return "HumanMessageChunk";
    }
    type = "human";
    constructor(fields){
        super(fields);
    }
    concat(chunk) {
        const Cls = this.constructor;
        return new Cls({
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_base._mergeDicts(this.response_metadata, chunk.response_metadata),
            id: this.id ?? chunk.id
        });
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "human";
    }
};
/**
* @deprecated Use {@link HumanMessage.isInstance} instead
*/ function isHumanMessage(x) {
    return x.getType() === "human";
}
/**
* @deprecated Use {@link HumanMessageChunk.isInstance} instead
*/ function isHumanMessageChunk(x) {
    return x.getType() === "human";
}
//#endregion
exports.HumanMessage = HumanMessage;
exports.HumanMessageChunk = HumanMessageChunk;
exports.isHumanMessage = isHumanMessage;
exports.isHumanMessageChunk = isHumanMessageChunk; //# sourceMappingURL=human.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/modifier.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/modifier.ts
/**
* Message responsible for deleting other messages.
*/ var RemoveMessage = class extends require_base.BaseMessage {
    type = "remove";
    /**
	* The ID of the message to remove.
	*/ id;
    constructor(fields){
        super({
            ...fields,
            content: []
        });
        this.id = fields.id;
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            id: this.id
        };
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "remove";
    }
};
//#endregion
exports.RemoveMessage = RemoveMessage; //# sourceMappingURL=modifier.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/system.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/system.ts
/**
* Represents a system message in a conversation.
*/ var SystemMessage = class SystemMessage extends require_base.BaseMessage {
    static lc_name() {
        return "SystemMessage";
    }
    type = "system";
    constructor(fields){
        super(fields);
    }
    /**
	* Concatenates a string or another system message with the current system message.
	* @param chunk - The chunk to concatenate with the system message.
	* @returns A new system message with the concatenated content.
	*/ concat(chunk) {
        if (typeof chunk === "string") return new SystemMessage({
            ...this,
            content: require_base.mergeContent(this.content, chunk)
        });
        if (SystemMessage.isInstance(chunk)) return new SystemMessage({
            ...this,
            additional_kwargs: {
                ...this.additional_kwargs,
                ...chunk.additional_kwargs
            },
            response_metadata: {
                ...this.response_metadata,
                ...chunk.response_metadata
            },
            content: require_base.mergeContent(this.content, chunk.content)
        });
        throw new Error("Unexpected chunk type for system message");
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "system";
    }
};
/**
* Represents a chunk of a system message, which can be concatenated with
* other system message chunks.
*/ var SystemMessageChunk = class extends require_base.BaseMessageChunk {
    static lc_name() {
        return "SystemMessageChunk";
    }
    type = "system";
    constructor(fields){
        super(fields);
    }
    concat(chunk) {
        const Cls = this.constructor;
        return new Cls({
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_base._mergeDicts(this.response_metadata, chunk.response_metadata),
            id: this.id ?? chunk.id
        });
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "system";
    }
};
/**
* @deprecated Use {@link SystemMessage.isInstance} instead
*/ function isSystemMessage(x) {
    return x._getType() === "system";
}
/**
* @deprecated Use {@link SystemMessageChunk.isInstance} instead
*/ function isSystemMessageChunk(x) {
    return x._getType() === "system";
}
//#endregion
exports.SystemMessage = SystemMessage;
exports.SystemMessageChunk = SystemMessageChunk;
exports.isSystemMessage = isSystemMessage;
exports.isSystemMessageChunk = isSystemMessageChunk; //# sourceMappingURL=system.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/bedrock_converse.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/bedrock_converse.ts
function convertFileFormatToMimeType(format) {
    switch(format){
        case "csv":
            return "text/csv";
        case "doc":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "html":
            return "text/html";
        case "md":
            return "text/markdown";
        case "pdf":
            return "application/pdf";
        case "txt":
            return "text/plain";
        case "xls":
            return "application/vnd.ms-excel";
        case "xlsx":
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "gif":
            return "image/gif";
        case "jpeg":
            return "image/jpeg";
        case "jpg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "webp":
            return "image/webp";
        case "flv":
            return "video/flv";
        case "mkv":
            return "video/mkv";
        case "mov":
            return "video/mov";
        case "mp4":
            return "video/mp4";
        case "mpeg":
            return "video/mpeg";
        case "mpg":
            return "video/mpg";
        case "three_gp":
            return "video/three_gp";
        case "webm":
            return "video/webm";
        case "wmv":
            return "video/wmv";
        default:
            return "application/octet-stream";
    }
}
function convertConverseDocumentBlock(block) {
    if (require_utils._isObject(block.document) && require_utils._isObject(block.document.source)) {
        const format = require_utils._isObject(block.document) && require_utils._isString(block.document.format) ? block.document.format : "";
        const mimeType = convertFileFormatToMimeType(format);
        if (require_utils._isObject(block.document.source)) {
            if (require_utils._isObject(block.document.source.s3Location) && require_utils._isString(block.document.source.s3Location.uri)) return {
                type: "file",
                mimeType,
                fileId: block.document.source.s3Location.uri
            };
            if (require_utils._isBytesArray(block.document.source.bytes)) return {
                type: "file",
                mimeType,
                data: block.document.source.bytes
            };
            if (require_utils._isString(block.document.source.text)) return {
                type: "file",
                mimeType,
                data: Buffer.from(block.document.source.text).toString("base64")
            };
            if (require_utils._isArray(block.document.source.content)) {
                const data = block.document.source.content.reduce((acc, item)=>{
                    if (require_utils._isObject(item) && require_utils._isString(item.text)) return acc + item.text;
                    return acc;
                }, "");
                return {
                    type: "file",
                    mimeType,
                    data
                };
            }
        }
    }
    return {
        type: "non_standard",
        value: block
    };
}
function convertConverseImageBlock(block) {
    if (require_utils._isContentBlock(block, "image") && require_utils._isObject(block.image)) {
        const format = require_utils._isObject(block.image) && require_utils._isString(block.image.format) ? block.image.format : "";
        const mimeType = convertFileFormatToMimeType(format);
        if (require_utils._isObject(block.image.source)) {
            if (require_utils._isObject(block.image.source.s3Location) && require_utils._isString(block.image.source.s3Location.uri)) return {
                type: "image",
                mimeType,
                fileId: block.image.source.s3Location.uri
            };
            if (require_utils._isBytesArray(block.image.source.bytes)) return {
                type: "image",
                mimeType,
                data: block.image.source.bytes
            };
        }
    }
    return {
        type: "non_standard",
        value: block
    };
}
function convertConverseVideoBlock(block) {
    if (require_utils._isContentBlock(block, "video") && require_utils._isObject(block.video)) {
        const format = require_utils._isObject(block.video) && require_utils._isString(block.video.format) ? block.video.format : "";
        const mimeType = convertFileFormatToMimeType(format);
        if (require_utils._isObject(block.video.source)) {
            if (require_utils._isObject(block.video.source.s3Location) && require_utils._isString(block.video.source.s3Location.uri)) return {
                type: "video",
                mimeType,
                fileId: block.video.source.s3Location.uri
            };
            if (require_utils._isBytesArray(block.video.source.bytes)) return {
                type: "video",
                mimeType,
                data: block.video.source.bytes
            };
        }
    }
    return {
        type: "non_standard",
        value: block
    };
}
function convertToV1FromChatBedrockConverseMessage(message) {
    function* iterateContent() {
        const content = typeof message.content === "string" ? [
            {
                type: "text",
                text: message.content
            }
        ] : message.content;
        for (const block of content){
            if (require_utils._isContentBlock(block, "cache_point")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "citations_content") && require_utils._isObject(block.citationsContent)) {
                const text = require_utils._isArray(block.citationsContent.content) ? block.citationsContent.content.reduce((acc, item)=>{
                    if (require_utils._isObject(item) && require_utils._isString(item.text)) return acc + item.text;
                    return acc;
                }, "") : "";
                const annotations = require_utils._isArray(block.citationsContent.citations) ? block.citationsContent.citations.reduce((acc, item)=>{
                    if (require_utils._isObject(item)) {
                        const citedText = require_utils._isArray(item.sourceContent) ? item.sourceContent.reduce((acc$1, item$1)=>{
                            if (require_utils._isObject(item$1) && require_utils._isString(item$1.text)) return acc$1 + item$1.text;
                            return acc$1;
                        }, "") : "";
                        const properties = require_utils.iife(()=>{
                            if (require_utils._isObject(item.location)) {
                                const location = item.location.documentChar || item.location.documentPage || item.location.documentChunk;
                                if (require_utils._isObject(location)) return {
                                    source: require_utils._isNumber(location.documentIndex) ? location.documentIndex.toString() : void 0,
                                    startIndex: require_utils._isNumber(location.start) ? location.start : void 0,
                                    endIndex: require_utils._isNumber(location.end) ? location.end : void 0
                                };
                            }
                            return {};
                        });
                        acc.push({
                            type: "citation",
                            citedText,
                            ...properties
                        });
                    }
                    return acc;
                }, []) : [];
                yield {
                    type: "text",
                    text,
                    annotations
                };
                continue;
            } else if (require_utils._isContentBlock(block, "document") && require_utils._isObject(block.document)) {
                yield convertConverseDocumentBlock(block);
                continue;
            } else if (require_utils._isContentBlock(block, "guard_content")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "image") && require_utils._isObject(block.image)) {
                yield convertConverseImageBlock(block);
                continue;
            } else if (require_utils._isContentBlock(block, "reasoning_content") && require_utils._isString(block.reasoningText)) {
                yield {
                    type: "reasoning",
                    reasoning: block.reasoningText
                };
                continue;
            } else if (require_utils._isContentBlock(block, "text") && require_utils._isString(block.text)) {
                yield {
                    type: "text",
                    text: block.text
                };
                continue;
            } else if (require_utils._isContentBlock(block, "tool_result")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "tool_call")) continue;
            else if (require_utils._isContentBlock(block, "video") && require_utils._isObject(block.video)) {
                yield convertConverseVideoBlock(block);
                continue;
            }
            yield {
                type: "non_standard",
                value: block
            };
        }
    }
    return Array.from(iterateContent());
}
const ChatBedrockConverseTranslator = {
    translateContent: convertToV1FromChatBedrockConverseMessage,
    translateContentChunk: convertToV1FromChatBedrockConverseMessage
};
//#endregion
exports.ChatBedrockConverseTranslator = ChatBedrockConverseTranslator; //# sourceMappingURL=bedrock_converse.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/deepseek.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/deepseek.ts
/**
* Converts a DeepSeek AI message to an array of v1 standard content blocks.
*
* This function processes an AI message from DeepSeek's API format
* and converts it to the standardized v1 content block format. It handles
* both string content and the reasoning_content in additional_kwargs.
*
* @param message - The AI message containing DeepSeek-formatted content
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const message = new AIMessage({
*   content: "The answer is 42",
*   additional_kwargs: { reasoning_content: "Let me think about this..." }
* });
* const standardBlocks = convertToV1FromDeepSeekMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think about this..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*/ function convertToV1FromDeepSeekMessage(message) {
    const blocks = [];
    const reasoningContent = message.additional_kwargs?.reasoning_content;
    if (require_utils._isString(reasoningContent) && reasoningContent.length > 0) blocks.push({
        type: "reasoning",
        reasoning: reasoningContent
    });
    if (typeof message.content === "string") {
        if (message.content.length > 0) blocks.push({
            type: "text",
            text: message.content
        });
    } else for (const block of message.content)if (typeof block === "object" && "type" in block && block.type === "text" && "text" in block && require_utils._isString(block.text)) blocks.push({
        type: "text",
        text: block.text
    });
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
const ChatDeepSeekTranslator = {
    translateContent: convertToV1FromDeepSeekMessage,
    translateContentChunk: convertToV1FromDeepSeekMessage
};
//#endregion
exports.ChatDeepSeekTranslator = ChatDeepSeekTranslator; //# sourceMappingURL=deepseek.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/google_genai.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/google_genai.ts
function convertToV1FromChatGoogleMessage(message) {
    function* iterateContent() {
        const content = typeof message.content === "string" ? [
            {
                type: "text",
                text: message.content
            }
        ] : message.content;
        for (const block of content){
            if (require_utils._isContentBlock(block, "text") && require_utils._isString(block.text)) {
                yield {
                    type: "text",
                    text: block.text
                };
                continue;
            } else if (require_utils._isContentBlock(block, "thinking") && require_utils._isString(block.thinking)) {
                yield {
                    type: "reasoning",
                    reasoning: block.thinking,
                    ...block.signature ? {
                        signature: block.signature
                    } : {}
                };
                continue;
            } else if (require_utils._isContentBlock(block, "inlineData") && require_utils._isObject(block.inlineData) && require_utils._isString(block.inlineData.mimeType) && require_utils._isString(block.inlineData.data)) {
                yield {
                    type: "file",
                    mimeType: block.inlineData.mimeType,
                    data: block.inlineData.data
                };
                continue;
            } else if (require_utils._isContentBlock(block, "functionCall") && require_utils._isObject(block.functionCall) && require_utils._isString(block.functionCall.name) && require_utils._isObject(block.functionCall.args)) {
                yield {
                    type: "tool_call",
                    id: message.id,
                    name: block.functionCall.name,
                    args: block.functionCall.args
                };
                continue;
            } else if (require_utils._isContentBlock(block, "functionResponse")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "fileData") && require_utils._isObject(block.fileData) && require_utils._isString(block.fileData.mimeType) && require_utils._isString(block.fileData.fileUri)) {
                yield {
                    type: "file",
                    mimeType: block.fileData.mimeType,
                    fileId: block.fileData.fileUri
                };
                continue;
            } else if (require_utils._isContentBlock(block, "executableCode")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            } else if (require_utils._isContentBlock(block, "codeExecutionResult")) {
                yield {
                    type: "non_standard",
                    value: block
                };
                continue;
            }
            yield {
                type: "non_standard",
                value: block
            };
        }
    }
    return Array.from(iterateContent());
}
const ChatGoogleGenAITranslator = {
    translateContent: convertToV1FromChatGoogleMessage,
    translateContentChunk: convertToV1FromChatGoogleMessage
};
//#endregion
exports.ChatGoogleGenAITranslator = ChatGoogleGenAITranslator; //# sourceMappingURL=google_genai.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/google_vertexai.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/google_vertexai.ts
function convertToV1FromChatVertexMessage(message) {
    function* iterateContent() {
        const content = typeof message.content === "string" ? [
            {
                type: "text",
                text: message.content
            }
        ] : message.content;
        for (const block of content){
            if (require_utils._isContentBlock(block, "reasoning") && require_utils._isString(block.reasoning)) {
                const signature = require_utils.iife(()=>{
                    const reasoningIndex = content.indexOf(block);
                    if (require_utils._isArray(message.additional_kwargs?.signatures) && reasoningIndex >= 0) return message.additional_kwargs.signatures.at(reasoningIndex);
                    return void 0;
                });
                if (require_utils._isString(signature)) yield {
                    type: "reasoning",
                    reasoning: block.reasoning,
                    signature
                };
                else yield {
                    type: "reasoning",
                    reasoning: block.reasoning
                };
                continue;
            } else if (require_utils._isContentBlock(block, "thinking") && require_utils._isString(block.thinking)) {
                yield {
                    type: "reasoning",
                    reasoning: block.thinking,
                    ...block.signature ? {
                        signature: block.signature
                    } : {}
                };
                continue;
            } else if (require_utils._isContentBlock(block, "text") && require_utils._isString(block.text)) {
                yield {
                    type: "text",
                    text: block.text
                };
                continue;
            } else if (require_utils._isContentBlock(block, "image_url")) {
                if (require_utils._isString(block.image_url)) if (block.image_url.startsWith("data:")) {
                    const dataUrlRegex = /^data:([^;]+);base64,(.+)$/;
                    const match = block.image_url.match(dataUrlRegex);
                    if (match) yield {
                        type: "image",
                        data: match[2],
                        mimeType: match[1]
                    };
                    else yield {
                        type: "image",
                        url: block.image_url
                    };
                } else yield {
                    type: "image",
                    url: block.image_url
                };
                continue;
            } else if (require_utils._isContentBlock(block, "media") && require_utils._isString(block.mimeType) && require_utils._isString(block.data)) {
                yield {
                    type: "file",
                    mimeType: block.mimeType,
                    data: block.data
                };
                continue;
            }
            yield {
                type: "non_standard",
                value: block
            };
        }
    }
    return Array.from(iterateContent());
}
const ChatVertexTranslator = {
    translateContent: convertToV1FromChatVertexMessage,
    translateContentChunk: convertToV1FromChatVertexMessage
};
//#endregion
exports.ChatVertexTranslator = ChatVertexTranslator; //# sourceMappingURL=google_vertexai.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/groq.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/groq.ts
/**
* Converts a Groq AI message to an array of v1 standard content blocks.
*
* This function processes an AI message from Groq's API format
* and converts it to the standardized v1 content block format. It handles
* both parsed reasoning (in additional_kwargs.reasoning) and raw reasoning
* (in <think> tags within content).
*
* @param message - The AI message containing Groq-formatted content
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* // Parsed format (reasoning_format="parsed")
* const message = new AIMessage({
*   content: "The answer is 42",
*   additional_kwargs: { reasoning: "Let me think about this..." }
* });
* const standardBlocks = convertToV1FromGroqMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think about this..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*
* @example
* ```typescript
* // Raw format (reasoning_format="raw")
* const message = new AIMessage({
*   content: "<think>Let me think...</think>The answer is 42"
* });
* const standardBlocks = convertToV1FromGroqMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*/ function convertToV1FromGroqMessage(message) {
    const blocks = [];
    const parsedReasoning = message.additional_kwargs?.reasoning;
    if (require_utils._isString(parsedReasoning) && parsedReasoning.length > 0) blocks.push({
        type: "reasoning",
        reasoning: parsedReasoning
    });
    if (typeof message.content === "string") {
        let textContent = message.content;
        const thinkMatch = textContent.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkMatch) {
            const thinkingContent = thinkMatch[1].trim();
            if (thinkingContent.length > 0) blocks.push({
                type: "reasoning",
                reasoning: thinkingContent
            });
            textContent = textContent.replace(/<think>[\s\S]*?<\/think>/, "").trim();
        }
        if (textContent.length > 0) blocks.push({
            type: "text",
            text: textContent
        });
    } else for (const block of message.content)if (typeof block === "object" && "type" in block && block.type === "text" && "text" in block && require_utils._isString(block.text)) {
        let textContent = block.text;
        const thinkMatch = textContent.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkMatch) {
            const thinkingContent = thinkMatch[1].trim();
            if (thinkingContent.length > 0) blocks.push({
                type: "reasoning",
                reasoning: thinkingContent
            });
            textContent = textContent.replace(/<think>[\s\S]*?<\/think>/, "").trim();
        }
        if (textContent.length > 0) blocks.push({
            type: "text",
            text: textContent
        });
    }
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
const ChatGroqTranslator = {
    translateContent: convertToV1FromGroqMessage,
    translateContentChunk: convertToV1FromGroqMessage
};
//#endregion
exports.ChatGroqTranslator = ChatGroqTranslator; //# sourceMappingURL=groq.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/ollama.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/ollama.ts
/**
* Converts an Ollama AI message to an array of v1 standard content blocks.
*
* This function processes an AI message from Ollama's API format
* and converts it to the standardized v1 content block format. It handles
* the reasoning_content in additional_kwargs (populated when think mode is enabled).
*
* @param message - The AI message containing Ollama-formatted content
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* const message = new AIMessage({
*   content: "The answer is 42",
*   additional_kwargs: { reasoning_content: "Let me think about this..." }
* });
* const standardBlocks = convertToV1FromOllamaMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think about this..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*/ function convertToV1FromOllamaMessage(message) {
    const blocks = [];
    const reasoningContent = message.additional_kwargs?.reasoning_content;
    if (require_utils._isString(reasoningContent) && reasoningContent.length > 0) blocks.push({
        type: "reasoning",
        reasoning: reasoningContent
    });
    if (typeof message.content === "string") {
        if (message.content.length > 0) blocks.push({
            type: "text",
            text: message.content
        });
    } else for (const block of message.content)if (typeof block === "object" && "type" in block && block.type === "text" && "text" in block && require_utils._isString(block.text)) blocks.push({
        type: "text",
        text: block.text
    });
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
const ChatOllamaTranslator = {
    translateContent: convertToV1FromOllamaMessage,
    translateContentChunk: convertToV1FromOllamaMessage
};
//#endregion
exports.ChatOllamaTranslator = ChatOllamaTranslator; //# sourceMappingURL=ollama.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/xai.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/utils.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/xai.ts
/**
* Converts an xAI AI message to an array of v1 standard content blocks.
*
* This function processes an AI message from xAI's API format
* and converts it to the standardized v1 content block format. It handles
* both the responses API (reasoning object with summary) and completions API
* (reasoning_content string) formats.
*
* @param message - The AI message containing xAI-formatted content
* @returns Array of content blocks in v1 standard format
*
* @example
* ```typescript
* // Responses API format
* const message = new AIMessage({
*   content: "The answer is 42",
*   additional_kwargs: {
*     reasoning: {
*       id: "reasoning_123",
*       type: "reasoning",
*       summary: [{ type: "summary_text", text: "Let me think..." }]
*     }
*   }
* });
* const standardBlocks = convertToV1FromXAIMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*
* @example
* ```typescript
* // Completions API format
* const message = new AIMessage({
*   content: "The answer is 42",
*   additional_kwargs: { reasoning_content: "Let me think about this..." }
* });
* const standardBlocks = convertToV1FromXAIMessage(message);
* // Returns:
* // [
* //   { type: "reasoning", reasoning: "Let me think about this..." },
* //   { type: "text", text: "The answer is 42" }
* // ]
* ```
*/ function convertToV1FromXAIMessage(message) {
    const blocks = [];
    if (require_utils._isObject(message.additional_kwargs?.reasoning)) {
        const reasoning = message.additional_kwargs.reasoning;
        if (require_utils._isArray(reasoning.summary)) {
            const summaryText = reasoning.summary.reduce((acc, item)=>{
                if (require_utils._isObject(item) && require_utils._isString(item.text)) return `${acc}${item.text}`;
                return acc;
            }, "");
            if (summaryText.length > 0) blocks.push({
                type: "reasoning",
                reasoning: summaryText
            });
        }
    }
    const reasoningContent = message.additional_kwargs?.reasoning_content;
    if (require_utils._isString(reasoningContent) && reasoningContent.length > 0) blocks.push({
        type: "reasoning",
        reasoning: reasoningContent
    });
    if (typeof message.content === "string") {
        if (message.content.length > 0) blocks.push({
            type: "text",
            text: message.content
        });
    } else for (const block of message.content)if (typeof block === "object" && "type" in block && block.type === "text" && "text" in block && require_utils._isString(block.text)) blocks.push({
        type: "text",
        text: block.text
    });
    for (const toolCall of message.tool_calls ?? [])blocks.push({
        type: "tool_call",
        id: toolCall.id,
        name: toolCall.name,
        args: toolCall.args
    });
    return blocks;
}
const ChatXAITranslator = {
    translateContent: convertToV1FromXAIMessage,
    translateContentChunk: convertToV1FromXAIMessage
};
//#endregion
exports.ChatXAITranslator = ChatXAITranslator; //# sourceMappingURL=xai.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_anthropic = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/anthropic.cjs [app-route] (ecmascript)");
const require_openai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/openai.cjs [app-route] (ecmascript)");
const require_bedrock_converse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/bedrock_converse.cjs [app-route] (ecmascript)");
const require_deepseek = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/deepseek.cjs [app-route] (ecmascript)");
const require_google_genai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/google_genai.cjs [app-route] (ecmascript)");
const require_google_vertexai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/google_vertexai.cjs [app-route] (ecmascript)");
const require_groq = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/groq.cjs [app-route] (ecmascript)");
const require_ollama = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/ollama.cjs [app-route] (ecmascript)");
const require_xai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/xai.cjs [app-route] (ecmascript)");
//#region src/messages/block_translators/index.ts
globalThis.lc_block_translators_registry ??= new Map([
    [
        "anthropic",
        require_anthropic.ChatAnthropicTranslator
    ],
    [
        "bedrock-converse",
        require_bedrock_converse.ChatBedrockConverseTranslator
    ],
    [
        "deepseek",
        require_deepseek.ChatDeepSeekTranslator
    ],
    [
        "google-genai",
        require_google_genai.ChatGoogleGenAITranslator
    ],
    [
        "google-vertexai",
        require_google_vertexai.ChatVertexTranslator
    ],
    [
        "groq",
        require_groq.ChatGroqTranslator
    ],
    [
        "ollama",
        require_ollama.ChatOllamaTranslator
    ],
    [
        "openai",
        require_openai.ChatOpenAITranslator
    ],
    [
        "xai",
        require_xai.ChatXAITranslator
    ]
]);
function getTranslator(modelProvider) {
    return globalThis.lc_block_translators_registry.get(modelProvider);
}
//#endregion
exports.getTranslator = getTranslator; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/metadata.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
//#region src/messages/metadata.ts
function mergeResponseMetadata(a, b) {
    const output = require_base._mergeDicts(a, b) ?? {};
    return output;
}
function mergeModalitiesTokenDetails(a, b) {
    const output = {};
    if (a?.audio !== void 0 || b?.audio !== void 0) output.audio = (a?.audio ?? 0) + (b?.audio ?? 0);
    if (a?.image !== void 0 || b?.image !== void 0) output.image = (a?.image ?? 0) + (b?.image ?? 0);
    if (a?.video !== void 0 || b?.video !== void 0) output.video = (a?.video ?? 0) + (b?.video ?? 0);
    if (a?.document !== void 0 || b?.document !== void 0) output.document = (a?.document ?? 0) + (b?.document ?? 0);
    if (a?.text !== void 0 || b?.text !== void 0) output.text = (a?.text ?? 0) + (b?.text ?? 0);
    return output;
}
function mergeInputTokenDetails(a, b) {
    const output = {
        ...mergeModalitiesTokenDetails(a, b)
    };
    if (a?.cache_read !== void 0 || b?.cache_read !== void 0) output.cache_read = (a?.cache_read ?? 0) + (b?.cache_read ?? 0);
    if (a?.cache_creation !== void 0 || b?.cache_creation !== void 0) output.cache_creation = (a?.cache_creation ?? 0) + (b?.cache_creation ?? 0);
    return output;
}
function mergeOutputTokenDetails(a, b) {
    const output = {
        ...mergeModalitiesTokenDetails(a, b)
    };
    if (a?.reasoning !== void 0 || b?.reasoning !== void 0) output.reasoning = (a?.reasoning ?? 0) + (b?.reasoning ?? 0);
    return output;
}
function mergeUsageMetadata(a, b) {
    return {
        input_tokens: (a?.input_tokens ?? 0) + (b?.input_tokens ?? 0),
        output_tokens: (a?.output_tokens ?? 0) + (b?.output_tokens ?? 0),
        total_tokens: (a?.total_tokens ?? 0) + (b?.total_tokens ?? 0),
        input_token_details: mergeInputTokenDetails(a?.input_token_details, b?.input_token_details),
        output_token_details: mergeOutputTokenDetails(a?.output_token_details, b?.output_token_details)
    };
}
//#endregion
exports.mergeResponseMetadata = mergeResponseMetadata;
exports.mergeUsageMetadata = mergeUsageMetadata; //# sourceMappingURL=metadata.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/ai.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/block_translators/index.cjs [app-route] (ecmascript)");
const require_metadata = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/metadata.cjs [app-route] (ecmascript)");
const require_messages_tool = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/tool.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)");
//#region src/messages/ai.ts
var AIMessage = class extends require_base.BaseMessage {
    type = "ai";
    tool_calls = [];
    invalid_tool_calls = [];
    usage_metadata;
    get lc_aliases() {
        return {
            ...super.lc_aliases,
            tool_calls: "tool_calls",
            invalid_tool_calls: "invalid_tool_calls"
        };
    }
    constructor(fields){
        let initParams;
        if (typeof fields === "string" || Array.isArray(fields)) initParams = {
            content: fields,
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: {}
        };
        else {
            initParams = fields;
            const rawToolCalls = initParams.additional_kwargs?.tool_calls;
            const toolCalls = initParams.tool_calls;
            if (!(rawToolCalls == null) && rawToolCalls.length > 0 && (toolCalls === void 0 || toolCalls.length === 0)) console.warn([
                "New LangChain packages are available that more efficiently handle",
                "tool calling.\n\nPlease upgrade your packages to versions that set",
                "message tool calls. e.g., `pnpm install @langchain/anthropic`,",
                "pnpm install @langchain/openai`, etc."
            ].join(" "));
            try {
                if (!(rawToolCalls == null) && toolCalls === void 0) {
                    const [parsedToolCalls, invalidToolCalls] = require_messages_tool.defaultToolCallParser(rawToolCalls);
                    initParams.tool_calls = parsedToolCalls ?? [];
                    initParams.invalid_tool_calls = invalidToolCalls ?? [];
                } else {
                    initParams.tool_calls = initParams.tool_calls ?? [];
                    initParams.invalid_tool_calls = initParams.invalid_tool_calls ?? [];
                }
            } catch  {
                initParams.tool_calls = [];
                initParams.invalid_tool_calls = [];
            }
            if (initParams.response_metadata !== void 0 && "output_version" in initParams.response_metadata && initParams.response_metadata.output_version === "v1") {
                initParams.contentBlocks = initParams.content;
                initParams.content = void 0;
            }
            if (initParams.contentBlocks !== void 0) {
                if (initParams.tool_calls) initParams.contentBlocks.push(...initParams.tool_calls.map((toolCall)=>({
                        type: "tool_call",
                        id: toolCall.id,
                        name: toolCall.name,
                        args: toolCall.args
                    })));
                const missingToolCalls = initParams.contentBlocks.filter((block)=>block.type === "tool_call").filter((block)=>!initParams.tool_calls?.some((toolCall)=>toolCall.id === block.id && toolCall.name === block.name));
                if (missingToolCalls.length > 0) initParams.tool_calls = missingToolCalls.map((block)=>({
                        type: "tool_call",
                        id: block.id,
                        name: block.name,
                        args: block.args
                    }));
            }
        }
        super(initParams);
        if (typeof initParams !== "string") {
            this.tool_calls = initParams.tool_calls ?? this.tool_calls;
            this.invalid_tool_calls = initParams.invalid_tool_calls ?? this.invalid_tool_calls;
        }
        this.usage_metadata = initParams.usage_metadata;
    }
    static lc_name() {
        return "AIMessage";
    }
    get contentBlocks() {
        if (this.response_metadata && "output_version" in this.response_metadata && this.response_metadata.output_version === "v1") return this.content;
        if (this.response_metadata && "model_provider" in this.response_metadata && typeof this.response_metadata.model_provider === "string") {
            const translator = require_index.getTranslator(this.response_metadata.model_provider);
            if (translator) return translator.translateContent(this);
        }
        const blocks = super.contentBlocks;
        if (this.tool_calls) {
            const missingToolCalls = this.tool_calls.filter((block)=>!blocks.some((b)=>b.id === block.id && b.name === block.name));
            blocks.push(...missingToolCalls.map((block)=>({
                    type: "tool_call",
                    id: block.id,
                    name: block.name,
                    args: block.args
                })));
        }
        return blocks;
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            tool_calls: this.tool_calls,
            invalid_tool_calls: this.invalid_tool_calls,
            usage_metadata: this.usage_metadata
        };
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "ai";
    }
};
/**
* @deprecated Use {@link AIMessage.isInstance} instead
*/ function isAIMessage(x) {
    return x._getType() === "ai";
}
/**
* @deprecated Use {@link AIMessageChunk.isInstance} instead
*/ function isAIMessageChunk(x) {
    return x._getType() === "ai";
}
/**
* Represents a chunk of an AI message, which can be concatenated with
* other AI message chunks.
*/ var AIMessageChunk = class extends require_base.BaseMessageChunk {
    type = "ai";
    tool_calls = [];
    invalid_tool_calls = [];
    tool_call_chunks = [];
    usage_metadata;
    constructor(fields){
        let initParams;
        if (typeof fields === "string" || Array.isArray(fields)) initParams = {
            content: fields,
            tool_calls: [],
            invalid_tool_calls: [],
            tool_call_chunks: []
        };
        else if (fields.tool_call_chunks === void 0 || fields.tool_call_chunks.length === 0) initParams = {
            ...fields,
            tool_calls: fields.tool_calls ?? [],
            invalid_tool_calls: [],
            tool_call_chunks: [],
            usage_metadata: fields.usage_metadata !== void 0 ? fields.usage_metadata : void 0
        };
        else {
            const collapsed = require_utils.collapseToolCallChunks(fields.tool_call_chunks ?? []);
            initParams = {
                ...fields,
                tool_call_chunks: collapsed.tool_call_chunks,
                tool_calls: collapsed.tool_calls,
                invalid_tool_calls: collapsed.invalid_tool_calls,
                usage_metadata: fields.usage_metadata !== void 0 ? fields.usage_metadata : void 0
            };
        }
        super(initParams);
        this.tool_call_chunks = initParams.tool_call_chunks ?? this.tool_call_chunks;
        this.tool_calls = initParams.tool_calls ?? this.tool_calls;
        this.invalid_tool_calls = initParams.invalid_tool_calls ?? this.invalid_tool_calls;
        this.usage_metadata = initParams.usage_metadata;
    }
    get lc_aliases() {
        return {
            ...super.lc_aliases,
            tool_calls: "tool_calls",
            invalid_tool_calls: "invalid_tool_calls",
            tool_call_chunks: "tool_call_chunks"
        };
    }
    static lc_name() {
        return "AIMessageChunk";
    }
    get contentBlocks() {
        if (this.response_metadata && "output_version" in this.response_metadata && this.response_metadata.output_version === "v1") return this.content;
        if (this.response_metadata && "model_provider" in this.response_metadata && typeof this.response_metadata.model_provider === "string") {
            const translator = require_index.getTranslator(this.response_metadata.model_provider);
            if (translator) return translator.translateContent(this);
        }
        const blocks = super.contentBlocks;
        if (this.tool_calls) {
            if (typeof this.content !== "string") {
                const contentToolCalls = this.content.filter((block)=>block.type === "tool_call").map((block)=>block.id);
                for (const toolCall of this.tool_calls)if (toolCall.id && !contentToolCalls.includes(toolCall.id)) blocks.push({
                    ...toolCall,
                    type: "tool_call",
                    id: toolCall.id,
                    name: toolCall.name,
                    args: toolCall.args
                });
            }
        }
        return blocks;
    }
    get _printableFields() {
        return {
            ...super._printableFields,
            tool_calls: this.tool_calls,
            tool_call_chunks: this.tool_call_chunks,
            invalid_tool_calls: this.invalid_tool_calls,
            usage_metadata: this.usage_metadata
        };
    }
    concat(chunk) {
        const combinedFields = {
            content: require_base.mergeContent(this.content, chunk.content),
            additional_kwargs: require_base._mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
            response_metadata: require_metadata.mergeResponseMetadata(this.response_metadata, chunk.response_metadata),
            tool_call_chunks: [],
            id: this.id ?? chunk.id
        };
        if (this.tool_call_chunks !== void 0 || chunk.tool_call_chunks !== void 0) {
            const rawToolCalls = require_base._mergeLists(this.tool_call_chunks, chunk.tool_call_chunks);
            if (rawToolCalls !== void 0 && rawToolCalls.length > 0) combinedFields.tool_call_chunks = rawToolCalls;
        }
        if (this.usage_metadata !== void 0 || chunk.usage_metadata !== void 0) combinedFields.usage_metadata = require_metadata.mergeUsageMetadata(this.usage_metadata, chunk.usage_metadata);
        const Cls = this.constructor;
        return new Cls(combinedFields);
    }
    static isInstance(obj) {
        return super.isInstance(obj) && obj.type === "ai";
    }
};
//#endregion
exports.AIMessage = AIMessage;
exports.AIMessageChunk = AIMessageChunk;
exports.isAIMessage = isAIMessage;
exports.isAIMessageChunk = isAIMessageChunk; //# sourceMappingURL=ai.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/base.cjs [app-route] (ecmascript)");
const require_messages_tool = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/tool.cjs [app-route] (ecmascript)");
const require_errors_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/errors/index.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/utils.cjs [app-route] (ecmascript)");
const require_json = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/json.cjs [app-route] (ecmascript)");
const require_chat = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/chat.cjs [app-route] (ecmascript)");
const require_function = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/function.cjs [app-route] (ecmascript)");
const require_human = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/human.cjs [app-route] (ecmascript)");
const require_modifier = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/modifier.cjs [app-route] (ecmascript)");
const require_system = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/system.cjs [app-route] (ecmascript)");
const require_ai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/ai.cjs [app-route] (ecmascript)");
//#region src/messages/utils.ts
/**
* Immediately-invoked function expression.
*
* @param fn - The function to execute
* @returns The result of the function
*/ const iife = (fn)=>fn();
function _coerceToolCall(toolCall) {
    if (require_utils._isToolCall(toolCall)) return toolCall;
    else if (typeof toolCall.id === "string" && toolCall.type === "function" && typeof toolCall.function === "object" && toolCall.function !== null && "arguments" in toolCall.function && typeof toolCall.function.arguments === "string" && "name" in toolCall.function && typeof toolCall.function.name === "string") return {
        id: toolCall.id,
        args: JSON.parse(toolCall.function.arguments),
        name: toolCall.function.name,
        type: "tool_call"
    };
    else return toolCall;
}
function isSerializedConstructor(x) {
    return typeof x === "object" && x != null && x.lc === 1 && Array.isArray(x.id) && x.kwargs != null && typeof x.kwargs === "object";
}
function _constructMessageFromParams(params) {
    let type;
    let rest;
    if (isSerializedConstructor(params)) {
        const className = params.id.at(-1);
        if (className === "HumanMessage" || className === "HumanMessageChunk") type = "user";
        else if (className === "AIMessage" || className === "AIMessageChunk") type = "assistant";
        else if (className === "SystemMessage" || className === "SystemMessageChunk") type = "system";
        else if (className === "FunctionMessage" || className === "FunctionMessageChunk") type = "function";
        else if (className === "ToolMessage" || className === "ToolMessageChunk") type = "tool";
        else type = "unknown";
        rest = params.kwargs;
    } else {
        const { type: extractedType, ...otherParams } = params;
        type = extractedType;
        rest = otherParams;
    }
    if (type === "human" || type === "user") return new require_human.HumanMessage(rest);
    else if (type === "ai" || type === "assistant") {
        const { tool_calls: rawToolCalls, ...other } = rest;
        if (!Array.isArray(rawToolCalls)) return new require_ai.AIMessage(rest);
        const tool_calls = rawToolCalls.map(_coerceToolCall);
        return new require_ai.AIMessage({
            ...other,
            tool_calls
        });
    } else if (type === "system") return new require_system.SystemMessage(rest);
    else if (type === "developer") return new require_system.SystemMessage({
        ...rest,
        additional_kwargs: {
            ...rest.additional_kwargs,
            __openai_role__: "developer"
        }
    });
    else if (type === "tool" && "tool_call_id" in rest) return new require_messages_tool.ToolMessage({
        ...rest,
        content: rest.content,
        tool_call_id: rest.tool_call_id,
        name: rest.name
    });
    else if (type === "remove" && "id" in rest && typeof rest.id === "string") return new require_modifier.RemoveMessage({
        ...rest,
        id: rest.id
    });
    else {
        const error = require_errors_index.addLangChainErrorFields(/* @__PURE__ */ new Error(`Unable to coerce message from array: only human, AI, system, developer, or tool message coercion is currently supported.\n\nReceived: ${JSON.stringify(params, null, 2)}`), "MESSAGE_COERCION_FAILURE");
        throw error;
    }
}
function coerceMessageLikeToMessage(messageLike) {
    if (typeof messageLike === "string") return new require_human.HumanMessage(messageLike);
    else if (require_base.isBaseMessage(messageLike)) return messageLike;
    if (Array.isArray(messageLike)) {
        const [type, content] = messageLike;
        return _constructMessageFromParams({
            type,
            content
        });
    } else if (require_base._isMessageFieldWithRole(messageLike)) {
        const { role: type, ...rest } = messageLike;
        return _constructMessageFromParams({
            ...rest,
            type
        });
    } else return _constructMessageFromParams(messageLike);
}
/**
* This function is used by memory classes to get a string representation
* of the chat message history, based on the message content and role.
*
* Produces compact output like:
* ```
* Human: What's the weather?
* AI: Let me check...[tool_calls]
* Tool: 72°F and sunny
* ```
*
* This avoids token inflation from metadata when stringifying message objects directly.
*/ function getBufferString(messages, humanPrefix = "Human", aiPrefix = "AI") {
    const string_messages = [];
    for (const m of messages){
        let role;
        if (m.type === "human") role = humanPrefix;
        else if (m.type === "ai") role = aiPrefix;
        else if (m.type === "system") role = "System";
        else if (m.type === "tool") role = "Tool";
        else if (m.type === "generic") role = m.role;
        else throw new Error(`Got unsupported message type: ${m.type}`);
        const nameStr = m.name ? `${m.name}, ` : "";
        const readableContent = m.text;
        let message = `${role}: ${nameStr}${readableContent}`;
        if (m.type === "ai") {
            const aiMessage = m;
            if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) message += JSON.stringify(aiMessage.tool_calls);
            else if (aiMessage.additional_kwargs && "function_call" in aiMessage.additional_kwargs) message += JSON.stringify(aiMessage.additional_kwargs.function_call);
        }
        string_messages.push(message);
    }
    return string_messages.join("\n");
}
/**
* Maps messages from an older format (V1) to the current `StoredMessage`
* format. If the message is already in the `StoredMessage` format, it is
* returned as is. Otherwise, it transforms the V1 message into a
* `StoredMessage`. This function is important for maintaining
* compatibility with older message formats.
*/ function mapV1MessageToStoredMessage(message) {
    if (message.data !== void 0) return message;
    else {
        const v1Message = message;
        return {
            type: v1Message.type,
            data: {
                content: v1Message.text,
                role: v1Message.role,
                name: void 0,
                tool_call_id: void 0
            }
        };
    }
}
function mapStoredMessageToChatMessage(message) {
    const storedMessage = mapV1MessageToStoredMessage(message);
    switch(storedMessage.type){
        case "human":
            return new require_human.HumanMessage(storedMessage.data);
        case "ai":
            return new require_ai.AIMessage(storedMessage.data);
        case "system":
            return new require_system.SystemMessage(storedMessage.data);
        case "function":
            if (storedMessage.data.name === void 0) throw new Error("Name must be defined for function messages");
            return new require_function.FunctionMessage(storedMessage.data);
        case "tool":
            if (storedMessage.data.tool_call_id === void 0) throw new Error("Tool call ID must be defined for tool messages");
            return new require_messages_tool.ToolMessage(storedMessage.data);
        case "generic":
            if (storedMessage.data.role === void 0) throw new Error("Role must be defined for chat messages");
            return new require_chat.ChatMessage(storedMessage.data);
        default:
            throw new Error(`Got unexpected type: ${storedMessage.type}`);
    }
}
/**
* Transforms an array of `StoredMessage` instances into an array of
* `BaseMessage` instances. It uses the `mapV1MessageToStoredMessage`
* function to ensure all messages are in the `StoredMessage` format, then
* creates new instances of the appropriate `BaseMessage` subclass based
* on the type of each message. This function is used to prepare stored
* messages for use in a chat context.
*/ function mapStoredMessagesToChatMessages(messages) {
    return messages.map(mapStoredMessageToChatMessage);
}
/**
* Transforms an array of `BaseMessage` instances into an array of
* `StoredMessage` instances. It does this by calling the `toDict` method
* on each `BaseMessage`, which returns a `StoredMessage`. This function
* is used to prepare chat messages for storage.
*/ function mapChatMessagesToStoredMessages(messages) {
    return messages.map((message)=>message.toDict());
}
function convertToChunk(message) {
    const type = message._getType();
    if (type === "human") return new require_human.HumanMessageChunk({
        ...message
    });
    else if (type === "ai") {
        let aiChunkFields = {
            ...message
        };
        if ("tool_calls" in aiChunkFields) aiChunkFields = {
            ...aiChunkFields,
            tool_call_chunks: aiChunkFields.tool_calls?.map((tc)=>({
                    ...tc,
                    type: "tool_call_chunk",
                    index: void 0,
                    args: JSON.stringify(tc.args)
                }))
        };
        return new require_ai.AIMessageChunk({
            ...aiChunkFields
        });
    } else if (type === "system") return new require_system.SystemMessageChunk({
        ...message
    });
    else if (type === "function") return new require_function.FunctionMessageChunk({
        ...message
    });
    else if (require_chat.ChatMessage.isInstance(message)) return new require_chat.ChatMessageChunk({
        ...message
    });
    else throw new Error("Unknown message type.");
}
/**
* Collapses an array of tool call chunks into complete tool calls.
*
* This function groups tool call chunks by their id and/or index, then attempts to
* parse and validate the accumulated arguments for each group. Successfully parsed
* tool calls are returned as valid `ToolCall` objects, while malformed ones are
* returned as `InvalidToolCall` objects.
*
* @param chunks - An array of `ToolCallChunk` objects to collapse
* @returns An object containing:
*   - `tool_call_chunks`: The original input chunks
*   - `tool_calls`: An array of successfully parsed and validated tool calls
*   - `invalid_tool_calls`: An array of tool calls that failed parsing or validation
*
* @remarks
* Chunks are grouped using the following matching logic:
* - If a chunk has both an id and index, it matches chunks with the same id and index
* - If a chunk has only an id, it matches chunks with the same id
* - If a chunk has only an index, it matches chunks with the same index
*
* For each group, the function:
* 1. Concatenates all `args` strings from the chunks
* 2. Attempts to parse the concatenated string as JSON
* 3. Validates that the result is a non-null object with a valid id
* 4. Creates either a `ToolCall` (if valid) or `InvalidToolCall` (if invalid)
*/ function collapseToolCallChunks(chunks) {
    const groupedToolCallChunks = chunks.reduce((acc, chunk)=>{
        const matchedChunkIndex = acc.findIndex(([match])=>{
            if ("id" in chunk && chunk.id && "index" in chunk && chunk.index !== void 0) return chunk.id === match.id && chunk.index === match.index;
            if ("id" in chunk && chunk.id) return chunk.id === match.id;
            if ("index" in chunk && chunk.index !== void 0) return chunk.index === match.index;
            return false;
        });
        if (matchedChunkIndex !== -1) acc[matchedChunkIndex].push(chunk);
        else acc.push([
            chunk
        ]);
        return acc;
    }, []);
    const toolCalls = [];
    const invalidToolCalls = [];
    for (const chunks$1 of groupedToolCallChunks){
        let parsedArgs = null;
        const name = chunks$1[0]?.name ?? "";
        const joinedArgs = chunks$1.map((c)=>c.args || "").join("").trim();
        const argsStr = joinedArgs.length ? joinedArgs : "{}";
        const id = chunks$1[0]?.id;
        try {
            parsedArgs = require_json.parsePartialJson(argsStr);
            if (!id || parsedArgs === null || typeof parsedArgs !== "object" || Array.isArray(parsedArgs)) throw new Error("Malformed tool call chunk args.");
            toolCalls.push({
                name,
                args: parsedArgs,
                id,
                type: "tool_call"
            });
        } catch  {
            invalidToolCalls.push({
                name,
                args: argsStr,
                id,
                error: "Malformed args.",
                type: "invalid_tool_call"
            });
        }
    }
    return {
        tool_call_chunks: chunks,
        tool_calls: toolCalls,
        invalid_tool_calls: invalidToolCalls
    };
}
//#endregion
exports.coerceMessageLikeToMessage = coerceMessageLikeToMessage;
exports.collapseToolCallChunks = collapseToolCallChunks;
exports.convertToChunk = convertToChunk;
exports.getBufferString = getBufferString;
exports.iife = iife;
exports.mapChatMessagesToStoredMessages = mapChatMessagesToStoredMessages;
exports.mapStoredMessageToChatMessage = mapStoredMessageToChatMessage;
exports.mapStoredMessagesToChatMessages = mapStoredMessagesToChatMessages; //# sourceMappingURL=utils.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
//#region src/utils/env.ts
var env_exports = {};
require_rolldown_runtime.__export(env_exports, {
    getEnv: ()=>getEnv,
    getEnvironmentVariable: ()=>getEnvironmentVariable,
    getRuntimeEnvironment: ()=>getRuntimeEnvironment,
    isBrowser: ()=>isBrowser,
    isDeno: ()=>isDeno,
    isJsDom: ()=>isJsDom,
    isNode: ()=>isNode,
    isWebWorker: ()=>isWebWorker
});
const isBrowser = ()=>("TURBOPACK compile-time value", "undefined") !== "undefined" && typeof window.document !== "undefined";
const isWebWorker = ()=>typeof globalThis === "object" && globalThis.constructor && globalThis.constructor.name === "DedicatedWorkerGlobalScope";
const isJsDom = ()=>("TURBOPACK compile-time value", "undefined") !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom");
const isDeno = ()=>typeof Deno !== "undefined";
const isNode = ()=>typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined" && !isDeno();
const getEnv = ()=>{
    let env;
    if (isBrowser()) env = "browser";
    else if (isNode()) env = "node";
    else if (isWebWorker()) env = "webworker";
    else if (isJsDom()) env = "jsdom";
    else if (isDeno()) env = "deno";
    else env = "other";
    return env;
};
let runtimeEnvironment;
function getRuntimeEnvironment() {
    if (runtimeEnvironment === void 0) {
        const env = getEnv();
        runtimeEnvironment = {
            library: "langchain-js",
            runtime: env
        };
    }
    return runtimeEnvironment;
}
function getEnvironmentVariable(name) {
    try {
        if (typeof process !== "undefined") return process.env?.[name];
        else if (isDeno()) return Deno?.env.get(name);
        else return void 0;
    } catch  {
        return void 0;
    }
}
//#endregion
Object.defineProperty(exports, 'env_exports', {
    enumerable: true,
    get: function() {
        return env_exports;
    }
});
exports.getEnv = getEnv;
exports.getEnvironmentVariable = getEnvironmentVariable;
exports.getRuntimeEnvironment = getRuntimeEnvironment;
exports.isBrowser = isBrowser;
exports.isDeno = isDeno;
exports.isJsDom = isJsDom;
exports.isNode = isNode;
exports.isWebWorker = isWebWorker; //# sourceMappingURL=env.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/base.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_load_serializable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/serializable.cjs [app-route] (ecmascript)");
const require_utils_env = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)");
const uuid = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)"));
//#region src/callbacks/base.ts
var base_exports = {};
require_rolldown_runtime.__export(base_exports, {
    BaseCallbackHandler: ()=>BaseCallbackHandler,
    callbackHandlerPrefersStreaming: ()=>callbackHandlerPrefersStreaming,
    isBaseCallbackHandler: ()=>isBaseCallbackHandler
});
/**
* Abstract class that provides a set of optional methods that can be
* overridden in derived classes to handle various events during the
* execution of a LangChain application.
*/ var BaseCallbackHandlerMethodsClass = class {
};
function callbackHandlerPrefersStreaming(x) {
    return "lc_prefer_streaming" in x && x.lc_prefer_streaming;
}
/**
* Abstract base class for creating callback handlers in the LangChain
* framework. It provides a set of optional methods that can be overridden
* in derived classes to handle various events during the execution of a
* LangChain application.
*/ var BaseCallbackHandler = class extends BaseCallbackHandlerMethodsClass {
    lc_serializable = false;
    get lc_namespace() {
        return [
            "langchain_core",
            "callbacks",
            this.name
        ];
    }
    get lc_secrets() {
        return void 0;
    }
    get lc_attributes() {
        return void 0;
    }
    get lc_aliases() {
        return void 0;
    }
    get lc_serializable_keys() {
        return void 0;
    }
    /**
	* The name of the serializable. Override to provide an alias or
	* to preserve the serialized module name in minified environments.
	*
	* Implemented as a static method to support loading logic.
	*/ static lc_name() {
        return this.name;
    }
    /**
	* The final serialized identifier for the module.
	*/ get lc_id() {
        return [
            ...this.lc_namespace,
            require_load_serializable.get_lc_unique_name(this.constructor)
        ];
    }
    lc_kwargs;
    ignoreLLM = false;
    ignoreChain = false;
    ignoreAgent = false;
    ignoreRetriever = false;
    ignoreCustomEvent = false;
    raiseError = false;
    awaitHandlers = require_utils_env.getEnvironmentVariable("LANGCHAIN_CALLBACKS_BACKGROUND") === "false";
    constructor(input){
        super();
        this.lc_kwargs = input || {};
        if (input) {
            this.ignoreLLM = input.ignoreLLM ?? this.ignoreLLM;
            this.ignoreChain = input.ignoreChain ?? this.ignoreChain;
            this.ignoreAgent = input.ignoreAgent ?? this.ignoreAgent;
            this.ignoreRetriever = input.ignoreRetriever ?? this.ignoreRetriever;
            this.ignoreCustomEvent = input.ignoreCustomEvent ?? this.ignoreCustomEvent;
            this.raiseError = input.raiseError ?? this.raiseError;
            this.awaitHandlers = this.raiseError || (input._awaitHandler ?? this.awaitHandlers);
        }
    }
    copy() {
        return new this.constructor(this);
    }
    toJSON() {
        return require_load_serializable.Serializable.prototype.toJSON.call(this);
    }
    toJSONNotImplemented() {
        return require_load_serializable.Serializable.prototype.toJSONNotImplemented.call(this);
    }
    static fromMethods(methods) {
        class Handler extends BaseCallbackHandler {
            name = uuid.v7();
            constructor(){
                super();
                Object.assign(this, methods);
            }
        }
        return new Handler();
    }
};
const isBaseCallbackHandler = (x)=>{
    const callbackHandler = x;
    return callbackHandler !== void 0 && typeof callbackHandler.copy === "function" && typeof callbackHandler.name === "string" && typeof callbackHandler.awaitHandlers === "boolean";
};
//#endregion
exports.BaseCallbackHandler = BaseCallbackHandler;
Object.defineProperty(exports, 'base_exports', {
    enumerable: true,
    get: function() {
        return base_exports;
    }
});
exports.callbackHandlerPrefersStreaming = callbackHandlerPrefersStreaming;
exports.isBaseCallbackHandler = isBaseCallbackHandler; //# sourceMappingURL=base.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils_env = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)");
const require_callbacks_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/base.cjs [app-route] (ecmascript)");
const langsmith_run_trees = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/run_trees.cjs [app-route] (ecmascript)"));
//#region src/tracers/base.ts
var base_exports = {};
require_rolldown_runtime.__export(base_exports, {
    BaseTracer: ()=>BaseTracer,
    isBaseTracer: ()=>isBaseTracer
});
const convertRunTreeToRun = (runTree)=>{
    if (!runTree) return void 0;
    runTree.events = runTree.events ?? [];
    runTree.child_runs = runTree.child_runs ?? [];
    return runTree;
};
function convertRunToRunTree(run, parentRun) {
    if (!run) return void 0;
    return new langsmith_run_trees.RunTree({
        ...run,
        start_time: run._serialized_start_time ?? run.start_time,
        parent_run: convertRunToRunTree(parentRun),
        child_runs: run.child_runs.map((r)=>convertRunToRunTree(r)).filter((r)=>r !== void 0),
        extra: {
            ...run.extra,
            runtime: require_utils_env.getRuntimeEnvironment()
        },
        tracingEnabled: false
    });
}
function _coerceToDict(value, defaultKey) {
    return value && !Array.isArray(value) && typeof value === "object" ? value : {
        [defaultKey]: value
    };
}
function isBaseTracer(x) {
    return typeof x._addRunToRunMap === "function";
}
var BaseTracer = class extends require_callbacks_base.BaseCallbackHandler {
    /** @deprecated Use `runTreeMap` instead. */ runMap = /* @__PURE__ */ new Map();
    runTreeMap = /* @__PURE__ */ new Map();
    usesRunTreeMap = false;
    constructor(_fields){
        super(...arguments);
    }
    copy() {
        return this;
    }
    getRunById(runId) {
        if (runId === void 0) return void 0;
        return this.usesRunTreeMap ? convertRunTreeToRun(this.runTreeMap.get(runId)) : this.runMap.get(runId);
    }
    stringifyError(error) {
        if (error instanceof Error) return error.message + (error?.stack ? `\n\n${error.stack}` : "");
        if (typeof error === "string") return error;
        return `${error}`;
    }
    _addChildRun(parentRun, childRun) {
        parentRun.child_runs.push(childRun);
    }
    _addRunToRunMap(run) {
        const { dottedOrder: currentDottedOrder, microsecondPrecisionDatestring } = (0, langsmith_run_trees.convertToDottedOrderFormat)(new Date(run.start_time).getTime(), run.id, run.execution_order);
        const storedRun = {
            ...run
        };
        const parentRun = this.getRunById(storedRun.parent_run_id);
        if (storedRun.parent_run_id !== void 0) if (parentRun) {
            this._addChildRun(parentRun, storedRun);
            parentRun.child_execution_order = Math.max(parentRun.child_execution_order, storedRun.child_execution_order);
            storedRun.trace_id = parentRun.trace_id;
            if (parentRun.dotted_order !== void 0) {
                storedRun.dotted_order = [
                    parentRun.dotted_order,
                    currentDottedOrder
                ].join(".");
                storedRun._serialized_start_time = microsecondPrecisionDatestring;
            }
        } else storedRun.parent_run_id = void 0;
        else {
            storedRun.trace_id = storedRun.id;
            storedRun.dotted_order = currentDottedOrder;
            storedRun._serialized_start_time = microsecondPrecisionDatestring;
        }
        if (this.usesRunTreeMap) {
            const runTree = convertRunToRunTree(storedRun, parentRun);
            if (runTree !== void 0) this.runTreeMap.set(storedRun.id, runTree);
        } else this.runMap.set(storedRun.id, storedRun);
        return storedRun;
    }
    async _endTrace(run) {
        const parentRun = run.parent_run_id !== void 0 && this.getRunById(run.parent_run_id);
        if (parentRun) parentRun.child_execution_order = Math.max(parentRun.child_execution_order, run.child_execution_order);
        else await this.persistRun(run);
        await this.onRunUpdate?.(run);
        if (this.usesRunTreeMap) this.runTreeMap.delete(run.id);
        else this.runMap.delete(run.id);
    }
    _getExecutionOrder(parentRunId) {
        const parentRun = parentRunId !== void 0 && this.getRunById(parentRunId);
        if (!parentRun) return 1;
        return parentRun.child_execution_order + 1;
    }
    /**
	* Create and add a run to the run map for LLM start events.
	* This must sometimes be done synchronously to avoid race conditions
	* when callbacks are backgrounded, so we expose it as a separate method here.
	*/ _createRunForLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const finalExtraParams = metadata ? {
            ...extraParams,
            metadata
        } : extraParams;
        const run = {
            id: runId,
            name: name ?? llm.id[llm.id.length - 1],
            parent_run_id: parentRunId,
            start_time,
            serialized: llm,
            events: [
                {
                    name: "start",
                    time: new Date(start_time).toISOString()
                }
            ],
            inputs: {
                prompts
            },
            execution_order,
            child_runs: [],
            child_execution_order: execution_order,
            run_type: "llm",
            extra: finalExtraParams ?? {},
            tags: tags || []
        };
        return this._addRunToRunMap(run);
    }
    async handleLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
        const run = this.getRunById(runId) ?? this._createRunForLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onLLMStart?.(run);
        return run;
    }
    /**
	* Create and add a run to the run map for chat model start events.
	* This must sometimes be done synchronously to avoid race conditions
	* when callbacks are backgrounded, so we expose it as a separate method here.
	*/ _createRunForChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const finalExtraParams = metadata ? {
            ...extraParams,
            metadata
        } : extraParams;
        const run = {
            id: runId,
            name: name ?? llm.id[llm.id.length - 1],
            parent_run_id: parentRunId,
            start_time,
            serialized: llm,
            events: [
                {
                    name: "start",
                    time: new Date(start_time).toISOString()
                }
            ],
            inputs: {
                messages
            },
            execution_order,
            child_runs: [],
            child_execution_order: execution_order,
            run_type: "llm",
            extra: finalExtraParams ?? {},
            tags: tags || []
        };
        return this._addRunToRunMap(run);
    }
    async handleChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name) {
        const run = this.getRunById(runId) ?? this._createRunForChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onLLMStart?.(run);
        return run;
    }
    async handleLLMEnd(output, runId, _parentRunId, _tags, extraParams) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "llm") throw new Error("No LLM run to end.");
        run.end_time = Date.now();
        run.outputs = output;
        run.events.push({
            name: "end",
            time: new Date(run.end_time).toISOString()
        });
        run.extra = {
            ...run.extra,
            ...extraParams
        };
        await this.onLLMEnd?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleLLMError(error, runId, _parentRunId, _tags, extraParams) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "llm") throw new Error("No LLM run to end.");
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
            name: "error",
            time: new Date(run.end_time).toISOString()
        });
        run.extra = {
            ...run.extra,
            ...extraParams
        };
        await this.onLLMError?.(run);
        await this._endTrace(run);
        return run;
    }
    /**
	* Create and add a run to the run map for chain start events.
	* This must sometimes be done synchronously to avoid race conditions
	* when callbacks are backgrounded, so we expose it as a separate method here.
	*/ _createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name, extra) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
            id: runId,
            name: name ?? chain.id[chain.id.length - 1],
            parent_run_id: parentRunId,
            start_time,
            serialized: chain,
            events: [
                {
                    name: "start",
                    time: new Date(start_time).toISOString()
                }
            ],
            inputs,
            execution_order,
            child_execution_order: execution_order,
            run_type: runType ?? "chain",
            child_runs: [],
            extra: metadata ? {
                ...extra,
                metadata
            } : {
                ...extra
            },
            tags: tags || []
        };
        return this._addRunToRunMap(run);
    }
    async handleChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name) {
        const run = this.getRunById(runId) ?? this._createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name);
        await this.onRunCreate?.(run);
        await this.onChainStart?.(run);
        return run;
    }
    async handleChainEnd(outputs, runId, _parentRunId, _tags, kwargs) {
        const run = this.getRunById(runId);
        if (!run) throw new Error("No chain run to end.");
        run.end_time = Date.now();
        run.outputs = _coerceToDict(outputs, "output");
        run.events.push({
            name: "end",
            time: new Date(run.end_time).toISOString()
        });
        if (kwargs?.inputs !== void 0) run.inputs = _coerceToDict(kwargs.inputs, "input");
        await this.onChainEnd?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleChainError(error, runId, _parentRunId, _tags, kwargs) {
        const run = this.getRunById(runId);
        if (!run) throw new Error("No chain run to end.");
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
            name: "error",
            time: new Date(run.end_time).toISOString()
        });
        if (kwargs?.inputs !== void 0) run.inputs = _coerceToDict(kwargs.inputs, "input");
        await this.onChainError?.(run);
        await this._endTrace(run);
        return run;
    }
    /**
	* Create and add a run to the run map for tool start events.
	* This must sometimes be done synchronously to avoid race conditions
	* when callbacks are backgrounded, so we expose it as a separate method here.
	*/ _createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
            id: runId,
            name: name ?? tool.id[tool.id.length - 1],
            parent_run_id: parentRunId,
            start_time,
            serialized: tool,
            events: [
                {
                    name: "start",
                    time: new Date(start_time).toISOString()
                }
            ],
            inputs: {
                input
            },
            execution_order,
            child_execution_order: execution_order,
            run_type: "tool",
            child_runs: [],
            extra: metadata ? {
                metadata
            } : {},
            tags: tags || []
        };
        return this._addRunToRunMap(run);
    }
    async handleToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
        const run = this.getRunById(runId) ?? this._createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onToolStart?.(run);
        return run;
    }
    async handleToolEnd(output, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "tool") throw new Error("No tool run to end");
        run.end_time = Date.now();
        run.outputs = {
            output
        };
        run.events.push({
            name: "end",
            time: new Date(run.end_time).toISOString()
        });
        await this.onToolEnd?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleToolError(error, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "tool") throw new Error("No tool run to end");
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
            name: "error",
            time: new Date(run.end_time).toISOString()
        });
        await this.onToolError?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleAgentAction(action, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "chain") return;
        const agentRun = run;
        agentRun.actions = agentRun.actions || [];
        agentRun.actions.push(action);
        agentRun.events.push({
            name: "agent_action",
            time: /* @__PURE__ */ new Date().toISOString(),
            kwargs: {
                action
            }
        });
        await this.onAgentAction?.(run);
    }
    async handleAgentEnd(action, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "chain") return;
        run.events.push({
            name: "agent_end",
            time: /* @__PURE__ */ new Date().toISOString(),
            kwargs: {
                action
            }
        });
        await this.onAgentEnd?.(run);
    }
    /**
	* Create and add a run to the run map for retriever start events.
	* This must sometimes be done synchronously to avoid race conditions
	* when callbacks are backgrounded, so we expose it as a separate method here.
	*/ _createRunForRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
            id: runId,
            name: name ?? retriever.id[retriever.id.length - 1],
            parent_run_id: parentRunId,
            start_time,
            serialized: retriever,
            events: [
                {
                    name: "start",
                    time: new Date(start_time).toISOString()
                }
            ],
            inputs: {
                query
            },
            execution_order,
            child_execution_order: execution_order,
            run_type: "retriever",
            child_runs: [],
            extra: metadata ? {
                metadata
            } : {},
            tags: tags || []
        };
        return this._addRunToRunMap(run);
    }
    async handleRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name) {
        const run = this.getRunById(runId) ?? this._createRunForRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onRetrieverStart?.(run);
        return run;
    }
    async handleRetrieverEnd(documents, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "retriever") throw new Error("No retriever run to end");
        run.end_time = Date.now();
        run.outputs = {
            documents
        };
        run.events.push({
            name: "end",
            time: new Date(run.end_time).toISOString()
        });
        await this.onRetrieverEnd?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleRetrieverError(error, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "retriever") throw new Error("No retriever run to end");
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
            name: "error",
            time: new Date(run.end_time).toISOString()
        });
        await this.onRetrieverError?.(run);
        await this._endTrace(run);
        return run;
    }
    async handleText(text, runId) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "chain") return;
        run.events.push({
            name: "text",
            time: /* @__PURE__ */ new Date().toISOString(),
            kwargs: {
                text
            }
        });
        await this.onText?.(run);
    }
    async handleLLMNewToken(token, idx, runId, _parentRunId, _tags, fields) {
        const run = this.getRunById(runId);
        if (!run || run?.run_type !== "llm") throw new Error(`Invalid "runId" provided to "handleLLMNewToken" callback.`);
        run.events.push({
            name: "new_token",
            time: /* @__PURE__ */ new Date().toISOString(),
            kwargs: {
                token,
                idx,
                chunk: fields?.chunk
            }
        });
        await this.onLLMNewToken?.(run, token, {
            chunk: fields?.chunk
        });
        return run;
    }
};
//#endregion
exports.BaseTracer = BaseTracer;
Object.defineProperty(exports, 'base_exports', {
    enumerable: true,
    get: function() {
        return base_exports;
    }
});
exports.isBaseTracer = isBaseTracer; //# sourceMappingURL=base.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/console.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
const ansi_styles = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/ansi-styles/index.js [app-route] (ecmascript)"));
//#region src/tracers/console.ts
var console_exports = {};
require_rolldown_runtime.__export(console_exports, {
    ConsoleCallbackHandler: ()=>ConsoleCallbackHandler
});
function wrap(style, text) {
    return `${style.open}${text}${style.close}`;
}
function tryJsonStringify(obj, fallback) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch  {
        return fallback;
    }
}
function formatKVMapItem(value) {
    if (typeof value === "string") return value.trim();
    if (value === null || value === void 0) return value;
    return tryJsonStringify(value, value.toString());
}
function elapsed(run) {
    if (!run.end_time) return "";
    const elapsed$1 = run.end_time - run.start_time;
    if (elapsed$1 < 1e3) return `${elapsed$1}ms`;
    return `${(elapsed$1 / 1e3).toFixed(2)}s`;
}
const { color } = ansi_styles.default;
/**
* A tracer that logs all events to the console. It extends from the
* `BaseTracer` class and overrides its methods to provide custom logging
* functionality.
* @example
* ```typescript
*
* const llm = new ChatAnthropic({
*   temperature: 0,
*   tags: ["example", "callbacks", "constructor"],
*   callbacks: [new ConsoleCallbackHandler()],
* });
*
* ```
*/ var ConsoleCallbackHandler = class extends require_tracers_base.BaseTracer {
    name = "console_callback_handler";
    /**
	* Method used to persist the run. In this case, it simply returns a
	* resolved promise as there's no persistence logic.
	* @param _run The run to persist.
	* @returns A resolved promise.
	*/ persistRun(_run) {
        return Promise.resolve();
    }
    /**
	* Method used to get all the parent runs of a given run.
	* @param run The run whose parents are to be retrieved.
	* @returns An array of parent runs.
	*/ getParents(run) {
        const parents = [];
        let currentRun = run;
        while(currentRun.parent_run_id){
            const parent = this.runMap.get(currentRun.parent_run_id);
            if (parent) {
                parents.push(parent);
                currentRun = parent;
            } else break;
        }
        return parents;
    }
    /**
	* Method used to get a string representation of the run's lineage, which
	* is used in logging.
	* @param run The run whose lineage is to be retrieved.
	* @returns A string representation of the run's lineage.
	*/ getBreadcrumbs(run) {
        const parents = this.getParents(run).reverse();
        const string = [
            ...parents,
            run
        ].map((parent, i, arr)=>{
            const name = `${parent.execution_order}:${parent.run_type}:${parent.name}`;
            return i === arr.length - 1 ? wrap(ansi_styles.default.bold, name) : name;
        }).join(" > ");
        return wrap(color.grey, string);
    }
    /**
	* Method used to log the start of a chain run.
	* @param run The chain run that has started.
	* @returns void
	*/ onChainStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[chain/start]")} [${crumbs}] Entering Chain run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
    }
    /**
	* Method used to log the end of a chain run.
	* @param run The chain run that has ended.
	* @returns void
	*/ onChainEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[chain/end]")} [${crumbs}] [${elapsed(run)}] Exiting Chain run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
    }
    /**
	* Method used to log any errors of a chain run.
	* @param run The chain run that has errored.
	* @returns void
	*/ onChainError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[chain/error]")} [${crumbs}] [${elapsed(run)}] Chain run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    /**
	* Method used to log the start of an LLM run.
	* @param run The LLM run that has started.
	* @returns void
	*/ onLLMStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        const inputs = "prompts" in run.inputs ? {
            prompts: run.inputs.prompts.map((p)=>p.trim())
        } : run.inputs;
        console.log(`${wrap(color.green, "[llm/start]")} [${crumbs}] Entering LLM run with input: ${tryJsonStringify(inputs, "[inputs]")}`);
    }
    /**
	* Method used to log the end of an LLM run.
	* @param run The LLM run that has ended.
	* @returns void
	*/ onLLMEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[llm/end]")} [${crumbs}] [${elapsed(run)}] Exiting LLM run with output: ${tryJsonStringify(run.outputs, "[response]")}`);
    }
    /**
	* Method used to log any errors of an LLM run.
	* @param run The LLM run that has errored.
	* @returns void
	*/ onLLMError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[llm/error]")} [${crumbs}] [${elapsed(run)}] LLM run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    /**
	* Method used to log the start of a tool run.
	* @param run The tool run that has started.
	* @returns void
	*/ onToolStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[tool/start]")} [${crumbs}] Entering Tool run with input: "${formatKVMapItem(run.inputs.input)}"`);
    }
    /**
	* Method used to log the end of a tool run.
	* @param run The tool run that has ended.
	* @returns void
	*/ onToolEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[tool/end]")} [${crumbs}] [${elapsed(run)}] Exiting Tool run with output: "${formatKVMapItem(run.outputs?.output)}"`);
    }
    /**
	* Method used to log any errors of a tool run.
	* @param run The tool run that has errored.
	* @returns void
	*/ onToolError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[tool/error]")} [${crumbs}] [${elapsed(run)}] Tool run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    /**
	* Method used to log the start of a retriever run.
	* @param run The retriever run that has started.
	* @returns void
	*/ onRetrieverStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[retriever/start]")} [${crumbs}] Entering Retriever run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
    }
    /**
	* Method used to log the end of a retriever run.
	* @param run The retriever run that has ended.
	* @returns void
	*/ onRetrieverEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[retriever/end]")} [${crumbs}] [${elapsed(run)}] Exiting Retriever run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
    }
    /**
	* Method used to log any errors of a retriever run.
	* @param run The retriever run that has errored.
	* @returns void
	*/ onRetrieverError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[retriever/error]")} [${crumbs}] [${elapsed(run)}] Retriever run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
    }
    /**
	* Method used to log the action selected by the agent.
	* @param run The run in which the agent action occurred.
	* @returns void
	*/ onAgentAction(run) {
        const agentRun = run;
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.blue, "[agent/action]")} [${crumbs}] Agent selected action: ${tryJsonStringify(agentRun.actions[agentRun.actions.length - 1], "[action]")}`);
    }
};
//#endregion
exports.ConsoleCallbackHandler = ConsoleCallbackHandler;
Object.defineProperty(exports, 'console_exports', {
    enumerable: true,
    get: function() {
        return console_exports;
    }
}); //# sourceMappingURL=console.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/tracer.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils_env = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)");
const langsmith = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/index.cjs [app-route] (ecmascript)"));
//#region src/singletons/tracer.ts
let client;
const getDefaultLangChainClientSingleton = ()=>{
    if (client === void 0) {
        const clientParams = require_utils_env.getEnvironmentVariable("LANGCHAIN_CALLBACKS_BACKGROUND") === "false" ? {
            blockOnRootRunFinalization: true
        } : {};
        client = new langsmith.Client(clientParams);
    }
    return client;
};
//#endregion
exports.getDefaultLangChainClientSingleton = getDefaultLangChainClientSingleton; //# sourceMappingURL=tracer.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/tracer_langchain.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_metadata = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/metadata.cjs [app-route] (ecmascript)");
const require_ai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/ai.cjs [app-route] (ecmascript)");
const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
const require_tracer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/tracer.cjs [app-route] (ecmascript)");
const langsmith_singletons_traceable = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/singletons/traceable.cjs [app-route] (ecmascript)"));
const langsmith_run_trees = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/run_trees.cjs [app-route] (ecmascript)"));
const langsmith = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/index.cjs [app-route] (ecmascript)"));
//#region src/tracers/tracer_langchain.ts
var tracer_langchain_exports = {};
require_rolldown_runtime.__export(tracer_langchain_exports, {
    LangChainTracer: ()=>LangChainTracer
});
/**
* Extract usage_metadata from chat generations.
*
* Iterates through generations to find and aggregates all usage_metadata
* found in chat messages. This is typically present in chat model outputs.
*/ function _getUsageMetadataFromGenerations(generations) {
    let output = void 0;
    for (const generationBatch of generations)for (const generation of generationBatch)if (require_ai.AIMessage.isInstance(generation.message) && generation.message.usage_metadata !== void 0) output = require_metadata.mergeUsageMetadata(output, generation.message.usage_metadata);
    return output;
}
var LangChainTracer = class LangChainTracer extends require_tracers_base.BaseTracer {
    name = "langchain_tracer";
    projectName;
    exampleId;
    client;
    replicas;
    usesRunTreeMap = true;
    constructor(fields = {}){
        super(fields);
        const { exampleId, projectName, client, replicas } = fields;
        this.projectName = projectName ?? (0, langsmith.getDefaultProjectName)();
        this.replicas = replicas;
        this.exampleId = exampleId;
        this.client = client ?? require_tracer.getDefaultLangChainClientSingleton();
        const traceableTree = LangChainTracer.getTraceableRunTree();
        if (traceableTree) this.updateFromRunTree(traceableTree);
    }
    async persistRun(_run) {}
    async onRunCreate(run) {
        if (!run.extra?.lc_defers_inputs) {
            const runTree = this.getRunTreeWithTracingConfig(run.id);
            await runTree?.postRun();
        }
    }
    async onRunUpdate(run) {
        const runTree = this.getRunTreeWithTracingConfig(run.id);
        if (run.extra?.lc_defers_inputs) await runTree?.postRun();
        else await runTree?.patchRun();
    }
    onLLMEnd(run) {
        const outputs = run.outputs;
        if (outputs?.generations) {
            const usageMetadata = _getUsageMetadataFromGenerations(outputs.generations);
            if (usageMetadata !== void 0) {
                run.extra = run.extra ?? {};
                const metadata = run.extra.metadata ?? {};
                metadata.usage_metadata = usageMetadata;
                run.extra.metadata = metadata;
            }
        }
    }
    getRun(id) {
        return this.runTreeMap.get(id);
    }
    updateFromRunTree(runTree) {
        this.runTreeMap.set(runTree.id, runTree);
        let rootRun = runTree;
        const visited = /* @__PURE__ */ new Set();
        while(rootRun.parent_run){
            if (visited.has(rootRun.id)) break;
            visited.add(rootRun.id);
            if (!rootRun.parent_run) break;
            rootRun = rootRun.parent_run;
        }
        visited.clear();
        const queue = [
            rootRun
        ];
        while(queue.length > 0){
            const current = queue.shift();
            if (!current || visited.has(current.id)) continue;
            visited.add(current.id);
            this.runTreeMap.set(current.id, current);
            if (current.child_runs) queue.push(...current.child_runs);
        }
        this.client = runTree.client ?? this.client;
        this.replicas = runTree.replicas ?? this.replicas;
        this.projectName = runTree.project_name ?? this.projectName;
        this.exampleId = runTree.reference_example_id ?? this.exampleId;
    }
    getRunTreeWithTracingConfig(id) {
        const runTree = this.runTreeMap.get(id);
        if (!runTree) return void 0;
        return new langsmith_run_trees.RunTree({
            ...runTree,
            client: this.client,
            project_name: this.projectName,
            replicas: this.replicas,
            reference_example_id: this.exampleId,
            tracingEnabled: true
        });
    }
    static getTraceableRunTree() {
        try {
            return (0, langsmith_singletons_traceable.getCurrentRunTree)(true);
        } catch  {
            return void 0;
        }
    }
};
//#endregion
exports.LangChainTracer = LangChainTracer;
Object.defineProperty(exports, 'tracer_langchain_exports', {
    enumerable: true,
    get: function() {
        return tracer_langchain_exports;
    }
}); //# sourceMappingURL=tracer_langchain.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/globals.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/singletons/async_local_storage/globals.ts
const TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
const _CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");
const setGlobalAsyncLocalStorageInstance = (instance)=>{
    globalThis[TRACING_ALS_KEY] = instance;
};
const getGlobalAsyncLocalStorageInstance = ()=>{
    return globalThis[TRACING_ALS_KEY];
};
//#endregion
exports._CONTEXT_VARIABLES_KEY = _CONTEXT_VARIABLES_KEY;
exports.getGlobalAsyncLocalStorageInstance = getGlobalAsyncLocalStorageInstance;
exports.setGlobalAsyncLocalStorageInstance = setGlobalAsyncLocalStorageInstance; //# sourceMappingURL=globals.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/callbacks.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_tracer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/tracer.cjs [app-route] (ecmascript)");
const require_globals = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/globals.cjs [app-route] (ecmascript)");
const p_queue = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-queue/dist/index.js [app-route] (ecmascript)"));
//#region src/singletons/callbacks.ts
let queue;
/**
* Creates a queue using the p-queue library. The queue is configured to
* auto-start and has a concurrency of 1, meaning it will process tasks
* one at a time.
*/ function createQueue() {
    const PQueue = "default" in p_queue.default ? p_queue.default.default : p_queue.default;
    return new PQueue({
        autoStart: true,
        concurrency: 1
    });
}
function getQueue() {
    if (typeof queue === "undefined") queue = createQueue();
    return queue;
}
/**
* Consume a promise, either adding it to the queue or waiting for it to resolve
* @param promiseFn Promise to consume
* @param wait Whether to wait for the promise to resolve or resolve immediately
*/ async function consumeCallback(promiseFn, wait) {
    if (wait === true) {
        const asyncLocalStorageInstance = require_globals.getGlobalAsyncLocalStorageInstance();
        if (asyncLocalStorageInstance !== void 0) await asyncLocalStorageInstance.run(void 0, async ()=>promiseFn());
        else await promiseFn();
    } else {
        queue = getQueue();
        queue.add(async ()=>{
            const asyncLocalStorageInstance = require_globals.getGlobalAsyncLocalStorageInstance();
            if (asyncLocalStorageInstance !== void 0) await asyncLocalStorageInstance.run(void 0, async ()=>promiseFn());
            else await promiseFn();
        });
    }
}
/**
* Waits for all promises in the queue to resolve. If the queue is
* undefined, it immediately resolves a promise.
*/ async function awaitAllCallbacks() {
    const defaultClient = require_tracer.getDefaultLangChainClientSingleton();
    await Promise.allSettled([
        typeof queue !== "undefined" ? queue.onIdle() : Promise.resolve(),
        defaultClient.awaitPendingTraceBatches()
    ]);
}
//#endregion
exports.awaitAllCallbacks = awaitAllCallbacks;
exports.consumeCallback = consumeCallback; //# sourceMappingURL=callbacks.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/promises.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_callbacks = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/callbacks.cjs [app-route] (ecmascript)");
//#region src/callbacks/promises.ts
var promises_exports = {};
require_rolldown_runtime.__export(promises_exports, {
    awaitAllCallbacks: ()=>require_callbacks.awaitAllCallbacks,
    consumeCallback: ()=>require_callbacks.consumeCallback
});
//#endregion
exports.awaitAllCallbacks = require_callbacks.awaitAllCallbacks;
exports.consumeCallback = require_callbacks.consumeCallback;
Object.defineProperty(exports, 'promises_exports', {
    enumerable: true,
    get: function() {
        return promises_exports;
    }
}); //# sourceMappingURL=promises.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/callbacks.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils_env = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)");
//#region src/utils/callbacks.ts
const isTracingEnabled = (tracingEnabled)=>{
    if (tracingEnabled !== void 0) return tracingEnabled;
    const envVars = [
        "LANGSMITH_TRACING_V2",
        "LANGCHAIN_TRACING_V2",
        "LANGSMITH_TRACING",
        "LANGCHAIN_TRACING"
    ];
    return !!envVars.find((envVar)=>require_utils_env.getEnvironmentVariable(envVar) === "true");
};
//#endregion
exports.isTracingEnabled = isTracingEnabled; //# sourceMappingURL=callbacks.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/context.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_globals = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/globals.cjs [app-route] (ecmascript)");
const langsmith_run_trees = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/run_trees.cjs [app-route] (ecmascript)"));
//#region src/singletons/async_local_storage/context.ts
/**
* Set a context variable. Context variables are scoped to any
* child runnables called by the current runnable, or globally if set outside
* of any runnable.
*
* @remarks
* This function is only supported in environments that support AsyncLocalStorage,
* including Node.js, Deno, and Cloudflare Workers.
*
* @example
* ```ts
* import { RunnableLambda } from "@langchain/core/runnables";
* import {
*   getContextVariable,
*   setContextVariable
* } from "@langchain/core/context";
*
* const nested = RunnableLambda.from(() => {
*   // "bar" because it was set by a parent
*   console.log(getContextVariable("foo"));
*
*   // Override to "baz", but only for child runnables
*   setContextVariable("foo", "baz");
*
*   // Now "baz", but only for child runnables
*   return getContextVariable("foo");
* });
*
* const runnable = RunnableLambda.from(async () => {
*   // Set a context variable named "foo"
*   setContextVariable("foo", "bar");
*
*   const res = await nested.invoke({});
*
*   // Still "bar" since child changes do not affect parents
*   console.log(getContextVariable("foo"));
*
*   return res;
* });
*
* // undefined, because context variable has not been set yet
* console.log(getContextVariable("foo"));
*
* // Final return value is "baz"
* const result = await runnable.invoke({});
* ```
*
* @param name The name of the context variable.
* @param value The value to set.
*/ function setContextVariable(name, value) {
    const asyncLocalStorageInstance = require_globals.getGlobalAsyncLocalStorageInstance();
    if (asyncLocalStorageInstance === void 0) throw new Error(`Internal error: Global shared async local storage instance has not been initialized.`);
    const runTree = asyncLocalStorageInstance.getStore();
    const contextVars = {
        ...runTree?.[require_globals._CONTEXT_VARIABLES_KEY]
    };
    contextVars[name] = value;
    let newValue = {};
    if ((0, langsmith_run_trees.isRunTree)(runTree)) newValue = new langsmith_run_trees.RunTree(runTree);
    newValue[require_globals._CONTEXT_VARIABLES_KEY] = contextVars;
    asyncLocalStorageInstance.enterWith(newValue);
}
/**
* Get the value of a previously set context variable. Context variables
* are scoped to any child runnables called by the current runnable,
* or globally if set outside of any runnable.
*
* @remarks
* This function is only supported in environments that support AsyncLocalStorage,
* including Node.js, Deno, and Cloudflare Workers.
*
* @example
* ```ts
* import { RunnableLambda } from "@langchain/core/runnables";
* import {
*   getContextVariable,
*   setContextVariable
* } from "@langchain/core/context";
*
* const nested = RunnableLambda.from(() => {
*   // "bar" because it was set by a parent
*   console.log(getContextVariable("foo"));
*
*   // Override to "baz", but only for child runnables
*   setContextVariable("foo", "baz");
*
*   // Now "baz", but only for child runnables
*   return getContextVariable("foo");
* });
*
* const runnable = RunnableLambda.from(async () => {
*   // Set a context variable named "foo"
*   setContextVariable("foo", "bar");
*
*   const res = await nested.invoke({});
*
*   // Still "bar" since child changes do not affect parents
*   console.log(getContextVariable("foo"));
*
*   return res;
* });
*
* // undefined, because context variable has not been set yet
* console.log(getContextVariable("foo"));
*
* // Final return value is "baz"
* const result = await runnable.invoke({});
* ```
*
* @param name The name of the context variable.
*/ function getContextVariable(name) {
    const asyncLocalStorageInstance = require_globals.getGlobalAsyncLocalStorageInstance();
    if (asyncLocalStorageInstance === void 0) return void 0;
    const runTree = asyncLocalStorageInstance.getStore();
    return runTree?.[require_globals._CONTEXT_VARIABLES_KEY]?.[name];
}
const LC_CONFIGURE_HOOKS_KEY = Symbol("lc:configure_hooks");
const _getConfigureHooks = ()=>getContextVariable(LC_CONFIGURE_HOOKS_KEY) || [];
/**
* Register a callback configure hook to automatically add callback handlers to all runs.
*
* There are two ways to use this:
*
* 1. Using a context variable:
*    - Set `contextVar` to specify the variable name
*    - Use `setContextVariable()` to store your handler instance
*
* 2. Using an environment variable:
*    - Set both `envVar` and `handlerClass`
*    - The handler will be instantiated when the env var is set to "true".
*
* @example
* ```typescript
* // Method 1: Using context variable
* import {
*   registerConfigureHook,
*   setContextVariable
* } from "@langchain/core/context";
*
* const tracer = new MyCallbackHandler();
* registerConfigureHook({
*   contextVar: "my_tracer",
* });
* setContextVariable("my_tracer", tracer);
*
* // ...run code here
*
* // Method 2: Using environment variable
* registerConfigureHook({
*   handlerClass: MyCallbackHandler,
*   envVar: "MY_TRACER_ENABLED",
* });
* process.env.MY_TRACER_ENABLED = "true";
*
* // ...run code here
* ```
*
* @param config Configuration object for the hook
* @param config.contextVar Name of the context variable containing the handler instance
* @param config.inheritable Whether child runs should inherit this handler
* @param config.handlerClass Optional callback handler class (required if using envVar)
* @param config.envVar Optional environment variable name to control handler activation
*/ const registerConfigureHook = (config)=>{
    if (config.envVar && !config.handlerClass) throw new Error("If envVar is set, handlerClass must also be set to a non-None value.");
    setContextVariable(LC_CONFIGURE_HOOKS_KEY, [
        ..._getConfigureHooks(),
        config
    ]);
};
//#endregion
exports._getConfigureHooks = _getConfigureHooks;
exports.getContextVariable = getContextVariable;
exports.registerConfigureHook = registerConfigureHook;
exports.setContextVariable = setContextVariable; //# sourceMappingURL=context.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/manager.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)");
const require_utils_env = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/env.cjs [app-route] (ecmascript)");
const require_callbacks_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/base.cjs [app-route] (ecmascript)");
const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
const require_tracers_console = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/console.cjs [app-route] (ecmascript)");
const require_tracers_tracer_langchain = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/tracer_langchain.cjs [app-route] (ecmascript)");
const require_callbacks = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/callbacks.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/promises.cjs [app-route] (ecmascript)");
const require_callbacks$1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/callbacks.cjs [app-route] (ecmascript)");
const require_context = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/context.cjs [app-route] (ecmascript)");
const uuid = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)"));
//#region src/callbacks/manager.ts
var manager_exports = {};
require_rolldown_runtime.__export(manager_exports, {
    BaseCallbackManager: ()=>BaseCallbackManager,
    BaseRunManager: ()=>BaseRunManager,
    CallbackManager: ()=>CallbackManager,
    CallbackManagerForChainRun: ()=>CallbackManagerForChainRun,
    CallbackManagerForLLMRun: ()=>CallbackManagerForLLMRun,
    CallbackManagerForRetrieverRun: ()=>CallbackManagerForRetrieverRun,
    CallbackManagerForToolRun: ()=>CallbackManagerForToolRun,
    ensureHandler: ()=>ensureHandler,
    parseCallbackConfigArg: ()=>parseCallbackConfigArg
});
function parseCallbackConfigArg(arg) {
    if (!arg) return {};
    else if (Array.isArray(arg) || "name" in arg) return {
        callbacks: arg
    };
    else return arg;
}
/**
* Manage callbacks from different components of LangChain.
*/ var BaseCallbackManager = class {
    setHandler(handler) {
        return this.setHandlers([
            handler
        ]);
    }
};
/**
* Base class for run manager in LangChain.
*/ var BaseRunManager = class {
    constructor(runId, handlers, inheritableHandlers, tags, inheritableTags, metadata, inheritableMetadata, _parentRunId){
        this.runId = runId;
        this.handlers = handlers;
        this.inheritableHandlers = inheritableHandlers;
        this.tags = tags;
        this.inheritableTags = inheritableTags;
        this.metadata = metadata;
        this.inheritableMetadata = inheritableMetadata;
        this._parentRunId = _parentRunId;
    }
    get parentRunId() {
        return this._parentRunId;
    }
    async handleText(text) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                try {
                    await handler.handleText?.(text, this.runId, this._parentRunId, this.tags);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleText: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    async handleCustomEvent(eventName, data, _runId, _tags, _metadata) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                try {
                    await handler.handleCustomEvent?.(eventName, data, this.runId, this.tags, this.metadata);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
};
/**
* Manages callbacks for retriever runs.
*/ var CallbackManagerForRetrieverRun = class extends BaseRunManager {
    getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) manager.addTags([
            tag
        ], false);
        return manager;
    }
    async handleRetrieverEnd(documents) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreRetriever) try {
                    await handler.handleRetrieverEnd?.(documents, this.runId, this._parentRunId, this.tags);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleRetriever`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    async handleRetrieverError(err) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreRetriever) try {
                    await handler.handleRetrieverError?.(err, this.runId, this._parentRunId, this.tags);
                } catch (error) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverError: ${error}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
};
var CallbackManagerForLLMRun = class extends BaseRunManager {
    async handleLLMNewToken(token, idx, _runId, _parentRunId, _tags, fields) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreLLM) try {
                    await handler.handleLLMNewToken?.(token, idx ?? {
                        prompt: 0,
                        completion: 0
                    }, this.runId, this._parentRunId, this.tags, fields);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleLLMNewToken: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    async handleLLMError(err, _runId, _parentRunId, _tags, extraParams) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreLLM) try {
                    await handler.handleLLMError?.(err, this.runId, this._parentRunId, this.tags, extraParams);
                } catch (err$1) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleLLMError: ${err$1}`);
                    if (handler.raiseError) throw err$1;
                }
            }, handler.awaitHandlers)));
    }
    async handleLLMEnd(output, _runId, _parentRunId, _tags, extraParams) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreLLM) try {
                    await handler.handleLLMEnd?.(output, this.runId, this._parentRunId, this.tags, extraParams);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleLLMEnd: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
};
var CallbackManagerForChainRun = class extends BaseRunManager {
    getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) manager.addTags([
            tag
        ], false);
        return manager;
    }
    async handleChainError(err, _runId, _parentRunId, _tags, kwargs) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreChain) try {
                    await handler.handleChainError?.(err, this.runId, this._parentRunId, this.tags, kwargs);
                } catch (err$1) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleChainError: ${err$1}`);
                    if (handler.raiseError) throw err$1;
                }
            }, handler.awaitHandlers)));
    }
    async handleChainEnd(output, _runId, _parentRunId, _tags, kwargs) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreChain) try {
                    await handler.handleChainEnd?.(output, this.runId, this._parentRunId, this.tags, kwargs);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleChainEnd: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    async handleAgentAction(action) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreAgent) try {
                    await handler.handleAgentAction?.(action, this.runId, this._parentRunId, this.tags);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleAgentAction: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    async handleAgentEnd(action) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreAgent) try {
                    await handler.handleAgentEnd?.(action, this.runId, this._parentRunId, this.tags);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleAgentEnd: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
};
var CallbackManagerForToolRun = class extends BaseRunManager {
    getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) manager.addTags([
            tag
        ], false);
        return manager;
    }
    async handleToolError(err) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreAgent) try {
                    await handler.handleToolError?.(err, this.runId, this._parentRunId, this.tags);
                } catch (err$1) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleToolError: ${err$1}`);
                    if (handler.raiseError) throw err$1;
                }
            }, handler.awaitHandlers)));
    }
    async handleToolEnd(output) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreAgent) try {
                    await handler.handleToolEnd?.(output, this.runId, this._parentRunId, this.tags);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleToolEnd: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
};
/**
* @example
* ```typescript
* const prompt = PromptTemplate.fromTemplate("What is the answer to {question}?");
*
* // Example of using LLMChain with OpenAI and a simple prompt
* const chain = new LLMChain({
*   llm: new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.9 }),
*   prompt,
* });
*
* // Running the chain with a single question
* const result = await chain.call({
*   question: "What is the airspeed velocity of an unladen swallow?",
* });
* console.log("The answer is:", result);
* ```
*/ var CallbackManager = class CallbackManager extends BaseCallbackManager {
    handlers = [];
    inheritableHandlers = [];
    tags = [];
    inheritableTags = [];
    metadata = {};
    inheritableMetadata = {};
    name = "callback_manager";
    _parentRunId;
    constructor(parentRunId, options){
        super();
        this.handlers = options?.handlers ?? this.handlers;
        this.inheritableHandlers = options?.inheritableHandlers ?? this.inheritableHandlers;
        this.tags = options?.tags ?? this.tags;
        this.inheritableTags = options?.inheritableTags ?? this.inheritableTags;
        this.metadata = options?.metadata ?? this.metadata;
        this.inheritableMetadata = options?.inheritableMetadata ?? this.inheritableMetadata;
        this._parentRunId = parentRunId;
    }
    /**
	* Gets the parent run ID, if any.
	*
	* @returns The parent run ID.
	*/ getParentRunId() {
        return this._parentRunId;
    }
    async handleLLMStart(llm, prompts, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        return Promise.all(prompts.map(async (prompt, idx)=>{
            const runId_ = idx === 0 && runId ? runId : (0, uuid.v7)();
            await Promise.all(this.handlers.map((handler)=>{
                if (handler.ignoreLLM) return;
                if (require_tracers_base.isBaseTracer(handler)) handler._createRunForLLMStart(llm, [
                    prompt
                ], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                return require_callbacks.consumeCallback(async ()=>{
                    try {
                        await handler.handleLLMStart?.(llm, [
                            prompt
                        ], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                    } catch (err) {
                        const logFunction = handler.raiseError ? console.error : console.warn;
                        logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                        if (handler.raiseError) throw err;
                    }
                }, handler.awaitHandlers);
            }));
            return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
        }));
    }
    async handleChatModelStart(llm, messages, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        return Promise.all(messages.map(async (messageGroup, idx)=>{
            const runId_ = idx === 0 && runId ? runId : (0, uuid.v7)();
            await Promise.all(this.handlers.map((handler)=>{
                if (handler.ignoreLLM) return;
                if (require_tracers_base.isBaseTracer(handler)) handler._createRunForChatModelStart(llm, [
                    messageGroup
                ], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                return require_callbacks.consumeCallback(async ()=>{
                    try {
                        if (handler.handleChatModelStart) await handler.handleChatModelStart?.(llm, [
                            messageGroup
                        ], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                        else if (handler.handleLLMStart) {
                            const messageString = require_utils.getBufferString(messageGroup);
                            await handler.handleLLMStart?.(llm, [
                                messageString
                            ], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                        }
                    } catch (err) {
                        const logFunction = handler.raiseError ? console.error : console.warn;
                        logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                        if (handler.raiseError) throw err;
                    }
                }, handler.awaitHandlers);
            }));
            return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
        }));
    }
    async handleChainStart(chain, inputs, runId = (0, uuid.v7)(), runType = void 0, _tags = void 0, _metadata = void 0, runName = void 0, _parentRunId = void 0, extra = void 0) {
        await Promise.all(this.handlers.map((handler)=>{
            if (handler.ignoreChain) return;
            if (require_tracers_base.isBaseTracer(handler)) handler._createRunForChainStart(chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName, extra);
            return require_callbacks.consumeCallback(async ()=>{
                try {
                    await handler.handleChainStart?.(chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName, extra);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleChainStart: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers);
        }));
        return new CallbackManagerForChainRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
    }
    async handleToolStart(tool, input, runId = (0, uuid.v7)(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        await Promise.all(this.handlers.map((handler)=>{
            if (handler.ignoreAgent) return;
            if (require_tracers_base.isBaseTracer(handler)) handler._createRunForToolStart(tool, input, runId, this._parentRunId, this.tags, this.metadata, runName);
            return require_callbacks.consumeCallback(async ()=>{
                try {
                    await handler.handleToolStart?.(tool, input, runId, this._parentRunId, this.tags, this.metadata, runName);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleToolStart: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers);
        }));
        return new CallbackManagerForToolRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
    }
    async handleRetrieverStart(retriever, query, runId = (0, uuid.v7)(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        await Promise.all(this.handlers.map((handler)=>{
            if (handler.ignoreRetriever) return;
            if (require_tracers_base.isBaseTracer(handler)) handler._createRunForRetrieverStart(retriever, query, runId, this._parentRunId, this.tags, this.metadata, runName);
            return require_callbacks.consumeCallback(async ()=>{
                try {
                    await handler.handleRetrieverStart?.(retriever, query, runId, this._parentRunId, this.tags, this.metadata, runName);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverStart: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers);
        }));
        return new CallbackManagerForRetrieverRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
    }
    async handleCustomEvent(eventName, data, runId, _tags, _metadata) {
        await Promise.all(this.handlers.map((handler)=>require_callbacks.consumeCallback(async ()=>{
                if (!handler.ignoreCustomEvent) try {
                    await handler.handleCustomEvent?.(eventName, data, runId, this.tags, this.metadata);
                } catch (err) {
                    const logFunction = handler.raiseError ? console.error : console.warn;
                    logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
                    if (handler.raiseError) throw err;
                }
            }, handler.awaitHandlers)));
    }
    addHandler(handler, inherit = true) {
        this.handlers.push(handler);
        if (inherit) this.inheritableHandlers.push(handler);
    }
    removeHandler(handler) {
        this.handlers = this.handlers.filter((_handler)=>_handler !== handler);
        this.inheritableHandlers = this.inheritableHandlers.filter((_handler)=>_handler !== handler);
    }
    setHandlers(handlers, inherit = true) {
        this.handlers = [];
        this.inheritableHandlers = [];
        for (const handler of handlers)this.addHandler(handler, inherit);
    }
    addTags(tags, inherit = true) {
        this.removeTags(tags);
        this.tags.push(...tags);
        if (inherit) this.inheritableTags.push(...tags);
    }
    removeTags(tags) {
        this.tags = this.tags.filter((tag)=>!tags.includes(tag));
        this.inheritableTags = this.inheritableTags.filter((tag)=>!tags.includes(tag));
    }
    addMetadata(metadata, inherit = true) {
        this.metadata = {
            ...this.metadata,
            ...metadata
        };
        if (inherit) this.inheritableMetadata = {
            ...this.inheritableMetadata,
            ...metadata
        };
    }
    removeMetadata(metadata) {
        for (const key of Object.keys(metadata)){
            delete this.metadata[key];
            delete this.inheritableMetadata[key];
        }
    }
    copy(additionalHandlers = [], inherit = true) {
        const manager = new CallbackManager(this._parentRunId);
        for (const handler of this.handlers){
            const inheritable = this.inheritableHandlers.includes(handler);
            manager.addHandler(handler, inheritable);
        }
        for (const tag of this.tags){
            const inheritable = this.inheritableTags.includes(tag);
            manager.addTags([
                tag
            ], inheritable);
        }
        for (const key of Object.keys(this.metadata)){
            const inheritable = Object.keys(this.inheritableMetadata).includes(key);
            manager.addMetadata({
                [key]: this.metadata[key]
            }, inheritable);
        }
        for (const handler of additionalHandlers){
            if (manager.handlers.filter((h)=>h.name === "console_callback_handler").some((h)=>h.name === handler.name)) continue;
            manager.addHandler(handler, inherit);
        }
        return manager;
    }
    static fromHandlers(handlers) {
        class Handler extends require_callbacks_base.BaseCallbackHandler {
            name = (0, uuid.v7)();
            constructor(){
                super();
                Object.assign(this, handlers);
            }
        }
        const manager = new this();
        manager.addHandler(new Handler());
        return manager;
    }
    static configure(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
        return this._configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options);
    }
    static _configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
        let callbackManager;
        if (inheritableHandlers || localHandlers) {
            if (Array.isArray(inheritableHandlers) || !inheritableHandlers) {
                callbackManager = new CallbackManager();
                callbackManager.setHandlers(inheritableHandlers?.map(ensureHandler) ?? [], true);
            } else callbackManager = inheritableHandlers;
            callbackManager = callbackManager.copy(Array.isArray(localHandlers) ? localHandlers.map(ensureHandler) : localHandlers?.handlers, false);
        }
        const verboseEnabled = require_utils_env.getEnvironmentVariable("LANGCHAIN_VERBOSE") === "true" || options?.verbose;
        const tracingV2Enabled = require_tracers_tracer_langchain.LangChainTracer.getTraceableRunTree()?.tracingEnabled ?? require_callbacks$1.isTracingEnabled();
        const tracingEnabled = tracingV2Enabled || (require_utils_env.getEnvironmentVariable("LANGCHAIN_TRACING") ?? false);
        if (verboseEnabled || tracingEnabled) {
            if (!callbackManager) callbackManager = new CallbackManager();
            if (verboseEnabled && !callbackManager.handlers.some((handler)=>handler.name === require_tracers_console.ConsoleCallbackHandler.prototype.name)) {
                const consoleHandler = new require_tracers_console.ConsoleCallbackHandler();
                callbackManager.addHandler(consoleHandler, true);
            }
            if (tracingEnabled && !callbackManager.handlers.some((handler)=>handler.name === "langchain_tracer")) {
                if (tracingV2Enabled) {
                    const tracerV2 = new require_tracers_tracer_langchain.LangChainTracer();
                    callbackManager.addHandler(tracerV2, true);
                }
            }
            if (tracingV2Enabled) {
                const implicitRunTree = require_tracers_tracer_langchain.LangChainTracer.getTraceableRunTree();
                if (implicitRunTree && callbackManager._parentRunId === void 0) {
                    callbackManager._parentRunId = implicitRunTree.id;
                    const tracerV2 = callbackManager.handlers.find((handler)=>handler.name === "langchain_tracer");
                    tracerV2?.updateFromRunTree(implicitRunTree);
                }
            }
        }
        for (const { contextVar, inheritable = true, handlerClass, envVar } of require_context._getConfigureHooks()){
            const createIfNotInContext = envVar && require_utils_env.getEnvironmentVariable(envVar) === "true" && handlerClass;
            let handler;
            const contextVarValue = contextVar !== void 0 ? require_context.getContextVariable(contextVar) : void 0;
            if (contextVarValue && require_callbacks_base.isBaseCallbackHandler(contextVarValue)) handler = contextVarValue;
            else if (createIfNotInContext) handler = new handlerClass({});
            if (handler !== void 0) {
                if (!callbackManager) callbackManager = new CallbackManager();
                if (!callbackManager.handlers.some((h)=>h.name === handler.name)) callbackManager.addHandler(handler, inheritable);
            }
        }
        if (inheritableTags || localTags) {
            if (callbackManager) {
                callbackManager.addTags(inheritableTags ?? []);
                callbackManager.addTags(localTags ?? [], false);
            }
        }
        if (inheritableMetadata || localMetadata) {
            if (callbackManager) {
                callbackManager.addMetadata(inheritableMetadata ?? {});
                callbackManager.addMetadata(localMetadata ?? {}, false);
            }
        }
        return callbackManager;
    }
};
function ensureHandler(handler) {
    if ("name" in handler) return handler;
    return require_callbacks_base.BaseCallbackHandler.fromMethods(handler);
}
//#endregion
exports.BaseCallbackManager = BaseCallbackManager;
exports.BaseRunManager = BaseRunManager;
exports.CallbackManager = CallbackManager;
exports.CallbackManagerForChainRun = CallbackManagerForChainRun;
exports.CallbackManagerForLLMRun = CallbackManagerForLLMRun;
exports.CallbackManagerForRetrieverRun = CallbackManagerForRetrieverRun;
exports.CallbackManagerForToolRun = CallbackManagerForToolRun;
exports.ensureHandler = ensureHandler;
Object.defineProperty(exports, 'manager_exports', {
    enumerable: true,
    get: function() {
        return manager_exports;
    }
});
exports.parseCallbackConfigArg = parseCallbackConfigArg; //# sourceMappingURL=manager.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_globals = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/globals.cjs [app-route] (ecmascript)");
const require_callbacks_manager = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/manager.cjs [app-route] (ecmascript)");
const langsmith = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/index.cjs [app-route] (ecmascript)"));
//#region src/singletons/async_local_storage/index.ts
var MockAsyncLocalStorage = class {
    getStore() {
        return void 0;
    }
    run(_store, callback) {
        return callback();
    }
    enterWith(_store) {
        return void 0;
    }
};
const mockAsyncLocalStorage = new MockAsyncLocalStorage();
const LC_CHILD_KEY = Symbol.for("lc:child_config");
var AsyncLocalStorageProvider = class {
    getInstance() {
        return require_globals.getGlobalAsyncLocalStorageInstance() ?? mockAsyncLocalStorage;
    }
    getRunnableConfig() {
        const storage = this.getInstance();
        return storage.getStore()?.extra?.[LC_CHILD_KEY];
    }
    runWithConfig(config, callback, avoidCreatingRootRunTree) {
        const callbackManager = require_callbacks_manager.CallbackManager._configureSync(config?.callbacks, void 0, config?.tags, void 0, config?.metadata);
        const storage = this.getInstance();
        const previousValue = storage.getStore();
        const parentRunId = callbackManager?.getParentRunId();
        const langChainTracer = callbackManager?.handlers?.find((handler)=>handler?.name === "langchain_tracer");
        let runTree;
        if (langChainTracer && parentRunId) runTree = langChainTracer.getRunTreeWithTracingConfig(parentRunId);
        else if (!avoidCreatingRootRunTree) runTree = new langsmith.RunTree({
            name: "<runnable_lambda>",
            tracingEnabled: false
        });
        if (runTree) runTree.extra = {
            ...runTree.extra,
            [LC_CHILD_KEY]: config
        };
        if (previousValue !== void 0 && previousValue[require_globals._CONTEXT_VARIABLES_KEY] !== void 0) {
            if (runTree === void 0) runTree = {};
            runTree[require_globals._CONTEXT_VARIABLES_KEY] = previousValue[require_globals._CONTEXT_VARIABLES_KEY];
        }
        return storage.run(runTree, callback);
    }
    initializeGlobalInstance(instance) {
        if (require_globals.getGlobalAsyncLocalStorageInstance() === void 0) require_globals.setGlobalAsyncLocalStorageInstance(instance);
    }
};
const AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider();
//#endregion
exports.AsyncLocalStorageProviderSingleton = AsyncLocalStorageProviderSingleton;
exports.MockAsyncLocalStorage = MockAsyncLocalStorage; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_globals = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/globals.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
//#region src/singletons/index.ts
var singletons_exports = {};
require_rolldown_runtime.__export(singletons_exports, {
    AsyncLocalStorageProviderSingleton: ()=>require_index.AsyncLocalStorageProviderSingleton,
    MockAsyncLocalStorage: ()=>require_index.MockAsyncLocalStorage,
    _CONTEXT_VARIABLES_KEY: ()=>require_globals._CONTEXT_VARIABLES_KEY
});
//#endregion
exports.AsyncLocalStorageProviderSingleton = require_index.AsyncLocalStorageProviderSingleton;
exports.MockAsyncLocalStorage = require_index.MockAsyncLocalStorage;
exports._CONTEXT_VARIABLES_KEY = require_globals._CONTEXT_VARIABLES_KEY;
Object.defineProperty(exports, 'singletons_exports', {
    enumerable: true,
    get: function() {
        return singletons_exports;
    }
}); //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/config.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_callbacks_manager = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/manager.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)");
//#region src/runnables/config.ts
const DEFAULT_RECURSION_LIMIT = 25;
async function getCallbackManagerForConfig(config) {
    return require_callbacks_manager.CallbackManager._configureSync(config?.callbacks, void 0, config?.tags, void 0, config?.metadata);
}
function mergeConfigs(...configs) {
    const copy = {};
    for (const options of configs.filter((c)=>!!c))for (const key of Object.keys(options))if (key === "metadata") copy[key] = {
        ...copy[key],
        ...options[key]
    };
    else if (key === "tags") {
        const baseKeys = copy[key] ?? [];
        copy[key] = [
            ...new Set(baseKeys.concat(options[key] ?? []))
        ];
    } else if (key === "configurable") copy[key] = {
        ...copy[key],
        ...options[key]
    };
    else if (key === "timeout") {
        if (copy.timeout === void 0) copy.timeout = options.timeout;
        else if (options.timeout !== void 0) copy.timeout = Math.min(copy.timeout, options.timeout);
    } else if (key === "signal") {
        if (copy.signal === void 0) copy.signal = options.signal;
        else if (options.signal !== void 0) if ("any" in AbortSignal) copy.signal = AbortSignal.any([
            copy.signal,
            options.signal
        ]);
        else copy.signal = options.signal;
    } else if (key === "callbacks") {
        const baseCallbacks = copy.callbacks;
        const providedCallbacks = options.callbacks;
        if (Array.isArray(providedCallbacks)) if (!baseCallbacks) copy.callbacks = providedCallbacks;
        else if (Array.isArray(baseCallbacks)) copy.callbacks = baseCallbacks.concat(providedCallbacks);
        else {
            const manager = baseCallbacks.copy();
            for (const callback of providedCallbacks)manager.addHandler(require_callbacks_manager.ensureHandler(callback), true);
            copy.callbacks = manager;
        }
        else if (providedCallbacks) if (!baseCallbacks) copy.callbacks = providedCallbacks;
        else if (Array.isArray(baseCallbacks)) {
            const manager = providedCallbacks.copy();
            for (const callback of baseCallbacks)manager.addHandler(require_callbacks_manager.ensureHandler(callback), true);
            copy.callbacks = manager;
        } else copy.callbacks = new require_callbacks_manager.CallbackManager(providedCallbacks._parentRunId, {
            handlers: baseCallbacks.handlers.concat(providedCallbacks.handlers),
            inheritableHandlers: baseCallbacks.inheritableHandlers.concat(providedCallbacks.inheritableHandlers),
            tags: Array.from(new Set(baseCallbacks.tags.concat(providedCallbacks.tags))),
            inheritableTags: Array.from(new Set(baseCallbacks.inheritableTags.concat(providedCallbacks.inheritableTags))),
            metadata: {
                ...baseCallbacks.metadata,
                ...providedCallbacks.metadata
            }
        });
    } else {
        const typedKey = key;
        copy[typedKey] = options[typedKey] ?? copy[typedKey];
    }
    return copy;
}
const PRIMITIVES = new Set([
    "string",
    "number",
    "boolean"
]);
/**
* Ensure that a passed config is an object with all required keys present.
*/ function ensureConfig(config) {
    const implicitConfig = require_index.AsyncLocalStorageProviderSingleton.getRunnableConfig();
    let empty = {
        tags: [],
        metadata: {},
        recursionLimit: 25,
        runId: void 0
    };
    if (implicitConfig) {
        const { runId, runName, ...rest } = implicitConfig;
        empty = Object.entries(rest).reduce((currentConfig, [key, value])=>{
            if (value !== void 0) currentConfig[key] = value;
            return currentConfig;
        }, empty);
    }
    if (config) empty = Object.entries(config).reduce((currentConfig, [key, value])=>{
        if (value !== void 0) currentConfig[key] = value;
        return currentConfig;
    }, empty);
    if (empty?.configurable) {
        for (const key of Object.keys(empty.configurable))if (PRIMITIVES.has(typeof empty.configurable[key]) && !empty.metadata?.[key]) {
            if (!empty.metadata) empty.metadata = {};
            empty.metadata[key] = empty.configurable[key];
        }
    }
    if (empty.timeout !== void 0) {
        if (empty.timeout <= 0) throw new Error("Timeout must be a positive number");
        const originalTimeoutMs = empty.timeout;
        const timeoutSignal = AbortSignal.timeout(originalTimeoutMs);
        if (!empty.metadata) empty.metadata = {};
        if (empty.metadata.timeoutMs === void 0) empty.metadata.timeoutMs = originalTimeoutMs;
        if (empty.signal !== void 0) {
            if ("any" in AbortSignal) empty.signal = AbortSignal.any([
                empty.signal,
                timeoutSignal
            ]);
        } else empty.signal = timeoutSignal;
        /**
		* We are deleting the timeout key for the following reasons:
		* - Idempotent normalization: ensureConfig may be called multiple times down the stack. If timeout remains,
		*   each call would synthesize new timeout signals and combine them, changing the effective timeout unpredictably.
		* - Single enforcement path: downstream code relies on signal to enforce cancellation. Leaving timeout means two
		*   competing mechanisms (numeric timeout and signal) can be applied, sometimes with different semantics.
		* - Propagation to children: pickRunnableConfigKeys would keep forwarding timeout to nested runnables, causing
		*   repeated re-normalization and stacked timeouts.
		* - Backward compatibility: a lot of components and tests assume ensureConfig removes timeout post-normalization;
		*   changing that would be a breaking change.
		*/ delete empty.timeout;
    }
    return empty;
}
/**
* Helper function that patches runnable configs with updated properties.
*/ function patchConfig(config = {}, { callbacks, maxConcurrency, recursionLimit, runName, configurable, runId } = {}) {
    const newConfig = ensureConfig(config);
    if (callbacks !== void 0) {
        /**
		* If we're replacing callbacks we need to unset runName
		* since that should apply only to the same run as the original callbacks
		*/ delete newConfig.runName;
        newConfig.callbacks = callbacks;
    }
    if (recursionLimit !== void 0) newConfig.recursionLimit = recursionLimit;
    if (maxConcurrency !== void 0) newConfig.maxConcurrency = maxConcurrency;
    if (runName !== void 0) newConfig.runName = runName;
    if (configurable !== void 0) newConfig.configurable = {
        ...newConfig.configurable,
        ...configurable
    };
    if (runId !== void 0) delete newConfig.runId;
    return newConfig;
}
function pickRunnableConfigKeys(config) {
    if (!config) return void 0;
    return {
        configurable: config.configurable,
        recursionLimit: config.recursionLimit,
        callbacks: config.callbacks,
        tags: config.tags,
        metadata: config.metadata,
        maxConcurrency: config.maxConcurrency,
        timeout: config.timeout,
        signal: config.signal,
        store: config.store
    };
}
//#endregion
exports.DEFAULT_RECURSION_LIMIT = DEFAULT_RECURSION_LIMIT;
exports.ensureConfig = ensureConfig;
exports.getCallbackManagerForConfig = getCallbackManagerForConfig;
exports.mergeConfigs = mergeConfigs;
exports.patchConfig = patchConfig;
exports.pickRunnableConfigKeys = pickRunnableConfigKeys; //# sourceMappingURL=config.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/signal.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/signal.ts
/**
* Race a promise with an abort signal. If the signal is aborted, the promise will
* be rejected with the error from the signal. If the promise is rejected, the signal will be aborted.
*
* @param promise - The promise to race.
* @param signal - The abort signal.
* @returns The result of the promise.
*/ async function raceWithSignal(promise, signal) {
    if (signal === void 0) return promise;
    let listener;
    return Promise.race([
        promise.catch((err)=>{
            if (!signal?.aborted) throw err;
            else return void 0;
        }),
        new Promise((_, reject)=>{
            listener = ()=>{
                reject(getAbortSignalError(signal));
            };
            signal.addEventListener("abort", listener, {
                once: true
            });
            if (signal.aborted) reject(getAbortSignalError(signal));
        })
    ]).finally(()=>signal.removeEventListener("abort", listener));
}
/**
* Get the error from an abort signal. Since you can set the reason to anything,
* we have to do some type gymnastics to get a proper error message.
*
* @param signal - The abort signal.
* @returns The error from the abort signal.
*/ function getAbortSignalError(signal) {
    if (signal?.reason instanceof Error) return signal.reason;
    if (typeof signal?.reason === "string") return new Error(signal.reason);
    return /* @__PURE__ */ new Error("Aborted");
}
//#endregion
exports.getAbortSignalError = getAbortSignalError;
exports.raceWithSignal = raceWithSignal; //# sourceMappingURL=signal.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/types/zod.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const zod_v4_core = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/core/index.cjs [app-route] (ecmascript)"));
//#region src/utils/types/zod.ts
function isZodSchemaV4(schema) {
    if (typeof schema !== "object" || schema === null) return false;
    const obj = schema;
    if (!("_zod" in obj)) return false;
    const zod = obj._zod;
    return typeof zod === "object" && zod !== null && "def" in zod;
}
function isZodSchemaV3(schema) {
    if (typeof schema !== "object" || schema === null) return false;
    const obj = schema;
    if (!("_def" in obj) || "_zod" in obj) return false;
    const def = obj._def;
    return typeof def === "object" && def != null && "typeName" in def;
}
/** Backward compatible isZodSchema for Zod 3 */ function isZodSchema(schema) {
    if (isZodSchemaV4(schema)) console.warn("[WARNING] Attempting to use Zod 4 schema in a context where Zod 3 schema is expected. This may cause unexpected behavior.");
    return isZodSchemaV3(schema);
}
/**
* Given either a Zod schema, or plain object, determine if the input is a Zod schema.
*
* @param {unknown} input
* @returns {boolean} Whether or not the provided input is a Zod schema.
*/ function isInteropZodSchema(input) {
    if (!input) return false;
    if (typeof input !== "object") return false;
    if (Array.isArray(input)) return false;
    if (isZodSchemaV4(input) || isZodSchemaV3(input)) return true;
    return false;
}
function isZodLiteralV3(obj) {
    if (typeof obj === "object" && obj !== null && "_def" in obj && typeof obj._def === "object" && obj._def !== null && "typeName" in obj._def && obj._def.typeName === "ZodLiteral") return true;
    return false;
}
function isZodLiteralV4(obj) {
    if (!isZodSchemaV4(obj)) return false;
    if (typeof obj === "object" && obj !== null && "_zod" in obj && typeof obj._zod === "object" && obj._zod !== null && "def" in obj._zod && typeof obj._zod.def === "object" && obj._zod.def !== null && "type" in obj._zod.def && obj._zod.def.type === "literal") return true;
    return false;
}
/**
* Determines if the provided value is an InteropZodLiteral (Zod v3 or v4 literal schema).
*
* @param obj The value to check.
* @returns {boolean} True if the value is a Zod v3 or v4 literal schema, false otherwise.
*/ function isInteropZodLiteral(obj) {
    if (isZodLiteralV3(obj)) return true;
    if (isZodLiteralV4(obj)) return true;
    return false;
}
/**
* Asynchronously parses the input using the provided Zod schema (v3 or v4) and returns a safe parse result.
* This function handles both Zod v3 and v4 schemas, returning a result object indicating success or failure.
*
* @template T - The expected output type of the schema.
* @param {InteropZodType<T>} schema - The Zod schema (v3 or v4) to use for parsing.
* @param {unknown} input - The input value to parse.
* @returns {Promise<InteropZodSafeParseResult<T>>} A promise that resolves to a safe parse result object.
* @throws {Error} If the schema is not a recognized Zod v3 or v4 schema.
*/ async function interopSafeParseAsync(schema, input) {
    if (isZodSchemaV4(schema)) try {
        const data = await (0, zod_v4_core.parseAsync)(schema, input);
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error
        };
    }
    if (isZodSchemaV3(schema)) return await schema.safeParseAsync(input);
    throw new Error("Schema must be an instance of z3.ZodType or z4.$ZodType");
}
/**
* Asynchronously parses the input using the provided Zod schema (v3 or v4) and returns the parsed value.
* Throws an error if parsing fails or if the schema is not a recognized Zod v3 or v4 schema.
*
* @template T - The expected output type of the schema.
* @param {InteropZodType<T>} schema - The Zod schema (v3 or v4) to use for parsing.
* @param {unknown} input - The input value to parse.
* @returns {Promise<T>} A promise that resolves to the parsed value.
* @throws {Error} If parsing fails or the schema is not a recognized Zod v3 or v4 schema.
*/ async function interopParseAsync(schema, input) {
    if (isZodSchemaV4(schema)) return await (0, zod_v4_core.parseAsync)(schema, input);
    if (isZodSchemaV3(schema)) return await schema.parseAsync(input);
    throw new Error("Schema must be an instance of z3.ZodType or z4.$ZodType");
}
/**
* Safely parses the input using the provided Zod schema (v3 or v4) and returns a result object
* indicating success or failure. This function is compatible with both Zod v3 and v4 schemas.
*
* @template T - The expected output type of the schema.
* @param {InteropZodType<T>} schema - The Zod schema (v3 or v4) to use for parsing.
* @param {unknown} input - The input value to parse.
* @returns {InteropZodSafeParseResult<T>} An object with either the parsed data (on success)
*   or the error (on failure).
* @throws {Error} If the schema is not a recognized Zod v3 or v4 schema.
*/ function interopSafeParse(schema, input) {
    if (isZodSchemaV4(schema)) try {
        const data = (0, zod_v4_core.parse)(schema, input);
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error
        };
    }
    if (isZodSchemaV3(schema)) return schema.safeParse(input);
    throw new Error("Schema must be an instance of z3.ZodType or z4.$ZodType");
}
/**
* Parses the input using the provided Zod schema (v3 or v4) and returns the parsed value.
* Throws an error if parsing fails or if the schema is not a recognized Zod v3 or v4 schema.
*
* @template T - The expected output type of the schema.
* @param {InteropZodType<T>} schema - The Zod schema (v3 or v4) to use for parsing.
* @param {unknown} input - The input value to parse.
* @returns {T} The parsed value.
* @throws {Error} If parsing fails or the schema is not a recognized Zod v3 or v4 schema.
*/ function interopParse(schema, input) {
    if (isZodSchemaV4(schema)) return (0, zod_v4_core.parse)(schema, input);
    if (isZodSchemaV3(schema)) return schema.parse(input);
    throw new Error("Schema must be an instance of z3.ZodType or z4.$ZodType");
}
/**
* Retrieves the description from a schema definition (v3, v4, or plain object), if available.
*
* @param {unknown} schema - The schema to extract the description from.
* @returns {string | undefined} The description of the schema, or undefined if not present.
*/ function getSchemaDescription(schema) {
    if (isZodSchemaV4(schema)) return zod_v4_core.globalRegistry.get(schema)?.description;
    if (isZodSchemaV3(schema)) return schema.description;
    if ("description" in schema && typeof schema.description === "string") return schema.description;
    return void 0;
}
/**
* Determines if the provided Zod schema is "shapeless".
* A shapeless schema is one that does not define any object shape,
* such as ZodString, ZodNumber, ZodBoolean, ZodAny, etc.
* For ZodObject, it must have no shape keys to be considered shapeless.
* ZodRecord schemas are considered shapeless since they define dynamic
* key-value mappings without fixed keys.
*
* @param schema The Zod schema to check.
* @returns {boolean} True if the schema is shapeless, false otherwise.
*/ function isShapelessZodSchema(schema) {
    if (!isInteropZodSchema(schema)) return false;
    if (isZodSchemaV3(schema)) {
        const def = schema._def;
        if (def.typeName === "ZodObject") {
            const obj = schema;
            return !obj.shape || Object.keys(obj.shape).length === 0;
        }
        if (def.typeName === "ZodRecord") return true;
    }
    if (isZodSchemaV4(schema)) {
        const def = schema._zod.def;
        if (def.type === "object") {
            const obj = schema;
            return !obj.shape || Object.keys(obj.shape).length === 0;
        }
        if (def.type === "record") return true;
    }
    if (typeof schema === "object" && schema !== null && !("shape" in schema)) return true;
    return false;
}
/**
* Determines if the provided Zod schema should be treated as a simple string schema
* that maps to DynamicTool. This aligns with the type-level constraint of
* InteropZodType<string | undefined> which only matches basic string schemas.
* If the provided schema is just z.string(), we can make the determination that
* the tool is just a generic string tool that doesn't require any input validation.
*
* This function only returns true for basic ZodString schemas, including:
* - Basic string schemas (z.string())
* - String schemas with validations (z.string().min(1), z.string().email(), etc.)
*
* This function returns false for everything else, including:
* - String schemas with defaults (z.string().default("value"))
* - Branded string schemas (z.string().brand<"UserId">())
* - String schemas with catch operations (z.string().catch("default"))
* - Optional/nullable string schemas (z.string().optional())
* - Transformed schemas (z.string().transform() or z.object().transform())
* - Object or record schemas, even if they're empty
* - Any other schema type
*
* @param schema The Zod schema to check.
* @returns {boolean} True if the schema is a basic ZodString, false otherwise.
*/ function isSimpleStringZodSchema(schema) {
    if (!isInteropZodSchema(schema)) return false;
    if (isZodSchemaV3(schema)) {
        const def = schema._def;
        return def.typeName === "ZodString";
    }
    if (isZodSchemaV4(schema)) {
        const def = schema._zod.def;
        return def.type === "string";
    }
    return false;
}
function isZodObjectV3(obj) {
    if (typeof obj === "object" && obj !== null && "_def" in obj && typeof obj._def === "object" && obj._def !== null && "typeName" in obj._def && obj._def.typeName === "ZodObject") return true;
    return false;
}
function isZodObjectV4(obj) {
    if (!isZodSchemaV4(obj)) return false;
    if (typeof obj === "object" && obj !== null && "_zod" in obj && typeof obj._zod === "object" && obj._zod !== null && "def" in obj._zod && typeof obj._zod.def === "object" && obj._zod.def !== null && "type" in obj._zod.def && obj._zod.def.type === "object") return true;
    return false;
}
function isZodArrayV4(obj) {
    if (!isZodSchemaV4(obj)) return false;
    if (typeof obj === "object" && obj !== null && "_zod" in obj && typeof obj._zod === "object" && obj._zod !== null && "def" in obj._zod && typeof obj._zod.def === "object" && obj._zod.def !== null && "type" in obj._zod.def && obj._zod.def.type === "array") return true;
    return false;
}
function isZodOptionalV4(obj) {
    if (!isZodSchemaV4(obj)) return false;
    if (typeof obj === "object" && obj !== null && "_zod" in obj && typeof obj._zod === "object" && obj._zod !== null && "def" in obj._zod && typeof obj._zod.def === "object" && obj._zod.def !== null && "type" in obj._zod.def && obj._zod.def.type === "optional") return true;
    return false;
}
function isZodNullableV4(obj) {
    if (!isZodSchemaV4(obj)) return false;
    if (typeof obj === "object" && obj !== null && "_zod" in obj && typeof obj._zod === "object" && obj._zod !== null && "def" in obj._zod && typeof obj._zod.def === "object" && obj._zod.def !== null && "type" in obj._zod.def && obj._zod.def.type === "nullable") return true;
    return false;
}
/**
* Determines if the provided value is an InteropZodObject (Zod v3 or v4 object schema).
*
* @param obj The value to check.
* @returns {boolean} True if the value is a Zod v3 or v4 object schema, false otherwise.
*/ function isInteropZodObject(obj) {
    if (isZodObjectV3(obj)) return true;
    if (isZodObjectV4(obj)) return true;
    return false;
}
/**
* Retrieves the shape (fields) of a Zod object schema, supporting both Zod v3 and v4.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @returns {InteropZodObjectShape<T>} The shape of the object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function getInteropZodObjectShape(schema) {
    if (isZodSchemaV3(schema)) return schema.shape;
    if (isZodSchemaV4(schema)) return schema._zod.def.shape;
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
/**
* Extends a Zod object schema with additional fields, supporting both Zod v3 and v4.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @param {InteropZodObjectShape} extension - The fields to add to the schema.
* @returns {InteropZodObject} The extended Zod object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function extendInteropZodObject(schema, extension) {
    if (isZodSchemaV3(schema)) return schema.extend(extension);
    if (isZodSchemaV4(schema)) return zod_v4_core.util.extend(schema, extension);
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
/**
* Returns a partial version of a Zod object schema, making all fields optional.
* Supports both Zod v3 and v4.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @returns {InteropZodObject} The partial Zod object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function interopZodObjectPartial(schema) {
    if (isZodSchemaV3(schema)) return schema.partial();
    if (isZodSchemaV4(schema)) return zod_v4_core.util.partial(zod_v4_core.$ZodOptional, schema, void 0);
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
/**
* Returns a strict version of a Zod object schema, disallowing unknown keys.
* Supports both Zod v3 and v4 object schemas. If `recursive` is true, applies strictness
* recursively to all nested object schemas and arrays of object schemas.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @param {boolean} [recursive=false] - Whether to apply strictness recursively to nested objects/arrays.
* @returns {InteropZodObject} The strict Zod object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function interopZodObjectStrict(schema, recursive = false) {
    if (isZodSchemaV3(schema)) return schema.strict();
    if (isZodObjectV4(schema)) {
        const outputShape = schema._zod.def.shape;
        if (recursive) for (const [key, keySchema] of Object.entries(schema._zod.def.shape)){
            if (isZodObjectV4(keySchema)) {
                const outputSchema = interopZodObjectStrict(keySchema, recursive);
                outputShape[key] = outputSchema;
            } else if (isZodArrayV4(keySchema)) {
                let elementSchema = keySchema._zod.def.element;
                if (isZodObjectV4(elementSchema)) elementSchema = interopZodObjectStrict(elementSchema, recursive);
                outputShape[key] = (0, zod_v4_core.clone)(keySchema, {
                    ...keySchema._zod.def,
                    element: elementSchema
                });
            } else outputShape[key] = keySchema;
            const meta$1 = zod_v4_core.globalRegistry.get(keySchema);
            if (meta$1) zod_v4_core.globalRegistry.add(outputShape[key], meta$1);
        }
        const modifiedSchema = (0, zod_v4_core.clone)(schema, {
            ...schema._zod.def,
            shape: outputShape,
            catchall: (0, zod_v4_core._never)(zod_v4_core.$ZodNever)
        });
        const meta = zod_v4_core.globalRegistry.get(schema);
        if (meta) zod_v4_core.globalRegistry.add(modifiedSchema, meta);
        return modifiedSchema;
    }
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
/**
* Returns a passthrough version of a Zod object schema, allowing unknown keys.
* Supports both Zod v3 and v4 object schemas. If `recursive` is true, applies passthrough
* recursively to all nested object schemas and arrays of object schemas.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @param {boolean} [recursive=false] - Whether to apply passthrough recursively to nested objects/arrays.
* @returns {InteropZodObject} The passthrough Zod object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function interopZodObjectPassthrough(schema, recursive = false) {
    if (isZodObjectV3(schema)) return schema.passthrough();
    if (isZodObjectV4(schema)) {
        const outputShape = schema._zod.def.shape;
        if (recursive) for (const [key, keySchema] of Object.entries(schema._zod.def.shape)){
            if (isZodObjectV4(keySchema)) {
                const outputSchema = interopZodObjectPassthrough(keySchema, recursive);
                outputShape[key] = outputSchema;
            } else if (isZodArrayV4(keySchema)) {
                let elementSchema = keySchema._zod.def.element;
                if (isZodObjectV4(elementSchema)) elementSchema = interopZodObjectPassthrough(elementSchema, recursive);
                outputShape[key] = (0, zod_v4_core.clone)(keySchema, {
                    ...keySchema._zod.def,
                    element: elementSchema
                });
            } else outputShape[key] = keySchema;
            const meta$1 = zod_v4_core.globalRegistry.get(keySchema);
            if (meta$1) zod_v4_core.globalRegistry.add(outputShape[key], meta$1);
        }
        const modifiedSchema = (0, zod_v4_core.clone)(schema, {
            ...schema._zod.def,
            shape: outputShape,
            catchall: (0, zod_v4_core._unknown)(zod_v4_core.$ZodUnknown)
        });
        const meta = zod_v4_core.globalRegistry.get(schema);
        if (meta) zod_v4_core.globalRegistry.add(modifiedSchema, meta);
        return modifiedSchema;
    }
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
/**
* Returns a getter function for the default value of a Zod schema, if one is defined.
* Supports both Zod v3 and v4 schemas. If the schema has a default value,
* the returned function will return that value when called. If no default is defined,
* returns undefined.
*
* @template T - The type of the Zod schema.
* @param {T} schema - The Zod schema instance (either v3 or v4).
* @returns {(() => InferInteropZodOutput<T>) | undefined} A function that returns the default value, or undefined if no default is set.
*/ function getInteropZodDefaultGetter(schema) {
    if (isZodSchemaV3(schema)) try {
        const defaultValue = schema.parse(void 0);
        return ()=>defaultValue;
    } catch  {
        return void 0;
    }
    if (isZodSchemaV4(schema)) try {
        const defaultValue = (0, zod_v4_core.parse)(schema, void 0);
        return ()=>defaultValue;
    } catch  {
        return void 0;
    }
    return void 0;
}
function isZodTransformV3(schema) {
    return isZodSchemaV3(schema) && "typeName" in schema._def && schema._def.typeName === "ZodEffects";
}
function isZodTransformV4(schema) {
    return isZodSchemaV4(schema) && schema._zod.def.type === "pipe";
}
function interopZodTransformInputSchemaImpl(schema, recursive, cache) {
    const cached = cache.get(schema);
    if (cached !== void 0) return cached;
    if (isZodSchemaV3(schema)) {
        if (isZodTransformV3(schema)) return interopZodTransformInputSchemaImpl(schema._def.schema, recursive, cache);
        return schema;
    }
    if (isZodSchemaV4(schema)) {
        let outputSchema = schema;
        if (isZodTransformV4(schema)) outputSchema = interopZodTransformInputSchemaImpl(schema._zod.def.in, recursive, cache);
        if (recursive) {
            if (isZodObjectV4(outputSchema)) {
                const outputShape = {};
                for (const [key, keySchema] of Object.entries(outputSchema._zod.def.shape))outputShape[key] = interopZodTransformInputSchemaImpl(keySchema, recursive, cache);
                outputSchema = (0, zod_v4_core.clone)(outputSchema, {
                    ...outputSchema._zod.def,
                    shape: outputShape
                });
            } else if (isZodArrayV4(outputSchema)) {
                const elementSchema = interopZodTransformInputSchemaImpl(outputSchema._zod.def.element, recursive, cache);
                outputSchema = (0, zod_v4_core.clone)(outputSchema, {
                    ...outputSchema._zod.def,
                    element: elementSchema
                });
            } else if (isZodOptionalV4(outputSchema)) {
                const innerSchema = interopZodTransformInputSchemaImpl(outputSchema._zod.def.innerType, recursive, cache);
                outputSchema = (0, zod_v4_core.clone)(outputSchema, {
                    ...outputSchema._zod.def,
                    innerType: innerSchema
                });
            } else if (isZodNullableV4(outputSchema)) {
                const innerSchema = interopZodTransformInputSchemaImpl(outputSchema._zod.def.innerType, recursive, cache);
                outputSchema = (0, zod_v4_core.clone)(outputSchema, {
                    ...outputSchema._zod.def,
                    innerType: innerSchema
                });
            }
        }
        const meta = zod_v4_core.globalRegistry.get(schema);
        if (meta) zod_v4_core.globalRegistry.add(outputSchema, meta);
        cache.set(schema, outputSchema);
        return outputSchema;
    }
    throw new Error("Schema must be an instance of z3.ZodType or z4.$ZodType");
}
/**
* Returns the input type of a Zod transform schema, for both v3 and v4.
* If the schema is not a transform, returns undefined. If `recursive` is true,
* recursively processes nested object schemas and arrays of object schemas.
*
* @param schema - The Zod schema instance (v3 or v4)
* @param {boolean} [recursive=false] - Whether to recursively process nested objects/arrays.
* @returns The input Zod schema of the transform, or undefined if not a transform
*/ function interopZodTransformInputSchema(schema, recursive = false) {
    const cache = /* @__PURE__ */ new WeakMap();
    return interopZodTransformInputSchemaImpl(schema, recursive, cache);
}
/**
* Creates a modified version of a Zod object schema where fields matching a predicate are made optional.
* Supports both Zod v3 and v4 schemas and preserves the original schema version.
*
* @template T - The type of the Zod object schema.
* @param {T} schema - The Zod object schema instance (either v3 or v4).
* @param {(key: string, value: InteropZodType) => boolean} predicate - Function to determine which fields should be optional.
* @returns {InteropZodObject} The modified Zod object schema.
* @throws {Error} If the schema is not a Zod v3 or v4 object.
*/ function interopZodObjectMakeFieldsOptional(schema, predicate) {
    if (isZodSchemaV3(schema)) {
        const shape = getInteropZodObjectShape(schema);
        const modifiedShape = {};
        for (const [key, value] of Object.entries(shape))if (predicate(key, value)) modifiedShape[key] = value.optional();
        else modifiedShape[key] = value;
        return schema.extend(modifiedShape);
    }
    if (isZodSchemaV4(schema)) {
        const shape = getInteropZodObjectShape(schema);
        const outputShape = {
            ...schema._zod.def.shape
        };
        for (const [key, value] of Object.entries(shape))if (predicate(key, value)) outputShape[key] = new zod_v4_core.$ZodOptional({
            type: "optional",
            innerType: value
        });
        const modifiedSchema = (0, zod_v4_core.clone)(schema, {
            ...schema._zod.def,
            shape: outputShape
        });
        const meta = zod_v4_core.globalRegistry.get(schema);
        if (meta) zod_v4_core.globalRegistry.add(modifiedSchema, meta);
        return modifiedSchema;
    }
    throw new Error("Schema must be an instance of z3.ZodObject or z4.$ZodObject");
}
function isInteropZodError(e) {
    return e instanceof Error && (e.constructor.name === "ZodError" || e.constructor.name === "$ZodError");
}
//#endregion
exports.extendInteropZodObject = extendInteropZodObject;
exports.getInteropZodDefaultGetter = getInteropZodDefaultGetter;
exports.getInteropZodObjectShape = getInteropZodObjectShape;
exports.getSchemaDescription = getSchemaDescription;
exports.interopParse = interopParse;
exports.interopParseAsync = interopParseAsync;
exports.interopSafeParse = interopSafeParse;
exports.interopSafeParseAsync = interopSafeParseAsync;
exports.interopZodObjectMakeFieldsOptional = interopZodObjectMakeFieldsOptional;
exports.interopZodObjectPartial = interopZodObjectPartial;
exports.interopZodObjectPassthrough = interopZodObjectPassthrough;
exports.interopZodObjectStrict = interopZodObjectStrict;
exports.interopZodTransformInputSchema = interopZodTransformInputSchema;
exports.isInteropZodError = isInteropZodError;
exports.isInteropZodLiteral = isInteropZodLiteral;
exports.isInteropZodObject = isInteropZodObject;
exports.isInteropZodSchema = isInteropZodSchema;
exports.isShapelessZodSchema = isShapelessZodSchema;
exports.isSimpleStringZodSchema = isSimpleStringZodSchema;
exports.isZodArrayV4 = isZodArrayV4;
exports.isZodLiteralV3 = isZodLiteralV3;
exports.isZodLiteralV4 = isZodLiteralV4;
exports.isZodNullableV4 = isZodNullableV4;
exports.isZodObjectV3 = isZodObjectV3;
exports.isZodObjectV4 = isZodObjectV4;
exports.isZodOptionalV4 = isZodOptionalV4;
exports.isZodSchema = isZodSchema;
exports.isZodSchemaV3 = isZodSchemaV3;
exports.isZodSchemaV4 = isZodSchemaV4; //# sourceMappingURL=zod.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Options.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/Options.ts
const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions = {
    name: void 0,
    $refStrategy: "root",
    basePath: [
        "#"
    ],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    allowedAdditionalProperties: true,
    rejectedAdditionalProperties: false,
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: false,
    definitions: {},
    errorMessages: false,
    markdownDescription: false,
    patternStrategy: "escape",
    applyRegexFlags: false,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref",
    openAiAnyTypeName: "OpenAiAnyType"
};
const getDefaultOptions = (options)=>typeof options === "string" ? {
        ...defaultOptions,
        name: options
    } : {
        ...defaultOptions,
        ...options
    };
//#endregion
exports.defaultOptions = defaultOptions;
exports.getDefaultOptions = getDefaultOptions;
exports.ignoreOverride = ignoreOverride; //# sourceMappingURL=Options.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Refs.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_Options = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Options.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/Refs.ts
const getRefs = (options)=>{
    const _options = require_Options.getDefaultOptions(options);
    const currentPath = _options.name !== void 0 ? [
        ..._options.basePath,
        _options.definitionPath,
        _options.name
    ] : _options.basePath;
    return {
        ..._options,
        flags: {
            hasReferencedOpenAiAnyType: false
        },
        currentPath,
        propertyPath: void 0,
        seen: new Map(Object.entries(_options.definitions).map(([name, def])=>[
                def._def,
                {
                    def: def._def,
                    path: [
                        ..._options.basePath,
                        _options.definitionPath,
                        name
                    ],
                    jsonSchema: void 0
                }
            ]))
    };
};
//#endregion
exports.getRefs = getRefs; //# sourceMappingURL=Refs.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/getRelativePath.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/getRelativePath.ts
const getRelativePath = (pathA, pathB)=>{
    let i = 0;
    for(; i < pathA.length && i < pathB.length; i++)if (pathA[i] !== pathB[i]) break;
    return [
        (pathA.length - i).toString(),
        ...pathB.slice(i)
    ].join("/");
};
//#endregion
exports.getRelativePath = getRelativePath; //# sourceMappingURL=getRelativePath.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_getRelativePath = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/getRelativePath.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/any.ts
function parseAnyDef(refs) {
    if (refs.target !== "openAi") return {};
    const anyDefinitionPath = [
        ...refs.basePath,
        refs.definitionPath,
        refs.openAiAnyTypeName
    ];
    refs.flags.hasReferencedOpenAiAnyType = true;
    return {
        $ref: refs.$refStrategy === "relative" ? require_getRelativePath.getRelativePath(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/")
    };
}
//#endregion
exports.parseAnyDef = parseAnyDef; //# sourceMappingURL=any.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/errorMessages.ts
function addErrorMessage(res, key, errorMessage, refs) {
    if (!refs?.errorMessages) return;
    if (errorMessage) res.errorMessage = {
        ...res.errorMessage,
        [key]: errorMessage
    };
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
    res[key] = value;
    addErrorMessage(res, key, errorMessage, refs);
}
//#endregion
exports.addErrorMessage = addErrorMessage;
exports.setResponseValueAndErrors = setResponseValueAndErrors; //# sourceMappingURL=errorMessages.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/array.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
const zod_v3 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)"));
//#region src/utils/zod-to-json-schema/parsers/array.ts
function parseArrayDef(def, refs) {
    const res = {
        type: "array"
    };
    if (def.type?._def && def.type?._def?.typeName !== zod_v3.ZodFirstPartyTypeKind.ZodAny) res.items = require_parseDef.parseDef(def.type._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items"
        ]
    });
    if (def.minLength) require_errorMessages.setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
    if (def.maxLength) require_errorMessages.setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
    if (def.exactLength) {
        require_errorMessages.setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
        require_errorMessages.setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
    }
    return res;
}
//#endregion
exports.parseArrayDef = parseArrayDef; //# sourceMappingURL=array.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/bigint.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/bigint.ts
function parseBigintDef(def, refs) {
    const res = {
        type: "integer",
        format: "int64"
    };
    if (!def.checks) return res;
    for (const check of def.checks)switch(check.kind){
        case "min":
            if (refs.target === "jsonSchema7") if (check.inclusive) require_errorMessages.setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
            else require_errorMessages.setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
            else {
                if (!check.inclusive) res.exclusiveMinimum = true;
                require_errorMessages.setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
            }
            break;
        case "max":
            if (refs.target === "jsonSchema7") if (check.inclusive) require_errorMessages.setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
            else require_errorMessages.setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
            else {
                if (!check.inclusive) res.exclusiveMaximum = true;
                require_errorMessages.setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
            }
            break;
        case "multipleOf":
            require_errorMessages.setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
            break;
    }
    return res;
}
//#endregion
exports.parseBigintDef = parseBigintDef; //# sourceMappingURL=bigint.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/boolean.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/parsers/boolean.ts
function parseBooleanDef() {
    return {
        type: "boolean"
    };
}
//#endregion
exports.parseBooleanDef = parseBooleanDef; //# sourceMappingURL=boolean.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/branded.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/branded.ts
function parseBrandedDef(_def, refs) {
    return require_parseDef.parseDef(_def.type._def, refs);
}
//#endregion
exports.parseBrandedDef = parseBrandedDef; //# sourceMappingURL=branded.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/catch.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/catch.ts
const parseCatchDef = (def, refs)=>{
    return require_parseDef.parseDef(def.innerType._def, refs);
};
//#endregion
exports.parseCatchDef = parseCatchDef; //# sourceMappingURL=catch.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/date.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/date.ts
function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy ?? refs.dateStrategy;
    if (Array.isArray(strategy)) return {
        anyOf: strategy.map((item)=>parseDateDef(def, refs, item))
    };
    switch(strategy){
        case "string":
        case "format:date-time":
            return {
                type: "string",
                format: "date-time"
            };
        case "format:date":
            return {
                type: "string",
                format: "date"
            };
        case "integer":
            return integerDateParser(def, refs);
    }
}
const integerDateParser = (def, refs)=>{
    const res = {
        type: "integer",
        format: "unix-time"
    };
    if (refs.target === "openApi3") return res;
    for (const check of def.checks)switch(check.kind){
        case "min":
            require_errorMessages.setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
            break;
        case "max":
            require_errorMessages.setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
            break;
    }
    return res;
};
//#endregion
exports.parseDateDef = parseDateDef; //# sourceMappingURL=date.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/default.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/default.ts
function parseDefaultDef(_def, refs) {
    return {
        ...require_parseDef.parseDef(_def.innerType._def, refs),
        default: _def.defaultValue()
    };
}
//#endregion
exports.parseDefaultDef = parseDefaultDef; //# sourceMappingURL=default.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/effects.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/effects.ts
function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input" ? require_parseDef.parseDef(_def.schema._def, refs) : require_any.parseAnyDef(refs);
}
//#endregion
exports.parseEffectsDef = parseEffectsDef; //# sourceMappingURL=effects.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/enum.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/parsers/enum.ts
function parseEnumDef(def) {
    return {
        type: "string",
        enum: Array.from(def.values)
    };
}
//#endregion
exports.parseEnumDef = parseEnumDef; //# sourceMappingURL=enum.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/intersection.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/intersection.ts
const isJsonSchema7AllOfType = (type)=>{
    if ("type" in type && type.type === "string") return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        require_parseDef.parseDef(def.left._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "allOf",
                "0"
            ]
        }),
        require_parseDef.parseDef(def.right._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "allOf",
                "1"
            ]
        })
    ].filter((x)=>!!x);
    let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? {
        unevaluatedProperties: false
    } : void 0;
    const mergedAllOf = [];
    allOf.forEach((schema)=>{
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
            if (schema.unevaluatedProperties === void 0) unevaluatedProperties = void 0;
        } else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema && schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            } else unevaluatedProperties = void 0;
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length ? {
        allOf: mergedAllOf,
        ...unevaluatedProperties
    } : void 0;
}
//#endregion
exports.parseIntersectionDef = parseIntersectionDef; //# sourceMappingURL=intersection.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/literal.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/parsers/literal.ts
function parseLiteralDef(def, refs) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") return {
        type: Array.isArray(def.value) ? "array" : "object"
    };
    if (refs.target === "openApi3") return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        enum: [
            def.value
        ]
    };
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value
    };
}
//#endregion
exports.parseLiteralDef = parseLiteralDef; //# sourceMappingURL=literal.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/string.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/string.ts
let emojiRegex = void 0;
/**
* Generated from the regular expressions found here as of 2024-05-22:
* https://github.com/colinhacks/zod/blob/master/src/types.ts.
*
* Expressions with /i flag have been changed accordingly.
*/ const zodPatterns = {
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    emoji: ()=>{
        if (emojiRegex === void 0) emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        return emojiRegex;
    },
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
    const res = {
        type: "string"
    };
    if (def.checks) for (const check of def.checks)switch(check.kind){
        case "min":
            require_errorMessages.setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
            break;
        case "max":
            require_errorMessages.setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
            break;
        case "email":
            switch(refs.emailStrategy){
                case "format:email":
                    addFormat(res, "email", check.message, refs);
                    break;
                case "format:idn-email":
                    addFormat(res, "idn-email", check.message, refs);
                    break;
                case "pattern:zod":
                    addPattern(res, zodPatterns.email, check.message, refs);
                    break;
            }
            break;
        case "url":
            addFormat(res, "uri", check.message, refs);
            break;
        case "uuid":
            addFormat(res, "uuid", check.message, refs);
            break;
        case "regex":
            addPattern(res, check.regex, check.message, refs);
            break;
        case "cuid":
            addPattern(res, zodPatterns.cuid, check.message, refs);
            break;
        case "cuid2":
            addPattern(res, zodPatterns.cuid2, check.message, refs);
            break;
        case "startsWith":
            addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
            break;
        case "endsWith":
            addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
            break;
        case "datetime":
            addFormat(res, "date-time", check.message, refs);
            break;
        case "date":
            addFormat(res, "date", check.message, refs);
            break;
        case "time":
            addFormat(res, "time", check.message, refs);
            break;
        case "duration":
            addFormat(res, "duration", check.message, refs);
            break;
        case "length":
            require_errorMessages.setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
            require_errorMessages.setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
            break;
        case "includes":
            addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
            break;
        case "ip":
            if (check.version !== "v6") addFormat(res, "ipv4", check.message, refs);
            if (check.version !== "v4") addFormat(res, "ipv6", check.message, refs);
            break;
        case "base64url":
            addPattern(res, zodPatterns.base64url, check.message, refs);
            break;
        case "jwt":
            addPattern(res, zodPatterns.jwt, check.message, refs);
            break;
        case "cidr":
            if (check.version !== "v6") addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
            if (check.version !== "v4") addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
            break;
        case "emoji":
            addPattern(res, zodPatterns.emoji(), check.message, refs);
            break;
        case "ulid":
            addPattern(res, zodPatterns.ulid, check.message, refs);
            break;
        case "base64":
            switch(refs.base64Strategy){
                case "format:binary":
                    addFormat(res, "binary", check.message, refs);
                    break;
                case "contentEncoding:base64":
                    require_errorMessages.setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
                    break;
                case "pattern:zod":
                    addPattern(res, zodPatterns.base64, check.message, refs);
                    break;
            }
            break;
        case "nanoid":
            addPattern(res, zodPatterns.nanoid, check.message, refs);
            break;
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
            break;
        default:
            /* c8 ignore next */ ((_)=>{})(check);
    }
    return res;
}
function escapeLiteralCheckValue(literal, refs) {
    return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
const ALPHA_NUMERIC = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
    let result = "";
    for(let i = 0; i < source.length; i++){
        if (!ALPHA_NUMERIC.has(source[i])) result += "\\";
        result += source[i];
    }
    return result;
}
function addFormat(schema, value, message, refs) {
    if (schema.format || schema.anyOf?.some((x)=>x.format)) {
        if (!schema.anyOf) schema.anyOf = [];
        if (schema.format) {
            schema.anyOf.push({
                format: schema.format,
                ...schema.errorMessage && refs.errorMessages && {
                    errorMessage: {
                        format: schema.errorMessage.format
                    }
                }
            });
            delete schema.format;
            if (schema.errorMessage) {
                delete schema.errorMessage.format;
                if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
            }
        }
        schema.anyOf.push({
            format: value,
            ...message && refs.errorMessages && {
                errorMessage: {
                    format: message
                }
            }
        });
    } else require_errorMessages.setResponseValueAndErrors(schema, "format", value, message, refs);
}
function addPattern(schema, regex, message, refs) {
    if (schema.pattern || schema.allOf?.some((x)=>x.pattern)) {
        if (!schema.allOf) schema.allOf = [];
        if (schema.pattern) {
            schema.allOf.push({
                pattern: schema.pattern,
                ...schema.errorMessage && refs.errorMessages && {
                    errorMessage: {
                        pattern: schema.errorMessage.pattern
                    }
                }
            });
            delete schema.pattern;
            if (schema.errorMessage) {
                delete schema.errorMessage.pattern;
                if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
            }
        }
        schema.allOf.push({
            pattern: stringifyRegExpWithFlags(regex, refs),
            ...message && refs.errorMessages && {
                errorMessage: {
                    pattern: message
                }
            }
        });
    } else require_errorMessages.setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
}
function stringifyRegExpWithFlags(regex, refs) {
    if (!refs.applyRegexFlags || !regex.flags) return regex.source;
    const flags = {
        i: regex.flags.includes("i"),
        m: regex.flags.includes("m"),
        s: regex.flags.includes("s")
    };
    const source = flags.i ? regex.source.toLowerCase() : regex.source;
    let pattern = "";
    let isEscaped = false;
    let inCharGroup = false;
    let inCharRange = false;
    for(let i = 0; i < source.length; i++){
        if (isEscaped) {
            pattern += source[i];
            isEscaped = false;
            continue;
        }
        if (flags.i) {
            if (inCharGroup) {
                if (source[i].match(/[a-z]/)) {
                    if (inCharRange) {
                        pattern += source[i];
                        pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
                        inCharRange = false;
                    } else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
                        pattern += source[i];
                        inCharRange = true;
                    } else pattern += `${source[i]}${source[i].toUpperCase()}`;
                    continue;
                }
            } else if (source[i].match(/[a-z]/)) {
                pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                continue;
            }
        }
        if (flags.m) {
            if (source[i] === "^") {
                pattern += `(^|(?<=[\r\n]))`;
                continue;
            } else if (source[i] === "$") {
                pattern += `($|(?=[\r\n]))`;
                continue;
            }
        }
        if (flags.s && source[i] === ".") {
            pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
            continue;
        }
        pattern += source[i];
        if (source[i] === "\\") isEscaped = true;
        else if (inCharGroup && source[i] === "]") inCharGroup = false;
        else if (!inCharGroup && source[i] === "[") inCharGroup = true;
    }
    try {
        new RegExp(pattern);
    } catch  {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
}
//#endregion
exports.parseStringDef = parseStringDef;
exports.zodPatterns = zodPatterns; //# sourceMappingURL=string.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/record.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_branded = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/branded.cjs [app-route] (ecmascript)");
const require_string = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/string.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
const zod_v3 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)"));
//#region src/utils/zod-to-json-schema/parsers/record.ts
function parseRecordDef(def, refs) {
    if (refs.target === "openAi") console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
    if (refs.target === "openApi3" && def.keyType?._def.typeName === zod_v3.ZodFirstPartyTypeKind.ZodEnum) return {
        type: "object",
        required: def.keyType._def.values,
        properties: def.keyType._def.values.reduce((acc, key)=>({
                ...acc,
                [key]: require_parseDef.parseDef(def.valueType._def, {
                    ...refs,
                    currentPath: [
                        ...refs.currentPath,
                        "properties",
                        key
                    ]
                }) ?? require_any.parseAnyDef(refs)
            }), {}),
        additionalProperties: refs.rejectedAdditionalProperties
    };
    const schema = {
        type: "object",
        additionalProperties: require_parseDef.parseDef(def.valueType._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalProperties"
            ]
        }) ?? refs.allowedAdditionalProperties
    };
    if (refs.target === "openApi3") return schema;
    if (def.keyType?._def.typeName === zod_v3.ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
        const { type, ...keyType } = require_string.parseStringDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    } else if (def.keyType?._def.typeName === zod_v3.ZodFirstPartyTypeKind.ZodEnum) return {
        ...schema,
        propertyNames: {
            enum: def.keyType._def.values
        }
    };
    else if (def.keyType?._def.typeName === zod_v3.ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === zod_v3.ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
        const { type, ...keyType } = require_branded.parseBrandedDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    }
    return schema;
}
//#endregion
exports.parseRecordDef = parseRecordDef; //# sourceMappingURL=record.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/map.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_record = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/record.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/map.ts
function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") return require_record.parseRecordDef(def, refs);
    const keys = require_parseDef.parseDef(def.keyType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "0"
        ]
    }) || require_any.parseAnyDef(refs);
    const values = require_parseDef.parseDef(def.valueType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "1"
        ]
    }) || require_any.parseAnyDef(refs);
    return {
        type: "array",
        maxItems: 125,
        items: {
            type: "array",
            items: [
                keys,
                values
            ],
            minItems: 2,
            maxItems: 2
        }
    };
}
//#endregion
exports.parseMapDef = parseMapDef; //# sourceMappingURL=map.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nativeEnum.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/parsers/nativeEnum.ts
function parseNativeEnumDef(def) {
    const object = def.values;
    const actualKeys = Object.keys(def.values).filter((key)=>{
        return typeof object[object[key]] !== "number";
    });
    const actualValues = actualKeys.map((key)=>object[key]);
    const parsedTypes = Array.from(new Set(actualValues.map((values)=>typeof values)));
    return {
        type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : [
            "string",
            "number"
        ],
        enum: actualValues
    };
}
//#endregion
exports.parseNativeEnumDef = parseNativeEnumDef; //# sourceMappingURL=nativeEnum.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/never.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/never.ts
function parseNeverDef(refs) {
    return refs.target === "openAi" ? void 0 : {
        not: require_any.parseAnyDef({
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "not"
            ]
        })
    };
}
//#endregion
exports.parseNeverDef = parseNeverDef; //# sourceMappingURL=never.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/null.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/zod-to-json-schema/parsers/null.ts
function parseNullDef(refs) {
    return refs.target === "openApi3" ? {
        enum: [
            "null"
        ],
        nullable: true
    } : {
        type: "null"
    };
}
//#endregion
exports.parseNullDef = parseNullDef; //# sourceMappingURL=null.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/union.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/union.ts
const primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null"
};
function parseUnionDef(def, refs) {
    if (refs.target === "openApi3") return asAnyOf(def, refs);
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    if (options.every((x)=>x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
        const types = options.reduce((types$1, x)=>{
            const type = primitiveMappings[x._def.typeName];
            return type && !types$1.includes(type) ? [
                ...types$1,
                type
            ] : types$1;
        }, []);
        return {
            type: types.length > 1 ? types : types[0]
        };
    } else if (options.every((x)=>x._def.typeName === "ZodLiteral" && !x.description)) {
        const types = options.reduce((acc, x)=>{
            const type = typeof x._def.value;
            switch(type){
                case "string":
                case "number":
                case "boolean":
                    return [
                        ...acc,
                        type
                    ];
                case "bigint":
                    return [
                        ...acc,
                        "integer"
                    ];
                case "object":
                    if (x._def.value === null) return [
                        ...acc,
                        "null"
                    ];
                    return acc;
                case "symbol":
                case "undefined":
                case "function":
                default:
                    return acc;
            }
        }, []);
        if (types.length === options.length) {
            const uniqueTypes = types.filter((x, i, a)=>a.indexOf(x) === i);
            return {
                type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
                enum: options.reduce((acc, x)=>{
                    return acc.includes(x._def.value) ? acc : [
                        ...acc,
                        x._def.value
                    ];
                }, [])
            };
        }
    } else if (options.every((x)=>x._def.typeName === "ZodEnum")) return {
        type: "string",
        enum: options.reduce((acc, x)=>[
                ...acc,
                ...x._def.values.filter((x$1)=>!acc.includes(x$1))
            ], [])
    };
    return asAnyOf(def, refs);
}
const asAnyOf = (def, refs)=>{
    const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i)=>require_parseDef.parseDef(x._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "anyOf",
                `${i}`
            ]
        })).filter((x)=>!!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
    return anyOf.length ? {
        anyOf
    } : void 0;
};
//#endregion
exports.parseUnionDef = parseUnionDef;
exports.primitiveMappings = primitiveMappings; //# sourceMappingURL=union.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nullable.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_union = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/union.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/nullable.ts
function parseNullableDef(def, refs) {
    if ([
        "ZodString",
        "ZodNumber",
        "ZodBigInt",
        "ZodBoolean",
        "ZodNull"
    ].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        if (refs.target === "openApi3") return {
            type: require_union.primitiveMappings[def.innerType._def.typeName],
            nullable: true
        };
        return {
            type: [
                require_union.primitiveMappings[def.innerType._def.typeName],
                "null"
            ]
        };
    }
    if (refs.target === "openApi3") {
        const base$1 = require_parseDef.parseDef(def.innerType._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath
            ]
        });
        if (base$1 && "$ref" in base$1) return {
            allOf: [
                base$1
            ],
            nullable: true
        };
        return base$1 && {
            ...base$1,
            nullable: true
        };
    }
    const base = require_parseDef.parseDef(def.innerType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "anyOf",
            "0"
        ]
    });
    return base && {
        anyOf: [
            base,
            {
                type: "null"
            }
        ]
    };
}
//#endregion
exports.parseNullableDef = parseNullableDef; //# sourceMappingURL=nullable.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/number.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/number.ts
function parseNumberDef(def, refs) {
    const res = {
        type: "number"
    };
    if (!def.checks) return res;
    for (const check of def.checks)switch(check.kind){
        case "int":
            res.type = "integer";
            require_errorMessages.addErrorMessage(res, "type", check.message, refs);
            break;
        case "min":
            if (refs.target === "jsonSchema7") if (check.inclusive) require_errorMessages.setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
            else require_errorMessages.setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
            else {
                if (!check.inclusive) res.exclusiveMinimum = true;
                require_errorMessages.setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
            }
            break;
        case "max":
            if (refs.target === "jsonSchema7") if (check.inclusive) require_errorMessages.setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
            else require_errorMessages.setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
            else {
                if (!check.inclusive) res.exclusiveMaximum = true;
                require_errorMessages.setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
            }
            break;
        case "multipleOf":
            require_errorMessages.setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
            break;
    }
    return res;
}
//#endregion
exports.parseNumberDef = parseNumberDef; //# sourceMappingURL=number.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/object.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/object.ts
function parseObjectDef(def, refs) {
    const forceOptionalIntoNullable = refs.target === "openAi";
    const result = {
        type: "object",
        properties: {}
    };
    const required = [];
    const shape = def.shape();
    for(const propName in shape){
        let propDef = shape[propName];
        if (propDef === void 0 || propDef._def === void 0) continue;
        let propOptional = safeIsOptional(propDef);
        if (propOptional && forceOptionalIntoNullable) {
            if (propDef._def.typeName === "ZodOptional") propDef = propDef._def.innerType;
            if (!propDef.isNullable()) propDef = propDef.nullable();
            propOptional = false;
        }
        const parsedDef = require_parseDef.parseDef(propDef._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "properties",
                propName
            ],
            propertyPath: [
                ...refs.currentPath,
                "properties",
                propName
            ]
        });
        if (parsedDef === void 0) continue;
        result.properties[propName] = parsedDef;
        if (!propOptional) required.push(propName);
    }
    if (required.length) result.required = required;
    const additionalProperties = decideAdditionalProperties(def, refs);
    if (additionalProperties !== void 0) result.additionalProperties = additionalProperties;
    return result;
}
function decideAdditionalProperties(def, refs) {
    if (def.catchall._def.typeName !== "ZodNever") return require_parseDef.parseDef(def.catchall._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "additionalProperties"
        ]
    });
    switch(def.unknownKeys){
        case "passthrough":
            return refs.allowedAdditionalProperties;
        case "strict":
            return refs.rejectedAdditionalProperties;
        case "strip":
            return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
    }
}
function safeIsOptional(schema) {
    try {
        return schema.isOptional();
    } catch  {
        return true;
    }
}
//#endregion
exports.parseObjectDef = parseObjectDef; //# sourceMappingURL=object.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/optional.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/optional.ts
const parseOptionalDef = (def, refs)=>{
    if (refs.currentPath.toString() === refs.propertyPath?.toString()) return require_parseDef.parseDef(def.innerType._def, refs);
    const innerSchema = require_parseDef.parseDef(def.innerType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "anyOf",
            "1"
        ]
    });
    return innerSchema ? {
        anyOf: [
            {
                not: require_any.parseAnyDef(refs)
            },
            innerSchema
        ]
    } : require_any.parseAnyDef(refs);
};
//#endregion
exports.parseOptionalDef = parseOptionalDef; //# sourceMappingURL=optional.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/pipeline.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/pipeline.ts
const parsePipelineDef = (def, refs)=>{
    if (refs.pipeStrategy === "input") return require_parseDef.parseDef(def.in._def, refs);
    else if (refs.pipeStrategy === "output") return require_parseDef.parseDef(def.out._def, refs);
    const a = require_parseDef.parseDef(def.in._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "allOf",
            "0"
        ]
    });
    const b = require_parseDef.parseDef(def.out._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "allOf",
            a ? "1" : "0"
        ]
    });
    return {
        allOf: [
            a,
            b
        ].filter((x)=>x !== void 0)
    };
};
//#endregion
exports.parsePipelineDef = parsePipelineDef; //# sourceMappingURL=pipeline.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/promise.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/promise.ts
function parsePromiseDef(def, refs) {
    return require_parseDef.parseDef(def.type._def, refs);
}
//#endregion
exports.parsePromiseDef = parsePromiseDef; //# sourceMappingURL=promise.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/set.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/set.ts
function parseSetDef(def, refs) {
    const items = require_parseDef.parseDef(def.valueType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items"
        ]
    });
    const schema = {
        type: "array",
        uniqueItems: true,
        items
    };
    if (def.minSize) require_errorMessages.setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
    if (def.maxSize) require_errorMessages.setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
    return schema;
}
//#endregion
exports.parseSetDef = parseSetDef; //# sourceMappingURL=set.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/tuple.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/tuple.ts
function parseTupleDef(def, refs) {
    if (def.rest) return {
        type: "array",
        minItems: def.items.length,
        items: def.items.map((x, i)=>require_parseDef.parseDef(x._def, {
                ...refs,
                currentPath: [
                    ...refs.currentPath,
                    "items",
                    `${i}`
                ]
            })).reduce((acc, x)=>x === void 0 ? acc : [
                ...acc,
                x
            ], []),
        additionalItems: require_parseDef.parseDef(def.rest._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalItems"
            ]
        })
    };
    else return {
        type: "array",
        minItems: def.items.length,
        maxItems: def.items.length,
        items: def.items.map((x, i)=>require_parseDef.parseDef(x._def, {
                ...refs,
                currentPath: [
                    ...refs.currentPath,
                    "items",
                    `${i}`
                ]
            })).reduce((acc, x)=>x === void 0 ? acc : [
                ...acc,
                x
            ], [])
    };
}
//#endregion
exports.parseTupleDef = parseTupleDef; //# sourceMappingURL=tuple.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/undefined.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/undefined.ts
function parseUndefinedDef(refs) {
    return {
        not: require_any.parseAnyDef(refs)
    };
}
//#endregion
exports.parseUndefinedDef = parseUndefinedDef; //# sourceMappingURL=undefined.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/unknown.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/unknown.ts
function parseUnknownDef(refs) {
    return require_any.parseAnyDef(refs);
}
//#endregion
exports.parseUnknownDef = parseUnknownDef; //# sourceMappingURL=unknown.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/readonly.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parsers/readonly.ts
const parseReadonlyDef = (def, refs)=>{
    return require_parseDef.parseDef(def.innerType._def, refs);
};
//#endregion
exports.parseReadonlyDef = parseReadonlyDef; //# sourceMappingURL=readonly.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/selectParser.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_array = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/array.cjs [app-route] (ecmascript)");
const require_bigint = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/bigint.cjs [app-route] (ecmascript)");
const require_boolean = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/boolean.cjs [app-route] (ecmascript)");
const require_branded = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/branded.cjs [app-route] (ecmascript)");
const require_catch = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/catch.cjs [app-route] (ecmascript)");
const require_date = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/date.cjs [app-route] (ecmascript)");
const require_default = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/default.cjs [app-route] (ecmascript)");
const require_effects = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/effects.cjs [app-route] (ecmascript)");
const require_enum = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/enum.cjs [app-route] (ecmascript)");
const require_intersection = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/intersection.cjs [app-route] (ecmascript)");
const require_literal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/literal.cjs [app-route] (ecmascript)");
const require_string = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/string.cjs [app-route] (ecmascript)");
const require_record = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/record.cjs [app-route] (ecmascript)");
const require_map = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/map.cjs [app-route] (ecmascript)");
const require_nativeEnum = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nativeEnum.cjs [app-route] (ecmascript)");
const require_never = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/never.cjs [app-route] (ecmascript)");
const require_null = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/null.cjs [app-route] (ecmascript)");
const require_union = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/union.cjs [app-route] (ecmascript)");
const require_nullable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nullable.cjs [app-route] (ecmascript)");
const require_number = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/number.cjs [app-route] (ecmascript)");
const require_object = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/object.cjs [app-route] (ecmascript)");
const require_optional = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/optional.cjs [app-route] (ecmascript)");
const require_pipeline = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/pipeline.cjs [app-route] (ecmascript)");
const require_promise = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/promise.cjs [app-route] (ecmascript)");
const require_set = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/set.cjs [app-route] (ecmascript)");
const require_tuple = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/tuple.cjs [app-route] (ecmascript)");
const require_undefined = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/undefined.cjs [app-route] (ecmascript)");
const require_unknown = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/unknown.cjs [app-route] (ecmascript)");
const require_readonly = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/readonly.cjs [app-route] (ecmascript)");
const zod_v3 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)"));
//#region src/utils/zod-to-json-schema/selectParser.ts
const selectParser = (def, typeName, refs)=>{
    switch(typeName){
        case zod_v3.ZodFirstPartyTypeKind.ZodString:
            return require_string.parseStringDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodNumber:
            return require_number.parseNumberDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodObject:
            return require_object.parseObjectDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodBigInt:
            return require_bigint.parseBigintDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodBoolean:
            return require_boolean.parseBooleanDef();
        case zod_v3.ZodFirstPartyTypeKind.ZodDate:
            return require_date.parseDateDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodUndefined:
            return require_undefined.parseUndefinedDef(refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodNull:
            return require_null.parseNullDef(refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodArray:
            return require_array.parseArrayDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodUnion:
        case zod_v3.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return require_union.parseUnionDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodIntersection:
            return require_intersection.parseIntersectionDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodTuple:
            return require_tuple.parseTupleDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodRecord:
            return require_record.parseRecordDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodLiteral:
            return require_literal.parseLiteralDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodEnum:
            return require_enum.parseEnumDef(def);
        case zod_v3.ZodFirstPartyTypeKind.ZodNativeEnum:
            return require_nativeEnum.parseNativeEnumDef(def);
        case zod_v3.ZodFirstPartyTypeKind.ZodNullable:
            return require_nullable.parseNullableDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodOptional:
            return require_optional.parseOptionalDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodMap:
            return require_map.parseMapDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodSet:
            return require_set.parseSetDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodLazy:
            return ()=>def.getter()._def;
        case zod_v3.ZodFirstPartyTypeKind.ZodPromise:
            return require_promise.parsePromiseDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodNaN:
        case zod_v3.ZodFirstPartyTypeKind.ZodNever:
            return require_never.parseNeverDef(refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodEffects:
            return require_effects.parseEffectsDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodAny:
            return require_any.parseAnyDef(refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodUnknown:
            return require_unknown.parseUnknownDef(refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodDefault:
            return require_default.parseDefaultDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodBranded:
            return require_branded.parseBrandedDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodReadonly:
            return require_readonly.parseReadonlyDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodCatch:
            return require_catch.parseCatchDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodPipeline:
            return require_pipeline.parsePipelineDef(def, refs);
        case zod_v3.ZodFirstPartyTypeKind.ZodFunction:
        case zod_v3.ZodFirstPartyTypeKind.ZodVoid:
        case zod_v3.ZodFirstPartyTypeKind.ZodSymbol:
            return void 0;
        default:
            /* c8 ignore next */ return ((_)=>void 0)(typeName);
    }
};
//#endregion
exports.selectParser = selectParser; //# sourceMappingURL=selectParser.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_Options = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Options.cjs [app-route] (ecmascript)");
const require_getRelativePath = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/getRelativePath.cjs [app-route] (ecmascript)");
const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_selectParser = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/selectParser.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/parseDef.ts
function parseDef(def, refs, forceResolution = false) {
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
        if (overrideResult !== require_Options.ignoreOverride) return overrideResult;
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== void 0) return seenSchema;
    }
    const newItem = {
        def,
        path: refs.currentPath,
        jsonSchema: void 0
    };
    refs.seen.set(def, newItem);
    const jsonSchemaOrGetter = require_selectParser.selectParser(def, def.typeName, refs);
    const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
    if (jsonSchema) addMeta(def, refs, jsonSchema);
    if (refs.postProcess) {
        const postProcessResult = refs.postProcess(jsonSchema, def, refs);
        newItem.jsonSchema = jsonSchema;
        return postProcessResult;
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
const get$ref = (item, refs)=>{
    switch(refs.$refStrategy){
        case "root":
            return {
                $ref: item.path.join("/")
            };
        case "relative":
            return {
                $ref: require_getRelativePath.getRelativePath(refs.currentPath, item.path)
            };
        case "none":
        case "seen":
            if (item.path.length < refs.currentPath.length && item.path.every((value, index)=>refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return require_any.parseAnyDef(refs);
            }
            return refs.$refStrategy === "seen" ? require_any.parseAnyDef(refs) : void 0;
    }
};
const addMeta = (def, refs, jsonSchema)=>{
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) jsonSchema.markdownDescription = def.description;
    }
    return jsonSchema;
};
//#endregion
exports.parseDef = parseDef; //# sourceMappingURL=parseDef.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/zodToJsonSchema.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_Refs = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Refs.cjs [app-route] (ecmascript)");
const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
//#region src/utils/zod-to-json-schema/zodToJsonSchema.ts
const zodToJsonSchema = (schema, options)=>{
    const refs = require_Refs.getRefs(options);
    let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name$1, schema$1])=>({
            ...acc,
            [name$1]: require_parseDef.parseDef(schema$1._def, {
                ...refs,
                currentPath: [
                    ...refs.basePath,
                    refs.definitionPath,
                    name$1
                ]
            }, true) ?? require_any.parseAnyDef(refs)
        }), {}) : void 0;
    const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
    const main = require_parseDef.parseDef(schema._def, name === void 0 ? refs : {
        ...refs,
        currentPath: [
            ...refs.basePath,
            refs.definitionPath,
            name
        ]
    }, false) ?? require_any.parseAnyDef(refs);
    const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
    if (title !== void 0) main.title = title;
    if (refs.flags.hasReferencedOpenAiAnyType) {
        if (!definitions) definitions = {};
        if (!definitions[refs.openAiAnyTypeName]) definitions[refs.openAiAnyTypeName] = {
            type: [
                "string",
                "number",
                "integer",
                "boolean",
                "array",
                "null"
            ],
            items: {
                $ref: refs.$refStrategy === "relative" ? "1" : [
                    ...refs.basePath,
                    refs.definitionPath,
                    refs.openAiAnyTypeName
                ].join("/")
            }
        };
    }
    const combined = name === void 0 ? definitions ? {
        ...main,
        [refs.definitionPath]: definitions
    } : main : {
        $ref: [
            ...refs.$refStrategy === "relative" ? [] : refs.basePath,
            refs.definitionPath,
            name
        ].join("/"),
        [refs.definitionPath]: {
            ...definitions,
            [name]: main
        }
    };
    if (refs.target === "jsonSchema7") combined.$schema = "http://json-schema.org/draft-07/schema#";
    else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
    if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
    return combined;
};
//#endregion
exports.zodToJsonSchema = zodToJsonSchema; //# sourceMappingURL=zodToJsonSchema.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_Options = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Options.cjs [app-route] (ecmascript)");
const require_Refs = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/Refs.cjs [app-route] (ecmascript)");
const require_errorMessages = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/errorMessages.cjs [app-route] (ecmascript)");
const require_getRelativePath = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/getRelativePath.cjs [app-route] (ecmascript)");
const require_any = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/any.cjs [app-route] (ecmascript)");
const require_array = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/array.cjs [app-route] (ecmascript)");
const require_bigint = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/bigint.cjs [app-route] (ecmascript)");
const require_boolean = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/boolean.cjs [app-route] (ecmascript)");
const require_branded = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/branded.cjs [app-route] (ecmascript)");
const require_catch = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/catch.cjs [app-route] (ecmascript)");
const require_date = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/date.cjs [app-route] (ecmascript)");
const require_default = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/default.cjs [app-route] (ecmascript)");
const require_effects = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/effects.cjs [app-route] (ecmascript)");
const require_enum = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/enum.cjs [app-route] (ecmascript)");
const require_intersection = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/intersection.cjs [app-route] (ecmascript)");
const require_literal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/literal.cjs [app-route] (ecmascript)");
const require_string = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/string.cjs [app-route] (ecmascript)");
const require_record = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/record.cjs [app-route] (ecmascript)");
const require_map = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/map.cjs [app-route] (ecmascript)");
const require_nativeEnum = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nativeEnum.cjs [app-route] (ecmascript)");
const require_never = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/never.cjs [app-route] (ecmascript)");
const require_null = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/null.cjs [app-route] (ecmascript)");
const require_union = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/union.cjs [app-route] (ecmascript)");
const require_nullable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/nullable.cjs [app-route] (ecmascript)");
const require_number = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/number.cjs [app-route] (ecmascript)");
const require_object = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/object.cjs [app-route] (ecmascript)");
const require_optional = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/optional.cjs [app-route] (ecmascript)");
const require_pipeline = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/pipeline.cjs [app-route] (ecmascript)");
const require_promise = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/promise.cjs [app-route] (ecmascript)");
const require_set = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/set.cjs [app-route] (ecmascript)");
const require_tuple = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/tuple.cjs [app-route] (ecmascript)");
const require_undefined = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/undefined.cjs [app-route] (ecmascript)");
const require_unknown = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/unknown.cjs [app-route] (ecmascript)");
const require_readonly = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parsers/readonly.cjs [app-route] (ecmascript)");
const require_selectParser = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/selectParser.cjs [app-route] (ecmascript)");
const require_parseDef = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/parseDef.cjs [app-route] (ecmascript)");
const require_zodToJsonSchema = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/zodToJsonSchema.cjs [app-route] (ecmascript)");
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/json_schema.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_zod = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/types/zod.cjs [app-route] (ecmascript)");
const require_zodToJsonSchema = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/zodToJsonSchema.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/zod-to-json-schema/index.cjs [app-route] (ecmascript)");
const zod_v4_core = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/core/index.cjs [app-route] (ecmascript)"));
const __cfworker_json_schema = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/index.js [app-route] (ecmascript)"));
//#region src/utils/json_schema.ts
var json_schema_exports = {};
require_rolldown_runtime.__export(json_schema_exports, {
    Validator: ()=>__cfworker_json_schema.Validator,
    deepCompareStrict: ()=>__cfworker_json_schema.deepCompareStrict,
    toJsonSchema: ()=>toJsonSchema,
    validatesOnlyStrings: ()=>validatesOnlyStrings
});
/**
* Converts a Zod schema or JSON schema to a JSON schema.
* @param schema - The schema to convert.
* @param params - The parameters to pass to the toJSONSchema function.
* @returns The converted schema.
*/ function toJsonSchema(schema, params) {
    if (require_zod.isZodSchemaV4(schema)) {
        const inputSchema = require_zod.interopZodTransformInputSchema(schema, true);
        if (require_zod.isZodObjectV4(inputSchema)) {
            const strictSchema = require_zod.interopZodObjectStrict(inputSchema, true);
            return (0, zod_v4_core.toJSONSchema)(strictSchema, params);
        } else return (0, zod_v4_core.toJSONSchema)(schema, params);
    }
    if (require_zod.isZodSchemaV3(schema)) return require_zodToJsonSchema.zodToJsonSchema(schema);
    return schema;
}
/**
* Validates if a JSON schema validates only strings. May return false negatives in some edge cases
* (like recursive or unresolvable refs).
*
* @param schema - The schema to validate.
* @returns `true` if the schema validates only strings, `false` otherwise.
*/ function validatesOnlyStrings(schema) {
    if (!schema || typeof schema !== "object" || Object.keys(schema).length === 0 || Array.isArray(schema)) return false;
    if ("type" in schema) {
        if (typeof schema.type === "string") return schema.type === "string";
        if (Array.isArray(schema.type)) return schema.type.every((t)=>t === "string");
        return false;
    }
    if ("enum" in schema) return Array.isArray(schema.enum) && schema.enum.length > 0 && schema.enum.every((val)=>typeof val === "string");
    if ("const" in schema) return typeof schema.const === "string";
    if ("allOf" in schema && Array.isArray(schema.allOf)) return schema.allOf.some((subschema)=>validatesOnlyStrings(subschema));
    if ("anyOf" in schema && Array.isArray(schema.anyOf) || "oneOf" in schema && Array.isArray(schema.oneOf)) {
        const subschemas = "anyOf" in schema ? schema.anyOf : schema.oneOf;
        return subschemas.length > 0 && subschemas.every((subschema)=>validatesOnlyStrings(subschema));
    }
    if ("not" in schema) return false;
    if ("$ref" in schema && typeof schema.$ref === "string") {
        const ref = schema.$ref;
        const resolved = (0, __cfworker_json_schema.dereference)(schema);
        if (resolved[ref]) return validatesOnlyStrings(resolved[ref]);
        return false;
    }
    return false;
}
//#endregion
Object.defineProperty(exports, 'Validator', {
    enumerable: true,
    get: function() {
        return __cfworker_json_schema.Validator;
    }
});
Object.defineProperty(exports, 'deepCompareStrict', {
    enumerable: true,
    get: function() {
        return __cfworker_json_schema.deepCompareStrict;
    }
});
Object.defineProperty(exports, 'json_schema_exports', {
    enumerable: true,
    get: function() {
        return json_schema_exports;
    }
});
exports.toJsonSchema = toJsonSchema;
exports.validatesOnlyStrings = validatesOnlyStrings; //# sourceMappingURL=json_schema.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/is-network-error/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/is-network-error/index.js
const objectToString = Object.prototype.toString;
const isError = (value)=>objectToString.call(value) === "[object Error]";
const errorMessages = new Set([
    "network error",
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "The Internet connection appears to be offline.",
    "Network request failed",
    "fetch failed",
    "terminated",
    " A network error occurred.",
    "Network connection lost"
]);
function isNetworkError(error) {
    const isValid = error && isError(error) && error.name === "TypeError" && typeof error.message === "string";
    if (!isValid) return false;
    const { message, stack } = error;
    if (message === "Load failed") return stack === void 0 || "__sentry_captured__" in error;
    if (message.startsWith("error sending request for url")) return true;
    return errorMessages.has(message);
}
//#endregion
exports.isNetworkError = isNetworkError; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/p-retry/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/is-network-error/index.cjs [app-route] (ecmascript)");
//#region src/utils/p-retry/index.js
function validateRetries(retries) {
    if (typeof retries === "number") {
        if (retries < 0) throw new TypeError("Expected `retries` to be a non-negative number.");
        if (Number.isNaN(retries)) throw new TypeError("Expected `retries` to be a valid number or Infinity, got NaN.");
    } else if (retries !== void 0) throw new TypeError("Expected `retries` to be a number or Infinity.");
}
function validateNumberOption(name, value, { min = 0, allowInfinity = false } = {}) {
    if (value === void 0) return;
    if (typeof value !== "number" || Number.isNaN(value)) throw new TypeError(`Expected \`${name}\` to be a number${allowInfinity ? " or Infinity" : ""}.`);
    if (!allowInfinity && !Number.isFinite(value)) throw new TypeError(`Expected \`${name}\` to be a finite number.`);
    if (value < min) throw new TypeError(`Expected \`${name}\` to be \u2265 ${min}.`);
}
var AbortError = class extends Error {
    constructor(message){
        super();
        if (message instanceof Error) {
            this.originalError = message;
            ({ message } = message);
        } else {
            this.originalError = new Error(message);
            this.originalError.stack = this.stack;
        }
        this.name = "AbortError";
        this.message = message;
    }
};
function calculateDelay(retriesConsumed, options) {
    const attempt = Math.max(1, retriesConsumed + 1);
    const random = options.randomize ? Math.random() + 1 : 1;
    let timeout = Math.round(random * options.minTimeout * options.factor ** (attempt - 1));
    timeout = Math.min(timeout, options.maxTimeout);
    return timeout;
}
function calculateRemainingTime(start, max) {
    if (!Number.isFinite(max)) return max;
    return max - (performance.now() - start);
}
async function onAttemptFailure({ error, attemptNumber, retriesConsumed, startTime, options }) {
    const normalizedError = error instanceof Error ? error : /* @__PURE__ */ new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`);
    if (normalizedError instanceof AbortError) throw normalizedError.originalError;
    const retriesLeft = Number.isFinite(options.retries) ? Math.max(0, options.retries - retriesConsumed) : options.retries;
    const maxRetryTime = options.maxRetryTime ?? Number.POSITIVE_INFINITY;
    const context = Object.freeze({
        error: normalizedError,
        attemptNumber,
        retriesLeft,
        retriesConsumed
    });
    await options.onFailedAttempt(context);
    if (calculateRemainingTime(startTime, maxRetryTime) <= 0) throw normalizedError;
    const consumeRetry = await options.shouldConsumeRetry(context);
    const remainingTime = calculateRemainingTime(startTime, maxRetryTime);
    if (remainingTime <= 0 || retriesLeft <= 0) throw normalizedError;
    if (normalizedError instanceof TypeError && !require_index.isNetworkError(normalizedError)) {
        if (consumeRetry) throw normalizedError;
        options.signal?.throwIfAborted();
        return false;
    }
    if (!await options.shouldRetry(context)) throw normalizedError;
    if (!consumeRetry) {
        options.signal?.throwIfAborted();
        return false;
    }
    const delayTime = calculateDelay(retriesConsumed, options);
    const finalDelay = Math.min(delayTime, remainingTime);
    if (finalDelay > 0) await new Promise((resolve, reject)=>{
        const onAbort = ()=>{
            clearTimeout(timeoutToken);
            options.signal?.removeEventListener("abort", onAbort);
            reject(options.signal.reason);
        };
        const timeoutToken = setTimeout(()=>{
            options.signal?.removeEventListener("abort", onAbort);
            resolve();
        }, finalDelay);
        if (options.unref) timeoutToken.unref?.();
        options.signal?.addEventListener("abort", onAbort, {
            once: true
        });
    });
    options.signal?.throwIfAborted();
    return true;
}
async function pRetry(input, options = {}) {
    options = {
        ...options
    };
    validateRetries(options.retries);
    if (Object.hasOwn(options, "forever")) throw new Error("The `forever` option is no longer supported. For many use-cases, you can set `retries: Infinity` instead.");
    options.retries ??= 10;
    options.factor ??= 2;
    options.minTimeout ??= 1e3;
    options.maxTimeout ??= Number.POSITIVE_INFINITY;
    options.maxRetryTime ??= Number.POSITIVE_INFINITY;
    options.randomize ??= false;
    options.onFailedAttempt ??= ()=>{};
    options.shouldRetry ??= ()=>true;
    options.shouldConsumeRetry ??= ()=>true;
    validateNumberOption("factor", options.factor, {
        min: 0,
        allowInfinity: false
    });
    validateNumberOption("minTimeout", options.minTimeout, {
        min: 0,
        allowInfinity: false
    });
    validateNumberOption("maxTimeout", options.maxTimeout, {
        min: 0,
        allowInfinity: true
    });
    validateNumberOption("maxRetryTime", options.maxRetryTime, {
        min: 0,
        allowInfinity: true
    });
    if (!(options.factor > 0)) options.factor = 1;
    options.signal?.throwIfAborted();
    let attemptNumber = 0;
    let retriesConsumed = 0;
    const startTime = performance.now();
    while(Number.isFinite(options.retries) ? retriesConsumed <= options.retries : true){
        attemptNumber++;
        try {
            options.signal?.throwIfAborted();
            const result = await input(attemptNumber);
            options.signal?.throwIfAborted();
            return result;
        } catch (error) {
            if (await onAttemptFailure({
                error,
                attemptNumber,
                retriesConsumed,
                startTime,
                options
            })) retriesConsumed++;
        }
    }
    throw new Error("Retry attempts exhausted without throwing an error.");
}
//#endregion
exports.pRetry = pRetry; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/async_caller.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_signal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/signal.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/p-retry/index.cjs [app-route] (ecmascript)");
const p_queue = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-queue/dist/index.js [app-route] (ecmascript)"));
//#region src/utils/async_caller.ts
var async_caller_exports = {};
require_rolldown_runtime.__export(async_caller_exports, {
    AsyncCaller: ()=>AsyncCaller
});
const STATUS_NO_RETRY = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    409
];
/**
* The default failed attempt handler for the AsyncCaller.
* @param error - The error to handle.
* @returns void
*/ const defaultFailedAttemptHandler = (error)=>{
    if (typeof error !== "object" || error === null) return;
    if ("message" in error && typeof error.message === "string" && (error.message.startsWith("Cancel") || error.message.startsWith("AbortError")) || "name" in error && typeof error.name === "string" && error.name === "AbortError") throw error;
    if ("code" in error && typeof error.code === "string" && error.code === "ECONNABORTED") throw error;
    const responseStatus = "response" in error && typeof error.response === "object" && error.response !== null && "status" in error.response && typeof error.response.status === "number" ? error.response.status : void 0;
    const directStatus = "status" in error && typeof error.status === "number" ? error.status : void 0;
    const status = responseStatus ?? directStatus;
    if (status && STATUS_NO_RETRY.includes(+status)) throw error;
    const code = "error" in error && typeof error.error === "object" && error.error !== null && "code" in error.error && typeof error.error.code === "string" ? error.error.code : void 0;
    if (code === "insufficient_quota") {
        const err = new Error("message" in error && typeof error.message === "string" ? error.message : "Insufficient quota");
        err.name = "InsufficientQuotaError";
        throw err;
    }
};
/**
* A class that can be used to make async calls with concurrency and retry logic.
*
* This is useful for making calls to any kind of "expensive" external resource,
* be it because it's rate-limited, subject to network issues, etc.
*
* Concurrent calls are limited by the `maxConcurrency` parameter, which defaults
* to `Infinity`. This means that by default, all calls will be made in parallel.
*
* Retries are limited by the `maxRetries` parameter, which defaults to 6. This
* means that by default, each call will be retried up to 6 times, with an
* exponential backoff between each attempt.
*/ var AsyncCaller = class {
    maxConcurrency;
    maxRetries;
    onFailedAttempt;
    queue;
    constructor(params){
        this.maxConcurrency = params.maxConcurrency ?? Infinity;
        this.maxRetries = params.maxRetries ?? 6;
        this.onFailedAttempt = params.onFailedAttempt ?? defaultFailedAttemptHandler;
        const PQueue = "default" in p_queue.default ? p_queue.default.default : p_queue.default;
        this.queue = new PQueue({
            concurrency: this.maxConcurrency
        });
    }
    async call(callable, ...args) {
        return this.queue.add(()=>require_index.pRetry(()=>callable(...args).catch((error)=>{
                    if (error instanceof Error) throw error;
                    else throw new Error(error);
                }), {
                onFailedAttempt: ({ error })=>this.onFailedAttempt?.(error),
                retries: this.maxRetries,
                randomize: true
            }), {
            throwOnTimeout: true
        });
    }
    callWithOptions(options, callable, ...args) {
        if (options.signal) {
            let listener;
            return Promise.race([
                this.call(callable, ...args),
                new Promise((_, reject)=>{
                    listener = ()=>{
                        reject(require_signal.getAbortSignalError(options.signal));
                    };
                    options.signal?.addEventListener("abort", listener, {
                        once: true
                    });
                })
            ]).finally(()=>{
                if (options.signal && listener) options.signal.removeEventListener("abort", listener);
            });
        }
        return this.call(callable, ...args);
    }
    fetch(...args) {
        return this.call(()=>fetch(...args).then((res)=>res.ok ? res : Promise.reject(res)));
    }
};
//#endregion
exports.AsyncCaller = AsyncCaller;
Object.defineProperty(exports, 'async_caller_exports', {
    enumerable: true,
    get: function() {
        return async_caller_exports;
    }
}); //# sourceMappingURL=async_caller.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/stream.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)");
const require_config = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/config.cjs [app-route] (ecmascript)");
const require_signal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/signal.cjs [app-route] (ecmascript)");
//#region src/utils/stream.ts
var stream_exports = {};
require_rolldown_runtime.__export(stream_exports, {
    AsyncGeneratorWithSetup: ()=>AsyncGeneratorWithSetup,
    IterableReadableStream: ()=>IterableReadableStream,
    atee: ()=>atee,
    concat: ()=>concat,
    pipeGeneratorWithSetup: ()=>pipeGeneratorWithSetup
});
var IterableReadableStream = class IterableReadableStream extends ReadableStream {
    reader;
    ensureReader() {
        if (!this.reader) this.reader = this.getReader();
    }
    async next() {
        this.ensureReader();
        try {
            const result = await this.reader.read();
            if (result.done) {
                this.reader.releaseLock();
                return {
                    done: true,
                    value: void 0
                };
            } else return {
                done: false,
                value: result.value
            };
        } catch (e) {
            this.reader.releaseLock();
            throw e;
        }
    }
    async return() {
        this.ensureReader();
        if (this.locked) {
            const cancelPromise = this.reader.cancel();
            this.reader.releaseLock();
            await cancelPromise;
        }
        return {
            done: true,
            value: void 0
        };
    }
    async throw(e) {
        this.ensureReader();
        if (this.locked) {
            const cancelPromise = this.reader.cancel();
            this.reader.releaseLock();
            await cancelPromise;
        }
        throw e;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async [Symbol.asyncDispose]() {
        await this.return();
    }
    static fromReadableStream(stream) {
        const reader = stream.getReader();
        return new IterableReadableStream({
            start (controller) {
                return pump();
                //TURBOPACK unreachable
                ;
                function pump() {
                    return reader.read().then(({ done, value })=>{
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        return pump();
                    });
                }
            },
            cancel () {
                reader.releaseLock();
            }
        });
    }
    static fromAsyncGenerator(generator) {
        return new IterableReadableStream({
            async pull (controller) {
                const { value, done } = await generator.next();
                if (done) controller.close();
                controller.enqueue(value);
            },
            async cancel (reason) {
                await generator.return(reason);
            }
        });
    }
};
function atee(iter, length = 2) {
    const buffers = Array.from({
        length
    }, ()=>[]);
    return buffers.map(async function* makeIter(buffer) {
        while(true)if (buffer.length === 0) {
            const result = await iter.next();
            for (const buffer$1 of buffers)buffer$1.push(result);
        } else if (buffer[0].done) return;
        else yield buffer.shift().value;
    });
}
function concat(first, second) {
    if (Array.isArray(first) && Array.isArray(second)) return first.concat(second);
    else if (typeof first === "string" && typeof second === "string") return first + second;
    else if (typeof first === "number" && typeof second === "number") return first + second;
    else if ("concat" in first && typeof first.concat === "function") return first.concat(second);
    else if (typeof first === "object" && typeof second === "object") {
        const chunk = {
            ...first
        };
        for (const [key, value] of Object.entries(second))if (key in chunk && !Array.isArray(chunk[key])) chunk[key] = concat(chunk[key], value);
        else chunk[key] = value;
        return chunk;
    } else throw new Error(`Cannot concat ${typeof first} and ${typeof second}`);
}
var AsyncGeneratorWithSetup = class {
    generator;
    setup;
    config;
    signal;
    firstResult;
    firstResultUsed = false;
    constructor(params){
        this.generator = params.generator;
        this.config = params.config;
        this.signal = params.signal ?? this.config?.signal;
        this.setup = new Promise((resolve, reject)=>{
            require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(params.config), async ()=>{
                this.firstResult = params.generator.next();
                if (params.startSetup) this.firstResult.then(params.startSetup).then(resolve, reject);
                else this.firstResult.then((_result)=>resolve(void 0), reject);
            }, true);
        });
    }
    async next(...args) {
        this.signal?.throwIfAborted();
        if (!this.firstResultUsed) {
            this.firstResultUsed = true;
            return this.firstResult;
        }
        return require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(this.config), this.signal ? async ()=>{
            return require_signal.raceWithSignal(this.generator.next(...args), this.signal);
        } : async ()=>{
            return this.generator.next(...args);
        }, true);
    }
    async return(value) {
        return this.generator.return(value);
    }
    async throw(e) {
        return this.generator.throw(e);
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async [Symbol.asyncDispose]() {
        await this.return();
    }
};
async function pipeGeneratorWithSetup(to, generator, startSetup, signal, ...args) {
    const gen = new AsyncGeneratorWithSetup({
        generator,
        startSetup,
        signal
    });
    const setup = await gen.setup;
    return {
        output: to(gen, setup, ...args),
        setup
    };
}
//#endregion
exports.AsyncGeneratorWithSetup = AsyncGeneratorWithSetup;
exports.IterableReadableStream = IterableReadableStream;
exports.atee = atee;
exports.concat = concat;
exports.pipeGeneratorWithSetup = pipeGeneratorWithSetup;
Object.defineProperty(exports, 'stream_exports', {
    enumerable: true,
    get: function() {
        return stream_exports;
    }
}); //# sourceMappingURL=stream.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/utils/fast-json-patch/src/helpers.ts
/*!
* https://github.com/Starcounter-Jack/JSON-Patch
* (c) 2017-2022 Joachim Wester
* MIT licensed
*/ const _hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key) {
    return _hasOwnProperty.call(obj, key);
}
function _objectKeys(obj) {
    if (Array.isArray(obj)) {
        const keys$1 = new Array(obj.length);
        for(let k = 0; k < keys$1.length; k++)keys$1[k] = "" + k;
        return keys$1;
    }
    if (Object.keys) return Object.keys(obj);
    let keys = [];
    for(let i in obj)if (hasOwnProperty(obj, i)) keys.push(i);
    return keys;
}
/**
* Deeply clone the object.
* https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
* @param  {any} obj value to clone
* @return {any} cloned obj
*/ function _deepClone(obj) {
    switch(typeof obj){
        case "object":
            return JSON.parse(JSON.stringify(obj));
        case "undefined":
            return null;
        default:
            return obj;
    }
}
function isInteger(str) {
    let i = 0;
    const len = str.length;
    let charCode;
    while(i < len){
        charCode = str.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            i++;
            continue;
        }
        return false;
    }
    return true;
}
/**
* Escapes a json pointer path
* @param path The raw pointer
* @return the Escaped path
*/ function escapePathComponent(path) {
    if (path.indexOf("/") === -1 && path.indexOf("~") === -1) return path;
    return path.replace(/~/g, "~0").replace(/\//g, "~1");
}
/**
* Unescapes a json pointer path
* @param path The escaped pointer
* @return The unescaped path
*/ function unescapePathComponent(path) {
    return path.replace(/~1/g, "/").replace(/~0/g, "~");
}
/**
* Recursively checks whether an object has any undefined values inside.
*/ function hasUndefined(obj) {
    if (obj === void 0) return true;
    if (obj) {
        if (Array.isArray(obj)) {
            for(let i$1 = 0, len = obj.length; i$1 < len; i$1++)if (hasUndefined(obj[i$1])) return true;
        } else if (typeof obj === "object") {
            const objKeys = _objectKeys(obj);
            const objKeysLength = objKeys.length;
            for(var i = 0; i < objKeysLength; i++)if (hasUndefined(obj[objKeys[i]])) return true;
        }
    }
    return false;
}
function patchErrorMessageFormatter(message, args) {
    const messageParts = [
        message
    ];
    for(const key in args){
        const value = typeof args[key] === "object" ? JSON.stringify(args[key], null, 2) : args[key];
        if (typeof value !== "undefined") messageParts.push(`${key}: ${value}`);
    }
    return messageParts.join("\n");
}
var PatchError = class extends Error {
    constructor(message, name, index, operation, tree){
        super(patchErrorMessageFormatter(message, {
            name,
            index,
            operation,
            tree
        }));
        this.name = name;
        this.index = index;
        this.operation = operation;
        this.tree = tree;
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = patchErrorMessageFormatter(message, {
            name,
            index,
            operation,
            tree
        });
    }
};
//#endregion
exports.PatchError = PatchError;
exports._deepClone = _deepClone;
exports._objectKeys = _objectKeys;
exports.escapePathComponent = escapePathComponent;
exports.hasOwnProperty = hasOwnProperty;
exports.hasUndefined = hasUndefined;
exports.isInteger = isInteger;
exports.unescapePathComponent = unescapePathComponent; //# sourceMappingURL=helpers.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_helpers = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.cjs [app-route] (ecmascript)");
//#region src/utils/fast-json-patch/src/core.ts
var core_exports = {};
require_rolldown_runtime.__export(core_exports, {
    JsonPatchError: ()=>JsonPatchError,
    _areEquals: ()=>_areEquals,
    applyOperation: ()=>applyOperation,
    applyPatch: ()=>applyPatch,
    applyReducer: ()=>applyReducer,
    deepClone: ()=>deepClone,
    getValueByPointer: ()=>getValueByPointer,
    validate: ()=>validate,
    validator: ()=>validator
});
const JsonPatchError = require_helpers.PatchError;
const deepClone = require_helpers._deepClone;
/**
* Check if a key is a dangerous prototype property that could lead to prototype pollution.
* This provides defense-in-depth alongside the check in applyOperation.
*/ function isDangerousKey(key) {
    return Object.getOwnPropertyNames(Object.prototype).includes(key);
}
const objOps = {
    add: function(obj, key, document) {
        if (isDangerousKey(key)) throw new TypeError("JSON-Patch: modifying `__proto__`, `constructor`, or `prototype` prop is banned for security reasons");
        obj[key] = this.value;
        return {
            newDocument: document
        };
    },
    remove: function(obj, key, document) {
        if (isDangerousKey(key)) throw new TypeError("JSON-Patch: modifying `__proto__`, `constructor`, or `prototype` prop is banned for security reasons");
        var removed = obj[key];
        delete obj[key];
        return {
            newDocument: document,
            removed
        };
    },
    replace: function(obj, key, document) {
        if (isDangerousKey(key)) throw new TypeError("JSON-Patch: modifying `__proto__`, `constructor`, or `prototype` prop is banned for security reasons");
        var removed = obj[key];
        obj[key] = this.value;
        return {
            newDocument: document,
            removed
        };
    },
    move: function(obj, key, document) {
        let removed = getValueByPointer(document, this.path);
        if (removed) removed = require_helpers._deepClone(removed);
        const originalValue = applyOperation(document, {
            op: "remove",
            path: this.from
        }).removed;
        applyOperation(document, {
            op: "add",
            path: this.path,
            value: originalValue
        });
        return {
            newDocument: document,
            removed
        };
    },
    copy: function(obj, key, document) {
        const valueToCopy = getValueByPointer(document, this.from);
        applyOperation(document, {
            op: "add",
            path: this.path,
            value: require_helpers._deepClone(valueToCopy)
        });
        return {
            newDocument: document
        };
    },
    test: function(obj, key, document) {
        return {
            newDocument: document,
            test: _areEquals(obj[key], this.value)
        };
    },
    _get: function(obj, key, document) {
        this.value = obj[key];
        return {
            newDocument: document
        };
    }
};
var arrOps = {
    add: function(arr, i, document) {
        if (require_helpers.isInteger(i)) arr.splice(i, 0, this.value);
        else arr[i] = this.value;
        return {
            newDocument: document,
            index: i
        };
    },
    remove: function(arr, i, document) {
        var removedList = arr.splice(i, 1);
        return {
            newDocument: document,
            removed: removedList[0]
        };
    },
    replace: function(arr, i, document) {
        var removed = arr[i];
        arr[i] = this.value;
        return {
            newDocument: document,
            removed
        };
    },
    move: objOps.move,
    copy: objOps.copy,
    test: objOps.test,
    _get: objOps._get
};
/**
* Retrieves a value from a JSON document by a JSON pointer.
* Returns the value.
*
* @param document The document to get the value from
* @param pointer an escaped JSON pointer
* @return The retrieved value
*/ function getValueByPointer(document, pointer) {
    if (pointer == "") return document;
    var getOriginalDestination = {
        op: "_get",
        path: pointer
    };
    applyOperation(document, getOriginalDestination);
    return getOriginalDestination.value;
}
/**
* Apply a single JSON Patch Operation on a JSON document.
* Returns the {newDocument, result} of the operation.
* It modifies the `document` and `operation` objects - it gets the values by reference.
* If you would like to avoid touching your values, clone them:
* `jsonpatch.applyOperation(document, jsonpatch._deepClone(operation))`.
*
* @param document The document to patch
* @param operation The operation to apply
* @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
* @param mutateDocument Whether to mutate the original document or clone it before applying
* @param banPrototypeModifications Whether to ban modifications to `__proto__`, defaults to `true`.
* @return `{newDocument, result}` after the operation
*/ function applyOperation(document, operation, validateOperation = false, mutateDocument = true, banPrototypeModifications = true, index = 0) {
    if (validateOperation) if (typeof validateOperation == "function") validateOperation(operation, 0, document, operation.path);
    else validator(operation, 0);
    if (operation.path === "") {
        let returnValue = {
            newDocument: document
        };
        if (operation.op === "add") {
            returnValue.newDocument = operation.value;
            return returnValue;
        } else if (operation.op === "replace") {
            returnValue.newDocument = operation.value;
            returnValue.removed = document;
            return returnValue;
        } else if (operation.op === "move" || operation.op === "copy") {
            returnValue.newDocument = getValueByPointer(document, operation.from);
            if (operation.op === "move") returnValue.removed = document;
            return returnValue;
        } else if (operation.op === "test") {
            returnValue.test = _areEquals(document, operation.value);
            if (returnValue.test === false) throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
            returnValue.newDocument = document;
            return returnValue;
        } else if (operation.op === "remove") {
            returnValue.removed = document;
            returnValue.newDocument = null;
            return returnValue;
        } else if (operation.op === "_get") {
            operation.value = document;
            return returnValue;
        } else if (validateOperation) throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document);
        else return returnValue;
    } else {
        if (!mutateDocument) document = require_helpers._deepClone(document);
        const path = operation.path || "";
        const keys = path.split("/");
        let obj = document;
        let t = 1;
        let len = keys.length;
        let existingPathFragment = void 0;
        let key;
        let validateFunction;
        if (typeof validateOperation == "function") validateFunction = validateOperation;
        else validateFunction = validator;
        while(true){
            key = keys[t];
            if (key && key.indexOf("~") != -1) key = require_helpers.unescapePathComponent(key);
            if (banPrototypeModifications && (key == "__proto__" || key == "prototype" && t > 0 && keys[t - 1] == "constructor")) throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
            if (validateOperation) {
                if (existingPathFragment === void 0) {
                    if (obj[key] === void 0) existingPathFragment = keys.slice(0, t).join("/");
                    else if (t == len - 1) existingPathFragment = operation.path;
                    if (existingPathFragment !== void 0) validateFunction(operation, 0, document, existingPathFragment);
                }
            }
            t++;
            if (Array.isArray(obj)) {
                if (key === "-") key = obj.length;
                else if (validateOperation && !require_helpers.isInteger(key)) throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", index, operation, document);
                else if (require_helpers.isInteger(key)) key = ~~key;
                if (t >= len) {
                    if (validateOperation && operation.op === "add" && key > obj.length) throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", index, operation, document);
                    const returnValue = arrOps[operation.op].call(operation, obj, key, document);
                    if (returnValue.test === false) throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
                    return returnValue;
                }
            } else if (t >= len) {
                const returnValue = objOps[operation.op].call(operation, obj, key, document);
                if (returnValue.test === false) throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
                return returnValue;
            }
            obj = obj[key];
            if (validateOperation && t < len && (!obj || typeof obj !== "object")) throw new JsonPatchError("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", index, operation, document);
        }
    }
}
/**
* Apply a full JSON Patch array on a JSON document.
* Returns the {newDocument, result} of the patch.
* It modifies the `document` object and `patch` - it gets the values by reference.
* If you would like to avoid touching your values, clone them:
* `jsonpatch.applyPatch(document, jsonpatch._deepClone(patch))`.
*
* @param document The document to patch
* @param patch The patch to apply
* @param validateOperation `false` is without validation, `true` to use default jsonpatch's validation, or you can pass a `validateOperation` callback to be used for validation.
* @param mutateDocument Whether to mutate the original document or clone it before applying
* @param banPrototypeModifications Whether to ban modifications to `__proto__`, defaults to `true`.
* @return An array of `{newDocument, result}` after the patch
*/ function applyPatch(document, patch, validateOperation, mutateDocument = true, banPrototypeModifications = true) {
    if (validateOperation) {
        if (!Array.isArray(patch)) throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    }
    if (!mutateDocument) document = require_helpers._deepClone(document);
    const results = new Array(patch.length);
    for(let i = 0, length = patch.length; i < length; i++){
        results[i] = applyOperation(document, patch[i], validateOperation, true, banPrototypeModifications, i);
        document = results[i].newDocument;
    }
    results.newDocument = document;
    return results;
}
/**
* Apply a single JSON Patch Operation on a JSON document.
* Returns the updated document.
* Suitable as a reducer.
*
* @param document The document to patch
* @param operation The operation to apply
* @return The updated document
*/ function applyReducer(document, operation, index) {
    const operationResult = applyOperation(document, operation);
    if (operationResult.test === false) throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document);
    return operationResult.newDocument;
}
/**
* Validates a single operation. Called from `jsonpatch.validate`. Throws `JsonPatchError` in case of an error.
* @param {object} operation - operation object (patch)
* @param {number} index - index of operation in the sequence
* @param {object} [document] - object where the operation is supposed to be applied
* @param {string} [existingPathFragment] - comes along with `document`
*/ function validator(operation, index, document, existingPathFragment) {
    if (typeof operation !== "object" || operation === null || Array.isArray(operation)) throw new JsonPatchError("Operation is not an object", "OPERATION_NOT_AN_OBJECT", index, operation, document);
    else if (!objOps[operation.op]) throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document);
    else if (typeof operation.path !== "string") throw new JsonPatchError("Operation `path` property is not a string", "OPERATION_PATH_INVALID", index, operation, document);
    else if (operation.path.indexOf("/") !== 0 && operation.path.length > 0) throw new JsonPatchError("Operation `path` property must start with \"/\"", "OPERATION_PATH_INVALID", index, operation, document);
    else if ((operation.op === "move" || operation.op === "copy") && typeof operation.from !== "string") throw new JsonPatchError("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", index, operation, document);
    else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && operation.value === void 0) throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", index, operation, document);
    else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && require_helpers.hasUndefined(operation.value)) throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", index, operation, document);
    else if (document) {
        if (operation.op == "add") {
            var pathLen = operation.path.split("/").length;
            var existingPathLen = existingPathFragment.split("/").length;
            if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) throw new JsonPatchError("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", index, operation, document);
        } else if (operation.op === "replace" || operation.op === "remove" || operation.op === "_get") {
            if (operation.path !== existingPathFragment) throw new JsonPatchError("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", index, operation, document);
        } else if (operation.op === "move" || operation.op === "copy") {
            var existingValue = {
                op: "_get",
                path: operation.from,
                value: void 0
            };
            var error = validate([
                existingValue
            ], document);
            if (error && error.name === "OPERATION_PATH_UNRESOLVABLE") throw new JsonPatchError("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", index, operation, document);
        }
    }
}
/**
* Validates a sequence of operations. If `document` parameter is provided, the sequence is additionally validated against the object document.
* If error is encountered, returns a JsonPatchError object
* @param sequence
* @param document
* @returns {JsonPatchError|undefined}
*/ function validate(sequence, document, externalValidator) {
    try {
        if (!Array.isArray(sequence)) throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
        if (document) applyPatch(require_helpers._deepClone(document), require_helpers._deepClone(sequence), externalValidator || true);
        else {
            externalValidator = externalValidator || validator;
            for(var i = 0; i < sequence.length; i++)externalValidator(sequence[i], i, document, void 0);
        }
    } catch (e) {
        if (e instanceof JsonPatchError) return e;
        else throw e;
    }
}
function _areEquals(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
        var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
        if (arrA && arrB) {
            length = a.length;
            if (length != b.length) return false;
            for(i = length; i-- !== 0;)if (!_areEquals(a[i], b[i])) return false;
            return true;
        }
        if (arrA != arrB) return false;
        var keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for(i = length; i-- !== 0;)if (!b.hasOwnProperty(keys[i])) return false;
        for(i = length; i-- !== 0;){
            key = keys[i];
            if (!_areEquals(a[key], b[key])) return false;
        }
        return true;
    }
    return a !== a && b !== b;
}
//#endregion
exports._areEquals = _areEquals;
exports.applyOperation = applyOperation;
exports.applyPatch = applyPatch;
exports.applyReducer = applyReducer;
Object.defineProperty(exports, 'core_exports', {
    enumerable: true,
    get: function() {
        return core_exports;
    }
});
exports.getValueByPointer = getValueByPointer;
exports.validate = validate;
exports.validator = validator; //# sourceMappingURL=core.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/duplex.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_helpers = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.cjs [app-route] (ecmascript)");
//#region src/utils/fast-json-patch/src/duplex.ts
function _generate(mirror, obj, patches, path, invertible) {
    if (obj === mirror) return;
    if (typeof obj.toJSON === "function") obj = obj.toJSON();
    var newKeys = require_helpers._objectKeys(obj);
    var oldKeys = require_helpers._objectKeys(mirror);
    var changed = false;
    var deleted = false;
    for(var t = oldKeys.length - 1; t >= 0; t--){
        var key = oldKeys[t];
        var oldVal = mirror[key];
        if (require_helpers.hasOwnProperty(obj, key) && !(obj[key] === void 0 && oldVal !== void 0 && Array.isArray(obj) === false)) {
            var newVal = obj[key];
            if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null && Array.isArray(oldVal) === Array.isArray(newVal)) _generate(oldVal, newVal, patches, path + "/" + require_helpers.escapePathComponent(key), invertible);
            else if (oldVal !== newVal) {
                changed = true;
                if (invertible) patches.push({
                    op: "test",
                    path: path + "/" + require_helpers.escapePathComponent(key),
                    value: require_helpers._deepClone(oldVal)
                });
                patches.push({
                    op: "replace",
                    path: path + "/" + require_helpers.escapePathComponent(key),
                    value: require_helpers._deepClone(newVal)
                });
            }
        } else if (Array.isArray(mirror) === Array.isArray(obj)) {
            if (invertible) patches.push({
                op: "test",
                path: path + "/" + require_helpers.escapePathComponent(key),
                value: require_helpers._deepClone(oldVal)
            });
            patches.push({
                op: "remove",
                path: path + "/" + require_helpers.escapePathComponent(key)
            });
            deleted = true;
        } else {
            if (invertible) patches.push({
                op: "test",
                path,
                value: mirror
            });
            patches.push({
                op: "replace",
                path,
                value: obj
            });
            changed = true;
        }
    }
    if (!deleted && newKeys.length == oldKeys.length) return;
    for(var t = 0; t < newKeys.length; t++){
        var key = newKeys[t];
        if (!require_helpers.hasOwnProperty(mirror, key) && obj[key] !== void 0) patches.push({
            op: "add",
            path: path + "/" + require_helpers.escapePathComponent(key),
            value: require_helpers._deepClone(obj[key])
        });
    }
}
/**
* Create an array of patches from the differences in two objects
*/ function compare(tree1, tree2, invertible = false) {
    var patches = [];
    _generate(tree1, tree2, patches, "", invertible);
    return patches;
}
//#endregion
exports.compare = compare; //# sourceMappingURL=duplex.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_helpers = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.cjs [app-route] (ecmascript)");
const require_core = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.cjs [app-route] (ecmascript)");
const require_duplex = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/duplex.cjs [app-route] (ecmascript)");
//#region src/utils/fast-json-patch/index.ts
var fast_json_patch_default = {
    ...require_core.core_exports,
    JsonPatchError: require_helpers.PatchError,
    deepClone: require_helpers._deepClone,
    escapePathComponent: require_helpers.escapePathComponent,
    unescapePathComponent: require_helpers.unescapePathComponent
}; //#endregion
 //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/log_stream.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_ai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/ai.cjs [app-route] (ecmascript)");
const require_core = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/fast-json-patch/index.cjs [app-route] (ecmascript)");
const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
const require_utils_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/stream.cjs [app-route] (ecmascript)");
//#region src/tracers/log_stream.ts
var log_stream_exports = {};
require_rolldown_runtime.__export(log_stream_exports, {
    LogStreamCallbackHandler: ()=>LogStreamCallbackHandler,
    RunLog: ()=>RunLog,
    RunLogPatch: ()=>RunLogPatch,
    isLogStreamHandler: ()=>isLogStreamHandler
});
/**
* List of jsonpatch JSONPatchOperations, which describe how to create the run state
* from an empty dict. This is the minimal representation of the log, designed to
* be serialized as JSON and sent over the wire to reconstruct the log on the other
* side. Reconstruction of the state can be done with any jsonpatch-compliant library,
* see https://jsonpatch.com for more information.
*/ var RunLogPatch = class {
    ops;
    constructor(fields){
        this.ops = fields.ops ?? [];
    }
    concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = require_core.applyPatch({}, ops);
        return new RunLog({
            ops,
            state: states[states.length - 1].newDocument
        });
    }
};
var RunLog = class RunLog extends RunLogPatch {
    state;
    constructor(fields){
        super(fields);
        this.state = fields.state;
    }
    concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = require_core.applyPatch(this.state, other.ops);
        return new RunLog({
            ops,
            state: states[states.length - 1].newDocument
        });
    }
    static fromRunLogPatch(patch) {
        const states = require_core.applyPatch({}, patch.ops);
        return new RunLog({
            ops: patch.ops,
            state: states[states.length - 1].newDocument
        });
    }
};
const isLogStreamHandler = (handler)=>handler.name === "log_stream_tracer";
/**
* Extract standardized inputs from a run.
*
* Standardizes the inputs based on the type of the runnable used.
*
* @param run - Run object
* @param schemaFormat - The schema format to use.
*
* @returns Valid inputs are only dict. By conventions, inputs always represented
* invocation using named arguments.
* A null means that the input is not yet known!
*/ async function _getStandardizedInputs(run, schemaFormat) {
    if (schemaFormat === "original") throw new Error("Do not assign inputs with original schema drop the key for now. When inputs are added to streamLog they should be added with standardized schema for streaming events.");
    const { inputs } = run;
    if ([
        "retriever",
        "llm",
        "prompt"
    ].includes(run.run_type)) return inputs;
    if (Object.keys(inputs).length === 1 && inputs?.input === "") return void 0;
    return inputs.input;
}
async function _getStandardizedOutputs(run, schemaFormat) {
    const { outputs } = run;
    if (schemaFormat === "original") return outputs;
    if ([
        "retriever",
        "llm",
        "prompt"
    ].includes(run.run_type)) return outputs;
    if (outputs !== void 0 && Object.keys(outputs).length === 1 && outputs?.output !== void 0) return outputs.output;
    return outputs;
}
function isChatGenerationChunk(x) {
    return x !== void 0 && x.message !== void 0;
}
/**
* Class that extends the `BaseTracer` class from the
* `langchain.callbacks.tracers.base` module. It represents a callback
* handler that logs the execution of runs and emits `RunLog` instances to a
* `RunLogStream`.
*/ var LogStreamCallbackHandler = class extends require_tracers_base.BaseTracer {
    autoClose = true;
    includeNames;
    includeTypes;
    includeTags;
    excludeNames;
    excludeTypes;
    excludeTags;
    _schemaFormat = "original";
    rootId;
    keyMapByRunId = {};
    counterMapByRunName = {};
    transformStream;
    writer;
    receiveStream;
    name = "log_stream_tracer";
    lc_prefer_streaming = true;
    constructor(fields){
        super({
            _awaitHandler: true,
            ...fields
        });
        this.autoClose = fields?.autoClose ?? true;
        this.includeNames = fields?.includeNames;
        this.includeTypes = fields?.includeTypes;
        this.includeTags = fields?.includeTags;
        this.excludeNames = fields?.excludeNames;
        this.excludeTypes = fields?.excludeTypes;
        this.excludeTags = fields?.excludeTags;
        this._schemaFormat = fields?._schemaFormat ?? this._schemaFormat;
        this.transformStream = new TransformStream();
        this.writer = this.transformStream.writable.getWriter();
        this.receiveStream = require_utils_stream.IterableReadableStream.fromReadableStream(this.transformStream.readable);
    }
    [Symbol.asyncIterator]() {
        return this.receiveStream;
    }
    async persistRun(_run) {}
    _includeRun(run) {
        if (run.id === this.rootId) return false;
        const runTags = run.tags ?? [];
        let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
        if (this.includeNames !== void 0) include = include || this.includeNames.includes(run.name);
        if (this.includeTypes !== void 0) include = include || this.includeTypes.includes(run.run_type);
        if (this.includeTags !== void 0) include = include || runTags.find((tag)=>this.includeTags?.includes(tag)) !== void 0;
        if (this.excludeNames !== void 0) include = include && !this.excludeNames.includes(run.name);
        if (this.excludeTypes !== void 0) include = include && !this.excludeTypes.includes(run.run_type);
        if (this.excludeTags !== void 0) include = include && runTags.every((tag)=>!this.excludeTags?.includes(tag));
        return include;
    }
    async *tapOutputIterable(runId, output) {
        for await (const chunk of output){
            if (runId !== this.rootId) {
                const key = this.keyMapByRunId[runId];
                if (key) await this.writer.write(new RunLogPatch({
                    ops: [
                        {
                            op: "add",
                            path: `/logs/${key}/streamed_output/-`,
                            value: chunk
                        }
                    ]
                }));
            }
            yield chunk;
        }
    }
    async onRunCreate(run) {
        if (this.rootId === void 0) {
            this.rootId = run.id;
            await this.writer.write(new RunLogPatch({
                ops: [
                    {
                        op: "replace",
                        path: "",
                        value: {
                            id: run.id,
                            name: run.name,
                            type: run.run_type,
                            streamed_output: [],
                            final_output: void 0,
                            logs: {}
                        }
                    }
                ]
            }));
        }
        if (!this._includeRun(run)) return;
        if (this.counterMapByRunName[run.name] === void 0) this.counterMapByRunName[run.name] = 0;
        this.counterMapByRunName[run.name] += 1;
        const count = this.counterMapByRunName[run.name];
        this.keyMapByRunId[run.id] = count === 1 ? run.name : `${run.name}:${count}`;
        const logEntry = {
            id: run.id,
            name: run.name,
            type: run.run_type,
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            start_time: new Date(run.start_time).toISOString(),
            streamed_output: [],
            streamed_output_str: [],
            final_output: void 0,
            end_time: void 0
        };
        if (this._schemaFormat === "streaming_events") logEntry.inputs = await _getStandardizedInputs(run, this._schemaFormat);
        await this.writer.write(new RunLogPatch({
            ops: [
                {
                    op: "add",
                    path: `/logs/${this.keyMapByRunId[run.id]}`,
                    value: logEntry
                }
            ]
        }));
    }
    async onRunUpdate(run) {
        try {
            const runName = this.keyMapByRunId[run.id];
            if (runName === void 0) return;
            const ops = [];
            if (this._schemaFormat === "streaming_events") ops.push({
                op: "replace",
                path: `/logs/${runName}/inputs`,
                value: await _getStandardizedInputs(run, this._schemaFormat)
            });
            ops.push({
                op: "add",
                path: `/logs/${runName}/final_output`,
                value: await _getStandardizedOutputs(run, this._schemaFormat)
            });
            if (run.end_time !== void 0) ops.push({
                op: "add",
                path: `/logs/${runName}/end_time`,
                value: new Date(run.end_time).toISOString()
            });
            const patch = new RunLogPatch({
                ops
            });
            await this.writer.write(patch);
        } finally{
            if (run.id === this.rootId) {
                const patch = new RunLogPatch({
                    ops: [
                        {
                            op: "replace",
                            path: "/final_output",
                            value: await _getStandardizedOutputs(run, this._schemaFormat)
                        }
                    ]
                });
                await this.writer.write(patch);
                if (this.autoClose) await this.writer.close();
            }
        }
    }
    async onLLMNewToken(run, token, kwargs) {
        const runName = this.keyMapByRunId[run.id];
        if (runName === void 0) return;
        const isChatModel = run.inputs.messages !== void 0;
        let streamedOutputValue;
        if (isChatModel) if (isChatGenerationChunk(kwargs?.chunk)) streamedOutputValue = kwargs?.chunk;
        else streamedOutputValue = new require_ai.AIMessageChunk({
            id: `run-${run.id}`,
            content: token
        });
        else streamedOutputValue = token;
        const patch = new RunLogPatch({
            ops: [
                {
                    op: "add",
                    path: `/logs/${runName}/streamed_output_str/-`,
                    value: token
                },
                {
                    op: "add",
                    path: `/logs/${runName}/streamed_output/-`,
                    value: streamedOutputValue
                }
            ]
        });
        await this.writer.write(patch);
    }
};
//#endregion
exports.LogStreamCallbackHandler = LogStreamCallbackHandler;
exports.RunLog = RunLog;
exports.RunLogPatch = RunLogPatch;
exports.isLogStreamHandler = isLogStreamHandler;
Object.defineProperty(exports, 'log_stream_exports', {
    enumerable: true,
    get: function() {
        return log_stream_exports;
    }
}); //# sourceMappingURL=log_stream.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/outputs.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
//#region src/outputs.ts
var outputs_exports = {};
require_rolldown_runtime.__export(outputs_exports, {
    ChatGenerationChunk: ()=>ChatGenerationChunk,
    GenerationChunk: ()=>GenerationChunk,
    RUN_KEY: ()=>RUN_KEY
});
const RUN_KEY = "__run";
/**
* Chunk of a single generation. Used for streaming.
*/ var GenerationChunk = class GenerationChunk {
    text;
    generationInfo;
    constructor(fields){
        this.text = fields.text;
        this.generationInfo = fields.generationInfo;
    }
    concat(chunk) {
        return new GenerationChunk({
            text: this.text + chunk.text,
            generationInfo: {
                ...this.generationInfo,
                ...chunk.generationInfo
            }
        });
    }
};
var ChatGenerationChunk = class ChatGenerationChunk extends GenerationChunk {
    message;
    constructor(fields){
        super(fields);
        this.message = fields.message;
    }
    concat(chunk) {
        return new ChatGenerationChunk({
            text: this.text + chunk.text,
            generationInfo: {
                ...this.generationInfo,
                ...chunk.generationInfo
            },
            message: this.message.concat(chunk.message)
        });
    }
};
//#endregion
exports.ChatGenerationChunk = ChatGenerationChunk;
exports.GenerationChunk = GenerationChunk;
exports.RUN_KEY = RUN_KEY;
Object.defineProperty(exports, 'outputs_exports', {
    enumerable: true,
    get: function() {
        return outputs_exports;
    }
}); //# sourceMappingURL=outputs.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/event_stream.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_ai = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/ai.cjs [app-route] (ecmascript)");
const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
const require_utils_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/stream.cjs [app-route] (ecmascript)");
const require_outputs = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/outputs.cjs [app-route] (ecmascript)");
//#region src/tracers/event_stream.ts
function assignName({ name, serialized }) {
    if (name !== void 0) return name;
    if (serialized?.name !== void 0) return serialized.name;
    else if (serialized?.id !== void 0 && Array.isArray(serialized?.id)) return serialized.id[serialized.id.length - 1];
    return "Unnamed";
}
const isStreamEventsHandler = (handler)=>handler.name === "event_stream_tracer";
/**
* Class that extends the `BaseTracer` class from the
* `langchain.callbacks.tracers.base` module. It represents a callback
* handler that logs the execution of runs and emits `RunLog` instances to a
* `RunLogStream`.
*/ var EventStreamCallbackHandler = class extends require_tracers_base.BaseTracer {
    autoClose = true;
    includeNames;
    includeTypes;
    includeTags;
    excludeNames;
    excludeTypes;
    excludeTags;
    runInfoMap = /* @__PURE__ */ new Map();
    tappedPromises = /* @__PURE__ */ new Map();
    transformStream;
    writer;
    receiveStream;
    readableStreamClosed = false;
    name = "event_stream_tracer";
    lc_prefer_streaming = true;
    constructor(fields){
        super({
            _awaitHandler: true,
            ...fields
        });
        this.autoClose = fields?.autoClose ?? true;
        this.includeNames = fields?.includeNames;
        this.includeTypes = fields?.includeTypes;
        this.includeTags = fields?.includeTags;
        this.excludeNames = fields?.excludeNames;
        this.excludeTypes = fields?.excludeTypes;
        this.excludeTags = fields?.excludeTags;
        this.transformStream = new TransformStream({
            flush: ()=>{
                this.readableStreamClosed = true;
            }
        });
        this.writer = this.transformStream.writable.getWriter();
        this.receiveStream = require_utils_stream.IterableReadableStream.fromReadableStream(this.transformStream.readable);
    }
    [Symbol.asyncIterator]() {
        return this.receiveStream;
    }
    async persistRun(_run) {}
    _includeRun(run) {
        const runTags = run.tags ?? [];
        let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
        if (this.includeNames !== void 0) include = include || this.includeNames.includes(run.name);
        if (this.includeTypes !== void 0) include = include || this.includeTypes.includes(run.runType);
        if (this.includeTags !== void 0) include = include || runTags.find((tag)=>this.includeTags?.includes(tag)) !== void 0;
        if (this.excludeNames !== void 0) include = include && !this.excludeNames.includes(run.name);
        if (this.excludeTypes !== void 0) include = include && !this.excludeTypes.includes(run.runType);
        if (this.excludeTags !== void 0) include = include && runTags.every((tag)=>!this.excludeTags?.includes(tag));
        return include;
    }
    async *tapOutputIterable(runId, outputStream) {
        const firstChunk = await outputStream.next();
        if (firstChunk.done) return;
        const runInfo = this.runInfoMap.get(runId);
        if (runInfo === void 0) {
            yield firstChunk.value;
            return;
        }
        function _formatOutputChunk(eventType, data) {
            if (eventType === "llm" && typeof data === "string") return new require_outputs.GenerationChunk({
                text: data
            });
            return data;
        }
        let tappedPromise = this.tappedPromises.get(runId);
        if (tappedPromise === void 0) {
            let tappedPromiseResolver;
            tappedPromise = new Promise((resolve)=>{
                tappedPromiseResolver = resolve;
            });
            this.tappedPromises.set(runId, tappedPromise);
            try {
                const event = {
                    event: `on_${runInfo.runType}_stream`,
                    run_id: runId,
                    name: runInfo.name,
                    tags: runInfo.tags,
                    metadata: runInfo.metadata,
                    data: {}
                };
                await this.send({
                    ...event,
                    data: {
                        chunk: _formatOutputChunk(runInfo.runType, firstChunk.value)
                    }
                }, runInfo);
                yield firstChunk.value;
                for await (const chunk of outputStream){
                    if (runInfo.runType !== "tool" && runInfo.runType !== "retriever") await this.send({
                        ...event,
                        data: {
                            chunk: _formatOutputChunk(runInfo.runType, chunk)
                        }
                    }, runInfo);
                    yield chunk;
                }
            } finally{
                tappedPromiseResolver?.();
            }
        } else {
            yield firstChunk.value;
            for await (const chunk of outputStream)yield chunk;
        }
    }
    async send(payload, run) {
        if (this.readableStreamClosed) return;
        if (this._includeRun(run)) await this.writer.write(payload);
    }
    async sendEndEvent(payload, run) {
        const tappedPromise = this.tappedPromises.get(payload.run_id);
        if (tappedPromise !== void 0) tappedPromise.then(()=>{
            this.send(payload, run);
        });
        else await this.send(payload, run);
    }
    async onLLMStart(run) {
        const runName = assignName(run);
        const runType = run.inputs.messages !== void 0 ? "chat_model" : "llm";
        const runInfo = {
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            name: runName,
            runType,
            inputs: run.inputs
        };
        this.runInfoMap.set(run.id, runInfo);
        const eventName = `on_${runType}_start`;
        await this.send({
            event: eventName,
            data: {
                input: run.inputs
            },
            name: runName,
            tags: run.tags ?? [],
            run_id: run.id,
            metadata: run.extra?.metadata ?? {}
        }, runInfo);
    }
    async onLLMNewToken(run, token, kwargs) {
        const runInfo = this.runInfoMap.get(run.id);
        let chunk;
        let eventName;
        if (runInfo === void 0) throw new Error(`onLLMNewToken: Run ID ${run.id} not found in run map.`);
        if (this.runInfoMap.size === 1) return;
        if (runInfo.runType === "chat_model") {
            eventName = "on_chat_model_stream";
            if (kwargs?.chunk === void 0) chunk = new require_ai.AIMessageChunk({
                content: token,
                id: `run-${run.id}`
            });
            else chunk = kwargs.chunk.message;
        } else if (runInfo.runType === "llm") {
            eventName = "on_llm_stream";
            if (kwargs?.chunk === void 0) chunk = new require_outputs.GenerationChunk({
                text: token
            });
            else chunk = kwargs.chunk;
        } else throw new Error(`Unexpected run type ${runInfo.runType}`);
        await this.send({
            event: eventName,
            data: {
                chunk
            },
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata
        }, runInfo);
    }
    async onLLMEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        let eventName;
        if (runInfo === void 0) throw new Error(`onLLMEnd: Run ID ${run.id} not found in run map.`);
        const generations = run.outputs?.generations;
        let output;
        if (runInfo.runType === "chat_model") {
            for (const generation of generations ?? []){
                if (output !== void 0) break;
                output = generation[0]?.message;
            }
            eventName = "on_chat_model_end";
        } else if (runInfo.runType === "llm") {
            output = {
                generations: generations?.map((generation)=>{
                    return generation.map((chunk)=>{
                        return {
                            text: chunk.text,
                            generationInfo: chunk.generationInfo
                        };
                    });
                }),
                llmOutput: run.outputs?.llmOutput ?? {}
            };
            eventName = "on_llm_end";
        } else throw new Error(`onLLMEnd: Unexpected run type: ${runInfo.runType}`);
        await this.sendEndEvent({
            event: eventName,
            data: {
                output,
                input: runInfo.inputs
            },
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata
        }, runInfo);
    }
    async onChainStart(run) {
        const runName = assignName(run);
        const runType = run.run_type ?? "chain";
        const runInfo = {
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            name: runName,
            runType: run.run_type
        };
        let eventData = {};
        if (run.inputs.input === "" && Object.keys(run.inputs).length === 1) {
            eventData = {};
            runInfo.inputs = {};
        } else if (run.inputs.input !== void 0) {
            eventData.input = run.inputs.input;
            runInfo.inputs = run.inputs.input;
        } else {
            eventData.input = run.inputs;
            runInfo.inputs = run.inputs;
        }
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
            event: `on_${runType}_start`,
            data: eventData,
            name: runName,
            tags: run.tags ?? [],
            run_id: run.id,
            metadata: run.extra?.metadata ?? {}
        }, runInfo);
    }
    async onChainEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) throw new Error(`onChainEnd: Run ID ${run.id} not found in run map.`);
        const eventName = `on_${run.run_type}_end`;
        const inputs = run.inputs ?? runInfo.inputs ?? {};
        const outputs = run.outputs?.output ?? run.outputs;
        const data = {
            output: outputs,
            input: inputs
        };
        if (inputs.input && Object.keys(inputs).length === 1) {
            data.input = inputs.input;
            runInfo.inputs = inputs.input;
        }
        await this.sendEndEvent({
            event: eventName,
            data,
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata ?? {}
        }, runInfo);
    }
    async onToolStart(run) {
        const runName = assignName(run);
        const runInfo = {
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            name: runName,
            runType: "tool",
            inputs: run.inputs ?? {}
        };
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
            event: "on_tool_start",
            data: {
                input: run.inputs ?? {}
            },
            name: runName,
            run_id: run.id,
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {}
        }, runInfo);
    }
    async onToolEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) throw new Error(`onToolEnd: Run ID ${run.id} not found in run map.`);
        if (runInfo.inputs === void 0) throw new Error(`onToolEnd: Run ID ${run.id} is a tool call, and is expected to have traced inputs.`);
        const output = run.outputs?.output === void 0 ? run.outputs : run.outputs.output;
        await this.sendEndEvent({
            event: "on_tool_end",
            data: {
                output,
                input: runInfo.inputs
            },
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata
        }, runInfo);
    }
    async onToolError(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) throw new Error(`onToolEnd: Run ID ${run.id} not found in run map.`);
        if (runInfo.inputs === void 0) throw new Error(`onToolEnd: Run ID ${run.id} is a tool call, and is expected to have traced inputs.`);
        await this.sendEndEvent({
            event: "on_tool_error",
            data: {
                input: runInfo.inputs,
                error: run.error
            },
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata
        }, runInfo);
    }
    async onRetrieverStart(run) {
        const runName = assignName(run);
        const runType = "retriever";
        const runInfo = {
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            name: runName,
            runType,
            inputs: {
                query: run.inputs.query
            }
        };
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
            event: "on_retriever_start",
            data: {
                input: {
                    query: run.inputs.query
                }
            },
            name: runName,
            tags: run.tags ?? [],
            run_id: run.id,
            metadata: run.extra?.metadata ?? {}
        }, runInfo);
    }
    async onRetrieverEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) throw new Error(`onRetrieverEnd: Run ID ${run.id} not found in run map.`);
        await this.sendEndEvent({
            event: "on_retriever_end",
            data: {
                output: run.outputs?.documents ?? run.outputs,
                input: runInfo.inputs
            },
            run_id: run.id,
            name: runInfo.name,
            tags: runInfo.tags,
            metadata: runInfo.metadata
        }, runInfo);
    }
    async handleCustomEvent(eventName, data, runId) {
        const runInfo = this.runInfoMap.get(runId);
        if (runInfo === void 0) throw new Error(`handleCustomEvent: Run ID ${runId} not found in run map.`);
        await this.send({
            event: "on_custom_event",
            run_id: runId,
            name: eventName,
            tags: runInfo.tags,
            metadata: runInfo.metadata,
            data
        }, runInfo);
    }
    async finish() {
        const pendingPromises = [
            ...this.tappedPromises.values()
        ];
        Promise.all(pendingPromises).finally(()=>{
            this.writer.close();
        });
    }
};
//#endregion
exports.EventStreamCallbackHandler = EventStreamCallbackHandler;
exports.isStreamEventsHandler = isStreamEventsHandler; //# sourceMappingURL=event_stream.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/root_listener.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_tracers_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/base.cjs [app-route] (ecmascript)");
//#region src/tracers/root_listener.ts
var RootListenersTracer = class extends require_tracers_base.BaseTracer {
    name = "RootListenersTracer";
    /** The Run's ID. Type UUID */ rootId;
    config;
    argOnStart;
    argOnEnd;
    argOnError;
    constructor({ config, onStart, onEnd, onError }){
        super({
            _awaitHandler: true
        });
        this.config = config;
        this.argOnStart = onStart;
        this.argOnEnd = onEnd;
        this.argOnError = onError;
    }
    /**
	* This is a legacy method only called once for an entire run tree
	* therefore not useful here
	* @param {Run} _ Not used
	*/ persistRun(_) {
        return Promise.resolve();
    }
    async onRunCreate(run) {
        if (this.rootId) return;
        this.rootId = run.id;
        if (this.argOnStart) await this.argOnStart(run, this.config);
    }
    async onRunUpdate(run) {
        if (run.id !== this.rootId) return;
        if (!run.error) {
            if (this.argOnEnd) await this.argOnEnd(run, this.config);
        } else if (this.argOnError) await this.argOnError(run, this.config);
    }
};
//#endregion
exports.RootListenersTracer = RootListenersTracer; //# sourceMappingURL=root_listener.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/utils.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

//#region src/runnables/utils.ts
function isRunnableInterface(thing) {
    return thing ? thing.lc_runnable : false;
}
/**
* Utility to filter the root event in the streamEvents implementation.
* This is simply binding the arguments to the namespace to make save on
* a bit of typing in the streamEvents implementation.
*
* TODO: Refactor and remove.
*/ var _RootEventFilter = class {
    includeNames;
    includeTypes;
    includeTags;
    excludeNames;
    excludeTypes;
    excludeTags;
    constructor(fields){
        this.includeNames = fields.includeNames;
        this.includeTypes = fields.includeTypes;
        this.includeTags = fields.includeTags;
        this.excludeNames = fields.excludeNames;
        this.excludeTypes = fields.excludeTypes;
        this.excludeTags = fields.excludeTags;
    }
    includeEvent(event, rootType) {
        let include = this.includeNames === void 0 && this.includeTypes === void 0 && this.includeTags === void 0;
        const eventTags = event.tags ?? [];
        if (this.includeNames !== void 0) include = include || this.includeNames.includes(event.name);
        if (this.includeTypes !== void 0) include = include || this.includeTypes.includes(rootType);
        if (this.includeTags !== void 0) include = include || eventTags.some((tag)=>this.includeTags?.includes(tag));
        if (this.excludeNames !== void 0) include = include && !this.excludeNames.includes(event.name);
        if (this.excludeTypes !== void 0) include = include && !this.excludeTypes.includes(rootType);
        if (this.excludeTags !== void 0) include = include && eventTags.every((tag)=>!this.excludeTags?.includes(tag));
        return include;
    }
};
const toBase64Url = (str)=>{
    const encoded = btoa(str);
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
//#endregion
exports._RootEventFilter = _RootEventFilter;
exports.isRunnableInterface = isRunnableInterface;
exports.toBase64Url = toBase64Url; //# sourceMappingURL=utils.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/graph_mermaid.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/utils.cjs [app-route] (ecmascript)");
//#region src/runnables/graph_mermaid.ts
function _escapeNodeLabel(nodeLabel) {
    return nodeLabel.replace(/[^a-zA-Z-_0-9]/g, "_");
}
const MARKDOWN_SPECIAL_CHARS = [
    "*",
    "_",
    "`"
];
function _generateMermaidGraphStyles(nodeColors) {
    let styles = "";
    for (const [className, color] of Object.entries(nodeColors))styles += `\tclassDef ${className} ${color};\n`;
    return styles;
}
/**
* Draws a Mermaid graph using the provided graph data
*/ function drawMermaid(nodes, edges, config) {
    const { firstNode, lastNode, nodeColors, withStyles = true, curveStyle = "linear", wrapLabelNWords = 9 } = config ?? {};
    let mermaidGraph = withStyles ? `%%{init: {'flowchart': {'curve': '${curveStyle}'}}}%%\ngraph TD;\n` : "graph TD;\n";
    if (withStyles) {
        const defaultClassLabel = "default";
        const formatDict = {
            [defaultClassLabel]: "{0}({1})"
        };
        if (firstNode !== void 0) formatDict[firstNode] = "{0}([{1}]):::first";
        if (lastNode !== void 0) formatDict[lastNode] = "{0}([{1}]):::last";
        for (const [key, node] of Object.entries(nodes)){
            const nodeName = node.name.split(":").pop() ?? "";
            const label = MARKDOWN_SPECIAL_CHARS.some((char)=>nodeName.startsWith(char) && nodeName.endsWith(char)) ? `<p>${nodeName}</p>` : nodeName;
            let finalLabel = label;
            if (Object.keys(node.metadata ?? {}).length) finalLabel += `<hr/><small><em>${Object.entries(node.metadata ?? {}).map(([k, v])=>`${k} = ${v}`).join("\n")}</em></small>`;
            const nodeLabel = (formatDict[key] ?? formatDict[defaultClassLabel]).replace("{0}", _escapeNodeLabel(key)).replace("{1}", finalLabel);
            mermaidGraph += `\t${nodeLabel}\n`;
        }
    }
    const edgeGroups = {};
    for (const edge of edges){
        const srcParts = edge.source.split(":");
        const tgtParts = edge.target.split(":");
        const commonPrefix = srcParts.filter((src, i)=>src === tgtParts[i]).join(":");
        if (!edgeGroups[commonPrefix]) edgeGroups[commonPrefix] = [];
        edgeGroups[commonPrefix].push(edge);
    }
    const seenSubgraphs = /* @__PURE__ */ new Set();
    function sortPrefixesByDepth(prefixes) {
        return [
            ...prefixes
        ].sort((a, b)=>{
            return a.split(":").length - b.split(":").length;
        });
    }
    function addSubgraph(edges$1, prefix) {
        const selfLoop = edges$1.length === 1 && edges$1[0].source === edges$1[0].target;
        if (prefix && !selfLoop) {
            const subgraph = prefix.split(":").pop();
            if (seenSubgraphs.has(prefix)) throw new Error(`Found duplicate subgraph '${subgraph}' at '${prefix} -- this likely means that you're reusing a subgraph node with the same name. Please adjust your graph to have subgraph nodes with unique names.`);
            seenSubgraphs.add(prefix);
            mermaidGraph += `\tsubgraph ${subgraph}\n`;
        }
        const nestedPrefixes = sortPrefixesByDepth(Object.keys(edgeGroups).filter((nestedPrefix)=>nestedPrefix.startsWith(`${prefix}:`) && nestedPrefix !== prefix && nestedPrefix.split(":").length === prefix.split(":").length + 1));
        for (const nestedPrefix of nestedPrefixes)addSubgraph(edgeGroups[nestedPrefix], nestedPrefix);
        for (const edge of edges$1){
            const { source, target, data, conditional } = edge;
            let edgeLabel = "";
            if (data !== void 0) {
                let edgeData = data;
                const words = edgeData.split(" ");
                if (words.length > wrapLabelNWords) edgeData = Array.from({
                    length: Math.ceil(words.length / wrapLabelNWords)
                }, (_, i)=>words.slice(i * wrapLabelNWords, (i + 1) * wrapLabelNWords).join(" ")).join("&nbsp;<br>&nbsp;");
                edgeLabel = conditional ? ` -. &nbsp;${edgeData}&nbsp; .-> ` : ` -- &nbsp;${edgeData}&nbsp; --> `;
            } else edgeLabel = conditional ? " -.-> " : " --> ";
            mermaidGraph += `\t${_escapeNodeLabel(source)}${edgeLabel}${_escapeNodeLabel(target)};\n`;
        }
        if (prefix && !selfLoop) mermaidGraph += "	end\n";
    }
    addSubgraph(edgeGroups[""] ?? [], "");
    for(const prefix in edgeGroups)if (!prefix.includes(":") && prefix !== "") addSubgraph(edgeGroups[prefix], prefix);
    if (withStyles) mermaidGraph += _generateMermaidGraphStyles(nodeColors ?? {});
    return mermaidGraph;
}
/**
* Renders Mermaid graph using the Mermaid.INK API.
*
* @example
* ```javascript
* const image = await drawMermaidImage(mermaidSyntax, {
*   backgroundColor: "white",
*   imageType: "png",
* });
* fs.writeFileSync("image.png", image);
* ```
*
* @param mermaidSyntax - The Mermaid syntax to render.
* @param config - The configuration for the image.
* @returns The image as a Blob.
*/ async function drawMermaidImage(mermaidSyntax, config) {
    let backgroundColor = config?.backgroundColor ?? "white";
    const imageType = config?.imageType ?? "png";
    const mermaidSyntaxEncoded = require_utils.toBase64Url(mermaidSyntax);
    if (backgroundColor !== void 0) {
        const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
        if (!hexColorPattern.test(backgroundColor)) backgroundColor = `!${backgroundColor}`;
    }
    const imageUrl = `https://mermaid.ink/img/${mermaidSyntaxEncoded}?bgColor=${backgroundColor}&type=${imageType}`;
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error([
        `Failed to render the graph using the Mermaid.INK API.`,
        `Status code: ${res.status}`,
        `Status text: ${res.statusText}`
    ].join("\n"));
    const content = await res.blob();
    return content;
}
//#endregion
exports.drawMermaid = drawMermaid;
exports.drawMermaidImage = drawMermaidImage; //# sourceMappingURL=graph_mermaid.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/graph.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/utils.cjs [app-route] (ecmascript)");
const require_graph_mermaid = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/graph_mermaid.cjs [app-route] (ecmascript)");
const require_utils_json_schema = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/json_schema.cjs [app-route] (ecmascript)");
const uuid = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)"));
//#region src/runnables/graph.ts
var graph_exports = {};
require_rolldown_runtime.__export(graph_exports, {
    Graph: ()=>Graph
});
function nodeDataStr(id, data) {
    if (id !== void 0 && !(0, uuid.validate)(id)) return id;
    else if (require_utils.isRunnableInterface(data)) try {
        let dataStr = data.getName();
        dataStr = dataStr.startsWith("Runnable") ? dataStr.slice(8) : dataStr;
        return dataStr;
    } catch  {
        return data.getName();
    }
    else return data.name ?? "UnknownSchema";
}
function nodeDataJson(node) {
    if (require_utils.isRunnableInterface(node.data)) return {
        type: "runnable",
        data: {
            id: node.data.lc_id,
            name: node.data.getName()
        }
    };
    else return {
        type: "schema",
        data: {
            ...require_utils_json_schema.toJsonSchema(node.data.schema),
            title: node.data.name
        }
    };
}
var Graph = class Graph {
    nodes = {};
    edges = [];
    constructor(params){
        this.nodes = params?.nodes ?? this.nodes;
        this.edges = params?.edges ?? this.edges;
    }
    toJSON() {
        const stableNodeIds = {};
        Object.values(this.nodes).forEach((node, i)=>{
            stableNodeIds[node.id] = (0, uuid.validate)(node.id) ? i : node.id;
        });
        return {
            nodes: Object.values(this.nodes).map((node)=>({
                    id: stableNodeIds[node.id],
                    ...nodeDataJson(node)
                })),
            edges: this.edges.map((edge)=>{
                const item = {
                    source: stableNodeIds[edge.source],
                    target: stableNodeIds[edge.target]
                };
                if (typeof edge.data !== "undefined") item.data = edge.data;
                if (typeof edge.conditional !== "undefined") item.conditional = edge.conditional;
                return item;
            })
        };
    }
    addNode(data, id, metadata) {
        if (id !== void 0 && this.nodes[id] !== void 0) throw new Error(`Node with id ${id} already exists`);
        const nodeId = id ?? (0, uuid.v4)();
        const node = {
            id: nodeId,
            data,
            name: nodeDataStr(id, data),
            metadata
        };
        this.nodes[nodeId] = node;
        return node;
    }
    removeNode(node) {
        delete this.nodes[node.id];
        this.edges = this.edges.filter((edge)=>edge.source !== node.id && edge.target !== node.id);
    }
    addEdge(source, target, data, conditional) {
        if (this.nodes[source.id] === void 0) throw new Error(`Source node ${source.id} not in graph`);
        if (this.nodes[target.id] === void 0) throw new Error(`Target node ${target.id} not in graph`);
        const edge = {
            source: source.id,
            target: target.id,
            data,
            conditional
        };
        this.edges.push(edge);
        return edge;
    }
    firstNode() {
        return _firstNode(this);
    }
    lastNode() {
        return _lastNode(this);
    }
    /**
	* Add all nodes and edges from another graph.
	* Note this doesn't check for duplicates, nor does it connect the graphs.
	*/ extend(graph, prefix = "") {
        let finalPrefix = prefix;
        const nodeIds = Object.values(graph.nodes).map((node)=>node.id);
        if (nodeIds.every(uuid.validate)) finalPrefix = "";
        const prefixed = (id)=>{
            return finalPrefix ? `${finalPrefix}:${id}` : id;
        };
        Object.entries(graph.nodes).forEach(([key, value])=>{
            this.nodes[prefixed(key)] = {
                ...value,
                id: prefixed(key)
            };
        });
        const newEdges = graph.edges.map((edge)=>{
            return {
                ...edge,
                source: prefixed(edge.source),
                target: prefixed(edge.target)
            };
        });
        this.edges = [
            ...this.edges,
            ...newEdges
        ];
        const first = graph.firstNode();
        const last = graph.lastNode();
        return [
            first ? {
                id: prefixed(first.id),
                data: first.data
            } : void 0,
            last ? {
                id: prefixed(last.id),
                data: last.data
            } : void 0
        ];
    }
    trimFirstNode() {
        const firstNode = this.firstNode();
        if (firstNode && _firstNode(this, [
            firstNode.id
        ])) this.removeNode(firstNode);
    }
    trimLastNode() {
        const lastNode = this.lastNode();
        if (lastNode && _lastNode(this, [
            lastNode.id
        ])) this.removeNode(lastNode);
    }
    /**
	* Return a new graph with all nodes re-identified,
	* using their unique, readable names where possible.
	*/ reid() {
        const nodeLabels = Object.fromEntries(Object.values(this.nodes).map((node)=>[
                node.id,
                node.name
            ]));
        const nodeLabelCounts = /* @__PURE__ */ new Map();
        Object.values(nodeLabels).forEach((label)=>{
            nodeLabelCounts.set(label, (nodeLabelCounts.get(label) || 0) + 1);
        });
        const getNodeId = (nodeId)=>{
            const label = nodeLabels[nodeId];
            if ((0, uuid.validate)(nodeId) && nodeLabelCounts.get(label) === 1) return label;
            else return nodeId;
        };
        return new Graph({
            nodes: Object.fromEntries(Object.entries(this.nodes).map(([id, node])=>[
                    getNodeId(id),
                    {
                        ...node,
                        id: getNodeId(id)
                    }
                ])),
            edges: this.edges.map((edge)=>({
                    ...edge,
                    source: getNodeId(edge.source),
                    target: getNodeId(edge.target)
                }))
        });
    }
    drawMermaid(params) {
        const { withStyles, curveStyle, nodeColors = {
            default: "fill:#f2f0ff,line-height:1.2",
            first: "fill-opacity:0",
            last: "fill:#bfb6fc"
        }, wrapLabelNWords } = params ?? {};
        const graph = this.reid();
        const firstNode = graph.firstNode();
        const lastNode = graph.lastNode();
        return require_graph_mermaid.drawMermaid(graph.nodes, graph.edges, {
            firstNode: firstNode?.id,
            lastNode: lastNode?.id,
            withStyles,
            curveStyle,
            nodeColors,
            wrapLabelNWords
        });
    }
    async drawMermaidPng(params) {
        const mermaidSyntax = this.drawMermaid(params);
        return require_graph_mermaid.drawMermaidImage(mermaidSyntax, {
            backgroundColor: params?.backgroundColor
        });
    }
};
/**
* Find the single node that is not a target of any edge.
* Exclude nodes/sources with ids in the exclude list.
* If there is no such node, or there are multiple, return undefined.
* When drawing the graph, this node would be the origin.
*/ function _firstNode(graph, exclude = []) {
    const targets = new Set(graph.edges.filter((edge)=>!exclude.includes(edge.source)).map((edge)=>edge.target));
    const found = [];
    for (const node of Object.values(graph.nodes))if (!exclude.includes(node.id) && !targets.has(node.id)) found.push(node);
    return found.length === 1 ? found[0] : void 0;
}
/**
* Find the single node that is not a source of any edge.
* Exclude nodes/targets with ids in the exclude list.
* If there is no such node, or there are multiple, return undefined.
* When drawing the graph, this node would be the destination.
*/ function _lastNode(graph, exclude = []) {
    const sources = new Set(graph.edges.filter((edge)=>!exclude.includes(edge.target)).map((edge)=>edge.source));
    const found = [];
    for (const node of Object.values(graph.nodes))if (!exclude.includes(node.id) && !sources.has(node.id)) found.push(node);
    return found.length === 1 ? found[0] : void 0;
}
//#endregion
exports.Graph = Graph;
Object.defineProperty(exports, 'graph_exports', {
    enumerable: true,
    get: function() {
        return graph_exports;
    }
}); //# sourceMappingURL=graph.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/wrappers.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_utils_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/stream.cjs [app-route] (ecmascript)");
//#region src/runnables/wrappers.ts
function convertToHttpEventStream(stream) {
    const encoder = new TextEncoder();
    const finalStream = new ReadableStream({
        async start (controller) {
            for await (const chunk of stream)controller.enqueue(encoder.encode(`event: data\ndata: ${JSON.stringify(chunk)}\n\n`));
            controller.enqueue(encoder.encode("event: end\n\n"));
            controller.close();
        }
    });
    return require_utils_stream.IterableReadableStream.fromReadableStream(finalStream);
}
//#endregion
exports.convertToHttpEventStream = convertToHttpEventStream; //# sourceMappingURL=wrappers.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/iter.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)");
const require_config = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/config.cjs [app-route] (ecmascript)");
//#region src/runnables/iter.ts
function isIterableIterator(thing) {
    return typeof thing === "object" && thing !== null && typeof thing[Symbol.iterator] === "function" && typeof thing.next === "function";
}
const isIterator = (x)=>x != null && typeof x === "object" && "next" in x && typeof x.next === "function";
function isAsyncIterable(thing) {
    return typeof thing === "object" && thing !== null && typeof thing[Symbol.asyncIterator] === "function";
}
function* consumeIteratorInContext(context, iter) {
    while(true){
        const { value, done } = require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(context), iter.next.bind(iter), true);
        if (done) break;
        else yield value;
    }
}
async function* consumeAsyncIterableInContext(context, iter) {
    const iterator = iter[Symbol.asyncIterator]();
    while(true){
        const { value, done } = await require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(context), iterator.next.bind(iter), true);
        if (done) break;
        else yield value;
    }
}
//#endregion
exports.consumeAsyncIterableInContext = consumeAsyncIterableInContext;
exports.consumeIteratorInContext = consumeIteratorInContext;
exports.isAsyncIterable = isAsyncIterable;
exports.isIterableIterator = isIterableIterator;
exports.isIterator = isIterator; //# sourceMappingURL=iter.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/base.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_load_serializable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/serializable.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/utils.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)");
const require_config = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/config.cjs [app-route] (ecmascript)");
const require_signal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/signal.cjs [app-route] (ecmascript)");
const require_utils_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/stream.cjs [app-route] (ecmascript)");
const require_tracers_log_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/log_stream.cjs [app-route] (ecmascript)");
const require_event_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/event_stream.cjs [app-route] (ecmascript)");
const require_index$1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/p-retry/index.cjs [app-route] (ecmascript)");
const require_utils_async_caller = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/async_caller.cjs [app-route] (ecmascript)");
const require_root_listener = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tracers/root_listener.cjs [app-route] (ecmascript)");
const require_utils$1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/utils.cjs [app-route] (ecmascript)");
const require_zod = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/types/zod.cjs [app-route] (ecmascript)");
const require_runnables_graph = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/graph.cjs [app-route] (ecmascript)");
const require_wrappers = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/wrappers.cjs [app-route] (ecmascript)");
const require_iter = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/iter.cjs [app-route] (ecmascript)");
const zod_v3 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)"));
const uuid = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)"));
const langsmith_singletons_traceable = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/langsmith/singletons/traceable.cjs [app-route] (ecmascript)"));
//#region src/runnables/base.ts
function _coerceToDict(value, defaultKey) {
    return value && !Array.isArray(value) && !(value instanceof Date) && typeof value === "object" ? value : {
        [defaultKey]: value
    };
}
/**
* A Runnable is a generic unit of work that can be invoked, batched, streamed, and/or
* transformed.
*/ var Runnable = class extends require_load_serializable.Serializable {
    lc_runnable = true;
    name;
    getName(suffix) {
        const name = this.name ?? this.constructor.lc_name() ?? this.constructor.name;
        return suffix ? `${name}${suffix}` : name;
    }
    /**
	* Add retry logic to an existing runnable.
	* @param fields.stopAfterAttempt The number of attempts to retry.
	* @param fields.onFailedAttempt A function that is called when a retry fails.
	* @returns A new RunnableRetry that, when invoked, will retry according to the parameters.
	*/ withRetry(fields) {
        return new RunnableRetry({
            bound: this,
            kwargs: {},
            config: {},
            maxAttemptNumber: fields?.stopAfterAttempt,
            ...fields
        });
    }
    /**
	* Bind config to a Runnable, returning a new Runnable.
	* @param config New configuration parameters to attach to the new runnable.
	* @returns A new RunnableBinding with a config matching what's passed.
	*/ withConfig(config) {
        return new RunnableBinding({
            bound: this,
            config,
            kwargs: {}
        });
    }
    /**
	* Create a new runnable from the current one that will try invoking
	* other passed fallback runnables if the initial invocation fails.
	* @param fields.fallbacks Other runnables to call if the runnable errors.
	* @returns A new RunnableWithFallbacks.
	*/ withFallbacks(fields) {
        const fallbacks = Array.isArray(fields) ? fields : fields.fallbacks;
        return new RunnableWithFallbacks({
            runnable: this,
            fallbacks
        });
    }
    _getOptionsList(options, length = 0) {
        if (Array.isArray(options) && options.length !== length) throw new Error(`Passed "options" must be an array with the same length as the inputs, but got ${options.length} options for ${length} inputs`);
        if (Array.isArray(options)) return options.map(require_config.ensureConfig);
        if (length > 1 && !Array.isArray(options) && options.runId) {
            console.warn("Provided runId will be used only for the first element of the batch.");
            const subsequent = Object.fromEntries(Object.entries(options).filter(([key])=>key !== "runId"));
            return Array.from({
                length
            }, (_, i)=>require_config.ensureConfig(i === 0 ? options : subsequent));
        }
        return Array.from({
            length
        }, ()=>require_config.ensureConfig(options));
    }
    async batch(inputs, options, batchOptions) {
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const maxConcurrency = configList[0]?.maxConcurrency ?? batchOptions?.maxConcurrency;
        const caller = new require_utils_async_caller.AsyncCaller({
            maxConcurrency,
            onFailedAttempt: (e)=>{
                throw e;
            }
        });
        const batchCalls = inputs.map((input, i)=>caller.call(async ()=>{
                try {
                    const result = await this.invoke(input, configList[i]);
                    return result;
                } catch (e) {
                    if (batchOptions?.returnExceptions) return e;
                    throw e;
                }
            }));
        return Promise.all(batchCalls);
    }
    /**
	* Default streaming implementation.
	* Subclasses should override this method if they support streaming output.
	* @param input
	* @param options
	*/ async *_streamIterator(input, options) {
        yield this.invoke(input, options);
    }
    /**
	* Stream output in chunks.
	* @param input
	* @param options
	* @returns A readable stream that is also an iterable.
	*/ async stream(input, options) {
        const config = require_config.ensureConfig(options);
        const wrappedGenerator = new require_utils_stream.AsyncGeneratorWithSetup({
            generator: this._streamIterator(input, config),
            config
        });
        await wrappedGenerator.setup;
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
    }
    _separateRunnableConfigFromCallOptions(options) {
        let runnableConfig;
        if (options === void 0) runnableConfig = require_config.ensureConfig(options);
        else runnableConfig = require_config.ensureConfig({
            callbacks: options.callbacks,
            tags: options.tags,
            metadata: options.metadata,
            runName: options.runName,
            configurable: options.configurable,
            recursionLimit: options.recursionLimit,
            maxConcurrency: options.maxConcurrency,
            runId: options.runId,
            timeout: options.timeout,
            signal: options.signal
        });
        const callOptions = {
            ...options
        };
        delete callOptions.callbacks;
        delete callOptions.tags;
        delete callOptions.metadata;
        delete callOptions.runName;
        delete callOptions.configurable;
        delete callOptions.recursionLimit;
        delete callOptions.maxConcurrency;
        delete callOptions.runId;
        delete callOptions.timeout;
        delete callOptions.signal;
        return [
            runnableConfig,
            callOptions
        ];
    }
    async _callWithConfig(func, input, options) {
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), config.runId, config?.runType, void 0, void 0, config?.runName ?? this.getName());
        delete config.runId;
        let output;
        try {
            const promise = func.call(this, input, config, runManager);
            output = await require_signal.raceWithSignal(promise, options?.signal);
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict(output, "output"));
        return output;
    }
    /**
	* Internal method that handles batching and configuration for a runnable
	* It takes a function, input values, and optional configuration, and
	* returns a promise that resolves to the output values.
	* @param func The function to be executed for each input value.
	* @param input The input values to be processed.
	* @param config Optional configuration for the function execution.
	* @returns A promise that resolves to the output values.
	*/ async _batchWithConfig(func, inputs, options, batchOptions) {
        const optionsList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(optionsList.map(require_config.getCallbackManagerForConfig));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i)=>{
            const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), optionsList[i].runId, optionsList[i].runType, void 0, void 0, optionsList[i].runName ?? this.getName());
            delete optionsList[i].runId;
            return handleStartRes;
        }));
        let outputs;
        try {
            const promise = func.call(this, inputs, optionsList, runManagers, batchOptions);
            outputs = await require_signal.raceWithSignal(promise, optionsList?.[0]?.signal);
        } catch (e) {
            await Promise.all(runManagers.map((runManager)=>runManager?.handleChainError(e)));
            throw e;
        }
        await Promise.all(runManagers.map((runManager)=>runManager?.handleChainEnd(_coerceToDict(outputs, "output"))));
        return outputs;
    }
    /** @internal */ _concatOutputChunks(first, second) {
        return require_utils_stream.concat(first, second);
    }
    /**
	* Helper method to transform an Iterator of Input values into an Iterator of
	* Output values, with callbacks.
	* Use this to implement `stream()` or `transform()` in Runnable subclasses.
	*/ async *_transformStreamWithConfig(inputGenerator, transformer, options) {
        let finalInput;
        let finalInputSupported = true;
        let finalOutput;
        let finalOutputSupported = true;
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const outerThis = this;
        async function* wrapInputForTracing() {
            for await (const chunk of inputGenerator){
                if (finalInputSupported) if (finalInput === void 0) finalInput = chunk;
                else try {
                    finalInput = outerThis._concatOutputChunks(finalInput, chunk);
                } catch  {
                    finalInput = void 0;
                    finalInputSupported = false;
                }
                yield chunk;
            }
        }
        let runManager;
        try {
            const pipe = await require_utils_stream.pipeGeneratorWithSetup(transformer.bind(this), wrapInputForTracing(), async ()=>callbackManager_?.handleChainStart(this.toJSON(), {
                    input: ""
                }, config.runId, config.runType, void 0, void 0, config.runName ?? this.getName(), void 0, {
                    lc_defers_inputs: true
                }), options?.signal, config);
            delete config.runId;
            runManager = pipe.setup;
            const streamEventsHandler = runManager?.handlers.find(require_event_stream.isStreamEventsHandler);
            let iterator = pipe.output;
            if (streamEventsHandler !== void 0 && runManager !== void 0) iterator = streamEventsHandler.tapOutputIterable(runManager.runId, iterator);
            const streamLogHandler = runManager?.handlers.find(require_tracers_log_stream.isLogStreamHandler);
            if (streamLogHandler !== void 0 && runManager !== void 0) iterator = streamLogHandler.tapOutputIterable(runManager.runId, iterator);
            for await (const chunk of iterator){
                yield chunk;
                if (finalOutputSupported) if (finalOutput === void 0) finalOutput = chunk;
                else try {
                    finalOutput = this._concatOutputChunks(finalOutput, chunk);
                } catch  {
                    finalOutput = void 0;
                    finalOutputSupported = false;
                }
            }
        } catch (e) {
            await runManager?.handleChainError(e, void 0, void 0, void 0, {
                inputs: _coerceToDict(finalInput, "input")
            });
            throw e;
        }
        await runManager?.handleChainEnd(finalOutput ?? {}, void 0, void 0, void 0, {
            inputs: _coerceToDict(finalInput, "input")
        });
    }
    getGraph(_) {
        const graph = new require_runnables_graph.Graph();
        const inputNode = graph.addNode({
            name: `${this.getName()}Input`,
            schema: zod_v3.z.any()
        });
        const runnableNode = graph.addNode(this);
        const outputNode = graph.addNode({
            name: `${this.getName()}Output`,
            schema: zod_v3.z.any()
        });
        graph.addEdge(inputNode, runnableNode);
        graph.addEdge(runnableNode, outputNode);
        return graph;
    }
    /**
	* Create a new runnable sequence that runs each individual runnable in series,
	* piping the output of one runnable into another runnable or runnable-like.
	* @param coerceable A runnable, function, or object whose values are functions or runnables.
	* @returns A new runnable sequence.
	*/ pipe(coerceable) {
        return new RunnableSequence({
            first: this,
            last: _coerceToRunnable(coerceable)
        });
    }
    /**
	* Pick keys from the dict output of this runnable. Returns a new runnable.
	*/ pick(keys) {
        return this.pipe(new RunnablePick(keys));
    }
    /**
	* Assigns new fields to the dict output of this runnable. Returns a new runnable.
	*/ assign(mapping) {
        return this.pipe(new RunnableAssign(new RunnableMap({
            steps: mapping
        })));
    }
    /**
	* Default implementation of transform, which buffers input and then calls stream.
	* Subclasses should override this method if they can start producing output while
	* input is still being generated.
	* @param generator
	* @param options
	*/ async *transform(generator, options) {
        let finalChunk;
        for await (const chunk of generator)if (finalChunk === void 0) finalChunk = chunk;
        else finalChunk = this._concatOutputChunks(finalChunk, chunk);
        yield* this._streamIterator(finalChunk, require_config.ensureConfig(options));
    }
    /**
	* Stream all output from a runnable, as reported to the callback system.
	* This includes all inner runs of LLMs, Retrievers, Tools, etc.
	* Output is streamed as Log objects, which include a list of
	* jsonpatch ops that describe how the state of the run has changed in each
	* step, and the final state of the run.
	* The jsonpatch ops can be applied in order to construct state.
	* @param input
	* @param options
	* @param streamOptions
	*/ async *streamLog(input, options, streamOptions) {
        const logStreamCallbackHandler = new require_tracers_log_stream.LogStreamCallbackHandler({
            ...streamOptions,
            autoClose: false,
            _schemaFormat: "original"
        });
        const config = require_config.ensureConfig(options);
        yield* this._streamLog(input, logStreamCallbackHandler, config);
    }
    async *_streamLog(input, logStreamCallbackHandler, config) {
        const { callbacks } = config;
        if (callbacks === void 0) config.callbacks = [
            logStreamCallbackHandler
        ];
        else if (Array.isArray(callbacks)) config.callbacks = callbacks.concat([
            logStreamCallbackHandler
        ]);
        else {
            const copiedCallbacks = callbacks.copy();
            copiedCallbacks.addHandler(logStreamCallbackHandler, true);
            config.callbacks = copiedCallbacks;
        }
        const runnableStreamPromise = this.stream(input, config);
        async function consumeRunnableStream() {
            try {
                const runnableStream = await runnableStreamPromise;
                for await (const chunk of runnableStream){
                    const patch = new require_tracers_log_stream.RunLogPatch({
                        ops: [
                            {
                                op: "add",
                                path: "/streamed_output/-",
                                value: chunk
                            }
                        ]
                    });
                    await logStreamCallbackHandler.writer.write(patch);
                }
            } finally{
                await logStreamCallbackHandler.writer.close();
            }
        }
        const runnableStreamConsumePromise = consumeRunnableStream();
        try {
            for await (const log of logStreamCallbackHandler)yield log;
        } finally{
            await runnableStreamConsumePromise;
        }
    }
    streamEvents(input, options, streamOptions) {
        let stream;
        if (options.version === "v1") stream = this._streamEventsV1(input, options, streamOptions);
        else if (options.version === "v2") stream = this._streamEventsV2(input, options, streamOptions);
        else throw new Error(`Only versions "v1" and "v2" of the schema are currently supported.`);
        if (options.encoding === "text/event-stream") return require_wrappers.convertToHttpEventStream(stream);
        else return require_utils_stream.IterableReadableStream.fromAsyncGenerator(stream);
    }
    async *_streamEventsV2(input, options, streamOptions) {
        const eventStreamer = new require_event_stream.EventStreamCallbackHandler({
            ...streamOptions,
            autoClose: false
        });
        const config = require_config.ensureConfig(options);
        const runId = config.runId ?? (0, uuid.v4)();
        config.runId = runId;
        const callbacks = config.callbacks;
        if (callbacks === void 0) config.callbacks = [
            eventStreamer
        ];
        else if (Array.isArray(callbacks)) config.callbacks = callbacks.concat(eventStreamer);
        else {
            const copiedCallbacks = callbacks.copy();
            copiedCallbacks.addHandler(eventStreamer, true);
            config.callbacks = copiedCallbacks;
        }
        const abortController = new AbortController();
        const outerThis = this;
        async function consumeRunnableStream() {
            let signal;
            let listener = null;
            try {
                if (options?.signal) if ("any" in AbortSignal) signal = AbortSignal.any([
                    abortController.signal,
                    options.signal
                ]);
                else {
                    signal = options.signal;
                    listener = ()=>{
                        abortController.abort();
                    };
                    options.signal.addEventListener("abort", listener, {
                        once: true
                    });
                }
                else signal = abortController.signal;
                const runnableStream = await outerThis.stream(input, {
                    ...config,
                    signal
                });
                const tappedStream = eventStreamer.tapOutputIterable(runId, runnableStream);
                for await (const _ of tappedStream)if (abortController.signal.aborted) break;
            } finally{
                await eventStreamer.finish();
                if (signal && listener) signal.removeEventListener("abort", listener);
            }
        }
        const runnableStreamConsumePromise = consumeRunnableStream();
        let firstEventSent = false;
        let firstEventRunId;
        try {
            for await (const event of eventStreamer){
                if (!firstEventSent) {
                    event.data.input = input;
                    firstEventSent = true;
                    firstEventRunId = event.run_id;
                    yield event;
                    continue;
                }
                if (event.run_id === firstEventRunId && event.event.endsWith("_end")) {
                    if (event.data?.input) delete event.data.input;
                }
                yield event;
            }
        } finally{
            abortController.abort();
            await runnableStreamConsumePromise;
        }
    }
    async *_streamEventsV1(input, options, streamOptions) {
        let runLog;
        let hasEncounteredStartEvent = false;
        const config = require_config.ensureConfig(options);
        const rootTags = config.tags ?? [];
        const rootMetadata = config.metadata ?? {};
        const rootName = config.runName ?? this.getName();
        const logStreamCallbackHandler = new require_tracers_log_stream.LogStreamCallbackHandler({
            ...streamOptions,
            autoClose: false,
            _schemaFormat: "streaming_events"
        });
        const rootEventFilter = new require_utils$1._RootEventFilter({
            ...streamOptions
        });
        const logStream = this._streamLog(input, logStreamCallbackHandler, config);
        for await (const log of logStream){
            if (!runLog) runLog = require_tracers_log_stream.RunLog.fromRunLogPatch(log);
            else runLog = runLog.concat(log);
            if (runLog.state === void 0) throw new Error(`Internal error: "streamEvents" state is missing. Please open a bug report.`);
            if (!hasEncounteredStartEvent) {
                hasEncounteredStartEvent = true;
                const state$2 = {
                    ...runLog.state
                };
                const event = {
                    run_id: state$2.id,
                    event: `on_${state$2.type}_start`,
                    name: rootName,
                    tags: rootTags,
                    metadata: rootMetadata,
                    data: {
                        input
                    }
                };
                if (rootEventFilter.includeEvent(event, state$2.type)) yield event;
            }
            const paths = log.ops.filter((op)=>op.path.startsWith("/logs/")).map((op)=>op.path.split("/")[2]);
            const dedupedPaths = [
                ...new Set(paths)
            ];
            for (const path of dedupedPaths){
                let eventType;
                let data = {};
                const logEntry = runLog.state.logs[path];
                if (logEntry.end_time === void 0) if (logEntry.streamed_output.length > 0) eventType = "stream";
                else eventType = "start";
                else eventType = "end";
                if (eventType === "start") {
                    if (logEntry.inputs !== void 0) data.input = logEntry.inputs;
                } else if (eventType === "end") {
                    if (logEntry.inputs !== void 0) data.input = logEntry.inputs;
                    data.output = logEntry.final_output;
                } else if (eventType === "stream") {
                    const chunkCount = logEntry.streamed_output.length;
                    if (chunkCount !== 1) throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${logEntry.name}"`);
                    data = {
                        chunk: logEntry.streamed_output[0]
                    };
                    logEntry.streamed_output = [];
                }
                yield {
                    event: `on_${logEntry.type}_${eventType}`,
                    name: logEntry.name,
                    run_id: logEntry.id,
                    tags: logEntry.tags,
                    metadata: logEntry.metadata,
                    data
                };
            }
            const { state: state$1 } = runLog;
            if (state$1.streamed_output.length > 0) {
                const chunkCount = state$1.streamed_output.length;
                if (chunkCount !== 1) throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${state$1.name}"`);
                const data = {
                    chunk: state$1.streamed_output[0]
                };
                state$1.streamed_output = [];
                const event = {
                    event: `on_${state$1.type}_stream`,
                    run_id: state$1.id,
                    tags: rootTags,
                    metadata: rootMetadata,
                    name: rootName,
                    data
                };
                if (rootEventFilter.includeEvent(event, state$1.type)) yield event;
            }
        }
        const state = runLog?.state;
        if (state !== void 0) {
            const event = {
                event: `on_${state.type}_end`,
                name: rootName,
                run_id: state.id,
                tags: rootTags,
                metadata: rootMetadata,
                data: {
                    output: state.final_output
                }
            };
            if (rootEventFilter.includeEvent(event, state.type)) yield event;
        }
    }
    static isRunnable(thing) {
        return require_utils$1.isRunnableInterface(thing);
    }
    /**
	* Bind lifecycle listeners to a Runnable, returning a new Runnable.
	* The Run object contains information about the run, including its id,
	* type, input, output, error, startTime, endTime, and any tags or metadata
	* added to the run.
	*
	* @param {Object} params - The object containing the callback functions.
	* @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
	* @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
	* @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
	*/ withListeners({ onStart, onEnd, onError }) {
        return new RunnableBinding({
            bound: this,
            config: {},
            configFactories: [
                (config)=>({
                        callbacks: [
                            new require_root_listener.RootListenersTracer({
                                config,
                                onStart,
                                onEnd,
                                onError
                            })
                        ]
                    })
            ]
        });
    }
    /**
	* Convert a runnable to a tool. Return a new instance of `RunnableToolLike`
	* which contains the runnable, name, description and schema.
	*
	* @template {T extends RunInput = RunInput} RunInput - The input type of the runnable. Should be the same as the `RunInput` type of the runnable.
	*
	* @param fields
	* @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
	* @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
	* @param {z.ZodType<T>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
	* @returns {RunnableToolLike<z.ZodType<T>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
	*/ asTool(fields) {
        return convertRunnableToTool(this, fields);
    }
};
/**
* Wraps a runnable and applies partial config upon invocation.
*
* @example
* ```typescript
* import {
*   type RunnableConfig,
*   RunnableLambda,
* } from "@langchain/core/runnables";
*
* const enhanceProfile = (
*   profile: Record<string, any>,
*   config?: RunnableConfig
* ) => {
*   if (config?.configurable?.role) {
*     return { ...profile, role: config.configurable.role };
*   }
*   return profile;
* };
*
* const runnable = RunnableLambda.from(enhanceProfile);
*
* // Bind configuration to the runnable to set the user's role dynamically
* const adminRunnable = runnable.withConfig({ configurable: { role: "Admin" } });
* const userRunnable = runnable.withConfig({ configurable: { role: "User" } });
*
* const result1 = await adminRunnable.invoke({
*   name: "Alice",
*   email: "alice@example.com"
* });
*
* // { name: "Alice", email: "alice@example.com", role: "Admin" }
*
* const result2 = await userRunnable.invoke({
*   name: "Bob",
*   email: "bob@example.com"
* });
*
* // { name: "Bob", email: "bob@example.com", role: "User" }
* ```
*/ var RunnableBinding = class RunnableBinding extends Runnable {
    static lc_name() {
        return "RunnableBinding";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    lc_serializable = true;
    bound;
    config;
    kwargs;
    configFactories;
    constructor(fields){
        super(fields);
        this.bound = fields.bound;
        this.kwargs = fields.kwargs;
        this.config = fields.config;
        this.configFactories = fields.configFactories;
    }
    getName(suffix) {
        return this.bound.getName(suffix);
    }
    async _mergeConfig(...options) {
        const config = require_config.mergeConfigs(this.config, ...options);
        return require_config.mergeConfigs(config, ...this.configFactories ? await Promise.all(this.configFactories.map(async (configFactory)=>await configFactory(config))) : []);
    }
    withConfig(config) {
        return new this.constructor({
            bound: this.bound,
            kwargs: this.kwargs,
            config: {
                ...this.config,
                ...config
            }
        });
    }
    withRetry(fields) {
        return new RunnableRetry({
            bound: this.bound,
            kwargs: this.kwargs,
            config: this.config,
            maxAttemptNumber: fields?.stopAfterAttempt,
            ...fields
        });
    }
    async invoke(input, options) {
        return this.bound.invoke(input, await this._mergeConfig(options, this.kwargs));
    }
    async batch(inputs, options, batchOptions) {
        const mergedOptions = Array.isArray(options) ? await Promise.all(options.map(async (individualOption)=>this._mergeConfig(require_config.ensureConfig(individualOption), this.kwargs))) : await this._mergeConfig(require_config.ensureConfig(options), this.kwargs);
        return this.bound.batch(inputs, mergedOptions, batchOptions);
    }
    /** @internal */ _concatOutputChunks(first, second) {
        return this.bound._concatOutputChunks(first, second);
    }
    async *_streamIterator(input, options) {
        yield* this.bound._streamIterator(input, await this._mergeConfig(require_config.ensureConfig(options), this.kwargs));
    }
    async stream(input, options) {
        return this.bound.stream(input, await this._mergeConfig(require_config.ensureConfig(options), this.kwargs));
    }
    async *transform(generator, options) {
        yield* this.bound.transform(generator, await this._mergeConfig(require_config.ensureConfig(options), this.kwargs));
    }
    streamEvents(input, options, streamOptions) {
        const outerThis = this;
        const generator = async function*() {
            yield* outerThis.bound.streamEvents(input, {
                ...await outerThis._mergeConfig(require_config.ensureConfig(options), outerThis.kwargs),
                version: options.version
            }, streamOptions);
        };
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(generator());
    }
    static isRunnableBinding(thing) {
        return thing.bound && Runnable.isRunnable(thing.bound);
    }
    /**
	* Bind lifecycle listeners to a Runnable, returning a new Runnable.
	* The Run object contains information about the run, including its id,
	* type, input, output, error, startTime, endTime, and any tags or metadata
	* added to the run.
	*
	* @param {Object} params - The object containing the callback functions.
	* @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
	* @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
	* @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
	*/ withListeners({ onStart, onEnd, onError }) {
        return new RunnableBinding({
            bound: this.bound,
            kwargs: this.kwargs,
            config: this.config,
            configFactories: [
                (config)=>({
                        callbacks: [
                            new require_root_listener.RootListenersTracer({
                                config,
                                onStart,
                                onEnd,
                                onError
                            })
                        ]
                    })
            ]
        });
    }
};
/**
* A runnable that delegates calls to another runnable
* with each element of the input sequence.
* @example
* ```typescript
* import { RunnableEach, RunnableLambda } from "@langchain/core/runnables";
*
* const toUpperCase = (input: string): string => input.toUpperCase();
* const addGreeting = (input: string): string => `Hello, ${input}!`;
*
* const upperCaseLambda = RunnableLambda.from(toUpperCase);
* const greetingLambda = RunnableLambda.from(addGreeting);
*
* const chain = new RunnableEach({
*   bound: upperCaseLambda.pipe(greetingLambda),
* });
*
* const result = await chain.invoke(["alice", "bob", "carol"])
*
* // ["Hello, ALICE!", "Hello, BOB!", "Hello, CAROL!"]
* ```
*/ var RunnableEach = class RunnableEach extends Runnable {
    static lc_name() {
        return "RunnableEach";
    }
    lc_serializable = true;
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    bound;
    constructor(fields){
        super(fields);
        this.bound = fields.bound;
    }
    /**
	* Invokes the runnable with the specified input and configuration.
	* @param input The input to invoke the runnable with.
	* @param config The configuration to invoke the runnable with.
	* @returns A promise that resolves to the output of the runnable.
	*/ async invoke(inputs, config) {
        return this._callWithConfig(this._invoke.bind(this), inputs, config);
    }
    /**
	* A helper method that is used to invoke the runnable with the specified input and configuration.
	* @param input The input to invoke the runnable with.
	* @param config The configuration to invoke the runnable with.
	* @returns A promise that resolves to the output of the runnable.
	*/ async _invoke(inputs, config, runManager) {
        return this.bound.batch(inputs, require_config.patchConfig(config, {
            callbacks: runManager?.getChild()
        }));
    }
    /**
	* Bind lifecycle listeners to a Runnable, returning a new Runnable.
	* The Run object contains information about the run, including its id,
	* type, input, output, error, startTime, endTime, and any tags or metadata
	* added to the run.
	*
	* @param {Object} params - The object containing the callback functions.
	* @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
	* @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
	* @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
	*/ withListeners({ onStart, onEnd, onError }) {
        return new RunnableEach({
            bound: this.bound.withListeners({
                onStart,
                onEnd,
                onError
            })
        });
    }
};
/**
* Base class for runnables that can be retried a
* specified number of times.
* @example
* ```typescript
* import {
*   RunnableLambda,
*   RunnableRetry,
* } from "@langchain/core/runnables";
*
* // Simulate an API call that fails
* const simulateApiCall = (input: string): string => {
*   console.log(`Attempting API call with input: ${input}`);
*   throw new Error("API call failed due to network issue");
* };
*
* const apiCallLambda = RunnableLambda.from(simulateApiCall);
*
* // Apply retry logic using the .withRetry() method
* const apiCallWithRetry = apiCallLambda.withRetry({ stopAfterAttempt: 3 });
*
* // Alternatively, create a RunnableRetry instance manually
* const manualRetry = new RunnableRetry({
*   bound: apiCallLambda,
*   maxAttemptNumber: 3,
*   config: {},
* });
*
* // Example invocation using the .withRetry() method
* const res = await apiCallWithRetry
*   .invoke("Request 1")
*   .catch((error) => {
*     console.error("Failed after multiple retries:", error.message);
*   });
*
* // Example invocation using the manual retry instance
* const res2 = await manualRetry
*   .invoke("Request 2")
*   .catch((error) => {
*     console.error("Failed after multiple retries:", error.message);
*   });
* ```
*/ var RunnableRetry = class extends RunnableBinding {
    static lc_name() {
        return "RunnableRetry";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    maxAttemptNumber = 3;
    onFailedAttempt = ()=>{};
    constructor(fields){
        super(fields);
        this.maxAttemptNumber = fields.maxAttemptNumber ?? this.maxAttemptNumber;
        this.onFailedAttempt = fields.onFailedAttempt ?? this.onFailedAttempt;
    }
    _patchConfigForRetry(attempt, config, runManager) {
        const tag = attempt > 1 ? `retry:attempt:${attempt}` : void 0;
        return require_config.patchConfig(config, {
            callbacks: runManager?.getChild(tag)
        });
    }
    async _invoke(input, config, runManager) {
        return require_index$1.pRetry((attemptNumber)=>super.invoke(input, this._patchConfigForRetry(attemptNumber, config, runManager)), {
            onFailedAttempt: ({ error })=>this.onFailedAttempt(error, input),
            retries: Math.max(this.maxAttemptNumber - 1, 0),
            randomize: true
        });
    }
    /**
	* Method that invokes the runnable with the specified input, run manager,
	* and config. It handles the retry logic by catching any errors and
	* recursively invoking itself with the updated config for the next retry
	* attempt.
	* @param input The input for the runnable.
	* @param runManager The run manager for the runnable.
	* @param config The config for the runnable.
	* @returns A promise that resolves to the output of the runnable.
	*/ async invoke(input, config) {
        return this._callWithConfig(this._invoke.bind(this), input, config);
    }
    async _batch(inputs, configs, runManagers, batchOptions) {
        const resultsMap = {};
        try {
            await require_index$1.pRetry(async (attemptNumber)=>{
                const remainingIndexes = inputs.map((_, i)=>i).filter((i)=>resultsMap[i.toString()] === void 0 || resultsMap[i.toString()] instanceof Error);
                const remainingInputs = remainingIndexes.map((i)=>inputs[i]);
                const patchedConfigs = remainingIndexes.map((i)=>this._patchConfigForRetry(attemptNumber, configs?.[i], runManagers?.[i]));
                const results = await super.batch(remainingInputs, patchedConfigs, {
                    ...batchOptions,
                    returnExceptions: true
                });
                let firstException;
                for(let i = 0; i < results.length; i += 1){
                    const result = results[i];
                    const resultMapIndex = remainingIndexes[i];
                    if (result instanceof Error) {
                        if (firstException === void 0) {
                            firstException = result;
                            firstException.input = remainingInputs[i];
                        }
                    }
                    resultsMap[resultMapIndex.toString()] = result;
                }
                if (firstException) throw firstException;
                return results;
            }, {
                onFailedAttempt: ({ error })=>this.onFailedAttempt(error, error.input),
                retries: Math.max(this.maxAttemptNumber - 1, 0),
                randomize: true
            });
        } catch (e) {
            if (batchOptions?.returnExceptions !== true) throw e;
        }
        return Object.keys(resultsMap).sort((a, b)=>parseInt(a, 10) - parseInt(b, 10)).map((key)=>resultsMap[parseInt(key, 10)]);
    }
    async batch(inputs, options, batchOptions) {
        return this._batchWithConfig(this._batch.bind(this), inputs, options, batchOptions);
    }
};
/**
* A sequence of runnables, where the output of each is the input of the next.
* @example
* ```typescript
* const promptTemplate = PromptTemplate.fromTemplate(
*   "Tell me a joke about {topic}",
* );
* const chain = RunnableSequence.from([promptTemplate, new ChatOpenAI({ model: "gpt-4o-mini" })]);
* const result = await chain.invoke({ topic: "bears" });
* ```
*/ var RunnableSequence = class RunnableSequence extends Runnable {
    static lc_name() {
        return "RunnableSequence";
    }
    first;
    middle = [];
    last;
    omitSequenceTags = false;
    lc_serializable = true;
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    constructor(fields){
        super(fields);
        this.first = fields.first;
        this.middle = fields.middle ?? this.middle;
        this.last = fields.last;
        this.name = fields.name;
        this.omitSequenceTags = fields.omitSequenceTags ?? this.omitSequenceTags;
    }
    get steps() {
        return [
            this.first,
            ...this.middle,
            this.last
        ];
    }
    async invoke(input, options) {
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), config.runId, void 0, void 0, void 0, config?.runName);
        delete config.runId;
        let nextStepInput = input;
        let finalOutput;
        try {
            const initialSteps = [
                this.first,
                ...this.middle
            ];
            for(let i = 0; i < initialSteps.length; i += 1){
                const step = initialSteps[i];
                const promise = step.invoke(nextStepInput, require_config.patchConfig(config, {
                    callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`)
                }));
                nextStepInput = await require_signal.raceWithSignal(promise, options?.signal);
            }
            if (options?.signal?.aborted) throw require_signal.getAbortSignalError(options.signal);
            finalOutput = await this.last.invoke(nextStepInput, require_config.patchConfig(config, {
                callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${this.steps.length}`)
            }));
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict(finalOutput, "output"));
        return finalOutput;
    }
    async batch(inputs, options, batchOptions) {
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(configList.map(require_config.getCallbackManagerForConfig));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i)=>{
            const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName);
            delete configList[i].runId;
            return handleStartRes;
        }));
        let nextStepInputs = inputs;
        try {
            for(let i = 0; i < this.steps.length; i += 1){
                const step = this.steps[i];
                const promise = step.batch(nextStepInputs, runManagers.map((runManager, j)=>{
                    const childRunManager = runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`);
                    return require_config.patchConfig(configList[j], {
                        callbacks: childRunManager
                    });
                }), batchOptions);
                nextStepInputs = await require_signal.raceWithSignal(promise, configList[0]?.signal);
            }
        } catch (e) {
            await Promise.all(runManagers.map((runManager)=>runManager?.handleChainError(e)));
            throw e;
        }
        await Promise.all(runManagers.map((runManager)=>runManager?.handleChainEnd(_coerceToDict(nextStepInputs, "output"))));
        return nextStepInputs;
    }
    /** @internal */ _concatOutputChunks(first, second) {
        return this.last._concatOutputChunks(first, second);
    }
    async *_streamIterator(input, options) {
        const callbackManager_ = await require_config.getCallbackManagerForConfig(options);
        const { runId, ...otherOptions } = options ?? {};
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherOptions?.runName);
        const steps = [
            this.first,
            ...this.middle,
            this.last
        ];
        let concatSupported = true;
        let finalOutput;
        async function* inputGenerator() {
            yield input;
        }
        try {
            let finalGenerator = steps[0].transform(inputGenerator(), require_config.patchConfig(otherOptions, {
                callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:1`)
            }));
            for(let i = 1; i < steps.length; i += 1){
                const step = steps[i];
                finalGenerator = await step.transform(finalGenerator, require_config.patchConfig(otherOptions, {
                    callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`)
                }));
            }
            for await (const chunk of finalGenerator){
                options?.signal?.throwIfAborted();
                yield chunk;
                if (concatSupported) if (finalOutput === void 0) finalOutput = chunk;
                else try {
                    finalOutput = this._concatOutputChunks(finalOutput, chunk);
                } catch  {
                    finalOutput = void 0;
                    concatSupported = false;
                }
            }
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict(finalOutput, "output"));
    }
    getGraph(config) {
        const graph = new require_runnables_graph.Graph();
        let currentLastNode = null;
        this.steps.forEach((step, index)=>{
            const stepGraph = step.getGraph(config);
            if (index !== 0) stepGraph.trimFirstNode();
            if (index !== this.steps.length - 1) stepGraph.trimLastNode();
            graph.extend(stepGraph);
            const stepFirstNode = stepGraph.firstNode();
            if (!stepFirstNode) throw new Error(`Runnable ${step} has no first node`);
            if (currentLastNode) graph.addEdge(currentLastNode, stepFirstNode);
            currentLastNode = stepGraph.lastNode();
        });
        return graph;
    }
    pipe(coerceable) {
        if (RunnableSequence.isRunnableSequence(coerceable)) return new RunnableSequence({
            first: this.first,
            middle: this.middle.concat([
                this.last,
                coerceable.first,
                ...coerceable.middle
            ]),
            last: coerceable.last,
            name: this.name ?? coerceable.name
        });
        else return new RunnableSequence({
            first: this.first,
            middle: [
                ...this.middle,
                this.last
            ],
            last: _coerceToRunnable(coerceable),
            name: this.name
        });
    }
    static isRunnableSequence(thing) {
        return Array.isArray(thing.middle) && Runnable.isRunnable(thing);
    }
    static from([first, ...runnables], nameOrFields) {
        let extra = {};
        if (typeof nameOrFields === "string") extra.name = nameOrFields;
        else if (nameOrFields !== void 0) extra = nameOrFields;
        return new RunnableSequence({
            ...extra,
            first: _coerceToRunnable(first),
            middle: runnables.slice(0, -1).map(_coerceToRunnable),
            last: _coerceToRunnable(runnables[runnables.length - 1])
        });
    }
};
/**
* A runnable that runs a mapping of runnables in parallel,
* and returns a mapping of their outputs.
* @example
* ```typescript
* const mapChain = RunnableMap.from({
*   joke: PromptTemplate.fromTemplate("Tell me a joke about {topic}").pipe(
*     new ChatAnthropic({}),
*   ),
*   poem: PromptTemplate.fromTemplate("write a 2-line poem about {topic}").pipe(
*     new ChatAnthropic({}),
*   ),
* });
* const result = await mapChain.invoke({ topic: "bear" });
* ```
*/ var RunnableMap = class RunnableMap extends Runnable {
    static lc_name() {
        return "RunnableMap";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    lc_serializable = true;
    steps;
    getStepsKeys() {
        return Object.keys(this.steps);
    }
    constructor(fields){
        super(fields);
        this.steps = {};
        for (const [key, value] of Object.entries(fields.steps))this.steps[key] = _coerceToRunnable(value);
    }
    static from(steps) {
        return new RunnableMap({
            steps
        });
    }
    async invoke(input, options) {
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), {
            input
        }, config.runId, void 0, void 0, void 0, config?.runName);
        delete config.runId;
        const output = {};
        try {
            const promises = Object.entries(this.steps).map(async ([key, runnable])=>{
                output[key] = await runnable.invoke(input, require_config.patchConfig(config, {
                    callbacks: runManager?.getChild(`map:key:${key}`)
                }));
            });
            await require_signal.raceWithSignal(Promise.all(promises), options?.signal);
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        await runManager?.handleChainEnd(output);
        return output;
    }
    async *_transform(generator, runManager, options) {
        const steps = {
            ...this.steps
        };
        const inputCopies = require_utils_stream.atee(generator, Object.keys(steps).length);
        const tasks = new Map(Object.entries(steps).map(([key, runnable], i)=>{
            const gen = runnable.transform(inputCopies[i], require_config.patchConfig(options, {
                callbacks: runManager?.getChild(`map:key:${key}`)
            }));
            return [
                key,
                gen.next().then((result)=>({
                        key,
                        gen,
                        result
                    }))
            ];
        }));
        while(tasks.size){
            const promise = Promise.race(tasks.values());
            const { key, result, gen } = await require_signal.raceWithSignal(promise, options?.signal);
            tasks.delete(key);
            if (!result.done) {
                yield {
                    [key]: result.value
                };
                tasks.set(key, gen.next().then((result$1)=>({
                        key,
                        gen,
                        result: result$1
                    })));
            }
        }
    }
    transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
    }
    async stream(input, options) {
        async function* generator() {
            yield input;
        }
        const config = require_config.ensureConfig(options);
        const wrappedGenerator = new require_utils_stream.AsyncGeneratorWithSetup({
            generator: this.transform(generator(), config),
            config
        });
        await wrappedGenerator.setup;
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
    }
};
/**
* A runnable that wraps a traced LangSmith function.
*/ var RunnableTraceable = class RunnableTraceable extends Runnable {
    lc_serializable = false;
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    func;
    constructor(fields){
        super(fields);
        if (!(0, langsmith_singletons_traceable.isTraceableFunction)(fields.func)) throw new Error("RunnableTraceable requires a function that is wrapped in traceable higher-order function");
        this.func = fields.func;
    }
    async invoke(input, options) {
        const [config] = this._getOptionsList(options ?? {}, 1);
        const callbacks = await require_config.getCallbackManagerForConfig(config);
        const promise = this.func(require_config.patchConfig(config, {
            callbacks
        }), input);
        return require_signal.raceWithSignal(promise, config?.signal);
    }
    async *_streamIterator(input, options) {
        const [config] = this._getOptionsList(options ?? {}, 1);
        const result = await this.invoke(input, options);
        if (require_iter.isAsyncIterable(result)) {
            for await (const item of result){
                config?.signal?.throwIfAborted();
                yield item;
            }
            return;
        }
        if (require_iter.isIterator(result)) {
            while(true){
                config?.signal?.throwIfAborted();
                const state = result.next();
                if (state.done) break;
                yield state.value;
            }
            return;
        }
        yield result;
    }
    static from(func) {
        return new RunnableTraceable({
            func
        });
    }
};
function assertNonTraceableFunction(func) {
    if ((0, langsmith_singletons_traceable.isTraceableFunction)(func)) throw new Error("RunnableLambda requires a function that is not wrapped in traceable higher-order function. This shouldn't happen.");
}
/**
* A runnable that wraps an arbitrary function that takes a single argument.
* @example
* ```typescript
* import { RunnableLambda } from "@langchain/core/runnables";
*
* const add = (input: { x: number; y: number }) => input.x + input.y;
*
* const multiply = (input: { value: number; multiplier: number }) =>
*   input.value * input.multiplier;
*
* // Create runnables for the functions
* const addLambda = RunnableLambda.from(add);
* const multiplyLambda = RunnableLambda.from(multiply);
*
* // Chain the lambdas for a mathematical operation
* const chainedLambda = addLambda.pipe((result) =>
*   multiplyLambda.invoke({ value: result, multiplier: 2 })
* );
*
* // Example invocation of the chainedLambda
* const result = await chainedLambda.invoke({ x: 2, y: 3 });
*
* // Will log "10" (since (2 + 3) * 2 = 10)
* ```
*/ var RunnableLambda = class RunnableLambda extends Runnable {
    static lc_name() {
        return "RunnableLambda";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    func;
    constructor(fields){
        if ((0, langsmith_singletons_traceable.isTraceableFunction)(fields.func)) return RunnableTraceable.from(fields.func);
        super(fields);
        assertNonTraceableFunction(fields.func);
        this.func = fields.func;
    }
    static from(func) {
        return new RunnableLambda({
            func
        });
    }
    async _invoke(input, config, runManager) {
        return new Promise((resolve, reject)=>{
            const childConfig = require_config.patchConfig(config, {
                callbacks: runManager?.getChild(),
                recursionLimit: (config?.recursionLimit ?? require_config.DEFAULT_RECURSION_LIMIT) - 1
            });
            require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(childConfig), async ()=>{
                try {
                    let output = await this.func(input, {
                        ...childConfig
                    });
                    if (output && Runnable.isRunnable(output)) {
                        if (config?.recursionLimit === 0) throw new Error("Recursion limit reached.");
                        output = await output.invoke(input, {
                            ...childConfig,
                            recursionLimit: (childConfig.recursionLimit ?? require_config.DEFAULT_RECURSION_LIMIT) - 1
                        });
                    } else if (require_iter.isAsyncIterable(output)) {
                        let finalOutput;
                        for await (const chunk of require_iter.consumeAsyncIterableInContext(childConfig, output)){
                            config?.signal?.throwIfAborted();
                            if (finalOutput === void 0) finalOutput = chunk;
                            else try {
                                finalOutput = this._concatOutputChunks(finalOutput, chunk);
                            } catch  {
                                finalOutput = chunk;
                            }
                        }
                        output = finalOutput;
                    } else if (require_iter.isIterableIterator(output)) {
                        let finalOutput;
                        for (const chunk of require_iter.consumeIteratorInContext(childConfig, output)){
                            config?.signal?.throwIfAborted();
                            if (finalOutput === void 0) finalOutput = chunk;
                            else try {
                                finalOutput = this._concatOutputChunks(finalOutput, chunk);
                            } catch  {
                                finalOutput = chunk;
                            }
                        }
                        output = finalOutput;
                    }
                    resolve(output);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    async invoke(input, options) {
        return this._callWithConfig(this._invoke.bind(this), input, options);
    }
    async *_transform(generator, runManager, config) {
        let finalChunk;
        for await (const chunk of generator)if (finalChunk === void 0) finalChunk = chunk;
        else try {
            finalChunk = this._concatOutputChunks(finalChunk, chunk);
        } catch  {
            finalChunk = chunk;
        }
        const childConfig = require_config.patchConfig(config, {
            callbacks: runManager?.getChild(),
            recursionLimit: (config?.recursionLimit ?? require_config.DEFAULT_RECURSION_LIMIT) - 1
        });
        const output = await new Promise((resolve, reject)=>{
            require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(childConfig), async ()=>{
                try {
                    const res = await this.func(finalChunk, {
                        ...childConfig,
                        config: childConfig
                    });
                    resolve(res);
                } catch (e) {
                    reject(e);
                }
            });
        });
        if (output && Runnable.isRunnable(output)) {
            if (config?.recursionLimit === 0) throw new Error("Recursion limit reached.");
            const stream = await output.stream(finalChunk, childConfig);
            for await (const chunk of stream)yield chunk;
        } else if (require_iter.isAsyncIterable(output)) for await (const chunk of require_iter.consumeAsyncIterableInContext(childConfig, output)){
            config?.signal?.throwIfAborted();
            yield chunk;
        }
        else if (require_iter.isIterableIterator(output)) for (const chunk of require_iter.consumeIteratorInContext(childConfig, output)){
            config?.signal?.throwIfAborted();
            yield chunk;
        }
        else yield output;
    }
    transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
    }
    async stream(input, options) {
        async function* generator() {
            yield input;
        }
        const config = require_config.ensureConfig(options);
        const wrappedGenerator = new require_utils_stream.AsyncGeneratorWithSetup({
            generator: this.transform(generator(), config),
            config
        });
        await wrappedGenerator.setup;
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
    }
};
/**
* A runnable that runs a mapping of runnables in parallel,
* and returns a mapping of their outputs.
* @example
* ```typescript
* import {
*   RunnableLambda,
*   RunnableParallel,
* } from "@langchain/core/runnables";
*
* const addYears = (age: number): number => age + 5;
* const yearsToFifty = (age: number): number => 50 - age;
* const yearsToHundred = (age: number): number => 100 - age;
*
* const addYearsLambda = RunnableLambda.from(addYears);
* const milestoneFiftyLambda = RunnableLambda.from(yearsToFifty);
* const milestoneHundredLambda = RunnableLambda.from(yearsToHundred);
*
* // Pipe will coerce objects into RunnableParallel by default, but we
* // explicitly instantiate one here to demonstrate
* const sequence = addYearsLambda.pipe(
*   RunnableParallel.from({
*     years_to_fifty: milestoneFiftyLambda,
*     years_to_hundred: milestoneHundredLambda,
*   })
* );
*
* // Invoke the sequence with a single age input
* const res = await sequence.invoke(25);
*
* // { years_to_fifty: 20, years_to_hundred: 70 }
* ```
*/ var RunnableParallel = class extends RunnableMap {
};
/**
* A Runnable that can fallback to other Runnables if it fails.
* External APIs (e.g., APIs for a language model) may at times experience
* degraded performance or even downtime.
*
* In these cases, it can be useful to have a fallback Runnable that can be
* used in place of the original Runnable (e.g., fallback to another LLM provider).
*
* Fallbacks can be defined at the level of a single Runnable, or at the level
* of a chain of Runnables. Fallbacks are tried in order until one succeeds or
* all fail.
*
* While you can instantiate a `RunnableWithFallbacks` directly, it is usually
* more convenient to use the `withFallbacks` method on an existing Runnable.
*
* When streaming, fallbacks will only be called on failures during the initial
* stream creation. Errors that occur after a stream starts will not fallback
* to the next Runnable.
*
* @example
* ```typescript
* import {
*   RunnableLambda,
*   RunnableWithFallbacks,
* } from "@langchain/core/runnables";
*
* const primaryOperation = (input: string): string => {
*   if (input !== "safe") {
*     throw new Error("Primary operation failed due to unsafe input");
*   }
*   return `Processed: ${input}`;
* };
*
* // Define a fallback operation that processes the input differently
* const fallbackOperation = (input: string): string =>
*   `Fallback processed: ${input}`;
*
* const primaryRunnable = RunnableLambda.from(primaryOperation);
* const fallbackRunnable = RunnableLambda.from(fallbackOperation);
*
* // Apply the fallback logic using the .withFallbacks() method
* const runnableWithFallback = primaryRunnable.withFallbacks([fallbackRunnable]);
*
* // Alternatively, create a RunnableWithFallbacks instance manually
* const manualFallbackChain = new RunnableWithFallbacks({
*   runnable: primaryRunnable,
*   fallbacks: [fallbackRunnable],
* });
*
* // Example invocation using .withFallbacks()
* const res = await runnableWithFallback
*   .invoke("unsafe input")
*   .catch((error) => {
*     console.error("Failed after all attempts:", error.message);
*   });
*
* // "Fallback processed: unsafe input"
*
* // Example invocation using manual instantiation
* const res = await manualFallbackChain
*   .invoke("safe")
*   .catch((error) => {
*     console.error("Failed after all attempts:", error.message);
*   });
*
* // "Processed: safe"
* ```
*/ var RunnableWithFallbacks = class extends Runnable {
    static lc_name() {
        return "RunnableWithFallbacks";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    lc_serializable = true;
    runnable;
    fallbacks;
    constructor(fields){
        super(fields);
        this.runnable = fields.runnable;
        this.fallbacks = fields.fallbacks;
    }
    *runnables() {
        yield this.runnable;
        for (const fallback of this.fallbacks)yield fallback;
    }
    async invoke(input, options) {
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const { runId, ...otherConfigFields } = config;
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherConfigFields?.runName);
        const childConfig = require_config.patchConfig(otherConfigFields, {
            callbacks: runManager?.getChild()
        });
        const res = await require_index.AsyncLocalStorageProviderSingleton.runWithConfig(childConfig, async ()=>{
            let firstError;
            for (const runnable of this.runnables()){
                config?.signal?.throwIfAborted();
                try {
                    const output = await runnable.invoke(input, childConfig);
                    await runManager?.handleChainEnd(_coerceToDict(output, "output"));
                    return output;
                } catch (e) {
                    if (firstError === void 0) firstError = e;
                }
            }
            if (firstError === void 0) throw new Error("No error stored at end of fallback.");
            await runManager?.handleChainError(firstError);
            throw firstError;
        });
        return res;
    }
    async *_streamIterator(input, options) {
        const config = require_config.ensureConfig(options);
        const callbackManager_ = await require_config.getCallbackManagerForConfig(config);
        const { runId, ...otherConfigFields } = config;
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict(input, "input"), runId, void 0, void 0, void 0, otherConfigFields?.runName);
        let firstError;
        let stream;
        for (const runnable of this.runnables()){
            config?.signal?.throwIfAborted();
            const childConfig = require_config.patchConfig(otherConfigFields, {
                callbacks: runManager?.getChild()
            });
            try {
                const originalStream = await runnable.stream(input, childConfig);
                stream = require_iter.consumeAsyncIterableInContext(childConfig, originalStream);
                break;
            } catch (e) {
                if (firstError === void 0) firstError = e;
            }
        }
        if (stream === void 0) {
            const error = firstError ?? /* @__PURE__ */ new Error("No error stored at end of fallback.");
            await runManager?.handleChainError(error);
            throw error;
        }
        let output;
        try {
            for await (const chunk of stream){
                yield chunk;
                try {
                    output = output === void 0 ? output : this._concatOutputChunks(output, chunk);
                } catch  {
                    output = void 0;
                }
            }
        } catch (e) {
            await runManager?.handleChainError(e);
            throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict(output, "output"));
    }
    async batch(inputs, options, batchOptions) {
        if (batchOptions?.returnExceptions) throw new Error("Not implemented.");
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(configList.map((config)=>require_config.getCallbackManagerForConfig(config)));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i)=>{
            const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName);
            delete configList[i].runId;
            return handleStartRes;
        }));
        let firstError;
        for (const runnable of this.runnables()){
            configList[0].signal?.throwIfAborted();
            try {
                const outputs = await runnable.batch(inputs, runManagers.map((runManager, j)=>require_config.patchConfig(configList[j], {
                        callbacks: runManager?.getChild()
                    })), batchOptions);
                await Promise.all(runManagers.map((runManager, i)=>runManager?.handleChainEnd(_coerceToDict(outputs[i], "output"))));
                return outputs;
            } catch (e) {
                if (firstError === void 0) firstError = e;
            }
        }
        if (!firstError) throw new Error("No error stored at end of fallbacks.");
        await Promise.all(runManagers.map((runManager)=>runManager?.handleChainError(firstError)));
        throw firstError;
    }
};
function _coerceToRunnable(coerceable) {
    if (typeof coerceable === "function") return new RunnableLambda({
        func: coerceable
    });
    else if (Runnable.isRunnable(coerceable)) return coerceable;
    else if (!Array.isArray(coerceable) && typeof coerceable === "object") {
        const runnables = {};
        for (const [key, value] of Object.entries(coerceable))runnables[key] = _coerceToRunnable(value);
        return new RunnableMap({
            steps: runnables
        });
    } else throw new Error(`Expected a Runnable, function or object.\nInstead got an unsupported type.`);
}
/**
* A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
* @example
* ```typescript
* import {
*   RunnableAssign,
*   RunnableLambda,
*   RunnableParallel,
* } from "@langchain/core/runnables";
*
* const calculateAge = (x: { birthYear: number }): { age: number } => {
*   const currentYear = new Date().getFullYear();
*   return { age: currentYear - x.birthYear };
* };
*
* const createGreeting = (x: { name: string }): { greeting: string } => {
*   return { greeting: `Hello, ${x.name}!` };
* };
*
* const mapper = RunnableParallel.from({
*   age_step: RunnableLambda.from(calculateAge),
*   greeting_step: RunnableLambda.from(createGreeting),
* });
*
* const runnableAssign = new RunnableAssign({ mapper });
*
* const res = await runnableAssign.invoke({ name: "Alice", birthYear: 1990 });
*
* // { name: "Alice", birthYear: 1990, age_step: { age: 34 }, greeting_step: { greeting: "Hello, Alice!" } }
* ```
*/ var RunnableAssign = class extends Runnable {
    static lc_name() {
        return "RunnableAssign";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    lc_serializable = true;
    mapper;
    constructor(fields){
        if (fields instanceof RunnableMap) fields = {
            mapper: fields
        };
        super(fields);
        this.mapper = fields.mapper;
    }
    async invoke(input, options) {
        const mapperResult = await this.mapper.invoke(input, options);
        return {
            ...input,
            ...mapperResult
        };
    }
    async *_transform(generator, runManager, options) {
        const mapperKeys = this.mapper.getStepsKeys();
        const [forPassthrough, forMapper] = require_utils_stream.atee(generator);
        const mapperOutput = this.mapper.transform(forMapper, require_config.patchConfig(options, {
            callbacks: runManager?.getChild()
        }));
        const firstMapperChunkPromise = mapperOutput.next();
        for await (const chunk of forPassthrough){
            if (typeof chunk !== "object" || Array.isArray(chunk)) throw new Error(`RunnableAssign can only be used with objects as input, got ${typeof chunk}`);
            const filtered = Object.fromEntries(Object.entries(chunk).filter(([key])=>!mapperKeys.includes(key)));
            if (Object.keys(filtered).length > 0) yield filtered;
        }
        yield (await firstMapperChunkPromise).value;
        for await (const chunk of mapperOutput)yield chunk;
    }
    transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
    }
    async stream(input, options) {
        async function* generator() {
            yield input;
        }
        const config = require_config.ensureConfig(options);
        const wrappedGenerator = new require_utils_stream.AsyncGeneratorWithSetup({
            generator: this.transform(generator(), config),
            config
        });
        await wrappedGenerator.setup;
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
    }
};
/**
* A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
* Useful for streaming, can be automatically created and chained by calling `runnable.pick();`.
* @example
* ```typescript
* import { RunnablePick } from "@langchain/core/runnables";
*
* const inputData = {
*   name: "John",
*   age: 30,
*   city: "New York",
*   country: "USA",
*   email: "john.doe@example.com",
*   phone: "+1234567890",
* };
*
* const basicInfoRunnable = new RunnablePick(["name", "city"]);
*
* // Example invocation
* const res = await basicInfoRunnable.invoke(inputData);
*
* // { name: 'John', city: 'New York' }
* ```
*/ var RunnablePick = class extends Runnable {
    static lc_name() {
        return "RunnablePick";
    }
    lc_namespace = [
        "langchain_core",
        "runnables"
    ];
    lc_serializable = true;
    keys;
    constructor(fields){
        if (typeof fields === "string" || Array.isArray(fields)) fields = {
            keys: fields
        };
        super(fields);
        this.keys = fields.keys;
    }
    async _pick(input) {
        if (typeof this.keys === "string") return input[this.keys];
        else {
            const picked = this.keys.map((key)=>[
                    key,
                    input[key]
                ]).filter((v)=>v[1] !== void 0);
            return picked.length === 0 ? void 0 : Object.fromEntries(picked);
        }
    }
    async invoke(input, options) {
        return this._callWithConfig(this._pick.bind(this), input, options);
    }
    async *_transform(generator) {
        for await (const chunk of generator){
            const picked = await this._pick(chunk);
            if (picked !== void 0) yield picked;
        }
    }
    transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
    }
    async stream(input, options) {
        async function* generator() {
            yield input;
        }
        const config = require_config.ensureConfig(options);
        const wrappedGenerator = new require_utils_stream.AsyncGeneratorWithSetup({
            generator: this.transform(generator(), config),
            config
        });
        await wrappedGenerator.setup;
        return require_utils_stream.IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
    }
};
var RunnableToolLike = class extends RunnableBinding {
    name;
    description;
    schema;
    constructor(fields){
        const sequence = RunnableSequence.from([
            RunnableLambda.from(async (input)=>{
                let toolInput;
                if (require_utils._isToolCall(input)) try {
                    toolInput = await require_zod.interopParseAsync(this.schema, input.args);
                } catch  {
                    throw new require_utils.ToolInputParsingException(`Received tool input did not match expected schema`, JSON.stringify(input.args));
                }
                else toolInput = input;
                return toolInput;
            }).withConfig({
                runName: `${fields.name}:parse_input`
            }),
            fields.bound
        ]).withConfig({
            runName: fields.name
        });
        super({
            bound: sequence,
            config: fields.config ?? {}
        });
        this.name = fields.name;
        this.description = fields.description;
        this.schema = fields.schema;
    }
    static lc_name() {
        return "RunnableToolLike";
    }
};
/**
* Given a runnable and a Zod schema, convert the runnable to a tool.
*
* @template RunInput The input type for the runnable.
* @template RunOutput The output type for the runnable.
*
* @param {Runnable<RunInput, RunOutput>} runnable The runnable to convert to a tool.
* @param fields
* @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
* @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
* @param {InteropZodType<RunInput>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
* @returns {RunnableToolLike<InteropZodType<RunInput>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
*/ function convertRunnableToTool(runnable, fields) {
    const name = fields.name ?? runnable.getName();
    const description = fields.description ?? require_zod.getSchemaDescription(fields.schema);
    if (require_zod.isSimpleStringZodSchema(fields.schema)) return new RunnableToolLike({
        name,
        description,
        schema: zod_v3.z.object({
            input: zod_v3.z.string()
        }).transform((input)=>input.input),
        bound: runnable
    });
    return new RunnableToolLike({
        name,
        description,
        schema: fields.schema,
        bound: runnable
    });
}
//#endregion
exports.Runnable = Runnable;
exports.RunnableAssign = RunnableAssign;
exports.RunnableBinding = RunnableBinding;
exports.RunnableEach = RunnableEach;
exports.RunnableLambda = RunnableLambda;
exports.RunnableMap = RunnableMap;
exports.RunnableParallel = RunnableParallel;
exports.RunnablePick = RunnablePick;
exports.RunnableRetry = RunnableRetry;
exports.RunnableSequence = RunnableSequence;
exports.RunnableToolLike = RunnableToolLike;
exports.RunnableWithFallbacks = RunnableWithFallbacks;
exports._coerceToDict = _coerceToDict;
exports._coerceToRunnable = _coerceToRunnable; //# sourceMappingURL=base.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/prompt_values.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_load_serializable = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/load/serializable.cjs [app-route] (ecmascript)");
const require_human = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/human.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)");
//#region src/prompt_values.ts
var prompt_values_exports = {};
require_rolldown_runtime.__export(prompt_values_exports, {
    BasePromptValue: ()=>BasePromptValue,
    ChatPromptValue: ()=>ChatPromptValue,
    ImagePromptValue: ()=>ImagePromptValue,
    StringPromptValue: ()=>StringPromptValue
});
/**
* Base PromptValue class. All prompt values should extend this class.
*/ var BasePromptValue = class extends require_load_serializable.Serializable {
};
/**
* Represents a prompt value as a string. It extends the BasePromptValue
* class and overrides the toString and toChatMessages methods.
*/ var StringPromptValue = class extends BasePromptValue {
    static lc_name() {
        return "StringPromptValue";
    }
    lc_namespace = [
        "langchain_core",
        "prompt_values"
    ];
    lc_serializable = true;
    value;
    constructor(value){
        super({
            value
        });
        this.value = value;
    }
    toString() {
        return this.value;
    }
    toChatMessages() {
        return [
            new require_human.HumanMessage(this.value)
        ];
    }
};
/**
* Class that represents a chat prompt value. It extends the
* BasePromptValue and includes an array of BaseMessage instances.
*/ var ChatPromptValue = class extends BasePromptValue {
    lc_namespace = [
        "langchain_core",
        "prompt_values"
    ];
    lc_serializable = true;
    static lc_name() {
        return "ChatPromptValue";
    }
    messages;
    constructor(fields){
        if (Array.isArray(fields)) fields = {
            messages: fields
        };
        super(fields);
        this.messages = fields.messages;
    }
    toString() {
        return require_utils.getBufferString(this.messages);
    }
    toChatMessages() {
        return this.messages;
    }
};
/**
* Class that represents an image prompt value. It extends the
* BasePromptValue and includes an ImageURL instance.
*/ var ImagePromptValue = class extends BasePromptValue {
    lc_namespace = [
        "langchain_core",
        "prompt_values"
    ];
    lc_serializable = true;
    static lc_name() {
        return "ImagePromptValue";
    }
    imageUrl;
    /** @ignore */ value;
    constructor(fields){
        if (!("imageUrl" in fields)) fields = {
            imageUrl: fields
        };
        super(fields);
        this.imageUrl = fields.imageUrl;
    }
    toString() {
        return this.imageUrl.url;
    }
    toChatMessages() {
        return [
            new require_human.HumanMessage({
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            detail: this.imageUrl.detail,
                            url: this.imageUrl.url
                        }
                    }
                ]
            })
        ];
    }
};
//#endregion
exports.BasePromptValue = BasePromptValue;
exports.ChatPromptValue = ChatPromptValue;
exports.ImagePromptValue = ImagePromptValue;
exports.StringPromptValue = StringPromptValue;
Object.defineProperty(exports, 'prompt_values_exports', {
    enumerable: true,
    get: function() {
        return prompt_values_exports;
    }
}); //# sourceMappingURL=prompt_values.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/js-sha256/hash.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

//#region src/utils/js-sha256/hash.ts
var HEX_CHARS = "0123456789abcdef".split("");
var EXTRA = [
    -2147483648,
    8388608,
    32768,
    128
];
var SHIFT = [
    24,
    16,
    8,
    0
];
var K = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
];
var blocks = [];
function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
    } else this.blocks = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    if (is224) {
        this.h0 = 3238371032;
        this.h1 = 914150663;
        this.h2 = 812702999;
        this.h3 = 4144912697;
        this.h4 = 4290775857;
        this.h5 = 1750603025;
        this.h6 = 1694076839;
        this.h7 = 3204075428;
    } else {
        this.h0 = 1779033703;
        this.h1 = 3144134277;
        this.h2 = 1013904242;
        this.h3 = 2773480762;
        this.h4 = 1359893119;
        this.h5 = 2600822924;
        this.h6 = 528734635;
        this.h7 = 1541459225;
    }
    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
}
Sha256.prototype.update = function(message) {
    if (this.finalized) return;
    var notString, type = typeof message;
    if (type !== "string") {
        if (type === "object") {
            if (message === null) throw new Error(ERROR);
            else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) message = new Uint8Array(message);
            else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) throw new Error(ERROR);
            }
        } else throw new Error(ERROR);
        notString = true;
    }
    var code, index = 0, i, length = message.length, blocks$1 = this.blocks;
    while(index < length){
        if (this.hashed) {
            this.hashed = false;
            blocks$1[0] = this.block;
            this.block = blocks$1[16] = blocks$1[1] = blocks$1[2] = blocks$1[3] = blocks$1[4] = blocks$1[5] = blocks$1[6] = blocks$1[7] = blocks$1[8] = blocks$1[9] = blocks$1[10] = blocks$1[11] = blocks$1[12] = blocks$1[13] = blocks$1[14] = blocks$1[15] = 0;
        }
        if (notString) for(i = this.start; index < length && i < 64; ++index)blocks$1[i >>> 2] |= message[index] << SHIFT[i++ & 3];
        else for(i = this.start; index < length && i < 64; ++index){
            code = message.charCodeAt(index);
            if (code < 128) blocks$1[i >>> 2] |= code << SHIFT[i++ & 3];
            else if (code < 2048) {
                blocks$1[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            } else if (code < 55296 || code >= 57344) {
                blocks$1[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                blocks$1[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks$1[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            }
        }
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 64) {
            this.block = blocks$1[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
        } else this.start = i;
    }
    if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
    }
    return this;
};
Sha256.prototype.finalize = function() {
    if (this.finalized) return;
    this.finalized = true;
    var blocks$1 = this.blocks, i = this.lastByteIndex;
    blocks$1[16] = this.block;
    blocks$1[i >>> 2] |= EXTRA[i & 3];
    this.block = blocks$1[16];
    if (i >= 56) {
        if (!this.hashed) this.hash();
        blocks$1[0] = this.block;
        blocks$1[16] = blocks$1[1] = blocks$1[2] = blocks$1[3] = blocks$1[4] = blocks$1[5] = blocks$1[6] = blocks$1[7] = blocks$1[8] = blocks$1[9] = blocks$1[10] = blocks$1[11] = blocks$1[12] = blocks$1[13] = blocks$1[14] = blocks$1[15] = 0;
    }
    blocks$1[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks$1[15] = this.bytes << 3;
    this.hash();
};
Sha256.prototype.hash = function() {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks$1 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
    for(j = 16; j < 64; ++j){
        t1 = blocks$1[j - 15];
        s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
        t1 = blocks$1[j - 2];
        s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
        blocks$1[j] = blocks$1[j - 16] + s0 + blocks$1[j - 7] + s1 << 0;
    }
    bc = b & c;
    for(j = 0; j < 64; j += 4){
        if (this.first) {
            if (this.is224) {
                ab = 300032;
                t1 = blocks$1[0] - 1413257819;
                h = t1 - 150054599 << 0;
                d = t1 + 24177077 << 0;
            } else {
                ab = 704751109;
                t1 = blocks$1[0] - 210244248;
                h = t1 - 1521486534 << 0;
                d = t1 + 143694565 << 0;
            }
            this.first = false;
        } else {
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ab = a & b;
            maj = ab ^ a & c ^ bc;
            ch = e & f ^ ~e & g;
            t1 = h + s1 + ch + K[j] + blocks$1[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
        }
        s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
        s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
        da = d & a;
        maj = da ^ d & b ^ ab;
        ch = g & h ^ ~g & e;
        t1 = f + s1 + ch + K[j + 1] + blocks$1[j + 1];
        t2 = s0 + maj;
        g = c + t1 << 0;
        c = t1 + t2 << 0;
        s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
        s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
        cd = c & d;
        maj = cd ^ c & a ^ da;
        ch = f & g ^ ~f & h;
        t1 = e + s1 + ch + K[j + 2] + blocks$1[j + 2];
        t2 = s0 + maj;
        f = b + t1 << 0;
        b = t1 + t2 << 0;
        s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
        s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
        bc = b & c;
        maj = bc ^ b & d ^ cd;
        ch = f & g ^ ~f & h;
        t1 = e + s1 + ch + K[j + 3] + blocks$1[j + 3];
        t2 = s0 + maj;
        e = a + t1 << 0;
        a = t1 + t2 << 0;
        this.chromeBugWorkAround = true;
    }
    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
};
Sha256.prototype.hex = function() {
    this.finalize();
    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
    var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
    if (!this.is224) hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
    return hex;
};
Sha256.prototype.toString = Sha256.prototype.hex;
Sha256.prototype.digest = function() {
    this.finalize();
    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
    var arr = [
        h0 >>> 24 & 255,
        h0 >>> 16 & 255,
        h0 >>> 8 & 255,
        h0 & 255,
        h1 >>> 24 & 255,
        h1 >>> 16 & 255,
        h1 >>> 8 & 255,
        h1 & 255,
        h2 >>> 24 & 255,
        h2 >>> 16 & 255,
        h2 >>> 8 & 255,
        h2 & 255,
        h3 >>> 24 & 255,
        h3 >>> 16 & 255,
        h3 >>> 8 & 255,
        h3 & 255,
        h4 >>> 24 & 255,
        h4 >>> 16 & 255,
        h4 >>> 8 & 255,
        h4 & 255,
        h5 >>> 24 & 255,
        h5 >>> 16 & 255,
        h5 >>> 8 & 255,
        h5 & 255,
        h6 >>> 24 & 255,
        h6 >>> 16 & 255,
        h6 >>> 8 & 255,
        h6 & 255
    ];
    if (!this.is224) arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
    return arr;
};
Sha256.prototype.array = Sha256.prototype.digest;
Sha256.prototype.arrayBuffer = function() {
    this.finalize();
    var buffer = /* @__PURE__ */ new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) dataView.setUint32(28, this.h7);
    return buffer;
};
const sha256 = (...strings)=>{
    return new Sha256(false, true).update(strings.join("")).hex();
};
//#endregion
exports.sha256 = sha256; //# sourceMappingURL=hash.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/hash.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_hash = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/js-sha256/hash.cjs [app-route] (ecmascript)");
//#region src/utils/hash.ts
var hash_exports = {};
require_rolldown_runtime.__export(hash_exports, {
    sha256: ()=>require_hash.sha256
});
//#endregion
Object.defineProperty(exports, 'hash_exports', {
    enumerable: true,
    get: function() {
        return hash_exports;
    }
});
exports.sha256 = require_hash.sha256; //# sourceMappingURL=hash.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/caches/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)");
const require_hash = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/js-sha256/hash.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/hash.cjs [app-route] (ecmascript)");
//#region src/caches/index.ts
var caches_exports = {};
require_rolldown_runtime.__export(caches_exports, {
    BaseCache: ()=>BaseCache,
    InMemoryCache: ()=>InMemoryCache,
    defaultHashKeyEncoder: ()=>defaultHashKeyEncoder,
    deserializeStoredGeneration: ()=>deserializeStoredGeneration,
    serializeGeneration: ()=>serializeGeneration
});
const defaultHashKeyEncoder = (...strings)=>require_hash.sha256(strings.join("_"));
function deserializeStoredGeneration(storedGeneration) {
    if (storedGeneration.message !== void 0) return {
        text: storedGeneration.text,
        message: require_utils.mapStoredMessageToChatMessage(storedGeneration.message)
    };
    else return {
        text: storedGeneration.text
    };
}
function serializeGeneration(generation) {
    const serializedValue = {
        text: generation.text
    };
    if (generation.message !== void 0) serializedValue.message = generation.message.toDict();
    return serializedValue;
}
/**
* Base class for all caches. All caches should extend this class.
*/ var BaseCache = class {
    keyEncoder = defaultHashKeyEncoder;
    /**
	* Sets a custom key encoder function for the cache.
	* This function should take a prompt and an LLM key and return a string
	* that will be used as the cache key.
	* @param keyEncoderFn The custom key encoder function.
	*/ makeDefaultKeyEncoder(keyEncoderFn) {
        this.keyEncoder = keyEncoderFn;
    }
};
const GLOBAL_MAP = /* @__PURE__ */ new Map();
/**
* A cache for storing LLM generations that stores data in memory.
*/ var InMemoryCache = class InMemoryCache extends BaseCache {
    cache;
    constructor(map){
        super();
        this.cache = map ?? /* @__PURE__ */ new Map();
    }
    /**
	* Retrieves data from the cache using a prompt and an LLM key. If the
	* data is not found, it returns null.
	* @param prompt The prompt used to find the data.
	* @param llmKey The LLM key used to find the data.
	* @returns The data corresponding to the prompt and LLM key, or null if not found.
	*/ lookup(prompt, llmKey) {
        return Promise.resolve(this.cache.get(this.keyEncoder(prompt, llmKey)) ?? null);
    }
    /**
	* Updates the cache with new data using a prompt and an LLM key.
	* @param prompt The prompt used to store the data.
	* @param llmKey The LLM key used to store the data.
	* @param value The data to be stored.
	*/ async update(prompt, llmKey, value) {
        this.cache.set(this.keyEncoder(prompt, llmKey), value);
    }
    /**
	* Returns a global instance of InMemoryCache using a predefined global
	* map as the initial cache.
	* @returns A global instance of InMemoryCache.
	*/ static global() {
        return new InMemoryCache(GLOBAL_MAP);
    }
};
//#endregion
exports.BaseCache = BaseCache;
exports.InMemoryCache = InMemoryCache;
Object.defineProperty(exports, 'caches_exports', {
    enumerable: true,
    get: function() {
        return caches_exports;
    }
});
exports.defaultHashKeyEncoder = defaultHashKeyEncoder;
exports.deserializeStoredGeneration = deserializeStoredGeneration;
exports.serializeGeneration = serializeGeneration; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/tiktoken.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils_async_caller = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/async_caller.cjs [app-route] (ecmascript)");
const js_tiktoken_lite = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/js-tiktoken/dist/lite.cjs [app-route] (ecmascript)"));
//#region src/utils/tiktoken.ts
var tiktoken_exports = {};
require_rolldown_runtime.__export(tiktoken_exports, {
    encodingForModel: ()=>encodingForModel,
    getEncoding: ()=>getEncoding
});
const cache = {};
const caller = /* @__PURE__ */ new require_utils_async_caller.AsyncCaller({});
async function getEncoding(encoding) {
    if (!(encoding in cache)) cache[encoding] = caller.fetch(`https://tiktoken.pages.dev/js/${encoding}.json`).then((res)=>res.json()).then((data)=>new js_tiktoken_lite.Tiktoken(data)).catch((e)=>{
        delete cache[encoding];
        throw e;
    });
    return await cache[encoding];
}
async function encodingForModel(model) {
    return getEncoding((0, js_tiktoken_lite.getEncodingNameForModel)(model));
}
//#endregion
exports.encodingForModel = encodingForModel;
exports.getEncoding = getEncoding;
Object.defineProperty(exports, 'tiktoken_exports', {
    enumerable: true,
    get: function() {
        return tiktoken_exports;
    }
}); //# sourceMappingURL=tiktoken.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/language_models/base.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/utils.cjs [app-route] (ecmascript)");
const require_utils_async_caller = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/async_caller.cjs [app-route] (ecmascript)");
const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/base.cjs [app-route] (ecmascript)");
const require_prompt_values = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/prompt_values.cjs [app-route] (ecmascript)");
const require_caches_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/caches/index.cjs [app-route] (ecmascript)");
const require_utils_tiktoken = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/tiktoken.cjs [app-route] (ecmascript)");
//#region src/language_models/base.ts
var base_exports = {};
require_rolldown_runtime.__export(base_exports, {
    BaseLangChain: ()=>BaseLangChain,
    BaseLanguageModel: ()=>BaseLanguageModel,
    calculateMaxTokens: ()=>calculateMaxTokens,
    getEmbeddingContextSize: ()=>getEmbeddingContextSize,
    getModelContextSize: ()=>getModelContextSize,
    getModelNameForTiktoken: ()=>getModelNameForTiktoken,
    isOpenAITool: ()=>isOpenAITool
});
const getModelNameForTiktoken = (modelName)=>{
    if (modelName.startsWith("gpt-5")) return "gpt-5";
    if (modelName.startsWith("gpt-3.5-turbo-16k")) return "gpt-3.5-turbo-16k";
    if (modelName.startsWith("gpt-3.5-turbo-")) return "gpt-3.5-turbo";
    if (modelName.startsWith("gpt-4-32k")) return "gpt-4-32k";
    if (modelName.startsWith("gpt-4-")) return "gpt-4";
    if (modelName.startsWith("gpt-4o")) return "gpt-4o";
    return modelName;
};
const getEmbeddingContextSize = (modelName)=>{
    switch(modelName){
        case "text-embedding-ada-002":
            return 8191;
        default:
            return 2046;
    }
};
/**
* Get the context window size (max input tokens) for a given model.
*
* Context window sizes are sourced from official model documentation:
* - OpenAI: https://platform.openai.com/docs/models
* - Anthropic: https://docs.anthropic.com/claude/docs/models-overview
* - Google: https://ai.google.dev/gemini/docs/models/gemini
*
* @param modelName - The name of the model
* @returns The context window size in tokens
*/ const getModelContextSize = (modelName)=>{
    const normalizedName = getModelNameForTiktoken(modelName);
    switch(normalizedName){
        case "gpt-5":
        case "gpt-5-turbo":
        case "gpt-5-turbo-preview":
            return 4e5;
        case "gpt-4o":
        case "gpt-4o-mini":
        case "gpt-4o-2024-05-13":
        case "gpt-4o-2024-08-06":
            return 128e3;
        case "gpt-4-turbo":
        case "gpt-4-turbo-preview":
        case "gpt-4-turbo-2024-04-09":
        case "gpt-4-0125-preview":
        case "gpt-4-1106-preview":
            return 128e3;
        case "gpt-4-32k":
        case "gpt-4-32k-0314":
        case "gpt-4-32k-0613":
            return 32768;
        case "gpt-4":
        case "gpt-4-0314":
        case "gpt-4-0613":
            return 8192;
        case "gpt-3.5-turbo-16k":
        case "gpt-3.5-turbo-16k-0613":
            return 16384;
        case "gpt-3.5-turbo":
        case "gpt-3.5-turbo-0301":
        case "gpt-3.5-turbo-0613":
        case "gpt-3.5-turbo-1106":
        case "gpt-3.5-turbo-0125":
            return 4096;
        case "text-davinci-003":
        case "text-davinci-002":
            return 4097;
        case "text-davinci-001":
            return 2049;
        case "text-curie-001":
        case "text-babbage-001":
        case "text-ada-001":
            return 2048;
        case "code-davinci-002":
        case "code-davinci-001":
            return 8e3;
        case "code-cushman-001":
            return 2048;
        case "claude-3-5-sonnet-20241022":
        case "claude-3-5-sonnet-20240620":
        case "claude-3-opus-20240229":
        case "claude-3-sonnet-20240229":
        case "claude-3-haiku-20240307":
        case "claude-2.1":
            return 2e5;
        case "claude-2.0":
        case "claude-instant-1.2":
            return 1e5;
        case "gemini-1.5-pro":
        case "gemini-1.5-pro-latest":
        case "gemini-1.5-flash":
        case "gemini-1.5-flash-latest":
            return 1e6;
        case "gemini-pro":
        case "gemini-pro-vision":
            return 32768;
        default:
            return 4097;
    }
};
/**
* Whether or not the input matches the OpenAI tool definition.
* @param {unknown} tool The input to check.
* @returns {boolean} Whether the input is an OpenAI tool definition.
*/ function isOpenAITool(tool) {
    if (typeof tool !== "object" || !tool) return false;
    if ("type" in tool && tool.type === "function" && "function" in tool && typeof tool.function === "object" && tool.function && "name" in tool.function && "parameters" in tool.function) return true;
    return false;
}
const calculateMaxTokens = async ({ prompt, modelName })=>{
    let numTokens;
    try {
        numTokens = (await require_utils_tiktoken.encodingForModel(getModelNameForTiktoken(modelName))).encode(prompt).length;
    } catch  {
        console.warn("Failed to calculate number of tokens, falling back to approximate count");
        numTokens = Math.ceil(prompt.length / 4);
    }
    const maxTokens = getModelContextSize(modelName);
    return maxTokens - numTokens;
};
const getVerbosity = ()=>false;
/**
* Base class for language models, chains, tools.
*/ var BaseLangChain = class extends require_base.Runnable {
    /**
	* Whether to print out response text.
	*/ verbose;
    callbacks;
    tags;
    metadata;
    get lc_attributes() {
        return {
            callbacks: void 0,
            verbose: void 0
        };
    }
    constructor(params){
        super(params);
        this.verbose = params.verbose ?? getVerbosity();
        this.callbacks = params.callbacks;
        this.tags = params.tags ?? [];
        this.metadata = params.metadata ?? {};
    }
};
/**
* Base class for language models.
*/ var BaseLanguageModel = class extends BaseLangChain {
    /**
	* Keys that the language model accepts as call options.
	*/ get callKeys() {
        return [
            "stop",
            "timeout",
            "signal",
            "tags",
            "metadata",
            "callbacks"
        ];
    }
    /**
	* The async caller should be used by subclasses to make any async calls,
	* which will thus benefit from the concurrency and retry logic.
	*/ caller;
    cache;
    constructor({ callbacks, callbackManager, ...params }){
        const { cache, ...rest } = params;
        super({
            callbacks: callbacks ?? callbackManager,
            ...rest
        });
        if (typeof cache === "object") this.cache = cache;
        else if (cache) this.cache = require_caches_index.InMemoryCache.global();
        else this.cache = void 0;
        this.caller = new require_utils_async_caller.AsyncCaller(params ?? {});
    }
    _encoding;
    /**
	* Get the number of tokens in the content.
	* @param content The content to get the number of tokens for.
	* @returns The number of tokens in the content.
	*/ async getNumTokens(content) {
        let textContent;
        if (typeof content === "string") textContent = content;
        else /**
		* Content is an array of ContentBlock
		*
		* ToDo(@christian-bromann): This is a temporary fix to get the number of tokens for the content.
		* We need to find a better way to do this.
		* @see https://github.com/langchain-ai/langchainjs/pull/8341#pullrequestreview-2933713116
		*/ textContent = content.map((item)=>{
            if (typeof item === "string") return item;
            if (item.type === "text" && "text" in item) return item.text;
            return "";
        }).join("");
        let numTokens = Math.ceil(textContent.length / 4);
        if (!this._encoding) try {
            this._encoding = await require_utils_tiktoken.encodingForModel("modelName" in this ? getModelNameForTiktoken(this.modelName) : "gpt2");
        } catch (error) {
            console.warn("Failed to calculate number of tokens, falling back to approximate count", error);
        }
        if (this._encoding) try {
            numTokens = this._encoding.encode(textContent).length;
        } catch (error) {
            console.warn("Failed to calculate number of tokens, falling back to approximate count", error);
        }
        return numTokens;
    }
    static _convertInputToPromptValue(input) {
        if (typeof input === "string") return new require_prompt_values.StringPromptValue(input);
        else if (Array.isArray(input)) return new require_prompt_values.ChatPromptValue(input.map(require_utils.coerceMessageLikeToMessage));
        else return input;
    }
    /**
	* Get the identifying parameters of the LLM.
	*/ _identifyingParams() {
        return {};
    }
    /**
	* Create a unique cache key for a specific call to a specific language model.
	* @param callOptions Call options for the model
	* @returns A unique cache key.
	*/ _getSerializedCacheKeyParametersForCall({ config, ...callOptions }) {
        const params = {
            ...this._identifyingParams(),
            ...callOptions,
            _type: this._llmType(),
            _model: this._modelType()
        };
        const filteredEntries = Object.entries(params).filter(([_, value])=>value !== void 0);
        const serializedEntries = filteredEntries.map(([key, value])=>`${key}:${JSON.stringify(value)}`).sort().join(",");
        return serializedEntries;
    }
    /**
	* @deprecated
	* Return a json-like object representing this LLM.
	*/ serialize() {
        return {
            ...this._identifyingParams(),
            _type: this._llmType(),
            _model: this._modelType()
        };
    }
    /**
	* @deprecated
	* Load an LLM from a json-like object describing it.
	*/ static async deserialize(_data) {
        throw new Error("Use .toJSON() instead");
    }
    /**
	* Return profiling information for the model.
	*
	* @returns {ModelProfile} An object describing the model's capabilities and constraints
	*/ get profile() {
        return {};
    }
};
//#endregion
exports.BaseLangChain = BaseLangChain;
exports.BaseLanguageModel = BaseLanguageModel;
Object.defineProperty(exports, 'base_exports', {
    enumerable: true,
    get: function() {
        return base_exports;
    }
});
exports.calculateMaxTokens = calculateMaxTokens;
exports.getEmbeddingContextSize = getEmbeddingContextSize;
exports.getModelContextSize = getModelContextSize;
exports.getModelNameForTiktoken = getModelNameForTiktoken;
exports.isOpenAITool = isOpenAITool; //# sourceMappingURL=base.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/types.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_zod = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/types/zod.cjs [app-route] (ecmascript)");
const require_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/base.cjs [app-route] (ecmascript)");
//#region src/tools/types.ts
/**
* Confirm whether the inputted tool is an instance of `StructuredToolInterface`.
*
* @param {StructuredToolInterface | JSONSchema | undefined} tool The tool to check if it is an instance of `StructuredToolInterface`.
* @returns {tool is StructuredToolInterface} Whether the inputted tool is an instance of `StructuredToolInterface`.
*/ function isStructuredTool(tool) {
    return tool !== void 0 && Array.isArray(tool.lc_namespace);
}
/**
* Confirm whether the inputted tool is an instance of `RunnableToolLike`.
*
* @param {unknown | undefined} tool The tool to check if it is an instance of `RunnableToolLike`.
* @returns {tool is RunnableToolLike} Whether the inputted tool is an instance of `RunnableToolLike`.
*/ function isRunnableToolLike(tool) {
    return tool !== void 0 && require_base.Runnable.isRunnable(tool) && "lc_name" in tool.constructor && typeof tool.constructor.lc_name === "function" && tool.constructor.lc_name() === "RunnableToolLike";
}
/**
* Confirm whether or not the tool contains the necessary properties to be considered a `StructuredToolParams`.
*
* @param {unknown | undefined} tool The object to check if it is a `StructuredToolParams`.
* @returns {tool is StructuredToolParams} Whether the inputted object is a `StructuredToolParams`.
*/ function isStructuredToolParams(tool) {
    return !!tool && typeof tool === "object" && "name" in tool && "schema" in tool && (require_zod.isInteropZodSchema(tool.schema) || tool.schema != null && typeof tool.schema === "object" && "type" in tool.schema && typeof tool.schema.type === "string" && [
        "null",
        "boolean",
        "object",
        "array",
        "number",
        "string"
    ].includes(tool.schema.type));
}
/**
* Whether or not the tool is one of StructuredTool, RunnableTool or StructuredToolParams.
* It returns `is StructuredToolParams` since that is the most minimal interface of the three,
* while still containing the necessary properties to be passed to a LLM for tool calling.
*
* @param {unknown | undefined} tool The tool to check if it is a LangChain tool.
* @returns {tool is StructuredToolParams} Whether the inputted tool is a LangChain tool.
*/ function isLangChainTool(tool) {
    return isStructuredToolParams(tool) || isRunnableToolLike(tool) || isStructuredTool(tool);
}
//#endregion
exports.isLangChainTool = isLangChainTool;
exports.isRunnableToolLike = isRunnableToolLike;
exports.isStructuredTool = isStructuredTool;
exports.isStructuredToolParams = isStructuredToolParams; //# sourceMappingURL=types.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const require_rolldown_runtime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/_virtual/rolldown_runtime.cjs [app-route] (ecmascript)");
const require_messages_tool = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/messages/tool.cjs [app-route] (ecmascript)");
const require_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/utils.cjs [app-route] (ecmascript)");
const require_callbacks_manager = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/callbacks/manager.cjs [app-route] (ecmascript)");
const require_index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/async_local_storage/index.cjs [app-route] (ecmascript)");
__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/singletons/index.cjs [app-route] (ecmascript)");
const require_config = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/runnables/config.cjs [app-route] (ecmascript)");
const require_signal = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/signal.cjs [app-route] (ecmascript)");
const require_zod = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/types/zod.cjs [app-route] (ecmascript)");
const require_utils_json_schema = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/utils/json_schema.cjs [app-route] (ecmascript)");
const require_language_models_base = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/language_models/base.cjs [app-route] (ecmascript)");
const require_types = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@langchain/core/dist/tools/types.cjs [app-route] (ecmascript)");
const zod_v3 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)"));
const __cfworker_json_schema = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/index.js [app-route] (ecmascript)"));
const zod_v4 = require_rolldown_runtime.__toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)"));
//#region src/tools/index.ts
var tools_exports = {};
require_rolldown_runtime.__export(tools_exports, {
    BaseToolkit: ()=>BaseToolkit,
    DynamicStructuredTool: ()=>DynamicStructuredTool,
    DynamicTool: ()=>DynamicTool,
    StructuredTool: ()=>StructuredTool,
    Tool: ()=>Tool,
    ToolInputParsingException: ()=>require_utils.ToolInputParsingException,
    isLangChainTool: ()=>require_types.isLangChainTool,
    isRunnableToolLike: ()=>require_types.isRunnableToolLike,
    isStructuredTool: ()=>require_types.isStructuredTool,
    isStructuredToolParams: ()=>require_types.isStructuredToolParams,
    tool: ()=>tool
});
/**
* Base class for Tools that accept input of any shape defined by a Zod schema.
*/ var StructuredTool = class extends require_language_models_base.BaseLangChain {
    /**
	* Optional provider-specific extra fields for the tool.
	*
	* This is used to pass provider-specific configuration that doesn't fit into
	* standard tool fields.
	*/ extras;
    /**
	* Whether to return the tool's output directly.
	*
	* Setting this to true means that after the tool is called,
	* an agent should stop looping.
	*/ returnDirect = false;
    verboseParsingErrors = false;
    get lc_namespace() {
        return [
            "langchain",
            "tools"
        ];
    }
    /**
	* The tool response format.
	*
	* If "content" then the output of the tool is interpreted as the contents of a
	* ToolMessage. If "content_and_artifact" then the output is expected to be a
	* two-tuple corresponding to the (content, artifact) of a ToolMessage.
	*
	* @default "content"
	*/ responseFormat = "content";
    /**
	* Default config object for the tool runnable.
	*/ defaultConfig;
    constructor(fields){
        super(fields ?? {});
        this.verboseParsingErrors = fields?.verboseParsingErrors ?? this.verboseParsingErrors;
        this.responseFormat = fields?.responseFormat ?? this.responseFormat;
        this.defaultConfig = fields?.defaultConfig ?? this.defaultConfig;
        this.metadata = fields?.metadata ?? this.metadata;
        this.extras = fields?.extras ?? this.extras;
    }
    /**
	* Invokes the tool with the provided input and configuration.
	* @param input The input for the tool.
	* @param config Optional configuration for the tool.
	* @returns A Promise that resolves with the tool's output.
	*/ async invoke(input, config) {
        let toolInput;
        let enrichedConfig = require_config.ensureConfig(require_config.mergeConfigs(this.defaultConfig, config));
        if (require_utils._isToolCall(input)) {
            toolInput = input.args;
            enrichedConfig = {
                ...enrichedConfig,
                toolCall: input
            };
        } else toolInput = input;
        return this.call(toolInput, enrichedConfig);
    }
    /**
	* @deprecated Use .invoke() instead. Will be removed in 0.3.0.
	*
	* Calls the tool with the provided argument, configuration, and tags. It
	* parses the input according to the schema, handles any errors, and
	* manages callbacks.
	* @param arg The input argument for the tool.
	* @param configArg Optional configuration or callbacks for the tool.
	* @param tags Optional tags for the tool.
	* @returns A Promise that resolves with a string.
	*/ async call(arg, configArg, tags) {
        const inputForValidation = require_utils._isToolCall(arg) ? arg.args : arg;
        let parsed;
        if (require_zod.isInteropZodSchema(this.schema)) try {
            parsed = await require_zod.interopParseAsync(this.schema, inputForValidation);
        } catch (e) {
            let message = `Received tool input did not match expected schema`;
            if (this.verboseParsingErrors) message = `${message}\nDetails: ${e.message}`;
            if (require_zod.isInteropZodError(e)) message = `${message}\n\n${zod_v4.z.prettifyError(e)}`;
            throw new require_utils.ToolInputParsingException(message, JSON.stringify(arg));
        }
        else {
            const result$1 = (0, __cfworker_json_schema.validate)(inputForValidation, this.schema);
            if (!result$1.valid) {
                let message = `Received tool input did not match expected schema`;
                if (this.verboseParsingErrors) message = `${message}\nDetails: ${result$1.errors.map((e)=>`${e.keywordLocation}: ${e.error}`).join("\n")}`;
                throw new require_utils.ToolInputParsingException(message, JSON.stringify(arg));
            }
            parsed = inputForValidation;
        }
        const config = require_callbacks_manager.parseCallbackConfigArg(configArg);
        const callbackManager_ = require_callbacks_manager.CallbackManager.configure(config.callbacks, this.callbacks, config.tags || tags, this.tags, config.metadata, this.metadata, {
            verbose: this.verbose
        });
        const runManager = await callbackManager_?.handleToolStart(this.toJSON(), typeof arg === "string" ? arg : JSON.stringify(arg), config.runId, void 0, void 0, void 0, config.runName);
        delete config.runId;
        let result;
        try {
            result = await this._call(parsed, runManager, config);
        } catch (e) {
            await runManager?.handleToolError(e);
            throw e;
        }
        let content;
        let artifact;
        if (this.responseFormat === "content_and_artifact") if (Array.isArray(result) && result.length === 2) [content, artifact] = result;
        else throw new Error(`Tool response format is "content_and_artifact" but the output was not a two-tuple.\nResult: ${JSON.stringify(result)}`);
        else content = result;
        let toolCallId;
        if (require_utils._isToolCall(arg)) toolCallId = arg.id;
        if (!toolCallId && require_utils._configHasToolCallId(config)) toolCallId = config.toolCall.id;
        const formattedOutput = _formatToolOutput({
            content,
            artifact,
            toolCallId,
            name: this.name,
            metadata: this.metadata
        });
        await runManager?.handleToolEnd(formattedOutput);
        return formattedOutput;
    }
};
/**
* Base class for Tools that accept input as a string.
*/ var Tool = class extends StructuredTool {
    schema = zod_v3.z.object({
        input: zod_v3.z.string().optional()
    }).transform((obj)=>obj.input);
    constructor(fields){
        super(fields);
    }
    /**
	* @deprecated Use .invoke() instead. Will be removed in 0.3.0.
	*
	* Calls the tool with the provided argument and callbacks. It handles
	* string inputs specifically.
	* @param arg The input argument for the tool, which can be a string, undefined, or an input of the tool's schema.
	* @param callbacks Optional callbacks for the tool.
	* @returns A Promise that resolves with a string.
	*/ call(arg, callbacks) {
        const structuredArg = typeof arg === "string" || arg == null ? {
            input: arg
        } : arg;
        return super.call(structuredArg, callbacks);
    }
};
/**
* A tool that can be created dynamically from a function, name, and description.
*/ var DynamicTool = class extends Tool {
    static lc_name() {
        return "DynamicTool";
    }
    name;
    description;
    func;
    constructor(fields){
        super(fields);
        this.name = fields.name;
        this.description = fields.description;
        this.func = fields.func;
        this.returnDirect = fields.returnDirect ?? this.returnDirect;
    }
    /**
	* @deprecated Use .invoke() instead. Will be removed in 0.3.0.
	*/ async call(arg, configArg) {
        const config = require_callbacks_manager.parseCallbackConfigArg(configArg);
        if (config.runName === void 0) config.runName = this.name;
        return super.call(arg, config);
    }
    /** @ignore */ async _call(input, runManager, parentConfig) {
        return this.func(input, runManager, parentConfig);
    }
};
/**
* A tool that can be created dynamically from a function, name, and
* description, designed to work with structured data. It extends the
* StructuredTool class and overrides the _call method to execute the
* provided function when the tool is called.
*
* Schema can be passed as Zod or JSON schema. The tool will not validate
* input if JSON schema is passed.
*
* @template SchemaT The input schema type for the tool (Zod schema or JSON schema). Defaults to `ToolInputSchemaBase`.
* @template SchemaOutputT The output type derived from the schema after parsing/validation. Defaults to `ToolInputSchemaOutputType<SchemaT>`.
* @template SchemaInputT The input type derived from the schema before parsing. Defaults to `ToolInputSchemaInputType<SchemaT>`.
* @template ToolOutputT The return type of the tool's function. Defaults to `ToolOutputType`.
* @template NameT The literal type of the tool name (for discriminated union support). Defaults to `string`.
*/ var DynamicStructuredTool = class extends StructuredTool {
    static lc_name() {
        return "DynamicStructuredTool";
    }
    description;
    func;
    schema;
    constructor(fields){
        super(fields);
        this.name = fields.name;
        this.description = fields.description;
        this.func = fields.func;
        this.returnDirect = fields.returnDirect ?? this.returnDirect;
        this.schema = fields.schema;
    }
    /**
	* @deprecated Use .invoke() instead. Will be removed in 0.3.0.
	*/ async call(arg, configArg, tags) {
        const config = require_callbacks_manager.parseCallbackConfigArg(configArg);
        if (config.runName === void 0) config.runName = this.name;
        return super.call(arg, config, tags);
    }
    _call(arg, runManager, parentConfig) {
        return this.func(arg, runManager, parentConfig);
    }
};
/**
* Abstract base class for toolkits in LangChain. Toolkits are collections
* of tools that agents can use. Subclasses must implement the `tools`
* property to provide the specific tools for the toolkit.
*/ var BaseToolkit = class {
    getTools() {
        return this.tools;
    }
};
function tool(func, fields) {
    const isSimpleStringSchema = require_zod.isSimpleStringZodSchema(fields.schema);
    const isStringJSONSchema = require_utils_json_schema.validatesOnlyStrings(fields.schema);
    if (!fields.schema || isSimpleStringSchema || isStringJSONSchema) return new DynamicTool({
        ...fields,
        description: fields.description ?? fields.schema?.description ?? `${fields.name} tool`,
        func: async (input, runManager, config)=>{
            return new Promise((resolve, reject)=>{
                const childConfig = require_config.patchConfig(config, {
                    callbacks: runManager?.getChild()
                });
                require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(childConfig), async ()=>{
                    try {
                        resolve(func(input, childConfig));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    });
    const schema = fields.schema;
    const description = fields.description ?? fields.schema.description ?? `${fields.name} tool`;
    return new DynamicStructuredTool({
        ...fields,
        description,
        schema,
        func: async (input, runManager, config)=>{
            return new Promise((resolve, reject)=>{
                let listener;
                const cleanup = ()=>{
                    if (config?.signal && listener) config.signal.removeEventListener("abort", listener);
                };
                if (config?.signal) {
                    listener = ()=>{
                        cleanup();
                        reject(require_signal.getAbortSignalError(config.signal));
                    };
                    config.signal.addEventListener("abort", listener, {
                        once: true
                    });
                }
                const childConfig = require_config.patchConfig(config, {
                    callbacks: runManager?.getChild()
                });
                require_index.AsyncLocalStorageProviderSingleton.runWithConfig(require_config.pickRunnableConfigKeys(childConfig), async ()=>{
                    try {
                        const result = await func(input, childConfig);
                        /**
						* If the signal is aborted, we don't want to resolve the promise
						* as the promise is already rejected.
						*/ if (config?.signal?.aborted) {
                            cleanup();
                            return;
                        }
                        cleanup();
                        resolve(result);
                    } catch (e) {
                        cleanup();
                        reject(e);
                    }
                });
            });
        }
    });
}
function _formatToolOutput(params) {
    const { content, artifact, toolCallId, metadata } = params;
    if (toolCallId && !require_messages_tool.isDirectToolOutput(content)) if (typeof content === "string" || Array.isArray(content) && content.every((item)=>typeof item === "object")) return new require_messages_tool.ToolMessage({
        status: "success",
        content,
        artifact,
        tool_call_id: toolCallId,
        name: params.name,
        metadata
    });
    else return new require_messages_tool.ToolMessage({
        status: "success",
        content: _stringify(content),
        artifact,
        tool_call_id: toolCallId,
        name: params.name,
        metadata
    });
    else return content;
}
function _stringify(content) {
    try {
        return JSON.stringify(content) ?? "";
    } catch (_noOp) {
        return `${content}`;
    }
}
//#endregion
exports.BaseToolkit = BaseToolkit;
exports.DynamicStructuredTool = DynamicStructuredTool;
exports.DynamicTool = DynamicTool;
exports.StructuredTool = StructuredTool;
exports.Tool = Tool;
exports.ToolInputParsingException = require_utils.ToolInputParsingException;
exports.isLangChainTool = require_types.isLangChainTool;
exports.isRunnableToolLike = require_types.isRunnableToolLike;
exports.isStructuredTool = require_types.isStructuredTool;
exports.isStructuredToolParams = require_types.isStructuredToolParams;
exports.tool = tool;
Object.defineProperty(exports, 'tools_exports', {
    enumerable: true,
    get: function() {
        return tools_exports;
    }
}); //# sourceMappingURL=index.cjs.map
}),
];

//# sourceMappingURL=e5189_%40langchain_core_dist_60540eed._.js.map