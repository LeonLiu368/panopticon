module.exports = [
"[project]/projects/tartanhacks/node_modules/delayed-stream/lib/delayed_stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
module.exports = DelayedStream;
function DelayedStream() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;
    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);
DelayedStream.create = function(source, options) {
    var delayedStream = new this();
    options = options || {};
    for(var option in options){
        delayedStream[option] = options[option];
    }
    delayedStream.source = source;
    var realEmit = source.emit;
    source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
    };
    source.on('error', function() {});
    if (delayedStream.pauseStream) {
        source.pause();
    }
    return delayedStream;
};
Object.defineProperty(DelayedStream.prototype, 'readable', {
    configurable: true,
    enumerable: true,
    get: function() {
        return this.source.readable;
    }
});
DelayedStream.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream.prototype.resume = function() {
    if (!this._released) {
        this.release();
    }
    this.source.resume();
};
DelayedStream.prototype.pause = function() {
    this.source.pause();
};
DelayedStream.prototype.release = function() {
    this._released = true;
    this._bufferedEvents.forEach((function(args) {
        this.emit.apply(this, args);
    }).bind(this));
    this._bufferedEvents = [];
};
DelayedStream.prototype.pipe = function() {
    var r = Stream.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
};
DelayedStream.prototype._handleEmit = function(args) {
    if (this._released) {
        this.emit.apply(this, args);
        return;
    }
    if (args[0] === 'data') {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
    }
    this._bufferedEvents.push(args);
};
DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
        return;
    }
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    this._maxDataSizeExceeded = true;
    var message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this.emit('error', new Error(message));
};
}),
"[project]/projects/tartanhacks/node_modules/combined-stream/lib/combined_stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var DelayedStream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/delayed-stream/lib/delayed_stream.js [app-route] (ecmascript)");
module.exports = CombinedStream;
function CombinedStream() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;
    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);
CombinedStream.create = function(options) {
    var combinedStream = new this();
    options = options || {};
    for(var option in options){
        combinedStream[option] = options[option];
    }
    return combinedStream;
};
CombinedStream.isStreamLike = function(stream) {
    return typeof stream !== 'function' && typeof stream !== 'string' && typeof stream !== 'boolean' && typeof stream !== 'number' && !Buffer.isBuffer(stream);
};
CombinedStream.prototype.append = function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
            var newStream = DelayedStream.create(stream, {
                maxDataSize: Infinity,
                pauseStream: this.pauseStreams
            });
            stream.on('data', this._checkDataSize.bind(this));
            stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
            stream.pause();
        }
    }
    this._streams.push(stream);
    return this;
};
CombinedStream.prototype.pipe = function(dest, options) {
    Stream.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
};
CombinedStream.prototype._getNext = function() {
    this._currentStream = null;
    if (this._insideLoop) {
        this._pendingNext = true;
        return; // defer call
    }
    this._insideLoop = true;
    try {
        do {
            this._pendingNext = false;
            this._realGetNext();
        }while (this._pendingNext)
    } finally{
        this._insideLoop = false;
    }
};
CombinedStream.prototype._realGetNext = function() {
    var stream = this._streams.shift();
    if (typeof stream == 'undefined') {
        this.end();
        return;
    }
    if (typeof stream !== 'function') {
        this._pipeNext(stream);
        return;
    }
    var getStream = stream;
    getStream((function(stream) {
        var isStreamLike = CombinedStream.isStreamLike(stream);
        if (isStreamLike) {
            stream.on('data', this._checkDataSize.bind(this));
            this._handleErrors(stream);
        }
        this._pipeNext(stream);
    }).bind(this));
};
CombinedStream.prototype._pipeNext = function(stream) {
    this._currentStream = stream;
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        stream.on('end', this._getNext.bind(this));
        stream.pipe(this, {
            end: false
        });
        return;
    }
    var value = stream;
    this.write(value);
    this._getNext();
};
CombinedStream.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on('error', function(err) {
        self._emitError(err);
    });
};
CombinedStream.prototype.write = function(data) {
    this.emit('data', data);
};
CombinedStream.prototype.pause = function() {
    if (!this.pauseStreams) {
        return;
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == 'function') this._currentStream.pause();
    this.emit('pause');
};
CombinedStream.prototype.resume = function() {
    if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == 'function') this._currentStream.resume();
    this.emit('resume');
};
CombinedStream.prototype.end = function() {
    this._reset();
    this.emit('end');
};
CombinedStream.prototype.destroy = function() {
    this._reset();
    this.emit('close');
};
CombinedStream.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
};
CombinedStream.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    var message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this._emitError(new Error(message));
};
CombinedStream.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var self = this;
    this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
            return;
        }
        self.dataSize += stream.dataSize;
    });
    if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
    }
};
CombinedStream.prototype._emitError = function(err) {
    this._reset();
    this.emit('error', err);
};
}),
"[project]/projects/tartanhacks/node_modules/mime-types/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module dependencies.
 * @private
 */ var db = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/mime-db/index.js [app-route] (ecmascript)");
var extname = __turbopack_context__.r("[externals]/path [external] (path, cjs)").extname;
/**
 * Module variables.
 * @private
 */ var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */ exports.charset = charset;
exports.charsets = {
    lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);
// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function charset(type) {
    if (!type || typeof type !== 'string') {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    var mime = match && db[match[1].toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    // default text/* to utf-8
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return 'UTF-8';
    }
    return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */ function contentType(str) {
    // TODO: should this even be in this module?
    if (!str || typeof str !== 'string') {
        return false;
    }
    var mime = str.indexOf('/') === -1 ? exports.lookup(str) : str;
    if (!mime) {
        return false;
    }
    // TODO: use content-type or other module
    if (mime.indexOf('charset') === -1) {
        var charset = exports.charset(mime);
        if (charset) mime += '; charset=' + charset.toLowerCase();
    }
    return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function extension(type) {
    if (!type || typeof type !== 'string') {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    // get extensions
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
        return false;
    }
    return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */ function lookup(path) {
    if (!path || typeof path !== 'string') {
        return false;
    }
    // get the extension ("ext" or ".ext" or full path)
    var extension = extname('x.' + path).toLowerCase().substr(1);
    if (!extension) {
        return false;
    }
    return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */ function populateMaps(extensions, types) {
    // source preference (least -> most)
    var preference = [
        'nginx',
        'apache',
        undefined,
        'iana'
    ];
    Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
            return;
        }
        // mime -> extensions
        extensions[type] = exts;
        // extension -> mime
        for(var i = 0; i < exts.length; i++){
            var extension = exts[i];
            if (types[extension]) {
                var from = preference.indexOf(db[types[extension]].source);
                var to = preference.indexOf(mime.source);
                if (types[extension] !== 'application/octet-stream' && (from > to || from === to && types[extension].substr(0, 12) === 'application/')) {
                    continue;
                }
            }
            // set the extension -> mime
            types[extension] = type;
        }
    });
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/defer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = defer;
/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */ function defer(fn) {
    var nextTick = typeof setImmediate == 'function' ? setImmediate : typeof process == 'object' && typeof process.nextTick == 'function' ? process.nextTick : null;
    if (nextTick) {
        nextTick(fn);
    } else {
        setTimeout(fn, 0);
    }
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/async.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var defer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/defer.js [app-route] (ecmascript)");
// API
module.exports = async;
/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */ function async(callback) {
    var isAsync = false;
    // check if async happened
    defer(function() {
        isAsync = true;
    });
    return function async_callback(err, result) {
        if (isAsync) {
            callback(err, result);
        } else {
            defer(function nextTick_callback() {
                callback(err, result);
            });
        }
    };
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// API
module.exports = abort;
/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */ function abort(state) {
    Object.keys(state.jobs).forEach(clean.bind(state));
    // reset leftover jobs
    state.jobs = {};
}
/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */ function clean(key) {
    if (typeof this.jobs[key] == 'function') {
        this.jobs[key]();
    }
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var async = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/async.js [app-route] (ecmascript)"), abort = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)");
// API
module.exports = iterate;
/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */ function iterate(list, iterator, state, callback) {
    // store current index
    var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;
    state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        // don't repeat yourself
        // skip secondary callbacks
        if (!(key in state.jobs)) {
            return;
        }
        // clean up jobs
        delete state.jobs[key];
        if (error) {
            // don't process rest of the results
            // stop still active jobs
            // and reset the list
            abort(state);
        } else {
            state.results[key] = output;
        }
        // return salvaged results
        callback(error, state.results);
    });
}
/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */ function runJob(iterator, key, item, callback) {
    var aborter;
    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
    } else {
        aborter = iterator(item, key, async(callback));
    }
    return aborter;
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/state.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// API
module.exports = state;
/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */ function state(list, sortMethod) {
    var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
    };
    if (sortMethod) {
        // sort array keys based on it's values
        // sort object's keys just on own merit
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
            return sortMethod(list[a], list[b]);
        });
    }
    return initState;
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var abort = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)"), async = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/async.js [app-route] (ecmascript)");
// API
module.exports = terminator;
/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */ function terminator(callback) {
    if (!Object.keys(this.jobs).length) {
        return;
    }
    // fast forward iteration index
    this.index = this.size;
    // abort jobs
    abort(this);
    // send back results we have so far
    async(callback)(null, this.results);
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/parallel.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var iterate = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)"), initState = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/state.js [app-route] (ecmascript)"), terminator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)");
// Public API
module.exports = parallel;
/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function parallel(list, iterator, callback) {
    var state = initState(list);
    while(state.index < (state['keyedList'] || list).length){
        iterate(list, iterator, state, function(error, result) {
            if (error) {
                callback(error, result);
                return;
            }
            // looks like it's the last one
            if (Object.keys(state.jobs).length === 0) {
                callback(null, state.results);
                return;
            }
        });
        state.index++;
    }
    return terminator.bind(state, callback);
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var iterate = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)"), initState = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/state.js [app-route] (ecmascript)"), terminator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)");
// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending = ascending;
module.exports.descending = descending;
/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serialOrdered(list, iterator, sortMethod, callback) {
    var state = initState(list, sortMethod);
    iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
            callback(error, result);
            return;
        }
        state.index++;
        // are we there yet?
        if (state.index < (state['keyedList'] || list).length) {
            iterate(list, iterator, state, iteratorHandler);
            return;
        }
        // done here
        callback(null, state.results);
    });
    return terminator.bind(state, callback);
}
/*
 * -- Sort methods
 */ /**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function descending(a, b) {
    return -1 * ascending(a, b);
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/serial.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var serialOrdered = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)");
// Public API
module.exports = serial;
/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serial(list, iterator, callback) {
    return serialOrdered(list, iterator, null, callback);
}
}),
"[project]/projects/tartanhacks/node_modules/asynckit/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    parallel: __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/parallel.js [app-route] (ecmascript)"),
    serial: __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/serial.js [app-route] (ecmascript)"),
    serialOrdered: __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)")
};
}),
"[project]/projects/tartanhacks/node_modules/es-object-atoms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ module.exports = Object;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ module.exports = Error;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/eval.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./eval')} */ module.exports = EvalError;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./range')} */ module.exports = RangeError;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/ref.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./ref')} */ module.exports = ReferenceError;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/syntax.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./syntax')} */ module.exports = SyntaxError;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/type.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./type')} */ module.exports = TypeError;
}),
"[project]/projects/tartanhacks/node_modules/es-errors/uri.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./uri')} */ module.exports = URIError;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/abs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./abs')} */ module.exports = Math.abs;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/floor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./floor')} */ module.exports = Math.floor;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/max.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./max')} */ module.exports = Math.max;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/min.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./min')} */ module.exports = Math.min;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/pow.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./pow')} */ module.exports = Math.pow;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/round.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./round')} */ module.exports = Math.round;
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/isNaN.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./isNaN')} */ module.exports = Number.isNaN || function isNaN(a) {
    return a !== a;
};
}),
"[project]/projects/tartanhacks/node_modules/math-intrinsics/sign.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var $isNaN = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/isNaN.js [app-route] (ecmascript)");
/** @type {import('./sign')} */ module.exports = function sign(number) {
    if ($isNaN(number) || number === 0) {
        return number;
    }
    return number < 0 ? -1 : +1;
};
}),
"[project]/projects/tartanhacks/node_modules/gopd/gOPD.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./gOPD')} */ module.exports = Object.getOwnPropertyDescriptor;
}),
"[project]/projects/tartanhacks/node_modules/gopd/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ var $gOPD = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/gopd/gOPD.js [app-route] (ecmascript)");
if ($gOPD) {
    try {
        $gOPD([], 'length');
    } catch (e) {
        // IE 8 has a broken gOPD
        $gOPD = null;
    }
}
module.exports = $gOPD;
}),
"[project]/projects/tartanhacks/node_modules/es-define-property/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ var $defineProperty = Object.defineProperty || false;
if ($defineProperty) {
    try {
        $defineProperty({}, 'a', {
            value: 1
        });
    } catch (e) {
        // IE 8 has a broken defineProperty
        $defineProperty = false;
    }
}
module.exports = $defineProperty;
}),
"[project]/projects/tartanhacks/node_modules/has-symbols/shams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./shams')} */ /* eslint complexity: [2, 18], max-statements: [2, 33] */ module.exports = function hasSymbols() {
    if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
        return false;
    }
    if (typeof Symbol.iterator === 'symbol') {
        return true;
    }
    /** @type {{ [k in symbol]?: unknown }} */ var obj = {};
    var sym = Symbol('test');
    var symObj = Object(sym);
    if (typeof sym === 'string') {
        return false;
    }
    if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
        return false;
    }
    if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
        return false;
    }
    // temp disabled per https://github.com/ljharb/object.assign/issues/17
    // if (sym instanceof Symbol) { return false; }
    // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    // if (!(symObj instanceof Symbol)) { return false; }
    // if (typeof Symbol.prototype.toString !== 'function') { return false; }
    // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }
    var symVal = 42;
    obj[sym] = symVal;
    for(var _ in obj){
        return false;
    } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
    if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
        return false;
    }
    if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
        return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === 'function') {
        // eslint-disable-next-line no-extra-parens
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
        }
    }
    return true;
};
}),
"[project]/projects/tartanhacks/node_modules/has-symbols/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/has-symbols/shams.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = function hasNativeSymbols() {
    if (typeof origSymbol !== 'function') {
        return false;
    }
    if (typeof Symbol !== 'function') {
        return false;
    }
    if (typeof origSymbol('foo') !== 'symbol') {
        return false;
    }
    if (typeof Symbol('bar') !== 'symbol') {
        return false;
    }
    return hasSymbolSham();
};
}),
"[project]/projects/tartanhacks/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./Reflect.getPrototypeOf')} */ module.exports = typeof Reflect !== 'undefined' && Reflect.getPrototypeOf || null;
}),
"[project]/projects/tartanhacks/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var $Object = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-object-atoms/index.js [app-route] (ecmascript)");
/** @type {import('./Object.getPrototypeOf')} */ module.exports = $Object.getPrototypeOf || null;
}),
"[project]/projects/tartanhacks/node_modules/get-proto/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var reflectGetProto = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)");
var originalGetProto = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)");
var getDunderProto = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/dunder-proto/get.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = reflectGetProto ? function getProto(O) {
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return reflectGetProto(O);
} : originalGetProto ? function getProto(O) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
        throw new TypeError('getProto: not an object');
    }
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return originalGetProto(O);
} : getDunderProto ? function getProto(O) {
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return getDunderProto(O);
} : null;
}),
"[project]/projects/tartanhacks/node_modules/function-bind/implementation.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-invalid-this: 1 */ var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';
var concatty = function concatty(a, b) {
    var arr = [];
    for(var i = 0; i < a.length; i += 1){
        arr[i] = a[i];
    }
    for(var j = 0; j < b.length; j += 1){
        arr[j + a.length] = b[j];
    }
    return arr;
};
var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for(var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1){
        arr[j] = arrLike[i];
    }
    return arr;
};
var joiny = function(arr, joiner) {
    var str = '';
    for(var i = 0; i < arr.length; i += 1){
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};
module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
        if (this instanceof bound) {
            var result = target.apply(this, concatty(args, arguments));
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(that, concatty(args, arguments));
    };
    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for(var i = 0; i < boundLength; i++){
        boundArgs[i] = '$' + i;
    }
    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);
    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }
    return bound;
};
}),
"[project]/projects/tartanhacks/node_modules/function-bind/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var implementation = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/function-bind/implementation.js [app-route] (ecmascript)");
module.exports = Function.prototype.bind || implementation;
}),
"[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./functionCall')} */ module.exports = Function.prototype.call;
}),
"[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./functionApply')} */ module.exports = Function.prototype.apply;
}),
"[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/reflectApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./reflectApply')} */ module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
}),
"[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/actualApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var bind = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/function-bind/index.js [app-route] (ecmascript)");
var $apply = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var $reflectApply = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/reflectApply.js [app-route] (ecmascript)");
/** @type {import('./actualApply')} */ module.exports = $reflectApply || bind.call($call, $apply);
}),
"[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var bind = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/function-bind/index.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/type.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var $actualApply = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/actualApply.js [app-route] (ecmascript)");
/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */ module.exports = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== 'function') {
        throw new $TypeError('a function is required');
    }
    return $actualApply(bind, $call, args);
};
}),
"[project]/projects/tartanhacks/node_modules/dunder-proto/get.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var callBind = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/index.js [app-route] (ecmascript)");
var gOPD = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/gopd/index.js [app-route] (ecmascript)");
var hasProtoAccessor;
try {
    // eslint-disable-next-line no-extra-parens, no-proto
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ [].__proto__ === Array.prototype;
} catch (e) {
    if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
        throw e;
    }
}
// eslint-disable-next-line no-extra-parens
var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, '__proto__');
var $Object = Object;
var $getPrototypeOf = $Object.getPrototypeOf;
/** @type {import('./get')} */ module.exports = desc && typeof desc.get === 'function' ? callBind([
    desc.get
]) : typeof $getPrototypeOf === 'function' ? /** @type {import('./get')} */ function getDunder(value) {
    // eslint-disable-next-line eqeqeq
    return $getPrototypeOf(value == null ? value : $Object(value));
} : false;
}),
"[project]/projects/tartanhacks/node_modules/hasown/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/function-bind/index.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = bind.call(call, $hasOwn);
}),
"[project]/projects/tartanhacks/node_modules/get-intrinsic/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var undefined1;
var $Object = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-object-atoms/index.js [app-route] (ecmascript)");
var $Error = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/index.js [app-route] (ecmascript)");
var $EvalError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/eval.js [app-route] (ecmascript)");
var $RangeError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/range.js [app-route] (ecmascript)");
var $ReferenceError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/ref.js [app-route] (ecmascript)");
var $SyntaxError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/syntax.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/type.js [app-route] (ecmascript)");
var $URIError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/uri.js [app-route] (ecmascript)");
var abs = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/abs.js [app-route] (ecmascript)");
var floor = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/floor.js [app-route] (ecmascript)");
var max = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/max.js [app-route] (ecmascript)");
var min = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/min.js [app-route] (ecmascript)");
var pow = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/pow.js [app-route] (ecmascript)");
var round = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/round.js [app-route] (ecmascript)");
var sign = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/math-intrinsics/sign.js [app-route] (ecmascript)");
var $Function = Function;
// eslint-disable-next-line consistent-return
var getEvalledConstructor = function(expressionSyntax) {
    try {
        return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
    } catch (e) {}
};
var $gOPD = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/gopd/index.js [app-route] (ecmascript)");
var $defineProperty = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-define-property/index.js [app-route] (ecmascript)");
var throwTypeError = function() {
    throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function() {
    try {
        // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
        arguments.callee; // IE 8 does not throw here
        return throwTypeError;
    } catch (calleeThrows) {
        try {
            // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
            return $gOPD(arguments, 'callee').get;
        } catch (gOPDthrows) {
            return throwTypeError;
        }
    }
}() : throwTypeError;
var hasSymbols = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/has-symbols/index.js [app-route] (ecmascript)")();
var getProto = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-proto/index.js [app-route] (ecmascript)");
var $ObjectGPO = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)");
var $ReflectGPO = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)");
var $apply = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);
var INTRINSICS = {
    __proto__: null,
    '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
    '%Array%': Array,
    '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
    '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
    '%AsyncFromSyncIteratorPrototype%': undefined,
    '%AsyncFunction%': needsEval,
    '%AsyncGenerator%': needsEval,
    '%AsyncGeneratorFunction%': needsEval,
    '%AsyncIteratorPrototype%': needsEval,
    '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
    '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
    '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
    '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
    '%Boolean%': Boolean,
    '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
    '%Date%': Date,
    '%decodeURI%': decodeURI,
    '%decodeURIComponent%': decodeURIComponent,
    '%encodeURI%': encodeURI,
    '%encodeURIComponent%': encodeURIComponent,
    '%Error%': $Error,
    '%eval%': eval,
    '%EvalError%': $EvalError,
    '%Float16Array%': typeof Float16Array === 'undefined' ? undefined : Float16Array,
    '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
    '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
    '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
    '%Function%': $Function,
    '%GeneratorFunction%': needsEval,
    '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
    '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
    '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
    '%isFinite%': isFinite,
    '%isNaN%': isNaN,
    '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
    '%JSON%': typeof JSON === 'object' ? JSON : undefined,
    '%Map%': typeof Map === 'undefined' ? undefined : Map,
    '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
    '%Math%': Math,
    '%Number%': Number,
    '%Object%': $Object,
    '%Object.getOwnPropertyDescriptor%': $gOPD,
    '%parseFloat%': parseFloat,
    '%parseInt%': parseInt,
    '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
    '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
    '%RangeError%': $RangeError,
    '%ReferenceError%': $ReferenceError,
    '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
    '%RegExp%': RegExp,
    '%Set%': typeof Set === 'undefined' ? undefined : Set,
    '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
    '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
    '%String%': String,
    '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
    '%Symbol%': hasSymbols ? Symbol : undefined,
    '%SyntaxError%': $SyntaxError,
    '%ThrowTypeError%': ThrowTypeError,
    '%TypedArray%': TypedArray,
    '%TypeError%': $TypeError,
    '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
    '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
    '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
    '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
    '%URIError%': $URIError,
    '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
    '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
    '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
    '%Function.prototype.call%': $call,
    '%Function.prototype.apply%': $apply,
    '%Object.defineProperty%': $defineProperty,
    '%Object.getPrototypeOf%': $ObjectGPO,
    '%Math.abs%': abs,
    '%Math.floor%': floor,
    '%Math.max%': max,
    '%Math.min%': min,
    '%Math.pow%': pow,
    '%Math.round%': round,
    '%Math.sign%': sign,
    '%Reflect.getPrototypeOf%': $ReflectGPO
};
if (getProto) {
    try {
        null.error; // eslint-disable-line no-unused-expressions
    } catch (e) {
        // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
        var errorProto = getProto(getProto(e));
        INTRINSICS['%Error.prototype%'] = errorProto;
    }
}
var doEval = function doEval(name) {
    var value;
    if (name === '%AsyncFunction%') {
        value = getEvalledConstructor('async function () {}');
    } else if (name === '%GeneratorFunction%') {
        value = getEvalledConstructor('function* () {}');
    } else if (name === '%AsyncGeneratorFunction%') {
        value = getEvalledConstructor('async function* () {}');
    } else if (name === '%AsyncGenerator%') {
        var fn = doEval('%AsyncGeneratorFunction%');
        if (fn) {
            value = fn.prototype;
        }
    } else if (name === '%AsyncIteratorPrototype%') {
        var gen = doEval('%AsyncGenerator%');
        if (gen && getProto) {
            value = getProto(gen.prototype);
        }
    }
    INTRINSICS[name] = value;
    return value;
};
var LEGACY_ALIASES = {
    __proto__: null,
    '%ArrayBufferPrototype%': [
        'ArrayBuffer',
        'prototype'
    ],
    '%ArrayPrototype%': [
        'Array',
        'prototype'
    ],
    '%ArrayProto_entries%': [
        'Array',
        'prototype',
        'entries'
    ],
    '%ArrayProto_forEach%': [
        'Array',
        'prototype',
        'forEach'
    ],
    '%ArrayProto_keys%': [
        'Array',
        'prototype',
        'keys'
    ],
    '%ArrayProto_values%': [
        'Array',
        'prototype',
        'values'
    ],
    '%AsyncFunctionPrototype%': [
        'AsyncFunction',
        'prototype'
    ],
    '%AsyncGenerator%': [
        'AsyncGeneratorFunction',
        'prototype'
    ],
    '%AsyncGeneratorPrototype%': [
        'AsyncGeneratorFunction',
        'prototype',
        'prototype'
    ],
    '%BooleanPrototype%': [
        'Boolean',
        'prototype'
    ],
    '%DataViewPrototype%': [
        'DataView',
        'prototype'
    ],
    '%DatePrototype%': [
        'Date',
        'prototype'
    ],
    '%ErrorPrototype%': [
        'Error',
        'prototype'
    ],
    '%EvalErrorPrototype%': [
        'EvalError',
        'prototype'
    ],
    '%Float32ArrayPrototype%': [
        'Float32Array',
        'prototype'
    ],
    '%Float64ArrayPrototype%': [
        'Float64Array',
        'prototype'
    ],
    '%FunctionPrototype%': [
        'Function',
        'prototype'
    ],
    '%Generator%': [
        'GeneratorFunction',
        'prototype'
    ],
    '%GeneratorPrototype%': [
        'GeneratorFunction',
        'prototype',
        'prototype'
    ],
    '%Int8ArrayPrototype%': [
        'Int8Array',
        'prototype'
    ],
    '%Int16ArrayPrototype%': [
        'Int16Array',
        'prototype'
    ],
    '%Int32ArrayPrototype%': [
        'Int32Array',
        'prototype'
    ],
    '%JSONParse%': [
        'JSON',
        'parse'
    ],
    '%JSONStringify%': [
        'JSON',
        'stringify'
    ],
    '%MapPrototype%': [
        'Map',
        'prototype'
    ],
    '%NumberPrototype%': [
        'Number',
        'prototype'
    ],
    '%ObjectPrototype%': [
        'Object',
        'prototype'
    ],
    '%ObjProto_toString%': [
        'Object',
        'prototype',
        'toString'
    ],
    '%ObjProto_valueOf%': [
        'Object',
        'prototype',
        'valueOf'
    ],
    '%PromisePrototype%': [
        'Promise',
        'prototype'
    ],
    '%PromiseProto_then%': [
        'Promise',
        'prototype',
        'then'
    ],
    '%Promise_all%': [
        'Promise',
        'all'
    ],
    '%Promise_reject%': [
        'Promise',
        'reject'
    ],
    '%Promise_resolve%': [
        'Promise',
        'resolve'
    ],
    '%RangeErrorPrototype%': [
        'RangeError',
        'prototype'
    ],
    '%ReferenceErrorPrototype%': [
        'ReferenceError',
        'prototype'
    ],
    '%RegExpPrototype%': [
        'RegExp',
        'prototype'
    ],
    '%SetPrototype%': [
        'Set',
        'prototype'
    ],
    '%SharedArrayBufferPrototype%': [
        'SharedArrayBuffer',
        'prototype'
    ],
    '%StringPrototype%': [
        'String',
        'prototype'
    ],
    '%SymbolPrototype%': [
        'Symbol',
        'prototype'
    ],
    '%SyntaxErrorPrototype%': [
        'SyntaxError',
        'prototype'
    ],
    '%TypedArrayPrototype%': [
        'TypedArray',
        'prototype'
    ],
    '%TypeErrorPrototype%': [
        'TypeError',
        'prototype'
    ],
    '%Uint8ArrayPrototype%': [
        'Uint8Array',
        'prototype'
    ],
    '%Uint8ClampedArrayPrototype%': [
        'Uint8ClampedArray',
        'prototype'
    ],
    '%Uint16ArrayPrototype%': [
        'Uint16Array',
        'prototype'
    ],
    '%Uint32ArrayPrototype%': [
        'Uint32Array',
        'prototype'
    ],
    '%URIErrorPrototype%': [
        'URIError',
        'prototype'
    ],
    '%WeakMapPrototype%': [
        'WeakMap',
        'prototype'
    ],
    '%WeakSetPrototype%': [
        'WeakSet',
        'prototype'
    ]
};
var bind = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/function-bind/index.js [app-route] (ecmascript)");
var hasOwn = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/hasown/index.js [app-route] (ecmascript)");
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */ var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */ 
var stringToPath = function stringToPath(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === '%' && last !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
    } else if (last === '%' && first !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
    });
    return result;
};
/* end adaptation */ var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = '%' + alias[0] + '%';
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
            value = doEval(intrinsicName);
        }
        if (typeof value === 'undefined' && !allowMissing) {
            throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
        }
        return {
            alias: alias,
            name: intrinsicName,
            value: value
        };
    }
    throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};
module.exports = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== 'string' || name.length === 0) {
        throw new $TypeError('intrinsic name must be a non-empty string');
    }
    if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
        throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
    var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([
            0,
            1
        ], alias));
    }
    for(var i = 1, isOwn = true; i < parts.length; i += 1){
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
            throw new $SyntaxError('property names with quotes must have matching quotes');
        }
        if (part === 'constructor' || !isOwn) {
            skipFurtherCaching = true;
        }
        intrinsicBaseName += '.' + part;
        intrinsicRealName = '%' + intrinsicBaseName + '%';
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
            if (!(part in value)) {
                if (!allowMissing) {
                    throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                }
                return void undefined;
            }
            if ($gOPD && i + 1 >= parts.length) {
                var desc = $gOPD(value, part);
                isOwn = !!desc;
                // By convention, when a data property is converted to an accessor
                // property to emulate a data property that does not suffer from
                // the override mistake, that accessor's getter is marked with
                // an `originalValue` property. Here, when we detect this, we
                // uphold the illusion by pretending to see that original data
                // property, i.e., returning the value rather than the getter
                // itself.
                if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                    value = desc.get;
                } else {
                    value = value[part];
                }
            } else {
                isOwn = hasOwn(value, part);
                value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
                INTRINSICS[intrinsicRealName] = value;
            }
        }
    }
    return value;
};
}),
"[project]/projects/tartanhacks/node_modules/has-tostringtag/shams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var hasSymbols = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/has-symbols/shams.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = function hasToStringTagShams() {
    return hasSymbols() && !!Symbol.toStringTag;
};
}),
"[project]/projects/tartanhacks/node_modules/es-set-tostringtag/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var GetIntrinsic = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/get-intrinsic/index.js [app-route] (ecmascript)");
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var hasToStringTag = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/has-tostringtag/shams.js [app-route] (ecmascript)")();
var hasOwn = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/hasown/index.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-errors/type.js [app-route] (ecmascript)");
var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
/** @type {import('.')} */ module.exports = function setToStringTag(object, value) {
    var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
    var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
    if (typeof overrideIfSet !== 'undefined' && typeof overrideIfSet !== 'boolean' || typeof nonConfigurable !== 'undefined' && typeof nonConfigurable !== 'boolean') {
        throw new $TypeError('if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans');
    }
    if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
        if ($defineProperty) {
            $defineProperty(object, toStringTag, {
                configurable: !nonConfigurable,
                enumerable: false,
                value: value,
                writable: false
            });
        } else {
            object[toStringTag] = value; // eslint-disable-line no-param-reassign
        }
    }
};
}),
"[project]/projects/tartanhacks/node_modules/form-data/lib/populate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// populates missing values
module.exports = function(dst, src) {
    Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop]; // eslint-disable-line no-param-reassign
    });
    return dst;
};
}),
"[project]/projects/tartanhacks/node_modules/form-data/lib/form_data.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var CombinedStream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/combined-stream/lib/combined_stream.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
var https = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
var parseUrl = __turbopack_context__.r("[externals]/url [external] (url, cjs)").parse;
var fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
var mime = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/mime-types/index.js [app-route] (ecmascript)");
var asynckit = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/asynckit/index.js [app-route] (ecmascript)");
var setToStringTag = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/es-set-tostringtag/index.js [app-route] (ecmascript)");
var hasOwn = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/hasown/index.js [app-route] (ecmascript)");
var populate = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/form-data/lib/populate.js [app-route] (ecmascript)");
/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {object} options - Properties to be added/overriden for FormData and CombinedStream
 */ function FormData(options) {
    if (!(this instanceof FormData)) {
        return new FormData(options);
    }
    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];
    CombinedStream.call(this);
    options = options || {}; // eslint-disable-line no-param-reassign
    for(var option in options){
        this[option] = options[option];
    }
}
// make it a Stream
util.inherits(FormData, CombinedStream);
FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';
FormData.prototype.append = function(field, value, options) {
    options = options || {}; // eslint-disable-line no-param-reassign
    // allow filename as single option
    if (typeof options === 'string') {
        options = {
            filename: options
        }; // eslint-disable-line no-param-reassign
    }
    var append = CombinedStream.prototype.append.bind(this);
    // all that streamy business can't handle numbers
    if (typeof value === 'number' || value == null) {
        value = String(value); // eslint-disable-line no-param-reassign
    }
    // https://github.com/felixge/node-form-data/issues/38
    if (Array.isArray(value)) {
        /*
     * Please convert your array into string
     * the way web server expects it
     */ this._error(new Error('Arrays are not supported.'));
        return;
    }
    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();
    append(header);
    append(value);
    append(footer);
    // pass along options.knownLength
    this._trackLength(header, value, options);
};
FormData.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    /*
   * used w/ getLengthSync(), when length is known.
   * e.g. for streaming directly from a remote server,
   * w/ a known file a size, and not wanting to wait for
   * incoming file to finish to get its size.
   */ if (options.knownLength != null) {
        valueLength += Number(options.knownLength);
    } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
    } else if (typeof value === 'string') {
        valueLength = Buffer.byteLength(value);
    }
    this._valueLength += valueLength;
    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
    // empty or either doesn't have path or not an http response or not a stream
    if (!value || !value.path && !(value.readable && hasOwn(value, 'httpVersion')) && !(value instanceof Stream)) {
        return;
    }
    // no need to bother with the length
    if (!options.knownLength) {
        this._valuesToMeasure.push(value);
    }
};
FormData.prototype._lengthRetriever = function(value, callback) {
    if (hasOwn(value, 'fd')) {
        // take read range into a account
        // `end` = Infinity –> read file till the end
        //
        // TODO: Looks like there is bug in Node fs.createReadStream
        // it doesn't respect `end` options without `start` options
        // Fix it when node fixes it.
        // https://github.com/joyent/node/issues/7819
        if (value.end != undefined && value.end != Infinity && value.start != undefined) {
            // when end specified
            // no need to calculate range
            // inclusive, starts with 0
            callback(null, value.end + 1 - (value.start ? value.start : 0)); // eslint-disable-line callback-return
        // not that fast snoopy
        } else {
            // still need to fetch file size from fs
            fs.stat(value.path, function(err, stat) {
                if (err) {
                    callback(err);
                    return;
                }
                // update final size based on the range options
                var fileSize = stat.size - (value.start ? value.start : 0);
                callback(null, fileSize);
            });
        }
    // or http response
    } else if (hasOwn(value, 'httpVersion')) {
        callback(null, Number(value.headers['content-length'])); // eslint-disable-line callback-return
    // or request stream http://github.com/mikeal/request
    } else if (hasOwn(value, 'httpModule')) {
        // wait till response come back
        value.on('response', function(response) {
            value.pause();
            callback(null, Number(response.headers['content-length']));
        });
        value.resume();
    // something else
    } else {
        callback('Unknown stream'); // eslint-disable-line callback-return
    }
};
FormData.prototype._multiPartHeader = function(field, value, options) {
    /*
   * custom header specified (as string)?
   * it becomes responsible for boundary
   * (e.g. to handle extra CRLFs on .NET servers)
   */ if (typeof options.header === 'string') {
        return options.header;
    }
    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);
    var contents = '';
    var headers = {
        // add custom disposition as third element or keep it two elements if not
        'Content-Disposition': [
            'form-data',
            'name="' + field + '"'
        ].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        'Content-Type': [].concat(contentType || [])
    };
    // allow custom headers.
    if (typeof options.header === 'object') {
        populate(headers, options.header);
    }
    var header;
    for(var prop in headers){
        if (hasOwn(headers, prop)) {
            header = headers[prop];
            // skip nullish headers.
            if (header == null) {
                continue; // eslint-disable-line no-restricted-syntax, no-continue
            }
            // convert all headers to arrays.
            if (!Array.isArray(header)) {
                header = [
                    header
                ];
            }
            // add non-empty headers.
            if (header.length) {
                contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
            }
        }
    }
    return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};
FormData.prototype._getContentDisposition = function(value, options) {
    var filename;
    if (typeof options.filepath === 'string') {
        // custom filepath for relative paths
        filename = path.normalize(options.filepath).replace(/\\/g, '/');
    } else if (options.filename || value && (value.name || value.path)) {
        /*
     * custom filename take precedence
     * formidable and the browser add a name property
     * fs- and request- streams have path property
     */ filename = path.basename(options.filename || value && (value.name || value.path));
    } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
        // or try http response
        filename = path.basename(value.client._httpMessage.path || '');
    }
    if (filename) {
        return 'filename="' + filename + '"';
    }
};
FormData.prototype._getContentType = function(value, options) {
    // use custom content-type above all
    var contentType = options.contentType;
    // or try `name` from formidable, browser
    if (!contentType && value && value.name) {
        contentType = mime.lookup(value.name);
    }
    // or try `path` from fs-, request- streams
    if (!contentType && value && value.path) {
        contentType = mime.lookup(value.path);
    }
    // or if it's http-reponse
    if (!contentType && value && value.readable && hasOwn(value, 'httpVersion')) {
        contentType = value.headers['content-type'];
    }
    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
    }
    // fallback to the default content type if `value` is not simple value
    if (!contentType && value && typeof value === 'object') {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
    }
    return contentType;
};
FormData.prototype._multiPartFooter = function() {
    return (function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
            footer += this._lastBoundary();
        }
        next(footer);
    }).bind(this);
};
FormData.prototype._lastBoundary = function() {
    return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};
FormData.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
        'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
    };
    for(header in userHeaders){
        if (hasOwn(userHeaders, header)) {
            formHeaders[header.toLowerCase()] = userHeaders[header];
        }
    }
    return formHeaders;
};
FormData.prototype.setBoundary = function(boundary) {
    if (typeof boundary !== 'string') {
        throw new TypeError('FormData boundary must be a string');
    }
    this._boundary = boundary;
};
FormData.prototype.getBoundary = function() {
    if (!this._boundary) {
        this._generateBoundary();
    }
    return this._boundary;
};
FormData.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc(0); // eslint-disable-line new-cap
    var boundary = this.getBoundary();
    // Create the form content. Add Line breaks to the end of data.
    for(var i = 0, len = this._streams.length; i < len; i++){
        if (typeof this._streams[i] !== 'function') {
            // Add content to the buffer.
            if (Buffer.isBuffer(this._streams[i])) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    this._streams[i]
                ]);
            } else {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(this._streams[i])
                ]);
            }
            // Add break after content.
            if (typeof this._streams[i] !== 'string' || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(FormData.LINE_BREAK)
                ]);
            }
        }
    }
    // Add the footer and return the Buffer object.
    return Buffer.concat([
        dataBuffer,
        Buffer.from(this._lastBoundary())
    ]);
};
FormData.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    this._boundary = '--------------------------' + crypto.randomBytes(12).toString('hex');
};
// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually and add it as knownLength option
FormData.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    // Don't get confused, there are 3 "internal" streams for each keyval pair so it basically checks if there is any value added to the form
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
        /*
     * Some async length retrievers are present
     * therefore synchronous length calculation is false.
     * Please use getLength(callback) to get proper length
     */ this._error(new Error('Cannot calculate proper length in synchronous way.'));
    }
    return knownLength;
};
// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
    var hasKnownLength = true;
    if (this._valuesToMeasure.length) {
        hasKnownLength = false;
    }
    return hasKnownLength;
};
FormData.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
    }
    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
            cb(err);
            return;
        }
        values.forEach(function(length) {
            knownLength += length;
        });
        cb(null, knownLength);
    });
};
FormData.prototype.submit = function(params, cb) {
    var request;
    var options;
    var defaults = {
        method: 'post'
    };
    // parse provided url if it's string or treat it as options object
    if (typeof params === 'string') {
        params = parseUrl(params); // eslint-disable-line no-param-reassign
        /* eslint sort-keys: 0 */ options = populate({
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol
        }, defaults);
    } else {
        options = populate(params, defaults);
        // if no port provided use default one
        if (!options.port) {
            options.port = options.protocol === 'https:' ? 443 : 80;
        }
    }
    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);
    // https if specified, fallback to http in any other case
    if (options.protocol === 'https:') {
        request = https.request(options);
    } else {
        request = http.request(options);
    }
    // get content length and fire away
    this.getLength((function(err, length) {
        if (err && err !== 'Unknown stream') {
            this._error(err);
            return;
        }
        // add content length
        if (length) {
            request.setHeader('Content-Length', length);
        }
        this.pipe(request);
        if (cb) {
            var onResponse;
            var callback = function(error, responce) {
                request.removeListener('error', callback);
                request.removeListener('response', onResponse);
                return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on('error', callback);
            request.on('response', onResponse);
        }
    }).bind(this));
    return request;
};
FormData.prototype._error = function(err) {
    if (!this.error) {
        this.error = err;
        this.pause();
        this.emit('error', err);
    }
};
FormData.prototype.toString = function() {
    return '[object FormData]';
};
setToStringTag(FormData.prototype, 'FormData');
// Public API
module.exports = FormData;
}),
"[project]/projects/tartanhacks/node_modules/proxy-from-env/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var parseUrl = __turbopack_context__.r("[externals]/url [external] (url, cjs)").parse;
var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
};
/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */ function getProxyForUrl(url) {
    var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
        return ''; // Don't proxy URLs without a valid scheme or host.
    }
    proto = proto.split(':', 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, '');
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
        return ''; // Don't proxy URLs that match NO_PROXY.
    }
    var proxy = getEnv('npm_config_' + proto + '_proxy') || getEnv(proto + '_proxy') || getEnv('npm_config_proxy') || getEnv('all_proxy');
    if (proxy && proxy.indexOf('://') === -1) {
        // Missing scheme in proxy, default to the requested URL's scheme.
        proxy = proto + '://' + proxy;
    }
    return proxy;
}
/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */ function shouldProxy(hostname, port) {
    var NO_PROXY = (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
    if (!NO_PROXY) {
        return true; // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === '*') {
        return false; // Never proxy if wildcard is set.
    }
    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
            return true; // Skip zero-length hosts.
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
            return true; // Skip if ports don't match.
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
            // No wildcards, so stop proxying if there is an exact match.
            return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === '*') {
            // Remove leading wildcard.
            parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        // Stop proxying if the hostname ends with the no_proxy host.
        return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
}
/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */ function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}
exports.getProxyForUrl = getProxyForUrl;
}),
"[project]/node_modules/ms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Helpers.
 */ var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
}),
"[project]/node_modules/debug/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
                // Anything else let's inspect with %O
                args.unshift('%O');
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === '%%') {
                    return '%';
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === 'function') {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === 'string' ? namespaces : '').trim().replace(/\s+/g, ',').split(',').filter(Boolean);
        for (const ns of split){
            if (ns[0] === '-') {
                createDebug.skips.push(ns.slice(1));
            } else {
                createDebug.names.push(ns);
            }
        }
    }
    /**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */ function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while(searchIndex < search.length){
            if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
                // Match character or proceed with wildcard
                if (template[templateIndex] === '*') {
                    starIndex = templateIndex;
                    matchIndex = searchIndex;
                    templateIndex++; // Skip the '*'
                } else {
                    searchIndex++;
                    templateIndex++;
                }
            } else if (starIndex !== -1) {
                // Backtrack to the last '*' and try to match more characters
                templateIndex = starIndex + 1;
                matchIndex++;
                searchIndex = matchIndex;
            } else {
                return false; // No match
            }
        }
        // Handle trailing '*' in template
        while(templateIndex < template.length && template[templateIndex] === '*'){
            templateIndex++;
        }
        return templateIndex === template.length;
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names,
            ...createDebug.skips.map((namespace)=>'-' + namespace)
        ].join(',');
        createDebug.enable('');
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        for (const skip of createDebug.skips){
            if (matchesTemplate(name, skip)) {
                return false;
            }
        }
        for (const ns of createDebug.names){
            if (matchesTemplate(name, ns)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;
}),
"[project]/node_modules/debug/src/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Module dependencies.
 */ const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, 'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = (()=>{
        const e = new Error("Cannot find module 'supports-color'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })();
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === 'null') {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split('\n').join('\n' + prefix);
        args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
    } else {
        args[0] = getDate() + name + ' ' + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return '';
    }
    return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split('\n').map((str)=>str.trim()).join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};
}),
"[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33'
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    let m;
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    // eslint-disable-next-line no-return-assign
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === '%%') {
            return;
        }
        index++;
        if (match === '%c') {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem('debug', namespaces);
        } else {
            exports.storage.removeItem('debug');
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG');
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return '[UnexpectedJSONParseError]: ' + error.message;
    }
};
}),
"[project]/node_modules/debug/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ if (typeof process === 'undefined' || process.type === 'renderer' || ("TURBOPACK compile-time value", false) === true || process.__nwjs) {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)");
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/node.js [app-route] (ecmascript)");
}
}),
"[project]/projects/tartanhacks/node_modules/follow-redirects/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var debug;
module.exports = function() {
    if (!debug) {
        try {
            /* eslint global-require: off */ debug = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")("follow-redirects");
        } catch (error) {}
        if (typeof debug !== "function") {
            debug = function() {};
        }
    }
    debug.apply(null, arguments);
};
}),
"[project]/projects/tartanhacks/node_modules/follow-redirects/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var url = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
var URL = url.URL;
var http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
var https = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
var Writable = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Writable;
var assert = __turbopack_context__.r("[externals]/assert [external] (assert, cjs)");
var debug = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/follow-redirects/debug.js [app-route] (ecmascript)");
// Preventive platform detection
// istanbul ignore next
(function detectUnsupportedEnvironment() {
    var looksLikeNode = typeof process !== "undefined";
    var looksLikeBrowser = ("TURBOPACK compile-time value", "undefined") !== "undefined" && typeof document !== "undefined";
    var looksLikeV8 = isFunction(Error.captureStackTrace);
    if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
        console.warn("The follow-redirects package should be excluded from browser builds.");
    }
})();
// Whether to use the native URL object or the legacy url module
var useNativeURL = false;
try {
    assert(new URL(""));
} catch (error) {
    useNativeURL = error.code === "ERR_INVALID_URL";
}
// URL fields to preserve in copy operations
var preservedUrlFields = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
];
// Create handlers that pass events from native requests
var events = [
    "abort",
    "aborted",
    "connect",
    "error",
    "socket",
    "timeout"
];
var eventHandlers = Object.create(null);
events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
    };
});
// Error types with codes
var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", RedirectionError);
var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
// istanbul ignore next
var destroy = Writable.prototype.destroy || noop;
// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    // Attach a callback if passed
    if (responseCallback) {
        this.on("response", responseCallback);
    }
    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function(response) {
        try {
            self._processResponse(response);
        } catch (cause) {
            self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({
                cause: cause
            }));
        }
    };
    // Perform the first request
    this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
    destroyRequest(this._currentRequest);
    this._currentRequest.abort();
    this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error) {
    destroyRequest(this._currentRequest, error);
    destroy.call(this, error);
    return this;
};
// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function(data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
        throw new WriteAfterEndError();
    }
    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
        if (callback) {
            callback();
        }
        return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({
            data: data,
            encoding: encoding
        });
        this._currentRequest.write(data, encoding, callback);
    } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
    }
};
// Ends the current native request
RedirectableRequest.prototype.end = function(data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
        callback = data;
        data = encoding = null;
    } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Write data if needed and end
    if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
    } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
            self._ended = true;
            currentRequest.end(null, null, callback);
        });
        this._ending = true;
    }
};
// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
};
// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
};
// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
    }
    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
        if (self._timeout) {
            clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function() {
            self.emit("timeout");
            clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
    }
    // Stops a timeout from triggering
    function clearTimer() {
        // Clear the timeout
        if (self._timeout) {
            clearTimeout(self._timeout);
            self._timeout = null;
        }
        // Clean up all attached listeners
        self.removeListener("abort", clearTimer);
        self.removeListener("error", clearTimer);
        self.removeListener("response", clearTimer);
        self.removeListener("close", clearTimer);
        if (callback) {
            self.removeListener("timeout", callback);
        }
        if (!self.socket) {
            self._currentRequest.removeListener("socket", startTimer);
        }
    }
    // Attach callback if passed
    if (callback) {
        this.on("timeout", callback);
    }
    // Start the timer if or when the socket is opened
    if (this.socket) {
        startTimer(this.socket);
    } else {
        this._currentRequest.once("socket", startTimer);
    }
    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    this.on("close", clearTimer);
    return this;
};
// Proxy all other public ClientRequest methods
[
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
    };
});
// Proxy all public ClientRequest properties
[
    "aborted",
    "connection",
    "socket"
].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
            return this._currentRequest[property];
        }
    });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
    // Ensure headers are always present
    if (!options.headers) {
        options.headers = {};
    }
    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
        // Use hostname if set, because it has precedence
        if (!options.hostname) {
            options.hostname = options.host;
        }
        delete options.host;
    }
    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
            options.pathname = options.path;
        } else {
            options.pathname = options.path.substring(0, searchPos);
            options.search = options.path.substring(searchPos);
        }
    }
};
// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function() {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
    }
    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
    }
    // Create the native request and set up its event handlers
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events){
        request.on(event, eventHandlers[event]);
    }
    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;
    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
        // Write the request entity and end
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
            // Only write if this request has not been redirected yet
            // istanbul ignore else
            if (request === self._currentRequest) {
                // Report any write errors
                // istanbul ignore if
                if (error) {
                    self.emit("error", error);
                } else if (i < buffers.length) {
                    var buffer = buffers[i++];
                    // istanbul ignore else
                    if (!request.finished) {
                        request.write(buffer.data, buffer.encoding, writeNext);
                    }
                } else if (self._ended) {
                    request.end();
                }
            }
        })();
    }
};
// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function(response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
        this._redirects.push({
            url: this._currentUrl,
            headers: response.headers,
            statusCode: statusCode
        });
    }
    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        // Clean up
        this._requestBodyBuffers = [];
        return;
    }
    // The response is a redirect, so abort the current request
    destroyRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
    }
    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
        requestHeaders = Object.assign({
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader("host")
        }, this._options.headers);
    }
    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = parseUrl(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, {
        host: currentHost
    }));
    // Create the redirected request
    var redirectUrl = resolveUrl(location, currentUrl);
    debug("redirecting to", redirectUrl.href);
    this._isRedirect = true;
    spreadUrlObject(redirectUrl, this._options);
    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
        removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
    }
    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
        var responseDetails = {
            headers: response.headers,
            statusCode: statusCode
        };
        var requestDetails = {
            url: currentUrl,
            method: method,
            headers: requestHeaders
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
    }
    // Perform the redirected request
    this._performRequest();
};
// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
    // Default settings
    var exports = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
    };
    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
        // Executes a request, following redirects
        function request(input, options, callback) {
            // Parse parameters, ensuring that input is an object
            if (isURL(input)) {
                input = spreadUrlObject(input);
            } else if (isString(input)) {
                input = spreadUrlObject(parseUrl(input));
            } else {
                callback = options;
                options = validateUrl(input);
                input = {
                    protocol: protocol
                };
            }
            if (isFunction(options)) {
                callback = options;
                options = null;
            }
            // Set defaults
            options = Object.assign({
                maxRedirects: exports.maxRedirects,
                maxBodyLength: exports.maxBodyLength
            }, input, options);
            options.nativeProtocols = nativeProtocols;
            if (!isString(options.host) && !isString(options.hostname)) {
                options.hostname = "::1";
            }
            assert.equal(options.protocol, protocol, "protocol mismatch");
            debug("options", options);
            return new RedirectableRequest(options, callback);
        }
        // Executes a GET request, following redirects
        function get(input, options, callback) {
            var wrappedRequest = wrappedProtocol.request(input, options, callback);
            wrappedRequest.end();
            return wrappedRequest;
        }
        // Expose the properties on the wrapped protocol
        Object.defineProperties(wrappedProtocol, {
            request: {
                value: request,
                configurable: true,
                enumerable: true,
                writable: true
            },
            get: {
                value: get,
                configurable: true,
                enumerable: true,
                writable: true
            }
        });
    });
    return exports;
}
function noop() {}
function parseUrl(input) {
    var parsed;
    // istanbul ignore else
    if (useNativeURL) {
        parsed = new URL(input);
    } else {
        // Ensure the URL is valid and absolute
        parsed = validateUrl(url.parse(input));
        if (!isString(parsed.protocol)) {
            throw new InvalidUrlError({
                input
            });
        }
    }
    return parsed;
}
function resolveUrl(relative, base) {
    // istanbul ignore next
    return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
}
function validateUrl(input) {
    if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
        throw new InvalidUrlError({
            input: input.href || input
        });
    }
    if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
        throw new InvalidUrlError({
            input: input.href || input
        });
    }
    return input;
}
function spreadUrlObject(urlObject, target) {
    var spread = target || {};
    for (var key of preservedUrlFields){
        spread[key] = urlObject[key];
    }
    // Fix IPv6 hostname
    if (spread.hostname.startsWith("[")) {
        spread.hostname = spread.hostname.slice(1, -1);
    }
    // Ensure port is a number
    if (spread.port !== "") {
        spread.port = Number(spread.port);
    }
    // Concatenate path
    spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
    return spread;
}
function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for(var header in headers){
        if (regex.test(header)) {
            lastValue = headers[header];
            delete headers[header];
        }
    }
    return lastValue === null || typeof lastValue === "undefined" ? undefined : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
        // istanbul ignore else
        if (isFunction(Error.captureStackTrace)) {
            Error.captureStackTrace(this, this.constructor);
        }
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    Object.defineProperties(CustomError.prototype, {
        constructor: {
            value: CustomError,
            enumerable: false
        },
        name: {
            value: "Error [" + code + "]",
            enumerable: false
        }
    });
    return CustomError;
}
function destroyRequest(request, error) {
    for (var event of events){
        request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.destroy(error);
}
function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
    return typeof value === "function";
}
function isBuffer(value) {
    return typeof value === "object" && "length" in value;
}
function isURL(value) {
    return URL && value instanceof URL;
}
// Exports
module.exports = wrap({
    http: http,
    https: https
});
module.exports.wrap = wrap;
}),
"[project]/projects/tartanhacks/node_modules/@hey-api/client-axios/dist/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var $ = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/axios/dist/node/axios.cjs [app-route] (ecmascript)");
function _interopDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
var $__default = /*#__PURE__*/ _interopDefault($);
var b = /\{[^{}]+\}/g, u = ({ allowReserved: n, name: r, value: e })=>{
    if (e == null) return "";
    if (typeof e == "object") throw new Error("Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these.");
    return `${r}=${n ? e : encodeURIComponent(e)}`;
}, x = (n)=>{
    switch(n){
        case "label":
            return ".";
        case "matrix":
            return ";";
        case "simple":
            return ",";
        default:
            return "&";
    }
}, C = (n)=>{
    switch(n){
        case "form":
            return ",";
        case "pipeDelimited":
            return "|";
        case "spaceDelimited":
            return "%20";
        default:
            return ",";
    }
}, j = (n)=>{
    switch(n){
        case "label":
            return ".";
        case "matrix":
            return ";";
        case "simple":
            return ",";
        default:
            return "&";
    }
}, z = ({ allowReserved: n, explode: r, name: e, style: a, value: s })=>{
    if (!r) {
        let i = (n ? s : s.map((c)=>encodeURIComponent(c))).join(C(a));
        switch(a){
            case "label":
                return `.${i}`;
            case "matrix":
                return `;${e}=${i}`;
            case "simple":
                return i;
            default:
                return `${e}=${i}`;
        }
    }
    let o = x(a), t = s.map((i)=>a === "label" || a === "simple" ? n ? i : encodeURIComponent(i) : u({
            allowReserved: n,
            name: e,
            value: i
        })).join(o);
    return a === "label" || a === "matrix" ? o + t : t;
}, O = ({ allowReserved: n, explode: r, name: e, style: a, value: s })=>{
    if (a !== "deepObject" && !r) {
        let i = [];
        Object.entries(s).forEach(([d, p])=>{
            i = [
                ...i,
                d,
                n ? p : encodeURIComponent(p)
            ];
        });
        let c = i.join(",");
        switch(a){
            case "form":
                return `${e}=${c}`;
            case "label":
                return `.${c}`;
            case "matrix":
                return `;${e}=${c}`;
            default:
                return c;
        }
    }
    let o = j(a), t = Object.entries(s).map(([i, c])=>u({
            allowReserved: n,
            name: a === "deepObject" ? `${e}[${i}]` : i,
            value: c
        })).join(o);
    return a === "label" || a === "matrix" ? o + t : t;
}, A = ({ path: n, url: r })=>{
    let e = r, a = r.match(b);
    if (a) for (let s of a){
        let o = !1, t = s.substring(1, s.length - 1), i = "simple";
        t.endsWith("*") && (o = !0, t = t.substring(0, t.length - 1)), t.startsWith(".") ? (t = t.substring(1), i = "label") : t.startsWith(";") && (t = t.substring(1), i = "matrix");
        let c = n[t];
        if (c == null) continue;
        if (Array.isArray(c)) {
            e = e.replace(s, z({
                explode: o,
                name: t,
                style: i,
                value: c
            }));
            continue;
        }
        if (typeof c == "object") {
            e = e.replace(s, O({
                explode: o,
                name: t,
                style: i,
                value: c
            }));
            continue;
        }
        if (i === "matrix") {
            e = e.replace(s, `;${u({
                name: t,
                value: c
            })}`);
            continue;
        }
        let d = encodeURIComponent(i === "label" ? `.${c}` : c);
        e = e.replace(s, d);
    }
    return e;
}, S = ({ path: n, url: r })=>n ? A({
        path: n,
        url: r
    }) : r, g = (n, r, e)=>{
    typeof e == "string" || e instanceof Blob ? n.append(r, e) : n.append(r, JSON.stringify(e));
}, m = (n, r)=>{
    let e = {
        ...n,
        ...r
    };
    return e.headers = f(n.headers, r.headers), e;
}, f = (...n)=>{
    let r = {};
    for (let e of n){
        if (!e || typeof e != "object") continue;
        let a = Object.entries(e);
        for (let [s, o] of a)if (o === null) delete r[s];
        else if (Array.isArray(o)) for (let t of o)r[s] = [
            ...r[s] ?? [],
            t
        ];
        else o !== void 0 && (r[s] = typeof o == "object" ? JSON.stringify(o) : o);
    }
    return r;
}, R = {
    bodySerializer: (n)=>{
        let r = new FormData;
        return Object.entries(n).forEach(([e, a])=>{
            a != null && (Array.isArray(a) ? a.forEach((s)=>g(r, e, s)) : g(r, e, a));
        }), r;
    }
}, P = {
    bodySerializer: (n)=>JSON.stringify(n)
}, h = (n, r, e)=>{
    typeof e == "string" ? n.append(r, e) : n.append(r, JSON.stringify(e));
}, w = {
    bodySerializer: (n)=>{
        let r = new URLSearchParams;
        return Object.entries(n).forEach(([e, a])=>{
            a != null && (Array.isArray(a) ? a.forEach((s)=>h(r, e, s)) : h(r, e, a));
        }), r;
    }
}, y = (n = {})=>({
        baseURL: "",
        ...n
    });
var U = (n)=>{
    let r = m(y(), n), e = $__default.default.create(r), a = ()=>({
            ...r
        }), s = (t)=>(r = m(r, t), e.defaults = {
            ...e.defaults,
            ...r,
            headers: f(e.defaults.headers, r.headers)
        }, a()), o = async (t)=>{
        let i = {
            ...r,
            ...t,
            headers: f(r.headers, t.headers)
        };
        i.body && i.bodySerializer && (i.body = i.bodySerializer(i.body));
        let c = S({
            path: i.path,
            url: i.url
        }), d = i.axios || e;
        try {
            let p = await d({
                ...i,
                data: i.body,
                params: i.query,
                url: c
            }), { data: l } = p;
            return i.responseType === "json" && i.responseTransformer && (l = await i.responseTransformer(l)), {
                ...p,
                data: l ?? {}
            };
        } catch (p) {
            let l = p;
            if (i.throwOnError) throw l;
            return l.error = l.response?.data ?? {}, l;
        }
    };
    return {
        delete: (t)=>o({
                ...t,
                method: "delete"
            }),
        get: (t)=>o({
                ...t,
                method: "get"
            }),
        getConfig: a,
        head: (t)=>o({
                ...t,
                method: "head"
            }),
        instance: e,
        options: (t)=>o({
                ...t,
                method: "options"
            }),
        patch: (t)=>o({
                ...t,
                method: "patch"
            }),
        post: (t)=>o({
                ...t,
                method: "post"
            }),
        put: (t)=>o({
                ...t,
                method: "put"
            }),
        request: o,
        setConfig: s
    };
};
exports.createClient = U;
exports.createConfig = y;
exports.formDataBodySerializer = R;
exports.jsonBodySerializer = P;
exports.urlSearchParamsBodySerializer = w; //# sourceMappingURL=index.cjs.map
 //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultOptions = exports.defaultOptions = exports.jsonDescription = exports.ignoreOverride = void 0;
exports.ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const jsonDescription = (jsonSchema, def)=>{
    if (def.description) {
        try {
            return {
                ...jsonSchema,
                ...JSON.parse(def.description)
            };
        } catch  {}
    }
    return jsonSchema;
};
exports.jsonDescription = jsonDescription;
exports.defaultOptions = {
    name: undefined,
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
        ...exports.defaultOptions,
        name: options
    } : {
        ...exports.defaultOptions,
        ...options
    };
exports.getDefaultOptions = getDefaultOptions;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Refs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRefs = void 0;
const Options_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Options.js [app-route] (ecmascript)");
const getRefs = (options)=>{
    const _options = (0, Options_js_1.getDefaultOptions)(options);
    const currentPath = _options.name !== undefined ? [
        ..._options.basePath,
        _options.definitionPath,
        _options.name
    ] : _options.basePath;
    return {
        ..._options,
        flags: {
            hasReferencedOpenAiAnyType: false
        },
        currentPath: currentPath,
        propertyPath: undefined,
        seen: new Map(Object.entries(_options.definitions).map(([name, def])=>[
                def._def,
                {
                    def: def._def,
                    path: [
                        ..._options.basePath,
                        _options.definitionPath,
                        name
                    ],
                    // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                    jsonSchema: undefined
                }
            ]))
    };
};
exports.getRefs = getRefs;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setResponseValueAndErrors = exports.addErrorMessage = void 0;
function addErrorMessage(res, key, errorMessage, refs) {
    if (!refs?.errorMessages) return;
    if (errorMessage) {
        res.errorMessage = {
            ...res.errorMessage,
            [key]: errorMessage
        };
    }
}
exports.addErrorMessage = addErrorMessage;
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
    res[key] = value;
    addErrorMessage(res, key, errorMessage, refs);
}
exports.setResponseValueAndErrors = setResponseValueAndErrors;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/getRelativePath.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRelativePath = void 0;
const getRelativePath = (pathA, pathB)=>{
    let i = 0;
    for(; i < pathA.length && i < pathB.length; i++){
        if (pathA[i] !== pathB[i]) break;
    }
    return [
        (pathA.length - i).toString(),
        ...pathB.slice(i)
    ].join("/");
};
exports.getRelativePath = getRelativePath;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseAnyDef = void 0;
const getRelativePath_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/getRelativePath.js [app-route] (ecmascript)");
function parseAnyDef(refs) {
    if (refs.target !== "openAi") {
        return {};
    }
    const anyDefinitionPath = [
        ...refs.basePath,
        refs.definitionPath,
        refs.openAiAnyTypeName
    ];
    refs.flags.hasReferencedOpenAiAnyType = true;
    return {
        $ref: refs.$refStrategy === "relative" ? (0, getRelativePath_js_1.getRelativePath)(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/")
    };
}
exports.parseAnyDef = parseAnyDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/array.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseArrayDef = void 0;
const v3_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parseArrayDef(def, refs) {
    const res = {
        type: "array"
    };
    if (def.type?._def && def.type?._def?.typeName !== v3_1.ZodFirstPartyTypeKind.ZodAny) {
        res.items = (0, parseDef_js_1.parseDef)(def.type._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "items"
            ]
        });
    }
    if (def.minLength) {
        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minItems", def.minLength.value, def.minLength.message, refs);
    }
    if (def.maxLength) {
        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
    }
    if (def.exactLength) {
        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
    }
    return res;
}
exports.parseArrayDef = parseArrayDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/bigint.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseBigintDef = void 0;
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
function parseBigintDef(def, refs) {
    const res = {
        type: "integer",
        format: "int64"
    };
    if (!def.checks) return res;
    for (const check of def.checks){
        switch(check.kind){
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minimum", check.value, check.message, refs);
                    } else {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                } else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maximum", check.value, check.message, refs);
                    } else {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                } else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                (0, errorMessages_js_1.setResponseValueAndErrors)(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}
exports.parseBigintDef = parseBigintDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/boolean.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseBooleanDef = void 0;
function parseBooleanDef() {
    return {
        type: "boolean"
    };
}
exports.parseBooleanDef = parseBooleanDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/branded.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseBrandedDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parseBrandedDef(_def, refs) {
    return (0, parseDef_js_1.parseDef)(_def.type._def, refs);
}
exports.parseBrandedDef = parseBrandedDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/catch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseCatchDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const parseCatchDef = (def, refs)=>{
    return (0, parseDef_js_1.parseDef)(def.innerType._def, refs);
};
exports.parseCatchDef = parseCatchDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/date.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseDateDef = void 0;
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy ?? refs.dateStrategy;
    if (Array.isArray(strategy)) {
        return {
            anyOf: strategy.map((item, i)=>parseDateDef(def, refs, item))
        };
    }
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
exports.parseDateDef = parseDateDef;
const integerDateParser = (def, refs)=>{
    const res = {
        type: "integer",
        format: "unix-time"
    };
    if (refs.target === "openApi3") {
        return res;
    }
    for (const check of def.checks){
        switch(check.kind){
            case "min":
                (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minimum", check.value, check.message, refs);
                break;
            case "max":
                (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maximum", check.value, check.message, refs);
                break;
        }
    }
    return res;
};
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/default.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseDefaultDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parseDefaultDef(_def, refs) {
    return {
        ...(0, parseDef_js_1.parseDef)(_def.innerType._def, refs),
        default: _def.defaultValue()
    };
}
exports.parseDefaultDef = parseDefaultDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/effects.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseEffectsDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input" ? (0, parseDef_js_1.parseDef)(_def.schema._def, refs) : (0, any_js_1.parseAnyDef)(refs);
}
exports.parseEffectsDef = parseEffectsDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/enum.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseEnumDef = void 0;
function parseEnumDef(def) {
    return {
        type: "string",
        enum: Array.from(def.values)
    };
}
exports.parseEnumDef = parseEnumDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/intersection.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseIntersectionDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const isJsonSchema7AllOfType = (type)=>{
    if ("type" in type && type.type === "string") return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        (0, parseDef_js_1.parseDef)(def.left._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "allOf",
                "0"
            ]
        }),
        (0, parseDef_js_1.parseDef)(def.right._def, {
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
    } : undefined;
    const mergedAllOf = [];
    // If either of the schemas is an allOf, merge them into a single allOf
    allOf.forEach((schema)=>{
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
            if (schema.unevaluatedProperties === undefined) {
                // If one of the schemas has no unevaluatedProperties set,
                // the merged schema should also have no unevaluatedProperties set
                unevaluatedProperties = undefined;
            }
        } else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema && schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            } else {
                // As soon as one of the schemas has additionalProperties set not to false, we allow unevaluatedProperties
                unevaluatedProperties = undefined;
            }
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length ? {
        allOf: mergedAllOf,
        ...unevaluatedProperties
    } : undefined;
}
exports.parseIntersectionDef = parseIntersectionDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/literal.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseLiteralDef = void 0;
function parseLiteralDef(def, refs) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
        return {
            type: Array.isArray(def.value) ? "array" : "object"
        };
    }
    if (refs.target === "openApi3") {
        return {
            type: parsedType === "bigint" ? "integer" : parsedType,
            enum: [
                def.value
            ]
        };
    }
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value
    };
}
exports.parseLiteralDef = parseLiteralDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/string.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseStringDef = exports.zodPatterns = void 0;
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
let emojiRegex = undefined;
/**
 * Generated from the regular expressions found here as of 2024-05-22:
 * https://github.com/colinhacks/zod/blob/master/src/types.ts.
 *
 * Expressions with /i flag have been changed accordingly.
 */ exports.zodPatterns = {
    /**
     * `c` was changed to `[cC]` to replicate /i flag
     */ cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    /**
     * `a-z` was added to replicate /i flag
     */ email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    /**
     * Constructed a valid Unicode RegExp
     *
     * Lazily instantiate since this type of regex isn't supported
     * in all envs (e.g. React Native).
     *
     * See:
     * https://github.com/colinhacks/zod/issues/2433
     * Fix in Zod:
     * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
     */ emoji: ()=>{
        if (emojiRegex === undefined) {
            emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        }
        return emojiRegex;
    },
    /**
     * Unused
     */ uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /**
     * Unused
     */ ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    /**
     * Unused
     */ ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
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
    if (def.checks) {
        for (const check of def.checks){
            switch(check.kind){
                case "min":
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
                    break;
                case "max":
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
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
                            addPattern(res, exports.zodPatterns.email, check.message, refs);
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
                    addPattern(res, exports.zodPatterns.cuid, check.message, refs);
                    break;
                case "cuid2":
                    addPattern(res, exports.zodPatterns.cuid2, check.message, refs);
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
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
                    break;
                case "includes":
                    {
                        addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
                        break;
                    }
                case "ip":
                    {
                        if (check.version !== "v6") {
                            addFormat(res, "ipv4", check.message, refs);
                        }
                        if (check.version !== "v4") {
                            addFormat(res, "ipv6", check.message, refs);
                        }
                        break;
                    }
                case "base64url":
                    addPattern(res, exports.zodPatterns.base64url, check.message, refs);
                    break;
                case "jwt":
                    addPattern(res, exports.zodPatterns.jwt, check.message, refs);
                    break;
                case "cidr":
                    {
                        if (check.version !== "v6") {
                            addPattern(res, exports.zodPatterns.ipv4Cidr, check.message, refs);
                        }
                        if (check.version !== "v4") {
                            addPattern(res, exports.zodPatterns.ipv6Cidr, check.message, refs);
                        }
                        break;
                    }
                case "emoji":
                    addPattern(res, exports.zodPatterns.emoji(), check.message, refs);
                    break;
                case "ulid":
                    {
                        addPattern(res, exports.zodPatterns.ulid, check.message, refs);
                        break;
                    }
                case "base64":
                    {
                        switch(refs.base64Strategy){
                            case "format:binary":
                                {
                                    addFormat(res, "binary", check.message, refs);
                                    break;
                                }
                            case "contentEncoding:base64":
                                {
                                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "contentEncoding", "base64", check.message, refs);
                                    break;
                                }
                            case "pattern:zod":
                                {
                                    addPattern(res, exports.zodPatterns.base64, check.message, refs);
                                    break;
                                }
                        }
                        break;
                    }
                case "nanoid":
                    {
                        addPattern(res, exports.zodPatterns.nanoid, check.message, refs);
                    }
                case "toLowerCase":
                case "toUpperCase":
                case "trim":
                    break;
                default:
                    ((_)=>{})(check);
            }
        }
    }
    return res;
}
exports.parseStringDef = parseStringDef;
function escapeLiteralCheckValue(literal, refs) {
    return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
const ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
    let result = "";
    for(let i = 0; i < source.length; i++){
        if (!ALPHA_NUMERIC.has(source[i])) {
            result += "\\";
        }
        result += source[i];
    }
    return result;
}
// Adds a "format" keyword to the schema. If a format exists, both formats will be joined in an allOf-node, along with subsequent ones.
function addFormat(schema, value, message, refs) {
    if (schema.format || schema.anyOf?.some((x)=>x.format)) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
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
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
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
    } else {
        (0, errorMessages_js_1.setResponseValueAndErrors)(schema, "format", value, message, refs);
    }
}
// Adds a "pattern" keyword to the schema. If a pattern exists, both patterns will be joined in an allOf-node, along with subsequent ones.
function addPattern(schema, regex, message, refs) {
    if (schema.pattern || schema.allOf?.some((x)=>x.pattern)) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
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
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
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
    } else {
        (0, errorMessages_js_1.setResponseValueAndErrors)(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
    }
}
// Mutate z.string.regex() in a best attempt to accommodate for regex flags when applyRegexFlags is true
function stringifyRegExpWithFlags(regex, refs) {
    if (!refs.applyRegexFlags || !regex.flags) {
        return regex.source;
    }
    // Currently handled flags
    const flags = {
        i: regex.flags.includes("i"),
        m: regex.flags.includes("m"),
        s: regex.flags.includes("s")
    };
    // The general principle here is to step through each character, one at a time, applying mutations as flags require. We keep track when the current character is escaped, and when it's inside a group /like [this]/ or (also) a range like /[a-z]/. The following is fairly brittle imperative code; edit at your peril!
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
                    } else {
                        pattern += `${source[i]}${source[i].toUpperCase()}`;
                    }
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
        if (source[i] === "\\") {
            isEscaped = true;
        } else if (inCharGroup && source[i] === "]") {
            inCharGroup = false;
        } else if (!inCharGroup && source[i] === "[") {
            inCharGroup = true;
        }
    }
    try {
        new RegExp(pattern);
    } catch  {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
}
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/record.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseRecordDef = void 0;
const v3_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const string_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/string.js [app-route] (ecmascript)");
const branded_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/branded.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseRecordDef(def, refs) {
    if (refs.target === "openAi") {
        console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
    }
    if (refs.target === "openApi3" && def.keyType?._def.typeName === v3_1.ZodFirstPartyTypeKind.ZodEnum) {
        return {
            type: "object",
            required: def.keyType._def.values,
            properties: def.keyType._def.values.reduce((acc, key)=>({
                    ...acc,
                    [key]: (0, parseDef_js_1.parseDef)(def.valueType._def, {
                        ...refs,
                        currentPath: [
                            ...refs.currentPath,
                            "properties",
                            key
                        ]
                    }) ?? (0, any_js_1.parseAnyDef)(refs)
                }), {}),
            additionalProperties: refs.rejectedAdditionalProperties
        };
    }
    const schema = {
        type: "object",
        additionalProperties: (0, parseDef_js_1.parseDef)(def.valueType._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalProperties"
            ]
        }) ?? refs.allowedAdditionalProperties
    };
    if (refs.target === "openApi3") {
        return schema;
    }
    if (def.keyType?._def.typeName === v3_1.ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
        const { type, ...keyType } = (0, string_js_1.parseStringDef)(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    } else if (def.keyType?._def.typeName === v3_1.ZodFirstPartyTypeKind.ZodEnum) {
        return {
            ...schema,
            propertyNames: {
                enum: def.keyType._def.values
            }
        };
    } else if (def.keyType?._def.typeName === v3_1.ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === v3_1.ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
        const { type, ...keyType } = (0, branded_js_1.parseBrandedDef)(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    }
    return schema;
}
exports.parseRecordDef = parseRecordDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/map.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseMapDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const record_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/record.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") {
        return (0, record_js_1.parseRecordDef)(def, refs);
    }
    const keys = (0, parseDef_js_1.parseDef)(def.keyType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "0"
        ]
    }) || (0, any_js_1.parseAnyDef)(refs);
    const values = (0, parseDef_js_1.parseDef)(def.valueType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "1"
        ]
    }) || (0, any_js_1.parseAnyDef)(refs);
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
exports.parseMapDef = parseMapDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nativeEnum.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNativeEnumDef = void 0;
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
exports.parseNativeEnumDef = parseNativeEnumDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/never.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNeverDef = void 0;
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseNeverDef(refs) {
    return refs.target === "openAi" ? undefined : {
        not: (0, any_js_1.parseAnyDef)({
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "not"
            ]
        })
    };
}
exports.parseNeverDef = parseNeverDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/null.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNullDef = void 0;
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
exports.parseNullDef = parseNullDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/union.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseUnionDef = exports.primitiveMappings = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
exports.primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null"
};
function parseUnionDef(def, refs) {
    if (refs.target === "openApi3") return asAnyOf(def, refs);
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    // This blocks tries to look ahead a bit to produce nicer looking schemas with type array instead of anyOf.
    if (options.every((x)=>x._def.typeName in exports.primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
        // all types in union are primitive and lack checks, so might as well squash into {type: [...]}
        const types = options.reduce((types, x)=>{
            const type = exports.primitiveMappings[x._def.typeName]; //Can be safely casted due to row 43
            return type && !types.includes(type) ? [
                ...types,
                type
            ] : types;
        }, []);
        return {
            type: types.length > 1 ? types : types[0]
        };
    } else if (options.every((x)=>x._def.typeName === "ZodLiteral" && !x.description)) {
        // all options literals
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
                case "symbol":
                case "undefined":
                case "function":
                default:
                    return acc;
            }
        }, []);
        if (types.length === options.length) {
            // all the literals are primitive, as far as null can be considered primitive
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
    } else if (options.every((x)=>x._def.typeName === "ZodEnum")) {
        return {
            type: "string",
            enum: options.reduce((acc, x)=>[
                    ...acc,
                    ...x._def.values.filter((x)=>!acc.includes(x))
                ], [])
        };
    }
    return asAnyOf(def, refs);
}
exports.parseUnionDef = parseUnionDef;
const asAnyOf = (def, refs)=>{
    const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i)=>(0, parseDef_js_1.parseDef)(x._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "anyOf",
                `${i}`
            ]
        })).filter((x)=>!!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
    return anyOf.length ? {
        anyOf
    } : undefined;
};
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nullable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNullableDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const union_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/union.js [app-route] (ecmascript)");
function parseNullableDef(def, refs) {
    if ([
        "ZodString",
        "ZodNumber",
        "ZodBigInt",
        "ZodBoolean",
        "ZodNull"
    ].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        if (refs.target === "openApi3") {
            return {
                type: union_js_1.primitiveMappings[def.innerType._def.typeName],
                nullable: true
            };
        }
        return {
            type: [
                union_js_1.primitiveMappings[def.innerType._def.typeName],
                "null"
            ]
        };
    }
    if (refs.target === "openApi3") {
        const base = (0, parseDef_js_1.parseDef)(def.innerType._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath
            ]
        });
        if (base && "$ref" in base) return {
            allOf: [
                base
            ],
            nullable: true
        };
        return base && {
            ...base,
            nullable: true
        };
    }
    const base = (0, parseDef_js_1.parseDef)(def.innerType._def, {
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
exports.parseNullableDef = parseNullableDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/number.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseNumberDef = void 0;
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
function parseNumberDef(def, refs) {
    const res = {
        type: "number"
    };
    if (!def.checks) return res;
    for (const check of def.checks){
        switch(check.kind){
            case "int":
                res.type = "integer";
                (0, errorMessages_js_1.addErrorMessage)(res, "type", check.message, refs);
                break;
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minimum", check.value, check.message, refs);
                    } else {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                } else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maximum", check.value, check.message, refs);
                    } else {
                        (0, errorMessages_js_1.setResponseValueAndErrors)(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                } else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    (0, errorMessages_js_1.setResponseValueAndErrors)(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                (0, errorMessages_js_1.setResponseValueAndErrors)(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}
exports.parseNumberDef = parseNumberDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/object.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseObjectDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
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
        if (propDef === undefined || propDef._def === undefined) {
            continue;
        }
        let propOptional = safeIsOptional(propDef);
        if (propOptional && forceOptionalIntoNullable) {
            if (propDef._def.typeName === "ZodOptional") {
                propDef = propDef._def.innerType;
            }
            if (!propDef.isNullable()) {
                propDef = propDef.nullable();
            }
            propOptional = false;
        }
        const parsedDef = (0, parseDef_js_1.parseDef)(propDef._def, {
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
        if (parsedDef === undefined) {
            continue;
        }
        result.properties[propName] = parsedDef;
        if (!propOptional) {
            required.push(propName);
        }
    }
    if (required.length) {
        result.required = required;
    }
    const additionalProperties = decideAdditionalProperties(def, refs);
    if (additionalProperties !== undefined) {
        result.additionalProperties = additionalProperties;
    }
    return result;
}
exports.parseObjectDef = parseObjectDef;
function decideAdditionalProperties(def, refs) {
    if (def.catchall._def.typeName !== "ZodNever") {
        return (0, parseDef_js_1.parseDef)(def.catchall._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalProperties"
            ]
        });
    }
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
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/optional.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseOptionalDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
const parseOptionalDef = (def, refs)=>{
    if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
        return (0, parseDef_js_1.parseDef)(def.innerType._def, refs);
    }
    const innerSchema = (0, parseDef_js_1.parseDef)(def.innerType._def, {
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
                not: (0, any_js_1.parseAnyDef)(refs)
            },
            innerSchema
        ]
    } : (0, any_js_1.parseAnyDef)(refs);
};
exports.parseOptionalDef = parseOptionalDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/pipeline.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parsePipelineDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const parsePipelineDef = (def, refs)=>{
    if (refs.pipeStrategy === "input") {
        return (0, parseDef_js_1.parseDef)(def.in._def, refs);
    } else if (refs.pipeStrategy === "output") {
        return (0, parseDef_js_1.parseDef)(def.out._def, refs);
    }
    const a = (0, parseDef_js_1.parseDef)(def.in._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "allOf",
            "0"
        ]
    });
    const b = (0, parseDef_js_1.parseDef)(def.out._def, {
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
        ].filter((x)=>x !== undefined)
    };
};
exports.parsePipelineDef = parsePipelineDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/promise.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parsePromiseDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parsePromiseDef(def, refs) {
    return (0, parseDef_js_1.parseDef)(def.type._def, refs);
}
exports.parsePromiseDef = parsePromiseDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/set.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseSetDef = void 0;
const errorMessages_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)");
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parseSetDef(def, refs) {
    const items = (0, parseDef_js_1.parseDef)(def.valueType._def, {
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
    if (def.minSize) {
        (0, errorMessages_js_1.setResponseValueAndErrors)(schema, "minItems", def.minSize.value, def.minSize.message, refs);
    }
    if (def.maxSize) {
        (0, errorMessages_js_1.setResponseValueAndErrors)(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
    }
    return schema;
}
exports.parseSetDef = parseSetDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/tuple.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseTupleDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items.map((x, i)=>(0, parseDef_js_1.parseDef)(x._def, {
                    ...refs,
                    currentPath: [
                        ...refs.currentPath,
                        "items",
                        `${i}`
                    ]
                })).reduce((acc, x)=>x === undefined ? acc : [
                    ...acc,
                    x
                ], []),
            additionalItems: (0, parseDef_js_1.parseDef)(def.rest._def, {
                ...refs,
                currentPath: [
                    ...refs.currentPath,
                    "additionalItems"
                ]
            })
        };
    } else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items.map((x, i)=>(0, parseDef_js_1.parseDef)(x._def, {
                    ...refs,
                    currentPath: [
                        ...refs.currentPath,
                        "items",
                        `${i}`
                    ]
                })).reduce((acc, x)=>x === undefined ? acc : [
                    ...acc,
                    x
                ], [])
        };
    }
}
exports.parseTupleDef = parseTupleDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/undefined.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseUndefinedDef = void 0;
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseUndefinedDef(refs) {
    return {
        not: (0, any_js_1.parseAnyDef)(refs)
    };
}
exports.parseUndefinedDef = parseUndefinedDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/unknown.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseUnknownDef = void 0;
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseUnknownDef(refs) {
    return (0, any_js_1.parseAnyDef)(refs);
}
exports.parseUnknownDef = parseUnknownDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/readonly.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseReadonlyDef = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const parseReadonlyDef = (def, refs)=>{
    return (0, parseDef_js_1.parseDef)(def.innerType._def, refs);
};
exports.parseReadonlyDef = parseReadonlyDef;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/selectParser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectParser = void 0;
const v3_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
const array_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/array.js [app-route] (ecmascript)");
const bigint_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/bigint.js [app-route] (ecmascript)");
const boolean_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/boolean.js [app-route] (ecmascript)");
const branded_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/branded.js [app-route] (ecmascript)");
const catch_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/catch.js [app-route] (ecmascript)");
const date_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/date.js [app-route] (ecmascript)");
const default_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/default.js [app-route] (ecmascript)");
const effects_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/effects.js [app-route] (ecmascript)");
const enum_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/enum.js [app-route] (ecmascript)");
const intersection_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/intersection.js [app-route] (ecmascript)");
const literal_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/literal.js [app-route] (ecmascript)");
const map_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/map.js [app-route] (ecmascript)");
const nativeEnum_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nativeEnum.js [app-route] (ecmascript)");
const never_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/never.js [app-route] (ecmascript)");
const null_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/null.js [app-route] (ecmascript)");
const nullable_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nullable.js [app-route] (ecmascript)");
const number_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/number.js [app-route] (ecmascript)");
const object_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/object.js [app-route] (ecmascript)");
const optional_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/optional.js [app-route] (ecmascript)");
const pipeline_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/pipeline.js [app-route] (ecmascript)");
const promise_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/promise.js [app-route] (ecmascript)");
const record_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/record.js [app-route] (ecmascript)");
const set_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/set.js [app-route] (ecmascript)");
const string_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/string.js [app-route] (ecmascript)");
const tuple_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/tuple.js [app-route] (ecmascript)");
const undefined_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/undefined.js [app-route] (ecmascript)");
const union_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/union.js [app-route] (ecmascript)");
const unknown_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/unknown.js [app-route] (ecmascript)");
const readonly_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/readonly.js [app-route] (ecmascript)");
const selectParser = (def, typeName, refs)=>{
    switch(typeName){
        case v3_1.ZodFirstPartyTypeKind.ZodString:
            return (0, string_js_1.parseStringDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodNumber:
            return (0, number_js_1.parseNumberDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodObject:
            return (0, object_js_1.parseObjectDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodBigInt:
            return (0, bigint_js_1.parseBigintDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodBoolean:
            return (0, boolean_js_1.parseBooleanDef)();
        case v3_1.ZodFirstPartyTypeKind.ZodDate:
            return (0, date_js_1.parseDateDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodUndefined:
            return (0, undefined_js_1.parseUndefinedDef)(refs);
        case v3_1.ZodFirstPartyTypeKind.ZodNull:
            return (0, null_js_1.parseNullDef)(refs);
        case v3_1.ZodFirstPartyTypeKind.ZodArray:
            return (0, array_js_1.parseArrayDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodUnion:
        case v3_1.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return (0, union_js_1.parseUnionDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodIntersection:
            return (0, intersection_js_1.parseIntersectionDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodTuple:
            return (0, tuple_js_1.parseTupleDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodRecord:
            return (0, record_js_1.parseRecordDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodLiteral:
            return (0, literal_js_1.parseLiteralDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodEnum:
            return (0, enum_js_1.parseEnumDef)(def);
        case v3_1.ZodFirstPartyTypeKind.ZodNativeEnum:
            return (0, nativeEnum_js_1.parseNativeEnumDef)(def);
        case v3_1.ZodFirstPartyTypeKind.ZodNullable:
            return (0, nullable_js_1.parseNullableDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodOptional:
            return (0, optional_js_1.parseOptionalDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodMap:
            return (0, map_js_1.parseMapDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodSet:
            return (0, set_js_1.parseSetDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodLazy:
            return ()=>def.getter()._def;
        case v3_1.ZodFirstPartyTypeKind.ZodPromise:
            return (0, promise_js_1.parsePromiseDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodNaN:
        case v3_1.ZodFirstPartyTypeKind.ZodNever:
            return (0, never_js_1.parseNeverDef)(refs);
        case v3_1.ZodFirstPartyTypeKind.ZodEffects:
            return (0, effects_js_1.parseEffectsDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodAny:
            return (0, any_js_1.parseAnyDef)(refs);
        case v3_1.ZodFirstPartyTypeKind.ZodUnknown:
            return (0, unknown_js_1.parseUnknownDef)(refs);
        case v3_1.ZodFirstPartyTypeKind.ZodDefault:
            return (0, default_js_1.parseDefaultDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodBranded:
            return (0, branded_js_1.parseBrandedDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodReadonly:
            return (0, readonly_js_1.parseReadonlyDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodCatch:
            return (0, catch_js_1.parseCatchDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodPipeline:
            return (0, pipeline_js_1.parsePipelineDef)(def, refs);
        case v3_1.ZodFirstPartyTypeKind.ZodFunction:
        case v3_1.ZodFirstPartyTypeKind.ZodVoid:
        case v3_1.ZodFirstPartyTypeKind.ZodSymbol:
            return undefined;
        default:
            return ((_)=>undefined)(typeName);
    }
};
exports.selectParser = selectParser;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseDef = void 0;
const Options_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Options.js [app-route] (ecmascript)");
const selectParser_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/selectParser.js [app-route] (ecmascript)");
const getRelativePath_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/getRelativePath.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
function parseDef(def, refs, forceResolution = false) {
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
        if (overrideResult !== Options_js_1.ignoreOverride) {
            return overrideResult;
        }
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== undefined) {
            return seenSchema;
        }
    }
    const newItem = {
        def,
        path: refs.currentPath,
        jsonSchema: undefined
    };
    refs.seen.set(def, newItem);
    const jsonSchemaOrGetter = (0, selectParser_js_1.selectParser)(def, def.typeName, refs);
    // If the return was a function, then the inner definition needs to be extracted before a call to parseDef (recursive)
    const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
    if (jsonSchema) {
        addMeta(def, refs, jsonSchema);
    }
    if (refs.postProcess) {
        const postProcessResult = refs.postProcess(jsonSchema, def, refs);
        newItem.jsonSchema = jsonSchema;
        return postProcessResult;
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
exports.parseDef = parseDef;
const get$ref = (item, refs)=>{
    switch(refs.$refStrategy){
        case "root":
            return {
                $ref: item.path.join("/")
            };
        case "relative":
            return {
                $ref: (0, getRelativePath_js_1.getRelativePath)(refs.currentPath, item.path)
            };
        case "none":
        case "seen":
            {
                if (item.path.length < refs.currentPath.length && item.path.every((value, index)=>refs.currentPath[index] === value)) {
                    console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                    return (0, any_js_1.parseAnyDef)(refs);
                }
                return refs.$refStrategy === "seen" ? (0, any_js_1.parseAnyDef)(refs) : undefined;
            }
    }
};
const addMeta = (def, refs, jsonSchema)=>{
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
            jsonSchema.markdownDescription = def.description;
        }
    }
    return jsonSchema;
};
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseTypes.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/zodToJsonSchema.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.zodToJsonSchema = void 0;
const parseDef_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)");
const Refs_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Refs.js [app-route] (ecmascript)");
const any_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)");
const zodToJsonSchema = (schema, options)=>{
    const refs = (0, Refs_js_1.getRefs)(options);
    let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name, schema])=>({
            ...acc,
            [name]: (0, parseDef_js_1.parseDef)(schema._def, {
                ...refs,
                currentPath: [
                    ...refs.basePath,
                    refs.definitionPath,
                    name
                ]
            }, true) ?? (0, any_js_1.parseAnyDef)(refs)
        }), {}) : undefined;
    const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? undefined : options?.name;
    const main = (0, parseDef_js_1.parseDef)(schema._def, name === undefined ? refs : {
        ...refs,
        currentPath: [
            ...refs.basePath,
            refs.definitionPath,
            name
        ]
    }, false) ?? (0, any_js_1.parseAnyDef)(refs);
    const title = typeof options === "object" && options.name !== undefined && options.nameStrategy === "title" ? options.name : undefined;
    if (title !== undefined) {
        main.title = title;
    }
    if (refs.flags.hasReferencedOpenAiAnyType) {
        if (!definitions) {
            definitions = {};
        }
        if (!definitions[refs.openAiAnyTypeName]) {
            definitions[refs.openAiAnyTypeName] = {
                // Skipping "object" as no properties can be defined and additionalProperties must be "false"
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
    }
    const combined = name === undefined ? definitions ? {
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
    if (refs.target === "jsonSchema7") {
        combined.$schema = "http://json-schema.org/draft-07/schema#";
    } else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
        combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
    }
    if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) {
        console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
    }
    return combined;
};
exports.zodToJsonSchema = zodToJsonSchema;
}),
"[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Options.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/Refs.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/errorMessages.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/getRelativePath.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseDef.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parseTypes.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/any.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/array.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/bigint.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/boolean.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/branded.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/catch.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/date.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/default.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/effects.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/enum.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/intersection.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/literal.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/map.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nativeEnum.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/never.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/null.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/nullable.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/number.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/object.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/optional.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/pipeline.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/promise.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/readonly.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/record.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/set.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/string.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/tuple.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/undefined.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/union.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/parsers/unknown.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/selectParser.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/zodToJsonSchema.js [app-route] (ecmascript)"), exports);
const zodToJsonSchema_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod-to-json-schema/dist/cjs/zodToJsonSchema.js [app-route] (ecmascript)");
exports.default = zodToJsonSchema_js_1.zodToJsonSchema;
}),
"[project]/projects/tartanhacks/node_modules/decamelize/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = function(str, sep) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }
    sep = typeof sep === 'undefined' ? '_' : sep;
    return str.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2').replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2').toLowerCase();
};
}),
"[project]/projects/tartanhacks/node_modules/camelcase/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATORS = /[_.\- ]+/;
const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu');
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu');
const preserveCamelCase = (string, toLowerCase, toUpperCase)=>{
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;
    for(let i = 0; i < string.length; i++){
        const character = string[i];
        if (isLastCharLower && UPPERCASE.test(character)) {
            string = string.slice(0, i) + '-' + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
        } else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
            string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        } else {
            isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
        }
    }
    return string;
};
const preserveConsecutiveUppercase = (input, toLowerCase)=>{
    LEADING_CAPITAL.lastIndex = 0;
    return input.replace(LEADING_CAPITAL, (m1)=>toLowerCase(m1));
};
const postProcess = (input, toUpperCase)=>{
    SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
    NUMBERS_AND_IDENTIFIER.lastIndex = 0;
    return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier)=>toUpperCase(identifier)).replace(NUMBERS_AND_IDENTIFIER, (m)=>toUpperCase(m));
};
const camelCase = (input, options)=>{
    if (!(typeof input === 'string' || Array.isArray(input))) {
        throw new TypeError('Expected the input to be `string | string[]`');
    }
    options = {
        pascalCase: false,
        preserveConsecutiveUppercase: false,
        ...options
    };
    if (Array.isArray(input)) {
        input = input.map((x)=>x.trim()).filter((x)=>x.length).join('-');
    } else {
        input = input.trim();
    }
    if (input.length === 0) {
        return '';
    }
    const toLowerCase = options.locale === false ? (string)=>string.toLowerCase() : (string)=>string.toLocaleLowerCase(options.locale);
    const toUpperCase = options.locale === false ? (string)=>string.toUpperCase() : (string)=>string.toLocaleUpperCase(options.locale);
    if (input.length === 1) {
        return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
    }
    const hasUpperCase = input !== toLowerCase(input);
    if (hasUpperCase) {
        input = preserveCamelCase(input, toLowerCase, toUpperCase);
    }
    input = input.replace(LEADING_SEPARATORS, '');
    if (options.preserveConsecutiveUppercase) {
        input = preserveConsecutiveUppercase(input, toLowerCase);
    } else {
        input = toLowerCase(input);
    }
    if (options.pascalCase) {
        input = toUpperCase(input.charAt(0)) + input.slice(1);
    }
    return postProcess(input, toUpperCase);
};
module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;
}),
"[project]/projects/tartanhacks/node_modules/eventemitter3/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var has = Object.prototype.hasOwnProperty, prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__) prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events){
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++){
        ee[i] = handlers[i].fn;
    }
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++){
            args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++){
                        args[j - 1] = arguments[j];
                    }
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
        }
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++){
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
                events.push(listeners[i]);
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
    } else {
        this._events = new Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;
//
// Expose the module.
//
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = EventEmitter;
}
}),
"[project]/projects/tartanhacks/node_modules/p-finally/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = (promise, onFinally)=>{
    onFinally = onFinally || (()=>{});
    return promise.then((val)=>new Promise((resolve)=>{
            resolve(onFinally());
        }).then(()=>val), (err)=>new Promise((resolve)=>{
            resolve(onFinally());
        }).then(()=>{
            throw err;
        }));
};
}),
"[project]/projects/tartanhacks/node_modules/p-timeout/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const pFinally = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-finally/index.js [app-route] (ecmascript)");
class TimeoutError extends Error {
    constructor(message){
        super(message);
        this.name = 'TimeoutError';
    }
}
const pTimeout = (promise, milliseconds, fallback)=>new Promise((resolve, reject)=>{
        if (typeof milliseconds !== 'number' || milliseconds < 0) {
            throw new TypeError('Expected `milliseconds` to be a positive number');
        }
        if (milliseconds === Infinity) {
            resolve(promise);
            return;
        }
        const timer = setTimeout(()=>{
            if (typeof fallback === 'function') {
                try {
                    resolve(fallback());
                } catch (error) {
                    reject(error);
                }
                return;
            }
            const message = typeof fallback === 'string' ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
            const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
            if (typeof promise.cancel === 'function') {
                promise.cancel();
            }
            reject(timeoutError);
        }, milliseconds);
        // TODO: Use native `finally` keyword when targeting Node.js 10
        pFinally(// eslint-disable-next-line promise/prefer-await-to-then
        promise.then(resolve, reject), ()=>{
            clearTimeout(timer);
        });
    });
module.exports = pTimeout;
// TODO: Remove this for the next major release
module.exports.default = pTimeout;
module.exports.TimeoutError = TimeoutError;
}),
"[project]/projects/tartanhacks/node_modules/p-queue/dist/lower-bound.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while(count > 0){
        const step = count / 2 | 0;
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            first = ++it;
            count -= step + 1;
        } else {
            count = step;
        }
    }
    return first;
}
exports.default = lowerBound;
}),
"[project]/projects/tartanhacks/node_modules/p-queue/dist/priority-queue.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const lower_bound_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-queue/dist/lower-bound.js [app-route] (ecmascript)");
class PriorityQueue {
    constructor(){
        this._queue = [];
    }
    enqueue(run, options) {
        options = Object.assign({
            priority: 0
        }, options);
        const element = {
            priority: options.priority,
            run
        };
        if (this.size && this._queue[this.size - 1].priority >= options.priority) {
            this._queue.push(element);
            return;
        }
        const index = lower_bound_1.default(this._queue, element, (a, b)=>b.priority - a.priority);
        this._queue.splice(index, 0, element);
    }
    dequeue() {
        const item = this._queue.shift();
        return item === null || item === void 0 ? void 0 : item.run;
    }
    filter(options) {
        return this._queue.filter((element)=>element.priority === options.priority).map((element)=>element.run);
    }
    get size() {
        return this._queue.length;
    }
}
exports.default = PriorityQueue;
}),
"[project]/projects/tartanhacks/node_modules/p-queue/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const EventEmitter = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/eventemitter3/index.js [app-route] (ecmascript)");
const p_timeout_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-timeout/index.js [app-route] (ecmascript)");
const priority_queue_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/p-queue/dist/priority-queue.js [app-route] (ecmascript)");
// eslint-disable-next-line @typescript-eslint/no-empty-function
const empty = ()=>{};
const timeoutError = new p_timeout_1.TimeoutError();
/**
Promise queue with concurrency control.
*/ class PQueue extends EventEmitter {
    constructor(options){
        var _a, _b, _c, _d;
        super();
        this._intervalCount = 0;
        this._intervalEnd = 0;
        this._pendingCount = 0;
        this._resolveEmpty = empty;
        this._resolveIdle = empty;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = Object.assign({
            carryoverConcurrencyCount: false,
            intervalCap: Infinity,
            interval: 0,
            concurrency: Infinity,
            autoStart: true,
            queueClass: priority_queue_1.default
        }, options);
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''}\` (${typeof options.interval})`);
        }
        this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this._isIntervalIgnored = options.intervalCap === Infinity || options.interval === 0;
        this._intervalCap = options.intervalCap;
        this._interval = options.interval;
        this._queue = new options.queueClass();
        this._queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this._timeout = options.timeout;
        this._throwOnTimeout = options.throwOnTimeout === true;
        this._isPaused = options.autoStart === false;
    }
    get _doesIntervalAllowAnother() {
        return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
    }
    get _doesConcurrentAllowAnother() {
        return this._pendingCount < this._concurrency;
    }
    _next() {
        this._pendingCount--;
        this._tryToStartAnother();
        this.emit('next');
    }
    _resolvePromises() {
        this._resolveEmpty();
        this._resolveEmpty = empty;
        if (this._pendingCount === 0) {
            this._resolveIdle();
            this._resolveIdle = empty;
            this.emit('idle');
        }
    }
    _onResumeInterval() {
        this._onInterval();
        this._initializeIntervalIfNeeded();
        this._timeoutId = undefined;
    }
    _isIntervalPaused() {
        const now = Date.now();
        if (this._intervalId === undefined) {
            const delay = this._intervalEnd - now;
            if (delay < 0) {
                // Act as the interval was done
                // We don't need to resume it here because it will be resumed on line 160
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            } else {
                // Act as the interval is pending
                if (this._timeoutId === undefined) {
                    this._timeoutId = setTimeout(()=>{
                        this._onResumeInterval();
                    }, delay);
                }
                return true;
            }
        }
        return false;
    }
    _tryToStartAnother() {
        if (this._queue.size === 0) {
            // We can clear the interval ("pause")
            // Because we can redo it later ("resume")
            if (this._intervalId) {
                clearInterval(this._intervalId);
            }
            this._intervalId = undefined;
            this._resolvePromises();
            return false;
        }
        if (!this._isPaused) {
            const canInitializeInterval = !this._isIntervalPaused();
            if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                const job = this._queue.dequeue();
                if (!job) {
                    return false;
                }
                this.emit('active');
                job();
                if (canInitializeInterval) {
                    this._initializeIntervalIfNeeded();
                }
                return true;
            }
        }
        return false;
    }
    _initializeIntervalIfNeeded() {
        if (this._isIntervalIgnored || this._intervalId !== undefined) {
            return;
        }
        this._intervalId = setInterval(()=>{
            this._onInterval();
        }, this._interval);
        this._intervalEnd = Date.now() + this._interval;
    }
    _onInterval() {
        if (this._intervalCount === 0 && this._pendingCount === 0 && this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = undefined;
        }
        this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
        this._processQueue();
    }
    /**
    Executes all queued functions until it reaches the limit.
    */ _processQueue() {
        // eslint-disable-next-line no-empty
        while(this._tryToStartAnother()){}
    }
    get concurrency() {
        return this._concurrency;
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this._concurrency = newConcurrency;
        this._processQueue();
    }
    /**
    Adds a sync or async task to the queue. Always returns a promise.
    */ async add(fn, options = {}) {
        return new Promise((resolve, reject)=>{
            const run = async ()=>{
                this._pendingCount++;
                this._intervalCount++;
                try {
                    const operation = this._timeout === undefined && options.timeout === undefined ? fn() : p_timeout_1.default(Promise.resolve(fn()), options.timeout === undefined ? this._timeout : options.timeout, ()=>{
                        if (options.throwOnTimeout === undefined ? this._throwOnTimeout : options.throwOnTimeout) {
                            reject(timeoutError);
                        }
                        return undefined;
                    });
                    resolve(await operation);
                } catch (error) {
                    reject(error);
                }
                this._next();
            };
            this._queue.enqueue(run, options);
            this._tryToStartAnother();
            this.emit('add');
        });
    }
    /**
    Same as `.add()`, but accepts an array of sync or async functions.

    @returns A promise that resolves when all functions are resolved.
    */ async addAll(functions, options) {
        return Promise.all(functions.map(async (function_)=>this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */ start() {
        if (!this._isPaused) {
            return this;
        }
        this._isPaused = false;
        this._processQueue();
        return this;
    }
    /**
    Put queue execution on hold.
    */ pause() {
        this._isPaused = true;
    }
    /**
    Clear the queue.
    */ clear() {
        this._queue = new this._queueClass();
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */ async onEmpty() {
        // Instantly resolve if the queue is empty
        if (this._queue.size === 0) {
            return;
        }
        return new Promise((resolve)=>{
            const existingResolve = this._resolveEmpty;
            this._resolveEmpty = ()=>{
                existingResolve();
                resolve();
            };
        });
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */ async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (this._pendingCount === 0 && this._queue.size === 0) {
            return;
        }
        return new Promise((resolve)=>{
            const existingResolve = this._resolveIdle;
            this._resolveIdle = ()=>{
                existingResolve();
                resolve();
            };
        });
    }
    /**
    Size of the queue.
    */ get size() {
        return this._queue.size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */ sizeBy(options) {
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        return this._queue.filter(options).length;
    }
    /**
    Number of pending promises.
    */ get pending() {
        return this._pendingCount;
    }
    /**
    Whether the queue is currently paused.
    */ get isPaused() {
        return this._isPaused;
    }
    get timeout() {
        return this._timeout;
    }
    /**
    Set the timeout for future operations.
    */ set timeout(milliseconds) {
        this._timeout = milliseconds;
    }
}
exports.default = PQueue;
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0';
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16;
// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
const RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease'
];
module.exports = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010
};
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error('SEMVER', ...args) : ()=>{};
module.exports = debug;
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
exports = module.exports = {};
// The actual regexps go on exports.re
const re = exports.re = [];
const safeRe = exports.safeRe = [];
const src = exports.src = [];
const safeSrc = exports.safeSrc = [];
const t = exports.t = {};
let R = 0;
const LETTERDASHNUMBER = '[a-zA-Z0-9-]';
// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
    [
        '\\s',
        1
    ],
    [
        '\\d',
        MAX_LENGTH
    ],
    [
        LETTERDASHNUMBER,
        MAX_SAFE_BUILD_LENGTH
    ]
];
const makeSafeRegex = (value)=>{
    for (const [token, max] of safeRegexReplacements){
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
    }
    return value;
};
const createToken = (name, value, isGlobal)=>{
    const safe = makeSafeRegex(value);
    const index = R++;
    debug(name, index, value);
    t[name] = index;
    src[index] = value;
    safeSrc[index] = safe;
    re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '\\d+');
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
// ## Main Version
// Three dot-separated numeric identifiers.
createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
// Non-numeric identifiers include numeric identifiers but can be longer.
// Therefore non-numeric identifiers must go first.
createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken('FULL', `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
createToken('GTLT', '((?:<|>)?=?)');
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
createToken('COERCEFULL', src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?` + `(?:${src[t.BUILD]})?` + `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);
createToken('COERCERTLFULL', src[t.COERCEFULL], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');
createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';
createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');
createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';
createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// parse out just the options we care about
const looseOption = Object.freeze({
    loose: true
});
const emptyOpts = Object.freeze({});
const parseOptions = (options)=>{
    if (!options) {
        return emptyOpts;
    }
    if (typeof options !== 'object') {
        return looseOption;
    }
    return options;
};
module.exports = parseOptions;
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const numeric = /^[0-9]+$/;
const compareIdentifiers = (a, b)=>{
    if (typeof a === 'number' && typeof b === 'number') {
        return a === b ? 0 : a < b ? -1 : 1;
    }
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const rcompareIdentifiers = (a, b)=>compareIdentifiers(b, a);
module.exports = {
    compareIdentifiers,
    rcompareIdentifiers
};
}),
"[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const debug = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const parseOptions = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { compareIdentifiers } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
class SemVer {
    constructor(version, options){
        options = parseOptions(options);
        if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
                return version;
            } else {
                version = version.version;
            }
        } else if (typeof version !== 'string') {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
            throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError('Invalid patch version');
        }
        // numberify any prerelease numeric ids
        if (!m[4]) {
            this.prerelease = [];
        } else {
            this.prerelease = m[4].split('.').map((id)=>{
                if (/^[0-9]+$/.test(id)) {
                    const num = +id;
                    if (num >= 0 && num < MAX_SAFE_INTEGER) {
                        return num;
                    }
                }
                return id;
            });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
            this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
            if (typeof other === 'string' && other === this.version) {
                return 0;
            }
            other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
            return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        if (this.major < other.major) {
            return -1;
        }
        if (this.major > other.major) {
            return 1;
        }
        if (this.minor < other.minor) {
            return -1;
        }
        if (this.minor > other.minor) {
            return 1;
        }
        if (this.patch < other.patch) {
            return -1;
        }
        if (this.patch > other.patch) {
            return 1;
        }
        return 0;
    }
    comparePre(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) {
            return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
        }
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    compareBuild(other) {
        if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            debug('build compare', i, a, b);
            if (a === undefined && b === undefined) {
                return 0;
            } else if (b === undefined) {
                return 1;
            } else if (a === undefined) {
                return -1;
            } else if (a === b) {
                continue;
            } else {
                return compareIdentifiers(a, b);
            }
        }while (++i)
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
        if (release.startsWith('pre')) {
            if (!identifier && identifierBase === false) {
                throw new Error('invalid increment argument: identifier is empty');
            }
            // Avoid an invalid semver results
            if (identifier) {
                const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
                if (!match || match[1] !== identifier) {
                    throw new Error(`invalid identifier: ${identifier}`);
                }
            }
        }
        switch(release){
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier, identifierBase);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier, identifierBase);
                this.inc('pre', identifier, identifierBase);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) {
                    this.inc('patch', identifier, identifierBase);
                }
                this.inc('pre', identifier, identifierBase);
                break;
            case 'release':
                if (this.prerelease.length === 0) {
                    throw new Error(`version ${this.raw} is not a prerelease`);
                }
                this.prerelease.length = 0;
                break;
            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                    this.major++;
                }
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) {
                    this.minor++;
                }
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) {
                    this.patch++;
                }
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                {
                    const base = Number(identifierBase) ? 1 : 0;
                    if (this.prerelease.length === 0) {
                        this.prerelease = [
                            base
                        ];
                    } else {
                        let i = this.prerelease.length;
                        while(--i >= 0){
                            if (typeof this.prerelease[i] === 'number') {
                                this.prerelease[i]++;
                                i = -2;
                            }
                        }
                        if (i === -1) {
                            // didn't increment anything
                            if (identifier === this.prerelease.join('.') && identifierBase === false) {
                                throw new Error('invalid increment argument: identifier already exists');
                            }
                            this.prerelease.push(base);
                        }
                    }
                    if (identifier) {
                        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                        let prerelease = [
                            identifier,
                            base
                        ];
                        if (identifierBase === false) {
                            prerelease = [
                                identifier
                            ];
                        }
                        if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                            if (isNaN(this.prerelease[1])) {
                                this.prerelease = prerelease;
                            }
                        } else {
                            this.prerelease = prerelease;
                        }
                    }
                    break;
                }
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
            this.raw += `+${this.build.join('.')}`;
        }
        return this;
    }
}
module.exports = SemVer;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = (version, options, throwErrors = false)=>{
    if (version instanceof SemVer) {
        return version;
    }
    try {
        return new SemVer(version, options);
    } catch (er) {
        if (!throwErrors) {
            return null;
        }
        throw er;
    }
};
module.exports = parse;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = (version, options)=>{
    const v = parse(version, options);
    return v ? v.version : null;
};
module.exports = valid;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/clean.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const clean = (version, options)=>{
    const s = parse(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null;
};
module.exports = clean;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/inc.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const inc = (version, release, options, identifier, identifierBase)=>{
    if (typeof options === 'string') {
        identifierBase = identifier;
        identifier = options;
        options = undefined;
    }
    try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
    } catch (er) {
        return null;
    }
};
module.exports = inc;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/diff.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const diff = (version1, version2)=>{
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
        return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
        // Going from prerelease -> no prerelease requires some special casing
        // If the low version has only a major, then it will always be a major
        // Some examples:
        // 1.0.0-1 -> 1.0.0
        // 1.0.0-1 -> 1.1.1
        // 1.0.0-1 -> 2.0.0
        if (!lowVersion.patch && !lowVersion.minor) {
            return 'major';
        }
        // If the main part has no difference
        if (lowVersion.compareMain(highVersion) === 0) {
            if (lowVersion.minor && !lowVersion.patch) {
                return 'minor';
            }
            return 'patch';
        }
    }
    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? 'pre' : '';
    if (v1.major !== v2.major) {
        return prefix + 'major';
    }
    if (v1.minor !== v2.minor) {
        return prefix + 'minor';
    }
    if (v1.patch !== v2.patch) {
        return prefix + 'patch';
    }
    // high and low are prereleases
    return 'prerelease';
};
module.exports = diff;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/major.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const major = (a, loose)=>new SemVer(a, loose).major;
module.exports = major;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/minor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const minor = (a, loose)=>new SemVer(a, loose).minor;
module.exports = minor;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/patch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const patch = (a, loose)=>new SemVer(a, loose).patch;
module.exports = patch;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const prerelease = (version, options)=>{
    const parsed = parse(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
};
module.exports = prerelease;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compare = (a, b, loose)=>new SemVer(a, loose).compare(new SemVer(b, loose));
module.exports = compare;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = (a, b, loose)=>compare(b, a, loose);
module.exports = rcompare;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const compareLoose = (a, b)=>compare(a, b, true);
module.exports = compareLoose;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const compareBuild = (a, b, loose)=>{
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
};
module.exports = compareBuild;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/sort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = (list, loose)=>list.sort((a, b)=>compareBuild(a, b, loose));
module.exports = sort;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/rsort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compareBuild = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const rsort = (list, loose)=>list.sort((a, b)=>compareBuild(b, a, loose));
module.exports = rsort;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/gt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gt = (a, b, loose)=>compare(a, b, loose) > 0;
module.exports = gt;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/lt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lt = (a, b, loose)=>compare(a, b, loose) < 0;
module.exports = lt;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/eq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const eq = (a, b, loose)=>compare(a, b, loose) === 0;
module.exports = eq;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/neq.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const neq = (a, b, loose)=>compare(a, b, loose) !== 0;
module.exports = neq;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/gte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const gte = (a, b, loose)=>compare(a, b, loose) >= 0;
module.exports = gte;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/lte.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const lte = (a, b, loose)=>compare(a, b, loose) <= 0;
module.exports = lte;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/cmp.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const eq = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = (a, op, b, loose)=>{
    switch(op){
        case '===':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a === b;
        case '!==':
            if (typeof a === 'object') {
                a = a.version;
            }
            if (typeof b === 'object') {
                b = b.version;
            }
            return a !== b;
        case '':
        case '=':
        case '==':
            return eq(a, b, loose);
        case '!=':
            return neq(a, b, loose);
        case '>':
            return gt(a, b, loose);
        case '>=':
            return gte(a, b, loose);
        case '<':
            return lt(a, b, loose);
        case '<=':
            return lte(a, b, loose);
        default:
            throw new TypeError(`Invalid operator: ${op}`);
    }
};
module.exports = cmp;
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/coerce.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const coerce = (version, options)=>{
    if (version instanceof SemVer) {
        return version;
    }
    if (typeof version === 'number') {
        version = String(version);
    }
    if (typeof version !== 'string') {
        return null;
    }
    options = options || {};
    let match = null;
    if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
        // Find the right-most coercible string that does not share
        // a terminus with a more left-ward coercible string.
        // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
        // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
        //
        // Walk through the string checking with a /g regexp
        // Manually set the index so as to pick up overlapping matches.
        // Stop when we get a match that ends at the string end, since no
        // coercible string can be more right-ward without the same terminus.
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)){
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
                match = next;
            }
            coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        // leave it in a clean state
        coerceRtlRegex.lastIndex = -1;
    }
    if (match === null) {
        return null;
    }
    const major = match[2];
    const minor = match[3] || '0';
    const patch = match[4] || '0';
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
};
module.exports = coerce;
}),
"[project]/projects/tartanhacks/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

class LRUCache {
    constructor(){
        this.max = 1000;
        this.map = new Map();
    }
    get(key) {
        const value = this.map.get(key);
        if (value === undefined) {
            return undefined;
        } else {
            // Remove the key from the map and add it to the end
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
    }
    delete(key) {
        return this.map.delete(key);
    }
    set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== undefined) {
            // If cache is full, delete the least recently used item
            if (this.map.size >= this.max) {
                const firstKey = this.map.keys().next().value;
                this.delete(firstKey);
            }
            this.map.set(key, value);
        }
        return this;
    }
}
module.exports = LRUCache;
}),
"[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SPACE_CHARACTERS = /\s+/g;
// hoisted class for cyclic dependency
class Range {
    constructor(range, options){
        options = parseOptions(options);
        if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
                return range;
            } else {
                return new Range(range.raw, options);
            }
        }
        if (range instanceof Comparator) {
            // just put it in the set and return
            this.raw = range.value;
            this.set = [
                [
                    range
                ]
            ];
            this.formatted = undefined;
            return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        // First reduce all whitespace as much as possible so we do not have to rely
        // on potentially slow regexes like \s*. This is then stored and used for
        // future error messages as well.
        this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');
        // First, split on ||
        this.set = this.raw.split('||')// map the range to a 2d array of comparators
        .map((r)=>this.parseRange(r.trim()))// throw out any comparator lists that are empty
        // this generally means that it was not a valid range, which is allowed
        // in loose mode, but will still throw if the WHOLE range is invalid.
        .filter((c)=>c.length);
        if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        // if we have any that are not the null set, throw out null sets.
        if (this.set.length > 1) {
            // keep the first one, in case they're all null sets
            const first = this.set[0];
            this.set = this.set.filter((c)=>!isNullSet(c[0]));
            if (this.set.length === 0) {
                this.set = [
                    first
                ];
            } else if (this.set.length > 1) {
                // if we have any that are *, then the range is just *
                for (const c of this.set){
                    if (c.length === 1 && isAny(c[0])) {
                        this.set = [
                            c
                        ];
                        break;
                    }
                }
            }
        }
        this.formatted = undefined;
    }
    get range() {
        if (this.formatted === undefined) {
            this.formatted = '';
            for(let i = 0; i < this.set.length; i++){
                if (i > 0) {
                    this.formatted += '||';
                }
                const comps = this.set[i];
                for(let k = 0; k < comps.length; k++){
                    if (k > 0) {
                        this.formatted += ' ';
                    }
                    this.formatted += comps[k].toString().trim();
                }
            }
        }
        return this.formatted;
    }
    format() {
        return this.range;
    }
    toString() {
        return this.range;
    }
    parseRange(range) {
        // memoize range parsing for performance.
        // this is a very hot path, and fully deterministic.
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ':' + range;
        const cached = cache.get(memoKey);
        if (cached) {
            return cached;
        }
        const loose = this.options.loose;
        // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range);
        // `~ 1.2.3` => `~1.2.3`
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug('tilde trim', range);
        // `^ 1.2.3` => `^1.2.3`
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug('caret trim', range);
        // At this point, the range is completely trimmed and
        // ready to be split into comparators.
        let rangeList = range.split(' ').map((comp)=>parseComparator(comp, this.options)).join(' ').split(/\s+/)// >=0.0.0 is equivalent to *
        .map((comp)=>replaceGTE0(comp, this.options));
        if (loose) {
            // in loose mode, throw out any that are not valid comparators
            rangeList = rangeList.filter((comp)=>{
                debug('loose invalid filter', comp, this.options);
                return !!comp.match(re[t.COMPARATORLOOSE]);
            });
        }
        debug('range list', rangeList);
        // if any comparators are the null set, then replace with JUST null set
        // if more than one comparator, remove any * comparators
        // also, don't include the same comparator more than once
        const rangeMap = new Map();
        const comparators = rangeList.map((comp)=>new Comparator(comp, this.options));
        for (const comp of comparators){
            if (isNullSet(comp)) {
                return [
                    comp
                ];
            }
            rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) {
            rangeMap.delete('');
        }
        const result = [
            ...rangeMap.values()
        ];
        cache.set(memoKey, result);
        return result;
    }
    intersects(range, options) {
        if (!(range instanceof Range)) {
            throw new TypeError('a Range is required');
        }
        return this.set.some((thisComparators)=>{
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators)=>{
                return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator)=>{
                    return rangeComparators.every((rangeComparator)=>{
                        return thisComparator.intersects(rangeComparator, options);
                    });
                });
            });
        });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version) {
        if (!version) {
            return false;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        for(let i = 0; i < this.set.length; i++){
            if (testSet(this.set[i], version, this.options)) {
                return true;
            }
        }
        return false;
    }
}
module.exports = Range;
const LRU = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/lrucache.js [app-route] (ecmascript)");
const cache = new LRU();
const parseOptions = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const isNullSet = (c)=>c.value === '<0.0.0-0';
const isAny = (c)=>c.value === '';
// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options)=>{
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while(result && remainingComparators.length){
        result = remainingComparators.every((otherComparator)=>{
            return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
    }
    return result;
};
// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options)=>{
    comp = comp.replace(re[t.BUILD], '');
    debug('comp', comp, options);
    comp = replaceCarets(comp, options);
    debug('caret', comp);
    comp = replaceTildes(comp, options);
    debug('tildes', comp);
    comp = replaceXRanges(comp, options);
    debug('xrange', comp);
    comp = replaceStars(comp, options);
    debug('stars', comp);
    return comp;
};
const isX = (id)=>!id || id.toLowerCase() === 'x' || id === '*';
// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceTilde(c, options)).join(' ');
};
const replaceTilde = (comp, options)=>{
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
            debug('replaceTilde pr', pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
    });
};
// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options)=>{
    return comp.trim().split(/\s+/).map((c)=>replaceCaret(c, options)).join(' ');
};
const replaceCaret = (comp, options)=>{
    debug('caret', comp, options);
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr)=>{
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
            ret = '';
        } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        } else if (pr) {
            debug('replaceCaret pr', pr);
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        } else {
            debug('no pr');
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                } else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            } else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        debug('caret return', ret);
        return ret;
    });
};
const replaceXRanges = (comp, options)=>{
    debug('replaceXRanges', comp, options);
    return comp.split(/\s+/).map((c)=>replaceXRange(c, options)).join(' ');
};
const replaceXRange = (comp, options)=>{
    comp = comp.trim();
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr)=>{
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = '<0.0.0-0';
            } else {
                // nothing is forbidden
                ret = '*';
            }
        } else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                } else {
                    m = +m + 1;
                    p = 0;
                }
            } else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                } else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
    });
};
// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options)=>{
    debug('replaceStars', comp, options);
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[t.STAR], '');
};
const replaceGTE0 = (comp, options)=>{
    debug('replaceGTE0', comp, options);
    return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
};
// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
// TODO build?
const hyphenReplace = (incPr)=>($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr)=>{
        if (isX(fM)) {
            from = '';
        } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
        } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
        } else if (fpr) {
            from = `>=${from}`;
        } else {
            from = `>=${from}${incPr ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
            to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
    };
const testSet = (set, version, options)=>{
    for(let i = 0; i < set.length; i++){
        if (!set[i].test(version)) {
            return false;
        }
    }
    if (version.prerelease.length && !options.includePrerelease) {
        // Find the set of versions that are allowed to have prereleases
        // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
        // That should allow `1.2.3-pr.2` to pass.
        // However, `1.2.4-alpha.notready` should NOT be allowed,
        // even though it's within the range set by the comparators.
        for(let i = 0; i < set.length; i++){
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
                continue;
            }
            if (set[i].semver.prerelease.length > 0) {
                const allowed = set[i].semver;
                if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                    return true;
                }
            }
        }
        // Version has a -pre, but it's not one of the ones we like.
        return false;
    }
    return true;
};
}),
"[project]/projects/tartanhacks/node_modules/semver/classes/comparator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const ANY = Symbol('SemVer ANY');
// hoisted class for cyclic dependency
class Comparator {
    static get ANY() {
        return ANY;
    }
    constructor(comp, options){
        options = parseOptions(options);
        if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
                return comp;
            } else {
                comp = comp.value;
            }
        }
        comp = comp.trim().split(/\s+/).join(' ');
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
            this.value = '';
        } else {
            this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
    }
    parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== undefined ? m[1] : '';
        if (this.operator === '=') {
            this.operator = '';
        }
        // if it literally is just '>' or '' then allow anything.
        if (!m[2]) {
            this.semver = ANY;
        } else {
            this.semver = new SemVer(m[2], this.options.loose);
        }
    }
    toString() {
        return this.value;
    }
    test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
            return true;
        }
        if (typeof version === 'string') {
            try {
                version = new SemVer(version, this.options);
            } catch (er) {
                return false;
            }
        }
        return cmp(version, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
            throw new TypeError('a Comparator is required');
        }
        if (this.operator === '') {
            if (this.value === '') {
                return true;
            }
            return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
            if (comp.value === '') {
                return true;
            }
            return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        // Special cases where nothing can possibly be lower
        if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
            return false;
        }
        if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
            return false;
        }
        // Same direction increasing (> or >=)
        if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
            return true;
        }
        // Same direction decreasing (< or <=)
        if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
            return true;
        }
        // same SemVer and both sides are inclusive (<= or >=)
        if (this.semver.version === comp.semver.version && this.operator.includes('=') && comp.operator.includes('=')) {
            return true;
        }
        // opposite directions less than
        if (cmp(this.semver, '<', comp.semver, options) && this.operator.startsWith('>') && comp.operator.startsWith('<')) {
            return true;
        }
        // opposite directions greater than
        if (cmp(this.semver, '>', comp.semver, options) && this.operator.startsWith('<') && comp.operator.startsWith('>')) {
            return true;
        }
        return false;
    }
}
module.exports = Comparator;
const parseOptions = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/parse-options.js [app-route] (ecmascript)");
const { safeRe: re, t } = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const debug = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/debug.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
}),
"[project]/projects/tartanhacks/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = (version, range, options)=>{
    try {
        range = new Range(range, options);
    } catch (er) {
        return false;
    }
    return range.test(version);
};
module.exports = satisfies;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
// Mostly just for testing and legacy API reasons
const toComparators = (range, options)=>new Range(range, options).set.map((comp)=>comp.map((c)=>c.value).join(' ').trim().split(' '));
module.exports = toComparators;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const maxSatisfying = (versions, range, options)=>{
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!max || maxSV.compare(v) === -1) {
                // compare(max, v, true)
                max = v;
                maxSV = new SemVer(max, options);
            }
        }
    });
    return max;
};
module.exports = maxSatisfying;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const minSatisfying = (versions, range, options)=>{
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
        rangeObj = new Range(range, options);
    } catch (er) {
        return null;
    }
    versions.forEach((v)=>{
        if (rangeObj.test(v)) {
            // satisfies(v, range, options)
            if (!min || minSV.compare(v) === 1) {
                // compare(min, v, true)
                min = v;
                minSV = new SemVer(min, options);
            }
        }
    });
    return min;
};
module.exports = minSatisfying;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const minVersion = (range, loose)=>{
    range = new Range(range, loose);
    let minver = new SemVer('0.0.0');
    if (range.test(minver)) {
        return minver;
    }
    minver = new SemVer('0.0.0-0');
    if (range.test(minver)) {
        return minver;
    }
    minver = null;
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator)=>{
            // Clone to avoid manipulating the comparator's semver object.
            const compver = new SemVer(comparator.semver.version);
            switch(comparator.operator){
                case '>':
                    if (compver.prerelease.length === 0) {
                        compver.patch++;
                    } else {
                        compver.prerelease.push(0);
                    }
                    compver.raw = compver.format();
                /* fallthrough */ case '':
                case '>=':
                    if (!setMin || gt(compver, setMin)) {
                        setMin = compver;
                    }
                    break;
                case '<':
                case '<=':
                    break;
                /* istanbul ignore next */ default:
                    throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
        }
    }
    if (minver && range.test(minver)) {
        return minver;
    }
    return null;
};
module.exports = minVersion;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/valid.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const validRange = (range, options)=>{
    try {
        // Return '*' instead of '' so that truthiness works.
        // This will throw if it's invalid anyway
        return new Range(range, options).range || '*';
    } catch (er) {
        return null;
    }
};
module.exports = validRange;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/outside.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const outside = (version, range, hilo, options)=>{
    version = new SemVer(version, options);
    range = new Range(range, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch(hilo){
        case '>':
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = '>';
            ecomp = '>=';
            break;
        case '<':
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = '<';
            ecomp = '<=';
            break;
        default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    // If it satisfies the range it is not outside
    if (satisfies(version, range, options)) {
        return false;
    }
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
    for(let i = 0; i < range.set.length; ++i){
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator)=>{
            if (comparator.semver === ANY) {
                comparator = new Comparator('>=0.0.0');
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
                high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
                low = comparator;
            }
        });
        // If the edge version comparator has a operator then our version
        // isn't outside it
        if (high.operator === comp || high.operator === ecomp) {
            return false;
        }
        // If the lowest version comparator has an operator and our version
        // is less than it then it isn't higher than the range
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
        }
    }
    return true;
};
module.exports = outside;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Determine if version is greater than all the versions possible in the range.
const outside = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = (version, range, options)=>outside(version, range, '>', options);
module.exports = gtr;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const outside = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options)=>outside(version, range, '<', options);
module.exports = ltr;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const intersects = (r1, r2, options)=>{
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
};
module.exports = intersects;
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
module.exports = (versions, range, options)=>{
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b)=>compare(a, b, options));
    for (const version of v){
        const included = satisfies(version, range, options);
        if (included) {
            prev = version;
            if (!first) {
                first = version;
            }
        } else {
            if (prev) {
                set.push([
                    first,
                    prev
                ]);
            }
            prev = null;
            first = null;
        }
    }
    if (first) {
        set.push([
            first,
            null
        ]);
    }
    const ranges = [];
    for (const [min, max] of set){
        if (min === max) {
            ranges.push(min);
        } else if (!max && min === v[0]) {
            ranges.push('*');
        } else if (!max) {
            ranges.push(`>=${min}`);
        } else if (min === v[0]) {
            ranges.push(`<=${max}`);
        } else {
            ranges.push(`${min} - ${max}`);
        }
    }
    const simplified = ranges.join(' || ');
    const original = typeof range.raw === 'string' ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range;
};
}),
"[project]/projects/tartanhacks/node_modules/semver/ranges/subset.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const { ANY } = Comparator;
const satisfies = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If LT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true
const subset = (sub, dom, options = {})=>{
    if (sub === dom) {
        return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set){
        for (const simpleDom of dom.set){
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
                continue OUTER;
            }
        }
        // the null set is a subset of everything, but null simple ranges in
        // a complex range should be ignored.  so if we saw a non-null range,
        // then we know this isn't a subset, but if EVERY simple range was null,
        // then it is a subset.
        if (sawNonNull) {
            return false;
        }
    }
    return true;
};
const minimumVersionWithPreRelease = [
    new Comparator('>=0.0.0-0')
];
const minimumVersion = [
    new Comparator('>=0.0.0')
];
const simpleSubset = (sub, dom, options)=>{
    if (sub === dom) {
        return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
        } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
        } else {
            sub = minimumVersion;
        }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
            return true;
        } else {
            dom = minimumVersion;
        }
    }
    const eqSet = new Set();
    let gt, lt;
    for (const c of sub){
        if (c.operator === '>' || c.operator === '>=') {
            gt = higherGT(gt, c, options);
        } else if (c.operator === '<' || c.operator === '<=') {
            lt = lowerLT(lt, c, options);
        } else {
            eqSet.add(c.semver);
        }
    }
    if (eqSet.size > 1) {
        return null;
    }
    let gtltComp;
    if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
            return null;
        } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
            return null;
        }
    }
    // will iterate one or zero times
    for (const eq of eqSet){
        if (gt && !satisfies(eq, String(gt), options)) {
            return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
            return null;
        }
        for (const c of dom){
            if (!satisfies(eq, String(c), options)) {
                return false;
            }
        }
        return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
    }
    for (const c of dom){
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
            if (needDomGTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                    needDomGTPre = false;
                }
            }
            if (c.operator === '>' || c.operator === '>=') {
                higher = higherGT(gt, c, options);
                if (higher === c && higher !== gt) {
                    return false;
                }
            } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
                return false;
            }
        }
        if (lt) {
            if (needDomLTPre) {
                if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                    needDomLTPre = false;
                }
            }
            if (c.operator === '<' || c.operator === '<=') {
                lower = lowerLT(lt, c, options);
                if (lower === c && lower !== lt) {
                    return false;
                }
            } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
                return false;
            }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
        }
    }
    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
    }
    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
        return false;
    }
    return true;
};
// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
};
// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options)=>{
    if (!a) {
        return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
};
module.exports = subset;
}),
"[project]/projects/tartanhacks/node_modules/semver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// just pre-load all the stuff that index.js lazily exports
const internalRe = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/re.js [app-route] (ecmascript)");
const constants = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/constants.js [app-route] (ecmascript)");
const SemVer = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/semver.js [app-route] (ecmascript)");
const identifiers = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/internal/identifiers.js [app-route] (ecmascript)");
const parse = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/parse.js [app-route] (ecmascript)");
const valid = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/valid.js [app-route] (ecmascript)");
const clean = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/clean.js [app-route] (ecmascript)");
const inc = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/inc.js [app-route] (ecmascript)");
const diff = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/diff.js [app-route] (ecmascript)");
const major = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/major.js [app-route] (ecmascript)");
const minor = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/minor.js [app-route] (ecmascript)");
const patch = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/patch.js [app-route] (ecmascript)");
const prerelease = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/prerelease.js [app-route] (ecmascript)");
const compare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare.js [app-route] (ecmascript)");
const rcompare = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/rcompare.js [app-route] (ecmascript)");
const compareLoose = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare-loose.js [app-route] (ecmascript)");
const compareBuild = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/compare-build.js [app-route] (ecmascript)");
const sort = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/sort.js [app-route] (ecmascript)");
const rsort = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/rsort.js [app-route] (ecmascript)");
const gt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gt.js [app-route] (ecmascript)");
const lt = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lt.js [app-route] (ecmascript)");
const eq = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/eq.js [app-route] (ecmascript)");
const neq = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/neq.js [app-route] (ecmascript)");
const gte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/gte.js [app-route] (ecmascript)");
const lte = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/lte.js [app-route] (ecmascript)");
const cmp = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/cmp.js [app-route] (ecmascript)");
const coerce = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/coerce.js [app-route] (ecmascript)");
const Comparator = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/comparator.js [app-route] (ecmascript)");
const Range = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/classes/range.js [app-route] (ecmascript)");
const satisfies = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/functions/satisfies.js [app-route] (ecmascript)");
const toComparators = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/to-comparators.js [app-route] (ecmascript)");
const maxSatisfying = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/max-satisfying.js [app-route] (ecmascript)");
const minSatisfying = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/min-satisfying.js [app-route] (ecmascript)");
const minVersion = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/min-version.js [app-route] (ecmascript)");
const validRange = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/valid.js [app-route] (ecmascript)");
const outside = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/outside.js [app-route] (ecmascript)");
const gtr = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/gtr.js [app-route] (ecmascript)");
const ltr = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/ltr.js [app-route] (ecmascript)");
const intersects = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/intersects.js [app-route] (ecmascript)");
const simplifyRange = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/simplify.js [app-route] (ecmascript)");
const subset = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/semver/ranges/subset.js [app-route] (ecmascript)");
module.exports = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers
};
}),
"[project]/projects/tartanhacks/node_modules/ansi-styles/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const ANSI_BACKGROUND_OFFSET = 10;
const wrapAnsi256 = (offset = 0)=>(code)=>`\u001B[${38 + offset};5;${code}m`;
const wrapAnsi16m = (offset = 0)=>(red, green, blue)=>`\u001B[${38 + offset};2;${red};${green};${blue}m`;
function assembleStyles() {
    const codes = new Map();
    const styles = {
        modifier: {
            reset: [
                0,
                0
            ],
            // 21 isn't widely supported and 22 does the same thing
            bold: [
                1,
                22
            ],
            dim: [
                2,
                22
            ],
            italic: [
                3,
                23
            ],
            underline: [
                4,
                24
            ],
            overline: [
                53,
                55
            ],
            inverse: [
                7,
                27
            ],
            hidden: [
                8,
                28
            ],
            strikethrough: [
                9,
                29
            ]
        },
        color: {
            black: [
                30,
                39
            ],
            red: [
                31,
                39
            ],
            green: [
                32,
                39
            ],
            yellow: [
                33,
                39
            ],
            blue: [
                34,
                39
            ],
            magenta: [
                35,
                39
            ],
            cyan: [
                36,
                39
            ],
            white: [
                37,
                39
            ],
            // Bright color
            blackBright: [
                90,
                39
            ],
            redBright: [
                91,
                39
            ],
            greenBright: [
                92,
                39
            ],
            yellowBright: [
                93,
                39
            ],
            blueBright: [
                94,
                39
            ],
            magentaBright: [
                95,
                39
            ],
            cyanBright: [
                96,
                39
            ],
            whiteBright: [
                97,
                39
            ]
        },
        bgColor: {
            bgBlack: [
                40,
                49
            ],
            bgRed: [
                41,
                49
            ],
            bgGreen: [
                42,
                49
            ],
            bgYellow: [
                43,
                49
            ],
            bgBlue: [
                44,
                49
            ],
            bgMagenta: [
                45,
                49
            ],
            bgCyan: [
                46,
                49
            ],
            bgWhite: [
                47,
                49
            ],
            // Bright color
            bgBlackBright: [
                100,
                49
            ],
            bgRedBright: [
                101,
                49
            ],
            bgGreenBright: [
                102,
                49
            ],
            bgYellowBright: [
                103,
                49
            ],
            bgBlueBright: [
                104,
                49
            ],
            bgMagentaBright: [
                105,
                49
            ],
            bgCyanBright: [
                106,
                49
            ],
            bgWhiteBright: [
                107,
                49
            ]
        }
    };
    // Alias bright black as gray (and grey)
    styles.color.gray = styles.color.blackBright;
    styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
    styles.color.grey = styles.color.blackBright;
    styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles)){
        for (const [styleName, style] of Object.entries(group)){
            styles[styleName] = {
                open: `\u001B[${style[0]}m`,
                close: `\u001B[${style[1]}m`
            };
            group[styleName] = styles[styleName];
            codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
            value: group,
            enumerable: false
        });
    }
    Object.defineProperty(styles, 'codes', {
        value: codes,
        enumerable: false
    });
    styles.color.close = '\u001B[39m';
    styles.bgColor.close = '\u001B[49m';
    styles.color.ansi256 = wrapAnsi256();
    styles.color.ansi16m = wrapAnsi16m();
    styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    // From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
    Object.defineProperties(styles, {
        rgbToAnsi256: {
            value: (red, green, blue)=>{
                // We use the extended greyscale palette here, with the exception of
                // black and white. normal palette only has 4 greyscale shades.
                if (red === green && green === blue) {
                    if (red < 8) {
                        return 16;
                    }
                    if (red > 248) {
                        return 231;
                    }
                    return Math.round((red - 8) / 247 * 24) + 232;
                }
                return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
            },
            enumerable: false
        },
        hexToRgb: {
            value: (hex)=>{
                const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
                if (!matches) {
                    return [
                        0,
                        0,
                        0
                    ];
                }
                let { colorString } = matches.groups;
                if (colorString.length === 3) {
                    colorString = colorString.split('').map((character)=>character + character).join('');
                }
                const integer = Number.parseInt(colorString, 16);
                return [
                    integer >> 16 & 0xFF,
                    integer >> 8 & 0xFF,
                    integer & 0xFF
                ];
            },
            enumerable: false
        },
        hexToAnsi256: {
            value: (hex)=>styles.rgbToAnsi256(...styles.hexToRgb(hex)),
            enumerable: false
        }
    });
    return styles;
}
// Make the export immutable
Object.defineProperty(module, 'exports', {
    enumerable: true,
    get: assembleStyles
});
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/deep-compare-strict.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepCompareStrict = deepCompareStrict;
function deepCompareStrict(a, b) {
    const typeofa = typeof a;
    if (typeofa !== typeof b) {
        return false;
    }
    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        const length = a.length;
        if (length !== b.length) {
            return false;
        }
        for(let i = 0; i < length; i++){
            if (!deepCompareStrict(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (typeofa === 'object') {
        if (!a || !b) {
            return a === b;
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        const length = aKeys.length;
        if (length !== bKeys.length) {
            return false;
        }
        for (const k of aKeys){
            if (!deepCompareStrict(a[k], b[k])) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/pointer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encodePointer = encodePointer;
exports.escapePointer = escapePointer;
function encodePointer(p) {
    return encodeURI(escapePointer(p));
}
function escapePointer(p) {
    return p.replace(/~/g, '~0').replace(/\//g, '~1');
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/dereference.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initialBaseURI = exports.ignoredKeyword = exports.schemaMapKeyword = exports.schemaArrayKeyword = exports.schemaKeyword = void 0;
exports.dereference = dereference;
const pointer_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/pointer.js [app-route] (ecmascript)");
exports.schemaKeyword = {
    additionalItems: true,
    unevaluatedItems: true,
    items: true,
    contains: true,
    additionalProperties: true,
    unevaluatedProperties: true,
    propertyNames: true,
    not: true,
    if: true,
    then: true,
    else: true
};
exports.schemaArrayKeyword = {
    prefixItems: true,
    items: true,
    allOf: true,
    anyOf: true,
    oneOf: true
};
exports.schemaMapKeyword = {
    $defs: true,
    definitions: true,
    properties: true,
    patternProperties: true,
    dependentSchemas: true
};
exports.ignoredKeyword = {
    id: true,
    $id: true,
    $ref: true,
    $schema: true,
    $anchor: true,
    $vocabulary: true,
    $comment: true,
    default: true,
    enum: true,
    const: true,
    required: true,
    type: true,
    maximum: true,
    minimum: true,
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    multipleOf: true,
    maxLength: true,
    minLength: true,
    pattern: true,
    format: true,
    maxItems: true,
    minItems: true,
    uniqueItems: true,
    maxProperties: true,
    minProperties: true
};
exports.initialBaseURI = typeof self !== 'undefined' && self.location && self.location.origin !== 'null' ? new URL(self.location.origin + self.location.pathname + location.search) : new URL('https://github.com/cfworker');
function dereference(schema, lookup = Object.create(null), baseURI = exports.initialBaseURI, basePointer = '') {
    if (schema && typeof schema === 'object' && !Array.isArray(schema)) {
        const id = schema.$id || schema.id;
        if (id) {
            const url = new URL(id, baseURI.href);
            if (url.hash.length > 1) {
                lookup[url.href] = schema;
            } else {
                url.hash = '';
                if (basePointer === '') {
                    baseURI = url;
                } else {
                    dereference(schema, lookup, baseURI);
                }
            }
        }
    } else if (schema !== true && schema !== false) {
        return lookup;
    }
    const schemaURI = baseURI.href + (basePointer ? '#' + basePointer : '');
    if (lookup[schemaURI] !== undefined) {
        throw new Error(`Duplicate schema URI "${schemaURI}".`);
    }
    lookup[schemaURI] = schema;
    if (schema === true || schema === false) {
        return lookup;
    }
    if (schema.__absolute_uri__ === undefined) {
        Object.defineProperty(schema, '__absolute_uri__', {
            enumerable: false,
            value: schemaURI
        });
    }
    if (schema.$ref && schema.__absolute_ref__ === undefined) {
        const url = new URL(schema.$ref, baseURI.href);
        url.hash = url.hash;
        Object.defineProperty(schema, '__absolute_ref__', {
            enumerable: false,
            value: url.href
        });
    }
    if (schema.$recursiveRef && schema.__absolute_recursive_ref__ === undefined) {
        const url = new URL(schema.$recursiveRef, baseURI.href);
        url.hash = url.hash;
        Object.defineProperty(schema, '__absolute_recursive_ref__', {
            enumerable: false,
            value: url.href
        });
    }
    if (schema.$anchor) {
        const url = new URL('#' + schema.$anchor, baseURI.href);
        lookup[url.href] = schema;
    }
    for(let key in schema){
        if (exports.ignoredKeyword[key]) {
            continue;
        }
        const keyBase = `${basePointer}/${(0, pointer_js_1.encodePointer)(key)}`;
        const subSchema = schema[key];
        if (Array.isArray(subSchema)) {
            if (exports.schemaArrayKeyword[key]) {
                const length = subSchema.length;
                for(let i = 0; i < length; i++){
                    dereference(subSchema[i], lookup, baseURI, `${keyBase}/${i}`);
                }
            }
        } else if (exports.schemaMapKeyword[key]) {
            for(let subKey in subSchema){
                dereference(subSchema[subKey], lookup, baseURI, `${keyBase}/${(0, pointer_js_1.encodePointer)(subKey)}`);
            }
        } else {
            dereference(subSchema, lookup, baseURI, keyBase);
        }
    }
    return lookup;
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/format.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.format = void 0;
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
const DAYS = [
    0,
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
];
const TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
const HOSTNAME = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
const URIREF = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
const URL_ = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
const UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
const JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
const RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
const EMAIL = (input)=>{
    if (input[0] === '"') return false;
    const [name, host, ...rest] = input.split('@');
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false;
    if (name[0] === '.' || name.endsWith('.') || name.includes('..')) return false;
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(name)) return false;
    return host.split('.').every((part)=>/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part));
};
const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const IPV6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;
const DURATION = (input)=>input.length > 1 && input.length < 80 && (/^P\d+([.,]\d+)?W$/.test(input) || /^P[\dYMDTHS]*(\d[.,]\d+)?[YMDHS]$/.test(input) && /^P([.,\d]+Y)?([.,\d]+M)?([.,\d]+D)?(T([.,\d]+H)?([.,\d]+M)?([.,\d]+S)?)?$/.test(input));
function bind(r) {
    return r.test.bind(r);
}
exports.format = {
    date,
    time: time.bind(undefined, false),
    'date-time': date_time,
    duration: DURATION,
    uri,
    'uri-reference': bind(URIREF),
    'uri-template': bind(URITEMPLATE),
    url: bind(URL_),
    email: EMAIL,
    hostname: bind(HOSTNAME),
    ipv4: bind(IPV4),
    ipv6: bind(IPV6),
    regex: regex,
    uuid: bind(UUID),
    'json-pointer': bind(JSON_POINTER),
    'json-pointer-uri-fragment': bind(JSON_POINTER_URI_FRAGMENT),
    'relative-json-pointer': bind(RELATIVE_JSON_POINTER)
};
function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function date(str) {
    const matches = str.match(DATE);
    if (!matches) return false;
    const year = +matches[1];
    const month = +matches[2];
    const day = +matches[3];
    return month >= 1 && month <= 12 && day >= 1 && day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
}
function time(full, str) {
    const matches = str.match(TIME);
    if (!matches) return false;
    const hour = +matches[1];
    const minute = +matches[2];
    const second = +matches[3];
    const timeZone = !!matches[5];
    return (hour <= 23 && minute <= 59 && second <= 59 || hour == 23 && minute == 59 && second == 60) && (!full || timeZone);
}
const DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
    const dateTime = str.split(DATE_TIME_SEPARATOR);
    return dateTime.length == 2 && date(dateTime[0]) && time(true, dateTime[1]);
}
const NOT_URI_FRAGMENT = /\/|:/;
const URI_PATTERN = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
function uri(str) {
    return NOT_URI_FRAGMENT.test(str) && URI_PATTERN.test(str);
}
const Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
    if (Z_ANCHOR.test(str)) return false;
    try {
        new RegExp(str, 'u');
        return true;
    } catch (e) {
        return false;
    }
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OutputFormat = void 0;
var OutputFormat;
(function(OutputFormat) {
    OutputFormat[OutputFormat["Flag"] = 1] = "Flag";
    OutputFormat[OutputFormat["Basic"] = 2] = "Basic";
    OutputFormat[OutputFormat["Detailed"] = 4] = "Detailed";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/ucs2-length.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ucs2length = ucs2length;
function ucs2length(s) {
    let result = 0;
    let length = s.length;
    let index = 0;
    let charCode;
    while(index < length){
        result++;
        charCode = s.charCodeAt(index++);
        if (charCode >= 0xd800 && charCode <= 0xdbff && index < length) {
            charCode = s.charCodeAt(index);
            if ((charCode & 0xfc00) == 0xdc00) {
                index++;
            }
        }
    }
    return result;
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/validate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = validate;
const deep_compare_strict_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/deep-compare-strict.js [app-route] (ecmascript)");
const dereference_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/dereference.js [app-route] (ecmascript)");
const format_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/format.js [app-route] (ecmascript)");
const pointer_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/pointer.js [app-route] (ecmascript)");
const ucs2_length_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/ucs2-length.js [app-route] (ecmascript)");
function validate(instance, schema, draft = '2019-09', lookup = (0, dereference_js_1.dereference)(schema), shortCircuit = true, recursiveAnchor = null, instanceLocation = '#', schemaLocation = '#', evaluated = Object.create(null)) {
    if (schema === true) {
        return {
            valid: true,
            errors: []
        };
    }
    if (schema === false) {
        return {
            valid: false,
            errors: [
                {
                    instanceLocation,
                    keyword: 'false',
                    keywordLocation: instanceLocation,
                    error: 'False boolean schema.'
                }
            ]
        };
    }
    const rawInstanceType = typeof instance;
    let instanceType;
    switch(rawInstanceType){
        case 'boolean':
        case 'number':
        case 'string':
            instanceType = rawInstanceType;
            break;
        case 'object':
            if (instance === null) {
                instanceType = 'null';
            } else if (Array.isArray(instance)) {
                instanceType = 'array';
            } else {
                instanceType = 'object';
            }
            break;
        default:
            throw new Error(`Instances of "${rawInstanceType}" type are not supported.`);
    }
    const { $ref, $recursiveRef, $recursiveAnchor, type: $type, const: $const, enum: $enum, required: $required, not: $not, anyOf: $anyOf, allOf: $allOf, oneOf: $oneOf, if: $if, then: $then, else: $else, format: $format, properties: $properties, patternProperties: $patternProperties, additionalProperties: $additionalProperties, unevaluatedProperties: $unevaluatedProperties, minProperties: $minProperties, maxProperties: $maxProperties, propertyNames: $propertyNames, dependentRequired: $dependentRequired, dependentSchemas: $dependentSchemas, dependencies: $dependencies, prefixItems: $prefixItems, items: $items, additionalItems: $additionalItems, unevaluatedItems: $unevaluatedItems, contains: $contains, minContains: $minContains, maxContains: $maxContains, minItems: $minItems, maxItems: $maxItems, uniqueItems: $uniqueItems, minimum: $minimum, maximum: $maximum, exclusiveMinimum: $exclusiveMinimum, exclusiveMaximum: $exclusiveMaximum, multipleOf: $multipleOf, minLength: $minLength, maxLength: $maxLength, pattern: $pattern, __absolute_ref__, __absolute_recursive_ref__ } = schema;
    const errors = [];
    if ($recursiveAnchor === true && recursiveAnchor === null) {
        recursiveAnchor = schema;
    }
    if ($recursiveRef === '#') {
        const refSchema = recursiveAnchor === null ? lookup[__absolute_recursive_ref__] : recursiveAnchor;
        const keywordLocation = `${schemaLocation}/$recursiveRef`;
        const result = validate(instance, recursiveAnchor === null ? schema : recursiveAnchor, draft, lookup, shortCircuit, refSchema, instanceLocation, keywordLocation, evaluated);
        if (!result.valid) {
            errors.push({
                instanceLocation,
                keyword: '$recursiveRef',
                keywordLocation,
                error: 'A subschema had errors.'
            }, ...result.errors);
        }
    }
    if ($ref !== undefined) {
        const uri = __absolute_ref__ || $ref;
        const refSchema = lookup[uri];
        if (refSchema === undefined) {
            let message = `Unresolved $ref "${$ref}".`;
            if (__absolute_ref__ && __absolute_ref__ !== $ref) {
                message += `  Absolute URI "${__absolute_ref__}".`;
            }
            message += `\nKnown schemas:\n- ${Object.keys(lookup).join('\n- ')}`;
            throw new Error(message);
        }
        const keywordLocation = `${schemaLocation}/$ref`;
        const result = validate(instance, refSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated);
        if (!result.valid) {
            errors.push({
                instanceLocation,
                keyword: '$ref',
                keywordLocation,
                error: 'A subschema had errors.'
            }, ...result.errors);
        }
        if (draft === '4' || draft === '7') {
            return {
                valid: errors.length === 0,
                errors
            };
        }
    }
    if (Array.isArray($type)) {
        let length = $type.length;
        let valid = false;
        for(let i = 0; i < length; i++){
            if (instanceType === $type[i] || $type[i] === 'integer' && instanceType === 'number' && instance % 1 === 0 && instance === instance) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            errors.push({
                instanceLocation,
                keyword: 'type',
                keywordLocation: `${schemaLocation}/type`,
                error: `Instance type "${instanceType}" is invalid. Expected "${$type.join('", "')}".`
            });
        }
    } else if ($type === 'integer') {
        if (instanceType !== 'number' || instance % 1 || instance !== instance) {
            errors.push({
                instanceLocation,
                keyword: 'type',
                keywordLocation: `${schemaLocation}/type`,
                error: `Instance type "${instanceType}" is invalid. Expected "${$type}".`
            });
        }
    } else if ($type !== undefined && instanceType !== $type) {
        errors.push({
            instanceLocation,
            keyword: 'type',
            keywordLocation: `${schemaLocation}/type`,
            error: `Instance type "${instanceType}" is invalid. Expected "${$type}".`
        });
    }
    if ($const !== undefined) {
        if (instanceType === 'object' || instanceType === 'array') {
            if (!(0, deep_compare_strict_js_1.deepCompareStrict)(instance, $const)) {
                errors.push({
                    instanceLocation,
                    keyword: 'const',
                    keywordLocation: `${schemaLocation}/const`,
                    error: `Instance does not match ${JSON.stringify($const)}.`
                });
            }
        } else if (instance !== $const) {
            errors.push({
                instanceLocation,
                keyword: 'const',
                keywordLocation: `${schemaLocation}/const`,
                error: `Instance does not match ${JSON.stringify($const)}.`
            });
        }
    }
    if ($enum !== undefined) {
        if (instanceType === 'object' || instanceType === 'array') {
            if (!$enum.some((value)=>(0, deep_compare_strict_js_1.deepCompareStrict)(instance, value))) {
                errors.push({
                    instanceLocation,
                    keyword: 'enum',
                    keywordLocation: `${schemaLocation}/enum`,
                    error: `Instance does not match any of ${JSON.stringify($enum)}.`
                });
            }
        } else if (!$enum.some((value)=>instance === value)) {
            errors.push({
                instanceLocation,
                keyword: 'enum',
                keywordLocation: `${schemaLocation}/enum`,
                error: `Instance does not match any of ${JSON.stringify($enum)}.`
            });
        }
    }
    if ($not !== undefined) {
        const keywordLocation = `${schemaLocation}/not`;
        const result = validate(instance, $not, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation);
        if (result.valid) {
            errors.push({
                instanceLocation,
                keyword: 'not',
                keywordLocation,
                error: 'Instance matched "not" schema.'
            });
        }
    }
    let subEvaluateds = [];
    if ($anyOf !== undefined) {
        const keywordLocation = `${schemaLocation}/anyOf`;
        const errorsLength = errors.length;
        let anyValid = false;
        for(let i = 0; i < $anyOf.length; i++){
            const subSchema = $anyOf[i];
            const subEvaluated = Object.create(evaluated);
            const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
            errors.push(...result.errors);
            anyValid = anyValid || result.valid;
            if (result.valid) {
                subEvaluateds.push(subEvaluated);
            }
        }
        if (anyValid) {
            errors.length = errorsLength;
        } else {
            errors.splice(errorsLength, 0, {
                instanceLocation,
                keyword: 'anyOf',
                keywordLocation,
                error: 'Instance does not match any subschemas.'
            });
        }
    }
    if ($allOf !== undefined) {
        const keywordLocation = `${schemaLocation}/allOf`;
        const errorsLength = errors.length;
        let allValid = true;
        for(let i = 0; i < $allOf.length; i++){
            const subSchema = $allOf[i];
            const subEvaluated = Object.create(evaluated);
            const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
            errors.push(...result.errors);
            allValid = allValid && result.valid;
            if (result.valid) {
                subEvaluateds.push(subEvaluated);
            }
        }
        if (allValid) {
            errors.length = errorsLength;
        } else {
            errors.splice(errorsLength, 0, {
                instanceLocation,
                keyword: 'allOf',
                keywordLocation,
                error: `Instance does not match every subschema.`
            });
        }
    }
    if ($oneOf !== undefined) {
        const keywordLocation = `${schemaLocation}/oneOf`;
        const errorsLength = errors.length;
        const matches = $oneOf.filter((subSchema, i)=>{
            const subEvaluated = Object.create(evaluated);
            const result = validate(instance, subSchema, draft, lookup, shortCircuit, $recursiveAnchor === true ? recursiveAnchor : null, instanceLocation, `${keywordLocation}/${i}`, subEvaluated);
            errors.push(...result.errors);
            if (result.valid) {
                subEvaluateds.push(subEvaluated);
            }
            return result.valid;
        }).length;
        if (matches === 1) {
            errors.length = errorsLength;
        } else {
            errors.splice(errorsLength, 0, {
                instanceLocation,
                keyword: 'oneOf',
                keywordLocation,
                error: `Instance does not match exactly one subschema (${matches} matches).`
            });
        }
    }
    if (instanceType === 'object' || instanceType === 'array') {
        Object.assign(evaluated, ...subEvaluateds);
    }
    if ($if !== undefined) {
        const keywordLocation = `${schemaLocation}/if`;
        const conditionResult = validate(instance, $if, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated).valid;
        if (conditionResult) {
            if ($then !== undefined) {
                const thenResult = validate(instance, $then, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${schemaLocation}/then`, evaluated);
                if (!thenResult.valid) {
                    errors.push({
                        instanceLocation,
                        keyword: 'if',
                        keywordLocation,
                        error: `Instance does not match "then" schema.`
                    }, ...thenResult.errors);
                }
            }
        } else if ($else !== undefined) {
            const elseResult = validate(instance, $else, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${schemaLocation}/else`, evaluated);
            if (!elseResult.valid) {
                errors.push({
                    instanceLocation,
                    keyword: 'if',
                    keywordLocation,
                    error: `Instance does not match "else" schema.`
                }, ...elseResult.errors);
            }
        }
    }
    if (instanceType === 'object') {
        if ($required !== undefined) {
            for (const key of $required){
                if (!(key in instance)) {
                    errors.push({
                        instanceLocation,
                        keyword: 'required',
                        keywordLocation: `${schemaLocation}/required`,
                        error: `Instance does not have required property "${key}".`
                    });
                }
            }
        }
        const keys = Object.keys(instance);
        if ($minProperties !== undefined && keys.length < $minProperties) {
            errors.push({
                instanceLocation,
                keyword: 'minProperties',
                keywordLocation: `${schemaLocation}/minProperties`,
                error: `Instance does not have at least ${$minProperties} properties.`
            });
        }
        if ($maxProperties !== undefined && keys.length > $maxProperties) {
            errors.push({
                instanceLocation,
                keyword: 'maxProperties',
                keywordLocation: `${schemaLocation}/maxProperties`,
                error: `Instance does not have at least ${$maxProperties} properties.`
            });
        }
        if ($propertyNames !== undefined) {
            const keywordLocation = `${schemaLocation}/propertyNames`;
            for(const key in instance){
                const subInstancePointer = `${instanceLocation}/${(0, pointer_js_1.encodePointer)(key)}`;
                const result = validate(key, $propertyNames, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                if (!result.valid) {
                    errors.push({
                        instanceLocation,
                        keyword: 'propertyNames',
                        keywordLocation,
                        error: `Property name "${key}" does not match schema.`
                    }, ...result.errors);
                }
            }
        }
        if ($dependentRequired !== undefined) {
            const keywordLocation = `${schemaLocation}/dependantRequired`;
            for(const key in $dependentRequired){
                if (key in instance) {
                    const required = $dependentRequired[key];
                    for (const dependantKey of required){
                        if (!(dependantKey in instance)) {
                            errors.push({
                                instanceLocation,
                                keyword: 'dependentRequired',
                                keywordLocation,
                                error: `Instance has "${key}" but does not have "${dependantKey}".`
                            });
                        }
                    }
                }
            }
        }
        if ($dependentSchemas !== undefined) {
            for(const key in $dependentSchemas){
                const keywordLocation = `${schemaLocation}/dependentSchemas`;
                if (key in instance) {
                    const result = validate(instance, $dependentSchemas[key], draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${keywordLocation}/${(0, pointer_js_1.encodePointer)(key)}`, evaluated);
                    if (!result.valid) {
                        errors.push({
                            instanceLocation,
                            keyword: 'dependentSchemas',
                            keywordLocation,
                            error: `Instance has "${key}" but does not match dependant schema.`
                        }, ...result.errors);
                    }
                }
            }
        }
        if ($dependencies !== undefined) {
            const keywordLocation = `${schemaLocation}/dependencies`;
            for(const key in $dependencies){
                if (key in instance) {
                    const propsOrSchema = $dependencies[key];
                    if (Array.isArray(propsOrSchema)) {
                        for (const dependantKey of propsOrSchema){
                            if (!(dependantKey in instance)) {
                                errors.push({
                                    instanceLocation,
                                    keyword: 'dependencies',
                                    keywordLocation,
                                    error: `Instance has "${key}" but does not have "${dependantKey}".`
                                });
                            }
                        }
                    } else {
                        const result = validate(instance, propsOrSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, `${keywordLocation}/${(0, pointer_js_1.encodePointer)(key)}`);
                        if (!result.valid) {
                            errors.push({
                                instanceLocation,
                                keyword: 'dependencies',
                                keywordLocation,
                                error: `Instance has "${key}" but does not match dependant schema.`
                            }, ...result.errors);
                        }
                    }
                }
            }
        }
        const thisEvaluated = Object.create(null);
        let stop = false;
        if ($properties !== undefined) {
            const keywordLocation = `${schemaLocation}/properties`;
            for(const key in $properties){
                if (!(key in instance)) {
                    continue;
                }
                const subInstancePointer = `${instanceLocation}/${(0, pointer_js_1.encodePointer)(key)}`;
                const result = validate(instance[key], $properties[key], draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, `${keywordLocation}/${(0, pointer_js_1.encodePointer)(key)}`);
                if (result.valid) {
                    evaluated[key] = thisEvaluated[key] = true;
                } else {
                    stop = shortCircuit;
                    errors.push({
                        instanceLocation,
                        keyword: 'properties',
                        keywordLocation,
                        error: `Property "${key}" does not match schema.`
                    }, ...result.errors);
                    if (stop) break;
                }
            }
        }
        if (!stop && $patternProperties !== undefined) {
            const keywordLocation = `${schemaLocation}/patternProperties`;
            for(const pattern in $patternProperties){
                const regex = new RegExp(pattern, 'u');
                const subSchema = $patternProperties[pattern];
                for(const key in instance){
                    if (!regex.test(key)) {
                        continue;
                    }
                    const subInstancePointer = `${instanceLocation}/${(0, pointer_js_1.encodePointer)(key)}`;
                    const result = validate(instance[key], subSchema, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, `${keywordLocation}/${(0, pointer_js_1.encodePointer)(pattern)}`);
                    if (result.valid) {
                        evaluated[key] = thisEvaluated[key] = true;
                    } else {
                        stop = shortCircuit;
                        errors.push({
                            instanceLocation,
                            keyword: 'patternProperties',
                            keywordLocation,
                            error: `Property "${key}" matches pattern "${pattern}" but does not match associated schema.`
                        }, ...result.errors);
                    }
                }
            }
        }
        if (!stop && $additionalProperties !== undefined) {
            const keywordLocation = `${schemaLocation}/additionalProperties`;
            for(const key in instance){
                if (thisEvaluated[key]) {
                    continue;
                }
                const subInstancePointer = `${instanceLocation}/${(0, pointer_js_1.encodePointer)(key)}`;
                const result = validate(instance[key], $additionalProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                if (result.valid) {
                    evaluated[key] = true;
                } else {
                    stop = shortCircuit;
                    errors.push({
                        instanceLocation,
                        keyword: 'additionalProperties',
                        keywordLocation,
                        error: `Property "${key}" does not match additional properties schema.`
                    }, ...result.errors);
                }
            }
        } else if (!stop && $unevaluatedProperties !== undefined) {
            const keywordLocation = `${schemaLocation}/unevaluatedProperties`;
            for(const key in instance){
                if (!evaluated[key]) {
                    const subInstancePointer = `${instanceLocation}/${(0, pointer_js_1.encodePointer)(key)}`;
                    const result = validate(instance[key], $unevaluatedProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                    if (result.valid) {
                        evaluated[key] = true;
                    } else {
                        errors.push({
                            instanceLocation,
                            keyword: 'unevaluatedProperties',
                            keywordLocation,
                            error: `Property "${key}" does not match unevaluated properties schema.`
                        }, ...result.errors);
                    }
                }
            }
        }
    } else if (instanceType === 'array') {
        if ($maxItems !== undefined && instance.length > $maxItems) {
            errors.push({
                instanceLocation,
                keyword: 'maxItems',
                keywordLocation: `${schemaLocation}/maxItems`,
                error: `Array has too many items (${instance.length} > ${$maxItems}).`
            });
        }
        if ($minItems !== undefined && instance.length < $minItems) {
            errors.push({
                instanceLocation,
                keyword: 'minItems',
                keywordLocation: `${schemaLocation}/minItems`,
                error: `Array has too few items (${instance.length} < ${$minItems}).`
            });
        }
        const length = instance.length;
        let i = 0;
        let stop = false;
        if ($prefixItems !== undefined) {
            const keywordLocation = `${schemaLocation}/prefixItems`;
            const length2 = Math.min($prefixItems.length, length);
            for(; i < length2; i++){
                const result = validate(instance[i], $prefixItems[i], draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, `${keywordLocation}/${i}`);
                evaluated[i] = true;
                if (!result.valid) {
                    stop = shortCircuit;
                    errors.push({
                        instanceLocation,
                        keyword: 'prefixItems',
                        keywordLocation,
                        error: `Items did not match schema.`
                    }, ...result.errors);
                    if (stop) break;
                }
            }
        }
        if ($items !== undefined) {
            const keywordLocation = `${schemaLocation}/items`;
            if (Array.isArray($items)) {
                const length2 = Math.min($items.length, length);
                for(; i < length2; i++){
                    const result = validate(instance[i], $items[i], draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, `${keywordLocation}/${i}`);
                    evaluated[i] = true;
                    if (!result.valid) {
                        stop = shortCircuit;
                        errors.push({
                            instanceLocation,
                            keyword: 'items',
                            keywordLocation,
                            error: `Items did not match schema.`
                        }, ...result.errors);
                        if (stop) break;
                    }
                }
            } else {
                for(; i < length; i++){
                    const result = validate(instance[i], $items, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation);
                    evaluated[i] = true;
                    if (!result.valid) {
                        stop = shortCircuit;
                        errors.push({
                            instanceLocation,
                            keyword: 'items',
                            keywordLocation,
                            error: `Items did not match schema.`
                        }, ...result.errors);
                        if (stop) break;
                    }
                }
            }
            if (!stop && $additionalItems !== undefined) {
                const keywordLocation = `${schemaLocation}/additionalItems`;
                for(; i < length; i++){
                    const result = validate(instance[i], $additionalItems, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation);
                    evaluated[i] = true;
                    if (!result.valid) {
                        stop = shortCircuit;
                        errors.push({
                            instanceLocation,
                            keyword: 'additionalItems',
                            keywordLocation,
                            error: `Items did not match additional items schema.`
                        }, ...result.errors);
                    }
                }
            }
        }
        if ($contains !== undefined) {
            if (length === 0 && $minContains === undefined) {
                errors.push({
                    instanceLocation,
                    keyword: 'contains',
                    keywordLocation: `${schemaLocation}/contains`,
                    error: `Array is empty. It must contain at least one item matching the schema.`
                });
            } else if ($minContains !== undefined && length < $minContains) {
                errors.push({
                    instanceLocation,
                    keyword: 'minContains',
                    keywordLocation: `${schemaLocation}/minContains`,
                    error: `Array has less items (${length}) than minContains (${$minContains}).`
                });
            } else {
                const keywordLocation = `${schemaLocation}/contains`;
                const errorsLength = errors.length;
                let contained = 0;
                for(let j = 0; j < length; j++){
                    const result = validate(instance[j], $contains, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${j}`, keywordLocation);
                    if (result.valid) {
                        evaluated[j] = true;
                        contained++;
                    } else {
                        errors.push(...result.errors);
                    }
                }
                if (contained >= ($minContains || 0)) {
                    errors.length = errorsLength;
                }
                if ($minContains === undefined && $maxContains === undefined && contained === 0) {
                    errors.splice(errorsLength, 0, {
                        instanceLocation,
                        keyword: 'contains',
                        keywordLocation,
                        error: `Array does not contain item matching schema.`
                    });
                } else if ($minContains !== undefined && contained < $minContains) {
                    errors.push({
                        instanceLocation,
                        keyword: 'minContains',
                        keywordLocation: `${schemaLocation}/minContains`,
                        error: `Array must contain at least ${$minContains} items matching schema. Only ${contained} items were found.`
                    });
                } else if ($maxContains !== undefined && contained > $maxContains) {
                    errors.push({
                        instanceLocation,
                        keyword: 'maxContains',
                        keywordLocation: `${schemaLocation}/maxContains`,
                        error: `Array may contain at most ${$maxContains} items matching schema. ${contained} items were found.`
                    });
                }
            }
        }
        if (!stop && $unevaluatedItems !== undefined) {
            const keywordLocation = `${schemaLocation}/unevaluatedItems`;
            for(i; i < length; i++){
                if (evaluated[i]) {
                    continue;
                }
                const result = validate(instance[i], $unevaluatedItems, draft, lookup, shortCircuit, recursiveAnchor, `${instanceLocation}/${i}`, keywordLocation);
                evaluated[i] = true;
                if (!result.valid) {
                    errors.push({
                        instanceLocation,
                        keyword: 'unevaluatedItems',
                        keywordLocation,
                        error: `Items did not match unevaluated items schema.`
                    }, ...result.errors);
                }
            }
        }
        if ($uniqueItems) {
            for(let j = 0; j < length; j++){
                const a = instance[j];
                const ao = typeof a === 'object' && a !== null;
                for(let k = 0; k < length; k++){
                    if (j === k) {
                        continue;
                    }
                    const b = instance[k];
                    const bo = typeof b === 'object' && b !== null;
                    if (a === b || ao && bo && (0, deep_compare_strict_js_1.deepCompareStrict)(a, b)) {
                        errors.push({
                            instanceLocation,
                            keyword: 'uniqueItems',
                            keywordLocation: `${schemaLocation}/uniqueItems`,
                            error: `Duplicate items at indexes ${j} and ${k}.`
                        });
                        j = Number.MAX_SAFE_INTEGER;
                        k = Number.MAX_SAFE_INTEGER;
                    }
                }
            }
        }
    } else if (instanceType === 'number') {
        if (draft === '4') {
            if ($minimum !== undefined && ($exclusiveMinimum === true && instance <= $minimum || instance < $minimum)) {
                errors.push({
                    instanceLocation,
                    keyword: 'minimum',
                    keywordLocation: `${schemaLocation}/minimum`,
                    error: `${instance} is less than ${$exclusiveMinimum ? 'or equal to ' : ''} ${$minimum}.`
                });
            }
            if ($maximum !== undefined && ($exclusiveMaximum === true && instance >= $maximum || instance > $maximum)) {
                errors.push({
                    instanceLocation,
                    keyword: 'maximum',
                    keywordLocation: `${schemaLocation}/maximum`,
                    error: `${instance} is greater than ${$exclusiveMaximum ? 'or equal to ' : ''} ${$maximum}.`
                });
            }
        } else {
            if ($minimum !== undefined && instance < $minimum) {
                errors.push({
                    instanceLocation,
                    keyword: 'minimum',
                    keywordLocation: `${schemaLocation}/minimum`,
                    error: `${instance} is less than ${$minimum}.`
                });
            }
            if ($maximum !== undefined && instance > $maximum) {
                errors.push({
                    instanceLocation,
                    keyword: 'maximum',
                    keywordLocation: `${schemaLocation}/maximum`,
                    error: `${instance} is greater than ${$maximum}.`
                });
            }
            if ($exclusiveMinimum !== undefined && instance <= $exclusiveMinimum) {
                errors.push({
                    instanceLocation,
                    keyword: 'exclusiveMinimum',
                    keywordLocation: `${schemaLocation}/exclusiveMinimum`,
                    error: `${instance} is less than ${$exclusiveMinimum}.`
                });
            }
            if ($exclusiveMaximum !== undefined && instance >= $exclusiveMaximum) {
                errors.push({
                    instanceLocation,
                    keyword: 'exclusiveMaximum',
                    keywordLocation: `${schemaLocation}/exclusiveMaximum`,
                    error: `${instance} is greater than or equal to ${$exclusiveMaximum}.`
                });
            }
        }
        if ($multipleOf !== undefined) {
            const remainder = instance % $multipleOf;
            if (Math.abs(0 - remainder) >= 1.1920929e-7 && Math.abs($multipleOf - remainder) >= 1.1920929e-7) {
                errors.push({
                    instanceLocation,
                    keyword: 'multipleOf',
                    keywordLocation: `${schemaLocation}/multipleOf`,
                    error: `${instance} is not a multiple of ${$multipleOf}.`
                });
            }
        }
    } else if (instanceType === 'string') {
        const length = $minLength === undefined && $maxLength === undefined ? 0 : (0, ucs2_length_js_1.ucs2length)(instance);
        if ($minLength !== undefined && length < $minLength) {
            errors.push({
                instanceLocation,
                keyword: 'minLength',
                keywordLocation: `${schemaLocation}/minLength`,
                error: `String is too short (${length} < ${$minLength}).`
            });
        }
        if ($maxLength !== undefined && length > $maxLength) {
            errors.push({
                instanceLocation,
                keyword: 'maxLength',
                keywordLocation: `${schemaLocation}/maxLength`,
                error: `String is too long (${length} > ${$maxLength}).`
            });
        }
        if ($pattern !== undefined && !new RegExp($pattern, 'u').test(instance)) {
            errors.push({
                instanceLocation,
                keyword: 'pattern',
                keywordLocation: `${schemaLocation}/pattern`,
                error: `String does not match pattern.`
            });
        }
        if ($format !== undefined && format_js_1.format[$format] && !format_js_1.format[$format](instance)) {
            errors.push({
                instanceLocation,
                keyword: 'format',
                keywordLocation: `${schemaLocation}/format`,
                error: `String does not match format "${$format}".`
            });
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/validator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Validator = void 0;
const dereference_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/dereference.js [app-route] (ecmascript)");
const validate_js_1 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/validate.js [app-route] (ecmascript)");
class Validator {
    schema;
    draft;
    shortCircuit;
    lookup;
    constructor(schema, draft = '2019-09', shortCircuit = true){
        this.schema = schema;
        this.draft = draft;
        this.shortCircuit = shortCircuit;
        this.lookup = (0, dereference_js_1.dereference)(schema);
    }
    validate(instance) {
        return (0, validate_js_1.validate)(instance, this.schema, this.draft, this.lookup, this.shortCircuit);
    }
    addSchema(schema, id) {
        if (id) {
            schema = {
                ...schema,
                $id: id
            };
        }
        (0, dereference_js_1.dereference)(schema, this.lookup);
    }
}
exports.Validator = Validator;
}),
"[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/deep-compare-strict.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/dereference.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/format.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/pointer.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/types.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/ucs2-length.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/validate.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@cfworker/json-schema/dist/commonjs/validator.js [app-route] (ecmascript)"), exports);
}),
"[project]/projects/tartanhacks/node_modules/base64-js/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength){
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }
    return parts.join('');
}
}),
"[project]/projects/tartanhacks/node_modules/js-tiktoken/dist/lite.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var base64 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/base64-js/index.js [app-route] (ecmascript)");
function _interopDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
var base64__default = /*#__PURE__*/ _interopDefault(base64);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __publicField = (obj, key, value)=>{
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
};
// src/core.ts
function bytePairMerge(piece, ranks) {
    let parts = Array.from({
        length: piece.length
    }, (_, i)=>({
            start: i,
            end: i + 1
        }));
    while(parts.length > 1){
        let minRank = null;
        for(let i = 0; i < parts.length - 1; i++){
            const slice = piece.slice(parts[i].start, parts[i + 1].end);
            const rank = ranks.get(slice.join(","));
            if (rank == null) continue;
            if (minRank == null || rank < minRank[0]) {
                minRank = [
                    rank,
                    i
                ];
            }
        }
        if (minRank != null) {
            const i = minRank[1];
            parts[i] = {
                start: parts[i].start,
                end: parts[i + 1].end
            };
            parts.splice(i + 1, 1);
        } else {
            break;
        }
    }
    return parts;
}
function bytePairEncode(piece, ranks) {
    if (piece.length === 1) return [
        ranks.get(piece.join(","))
    ];
    return bytePairMerge(piece, ranks).map((p)=>ranks.get(piece.slice(p.start, p.end).join(","))).filter((x)=>x != null);
}
function escapeRegex(str) {
    return str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}
var _Tiktoken = class {
    /** @internal */ specialTokens;
    /** @internal */ inverseSpecialTokens;
    /** @internal */ patStr;
    /** @internal */ textEncoder = new TextEncoder();
    /** @internal */ textDecoder = new TextDecoder("utf-8");
    /** @internal */ rankMap = /* @__PURE__ */ new Map();
    /** @internal */ textMap = /* @__PURE__ */ new Map();
    constructor(ranks, extendedSpecialTokens){
        this.patStr = ranks.pat_str;
        const uncompressed = ranks.bpe_ranks.split("\n").filter(Boolean).reduce((memo, x)=>{
            const [_, offsetStr, ...tokens] = x.split(" ");
            const offset = Number.parseInt(offsetStr, 10);
            tokens.forEach((token, i)=>memo[token] = offset + i);
            return memo;
        }, {});
        for (const [token, rank] of Object.entries(uncompressed)){
            const bytes = base64__default.default.toByteArray(token);
            this.rankMap.set(bytes.join(","), rank);
            this.textMap.set(rank, bytes);
        }
        this.specialTokens = {
            ...ranks.special_tokens,
            ...extendedSpecialTokens
        };
        this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce((memo, [text, rank])=>{
            memo[rank] = this.textEncoder.encode(text);
            return memo;
        }, {});
    }
    encode(text, allowedSpecial = [], disallowedSpecial = "all") {
        const regexes = new RegExp(this.patStr, "ug");
        const specialRegex = _Tiktoken.specialTokenRegex(Object.keys(this.specialTokens));
        const ret = [];
        const allowedSpecialSet = new Set(allowedSpecial === "all" ? Object.keys(this.specialTokens) : allowedSpecial);
        const disallowedSpecialSet = new Set(disallowedSpecial === "all" ? Object.keys(this.specialTokens).filter((x)=>!allowedSpecialSet.has(x)) : disallowedSpecial);
        if (disallowedSpecialSet.size > 0) {
            const disallowedSpecialRegex = _Tiktoken.specialTokenRegex([
                ...disallowedSpecialSet
            ]);
            const specialMatch = text.match(disallowedSpecialRegex);
            if (specialMatch != null) {
                throw new Error(`The text contains a special token that is not allowed: ${specialMatch[0]}`);
            }
        }
        let start = 0;
        while(true){
            let nextSpecial = null;
            let startFind = start;
            while(true){
                specialRegex.lastIndex = startFind;
                nextSpecial = specialRegex.exec(text);
                if (nextSpecial == null || allowedSpecialSet.has(nextSpecial[0])) break;
                startFind = nextSpecial.index + 1;
            }
            const end = nextSpecial?.index ?? text.length;
            for (const match of text.substring(start, end).matchAll(regexes)){
                const piece = this.textEncoder.encode(match[0]);
                const token2 = this.rankMap.get(piece.join(","));
                if (token2 != null) {
                    ret.push(token2);
                    continue;
                }
                ret.push(...bytePairEncode(piece, this.rankMap));
            }
            if (nextSpecial == null) break;
            let token = this.specialTokens[nextSpecial[0]];
            ret.push(token);
            start = nextSpecial.index + nextSpecial[0].length;
        }
        return ret;
    }
    decode(tokens) {
        const res = [];
        let length = 0;
        for(let i2 = 0; i2 < tokens.length; ++i2){
            const token = tokens[i2];
            const bytes = this.textMap.get(token) ?? this.inverseSpecialTokens[token];
            if (bytes != null) {
                res.push(bytes);
                length += bytes.length;
            }
        }
        const mergedArray = new Uint8Array(length);
        let i = 0;
        for (const bytes of res){
            mergedArray.set(bytes, i);
            i += bytes.length;
        }
        return this.textDecoder.decode(mergedArray);
    }
};
var Tiktoken = _Tiktoken;
__publicField(Tiktoken, "specialTokenRegex", (tokens)=>{
    return new RegExp(tokens.map((i)=>escapeRegex(i)).join("|"), "g");
});
function getEncodingNameForModel(model) {
    switch(model){
        case "gpt2":
            {
                return "gpt2";
            }
        case "code-cushman-001":
        case "code-cushman-002":
        case "code-davinci-001":
        case "code-davinci-002":
        case "cushman-codex":
        case "davinci-codex":
        case "davinci-002":
        case "text-davinci-002":
        case "text-davinci-003":
            {
                return "p50k_base";
            }
        case "code-davinci-edit-001":
        case "text-davinci-edit-001":
            {
                return "p50k_edit";
            }
        case "ada":
        case "babbage":
        case "babbage-002":
        case "code-search-ada-code-001":
        case "code-search-babbage-code-001":
        case "curie":
        case "davinci":
        case "text-ada-001":
        case "text-babbage-001":
        case "text-curie-001":
        case "text-davinci-001":
        case "text-search-ada-doc-001":
        case "text-search-babbage-doc-001":
        case "text-search-curie-doc-001":
        case "text-search-davinci-doc-001":
        case "text-similarity-ada-001":
        case "text-similarity-babbage-001":
        case "text-similarity-curie-001":
        case "text-similarity-davinci-001":
            {
                return "r50k_base";
            }
        case "gpt-3.5-turbo-instruct-0914":
        case "gpt-3.5-turbo-instruct":
        case "gpt-3.5-turbo-16k-0613":
        case "gpt-3.5-turbo-16k":
        case "gpt-3.5-turbo-0613":
        case "gpt-3.5-turbo-0301":
        case "gpt-3.5-turbo":
        case "gpt-4-32k-0613":
        case "gpt-4-32k-0314":
        case "gpt-4-32k":
        case "gpt-4-0613":
        case "gpt-4-0314":
        case "gpt-4":
        case "gpt-3.5-turbo-1106":
        case "gpt-35-turbo":
        case "gpt-4-1106-preview":
        case "gpt-4-vision-preview":
        case "gpt-3.5-turbo-0125":
        case "gpt-4-turbo":
        case "gpt-4-turbo-2024-04-09":
        case "gpt-4-turbo-preview":
        case "gpt-4-0125-preview":
        case "text-embedding-ada-002":
        case "text-embedding-3-small":
        case "text-embedding-3-large":
            {
                return "cl100k_base";
            }
        case "gpt-4o":
        case "gpt-4o-2024-05-13":
        case "gpt-4o-2024-08-06":
        case "gpt-4o-2024-11-20":
        case "gpt-4o-mini-2024-07-18":
        case "gpt-4o-mini":
        case "gpt-4o-search-preview":
        case "gpt-4o-search-preview-2025-03-11":
        case "gpt-4o-mini-search-preview":
        case "gpt-4o-mini-search-preview-2025-03-11":
        case "gpt-4o-audio-preview":
        case "gpt-4o-audio-preview-2024-12-17":
        case "gpt-4o-audio-preview-2024-10-01":
        case "gpt-4o-mini-audio-preview":
        case "gpt-4o-mini-audio-preview-2024-12-17":
        case "o1":
        case "o1-2024-12-17":
        case "o1-mini":
        case "o1-mini-2024-09-12":
        case "o1-preview":
        case "o1-preview-2024-09-12":
        case "o1-pro":
        case "o1-pro-2025-03-19":
        case "o3":
        case "o3-2025-04-16":
        case "o3-mini":
        case "o3-mini-2025-01-31":
        case "o4-mini":
        case "o4-mini-2025-04-16":
        case "chatgpt-4o-latest":
        case "gpt-4o-realtime":
        case "gpt-4o-realtime-preview-2024-10-01":
        case "gpt-4o-realtime-preview-2024-12-17":
        case "gpt-4o-mini-realtime-preview":
        case "gpt-4o-mini-realtime-preview-2024-12-17":
        case "gpt-4.1":
        case "gpt-4.1-2025-04-14":
        case "gpt-4.1-mini":
        case "gpt-4.1-mini-2025-04-14":
        case "gpt-4.1-nano":
        case "gpt-4.1-nano-2025-04-14":
        case "gpt-4.5-preview":
        case "gpt-4.5-preview-2025-02-27":
        case "gpt-5":
        case "gpt-5-2025-08-07":
        case "gpt-5-nano":
        case "gpt-5-nano-2025-08-07":
        case "gpt-5-mini":
        case "gpt-5-mini-2025-08-07":
        case "gpt-5-chat-latest":
            {
                return "o200k_base";
            }
        default:
            throw new Error("Unknown model");
    }
}
exports.Tiktoken = Tiktoken;
exports.getEncodingNameForModel = getEncodingNameForModel;
}),
"[project]/projects/tartanhacks/node_modules/eventsource-parser/dist/index.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: !0
});
class ParseError extends Error {
    constructor(message, options){
        super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
    }
}
function noop(_arg) {}
function createParser(callbacks) {
    if (typeof callbacks == "function") throw new TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
    const { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks;
    let incompleteLine = "", isFirstChunk = !0, id, data = "", eventType = "";
    function feed(newChunk) {
        const chunk = isFirstChunk ? newChunk.replace(/^\xEF\xBB\xBF/, "") : newChunk, [complete, incomplete] = splitLines(`${incompleteLine}${chunk}`);
        for (const line of complete)parseLine(line);
        incompleteLine = incomplete, isFirstChunk = !1;
    }
    function parseLine(line) {
        if (line === "") {
            dispatchEvent();
            return;
        }
        if (line.startsWith(":")) {
            onComment && onComment(line.slice(line.startsWith(": ") ? 2 : 1));
            return;
        }
        const fieldSeparatorIndex = line.indexOf(":");
        if (fieldSeparatorIndex !== -1) {
            const field = line.slice(0, fieldSeparatorIndex), offset = line[fieldSeparatorIndex + 1] === " " ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
            processField(field, value, line);
            return;
        }
        processField(line, "", line);
    }
    function processField(field, value, line) {
        switch(field){
            case "event":
                eventType = value;
                break;
            case "data":
                data = `${data}${value}
`;
                break;
            case "id":
                id = value.includes("\0") ? void 0 : value;
                break;
            case "retry":
                /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(new ParseError(`Invalid \`retry\` value: "${value}"`, {
                    type: "invalid-retry",
                    value,
                    line
                }));
                break;
            default:
                onError(new ParseError(`Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`, {
                    type: "unknown-field",
                    field,
                    value,
                    line
                }));
                break;
        }
    }
    function dispatchEvent() {
        data.length > 0 && onEvent({
            id,
            event: eventType || void 0,
            // If the data buffer's last character is a U+000A LINE FEED (LF) character,
            // then remove the last character from the data buffer.
            data: data.endsWith(`
`) ? data.slice(0, -1) : data
        }), id = void 0, data = "", eventType = "";
    }
    function reset(options = {}) {
        incompleteLine && options.consume && parseLine(incompleteLine), isFirstChunk = !0, id = void 0, data = "", eventType = "", incompleteLine = "";
    }
    return {
        feed,
        reset
    };
}
function splitLines(chunk) {
    const lines = [];
    let incompleteLine = "", searchIndex = 0;
    for(; searchIndex < chunk.length;){
        const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
        let lineEnd = -1;
        if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = Math.min(crIndex, lfIndex) : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) {
            incompleteLine = chunk.slice(searchIndex);
            break;
        } else {
            const line = chunk.slice(searchIndex, lineEnd);
            lines.push(line), searchIndex = lineEnd + 1, chunk[searchIndex - 1] === "\r" && chunk[searchIndex] === `
` && searchIndex++;
        }
    }
    return [
        lines,
        incompleteLine
    ];
}
exports.ParseError = ParseError;
exports.createParser = createParser; //# sourceMappingURL=index.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/eventsource-parser/dist/stream.cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: !0
});
var index = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/eventsource-parser/dist/index.cjs [app-route] (ecmascript)");
class EventSourceParserStream extends TransformStream {
    constructor({ onError, onRetry, onComment } = {}){
        let parser;
        super({
            start (controller) {
                parser = index.createParser({
                    onEvent: (event)=>{
                        controller.enqueue(event);
                    },
                    onError (error) {
                        onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
                    },
                    onRetry,
                    onComment
                });
            },
            transform (chunk) {
                parser.feed(chunk);
            }
        });
    }
}
exports.ParseError = index.ParseError;
exports.EventSourceParserStream = EventSourceParserStream; //# sourceMappingURL=stream.cjs.map
}),
"[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name14 in all)__defProp(target, name14, {
        get: all[name14],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    AISDKError: ()=>AISDKError,
    APICallError: ()=>APICallError,
    EmptyResponseBodyError: ()=>EmptyResponseBodyError,
    InvalidArgumentError: ()=>InvalidArgumentError,
    InvalidPromptError: ()=>InvalidPromptError,
    InvalidResponseDataError: ()=>InvalidResponseDataError,
    JSONParseError: ()=>JSONParseError,
    LoadAPIKeyError: ()=>LoadAPIKeyError,
    LoadSettingError: ()=>LoadSettingError,
    NoContentGeneratedError: ()=>NoContentGeneratedError,
    NoSuchModelError: ()=>NoSuchModelError,
    TooManyEmbeddingValuesForCallError: ()=>TooManyEmbeddingValuesForCallError,
    TypeValidationError: ()=>TypeValidationError,
    UnsupportedFunctionalityError: ()=>UnsupportedFunctionalityError,
    getErrorMessage: ()=>getErrorMessage,
    isJSONArray: ()=>isJSONArray,
    isJSONObject: ()=>isJSONObject,
    isJSONValue: ()=>isJSONValue
});
module.exports = __toCommonJS(src_exports);
// src/errors/ai-sdk-error.ts
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a, _b;
var AISDKError = class _AISDKError extends (_b = Error, _a = symbol, _b) {
    /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */ constructor({ name: name14, message, cause }){
        super(message);
        this[_a] = true;
        this.name = name14;
        this.cause = cause;
    }
    /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */ static isInstance(error) {
        return _AISDKError.hasMarker(error, marker);
    }
    static hasMarker(error, marker15) {
        const markerSymbol = Symbol.for(marker15);
        return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
    }
};
// src/errors/api-call-error.ts
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2, _b2;
var APICallError = class extends (_b2 = AISDKError, _a2 = symbol2, _b2) {
    constructor({ message, url, requestBodyValues, statusCode, responseHeaders, responseBody, cause, isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500), // server error
    data }){
        super({
            name,
            message,
            cause
        });
        this[_a2] = true;
        this.url = url;
        this.requestBodyValues = requestBodyValues;
        this.statusCode = statusCode;
        this.responseHeaders = responseHeaders;
        this.responseBody = responseBody;
        this.isRetryable = isRetryable;
        this.data = data;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker2);
    }
};
// src/errors/empty-response-body-error.ts
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3, _b3;
var EmptyResponseBodyError = class extends (_b3 = AISDKError, _a3 = symbol3, _b3) {
    // used in isInstance
    constructor({ message = "Empty response body" } = {}){
        super({
            name: name2,
            message
        });
        this[_a3] = true;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker3);
    }
};
// src/errors/get-error-message.ts
function getErrorMessage(error) {
    if (error == null) {
        return "unknown error";
    }
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return JSON.stringify(error);
}
// src/errors/invalid-argument-error.ts
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4, _b4;
var InvalidArgumentError = class extends (_b4 = AISDKError, _a4 = symbol4, _b4) {
    constructor({ message, cause, argument }){
        super({
            name: name3,
            message,
            cause
        });
        this[_a4] = true;
        this.argument = argument;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker4);
    }
};
// src/errors/invalid-prompt-error.ts
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5, _b5;
var InvalidPromptError = class extends (_b5 = AISDKError, _a5 = symbol5, _b5) {
    constructor({ prompt, message, cause }){
        super({
            name: name4,
            message: `Invalid prompt: ${message}`,
            cause
        });
        this[_a5] = true;
        this.prompt = prompt;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker5);
    }
};
// src/errors/invalid-response-data-error.ts
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6, _b6;
var InvalidResponseDataError = class extends (_b6 = AISDKError, _a6 = symbol6, _b6) {
    constructor({ data, message = `Invalid response data: ${JSON.stringify(data)}.` }){
        super({
            name: name5,
            message
        });
        this[_a6] = true;
        this.data = data;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker6);
    }
};
// src/errors/json-parse-error.ts
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7, _b7;
var JSONParseError = class extends (_b7 = AISDKError, _a7 = symbol7, _b7) {
    constructor({ text, cause }){
        super({
            name: name6,
            message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
            cause
        });
        this[_a7] = true;
        this.text = text;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker7);
    }
};
// src/errors/load-api-key-error.ts
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8, _b8;
var LoadAPIKeyError = class extends (_b8 = AISDKError, _a8 = symbol8, _b8) {
    // used in isInstance
    constructor({ message }){
        super({
            name: name7,
            message
        });
        this[_a8] = true;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker8);
    }
};
// src/errors/load-setting-error.ts
var name8 = "AI_LoadSettingError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9, _b9;
var LoadSettingError = class extends (_b9 = AISDKError, _a9 = symbol9, _b9) {
    // used in isInstance
    constructor({ message }){
        super({
            name: name8,
            message
        });
        this[_a9] = true;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker9);
    }
};
// src/errors/no-content-generated-error.ts
var name9 = "AI_NoContentGeneratedError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10, _b10;
var NoContentGeneratedError = class extends (_b10 = AISDKError, _a10 = symbol10, _b10) {
    // used in isInstance
    constructor({ message = "No content generated." } = {}){
        super({
            name: name9,
            message
        });
        this[_a10] = true;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker10);
    }
};
// src/errors/no-such-model-error.ts
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11, _b11;
var NoSuchModelError = class extends (_b11 = AISDKError, _a11 = symbol11, _b11) {
    constructor({ errorName = name10, modelId, modelType, message = `No such ${modelType}: ${modelId}` }){
        super({
            name: errorName,
            message
        });
        this[_a11] = true;
        this.modelId = modelId;
        this.modelType = modelType;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker11);
    }
};
// src/errors/too-many-embedding-values-for-call-error.ts
var name11 = "AI_TooManyEmbeddingValuesForCallError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12, _b12;
var TooManyEmbeddingValuesForCallError = class extends (_b12 = AISDKError, _a12 = symbol12, _b12) {
    constructor(options){
        super({
            name: name11,
            message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
        });
        this[_a12] = true;
        this.provider = options.provider;
        this.modelId = options.modelId;
        this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
        this.values = options.values;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker12);
    }
};
// src/errors/type-validation-error.ts
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13, _b13;
var TypeValidationError = class _TypeValidationError extends (_b13 = AISDKError, _a13 = symbol13, _b13) {
    constructor({ value, cause, context }){
        let contextPrefix = "Type validation failed";
        if (context == null ? void 0 : context.field) {
            contextPrefix += ` for ${context.field}`;
        }
        if ((context == null ? void 0 : context.entityName) || (context == null ? void 0 : context.entityId)) {
            contextPrefix += " (";
            const parts = [];
            if (context.entityName) {
                parts.push(context.entityName);
            }
            if (context.entityId) {
                parts.push(`id: "${context.entityId}"`);
            }
            contextPrefix += parts.join(", ");
            contextPrefix += ")";
        }
        super({
            name: name12,
            message: `${contextPrefix}: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
            cause
        });
        this[_a13] = true;
        this.value = value;
        this.context = context;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker13);
    }
    /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value and context, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @param {TypeValidationContext} params.context - Optional context about what is being validated.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */ static wrap({ value, cause, context }) {
        var _a15, _b15, _c;
        if (_TypeValidationError.isInstance(cause) && cause.value === value && ((_a15 = cause.context) == null ? void 0 : _a15.field) === (context == null ? void 0 : context.field) && ((_b15 = cause.context) == null ? void 0 : _b15.entityName) === (context == null ? void 0 : context.entityName) && ((_c = cause.context) == null ? void 0 : _c.entityId) === (context == null ? void 0 : context.entityId)) {
            return cause;
        }
        return new _TypeValidationError({
            value,
            cause,
            context
        });
    }
};
// src/errors/unsupported-functionality-error.ts
var name13 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14, _b14;
var UnsupportedFunctionalityError = class extends (_b14 = AISDKError, _a14 = symbol14, _b14) {
    constructor({ functionality, message = `'${functionality}' functionality not supported.` }){
        super({
            name: name13,
            message
        });
        this[_a14] = true;
        this.functionality = functionality;
    }
    static isInstance(error) {
        return AISDKError.hasMarker(error, marker14);
    }
};
// src/json-value/is-json.ts
function isJSONValue(value) {
    if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return true;
    }
    if (Array.isArray(value)) {
        return value.every(isJSONValue);
    }
    if (typeof value === "object") {
        return Object.entries(value).every(([key, val])=>typeof key === "string" && (val === void 0 || isJSONValue(val)));
    }
    return false;
}
function isJSONArray(value) {
    return Array.isArray(value) && value.every(isJSONValue);
}
function isJSONObject(value) {
    return value != null && typeof value === "object" && Object.entries(value).every(([key, val])=>typeof key === "string" && (val === void 0 || isJSONValue(val)));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    AISDKError,
    APICallError,
    EmptyResponseBodyError,
    InvalidArgumentError,
    InvalidPromptError,
    InvalidResponseDataError,
    JSONParseError,
    LoadAPIKeyError,
    LoadSettingError,
    NoContentGeneratedError,
    NoSuchModelError,
    TooManyEmbeddingValuesForCallError,
    TypeValidationError,
    UnsupportedFunctionalityError,
    getErrorMessage,
    isJSONArray,
    isJSONObject,
    isJSONValue
}); //# sourceMappingURL=index.js.map
}),
"[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name2 in all)__defProp(target, name2, {
        get: all[name2],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    DelayedPromise: ()=>DelayedPromise,
    DownloadError: ()=>DownloadError,
    EventSourceParserStream: ()=>import_stream2.EventSourceParserStream,
    VERSION: ()=>VERSION,
    asSchema: ()=>asSchema,
    combineHeaders: ()=>combineHeaders,
    convertAsyncIteratorToReadableStream: ()=>convertAsyncIteratorToReadableStream,
    convertBase64ToUint8Array: ()=>convertBase64ToUint8Array,
    convertImageModelFileToDataUri: ()=>convertImageModelFileToDataUri,
    convertToBase64: ()=>convertToBase64,
    convertToFormData: ()=>convertToFormData,
    convertUint8ArrayToBase64: ()=>convertUint8ArrayToBase64,
    createBinaryResponseHandler: ()=>createBinaryResponseHandler,
    createEventSourceResponseHandler: ()=>createEventSourceResponseHandler,
    createIdGenerator: ()=>createIdGenerator,
    createJsonErrorResponseHandler: ()=>createJsonErrorResponseHandler,
    createJsonResponseHandler: ()=>createJsonResponseHandler,
    createProviderToolFactory: ()=>createProviderToolFactory,
    createProviderToolFactoryWithOutputSchema: ()=>createProviderToolFactoryWithOutputSchema,
    createStatusCodeErrorResponseHandler: ()=>createStatusCodeErrorResponseHandler,
    createToolNameMapping: ()=>createToolNameMapping,
    delay: ()=>delay,
    downloadBlob: ()=>downloadBlob,
    dynamicTool: ()=>dynamicTool,
    executeTool: ()=>executeTool,
    extractResponseHeaders: ()=>extractResponseHeaders,
    generateId: ()=>generateId,
    getErrorMessage: ()=>getErrorMessage,
    getFromApi: ()=>getFromApi,
    getRuntimeEnvironmentUserAgent: ()=>getRuntimeEnvironmentUserAgent,
    injectJsonInstructionIntoMessages: ()=>injectJsonInstructionIntoMessages,
    isAbortError: ()=>isAbortError,
    isNonNullable: ()=>isNonNullable,
    isParsableJson: ()=>isParsableJson,
    isUrlSupported: ()=>isUrlSupported,
    jsonSchema: ()=>jsonSchema,
    lazySchema: ()=>lazySchema,
    loadApiKey: ()=>loadApiKey,
    loadOptionalSetting: ()=>loadOptionalSetting,
    loadSetting: ()=>loadSetting,
    mediaTypeToExtension: ()=>mediaTypeToExtension,
    normalizeHeaders: ()=>normalizeHeaders,
    parseJSON: ()=>parseJSON,
    parseJsonEventStream: ()=>parseJsonEventStream,
    parseProviderOptions: ()=>parseProviderOptions,
    postFormDataToApi: ()=>postFormDataToApi,
    postJsonToApi: ()=>postJsonToApi,
    postToApi: ()=>postToApi,
    removeUndefinedEntries: ()=>removeUndefinedEntries,
    resolve: ()=>resolve,
    safeParseJSON: ()=>safeParseJSON,
    safeValidateTypes: ()=>safeValidateTypes,
    tool: ()=>tool,
    validateTypes: ()=>validateTypes,
    withUserAgentSuffix: ()=>withUserAgentSuffix,
    withoutTrailingSlash: ()=>withoutTrailingSlash,
    zodSchema: ()=>zodSchema
});
module.exports = __toCommonJS(src_exports);
// src/combine-headers.ts
function combineHeaders(...headers) {
    return headers.reduce((combinedHeaders, currentHeaders)=>({
            ...combinedHeaders,
            ...currentHeaders != null ? currentHeaders : {}
        }), {});
}
// src/convert-async-iterator-to-readable-stream.ts
function convertAsyncIteratorToReadableStream(iterator) {
    let cancelled = false;
    return new ReadableStream({
        /**
     * Called when the consumer wants to pull more data from the stream.
     *
     * @param {ReadableStreamDefaultController<T>} controller - The controller to enqueue data into the stream.
     * @returns {Promise<void>}
     */ async pull (controller) {
            if (cancelled) return;
            try {
                const { value, done } = await iterator.next();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(value);
                }
            } catch (error) {
                controller.error(error);
            }
        },
        /**
     * Called when the consumer cancels the stream.
     */ async cancel (reason) {
            cancelled = true;
            if (iterator.return) {
                try {
                    await iterator.return(reason);
                } catch (e) {}
            }
        }
    });
}
// src/create-tool-name-mapping.ts
function createToolNameMapping({ tools = [], providerToolNames }) {
    const customToolNameToProviderToolName = {};
    const providerToolNameToCustomToolName = {};
    for (const tool2 of tools){
        if (tool2.type === "provider" && tool2.id in providerToolNames) {
            const providerToolName = providerToolNames[tool2.id];
            customToolNameToProviderToolName[tool2.name] = providerToolName;
            providerToolNameToCustomToolName[providerToolName] = tool2.name;
        }
    }
    return {
        toProviderToolName: (customToolName)=>{
            var _a2;
            return (_a2 = customToolNameToProviderToolName[customToolName]) != null ? _a2 : customToolName;
        },
        toCustomToolName: (providerToolName)=>{
            var _a2;
            return (_a2 = providerToolNameToCustomToolName[providerToolName]) != null ? _a2 : providerToolName;
        }
    };
}
// src/delay.ts
async function delay(delayInMs, options) {
    if (delayInMs == null) {
        return Promise.resolve();
    }
    const signal = options == null ? void 0 : options.abortSignal;
    return new Promise((resolve2, reject)=>{
        if (signal == null ? void 0 : signal.aborted) {
            reject(createAbortError());
            return;
        }
        const timeoutId = setTimeout(()=>{
            cleanup();
            resolve2();
        }, delayInMs);
        const cleanup = ()=>{
            clearTimeout(timeoutId);
            signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
        };
        const onAbort = ()=>{
            cleanup();
            reject(createAbortError());
        };
        signal == null ? void 0 : signal.addEventListener("abort", onAbort);
    });
}
function createAbortError() {
    return new DOMException("Delay was aborted", "AbortError");
}
// src/delayed-promise.ts
var DelayedPromise = class {
    constructor(){
        this.status = {
            type: "pending"
        };
        this._resolve = void 0;
        this._reject = void 0;
    }
    get promise() {
        if (this._promise) {
            return this._promise;
        }
        this._promise = new Promise((resolve2, reject)=>{
            if (this.status.type === "resolved") {
                resolve2(this.status.value);
            } else if (this.status.type === "rejected") {
                reject(this.status.error);
            }
            this._resolve = resolve2;
            this._reject = reject;
        });
        return this._promise;
    }
    resolve(value) {
        var _a2;
        this.status = {
            type: "resolved",
            value
        };
        if (this._promise) {
            (_a2 = this._resolve) == null ? void 0 : _a2.call(this, value);
        }
    }
    reject(error) {
        var _a2;
        this.status = {
            type: "rejected",
            error
        };
        if (this._promise) {
            (_a2 = this._reject) == null ? void 0 : _a2.call(this, error);
        }
    }
    isResolved() {
        return this.status.type === "resolved";
    }
    isRejected() {
        return this.status.type === "rejected";
    }
    isPending() {
        return this.status.type === "pending";
    }
};
// src/extract-response-headers.ts
function extractResponseHeaders(response) {
    return Object.fromEntries([
        ...response.headers
    ]);
}
// src/uint8-utils.ts
var { btoa, atob } = globalThis;
function convertBase64ToUint8Array(base64String) {
    const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
    const latin1string = atob(base64Url);
    return Uint8Array.from(latin1string, (byte)=>byte.codePointAt(0));
}
function convertUint8ArrayToBase64(array) {
    let latin1string = "";
    for(let i = 0; i < array.length; i++){
        latin1string += String.fromCodePoint(array[i]);
    }
    return btoa(latin1string);
}
function convertToBase64(value) {
    return value instanceof Uint8Array ? convertUint8ArrayToBase64(value) : value;
}
// src/convert-image-model-file-to-data-uri.ts
function convertImageModelFileToDataUri(file) {
    if (file.type === "url") return file.url;
    return `data:${file.mediaType};base64,${typeof file.data === "string" ? file.data : convertUint8ArrayToBase64(file.data)}`;
}
// src/convert-to-form-data.ts
function convertToFormData(input, options = {}) {
    const { useArrayBrackets = true } = options;
    const formData = new FormData();
    for (const [key, value] of Object.entries(input)){
        if (value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            if (value.length === 1) {
                formData.append(key, value[0]);
                continue;
            }
            const arrayKey = useArrayBrackets ? `${key}[]` : key;
            for (const item of value){
                formData.append(arrayKey, item);
            }
            continue;
        }
        formData.append(key, value);
    }
    return formData;
}
// src/download-error.ts
var import_provider = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
var name = "AI_DownloadError";
var marker = `vercel.ai.error.${name}`;
var symbol = Symbol.for(marker);
var _a, _b;
var DownloadError = class extends (_b = import_provider.AISDKError, _a = symbol, _b) {
    constructor({ url, statusCode, statusText, cause, message = cause == null ? `Failed to download ${url}: ${statusCode} ${statusText}` : `Failed to download ${url}: ${cause}` }){
        super({
            name,
            message,
            cause
        });
        this[_a] = true;
        this.url = url;
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
    static isInstance(error) {
        return import_provider.AISDKError.hasMarker(error, marker);
    }
};
// src/download-blob.ts
async function downloadBlob(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new DownloadError({
                url,
                statusCode: response.status,
                statusText: response.statusText
            });
        }
        return await response.blob();
    } catch (error) {
        if (DownloadError.isInstance(error)) {
            throw error;
        }
        throw new DownloadError({
            url,
            cause: error
        });
    }
}
// src/generate-id.ts
var import_provider2 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
var createIdGenerator = ({ prefix, size = 16, alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", separator = "-" } = {})=>{
    const generator = ()=>{
        const alphabetLength = alphabet.length;
        const chars = new Array(size);
        for(let i = 0; i < size; i++){
            chars[i] = alphabet[Math.random() * alphabetLength | 0];
        }
        return chars.join("");
    };
    if (prefix == null) {
        return generator;
    }
    if (alphabet.includes(separator)) {
        throw new import_provider2.InvalidArgumentError({
            argument: "separator",
            message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
        });
    }
    return ()=>`${prefix}${separator}${generator()}`;
};
var generateId = createIdGenerator();
// src/get-error-message.ts
function getErrorMessage(error) {
    if (error == null) {
        return "unknown error";
    }
    if (typeof error === "string") {
        return error;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return JSON.stringify(error);
}
// src/get-from-api.ts
var import_provider4 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
// src/handle-fetch-error.ts
var import_provider3 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
// src/is-abort-error.ts
function isAbortError(error) {
    return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
    error.name === "TimeoutError");
}
// src/handle-fetch-error.ts
var FETCH_FAILED_ERROR_MESSAGES = [
    "fetch failed",
    "failed to fetch"
];
var BUN_ERROR_CODES = [
    "ConnectionRefused",
    "ConnectionClosed",
    "FailedToOpenSocket",
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EPIPE"
];
function isBunNetworkError(error) {
    if (!(error instanceof Error)) {
        return false;
    }
    const code = error.code;
    if (typeof code === "string" && BUN_ERROR_CODES.includes(code)) {
        return true;
    }
    return false;
}
function handleFetchError({ error, url, requestBodyValues }) {
    if (isAbortError(error)) {
        return error;
    }
    if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES.includes(error.message.toLowerCase())) {
        const cause = error.cause;
        if (cause != null) {
            return new import_provider3.APICallError({
                message: `Cannot connect to API: ${cause.message}`,
                cause,
                url,
                requestBodyValues,
                isRetryable: true
            });
        }
    }
    if (isBunNetworkError(error)) {
        return new import_provider3.APICallError({
            message: `Cannot connect to API: ${error.message}`,
            cause: error,
            url,
            requestBodyValues,
            isRetryable: true
        });
    }
    return error;
}
// src/get-runtime-environment-user-agent.ts
function getRuntimeEnvironmentUserAgent(globalThisAny = globalThis) {
    var _a2, _b2, _c;
    if (globalThisAny.window) {
        return `runtime/browser`;
    }
    if ((_a2 = globalThisAny.navigator) == null ? void 0 : _a2.userAgent) {
        return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
    }
    if ((_c = (_b2 = globalThisAny.process) == null ? void 0 : _b2.versions) == null ? void 0 : _c.node) {
        return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
    }
    if (globalThisAny.EdgeRuntime) {
        return `runtime/vercel-edge`;
    }
    return "runtime/unknown";
}
// src/normalize-headers.ts
function normalizeHeaders(headers) {
    if (headers == null) {
        return {};
    }
    const normalized = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key)=>{
            normalized[key.toLowerCase()] = value;
        });
    } else {
        if (!Array.isArray(headers)) {
            headers = Object.entries(headers);
        }
        for (const [key, value] of headers){
            if (value != null) {
                normalized[key.toLowerCase()] = value;
            }
        }
    }
    return normalized;
}
// src/with-user-agent-suffix.ts
function withUserAgentSuffix(headers, ...userAgentSuffixParts) {
    const normalizedHeaders = new Headers(normalizeHeaders(headers));
    const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
    normalizedHeaders.set("user-agent", [
        currentUserAgentHeader,
        ...userAgentSuffixParts
    ].filter(Boolean).join(" "));
    return Object.fromEntries(normalizedHeaders.entries());
}
// src/version.ts
var VERSION = ("TURBOPACK compile-time truthy", 1) ? "4.0.14" : "TURBOPACK unreachable";
// src/get-from-api.ts
var getOriginalFetch = ()=>globalThis.fetch;
var getFromApi = async ({ url, headers = {}, successfulResponseHandler, failedResponseHandler, abortSignal, fetch: fetch2 = getOriginalFetch() })=>{
    try {
        const response = await fetch2(url, {
            method: "GET",
            headers: withUserAgentSuffix(headers, `ai-sdk/provider-utils/${VERSION}`, getRuntimeEnvironmentUserAgent()),
            signal: abortSignal
        });
        const responseHeaders = extractResponseHeaders(response);
        if (!response.ok) {
            let errorInformation;
            try {
                errorInformation = await failedResponseHandler({
                    response,
                    url,
                    requestBodyValues: {}
                });
            } catch (error) {
                if (isAbortError(error) || import_provider4.APICallError.isInstance(error)) {
                    throw error;
                }
                throw new import_provider4.APICallError({
                    message: "Failed to process error response",
                    cause: error,
                    statusCode: response.status,
                    url,
                    responseHeaders,
                    requestBodyValues: {}
                });
            }
            throw errorInformation.value;
        }
        try {
            return await successfulResponseHandler({
                response,
                url,
                requestBodyValues: {}
            });
        } catch (error) {
            if (error instanceof Error) {
                if (isAbortError(error) || import_provider4.APICallError.isInstance(error)) {
                    throw error;
                }
            }
            throw new import_provider4.APICallError({
                message: "Failed to process successful response",
                cause: error,
                statusCode: response.status,
                url,
                responseHeaders,
                requestBodyValues: {}
            });
        }
    } catch (error) {
        throw handleFetchError({
            error,
            url,
            requestBodyValues: {}
        });
    }
};
// src/inject-json-instruction.ts
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
var DEFAULT_GENERIC_SUFFIX = "You MUST answer with JSON.";
function injectJsonInstruction({ prompt, schema, schemaPrefix = schema != null ? DEFAULT_SCHEMA_PREFIX : void 0, schemaSuffix = schema != null ? DEFAULT_SCHEMA_SUFFIX : DEFAULT_GENERIC_SUFFIX }) {
    return [
        prompt != null && prompt.length > 0 ? prompt : void 0,
        prompt != null && prompt.length > 0 ? "" : void 0,
        // add a newline if prompt is not null
        schemaPrefix,
        schema != null ? JSON.stringify(schema) : void 0,
        schemaSuffix
    ].filter((line)=>line != null).join("\n");
}
function injectJsonInstructionIntoMessages({ messages, schema, schemaPrefix, schemaSuffix }) {
    var _a2, _b2;
    const systemMessage = ((_a2 = messages[0]) == null ? void 0 : _a2.role) === "system" ? {
        ...messages[0]
    } : {
        role: "system",
        content: ""
    };
    systemMessage.content = injectJsonInstruction({
        prompt: systemMessage.content,
        schema,
        schemaPrefix,
        schemaSuffix
    });
    return [
        systemMessage,
        ...((_b2 = messages[0]) == null ? void 0 : _b2.role) === "system" ? messages.slice(1) : messages
    ];
}
// src/is-non-nullable.ts
function isNonNullable(value) {
    return value != null;
}
// src/is-url-supported.ts
function isUrlSupported({ mediaType, url, supportedUrls }) {
    url = url.toLowerCase();
    mediaType = mediaType.toLowerCase();
    return Object.entries(supportedUrls).map(([key, value])=>{
        const mediaType2 = key.toLowerCase();
        return mediaType2 === "*" || mediaType2 === "*/*" ? {
            mediaTypePrefix: "",
            regexes: value
        } : {
            mediaTypePrefix: mediaType2.replace(/\*/, ""),
            regexes: value
        };
    }).filter(({ mediaTypePrefix })=>mediaType.startsWith(mediaTypePrefix)).flatMap(({ regexes })=>regexes).some((pattern)=>pattern.test(url));
}
// src/load-api-key.ts
var import_provider5 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
function loadApiKey({ apiKey, environmentVariableName, apiKeyParameterName = "apiKey", description }) {
    if (typeof apiKey === "string") {
        return apiKey;
    }
    if (apiKey != null) {
        throw new import_provider5.LoadAPIKeyError({
            message: `${description} API key must be a string.`
        });
    }
    if (typeof process === "undefined") {
        throw new import_provider5.LoadAPIKeyError({
            message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
        });
    }
    apiKey = process.env[environmentVariableName];
    if (apiKey == null) {
        throw new import_provider5.LoadAPIKeyError({
            message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
        });
    }
    if (typeof apiKey !== "string") {
        throw new import_provider5.LoadAPIKeyError({
            message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
        });
    }
    return apiKey;
}
// src/load-optional-setting.ts
function loadOptionalSetting({ settingValue, environmentVariableName }) {
    if (typeof settingValue === "string") {
        return settingValue;
    }
    if (settingValue != null || typeof process === "undefined") {
        return void 0;
    }
    settingValue = process.env[environmentVariableName];
    if (settingValue == null || typeof settingValue !== "string") {
        return void 0;
    }
    return settingValue;
}
// src/load-setting.ts
var import_provider6 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
function loadSetting({ settingValue, environmentVariableName, settingName, description }) {
    if (typeof settingValue === "string") {
        return settingValue;
    }
    if (settingValue != null) {
        throw new import_provider6.LoadSettingError({
            message: `${description} setting must be a string.`
        });
    }
    if (typeof process === "undefined") {
        throw new import_provider6.LoadSettingError({
            message: `${description} setting is missing. Pass it using the '${settingName}' parameter. Environment variables is not supported in this environment.`
        });
    }
    settingValue = process.env[environmentVariableName];
    if (settingValue == null) {
        throw new import_provider6.LoadSettingError({
            message: `${description} setting is missing. Pass it using the '${settingName}' parameter or the ${environmentVariableName} environment variable.`
        });
    }
    if (typeof settingValue !== "string") {
        throw new import_provider6.LoadSettingError({
            message: `${description} setting must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
        });
    }
    return settingValue;
}
// src/media-type-to-extension.ts
function mediaTypeToExtension(mediaType) {
    var _a2;
    const [_type, subtype = ""] = mediaType.toLowerCase().split("/");
    return (_a2 = ({
        mpeg: "mp3",
        "x-wav": "wav",
        opus: "ogg",
        mp4: "m4a",
        "x-m4a": "m4a"
    })[subtype]) != null ? _a2 : subtype;
}
// src/parse-json.ts
var import_provider9 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
// src/secure-json-parse.ts
var suspectProtoRx = /"__proto__"\s*:/;
var suspectConstructorRx = /"constructor"\s*:/;
function _parse(text) {
    const obj = JSON.parse(text);
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
        return obj;
    }
    return filter(obj);
}
function filter(obj) {
    let next = [
        obj
    ];
    while(next.length){
        const nodes = next;
        next = [];
        for (const node of nodes){
            if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
                throw new SyntaxError("Object contains forbidden prototype property");
            }
            if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
                throw new SyntaxError("Object contains forbidden prototype property");
            }
            for(const key in node){
                const value = node[key];
                if (value && typeof value === "object") {
                    next.push(value);
                }
            }
        }
    }
    return obj;
}
function secureJsonParse(text) {
    const { stackTraceLimit } = Error;
    try {
        Error.stackTraceLimit = 0;
    } catch (e) {
        return _parse(text);
    }
    try {
        return _parse(text);
    } finally{
        Error.stackTraceLimit = stackTraceLimit;
    }
}
// src/validate-types.ts
var import_provider8 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
// src/schema.ts
var import_provider7 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
var z4 = __toESM(__turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)"));
// src/add-additional-properties-to-json-schema.ts
function addAdditionalPropertiesToJsonSchema(jsonSchema2) {
    if (jsonSchema2.type === "object" || Array.isArray(jsonSchema2.type) && jsonSchema2.type.includes("object")) {
        jsonSchema2.additionalProperties = false;
        const { properties } = jsonSchema2;
        if (properties != null) {
            for (const key of Object.keys(properties)){
                properties[key] = visit(properties[key]);
            }
        }
    }
    if (jsonSchema2.items != null) {
        jsonSchema2.items = Array.isArray(jsonSchema2.items) ? jsonSchema2.items.map(visit) : visit(jsonSchema2.items);
    }
    if (jsonSchema2.anyOf != null) {
        jsonSchema2.anyOf = jsonSchema2.anyOf.map(visit);
    }
    if (jsonSchema2.allOf != null) {
        jsonSchema2.allOf = jsonSchema2.allOf.map(visit);
    }
    if (jsonSchema2.oneOf != null) {
        jsonSchema2.oneOf = jsonSchema2.oneOf.map(visit);
    }
    const { definitions } = jsonSchema2;
    if (definitions != null) {
        for (const key of Object.keys(definitions)){
            definitions[key] = visit(definitions[key]);
        }
    }
    return jsonSchema2;
}
function visit(def) {
    if (typeof def === "boolean") return def;
    return addAdditionalPropertiesToJsonSchema(def);
}
// src/to-json-schema/zod3-to-json-schema/options.ts
var ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
var defaultOptions = {
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
    strictUnions: false,
    definitions: {},
    errorMessages: false,
    patternStrategy: "escape",
    applyRegexFlags: false,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref"
};
var getDefaultOptions = (options)=>typeof options === "string" ? {
        ...defaultOptions,
        name: options
    } : {
        ...defaultOptions,
        ...options
    };
// src/to-json-schema/zod3-to-json-schema/select-parser.ts
var import_v33 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
// src/to-json-schema/zod3-to-json-schema/parsers/any.ts
function parseAnyDef() {
    return {};
}
// src/to-json-schema/zod3-to-json-schema/parsers/array.ts
var import_v3 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
function parseArrayDef(def, refs) {
    var _a2, _b2, _c;
    const res = {
        type: "array"
    };
    if (((_a2 = def.type) == null ? void 0 : _a2._def) && ((_c = (_b2 = def.type) == null ? void 0 : _b2._def) == null ? void 0 : _c.typeName) !== import_v3.ZodFirstPartyTypeKind.ZodAny) {
        res.items = parseDef(def.type._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "items"
            ]
        });
    }
    if (def.minLength) {
        res.minItems = def.minLength.value;
    }
    if (def.maxLength) {
        res.maxItems = def.maxLength.value;
    }
    if (def.exactLength) {
        res.minItems = def.exactLength.value;
        res.maxItems = def.exactLength.value;
    }
    return res;
}
// src/to-json-schema/zod3-to-json-schema/parsers/bigint.ts
function parseBigintDef(def) {
    const res = {
        type: "integer",
        format: "int64"
    };
    if (!def.checks) return res;
    for (const check of def.checks){
        switch(check.kind){
            case "min":
                if (check.inclusive) {
                    res.minimum = check.value;
                } else {
                    res.exclusiveMinimum = check.value;
                }
                break;
            case "max":
                if (check.inclusive) {
                    res.maximum = check.value;
                } else {
                    res.exclusiveMaximum = check.value;
                }
                break;
            case "multipleOf":
                res.multipleOf = check.value;
                break;
        }
    }
    return res;
}
// src/to-json-schema/zod3-to-json-schema/parsers/boolean.ts
function parseBooleanDef() {
    return {
        type: "boolean"
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/branded.ts
function parseBrandedDef(_def, refs) {
    return parseDef(_def.type._def, refs);
}
// src/to-json-schema/zod3-to-json-schema/parsers/catch.ts
var parseCatchDef = (def, refs)=>{
    return parseDef(def.innerType._def, refs);
};
// src/to-json-schema/zod3-to-json-schema/parsers/date.ts
function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
    if (Array.isArray(strategy)) {
        return {
            anyOf: strategy.map((item, i)=>parseDateDef(def, refs, item))
        };
    }
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
            return integerDateParser(def);
    }
}
var integerDateParser = (def)=>{
    const res = {
        type: "integer",
        format: "unix-time"
    };
    for (const check of def.checks){
        switch(check.kind){
            case "min":
                res.minimum = check.value;
                break;
            case "max":
                res.maximum = check.value;
                break;
        }
    }
    return res;
};
// src/to-json-schema/zod3-to-json-schema/parsers/default.ts
function parseDefaultDef(_def, refs) {
    return {
        ...parseDef(_def.innerType._def, refs),
        default: _def.defaultValue()
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/effects.ts
function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef();
}
// src/to-json-schema/zod3-to-json-schema/parsers/enum.ts
function parseEnumDef(def) {
    return {
        type: "string",
        enum: Array.from(def.values)
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/intersection.ts
var isJsonSchema7AllOfType = (type)=>{
    if ("type" in type && type.type === "string") return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        parseDef(def.left._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "allOf",
                "0"
            ]
        }),
        parseDef(def.right._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "allOf",
                "1"
            ]
        })
    ].filter((x)=>!!x);
    const mergedAllOf = [];
    allOf.forEach((schema)=>{
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
        } else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema && schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            }
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length ? {
        allOf: mergedAllOf
    } : void 0;
}
// src/to-json-schema/zod3-to-json-schema/parsers/literal.ts
function parseLiteralDef(def) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
        return {
            type: Array.isArray(def.value) ? "array" : "object"
        };
    }
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/record.ts
var import_v32 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v3/index.cjs [app-route] (ecmascript)");
// src/to-json-schema/zod3-to-json-schema/parsers/string.ts
var emojiRegex = void 0;
var zodPatterns = {
    /**
   * `c` was changed to `[cC]` to replicate /i flag
   */ cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    /**
   * `a-z` was added to replicate /i flag
   */ email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */ emoji: ()=>{
        if (emojiRegex === void 0) {
            emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        }
        return emojiRegex;
    },
    /**
   * Unused
   */ uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /**
   * Unused
   */ ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    /**
   * Unused
   */ ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
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
    if (def.checks) {
        for (const check of def.checks){
            switch(check.kind){
                case "min":
                    res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
                    break;
                case "max":
                    res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
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
                    res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
                    res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
                    break;
                case "includes":
                    {
                        addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
                        break;
                    }
                case "ip":
                    {
                        if (check.version !== "v6") {
                            addFormat(res, "ipv4", check.message, refs);
                        }
                        if (check.version !== "v4") {
                            addFormat(res, "ipv6", check.message, refs);
                        }
                        break;
                    }
                case "base64url":
                    addPattern(res, zodPatterns.base64url, check.message, refs);
                    break;
                case "jwt":
                    addPattern(res, zodPatterns.jwt, check.message, refs);
                    break;
                case "cidr":
                    {
                        if (check.version !== "v6") {
                            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
                        }
                        if (check.version !== "v4") {
                            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
                        }
                        break;
                    }
                case "emoji":
                    addPattern(res, zodPatterns.emoji(), check.message, refs);
                    break;
                case "ulid":
                    {
                        addPattern(res, zodPatterns.ulid, check.message, refs);
                        break;
                    }
                case "base64":
                    {
                        switch(refs.base64Strategy){
                            case "format:binary":
                                {
                                    addFormat(res, "binary", check.message, refs);
                                    break;
                                }
                            case "contentEncoding:base64":
                                {
                                    res.contentEncoding = "base64";
                                    break;
                                }
                            case "pattern:zod":
                                {
                                    addPattern(res, zodPatterns.base64, check.message, refs);
                                    break;
                                }
                        }
                        break;
                    }
                case "nanoid":
                    {
                        addPattern(res, zodPatterns.nanoid, check.message, refs);
                    }
                case "toLowerCase":
                case "toUpperCase":
                case "trim":
                    break;
                default:
                    /* @__PURE__ */ ((_)=>{})(check);
            }
        }
    }
    return res;
}
function escapeLiteralCheckValue(literal, refs) {
    return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
var ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
    let result = "";
    for(let i = 0; i < source.length; i++){
        if (!ALPHA_NUMERIC.has(source[i])) {
            result += "\\";
        }
        result += source[i];
    }
    return result;
}
function addFormat(schema, value, message, refs) {
    var _a2;
    if (schema.format || ((_a2 = schema.anyOf) == null ? void 0 : _a2.some((x)=>x.format))) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
        if (schema.format) {
            schema.anyOf.push({
                format: schema.format
            });
            delete schema.format;
        }
        schema.anyOf.push({
            format: value,
            ...message && refs.errorMessages && {
                errorMessage: {
                    format: message
                }
            }
        });
    } else {
        schema.format = value;
    }
}
function addPattern(schema, regex, message, refs) {
    var _a2;
    if (schema.pattern || ((_a2 = schema.allOf) == null ? void 0 : _a2.some((x)=>x.pattern))) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
        if (schema.pattern) {
            schema.allOf.push({
                pattern: schema.pattern
            });
            delete schema.pattern;
        }
        schema.allOf.push({
            pattern: stringifyRegExpWithFlags(regex, refs),
            ...message && refs.errorMessages && {
                errorMessage: {
                    pattern: message
                }
            }
        });
    } else {
        schema.pattern = stringifyRegExpWithFlags(regex, refs);
    }
}
function stringifyRegExpWithFlags(regex, refs) {
    var _a2;
    if (!refs.applyRegexFlags || !regex.flags) {
        return regex.source;
    }
    const flags = {
        i: regex.flags.includes("i"),
        // Case-insensitive
        m: regex.flags.includes("m"),
        // `^` and `$` matches adjacent to newline characters
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
                    } else if (source[i + 1] === "-" && ((_a2 = source[i + 2]) == null ? void 0 : _a2.match(/[a-z]/))) {
                        pattern += source[i];
                        inCharRange = true;
                    } else {
                        pattern += `${source[i]}${source[i].toUpperCase()}`;
                    }
                    continue;
                }
            } else if (source[i].match(/[a-z]/)) {
                pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                continue;
            }
        }
        if (flags.m) {
            if (source[i] === "^") {
                pattern += `(^|(?<=[\r
]))`;
                continue;
            } else if (source[i] === "$") {
                pattern += `($|(?=[\r
]))`;
                continue;
            }
        }
        if (flags.s && source[i] === ".") {
            pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
            continue;
        }
        pattern += source[i];
        if (source[i] === "\\") {
            isEscaped = true;
        } else if (inCharGroup && source[i] === "]") {
            inCharGroup = false;
        } else if (!inCharGroup && source[i] === "[") {
            inCharGroup = true;
        }
    }
    try {
        new RegExp(pattern);
    } catch (e) {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
}
// src/to-json-schema/zod3-to-json-schema/parsers/record.ts
function parseRecordDef(def, refs) {
    var _a2, _b2, _c, _d, _e, _f;
    const schema = {
        type: "object",
        additionalProperties: (_a2 = parseDef(def.valueType._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalProperties"
            ]
        })) != null ? _a2 : refs.allowedAdditionalProperties
    };
    if (((_b2 = def.keyType) == null ? void 0 : _b2._def.typeName) === import_v32.ZodFirstPartyTypeKind.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
        const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === import_v32.ZodFirstPartyTypeKind.ZodEnum) {
        return {
            ...schema,
            propertyNames: {
                enum: def.keyType._def.values
            }
        };
    } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === import_v32.ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === import_v32.ZodFirstPartyTypeKind.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
        const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType
        };
    }
    return schema;
}
// src/to-json-schema/zod3-to-json-schema/parsers/map.ts
function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") {
        return parseRecordDef(def, refs);
    }
    const keys = parseDef(def.keyType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "0"
        ]
    }) || parseAnyDef();
    const values = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "items",
            "items",
            "1"
        ]
    }) || parseAnyDef();
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
// src/to-json-schema/zod3-to-json-schema/parsers/native-enum.ts
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
// src/to-json-schema/zod3-to-json-schema/parsers/never.ts
function parseNeverDef() {
    return {
        not: parseAnyDef()
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/null.ts
function parseNullDef() {
    return {
        type: "null"
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/union.ts
var primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null"
};
function parseUnionDef(def, refs) {
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    if (options.every((x)=>x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
        const types = options.reduce((types2, x)=>{
            const type = primitiveMappings[x._def.typeName];
            return type && !types2.includes(type) ? [
                ...types2,
                type
            ] : types2;
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
    } else if (options.every((x)=>x._def.typeName === "ZodEnum")) {
        return {
            type: "string",
            enum: options.reduce((acc, x)=>[
                    ...acc,
                    ...x._def.values.filter((x2)=>!acc.includes(x2))
                ], [])
        };
    }
    return asAnyOf(def, refs);
}
var asAnyOf = (def, refs)=>{
    const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i)=>parseDef(x._def, {
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
// src/to-json-schema/zod3-to-json-schema/parsers/nullable.ts
function parseNullableDef(def, refs) {
    if ([
        "ZodString",
        "ZodNumber",
        "ZodBigInt",
        "ZodBoolean",
        "ZodNull"
    ].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        return {
            type: [
                primitiveMappings[def.innerType._def.typeName],
                "null"
            ]
        };
    }
    const base = parseDef(def.innerType._def, {
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
// src/to-json-schema/zod3-to-json-schema/parsers/number.ts
function parseNumberDef(def) {
    const res = {
        type: "number"
    };
    if (!def.checks) return res;
    for (const check of def.checks){
        switch(check.kind){
            case "int":
                res.type = "integer";
                break;
            case "min":
                if (check.inclusive) {
                    res.minimum = check.value;
                } else {
                    res.exclusiveMinimum = check.value;
                }
                break;
            case "max":
                if (check.inclusive) {
                    res.maximum = check.value;
                } else {
                    res.exclusiveMaximum = check.value;
                }
                break;
            case "multipleOf":
                res.multipleOf = check.value;
                break;
        }
    }
    return res;
}
// src/to-json-schema/zod3-to-json-schema/parsers/object.ts
function parseObjectDef(def, refs) {
    const result = {
        type: "object",
        properties: {}
    };
    const required = [];
    const shape = def.shape();
    for(const propName in shape){
        let propDef = shape[propName];
        if (propDef === void 0 || propDef._def === void 0) {
            continue;
        }
        const propOptional = safeIsOptional(propDef);
        const parsedDef = parseDef(propDef._def, {
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
        if (parsedDef === void 0) {
            continue;
        }
        result.properties[propName] = parsedDef;
        if (!propOptional) {
            required.push(propName);
        }
    }
    if (required.length) {
        result.required = required;
    }
    const additionalProperties = decideAdditionalProperties(def, refs);
    if (additionalProperties !== void 0) {
        result.additionalProperties = additionalProperties;
    }
    return result;
}
function decideAdditionalProperties(def, refs) {
    if (def.catchall._def.typeName !== "ZodNever") {
        return parseDef(def.catchall._def, {
            ...refs,
            currentPath: [
                ...refs.currentPath,
                "additionalProperties"
            ]
        });
    }
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
    } catch (e) {
        return true;
    }
}
// src/to-json-schema/zod3-to-json-schema/parsers/optional.ts
var parseOptionalDef = (def, refs)=>{
    var _a2;
    if (refs.currentPath.toString() === ((_a2 = refs.propertyPath) == null ? void 0 : _a2.toString())) {
        return parseDef(def.innerType._def, refs);
    }
    const innerSchema = parseDef(def.innerType._def, {
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
                not: parseAnyDef()
            },
            innerSchema
        ]
    } : parseAnyDef();
};
// src/to-json-schema/zod3-to-json-schema/parsers/pipeline.ts
var parsePipelineDef = (def, refs)=>{
    if (refs.pipeStrategy === "input") {
        return parseDef(def.in._def, refs);
    } else if (refs.pipeStrategy === "output") {
        return parseDef(def.out._def, refs);
    }
    const a = parseDef(def.in._def, {
        ...refs,
        currentPath: [
            ...refs.currentPath,
            "allOf",
            "0"
        ]
    });
    const b = parseDef(def.out._def, {
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
// src/to-json-schema/zod3-to-json-schema/parsers/promise.ts
function parsePromiseDef(def, refs) {
    return parseDef(def.type._def, refs);
}
// src/to-json-schema/zod3-to-json-schema/parsers/set.ts
function parseSetDef(def, refs) {
    const items = parseDef(def.valueType._def, {
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
    if (def.minSize) {
        schema.minItems = def.minSize.value;
    }
    if (def.maxSize) {
        schema.maxItems = def.maxSize.value;
    }
    return schema;
}
// src/to-json-schema/zod3-to-json-schema/parsers/tuple.ts
function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items.map((x, i)=>parseDef(x._def, {
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
            additionalItems: parseDef(def.rest._def, {
                ...refs,
                currentPath: [
                    ...refs.currentPath,
                    "additionalItems"
                ]
            })
        };
    } else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items.map((x, i)=>parseDef(x._def, {
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
}
// src/to-json-schema/zod3-to-json-schema/parsers/undefined.ts
function parseUndefinedDef() {
    return {
        not: parseAnyDef()
    };
}
// src/to-json-schema/zod3-to-json-schema/parsers/unknown.ts
function parseUnknownDef() {
    return parseAnyDef();
}
// src/to-json-schema/zod3-to-json-schema/parsers/readonly.ts
var parseReadonlyDef = (def, refs)=>{
    return parseDef(def.innerType._def, refs);
};
// src/to-json-schema/zod3-to-json-schema/select-parser.ts
var selectParser = (def, typeName, refs)=>{
    switch(typeName){
        case import_v33.ZodFirstPartyTypeKind.ZodString:
            return parseStringDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodNumber:
            return parseNumberDef(def);
        case import_v33.ZodFirstPartyTypeKind.ZodObject:
            return parseObjectDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodBigInt:
            return parseBigintDef(def);
        case import_v33.ZodFirstPartyTypeKind.ZodBoolean:
            return parseBooleanDef();
        case import_v33.ZodFirstPartyTypeKind.ZodDate:
            return parseDateDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodUndefined:
            return parseUndefinedDef();
        case import_v33.ZodFirstPartyTypeKind.ZodNull:
            return parseNullDef();
        case import_v33.ZodFirstPartyTypeKind.ZodArray:
            return parseArrayDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodUnion:
        case import_v33.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return parseUnionDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodIntersection:
            return parseIntersectionDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodTuple:
            return parseTupleDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodRecord:
            return parseRecordDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodLiteral:
            return parseLiteralDef(def);
        case import_v33.ZodFirstPartyTypeKind.ZodEnum:
            return parseEnumDef(def);
        case import_v33.ZodFirstPartyTypeKind.ZodNativeEnum:
            return parseNativeEnumDef(def);
        case import_v33.ZodFirstPartyTypeKind.ZodNullable:
            return parseNullableDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodOptional:
            return parseOptionalDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodMap:
            return parseMapDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodSet:
            return parseSetDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodLazy:
            return ()=>def.getter()._def;
        case import_v33.ZodFirstPartyTypeKind.ZodPromise:
            return parsePromiseDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodNaN:
        case import_v33.ZodFirstPartyTypeKind.ZodNever:
            return parseNeverDef();
        case import_v33.ZodFirstPartyTypeKind.ZodEffects:
            return parseEffectsDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodAny:
            return parseAnyDef();
        case import_v33.ZodFirstPartyTypeKind.ZodUnknown:
            return parseUnknownDef();
        case import_v33.ZodFirstPartyTypeKind.ZodDefault:
            return parseDefaultDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodBranded:
            return parseBrandedDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodReadonly:
            return parseReadonlyDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodCatch:
            return parseCatchDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodPipeline:
            return parsePipelineDef(def, refs);
        case import_v33.ZodFirstPartyTypeKind.ZodFunction:
        case import_v33.ZodFirstPartyTypeKind.ZodVoid:
        case import_v33.ZodFirstPartyTypeKind.ZodSymbol:
            return void 0;
        default:
            return /* @__PURE__ */ ((_)=>void 0)(typeName);
    }
};
// src/to-json-schema/zod3-to-json-schema/get-relative-path.ts
var getRelativePath = (pathA, pathB)=>{
    let i = 0;
    for(; i < pathA.length && i < pathB.length; i++){
        if (pathA[i] !== pathB[i]) break;
    }
    return [
        (pathA.length - i).toString(),
        ...pathB.slice(i)
    ].join("/");
};
// src/to-json-schema/zod3-to-json-schema/parse-def.ts
function parseDef(def, refs, forceResolution = false) {
    var _a2;
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = (_a2 = refs.override) == null ? void 0 : _a2.call(refs, def, refs, seenItem, forceResolution);
        if (overrideResult !== ignoreOverride) {
            return overrideResult;
        }
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== void 0) {
            return seenSchema;
        }
    }
    const newItem = {
        def,
        path: refs.currentPath,
        jsonSchema: void 0
    };
    refs.seen.set(def, newItem);
    const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
    const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
    if (jsonSchema2) {
        addMeta(def, refs, jsonSchema2);
    }
    if (refs.postProcess) {
        const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
        newItem.jsonSchema = jsonSchema2;
        return postProcessResult;
    }
    newItem.jsonSchema = jsonSchema2;
    return jsonSchema2;
}
var get$ref = (item, refs)=>{
    switch(refs.$refStrategy){
        case "root":
            return {
                $ref: item.path.join("/")
            };
        case "relative":
            return {
                $ref: getRelativePath(refs.currentPath, item.path)
            };
        case "none":
        case "seen":
            {
                if (item.path.length < refs.currentPath.length && item.path.every((value, index)=>refs.currentPath[index] === value)) {
                    console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                    return parseAnyDef();
                }
                return refs.$refStrategy === "seen" ? parseAnyDef() : void 0;
            }
    }
};
var addMeta = (def, refs, jsonSchema2)=>{
    if (def.description) {
        jsonSchema2.description = def.description;
    }
    return jsonSchema2;
};
// src/to-json-schema/zod3-to-json-schema/refs.ts
var getRefs = (options)=>{
    const _options = getDefaultOptions(options);
    const currentPath = _options.name !== void 0 ? [
        ..._options.basePath,
        _options.definitionPath,
        _options.name
    ] : _options.basePath;
    return {
        ..._options,
        currentPath,
        propertyPath: void 0,
        seen: new Map(Object.entries(_options.definitions).map(([name2, def])=>[
                def._def,
                {
                    def: def._def,
                    path: [
                        ..._options.basePath,
                        _options.definitionPath,
                        name2
                    ],
                    // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                    jsonSchema: void 0
                }
            ]))
    };
};
// src/to-json-schema/zod3-to-json-schema/zod3-to-json-schema.ts
var zod3ToJsonSchema = (schema, options)=>{
    var _a2;
    const refs = getRefs(options);
    let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name3, schema2])=>{
        var _a3;
        return {
            ...acc,
            [name3]: (_a3 = parseDef(schema2._def, {
                ...refs,
                currentPath: [
                    ...refs.basePath,
                    refs.definitionPath,
                    name3
                ]
            }, true)) != null ? _a3 : parseAnyDef()
        };
    }, {}) : void 0;
    const name2 = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
    const main = (_a2 = parseDef(schema._def, name2 === void 0 ? refs : {
        ...refs,
        currentPath: [
            ...refs.basePath,
            refs.definitionPath,
            name2
        ]
    }, false)) != null ? _a2 : parseAnyDef();
    const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
    if (title !== void 0) {
        main.title = title;
    }
    const combined = name2 === void 0 ? definitions ? {
        ...main,
        [refs.definitionPath]: definitions
    } : main : {
        $ref: [
            ...refs.$refStrategy === "relative" ? [] : refs.basePath,
            refs.definitionPath,
            name2
        ].join("/"),
        [refs.definitionPath]: {
            ...definitions,
            [name2]: main
        }
    };
    combined.$schema = "http://json-schema.org/draft-07/schema#";
    return combined;
};
// src/schema.ts
var schemaSymbol = Symbol.for("vercel.ai.schema");
function lazySchema(createSchema) {
    let schema;
    return ()=>{
        if (schema == null) {
            schema = createSchema();
        }
        return schema;
    };
}
function jsonSchema(jsonSchema2, { validate } = {}) {
    return {
        [schemaSymbol]: true,
        _type: void 0,
        // should never be used directly
        get jsonSchema () {
            if (typeof jsonSchema2 === "function") {
                jsonSchema2 = jsonSchema2();
            }
            return jsonSchema2;
        },
        validate
    };
}
function isSchema(value) {
    return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
function asSchema(schema) {
    return schema == null ? jsonSchema({
        properties: {},
        additionalProperties: false
    }) : isSchema(schema) ? schema : "~standard" in schema ? schema["~standard"].vendor === "zod" ? zodSchema(schema) : standardSchema(schema) : schema();
}
function standardSchema(standardSchema2) {
    return jsonSchema(()=>addAdditionalPropertiesToJsonSchema(standardSchema2["~standard"].jsonSchema.input({
            target: "draft-07"
        })), {
        validate: async (value)=>{
            const result = await standardSchema2["~standard"].validate(value);
            return "value" in result ? {
                success: true,
                value: result.value
            } : {
                success: false,
                error: new import_provider7.TypeValidationError({
                    value,
                    cause: result.issues
                })
            };
        }
    });
}
function zod3Schema(zodSchema2, options) {
    var _a2;
    const useReferences = (_a2 = options == null ? void 0 : options.useReferences) != null ? _a2 : false;
    return jsonSchema(// defer json schema creation to avoid unnecessary computation when only validation is needed
    ()=>zod3ToJsonSchema(zodSchema2, {
            $refStrategy: useReferences ? "root" : "none"
        }), {
        validate: async (value)=>{
            const result = await zodSchema2.safeParseAsync(value);
            return result.success ? {
                success: true,
                value: result.data
            } : {
                success: false,
                error: result.error
            };
        }
    });
}
function zod4Schema(zodSchema2, options) {
    var _a2;
    const useReferences = (_a2 = options == null ? void 0 : options.useReferences) != null ? _a2 : false;
    return jsonSchema(// defer json schema creation to avoid unnecessary computation when only validation is needed
    ()=>addAdditionalPropertiesToJsonSchema(z4.toJSONSchema(zodSchema2, {
            target: "draft-7",
            io: "input",
            reused: useReferences ? "ref" : "inline"
        })), {
        validate: async (value)=>{
            const result = await z4.safeParseAsync(zodSchema2, value);
            return result.success ? {
                success: true,
                value: result.data
            } : {
                success: false,
                error: result.error
            };
        }
    });
}
function isZod4Schema(zodSchema2) {
    return "_zod" in zodSchema2;
}
function zodSchema(zodSchema2, options) {
    if (isZod4Schema(zodSchema2)) {
        return zod4Schema(zodSchema2, options);
    } else {
        return zod3Schema(zodSchema2, options);
    }
}
// src/validate-types.ts
async function validateTypes({ value, schema, context }) {
    const result = await safeValidateTypes({
        value,
        schema,
        context
    });
    if (!result.success) {
        throw import_provider8.TypeValidationError.wrap({
            value,
            cause: result.error,
            context
        });
    }
    return result.value;
}
async function safeValidateTypes({ value, schema, context }) {
    const actualSchema = asSchema(schema);
    try {
        if (actualSchema.validate == null) {
            return {
                success: true,
                value,
                rawValue: value
            };
        }
        const result = await actualSchema.validate(value);
        if (result.success) {
            return {
                success: true,
                value: result.value,
                rawValue: value
            };
        }
        return {
            success: false,
            error: import_provider8.TypeValidationError.wrap({
                value,
                cause: result.error,
                context
            }),
            rawValue: value
        };
    } catch (error) {
        return {
            success: false,
            error: import_provider8.TypeValidationError.wrap({
                value,
                cause: error,
                context
            }),
            rawValue: value
        };
    }
}
// src/parse-json.ts
async function parseJSON({ text, schema }) {
    try {
        const value = secureJsonParse(text);
        if (schema == null) {
            return value;
        }
        return validateTypes({
            value,
            schema
        });
    } catch (error) {
        if (import_provider9.JSONParseError.isInstance(error) || import_provider9.TypeValidationError.isInstance(error)) {
            throw error;
        }
        throw new import_provider9.JSONParseError({
            text,
            cause: error
        });
    }
}
async function safeParseJSON({ text, schema }) {
    try {
        const value = secureJsonParse(text);
        if (schema == null) {
            return {
                success: true,
                value,
                rawValue: value
            };
        }
        return await safeValidateTypes({
            value,
            schema
        });
    } catch (error) {
        return {
            success: false,
            error: import_provider9.JSONParseError.isInstance(error) ? error : new import_provider9.JSONParseError({
                text,
                cause: error
            }),
            rawValue: void 0
        };
    }
}
function isParsableJson(input) {
    try {
        secureJsonParse(input);
        return true;
    } catch (e) {
        return false;
    }
}
// src/parse-json-event-stream.ts
var import_stream = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/eventsource-parser/dist/stream.cjs [app-route] (ecmascript)");
function parseJsonEventStream({ stream, schema }) {
    return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new import_stream.EventSourceParserStream()).pipeThrough(new TransformStream({
        async transform ({ data }, controller) {
            if (data === "[DONE]") {
                return;
            }
            controller.enqueue(await safeParseJSON({
                text: data,
                schema
            }));
        }
    }));
}
// src/parse-provider-options.ts
var import_provider10 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
async function parseProviderOptions({ provider, providerOptions, schema }) {
    if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
        return void 0;
    }
    const parsedProviderOptions = await safeValidateTypes({
        value: providerOptions[provider],
        schema
    });
    if (!parsedProviderOptions.success) {
        throw new import_provider10.InvalidArgumentError({
            argument: "providerOptions",
            message: `invalid ${provider} provider options`,
            cause: parsedProviderOptions.error
        });
    }
    return parsedProviderOptions.value;
}
// src/post-to-api.ts
var import_provider11 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
var getOriginalFetch2 = ()=>globalThis.fetch;
var postJsonToApi = async ({ url, headers, body, failedResponseHandler, successfulResponseHandler, abortSignal, fetch: fetch2 })=>postToApi({
        url,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: {
            content: JSON.stringify(body),
            values: body
        },
        failedResponseHandler,
        successfulResponseHandler,
        abortSignal,
        fetch: fetch2
    });
var postFormDataToApi = async ({ url, headers, formData, failedResponseHandler, successfulResponseHandler, abortSignal, fetch: fetch2 })=>postToApi({
        url,
        headers,
        body: {
            content: formData,
            values: Object.fromEntries(formData.entries())
        },
        failedResponseHandler,
        successfulResponseHandler,
        abortSignal,
        fetch: fetch2
    });
var postToApi = async ({ url, headers = {}, body, successfulResponseHandler, failedResponseHandler, abortSignal, fetch: fetch2 = getOriginalFetch2() })=>{
    try {
        const response = await fetch2(url, {
            method: "POST",
            headers: withUserAgentSuffix(headers, `ai-sdk/provider-utils/${VERSION}`, getRuntimeEnvironmentUserAgent()),
            body: body.content,
            signal: abortSignal
        });
        const responseHeaders = extractResponseHeaders(response);
        if (!response.ok) {
            let errorInformation;
            try {
                errorInformation = await failedResponseHandler({
                    response,
                    url,
                    requestBodyValues: body.values
                });
            } catch (error) {
                if (isAbortError(error) || import_provider11.APICallError.isInstance(error)) {
                    throw error;
                }
                throw new import_provider11.APICallError({
                    message: "Failed to process error response",
                    cause: error,
                    statusCode: response.status,
                    url,
                    responseHeaders,
                    requestBodyValues: body.values
                });
            }
            throw errorInformation.value;
        }
        try {
            return await successfulResponseHandler({
                response,
                url,
                requestBodyValues: body.values
            });
        } catch (error) {
            if (error instanceof Error) {
                if (isAbortError(error) || import_provider11.APICallError.isInstance(error)) {
                    throw error;
                }
            }
            throw new import_provider11.APICallError({
                message: "Failed to process successful response",
                cause: error,
                statusCode: response.status,
                url,
                responseHeaders,
                requestBodyValues: body.values
            });
        }
    } catch (error) {
        throw handleFetchError({
            error,
            url,
            requestBodyValues: body.values
        });
    }
};
// src/types/tool.ts
function tool(tool2) {
    return tool2;
}
function dynamicTool(tool2) {
    return {
        ...tool2,
        type: "dynamic"
    };
}
// src/provider-tool-factory.ts
function createProviderToolFactory({ id, inputSchema }) {
    return ({ execute, outputSchema, needsApproval, toModelOutput, onInputStart, onInputDelta, onInputAvailable, ...args })=>tool({
            type: "provider",
            id,
            args,
            inputSchema,
            outputSchema,
            execute,
            needsApproval,
            toModelOutput,
            onInputStart,
            onInputDelta,
            onInputAvailable
        });
}
function createProviderToolFactoryWithOutputSchema({ id, inputSchema, outputSchema, supportsDeferredResults }) {
    return ({ execute, needsApproval, toModelOutput, onInputStart, onInputDelta, onInputAvailable, ...args })=>tool({
            type: "provider",
            id,
            args,
            inputSchema,
            outputSchema,
            execute,
            needsApproval,
            toModelOutput,
            onInputStart,
            onInputDelta,
            onInputAvailable,
            supportsDeferredResults
        });
}
// src/remove-undefined-entries.ts
function removeUndefinedEntries(record) {
    return Object.fromEntries(Object.entries(record).filter(([_key, value])=>value != null));
}
// src/resolve.ts
async function resolve(value) {
    if (typeof value === "function") {
        value = value();
    }
    return Promise.resolve(value);
}
// src/response-handler.ts
var import_provider12 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
var createJsonErrorResponseHandler = ({ errorSchema, errorToMessage, isRetryable })=>async ({ response, url, requestBodyValues })=>{
        const responseBody = await response.text();
        const responseHeaders = extractResponseHeaders(response);
        if (responseBody.trim() === "") {
            return {
                responseHeaders,
                value: new import_provider12.APICallError({
                    message: response.statusText,
                    url,
                    requestBodyValues,
                    statusCode: response.status,
                    responseHeaders,
                    responseBody,
                    isRetryable: isRetryable == null ? void 0 : isRetryable(response)
                })
            };
        }
        try {
            const parsedError = await parseJSON({
                text: responseBody,
                schema: errorSchema
            });
            return {
                responseHeaders,
                value: new import_provider12.APICallError({
                    message: errorToMessage(parsedError),
                    url,
                    requestBodyValues,
                    statusCode: response.status,
                    responseHeaders,
                    responseBody,
                    data: parsedError,
                    isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
                })
            };
        } catch (parseError) {
            return {
                responseHeaders,
                value: new import_provider12.APICallError({
                    message: response.statusText,
                    url,
                    requestBodyValues,
                    statusCode: response.status,
                    responseHeaders,
                    responseBody,
                    isRetryable: isRetryable == null ? void 0 : isRetryable(response)
                })
            };
        }
    };
var createEventSourceResponseHandler = (chunkSchema)=>async ({ response })=>{
        const responseHeaders = extractResponseHeaders(response);
        if (response.body == null) {
            throw new import_provider12.EmptyResponseBodyError({});
        }
        return {
            responseHeaders,
            value: parseJsonEventStream({
                stream: response.body,
                schema: chunkSchema
            })
        };
    };
var createJsonResponseHandler = (responseSchema)=>async ({ response, url, requestBodyValues })=>{
        const responseBody = await response.text();
        const parsedResult = await safeParseJSON({
            text: responseBody,
            schema: responseSchema
        });
        const responseHeaders = extractResponseHeaders(response);
        if (!parsedResult.success) {
            throw new import_provider12.APICallError({
                message: "Invalid JSON response",
                cause: parsedResult.error,
                statusCode: response.status,
                responseHeaders,
                responseBody,
                url,
                requestBodyValues
            });
        }
        return {
            responseHeaders,
            value: parsedResult.value,
            rawValue: parsedResult.rawValue
        };
    };
var createBinaryResponseHandler = ()=>async ({ response, url, requestBodyValues })=>{
        const responseHeaders = extractResponseHeaders(response);
        if (!response.body) {
            throw new import_provider12.APICallError({
                message: "Response body is empty",
                url,
                requestBodyValues,
                statusCode: response.status,
                responseHeaders,
                responseBody: void 0
            });
        }
        try {
            const buffer = await response.arrayBuffer();
            return {
                responseHeaders,
                value: new Uint8Array(buffer)
            };
        } catch (error) {
            throw new import_provider12.APICallError({
                message: "Failed to read response as array buffer",
                url,
                requestBodyValues,
                statusCode: response.status,
                responseHeaders,
                responseBody: void 0,
                cause: error
            });
        }
    };
var createStatusCodeErrorResponseHandler = ()=>async ({ response, url, requestBodyValues })=>{
        const responseHeaders = extractResponseHeaders(response);
        const responseBody = await response.text();
        return {
            responseHeaders,
            value: new import_provider12.APICallError({
                message: response.statusText,
                url,
                requestBodyValues,
                statusCode: response.status,
                responseHeaders,
                responseBody
            })
        };
    };
// src/without-trailing-slash.ts
function withoutTrailingSlash(url) {
    return url == null ? void 0 : url.replace(/\/$/, "");
}
// src/is-async-iterable.ts
function isAsyncIterable(obj) {
    return obj != null && typeof obj[Symbol.asyncIterator] === "function";
}
// src/types/execute-tool.ts
async function* executeTool({ execute, input, options }) {
    const result = execute(input, options);
    if (isAsyncIterable(result)) {
        let lastOutput;
        for await (const output of result){
            lastOutput = output;
            yield {
                type: "preliminary",
                output
            };
        }
        yield {
            type: "final",
            output: lastOutput
        };
    } else {
        yield {
            type: "final",
            output: await result
        };
    }
}
// src/index.ts
var import_stream2 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/eventsource-parser/dist/stream.cjs [app-route] (ecmascript)");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    DelayedPromise,
    DownloadError,
    EventSourceParserStream,
    VERSION,
    asSchema,
    combineHeaders,
    convertAsyncIteratorToReadableStream,
    convertBase64ToUint8Array,
    convertImageModelFileToDataUri,
    convertToBase64,
    convertToFormData,
    convertUint8ArrayToBase64,
    createBinaryResponseHandler,
    createEventSourceResponseHandler,
    createIdGenerator,
    createJsonErrorResponseHandler,
    createJsonResponseHandler,
    createProviderToolFactory,
    createProviderToolFactoryWithOutputSchema,
    createStatusCodeErrorResponseHandler,
    createToolNameMapping,
    delay,
    downloadBlob,
    dynamicTool,
    executeTool,
    extractResponseHeaders,
    generateId,
    getErrorMessage,
    getFromApi,
    getRuntimeEnvironmentUserAgent,
    injectJsonInstructionIntoMessages,
    isAbortError,
    isNonNullable,
    isParsableJson,
    isUrlSupported,
    jsonSchema,
    lazySchema,
    loadApiKey,
    loadOptionalSetting,
    loadSetting,
    mediaTypeToExtension,
    normalizeHeaders,
    parseJSON,
    parseJsonEventStream,
    parseProviderOptions,
    postFormDataToApi,
    postJsonToApi,
    postToApi,
    removeUndefinedEntries,
    resolve,
    safeParseJSON,
    safeValidateTypes,
    tool,
    validateTypes,
    withUserAgentSuffix,
    withoutTrailingSlash,
    zodSchema
}); //# sourceMappingURL=index.js.map
}),
"[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/get-context.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
var get_context_exports = {};
__export(get_context_exports, {
    SYMBOL_FOR_REQ_CONTEXT: ()=>SYMBOL_FOR_REQ_CONTEXT,
    getContext: ()=>getContext
});
module.exports = __toCommonJS(get_context_exports);
const SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
function getContext() {
    const fromSymbol = globalThis;
    return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    SYMBOL_FOR_REQ_CONTEXT,
    getContext
});
}),
"[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/token-error.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
var token_error_exports = {};
__export(token_error_exports, {
    VercelOidcTokenError: ()=>VercelOidcTokenError
});
module.exports = __toCommonJS(token_error_exports);
class VercelOidcTokenError extends Error {
    constructor(message, cause){
        super(message);
        this.name = "VercelOidcTokenError";
        this.cause = cause;
    }
    toString() {
        if (this.cause) {
            return `${this.name}: ${this.message}: ${this.cause}`;
        }
        return `${this.name}: ${this.message}`;
    }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    VercelOidcTokenError
});
}),
"[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

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
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
var get_vercel_oidc_token_exports = {};
__export(get_vercel_oidc_token_exports, {
    getVercelOidcToken: ()=>getVercelOidcToken,
    getVercelOidcTokenSync: ()=>getVercelOidcTokenSync
});
module.exports = __toCommonJS(get_vercel_oidc_token_exports);
var import_get_context = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/get-context.js [app-route] (ecmascript)");
var import_token_error = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/token-error.js [app-route] (ecmascript)");
async function getVercelOidcToken() {
    let token = "";
    let err;
    try {
        token = getVercelOidcTokenSync();
    } catch (error) {
        err = error;
    }
    try {
        const [{ getTokenPayload, isExpired }, { refreshToken }] = await Promise.all([
            await __turbopack_context__.A("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/token-util.js [app-route] (ecmascript, async loader)"),
            await __turbopack_context__.A("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/token.js [app-route] (ecmascript, async loader)")
        ]);
        if (!token || isExpired(getTokenPayload(token))) {
            await refreshToken();
            token = getVercelOidcTokenSync();
        }
    } catch (error) {
        let message = err instanceof Error ? err.message : "";
        if (error instanceof Error) {
            message = `${message}
${error.message}`;
        }
        if (message) {
            throw new import_token_error.VercelOidcTokenError(message);
        }
        throw error;
    }
    return token;
}
function getVercelOidcTokenSync() {
    const token = (0, import_get_context.getContext)().headers?.["x-vercel-oidc-token"] ?? process.env.VERCEL_OIDC_TOKEN;
    if (!token) {
        throw new Error(`The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?`);
    }
    return token;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    getVercelOidcToken,
    getVercelOidcTokenSync
});
}),
"[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
var src_exports = {};
__export(src_exports, {
    getContext: ()=>import_get_context.getContext,
    getVercelOidcToken: ()=>import_get_vercel_oidc_token.getVercelOidcToken,
    getVercelOidcTokenSync: ()=>import_get_vercel_oidc_token.getVercelOidcTokenSync
});
module.exports = __toCommonJS(src_exports);
var import_get_vercel_oidc_token = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js [app-route] (ecmascript)");
var import_get_context = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/get-context.js [app-route] (ecmascript)");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    getContext,
    getVercelOidcToken,
    getVercelOidcTokenSync
});
}),
"[project]/projects/tartanhacks/node_modules/@ai-sdk/gateway/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name7 in all)__defProp(target, name7, {
        get: all[name7],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    GatewayAuthenticationError: ()=>GatewayAuthenticationError,
    GatewayError: ()=>GatewayError,
    GatewayInternalServerError: ()=>GatewayInternalServerError,
    GatewayInvalidRequestError: ()=>GatewayInvalidRequestError,
    GatewayModelNotFoundError: ()=>GatewayModelNotFoundError,
    GatewayRateLimitError: ()=>GatewayRateLimitError,
    GatewayResponseError: ()=>GatewayResponseError,
    createGateway: ()=>createGatewayProvider,
    createGatewayProvider: ()=>createGatewayProvider,
    gateway: ()=>gateway
});
module.exports = __toCommonJS(src_exports);
// src/gateway-provider.ts
var import_provider_utils11 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
// src/errors/as-gateway-error.ts
var import_provider = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider/dist/index.js [app-route] (ecmascript)");
// src/errors/create-gateway-error.ts
var import_v42 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
// src/errors/gateway-error.ts
var marker = "vercel.ai.gateway.error";
var symbol = Symbol.for(marker);
var _a, _b;
var GatewayError = class _GatewayError extends (_b = Error, _a = symbol, _b) {
    constructor({ message, statusCode = 500, cause, generationId }){
        super(generationId ? `${message} [${generationId}]` : message);
        this[_a] = true;
        this.statusCode = statusCode;
        this.cause = cause;
        this.generationId = generationId;
    }
    /**
   * Checks if the given error is a Gateway Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is a Gateway Error, false otherwise.
   */ static isInstance(error) {
        return _GatewayError.hasMarker(error);
    }
    static hasMarker(error) {
        return typeof error === "object" && error !== null && symbol in error && error[symbol] === true;
    }
};
// src/errors/gateway-authentication-error.ts
var name = "GatewayAuthenticationError";
var marker2 = `vercel.ai.gateway.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2, _b2;
var GatewayAuthenticationError = class _GatewayAuthenticationError extends (_b2 = GatewayError, _a2 = symbol2, _b2) {
    constructor({ message = "Authentication failed", statusCode = 401, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a2] = true;
        // used in isInstance
        this.name = name;
        this.type = "authentication_error";
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol2 in error;
    }
    /**
   * Creates a contextual error message when authentication fails
   */ static createContextualError({ apiKeyProvided, oidcTokenProvided, message = "Authentication failed", statusCode = 401, cause, generationId }) {
        let contextualMessage;
        if (apiKeyProvided) {
            contextualMessage = `AI Gateway authentication failed: Invalid API key.

Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys

Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.`;
        } else if (oidcTokenProvided) {
            contextualMessage = `AI Gateway authentication failed: Invalid OIDC token.

Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.

Alternatively, use an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys`;
        } else {
            contextualMessage = `AI Gateway authentication failed: No authentication provided.

Option 1 - API key:
Create an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.

Option 2 - OIDC token:
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`;
        }
        return new _GatewayAuthenticationError({
            message: contextualMessage,
            statusCode,
            cause,
            generationId
        });
    }
};
// src/errors/gateway-invalid-request-error.ts
var name2 = "GatewayInvalidRequestError";
var marker3 = `vercel.ai.gateway.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3, _b3;
var GatewayInvalidRequestError = class extends (_b3 = GatewayError, _a3 = symbol3, _b3) {
    constructor({ message = "Invalid request", statusCode = 400, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a3] = true;
        // used in isInstance
        this.name = name2;
        this.type = "invalid_request_error";
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol3 in error;
    }
};
// src/errors/gateway-rate-limit-error.ts
var name3 = "GatewayRateLimitError";
var marker4 = `vercel.ai.gateway.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4, _b4;
var GatewayRateLimitError = class extends (_b4 = GatewayError, _a4 = symbol4, _b4) {
    constructor({ message = "Rate limit exceeded", statusCode = 429, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a4] = true;
        // used in isInstance
        this.name = name3;
        this.type = "rate_limit_exceeded";
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol4 in error;
    }
};
// src/errors/gateway-model-not-found-error.ts
var import_v4 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var import_provider_utils = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var name4 = "GatewayModelNotFoundError";
var marker5 = `vercel.ai.gateway.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var modelNotFoundParamSchema = (0, import_provider_utils.lazySchema)(()=>(0, import_provider_utils.zodSchema)(import_v4.z.object({
        modelId: import_v4.z.string()
    })));
var _a5, _b5;
var GatewayModelNotFoundError = class extends (_b5 = GatewayError, _a5 = symbol5, _b5) {
    constructor({ message = "Model not found", statusCode = 404, modelId, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a5] = true;
        // used in isInstance
        this.name = name4;
        this.type = "model_not_found";
        this.modelId = modelId;
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol5 in error;
    }
};
// src/errors/gateway-internal-server-error.ts
var name5 = "GatewayInternalServerError";
var marker6 = `vercel.ai.gateway.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6, _b6;
var GatewayInternalServerError = class extends (_b6 = GatewayError, _a6 = symbol6, _b6) {
    constructor({ message = "Internal server error", statusCode = 500, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a6] = true;
        // used in isInstance
        this.name = name5;
        this.type = "internal_server_error";
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol6 in error;
    }
};
// src/errors/gateway-response-error.ts
var name6 = "GatewayResponseError";
var marker7 = `vercel.ai.gateway.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7, _b7;
var GatewayResponseError = class extends (_b7 = GatewayError, _a7 = symbol7, _b7) {
    constructor({ message = "Invalid response from Gateway", statusCode = 502, response, validationError, cause, generationId } = {}){
        super({
            message,
            statusCode,
            cause,
            generationId
        });
        this[_a7] = true;
        // used in isInstance
        this.name = name6;
        this.type = "response_error";
        this.response = response;
        this.validationError = validationError;
    }
    static isInstance(error) {
        return GatewayError.hasMarker(error) && symbol7 in error;
    }
};
// src/errors/create-gateway-error.ts
var import_provider_utils2 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
async function createGatewayErrorFromResponse({ response, statusCode, defaultMessage = "Gateway request failed", cause, authMethod }) {
    var _a8;
    const parseResult = await (0, import_provider_utils2.safeValidateTypes)({
        value: response,
        schema: gatewayErrorResponseSchema
    });
    if (!parseResult.success) {
        const rawGenerationId = typeof response === "object" && response !== null && "generationId" in response ? response.generationId : void 0;
        return new GatewayResponseError({
            message: `Invalid error response format: ${defaultMessage}`,
            statusCode,
            response,
            validationError: parseResult.error,
            cause,
            generationId: rawGenerationId
        });
    }
    const validatedResponse = parseResult.value;
    const errorType = validatedResponse.error.type;
    const message = validatedResponse.error.message;
    const generationId = (_a8 = validatedResponse.generationId) != null ? _a8 : void 0;
    switch(errorType){
        case "authentication_error":
            return GatewayAuthenticationError.createContextualError({
                apiKeyProvided: authMethod === "api-key",
                oidcTokenProvided: authMethod === "oidc",
                statusCode,
                cause,
                generationId
            });
        case "invalid_request_error":
            return new GatewayInvalidRequestError({
                message,
                statusCode,
                cause,
                generationId
            });
        case "rate_limit_exceeded":
            return new GatewayRateLimitError({
                message,
                statusCode,
                cause,
                generationId
            });
        case "model_not_found":
            {
                const modelResult = await (0, import_provider_utils2.safeValidateTypes)({
                    value: validatedResponse.error.param,
                    schema: modelNotFoundParamSchema
                });
                return new GatewayModelNotFoundError({
                    message,
                    statusCode,
                    modelId: modelResult.success ? modelResult.value.modelId : void 0,
                    cause,
                    generationId
                });
            }
        case "internal_server_error":
            return new GatewayInternalServerError({
                message,
                statusCode,
                cause,
                generationId
            });
        default:
            return new GatewayInternalServerError({
                message,
                statusCode,
                cause,
                generationId
            });
    }
}
var gatewayErrorResponseSchema = (0, import_provider_utils2.lazySchema)(()=>(0, import_provider_utils2.zodSchema)(import_v42.z.object({
        error: import_v42.z.object({
            message: import_v42.z.string(),
            type: import_v42.z.string().nullish(),
            param: import_v42.z.unknown().nullish(),
            code: import_v42.z.union([
                import_v42.z.string(),
                import_v42.z.number()
            ]).nullish()
        }),
        generationId: import_v42.z.string().nullish()
    })));
// src/errors/as-gateway-error.ts
function asGatewayError(error, authMethod) {
    var _a8;
    if (GatewayError.isInstance(error)) {
        return error;
    }
    if (import_provider.APICallError.isInstance(error)) {
        return createGatewayErrorFromResponse({
            response: extractApiCallResponse(error),
            statusCode: (_a8 = error.statusCode) != null ? _a8 : 500,
            defaultMessage: "Gateway request failed",
            cause: error,
            authMethod
        });
    }
    return createGatewayErrorFromResponse({
        response: {},
        statusCode: 500,
        defaultMessage: error instanceof Error ? `Gateway request failed: ${error.message}` : "Unknown Gateway error",
        cause: error,
        authMethod
    });
}
// src/errors/extract-api-call-response.ts
function extractApiCallResponse(error) {
    if (error.data !== void 0) {
        return error.data;
    }
    if (error.responseBody != null) {
        try {
            return JSON.parse(error.responseBody);
        } catch (e) {
            return error.responseBody;
        }
    }
    return {};
}
// src/errors/parse-auth-method.ts
var import_v43 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var import_provider_utils3 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var GATEWAY_AUTH_METHOD_HEADER = "ai-gateway-auth-method";
async function parseAuthMethod(headers) {
    const result = await (0, import_provider_utils3.safeValidateTypes)({
        value: headers[GATEWAY_AUTH_METHOD_HEADER],
        schema: gatewayAuthMethodSchema
    });
    return result.success ? result.value : void 0;
}
var gatewayAuthMethodSchema = (0, import_provider_utils3.lazySchema)(()=>(0, import_provider_utils3.zodSchema)(import_v43.z.union([
        import_v43.z.literal("api-key"),
        import_v43.z.literal("oidc")
    ])));
// src/gateway-fetch-metadata.ts
var import_provider_utils4 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_v44 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var GatewayFetchMetadata = class {
    constructor(config){
        this.config = config;
    }
    async getAvailableModels() {
        try {
            const { value } = await (0, import_provider_utils4.getFromApi)({
                url: `${this.config.baseURL}/config`,
                headers: await (0, import_provider_utils4.resolve)(this.config.headers()),
                successfulResponseHandler: (0, import_provider_utils4.createJsonResponseHandler)(gatewayAvailableModelsResponseSchema),
                failedResponseHandler: (0, import_provider_utils4.createJsonErrorResponseHandler)({
                    errorSchema: import_v44.z.any(),
                    errorToMessage: (data)=>data
                }),
                fetch: this.config.fetch
            });
            return value;
        } catch (error) {
            throw await asGatewayError(error);
        }
    }
    async getCredits() {
        try {
            const baseUrl = new URL(this.config.baseURL);
            const { value } = await (0, import_provider_utils4.getFromApi)({
                url: `${baseUrl.origin}/v1/credits`,
                headers: await (0, import_provider_utils4.resolve)(this.config.headers()),
                successfulResponseHandler: (0, import_provider_utils4.createJsonResponseHandler)(gatewayCreditsResponseSchema),
                failedResponseHandler: (0, import_provider_utils4.createJsonErrorResponseHandler)({
                    errorSchema: import_v44.z.any(),
                    errorToMessage: (data)=>data
                }),
                fetch: this.config.fetch
            });
            return value;
        } catch (error) {
            throw await asGatewayError(error);
        }
    }
};
var gatewayAvailableModelsResponseSchema = (0, import_provider_utils4.lazySchema)(()=>(0, import_provider_utils4.zodSchema)(import_v44.z.object({
        models: import_v44.z.array(import_v44.z.object({
            id: import_v44.z.string(),
            name: import_v44.z.string(),
            description: import_v44.z.string().nullish(),
            pricing: import_v44.z.object({
                input: import_v44.z.string(),
                output: import_v44.z.string(),
                input_cache_read: import_v44.z.string().nullish(),
                input_cache_write: import_v44.z.string().nullish()
            }).transform(({ input, output, input_cache_read, input_cache_write })=>({
                    input,
                    output,
                    ...input_cache_read ? {
                        cachedInputTokens: input_cache_read
                    } : {},
                    ...input_cache_write ? {
                        cacheCreationInputTokens: input_cache_write
                    } : {}
                })).nullish(),
            specification: import_v44.z.object({
                specificationVersion: import_v44.z.literal("v3"),
                provider: import_v44.z.string(),
                modelId: import_v44.z.string()
            }),
            modelType: import_v44.z.enum([
                "embedding",
                "image",
                "language",
                "video"
            ]).nullish()
        }))
    })));
var gatewayCreditsResponseSchema = (0, import_provider_utils4.lazySchema)(()=>(0, import_provider_utils4.zodSchema)(import_v44.z.object({
        balance: import_v44.z.string(),
        total_used: import_v44.z.string()
    }).transform(({ balance, total_used })=>({
            balance,
            totalUsed: total_used
        }))));
// src/gateway-language-model.ts
var import_provider_utils5 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_v45 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var GatewayLanguageModel = class {
    constructor(modelId, config){
        this.modelId = modelId;
        this.config = config;
        this.specificationVersion = "v3";
        this.supportedUrls = {
            "*/*": [
                /.*/
            ]
        };
    }
    get provider() {
        return this.config.provider;
    }
    async getArgs(options) {
        const { abortSignal: _abortSignal, ...optionsWithoutSignal } = options;
        return {
            args: this.maybeEncodeFileParts(optionsWithoutSignal),
            warnings: []
        };
    }
    async doGenerate(options) {
        const { args, warnings } = await this.getArgs(options);
        const { abortSignal } = options;
        const resolvedHeaders = await (0, import_provider_utils5.resolve)(this.config.headers());
        try {
            const { responseHeaders, value: responseBody, rawValue: rawResponse } = await (0, import_provider_utils5.postJsonToApi)({
                url: this.getUrl(),
                headers: (0, import_provider_utils5.combineHeaders)(resolvedHeaders, options.headers, this.getModelConfigHeaders(this.modelId, false), await (0, import_provider_utils5.resolve)(this.config.o11yHeaders)),
                body: args,
                successfulResponseHandler: (0, import_provider_utils5.createJsonResponseHandler)(import_v45.z.any()),
                failedResponseHandler: (0, import_provider_utils5.createJsonErrorResponseHandler)({
                    errorSchema: import_v45.z.any(),
                    errorToMessage: (data)=>data
                }),
                ...abortSignal && {
                    abortSignal
                },
                fetch: this.config.fetch
            });
            return {
                ...responseBody,
                request: {
                    body: args
                },
                response: {
                    headers: responseHeaders,
                    body: rawResponse
                },
                warnings
            };
        } catch (error) {
            throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
        }
    }
    async doStream(options) {
        const { args, warnings } = await this.getArgs(options);
        const { abortSignal } = options;
        const resolvedHeaders = await (0, import_provider_utils5.resolve)(this.config.headers());
        try {
            const { value: response, responseHeaders } = await (0, import_provider_utils5.postJsonToApi)({
                url: this.getUrl(),
                headers: (0, import_provider_utils5.combineHeaders)(resolvedHeaders, options.headers, this.getModelConfigHeaders(this.modelId, true), await (0, import_provider_utils5.resolve)(this.config.o11yHeaders)),
                body: args,
                successfulResponseHandler: (0, import_provider_utils5.createEventSourceResponseHandler)(import_v45.z.any()),
                failedResponseHandler: (0, import_provider_utils5.createJsonErrorResponseHandler)({
                    errorSchema: import_v45.z.any(),
                    errorToMessage: (data)=>data
                }),
                ...abortSignal && {
                    abortSignal
                },
                fetch: this.config.fetch
            });
            return {
                stream: response.pipeThrough(new TransformStream({
                    start (controller) {
                        if (warnings.length > 0) {
                            controller.enqueue({
                                type: "stream-start",
                                warnings
                            });
                        }
                    },
                    transform (chunk, controller) {
                        if (chunk.success) {
                            const streamPart = chunk.value;
                            if (streamPart.type === "raw" && !options.includeRawChunks) {
                                return;
                            }
                            if (streamPart.type === "response-metadata" && streamPart.timestamp && typeof streamPart.timestamp === "string") {
                                streamPart.timestamp = new Date(streamPart.timestamp);
                            }
                            controller.enqueue(streamPart);
                        } else {
                            controller.error(chunk.error);
                        }
                    }
                })),
                request: {
                    body: args
                },
                response: {
                    headers: responseHeaders
                }
            };
        } catch (error) {
            throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
        }
    }
    isFilePart(part) {
        return part && typeof part === "object" && "type" in part && part.type === "file";
    }
    /**
   * Encodes file parts in the prompt to base64. Mutates the passed options
   * instance directly to avoid copying the file data.
   * @param options - The options to encode.
   * @returns The options with the file parts encoded.
   */ maybeEncodeFileParts(options) {
        for (const message of options.prompt){
            for (const part of message.content){
                if (this.isFilePart(part)) {
                    const filePart = part;
                    if (filePart.data instanceof Uint8Array) {
                        const buffer = Uint8Array.from(filePart.data);
                        const base64Data = Buffer.from(buffer).toString("base64");
                        filePart.data = new URL(`data:${filePart.mediaType || "application/octet-stream"};base64,${base64Data}`);
                    }
                }
            }
        }
        return options;
    }
    getUrl() {
        return `${this.config.baseURL}/language-model`;
    }
    getModelConfigHeaders(modelId, streaming) {
        return {
            "ai-language-model-specification-version": "3",
            "ai-language-model-id": modelId,
            "ai-language-model-streaming": String(streaming)
        };
    }
};
// src/gateway-embedding-model.ts
var import_provider_utils6 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_v46 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var GatewayEmbeddingModel = class {
    constructor(modelId, config){
        this.modelId = modelId;
        this.config = config;
        this.specificationVersion = "v3";
        this.maxEmbeddingsPerCall = 2048;
        this.supportsParallelCalls = true;
    }
    get provider() {
        return this.config.provider;
    }
    async doEmbed({ values, headers, abortSignal, providerOptions }) {
        var _a8;
        const resolvedHeaders = await (0, import_provider_utils6.resolve)(this.config.headers());
        try {
            const { responseHeaders, value: responseBody, rawValue } = await (0, import_provider_utils6.postJsonToApi)({
                url: this.getUrl(),
                headers: (0, import_provider_utils6.combineHeaders)(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await (0, import_provider_utils6.resolve)(this.config.o11yHeaders)),
                body: {
                    values,
                    ...providerOptions ? {
                        providerOptions
                    } : {}
                },
                successfulResponseHandler: (0, import_provider_utils6.createJsonResponseHandler)(gatewayEmbeddingResponseSchema),
                failedResponseHandler: (0, import_provider_utils6.createJsonErrorResponseHandler)({
                    errorSchema: import_v46.z.any(),
                    errorToMessage: (data)=>data
                }),
                ...abortSignal && {
                    abortSignal
                },
                fetch: this.config.fetch
            });
            return {
                embeddings: responseBody.embeddings,
                usage: (_a8 = responseBody.usage) != null ? _a8 : void 0,
                providerMetadata: responseBody.providerMetadata,
                response: {
                    headers: responseHeaders,
                    body: rawValue
                },
                warnings: []
            };
        } catch (error) {
            throw await asGatewayError(error, await parseAuthMethod(resolvedHeaders));
        }
    }
    getUrl() {
        return `${this.config.baseURL}/embedding-model`;
    }
    getModelConfigHeaders() {
        return {
            "ai-embedding-model-specification-version": "3",
            "ai-model-id": this.modelId
        };
    }
};
var gatewayEmbeddingResponseSchema = (0, import_provider_utils6.lazySchema)(()=>(0, import_provider_utils6.zodSchema)(import_v46.z.object({
        embeddings: import_v46.z.array(import_v46.z.array(import_v46.z.number())),
        usage: import_v46.z.object({
            tokens: import_v46.z.number()
        }).nullish(),
        providerMetadata: import_v46.z.record(import_v46.z.string(), import_v46.z.record(import_v46.z.string(), import_v46.z.unknown())).optional()
    })));
// src/gateway-image-model.ts
var import_provider_utils7 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_v47 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var GatewayImageModel = class {
    constructor(modelId, config){
        this.modelId = modelId;
        this.config = config;
        this.specificationVersion = "v3";
        // Set a very large number to prevent client-side splitting of requests
        this.maxImagesPerCall = Number.MAX_SAFE_INTEGER;
    }
    get provider() {
        return this.config.provider;
    }
    async doGenerate({ prompt, n, size, aspectRatio, seed, files, mask, providerOptions, headers, abortSignal }) {
        var _a8;
        const resolvedHeaders = await (0, import_provider_utils7.resolve)(this.config.headers());
        try {
            const { responseHeaders, value: responseBody, rawValue } = await (0, import_provider_utils7.postJsonToApi)({
                url: this.getUrl(),
                headers: (0, import_provider_utils7.combineHeaders)(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await (0, import_provider_utils7.resolve)(this.config.o11yHeaders)),
                body: {
                    prompt,
                    n,
                    ...size && {
                        size
                    },
                    ...aspectRatio && {
                        aspectRatio
                    },
                    ...seed && {
                        seed
                    },
                    ...providerOptions && {
                        providerOptions
                    },
                    ...files && {
                        files: files.map((file)=>maybeEncodeImageFile(file))
                    },
                    ...mask && {
                        mask: maybeEncodeImageFile(mask)
                    }
                },
                successfulResponseHandler: (0, import_provider_utils7.createJsonResponseHandler)(gatewayImageResponseSchema),
                failedResponseHandler: (0, import_provider_utils7.createJsonErrorResponseHandler)({
                    errorSchema: import_v47.z.any(),
                    errorToMessage: (data)=>data
                }),
                ...abortSignal && {
                    abortSignal
                },
                fetch: this.config.fetch
            });
            return {
                images: responseBody.images,
                // Always base64 strings from server
                warnings: (_a8 = responseBody.warnings) != null ? _a8 : [],
                providerMetadata: responseBody.providerMetadata,
                response: {
                    timestamp: /* @__PURE__ */ new Date(),
                    modelId: this.modelId,
                    headers: responseHeaders
                }
            };
        } catch (error) {
            throw asGatewayError(error, await parseAuthMethod(resolvedHeaders));
        }
    }
    getUrl() {
        return `${this.config.baseURL}/image-model`;
    }
    getModelConfigHeaders() {
        return {
            "ai-image-model-specification-version": "3",
            "ai-model-id": this.modelId
        };
    }
};
function maybeEncodeImageFile(file) {
    if (file.type === "file" && file.data instanceof Uint8Array) {
        return {
            ...file,
            data: (0, import_provider_utils7.convertUint8ArrayToBase64)(file.data)
        };
    }
    return file;
}
var providerMetadataEntrySchema = import_v47.z.object({
    images: import_v47.z.array(import_v47.z.unknown()).optional()
}).catchall(import_v47.z.unknown());
var gatewayImageResponseSchema = import_v47.z.object({
    images: import_v47.z.array(import_v47.z.string()),
    // Always base64 strings over the wire
    warnings: import_v47.z.array(import_v47.z.object({
        type: import_v47.z.literal("other"),
        message: import_v47.z.string()
    })).optional(),
    providerMetadata: import_v47.z.record(import_v47.z.string(), providerMetadataEntrySchema).optional()
});
// src/gateway-video-model.ts
var import_provider_utils8 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_v48 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/v4/index.cjs [app-route] (ecmascript)");
var GatewayVideoModel = class {
    constructor(modelId, config){
        this.modelId = modelId;
        this.config = config;
        this.specificationVersion = "v3";
        // Set a very large number to prevent client-side splitting of requests
        this.maxVideosPerCall = Number.MAX_SAFE_INTEGER;
    }
    get provider() {
        return this.config.provider;
    }
    async doGenerate({ prompt, n, aspectRatio, resolution, duration, fps, seed, image, providerOptions, headers, abortSignal }) {
        var _a8;
        const resolvedHeaders = await (0, import_provider_utils8.resolve)(this.config.headers());
        try {
            const { responseHeaders, value: responseBody, rawValue } = await (0, import_provider_utils8.postJsonToApi)({
                url: this.getUrl(),
                headers: (0, import_provider_utils8.combineHeaders)(resolvedHeaders, headers != null ? headers : {}, this.getModelConfigHeaders(), await (0, import_provider_utils8.resolve)(this.config.o11yHeaders)),
                body: {
                    prompt,
                    n,
                    ...aspectRatio && {
                        aspectRatio
                    },
                    ...resolution && {
                        resolution
                    },
                    ...duration && {
                        duration
                    },
                    ...fps && {
                        fps
                    },
                    ...seed && {
                        seed
                    },
                    ...providerOptions && {
                        providerOptions
                    },
                    ...image && {
                        image: maybeEncodeVideoFile(image)
                    }
                },
                successfulResponseHandler: (0, import_provider_utils8.createJsonResponseHandler)(gatewayVideoResponseSchema),
                failedResponseHandler: (0, import_provider_utils8.createJsonErrorResponseHandler)({
                    errorSchema: import_v48.z.any(),
                    errorToMessage: (data)=>data
                }),
                ...abortSignal && {
                    abortSignal
                },
                fetch: this.config.fetch
            });
            return {
                videos: responseBody.videos,
                warnings: (_a8 = responseBody.warnings) != null ? _a8 : [],
                providerMetadata: responseBody.providerMetadata,
                response: {
                    timestamp: /* @__PURE__ */ new Date(),
                    modelId: this.modelId,
                    headers: responseHeaders
                }
            };
        } catch (error) {
            throw asGatewayError(error, await parseAuthMethod(resolvedHeaders));
        }
    }
    getUrl() {
        return `${this.config.baseURL}/video-model`;
    }
    getModelConfigHeaders() {
        return {
            "ai-video-model-specification-version": "3",
            "ai-model-id": this.modelId
        };
    }
};
function maybeEncodeVideoFile(file) {
    if (file.type === "file" && file.data instanceof Uint8Array) {
        return {
            ...file,
            data: (0, import_provider_utils8.convertUint8ArrayToBase64)(file.data)
        };
    }
    return file;
}
var providerMetadataEntrySchema2 = import_v48.z.object({
    videos: import_v48.z.array(import_v48.z.unknown()).optional()
}).catchall(import_v48.z.unknown());
var gatewayVideoDataSchema = import_v48.z.union([
    import_v48.z.object({
        type: import_v48.z.literal("url"),
        url: import_v48.z.string(),
        mediaType: import_v48.z.string()
    }),
    import_v48.z.object({
        type: import_v48.z.literal("base64"),
        data: import_v48.z.string(),
        mediaType: import_v48.z.string()
    })
]);
var gatewayVideoResponseSchema = import_v48.z.object({
    videos: import_v48.z.array(gatewayVideoDataSchema),
    warnings: import_v48.z.array(import_v48.z.object({
        type: import_v48.z.literal("other"),
        message: import_v48.z.string()
    })).optional(),
    providerMetadata: import_v48.z.record(import_v48.z.string(), providerMetadataEntrySchema2).optional()
});
// src/tool/parallel-search.ts
var import_provider_utils9 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_zod = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/index.cjs [app-route] (ecmascript)");
var parallelSearchInputSchema = (0, import_provider_utils9.lazySchema)(()=>(0, import_provider_utils9.zodSchema)(import_zod.z.object({
        objective: import_zod.z.string().describe("Natural-language description of the web research goal, including source or freshness guidance and broader context from the task. Maximum 5000 characters."),
        search_queries: import_zod.z.array(import_zod.z.string()).optional().describe("Optional search queries to supplement the objective. Maximum 200 characters per query."),
        mode: import_zod.z.enum([
            "one-shot",
            "agentic"
        ]).optional().describe('Mode preset: "one-shot" for comprehensive results with longer excerpts (default), "agentic" for concise, token-efficient results for multi-step workflows.'),
        max_results: import_zod.z.number().optional().describe("Maximum number of results to return (1-20). Defaults to 10 if not specified."),
        source_policy: import_zod.z.object({
            include_domains: import_zod.z.array(import_zod.z.string()).optional().describe("List of domains to include in search results."),
            exclude_domains: import_zod.z.array(import_zod.z.string()).optional().describe("List of domains to exclude from search results."),
            after_date: import_zod.z.string().optional().describe("Only include results published after this date (ISO 8601 format).")
        }).optional().describe("Source policy for controlling which domains to include/exclude and freshness."),
        excerpts: import_zod.z.object({
            max_chars_per_result: import_zod.z.number().optional().describe("Maximum characters per result."),
            max_chars_total: import_zod.z.number().optional().describe("Maximum total characters across all results.")
        }).optional().describe("Excerpt configuration for controlling result length."),
        fetch_policy: import_zod.z.object({
            max_age_seconds: import_zod.z.number().optional().describe("Maximum age in seconds for cached content. Set to 0 to always fetch fresh content.")
        }).optional().describe("Fetch policy for controlling content freshness.")
    })));
var parallelSearchOutputSchema = (0, import_provider_utils9.lazySchema)(()=>(0, import_provider_utils9.zodSchema)(import_zod.z.union([
        // Success response
        import_zod.z.object({
            searchId: import_zod.z.string(),
            results: import_zod.z.array(import_zod.z.object({
                url: import_zod.z.string(),
                title: import_zod.z.string(),
                excerpt: import_zod.z.string(),
                publishDate: import_zod.z.string().nullable().optional(),
                relevanceScore: import_zod.z.number().optional()
            }))
        }),
        // Error response
        import_zod.z.object({
            error: import_zod.z.enum([
                "api_error",
                "rate_limit",
                "timeout",
                "invalid_input",
                "configuration_error",
                "unknown"
            ]),
            statusCode: import_zod.z.number().optional(),
            message: import_zod.z.string()
        })
    ])));
var parallelSearchToolFactory = (0, import_provider_utils9.createProviderToolFactoryWithOutputSchema)({
    id: "gateway.parallel_search",
    inputSchema: parallelSearchInputSchema,
    outputSchema: parallelSearchOutputSchema
});
var parallelSearch = (config = {})=>parallelSearchToolFactory(config);
// src/tool/perplexity-search.ts
var import_provider_utils10 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
var import_zod2 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/zod/index.cjs [app-route] (ecmascript)");
var perplexitySearchInputSchema = (0, import_provider_utils10.lazySchema)(()=>(0, import_provider_utils10.zodSchema)(import_zod2.z.object({
        query: import_zod2.z.union([
            import_zod2.z.string(),
            import_zod2.z.array(import_zod2.z.string())
        ]).describe("Search query (string) or multiple queries (array of up to 5 strings). Multi-query searches return combined results from all queries."),
        max_results: import_zod2.z.number().optional().describe("Maximum number of search results to return (1-20, default: 10)"),
        max_tokens_per_page: import_zod2.z.number().optional().describe("Maximum number of tokens to extract per search result page (256-2048, default: 2048)"),
        max_tokens: import_zod2.z.number().optional().describe("Maximum total tokens across all search results (default: 25000, max: 1000000)"),
        country: import_zod2.z.string().optional().describe("Two-letter ISO 3166-1 alpha-2 country code for regional search results (e.g., 'US', 'GB', 'FR')"),
        search_domain_filter: import_zod2.z.array(import_zod2.z.string()).optional().describe("List of domains to include or exclude from search results (max 20). To include: ['nature.com', 'science.org']. To exclude: ['-example.com', '-spam.net']"),
        search_language_filter: import_zod2.z.array(import_zod2.z.string()).optional().describe("List of ISO 639-1 language codes to filter results (max 10, lowercase). Examples: ['en', 'fr', 'de']"),
        search_after_date: import_zod2.z.string().optional().describe("Include only results published after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."),
        search_before_date: import_zod2.z.string().optional().describe("Include only results published before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."),
        last_updated_after_filter: import_zod2.z.string().optional().describe("Include only results last updated after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."),
        last_updated_before_filter: import_zod2.z.string().optional().describe("Include only results last updated before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."),
        search_recency_filter: import_zod2.z.enum([
            "day",
            "week",
            "month",
            "year"
        ]).optional().describe("Filter results by relative time period. Cannot be used with search_after_date or search_before_date.")
    })));
var perplexitySearchOutputSchema = (0, import_provider_utils10.lazySchema)(()=>(0, import_provider_utils10.zodSchema)(import_zod2.z.union([
        // Success response
        import_zod2.z.object({
            results: import_zod2.z.array(import_zod2.z.object({
                title: import_zod2.z.string(),
                url: import_zod2.z.string(),
                snippet: import_zod2.z.string(),
                date: import_zod2.z.string().optional(),
                lastUpdated: import_zod2.z.string().optional()
            })),
            id: import_zod2.z.string()
        }),
        // Error response
        import_zod2.z.object({
            error: import_zod2.z.enum([
                "api_error",
                "rate_limit",
                "timeout",
                "invalid_input",
                "unknown"
            ]),
            statusCode: import_zod2.z.number().optional(),
            message: import_zod2.z.string()
        })
    ])));
var perplexitySearchToolFactory = (0, import_provider_utils10.createProviderToolFactoryWithOutputSchema)({
    id: "gateway.perplexity_search",
    inputSchema: perplexitySearchInputSchema,
    outputSchema: perplexitySearchOutputSchema
});
var perplexitySearch = (config = {})=>perplexitySearchToolFactory(config);
// src/gateway-tools.ts
var gatewayTools = {
    /**
   * Search the web using Parallel AI's Search API for LLM-optimized excerpts.
   *
   * Takes a natural language objective and returns relevant excerpts,
   * replacing multiple keyword searches with a single call for broad
   * or complex queries. Supports different search types for depth vs
   * breadth tradeoffs.
   */ parallelSearch,
    /**
   * Search the web using Perplexity's Search API for real-time information,
   * news, research papers, and articles.
   *
   * Provides ranked search results with advanced filtering options including
   * domain, language, date range, and recency filters.
   */ perplexitySearch
};
// src/vercel-environment.ts
var import_oidc = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/index.js [app-route] (ecmascript)");
var import_oidc2 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@vercel/oidc/dist/index.js [app-route] (ecmascript)");
async function getVercelRequestId() {
    var _a8;
    return (_a8 = (0, import_oidc.getContext)().headers) == null ? void 0 : _a8["x-vercel-id"];
}
// src/gateway-provider.ts
var import_provider_utils12 = __turbopack_context__.r("[project]/projects/tartanhacks/node_modules/@ai-sdk/provider-utils/dist/index.js [app-route] (ecmascript)");
// src/version.ts
var VERSION = ("TURBOPACK compile-time truthy", 1) ? "3.0.37" : "TURBOPACK unreachable";
// src/gateway-provider.ts
var AI_GATEWAY_PROTOCOL_VERSION = "0.0.1";
function createGatewayProvider(options = {}) {
    var _a8, _b8;
    let pendingMetadata = null;
    let metadataCache = null;
    const cacheRefreshMillis = (_a8 = options.metadataCacheRefreshMillis) != null ? _a8 : 1e3 * 60 * 5;
    let lastFetchTime = 0;
    const baseURL = (_b8 = (0, import_provider_utils11.withoutTrailingSlash)(options.baseURL)) != null ? _b8 : "https://ai-gateway.vercel.sh/v3/ai";
    const getHeaders = async ()=>{
        try {
            const auth = await getGatewayAuthToken(options);
            return (0, import_provider_utils12.withUserAgentSuffix)({
                Authorization: `Bearer ${auth.token}`,
                "ai-gateway-protocol-version": AI_GATEWAY_PROTOCOL_VERSION,
                [GATEWAY_AUTH_METHOD_HEADER]: auth.authMethod,
                ...options.headers
            }, `ai-sdk/gateway/${VERSION}`);
        } catch (error) {
            throw GatewayAuthenticationError.createContextualError({
                apiKeyProvided: false,
                oidcTokenProvided: false,
                statusCode: 401,
                cause: error
            });
        }
    };
    const createO11yHeaders = ()=>{
        const deploymentId = (0, import_provider_utils11.loadOptionalSetting)({
            settingValue: void 0,
            environmentVariableName: "VERCEL_DEPLOYMENT_ID"
        });
        const environment = (0, import_provider_utils11.loadOptionalSetting)({
            settingValue: void 0,
            environmentVariableName: "VERCEL_ENV"
        });
        const region = (0, import_provider_utils11.loadOptionalSetting)({
            settingValue: void 0,
            environmentVariableName: "VERCEL_REGION"
        });
        return async ()=>{
            const requestId = await getVercelRequestId();
            return {
                ...deploymentId && {
                    "ai-o11y-deployment-id": deploymentId
                },
                ...environment && {
                    "ai-o11y-environment": environment
                },
                ...region && {
                    "ai-o11y-region": region
                },
                ...requestId && {
                    "ai-o11y-request-id": requestId
                }
            };
        };
    };
    const createLanguageModel = (modelId)=>{
        return new GatewayLanguageModel(modelId, {
            provider: "gateway",
            baseURL,
            headers: getHeaders,
            fetch: options.fetch,
            o11yHeaders: createO11yHeaders()
        });
    };
    const getAvailableModels = async ()=>{
        var _a9, _b9, _c;
        const now = (_c = (_b9 = (_a9 = options._internal) == null ? void 0 : _a9.currentDate) == null ? void 0 : _b9.call(_a9).getTime()) != null ? _c : Date.now();
        if (!pendingMetadata || now - lastFetchTime > cacheRefreshMillis) {
            lastFetchTime = now;
            pendingMetadata = new GatewayFetchMetadata({
                baseURL,
                headers: getHeaders,
                fetch: options.fetch
            }).getAvailableModels().then((metadata)=>{
                metadataCache = metadata;
                return metadata;
            }).catch(async (error)=>{
                throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
            });
        }
        return metadataCache ? Promise.resolve(metadataCache) : pendingMetadata;
    };
    const getCredits = async ()=>{
        return new GatewayFetchMetadata({
            baseURL,
            headers: getHeaders,
            fetch: options.fetch
        }).getCredits().catch(async (error)=>{
            throw await asGatewayError(error, await parseAuthMethod(await getHeaders()));
        });
    };
    const provider = function(modelId) {
        if (new.target) {
            throw new Error("The Gateway Provider model function cannot be called with the new keyword.");
        }
        return createLanguageModel(modelId);
    };
    provider.specificationVersion = "v3";
    provider.getAvailableModels = getAvailableModels;
    provider.getCredits = getCredits;
    provider.imageModel = (modelId)=>{
        return new GatewayImageModel(modelId, {
            provider: "gateway",
            baseURL,
            headers: getHeaders,
            fetch: options.fetch,
            o11yHeaders: createO11yHeaders()
        });
    };
    provider.languageModel = createLanguageModel;
    const createEmbeddingModel = (modelId)=>{
        return new GatewayEmbeddingModel(modelId, {
            provider: "gateway",
            baseURL,
            headers: getHeaders,
            fetch: options.fetch,
            o11yHeaders: createO11yHeaders()
        });
    };
    provider.embeddingModel = createEmbeddingModel;
    provider.textEmbeddingModel = createEmbeddingModel;
    provider.videoModel = (modelId)=>{
        return new GatewayVideoModel(modelId, {
            provider: "gateway",
            baseURL,
            headers: getHeaders,
            fetch: options.fetch,
            o11yHeaders: createO11yHeaders()
        });
    };
    provider.chat = provider.languageModel;
    provider.embedding = provider.embeddingModel;
    provider.image = provider.imageModel;
    provider.video = provider.videoModel;
    provider.tools = gatewayTools;
    return provider;
}
var gateway = createGatewayProvider();
async function getGatewayAuthToken(options) {
    const apiKey = (0, import_provider_utils11.loadOptionalSetting)({
        settingValue: options.apiKey,
        environmentVariableName: "AI_GATEWAY_API_KEY"
    });
    if (apiKey) {
        return {
            token: apiKey,
            authMethod: "api-key"
        };
    }
    const oidcToken = await (0, import_oidc2.getVercelOidcToken)();
    return {
        token: oidcToken,
        authMethod: "oidc"
    };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    GatewayAuthenticationError,
    GatewayError,
    GatewayInternalServerError,
    GatewayInvalidRequestError,
    GatewayModelNotFoundError,
    GatewayRateLimitError,
    GatewayResponseError,
    createGateway,
    createGatewayProvider,
    gateway
}); //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=_cb4d8fe7._.js.map