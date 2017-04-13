/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/aru
 */
var aru = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal
);
});

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof commonjsGlobal === "object" ? commonjsGlobal :
  typeof window === "object" ? window :
  typeof self === "object" ? self : commonjsGlobal;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var index = runtimeModule;

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(_defined(that))
      , i = _toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function(fn, that, length){
  _aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function(it){
  if(!_isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var document$1 = _global.document;
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!_isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if(_ie8DomDefine)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var _hide = _descriptors ? function(object, key, value){
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? _core : _core[name] || (_core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])_hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
var _export = $export;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings

var _toIobject = function(it){
  return _iobject(_defined(it));
};

// 7.1.15 ToLength
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes

var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = _toIobject($this)
      , length = _toLength(O.length)
      , index  = _toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store  = _global[SHARED] || (_global[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var _sharedKey = function(key){
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = _toIobject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO$1)_has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(_has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)


var _objectKeys = Object.keys || function keys(O){
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  _anObject(O);
  var keys   = _objectKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)_objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var IE_PROTO    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = _enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !_has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = _objectCreate(IteratorPrototype, {next: _propertyDesc(1, next)});
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function(it){
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = _toObject(O);
  if(_has(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  _iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = _objectGpo($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!_library && !_has(IteratorPrototype, ITERATOR))_hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))_redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return _iterStep(1);
  }
  if(kind == 'keys'  )return _iterStep(0, index);
  if(kind == 'values')return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = _global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])_hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// getting tag from 19.1.3.6 Object.prototype.toString()
var TAG$1 = _wks('toStringTag');
var ARG = _cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)_anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2  = _wks('iterator');
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : core_getIteratorMethod(iterable)
    , f      = _ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(_isArrayIter(iterFn))for(length = _toLength(iterable.length); length > index; index++){
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = _iterCall(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var SPECIES   = _wks('species');
var _speciesConstructor = function(O, D){
  var C = _anObject(O).constructor, S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

var process$2            = _global.process;
var setTask            = _global.setImmediate;
var clearTask          = _global.clearImmediate;
var MessageChannel     = _global.MessageChannel;
var counter            = 0;
var queue              = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_cof(process$2) == 'process'){
    defer = function(id){
      process$2.nextTick(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts){
    defer = function(id){
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in _domCreate('script')){
    defer = function(id){
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function(){
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set:   setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer  = _global.MutationObserver || _global.WebKitMutationObserver;
var process$3   = _global.process;
var Promise$1   = _global.Promise;
var isNode$1    = _cof(process$3) == 'process';

var _microtask = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode$1 && (parent = process$3.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode$1){
    notify = function(){
      process$3.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise$1 && Promise$1.resolve){
    var promise = Promise$1.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

var _redefineAll = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1     = _wks('species');

var _setSpecies = function(KEY){
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if(_descriptors && C && !C[SPECIES$1])_objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function(){ return this; }
  });
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

var task               = _task.set;
var microtask          = _microtask();
var PROMISE            = 'Promise';
var TypeError$1          = _global.TypeError;
var process$1            = _global.process;
var $Promise           = _global[PROMISE];
var process$1            = _global.process;
var isNode             = _classof(process$1) == 'process';
var empty              = function(){ /* empty */ };
var Internal;
var GenericPromiseCapability;
var Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[_wks('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError$1('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject  = _aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError$1('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(_global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process$1.emit('unhandledRejection', value, promise);
        } else if(handler = _global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = _global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(_global, function(){
    var handler;
    if(isNode){
      process$1.emit('rejectionHandled', promise);
    } else if(handler = _global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError$1("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process$1.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject  = _ctx($reject, promise, 1);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, {Promise: $Promise});
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      _forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      _forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

var promise$2 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$2, __esModule: true };
});

var asyncToGenerator = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

/**
 * This file exports a dictionary of global primitive types that are shared by all contexts.
 * It is populated in [registerPrimitiveTypes()](./registerPrimitiveTypes.js).
 */

var primitiveTypes = {};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function makeJSONError(validation) {
  if (!validation.hasErrors()) {
    return;
  }
  var input = validation.input,
      context = validation.context;

  var errors = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = validation.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = slicedToArray(_ref, 3);

      var path = _ref2[0];
      var message = _ref2[1];
      var expectedType = _ref2[2];

      var expected = expectedType ? expectedType.toString() : null;
      var actual = context.typeOf(_resolvePath(input, path)).toString();
      var field = stringifyPath(validation.path.concat(path));

      var pointer = `/${ path.join('/') }`;

      errors.push({
        pointer,
        field,
        message,
        expected,
        actual
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return errors;
}

// Tracks whether we're in validation of cyclic objects.
var cyclicValidation = new WeakMap();
// Tracks whether we're toString() of cyclic objects.


var cyclicToString = new WeakSet();

function inValidationCycle(type, input) {
  try {
    var tracked = cyclicValidation.get(type);
    if (!tracked) {
      return false;
    } else {
      return weakSetHas(tracked, input);
    }
  } catch (e) {
    // some exotic values cannot be checked
    return true;
  }
}

function startValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);
  if (!tracked) {
    tracked = new WeakSet();
    cyclicValidation.set(type, tracked);
  }
  weakSetAdd(tracked, input);
}

function endValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);
  if (tracked) {
    weakSetDelete(tracked, input);
  }
}

function inToStringCycle(type) {
  return cyclicToString.has(type);
}

function startToStringCycle(type) {
  cyclicToString.add(type);
}

function endToStringCycle(type) {
  cyclicToString.delete(type);
}

function weakSetHas(weakset, value) {
  try {
    return weakset.has(value);
  } catch (e) {
    return true;
  }
}

function weakSetAdd(weakset, value) {
  try {
    weakset.add(value);
  } catch (e) {}
}

function weakSetDelete(weakset, value) {
  try {
    weakset.delete(value);
  } catch (e) {}
}

var validIdentifierOrAccessor = /^[$A-Z_][0-9A-Z_$[\].]*$/i;

var Validation = function () {
  function Validation(context, input) {
    classCallCheck(this, Validation);
    this.path = [];
    this.prefix = '';
    this.errors = [];
    this.cyclic = new WeakMap();

    this.context = context;
    this.input = input;
  }

  // Tracks whether we're in validation of cyclic objects.


  createClass(Validation, [{
    key: 'inCycle',
    value: function inCycle(type, input) {
      var tracked = this.cyclic.get(type);
      if (!tracked) {
        return false;
      } else {
        return weakSetHas(tracked, input);
      }
    }
  }, {
    key: 'startCycle',
    value: function startCycle(type, input) {
      var tracked = this.cyclic.get(type);
      if (!tracked) {
        tracked = new WeakSet();
        this.cyclic.set(type, tracked);
      }
      weakSetAdd(tracked, input);
    }
  }, {
    key: 'endCycle',
    value: function endCycle(type, input) {
      var tracked = this.cyclic.get(type);
      if (tracked) {
        weakSetDelete(tracked, input);
      }
    }
  }, {
    key: 'hasErrors',
    value: function hasErrors(path) {
      if (path) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = slicedToArray(_ref, 1);

            var candidate = _ref2[0];

            if (matchPath(path, candidate)) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return false;
      } else {
        return this.errors.length > 0;
      }
    }
  }, {
    key: 'addError',
    value: function addError(path, expectedType, message) {
      this.errors.push([path, message, expectedType]);
      return this;
    }
  }, {
    key: 'clearError',
    value: function clearError(path) {
      var didClear = false;
      if (path) {
        var _errors = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.errors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var error = _step2.value;

            if (matchPath(path, error[0])) {
              didClear = true;
            } else {
              _errors.push(error);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.errors = _errors;
      } else {
        didClear = this.errors.length > 0;
        this.errors = [];
      }
      return didClear;
    }
  }, {
    key: 'resolvePath',
    value: function resolvePath(path) {
      return _resolvePath(this.input, path);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return makeJSONError(this);
    }
  }]);
  return Validation;
}();

function stringifyPath(path) {
  if (!path.length) {
    return 'Value';
  }
  var length = path.length;

  var parts = new Array(length);
  for (var i = 0; i < length; i++) {
    var part = path[i];
    if (part === '[[Return Type]]') {
      parts[i] = 'Return Type';
    } else if (typeof part !== 'string' || !validIdentifierOrAccessor.test(part)) {
      parts[i] = `[${ String(part) }]`;
    } else if (i > 0) {
      parts[i] = `.${ String(part) }`;
    } else {
      parts[i] = String(part);
    }
  }
  return parts.join('');
}

function _resolvePath(input, path) {
  var subject = input;
  var length = path.length;

  for (var i = 0; i < length; i++) {
    if (subject == null) {
      return undefined;
    }
    var part = path[i];
    if (part === '[[Return Type]]') {
      continue;
    }
    if (subject instanceof Map) {
      subject = subject.get(part);
    } else {
      subject = subject[part];
    }
  }
  return subject;
}

function matchPath(path, candidate) {
  var length = path.length;

  if (length > candidate.length) {
    return false;
  }
  for (var i = 0; i < length; i++) {
    if (candidate[i] !== path[i]) {
      return false;
    }
  }
  return true;
}

var RuntimeTypeError = function (_TypeError) {
  inherits(RuntimeTypeError, _TypeError);

  function RuntimeTypeError() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, RuntimeTypeError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = RuntimeTypeError.__proto__ || Object.getPrototypeOf(RuntimeTypeError)).call.apply(_ref, [this].concat(args))), _this), _this.name = "RuntimeTypeError", _temp), possibleConstructorReturn(_this, _ret);
  }

  return RuntimeTypeError;
}(TypeError);

var delimiter = '\n-------------------------------------------------\n\n';

function makeTypeError(validation) {
  if (!validation.hasErrors()) {
    return;
  }
  var prefix = validation.prefix,
      input = validation.input,
      context = validation.context;

  var collected = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = validation.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = slicedToArray(_ref, 3);

      var path = _ref2[0];
      var message = _ref2[1];
      var expectedType = _ref2[2];

      var expected = expectedType ? expectedType.toString() : "*";
      var actual = context.typeOf(_resolvePath(input, path)).toString();

      var field = stringifyPath(validation.path.concat(path));

      collected.push(`${ field } ${ message }\n\nExpected: ${ expected }\n\nActual: ${ actual }\n`);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (prefix) {
    return new RuntimeTypeError(`${ prefix.trim() } ${ collected.join(delimiter) }`);
  } else {
    return new RuntimeTypeError(collected.join(delimiter));
  }
}

function makeError(expected, input) {
  var context = expected.context;

  var validation = context.validate(expected, input);
  return makeTypeError(validation);
}

/**
 * Given two types, A and B, compare them and return either -1, 0, or 1:
 *
 *   -1 if A cannot accept type B.
 *
 *    0 if the types are effectively identical.
 *
 *    1 if A accepts every possible B.
 */


function compareTypes(a, b) {

  if (a === b) {
    return 0;
  }

  if (b instanceof TypeAlias || b instanceof TypeParameter) {
    b = b.unwrap();
  }

  if (a instanceof TypeAlias) {
    return a.compareWith(b);
  }

  if (a instanceof FlowIntoType || a instanceof TypeParameter || b instanceof FlowIntoType) {
    return a.compareWith(b);
  } else if (a instanceof AnyType || a instanceof ExistentialType || a instanceof MixedType) {
    return 1;
  } else {
    return a.compareWith(b);
  }
}

/**
 * # Type
 *
 * This is the base class for all types.
 */
var Type = function () {
  function Type(context) {
    classCallCheck(this, Type);
    this.typeName = 'Type';

    this.context = context;
  }

  createClass(Type, [{
    key: 'errors',
    value: function* errors(validation, path, input) {}
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var validation = new Validation(this.context, input);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.errors(validation, [], input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;
          // eslint-disable-line no-unused-vars
          return false;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }
  }, {
    key: 'acceptsType',
    value: function acceptsType(input) {
      if (compareTypes(this, input) === -1) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return -1;
    }
  }, {
    key: 'assert',
    value: function assert(input) {
      var error = makeError(this, input);
      if (error) {
        if (typeof Error.captureStackTrace === 'function') {
          Error.captureStackTrace(error, this.assert);
        }
        throw error;
      }
      return input;
    }

    /**
     * Get the inner type.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '$Type';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return Type;
}();

var AnyType = function (_Type) {
  inherits(AnyType, _Type);

  function AnyType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, AnyType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AnyType.__proto__ || Object.getPrototypeOf(AnyType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'AnyType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(AnyType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {}
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return 1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'any';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return AnyType;
}(Type);

var errorMessages = {
  ERR_CONSTRAINT_VIOLATION: 'violated a constraint',
  ERR_EXPECT_ARRAY: 'must be an Array',
  ERR_EXPECT_TRUE: 'must be true',
  ERR_EXPECT_FALSE: 'must be false',
  ERR_EXPECT_BOOLEAN: 'must be true or false',
  ERR_EXPECT_EMPTY: 'must be empty',
  ERR_EXPECT_EXACT_VALUE: 'must be exactly $0',
  ERR_EXPECT_CALLABLE: 'must be callable',
  ERR_EXPECT_CLASS: 'must be a Class of $0',
  ERR_EXPECT_FUNCTION: 'must be a function',
  ERR_EXPECT_GENERATOR: 'must be a generator function',
  ERR_EXPECT_ITERABLE: 'must be iterable',
  ERR_EXPECT_ARGUMENT: 'argument "$0" must be: $1',
  ERR_EXPECT_RETURN: 'expected return type of: $0',
  ERR_EXPECT_N_ARGUMENTS: 'requires $0 argument(s)',
  ERR_EXPECT_INSTANCEOF: 'must be an instance of $0',
  ERR_EXPECT_KEY_TYPE: 'keys must be: $0',
  ERR_EXPECT_NULL: 'must be null',
  ERR_EXPECT_NUMBER: 'must be a number',
  ERR_EXPECT_OBJECT: 'must be an object',
  ERR_EXPECT_PROMISE: 'must be promise of $0',
  ERR_EXPECT_STRING: 'must be a string',
  ERR_EXPECT_SYMBOL: 'must be a symbol',
  ERR_EXPECT_THIS: 'must be exactly this',
  ERR_EXPECT_VOID: 'must be undefined',
  ERR_INVALID_DATE: 'must be a valid date',
  ERR_NO_INDEXER: 'is not one of the permitted indexer types',
  ERR_NO_UNION: 'must be one of: $0',
  ERR_UNKNOWN_KEY: 'should not contain the key: "$0"'
};

function getErrorMessage(key) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  var message = errorMessages[key];
  if (params.length > 0) {
    return message.replace(/\$(\d+)/g, function (m, i) {
      return String(params[i]);
    });
  } else {
    return message;
  }
}

var TupleType = function (_Type) {
  inherits(TupleType, _Type);

  function TupleType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TupleType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TupleType.__proto__ || Object.getPrototypeOf(TupleType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TupleType', _this.types = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TupleType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var types = this.types;
      var length = types.length;
      var context = this.context;

      if (!context.checkPredicate('Array', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this];
        return;
      }
      for (var i = 0; i < length; i++) {
        yield* types[i].errors(validation, path.concat(i), input[i]);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var types = this.types;
      var length = types.length;
      var context = this.context;


      if (!context.checkPredicate('Array', input) || input.length < length) {
        return false;
      }
      for (var i = 0; i < length; i++) {
        var type = types[i];
        if (!type.accepts(input[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof TupleType)) {
        return -1;
      }
      var types = this.types;
      var inputTypes = input.types;
      if (inputTypes.length < types.length) {
        return -1;
      }
      var isGreater = false;
      for (var i = 0; i < types.length; i++) {
        var result = compareTypes(types[i], inputTypes[i]);
        if (result === 1) {
          isGreater = true;
        } else if (result === -1) {
          return -1;
        }
      }
      if (types.length < inputTypes.length) {
        return 0;
      } else if (isGreater) {
        return 1;
      } else {
        return 0;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `[${ this.types.join(', ') }]`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        types: this.types
      };
    }
  }]);
  return TupleType;
}(Type);

var ArrayType = function (_Type) {
  inherits(ArrayType, _Type);

  function ArrayType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ArrayType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ArrayType.__proto__ || Object.getPrototypeOf(ArrayType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ArrayType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ArrayType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var context = this.context;

      if (!context.checkPredicate('Array', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this];
        return;
      }
      if (validation.inCycle(this, input)) {
        return;
      }
      validation.startCycle(this, input);
      var elementType = this.elementType;
      var length = input.length;


      for (var i = 0; i < length; i++) {
        yield* elementType.errors(validation, path.concat(i), input[i]);
      }
      validation.endCycle(this, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var context = this.context;

      if (!context.checkPredicate('Array', input)) {
        return false;
      }
      if (inValidationCycle(this, input)) {
        return true;
      }
      startValidationCycle(this, input);
      var elementType = this.elementType;
      var length = input.length;

      for (var i = 0; i < length; i++) {
        if (!elementType.accepts(input[i])) {
          endValidationCycle(this, input);
          return false;
        }
      }
      endValidationCycle(this, input);
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var elementType = this.elementType;

      if (input instanceof TupleType) {
        var types = input.types;

        for (var i = 0; i < types.length; i++) {
          var result = compareTypes(elementType, types[i]);
          if (result === -1) {
            return -1;
          }
        }
        return 1;
      } else if (input instanceof ArrayType) {
        return compareTypes(elementType, input.elementType);
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var elementType = this.elementType;

      if (inToStringCycle(this)) {
        if (typeof elementType.name === 'string') {
          return `Array<$Cycle<${ elementType.name }>>`;
        } else {
          return `Array<$Cycle<Object>>`;
        }
      }
      startToStringCycle(this);
      var output = `Array<${ elementType.toString() }>`;
      endToStringCycle(this);
      return output;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        elementType: this.elementType
      };
    }
  }]);
  return ArrayType;
}(Type);

var BooleanLiteralType = function (_Type) {
  inherits(BooleanLiteralType, _Type);

  function BooleanLiteralType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, BooleanLiteralType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = BooleanLiteralType.__proto__ || Object.getPrototypeOf(BooleanLiteralType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'BooleanLiteralType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(BooleanLiteralType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (input !== this.value) {
        yield [path, getErrorMessage(this.value ? 'ERR_EXPECT_TRUE' : 'ERR_EXPECT_FALSE'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === this.value;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof BooleanLiteralType && input.value === this.value) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.value ? 'true' : 'false';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        type: this.typeName,
        value: this.value
      };
    }
  }]);
  return BooleanLiteralType;
}(Type);

var BooleanType = function (_Type) {
  inherits(BooleanType, _Type);

  function BooleanType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, BooleanType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = BooleanType.__proto__ || Object.getPrototypeOf(BooleanType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'BooleanType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(BooleanType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (typeof input !== 'boolean') {
        yield [path, getErrorMessage('ERR_EXPECT_BOOLEAN'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return typeof input === 'boolean';
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof BooleanLiteralType) {
        return 1;
      } else if (input instanceof BooleanType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'boolean';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return BooleanType;
}(Type);

var EmptyType = function (_Type) {
  inherits(EmptyType, _Type);

  function EmptyType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, EmptyType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = EmptyType.__proto__ || Object.getPrototypeOf(EmptyType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'EmptyType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(EmptyType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield [path, getErrorMessage('ERR_EXPECT_EMPTY'), this];
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return false; // empty types accepts nothing.
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof EmptyType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'empty';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return EmptyType;
}(Type);

var ExistentialType = function (_Type) {
  inherits(ExistentialType, _Type);

  function ExistentialType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ExistentialType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ExistentialType.__proto__ || Object.getPrototypeOf(ExistentialType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ExistentialType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ExistentialType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {}
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return 1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '*';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return ExistentialType;
}(Type);

var FlowIntoSymbol = Symbol('FlowInto');

/**
 * # TypeParameter
 *
 * Type parameters allow polymorphic type safety.
 * The first time a type parameter is checked, it records the shape of its input,
 * this recorded shape is used to check all future inputs for this particular instance.
 */

var TypeParameter = function (_Type) {
  inherits(TypeParameter, _Type);

  function TypeParameter() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeParameter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeParameter.__proto__ || Object.getPrototypeOf(TypeParameter)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeParameter', _this[FlowIntoSymbol] = null, _temp), possibleConstructorReturn(_this, _ret);
  }

  // Issue 252


  createClass(TypeParameter, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var boundOrDefault = this.bound || this.default;
      var recorded = this.recorded,
          context = this.context;


      if (boundOrDefault instanceof FlowIntoType) {
        // We defer to the other type parameter so that values from this
        // one can flow "upwards".
        yield* boundOrDefault.errors(validation, path, input);
        return;
      } else if (recorded) {
        // we've already recorded a value for this type parameter
        yield* recorded.errors(validation, path, input);
        return;
      } else if (boundOrDefault) {
        if (boundOrDefault.typeName === 'AnyType' || boundOrDefault.typeName === 'ExistentialType') {
          return;
        } else {
          var hasErrors = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = boundOrDefault.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var error = _step.value;

              hasErrors = true;
              yield error;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (hasErrors) {
            return;
          }
        }
      }

      this.recorded = context.typeOf(input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var boundOrDefault = this.bound || this.default;
      var recorded = this.recorded,
          context = this.context;

      if (boundOrDefault instanceof FlowIntoType) {
        // We defer to the other type parameter so that values from this
        // one can flow "upwards".
        return boundOrDefault.accepts(input);
      } else if (recorded) {
        return recorded.accepts(input);
      } else if (boundOrDefault) {
        if (boundOrDefault.typeName === 'AnyType' || boundOrDefault.typeName === 'ExistentialType') {
          return true;
        } else if (!boundOrDefault.accepts(input)) {
          return false;
        }
      }

      this.recorded = context.typeOf(input);
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var boundOrDefault = this.bound || this.default;
      var recorded = this.recorded;

      if (input instanceof TypeParameter) {
        // We don't need to check for `recorded` or `bound` fields
        // because the input has already been unwrapped, so
        // if we got a type parameter it must be totally generic and
        // we treat it like Any.
        return 1;
      } else if (recorded) {
        return compareTypes(recorded, input);
      } else if (boundOrDefault) {
        return compareTypes(boundOrDefault, input);
      } else {
        // A generic type parameter accepts any input.
        return 1;
      }
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      var boundOrDefault = this.bound || this.default;
      var recorded = this.recorded;

      if (recorded) {
        return recorded.unwrap();
      } else if (boundOrDefault) {
        return boundOrDefault.unwrap();
      } else {
        return this;
      }
    }
  }, {
    key: 'toString',
    value: function toString(withBinding) {
      var id = this.id,
          bound = this.bound,
          defaultType = this.default;

      if (withBinding) {
        if (defaultType) {
          return `${ id } = ${ defaultType.toString() }`;
        } else if (bound) {
          return `${ id }: ${ bound.toString() }`;
        }
      }
      return id;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        id: this.id,
        bound: this.bound,
        recorded: this.recorded
      };
    }
  }]);
  return TypeParameter;
}(Type);

function flowIntoTypeParameter(typeParameter) {
  var existing = typeParameter[FlowIntoSymbol];
  if (existing) {
    return existing;
  }

  var target = new FlowIntoType(typeParameter.context);
  target.typeParameter = typeParameter;
  typeParameter[FlowIntoSymbol] = target;
  return target;
}

/**
 * # FlowIntoType
 *
 * A virtual type which allows types it receives to "flow" upwards into a type parameter.
 * The type parameter will become of a union of any types seen by this instance.
 */

var FlowIntoType = function (_Type) {
  inherits(FlowIntoType, _Type);

  function FlowIntoType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FlowIntoType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FlowIntoType.__proto__ || Object.getPrototypeOf(FlowIntoType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'FlowIntoType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FlowIntoType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var typeParameter = this.typeParameter,
          context = this.context;
      var recorded = typeParameter.recorded,
          bound = typeParameter.bound;


      if (bound instanceof FlowIntoType) {
        // We defer to the other type so that values from this
        // one can flow "upwards".
        yield* bound.errors(validation, path, input);
        return;
      }
      if (recorded) {
        // we've already recorded a value for this type parameter
        if (bound) {
          var hasError = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = bound.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var error = _step.value;

              yield error;
              hasError = true;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (hasError) {
            return;
          }
        } else if (recorded.accepts(input)) {
          // our existing type already permits this value, there's nothing to do.
          return;
        } else {
          // we need to make a union
          typeParameter.recorded = context.union(recorded, context.typeOf(input));
          return;
        }
      } else if (bound) {
        if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
          return;
        } else {
          var _hasError = false;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = bound.errors(validation, path, input)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _error = _step2.value;

              yield _error;
              _hasError = true;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (_hasError) {
            return;
          }
        }
      }

      typeParameter.recorded = context.typeOf(input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var typeParameter = this.typeParameter,
          context = this.context;
      var recorded = typeParameter.recorded,
          bound = typeParameter.bound;


      if (bound instanceof FlowIntoType) {
        // We defer to the other type so that values from this
        // one can flow "upwards".
        return bound.accepts(input);
      }
      if (recorded) {
        // we've already recorded a value for this type parameter
        if (bound && !bound.accepts(input)) {
          return false;
        } else if (recorded.accepts(input)) {
          // our existing type already permits this value, there's nothing to do.
          return true;
        } else {
          // we need to make a union
          typeParameter.recorded = context.union(recorded, context.typeOf(input));
          return true;
        }
      } else if (bound) {
        if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
          return true;
        } else if (!bound.accepts(input)) {
          return false;
        }
      }

      typeParameter.recorded = context.typeOf(input);
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var typeParameter = this.typeParameter,
          context = this.context;
      var recorded = typeParameter.recorded,
          bound = typeParameter.bound;

      if (bound instanceof FlowIntoType) {
        // We defer to the other type so that values from this
        // one can flow "upwards".
        return bound.compareWith(input);
      }
      if (recorded) {
        if (bound && compareTypes(bound, input) === -1) {
          return -1;
        }
        var result = compareTypes(recorded, input);
        if (result === 0) {
          // our existing type already permits this value, there's nothing to do.
          return 0;
        }
        // we need to make a union
        typeParameter.recorded = context.union(recorded, input);
        return 1;
      } else if (bound) {
        if (bound.typeName === 'AnyType' || bound.typeName === 'ExistentialType') {
          return 1;
        }
        var _result = compareTypes(bound, input);
        if (_result === -1) {
          return -1;
        }
      }

      typeParameter.recorded = input;
      return 0;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.typeParameter.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString(withBinding) {
      return this.typeParameter.toString(withBinding);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.typeParameter.toJSON();
    }
  }]);
  return FlowIntoType;
}(Type);

var FunctionTypeParam = function (_Type) {
  inherits(FunctionTypeParam, _Type);

  function FunctionTypeParam() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FunctionTypeParam);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FunctionTypeParam.__proto__ || Object.getPrototypeOf(FunctionTypeParam)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'FunctionTypeParam', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FunctionTypeParam, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var optional = this.optional,
          type = this.type;

      if (optional && input === undefined) {
        return;
      } else {
        yield* type.errors(validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var optional = this.optional,
          type = this.type;

      if (optional && input === undefined) {
        return true;
      } else {
        return type.accepts(input);
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof FunctionTypeParam) {
        return compareTypes(this.type, input.type);
      } else {
        return compareTypes(this.type, input);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var optional = this.optional,
          type = this.type;

      return `${ this.name }${ optional ? '?' : '' }: ${ type.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        name: this.name,
        optional: this.optional,
        type: this.type
      };
    }
  }]);
  return FunctionTypeParam;
}(Type);

var FunctionTypeRestParam = function (_Type) {
  inherits(FunctionTypeRestParam, _Type);

  function FunctionTypeRestParam() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FunctionTypeRestParam);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FunctionTypeRestParam.__proto__ || Object.getPrototypeOf(FunctionTypeRestParam)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'FunctionTypeRestParam', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FunctionTypeRestParam, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;

      yield* type.errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      return type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof FunctionTypeParam || input instanceof FunctionTypeRestParam) {
        return compareTypes(this.type, input.type);
      } else {
        var result = compareTypes(this.type, input);
        if (result === -1) {
          return -1;
        } else {
          return 1;
        }
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var type = this.type;

      return `...${ this.name }: ${ type.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        name: this.name,
        type: this.type
      };
    }
  }]);
  return FunctionTypeRestParam;
}(Type);

var FunctionTypeReturn = function (_Type) {
  inherits(FunctionTypeReturn, _Type);

  function FunctionTypeReturn() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FunctionTypeReturn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FunctionTypeReturn.__proto__ || Object.getPrototypeOf(FunctionTypeReturn)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'FunctionTypeReturn', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FunctionTypeReturn, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;

      yield* type.errors(validation, path.concat('[[Return Type]]'), input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      return type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof FunctionTypeReturn) {
        return compareTypes(this.type, input.type);
      } else {
        var result = compareTypes(this.type, input);
        if (result === -1) {
          return -1;
        } else {
          return 1;
        }
      }
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var type = this.type;

      return type.toString();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return FunctionTypeReturn;
}(Type);

var ParentSymbol = Symbol('Parent');
var NameRegistrySymbol = Symbol('NameRegistry');
var ModuleRegistrySymbol = Symbol('ModuleRegistry');
var CurrentModuleSymbol = Symbol('CurrentModule');
var TypeConstructorRegistrySymbol = Symbol('TypeConstructorRegistry');
var InferrerSymbol = Symbol('Inferrer');


var TypeSymbol = Symbol('Type');
var TypeParametersSymbol = Symbol('TypeParameters');
var TypePredicateRegistrySymbol = Symbol('TypePredicateRegistry');

var FunctionType = function (_Type) {
  inherits(FunctionType, _Type);

  function FunctionType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, FunctionType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = FunctionType.__proto__ || Object.getPrototypeOf(FunctionType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'FunctionType', _this.params = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(FunctionType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_FUNCTION'), this];
        return;
      }
      var annotation = input[TypeSymbol];
      var returnType = this.returnType,
          params = this.params;

      if (annotation) {
        for (var i = 0; i < params.length; i++) {
          var param = params[i];
          var annotationParam = annotation.params[i];
          if (!annotationParam && !param.optional) {
            yield [path, getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()), this];
          } else if (!param.acceptsType(annotationParam)) {
            yield [path, getErrorMessage('ERR_EXPECT_ARGUMENT', param.name, param.type.toString()), this];
          }
        }
        if (!returnType.acceptsType(annotation.returnType)) {
          yield [path, getErrorMessage('ERR_EXPECT_RETURN', returnType.toString()), this];
        }
      } else {
        var context = this.context;
        // We cannot safely check an unannotated function.
        // But we need to propagate `any` type feedback upwards.

        for (var _i = 0; _i < params.length; _i++) {
          var _param = params[_i];
          _param.acceptsType(context.any());
        }
        returnType.acceptsType(context.any());
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      if (typeof input !== 'function') {
        return false;
      }
      var returnType = this.returnType,
          params = this.params;

      var annotation = input[TypeSymbol];
      if (annotation) {
        for (var i = 0; i < params.length; i++) {
          var param = params[i];
          var annotationParam = annotation.params[i];
          if (!annotationParam && !param.optional) {
            return false;
          } else if (!param.acceptsType(annotationParam)) {
            return false;
          }
        }
        if (!returnType.acceptsType(annotation.returnType)) {
          return false;
        }
        return true;
      } else {
        var context = this.context;
        // We cannot safely check an unannotated function.
        // But we need to propagate `any` type feedback upwards.

        for (var _i2 = 0; _i2 < params.length; _i2++) {
          var _param2 = params[_i2];
          _param2.acceptsType(context.any());
        }
        returnType.acceptsType(context.any());
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof FunctionType)) {
        return -1;
      }
      var returnType = this.returnType;
      var inputReturnType = input.returnType;
      var isGreater = false;
      var returnTypeResult = compareTypes(returnType, inputReturnType);
      if (returnTypeResult === -1) {
        return -1;
      } else if (returnTypeResult === 1) {
        isGreater = true;
      }

      var params = this.params;
      var inputParams = input.params;
      if (inputParams.length < params.length) {
        return -1;
      }
      for (var i = 0; i < params.length; i++) {
        var param = params[i];
        var inputParam = inputParams[i];
        var result = compareTypes(param, inputParam);
        if (result === -1) {
          return -1;
        } else if (result === 1) {
          isGreater = true;
        }
      }
      return isGreater ? 1 : 0;
    }
  }, {
    key: 'acceptsParams',
    value: function acceptsParams() {
      var params = this.params,
          rest = this.rest;

      var paramsLength = params.length;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var argsLength = args.length;
      for (var i = 0; i < paramsLength; i++) {
        var param = params[i];
        if (i < argsLength) {
          if (!param.accepts(args[i])) {
            return false;
          }
        } else if (!param.accepts(undefined)) {
          return false;
        }
      }

      if (argsLength > paramsLength && rest) {
        for (var _i3 = paramsLength; _i3 < argsLength; _i3++) {
          if (!rest.accepts(args[_i3])) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: 'acceptsReturn',
    value: function acceptsReturn(input) {
      return this.returnType.accepts(input);
    }
  }, {
    key: 'assertParams',
    value: function assertParams() {
      var params = this.params,
          rest = this.rest;

      var paramsLength = params.length;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var argsLength = args.length;
      for (var i = 0; i < paramsLength; i++) {
        var param = params[i];
        if (i < argsLength) {
          param.assert(args[i]);
        } else {
          param.assert(undefined);
        }
      }

      if (argsLength > paramsLength && rest) {
        for (var _i4 = paramsLength; _i4 < argsLength; _i4++) {
          rest.assert(args[_i4]);
        }
      }

      return args;
    }
  }, {
    key: 'assertReturn',
    value: function assertReturn(input) {
      this.returnType.assert(input);
      return input;
    }
  }, {
    key: 'invoke',
    value: function invoke() {
      var params = this.params,
          rest = this.rest,
          context = this.context;

      var paramsLength = params.length;

      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var argsLength = args.length;
      for (var i = 0; i < paramsLength; i++) {
        var param = params[i];
        if (i < argsLength) {
          if (!param.acceptsType(args[i])) {
            return context.empty();
          }
        } else if (!param.accepts(undefined)) {
          return context.empty();
        }
      }

      if (argsLength > paramsLength && rest) {
        for (var _i5 = paramsLength; _i5 < argsLength; _i5++) {
          if (!rest.acceptsType(args[_i5])) {
            return context.empty();
          }
        }
      }

      return this.returnType.type;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var params = this.params,
          rest = this.rest,
          returnType = this.returnType;

      var args = [];
      for (var i = 0; i < params.length; i++) {
        args.push(params[i].toString());
      }
      if (rest) {
        args.push(rest.toString());
      }
      return `(${ args.join(', ') }) => ${ returnType.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        params: this.params,
        rest: this.rest,
        returnType: this.returnType
      };
    }
  }]);
  return FunctionType;
}(Type);

var GeneratorType = function (_Type) {
  inherits(GeneratorType, _Type);

  function GeneratorType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, GeneratorType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GeneratorType.__proto__ || Object.getPrototypeOf(GeneratorType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'GeneratorType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GeneratorType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var isValid = input && typeof input.next === 'function' && typeof input.return === 'function' && typeof input.throw === 'function';
      if (!isValid) {
        yield [path, getErrorMessage('ERR_EXPECT_GENERATOR'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input && typeof input.next === 'function' && typeof input.return === 'function' && typeof input.throw === 'function';
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof GeneratorType)) {
        var _result = compareTypes(this.yieldType, input);
        if (_result === -1) {
          return -1;
        } else {
          return 1;
        }
      }
      var isGreater = false;
      var result = compareTypes(this.yieldType, input.yieldType);
      if (result === -1) {
        return -1;
      } else if (result === 1) {
        isGreater = true;
      }

      result = compareTypes(this.returnType, input.returnType);
      if (result === -1) {
        return -1;
      } else if (result === 1) {
        isGreater = true;
      }

      result = compareTypes(this.nextType, input.nextType);
      if (result === -1) {
        return -1;
      } else if (result === 1) {
        isGreater = true;
      }

      return isGreater ? 1 : 0;
    }
  }, {
    key: 'acceptsYield',
    value: function acceptsYield(input) {
      return this.yieldType.accepts(input);
    }
  }, {
    key: 'acceptsReturn',
    value: function acceptsReturn(input) {
      return this.returnType.accepts(input);
    }
  }, {
    key: 'acceptsNext',
    value: function acceptsNext(input) {
      return this.nextType.accepts(input);
    }
  }, {
    key: 'assertYield',
    value: function assertYield(input) {
      return this.yieldType.assert(input);
    }
  }, {
    key: 'assertReturn',
    value: function assertReturn(input) {
      return this.returnType.assert(input);
    }
  }, {
    key: 'assertNext',
    value: function assertNext(input) {
      return this.nextType.assert(input);
    }
  }, {
    key: 'toString',
    value: function toString() {
      var yieldType = this.yieldType,
          returnType = this.returnType,
          nextType = this.nextType;

      return `Generator<${ yieldType.toString() }, ${ returnType.toString() }, ${ nextType.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        yieldType: this.yieldType,
        returnType: this.returnType,
        nextType: this.nextType
      };
    }
  }]);
  return GeneratorType;
}(Type);

/**
 * # TypeParameterApplication
 *
 */
var TypeParameterApplication = function (_Type) {
  inherits(TypeParameterApplication, _Type);

  function TypeParameterApplication() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeParameterApplication);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeParameterApplication.__proto__ || Object.getPrototypeOf(TypeParameterApplication)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeParameterApplication', _this.typeInstances = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeParameterApplication, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var parent = this.parent,
          typeInstances = this.typeInstances;

      yield* parent.errors.apply(parent, [validation, path, input].concat(toConsumableArray(typeInstances)));
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var parent = this.parent,
          typeInstances = this.typeInstances;

      return parent.accepts.apply(parent, [input].concat(toConsumableArray(typeInstances)));
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.parent, input);
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      var inner = this.parent;
      if (inner && typeof inner.hasProperty === 'function') {
        var _ref2;

        return (_ref2 = inner).hasProperty.apply(_ref2, [name].concat(toConsumableArray(this.typeInstances)));
      } else {
        return false;
      }
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      var inner = this.parent;
      if (inner && typeof inner.getProperty === 'function') {
        var _ref3;

        return (_ref3 = inner).getProperty.apply(_ref3, [name].concat(toConsumableArray(this.typeInstances)));
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var parent = this.parent,
          typeInstances = this.typeInstances;
      var name = parent.name;

      if (typeInstances.length) {
        var items = [];
        for (var i = 0; i < typeInstances.length; i++) {
          var typeInstance = typeInstances[i];
          items.push(typeInstance.toString());
        }
        return `${ name }<${ items.join(', ') }>`;
      } else {
        return name;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        typeInstances: this.typeInstances
      };
    }
  }]);
  return TypeParameterApplication;
}(Type);

var warnedInstances = new WeakSet();

var TypeConstructor = function (_Type) {
  inherits(TypeConstructor, _Type);

  function TypeConstructor() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeConstructor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeConstructor.__proto__ || Object.getPrototypeOf(TypeConstructor)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeConstructor', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeConstructor, [{
    key: 'errors',
    value: function* errors(validation, path, input) {}
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var context = this.context,
          name = this.name;

      if (!warnedInstances.has(this)) {
        context.emitWarningMessage(`TypeConstructor ${ name } does not implement accepts().`);
        warnedInstances.add(this);
      }
      return false;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var context = this.context,
          name = this.name;

      if (!warnedInstances.has(this)) {
        context.emitWarningMessage(`TypeConstructor ${ name } does not implement compareWith().`);
        warnedInstances.add(this);
      }
      return -1;
    }
  }, {
    key: 'inferTypeParameters',
    value: function inferTypeParameters(input) {
      return [];
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        name: this.name
      };
    }
  }]);
  return TypeConstructor;
}(Type);

var GenericType = function (_TypeConstructor) {
  inherits(GenericType, _TypeConstructor);

  function GenericType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, GenericType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GenericType.__proto__ || Object.getPrototypeOf(GenericType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'GenericType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GenericType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var name = this.name,
          impl = this.impl;

      if (!(input instanceof impl)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', name), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input instanceof this.impl;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof GenericType && input.impl === this.impl) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'inferTypeParameters',
    value: function inferTypeParameters(input) {
      return [];
    }
  }]);
  return GenericType;
}(TypeConstructor);

function invariant(input, message) {
  if (!input) {
    var error = new Error(message);
    error.name = 'InvariantViolation';
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(error, invariant);
    }
    throw error;
  }
}

/**
 * Add constraints to the given subject type.
 */
function addConstraints(subject) {
  var _subject$constraints;

  for (var _len = arguments.length, constraints = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    constraints[_key - 1] = arguments[_key];
  }

  (_subject$constraints = subject.constraints).push.apply(_subject$constraints, toConsumableArray(constraints));
}

/**
 * Collect any errors from constraints on the given subject type.
 */


function* collectConstraintErrors(subject, validation, path) {
  var constraints = subject.constraints;
  var length = constraints.length;

  for (var _len2 = arguments.length, input = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    input[_key2 - 3] = arguments[_key2];
  }

  for (var i = 0; i < length; i++) {
    var constraint = constraints[i];
    var violation = constraint.apply(undefined, toConsumableArray(input));
    if (typeof violation === 'string') {
      yield [path, violation, this];
    }
  }
}

/**
 * Determine whether the input passes the constraints on the subject type.
 */
function constraintsAccept(subject) {
  var constraints = subject.constraints;
  var length = constraints.length;

  for (var _len3 = arguments.length, input = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    input[_key3 - 1] = arguments[_key3];
  }

  for (var i = 0; i < length; i++) {
    var constraint = constraints[i];
    if (typeof constraint.apply(undefined, toConsumableArray(input)) === 'string') {
      return false;
    }
  }
  return true;
}

var ObjectTypeProperty = function (_Type) {
  inherits(ObjectTypeProperty, _Type);

  function ObjectTypeProperty() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ObjectTypeProperty);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ObjectTypeProperty.__proto__ || Object.getPrototypeOf(ObjectTypeProperty)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ObjectTypeProperty', _this['static'] = false, _this.constraints = [], _temp), possibleConstructorReturn(_this, _ret);
  }
  // Ignore


  createClass(ObjectTypeProperty, [{
    key: 'addConstraint',
    value: function addConstraint() {
      for (var _len2 = arguments.length, constraints = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        constraints[_key2] = arguments[_key2];
      }

      addConstraints.apply(undefined, [this].concat(toConsumableArray(constraints)));
      return this;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      // Ignore
      var optional = this.optional,
          key = this.key,
          value = this.value,
          isStatic = this.static;

      var target = void 0;
      var targetPath = void 0;
      if (isStatic) {
        if (input === null || typeof input !== 'object' && typeof input !== 'function') {
          yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
          return;
        }
        targetPath = path.concat('constructor');
        if (typeof input.constructor !== 'function') {
          if (!optional) {
            yield [targetPath, getErrorMessage('ERR_EXPECT_FUNCTION'), this];
          }
          return;
        }
        targetPath.push(key);
        target = input.constructor[key];
      } else {
        target = input[key];
        targetPath = path.concat(key);
      }
      if (optional && target === undefined) {
        return;
      }
      var hasErrors = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = value.errors(validation, targetPath, target)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          hasErrors = true;
          yield error;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasErrors) {
        yield* collectConstraintErrors(this, validation, targetPath, target);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      // Ignore
      var optional = this.optional,
          key = this.key,
          value = this.value,
          isStatic = this.static;

      var target = void 0;
      if (isStatic) {
        if (input === null || typeof input !== 'object' && typeof input !== 'function') {
          return false;
        }
        if (typeof input.constructor !== 'function') {
          return optional ? true : false;
        }
        target = input.constructor[key];
      } else {
        target = input[key];
      }

      if (optional && target === undefined) {
        return true;
      } else if (!value.accepts(target)) {
        return false;
      } else {
        return constraintsAccept(this, target);
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof ObjectTypeProperty)) {
        return -1;
      } else if (input.key !== this.key) {
        return -1;
      } else {
        return compareTypes(this.value, input.value);
      }
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.value.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      var key = this.key;
      // Issue 252
      if (typeof key === 'symbol') {
        key = `[${ key.toString() }]`;
      }
      if (this.static) {
        return `static ${ key }${ this.optional ? '?' : '' }: ${ this.value.toString() };`;
      } else {
        return `${ key }${ this.optional ? '?' : '' }: ${ this.value.toString() };`;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        key: this.key,
        value: this.value,
        optional: this.optional
      };
    }
  }]);
  return ObjectTypeProperty;
}(Type);

var ObjectTypeIndexer = function (_Type) {
  inherits(ObjectTypeIndexer, _Type);

  function ObjectTypeIndexer() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ObjectTypeIndexer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ObjectTypeIndexer.__proto__ || Object.getPrototypeOf(ObjectTypeIndexer)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ObjectTypeIndexer', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ObjectTypeIndexer, [{
    key: 'errors',
    value: function* errors(validation, path, key, value) {
      // special case number types
      if (this.key.typeName === 'NumberType' || this.key.typeName === 'NumericLiteralType') {
        key = +key;
      }

      yield* this.key.errors(validation, path.concat('[[Key]]'), key);
      yield* this.value.errors(validation, path.concat(key), value);
    }
  }, {
    key: 'accepts',
    value: function accepts(value) {
      return this.value.accepts(value);
    }
  }, {
    key: 'acceptsKey',
    value: function acceptsKey(key) {
      // special case number types
      if (this.key.typeName === 'NumberType' || this.key.typeName === 'NumericLiteralType') {
        key = +key;
      }
      return this.key.accepts(key);
    }
  }, {
    key: 'acceptsValue',
    value: function acceptsValue(value) {
      return this.value.accepts(value);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof ObjectTypeProperty) {
        if (!this.key.accepts(input.key)) {
          return -1;
        } else {
          return compareTypes(this.value, input.value);
        }
      } else if (!(input instanceof ObjectTypeIndexer)) {
        return -1;
      }

      var keyResult = compareTypes(this.key, input.key);
      if (keyResult === -1) {
        return -1;
      }
      var valueResult = compareTypes(this.value, input.value);
      if (valueResult === -1) {
        return -1;
      }

      if (keyResult === 0 && valueResult === 0) {
        return 0;
      } else {
        return 1;
      }
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.value.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `[${ this.id }: ${ this.key.toString() }]: ${ this.value.toString() };`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        id: this.id,
        key: this.key,
        value: this.value
      };
    }
  }]);
  return ObjectTypeIndexer;
}(Type);

var ObjectTypeCallProperty = function (_Type) {
  inherits(ObjectTypeCallProperty, _Type);

  function ObjectTypeCallProperty() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ObjectTypeCallProperty);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ObjectTypeCallProperty.__proto__ || Object.getPrototypeOf(ObjectTypeCallProperty)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ObjectTypeCallProperty', _this['static'] = false, _temp), possibleConstructorReturn(_this, _ret);
  }
  // Ignore


  createClass(ObjectTypeCallProperty, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      // Ignore
      var value = this.value,
          isStatic = this.static;


      var target = void 0;
      var targetPath = void 0;
      if (isStatic) {
        if (input === null || typeof input !== 'object' && typeof input !== 'function') {
          yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
          return;
        }
        targetPath = path.concat('constructor');
        if (typeof input.constructor !== 'function') {
          yield [targetPath, getErrorMessage('ERR_EXPECT_FUNCTION'), this];
          return;
        }
        target = input.constructor;
      } else {
        target = input;
        targetPath = path;
      }
      yield* value.errors(validation, targetPath, target);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      // Ignore
      var value = this.value,
          isStatic = this.static;

      var target = void 0;
      if (isStatic) {
        if (input === null || typeof input !== 'object' && typeof input !== 'function') {
          return false;
        }
        if (typeof input.constructor !== 'function') {
          return false;
        }
        target = input.constructor;
      } else {
        target = input;
      }
      return value.accepts(target);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof ObjectTypeCallProperty)) {
        return -1;
      }
      return compareTypes(this.value, input.value);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.value.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      if (this.static) {
        return `static ${ this.value.toString() };`;
      } else {
        return this.value.toString();
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        value: this.value
      };
    }
  }]);
  return ObjectTypeCallProperty;
}(Type);

var ObjectType = function (_Type) {
  inherits(ObjectType, _Type);

  function ObjectType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ObjectType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ObjectType.__proto__ || Object.getPrototypeOf(ObjectType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ObjectType', _this.properties = [], _this.indexers = [], _this.callProperties = [], _this.exact = false, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ObjectType, [{
    key: 'getProperty',


    /**
     * Get a property with the given name, or undefined if it does not exist.
     */
    value: function getProperty(key) {
      var properties = this.properties;
      var length = properties.length;

      for (var i = 0; i < length; i++) {
        var property = properties[i];
        if (property.key === key) {
          return property;
        }
      }
      return this.getIndexer(key);
    }

    /**
     * Determine whether a property with the given name exists.
     */

  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      var properties = this.properties;
      var length = properties.length;

      for (var i = 0; i < length; i++) {
        var property = properties[i];
        if (property.key === key) {
          return true;
        }
      }
      return this.hasIndexer(key);
    }

    /**
     * Get an indexer with which matches the given key type.
     */

  }, {
    key: 'getIndexer',
    value: function getIndexer(key) {
      var indexers = this.indexers;
      var length = indexers.length;

      for (var i = 0; i < length; i++) {
        var indexer = indexers[i];
        if (indexer.acceptsKey(key)) {
          return indexer;
        }
      }
    }

    /**
     * Determine whether an indexer exists which matches the given key type.
     */

  }, {
    key: 'hasIndexer',
    value: function hasIndexer(key) {
      var indexers = this.indexers;
      var length = indexers.length;

      for (var i = 0; i < length; i++) {
        var indexer = indexers[i];
        if (indexer.acceptsKey(key)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (input === null) {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }

      var hasCallProperties = this.callProperties.length > 0;

      if (hasCallProperties) {
        if (!acceptsCallProperties(this, input)) {
          yield [path, getErrorMessage('ERR_EXPECT_CALLABLE'), this];
        }
      } else if (typeof input !== 'object') {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }

      if (validation.inCycle(this, input)) {
        return;
      }
      validation.startCycle(this, input);

      if (this.indexers.length > 0) {
        yield* collectErrorsWithIndexers(this, validation, path, input);
      } else if (this.exact) {
        yield* collectErrorsExact(this, validation, path, input);
      } else {
        yield* collectErrorsWithoutIndexers(this, validation, path, input);
      }
      validation.endCycle(this, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      if (input === null) {
        return false;
      }
      var hasCallProperties = this.callProperties.length > 0;

      if (hasCallProperties) {
        if (!acceptsCallProperties(this, input)) {
          return false;
        }
      } else if (typeof input !== 'object') {
        return false;
      }
      if (inValidationCycle(this, input)) {
        return true;
      }
      startValidationCycle(this, input);

      var result = void 0;
      if (this.indexers.length > 0) {
        result = acceptsWithIndexers(this, input);
      } else if (this.exact) {
        result = acceptsExact(this, input);
      } else {
        result = acceptsWithoutIndexers(this, input);
      }
      endValidationCycle(this, input);
      return result;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof ObjectType)) {
        return -1;
      }
      var hasCallProperties = this.callProperties.length > 0;

      var isGreater = false;
      if (hasCallProperties) {
        var _result = compareTypeCallProperties(this, input);
        if (_result === -1) {
          return -1;
        } else if (_result === 1) {
          isGreater = true;
        }
      }

      var result = void 0;
      if (this.indexers.length > 0) {
        result = compareTypeWithIndexers(this, input);
      } else {
        result = compareTypeWithoutIndexers(this, input);
      }

      if (result === -1) {
        return -1;
      } else if (isGreater) {
        return 1;
      } else {
        return result;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var callProperties = this.callProperties,
          properties = this.properties,
          indexers = this.indexers;

      if (inToStringCycle(this)) {
        return '$Cycle<Object>';
      }
      startToStringCycle(this);
      var body = [];
      for (var i = 0; i < callProperties.length; i++) {
        body.push(callProperties[i].toString());
      }
      for (var _i = 0; _i < properties.length; _i++) {
        body.push(properties[_i].toString());
      }
      for (var _i2 = 0; _i2 < indexers.length; _i2++) {
        body.push(indexers[_i2].toString());
      }
      endToStringCycle(this);
      if (this.exact) {
        return `{|\n${ indent(body.join('\n')) }\n|}`;
      } else {
        return `{\n${ indent(body.join('\n')) }\n}`;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        callProperties: this.callProperties,
        properties: this.properties,
        indexers: this.indexers,
        exact: this.exact
      };
    }
  }]);
  return ObjectType;
}(Type);

function acceptsCallProperties(type, input) {
  var callProperties = type.callProperties;

  for (var i = 0; i < callProperties.length; i++) {
    var callProperty = callProperties[i];
    if (callProperty.accepts(input)) {
      return true;
    }
  }
  return false;
}

function compareTypeCallProperties(type, input) {
  var callProperties = type.callProperties;

  var inputCallProperties = input.callProperties;
  var identicalCount = 0;
  loop: for (var i = 0; i < callProperties.length; i++) {
    var callProperty = callProperties[i];

    for (var j = 0; j < inputCallProperties.length; j++) {
      var inputCallProperty = inputCallProperties[j];
      var result = compareTypes(callProperty, inputCallProperty);
      if (result === 0) {
        identicalCount++;
        continue loop;
      } else if (result === 1) {
        continue loop;
      }
    }
    // If we got this far, nothing accepted.
    return -1;
  }
  if (identicalCount === callProperties.length) {
    return 0;
  } else {
    return 1;
  }
}

function acceptsWithIndexers(type, input) {
  var properties = type.properties,
      indexers = type.indexers;

  var seen = [];
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    if (!property.accepts(input)) {
      return false;
    }
    seen.push(property.key);
  }
  loop: for (var key in input) {
    if (seen.indexOf(key) !== -1) {
      continue;
    }
    var value = input[key];
    for (var _i3 = 0; _i3 < indexers.length; _i3++) {
      var indexer = indexers[_i3];
      if (indexer.acceptsKey(key) && indexer.acceptsValue(value)) {
        continue loop;
      }
    }

    // if we got this far the key / value did not accepts any indexers.
    return false;
  }
  return true;
}

function compareTypeWithIndexers(type, input) {
  var indexers = type.indexers,
      properties = type.properties;

  var inputIndexers = input.indexers;
  var inputProperties = input.properties;
  var isGreater = false;
  loop: for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    for (var j = 0; j < inputProperties.length; j++) {
      var inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        var result = compareTypes(property, inputProperty);
        if (result === -1) {
          return -1;
        } else if (result === 1) {
          isGreater = true;
        }
        continue loop;
      }
    }
  }
  loop: for (var _i4 = 0; _i4 < indexers.length; _i4++) {
    var indexer = indexers[_i4];
    for (var _j = 0; _j < inputIndexers.length; _j++) {
      var inputIndexer = inputIndexers[_j];
      var _result2 = compareTypes(indexer, inputIndexer);
      if (_result2 === 1) {
        isGreater = true;
        continue loop;
      } else if (_result2 === 0) {
        continue loop;
      }
    }
    // if we got this far, nothing accepted
    return -1;
  }
  return isGreater ? 1 : 0;
}

function acceptsWithoutIndexers(type, input) {
  var properties = type.properties;

  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    if (!property.accepts(input)) {
      return false;
    }
  }
  return true;
}

function acceptsExact(type, input) {
  var properties = type.properties;
  var length = properties.length;

  loop: for (var key in input) {
    // eslint-disable-line guard-for-in
    for (var i = 0; i < length; i++) {
      var property = properties[i];
      if (property.key === key) {
        if (!property.accepts(input)) {
          return false;
        }
        continue loop;
      }
    }
    // if we got this far the property does not exist in the object.
    return false;
  }
  return true;
}

function compareTypeWithoutIndexers(type, input) {
  var properties = type.properties;

  var inputProperties = input.properties;
  var isGreater = false;
  loop: for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    for (var j = 0; j < inputProperties.length; j++) {
      var inputProperty = inputProperties[j];
      if (inputProperty.key === property.key) {
        var result = compareTypes(property, inputProperty);
        if (result === -1) {
          return -1;
        } else if (result === 1) {
          isGreater = true;
        }
        continue loop;
      }
    }
    return -1;
  }
  return isGreater ? 1 : 0;
}

function* collectErrorsWithIndexers(type, validation, path, input) {
  var properties = type.properties,
      indexers = type.indexers;

  var seen = [];
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    yield* property.errors(validation, path, input);
    seen.push(property.key);
  }
  loop: for (var key in input) {
    if (seen.indexOf(key) !== -1) {
      continue;
    }
    var value = input[key];
    for (var _i5 = 0; _i5 < indexers.length; _i5++) {
      var indexer = indexers[_i5];
      if (indexer.acceptsKey(key) && indexer.acceptsValue(value)) {
        continue loop;
      }
    }

    // if we got this far the key / value was not accepted by any indexers.
    yield [path.concat(key), getErrorMessage('ERR_NO_INDEXER'), type];
  }
}

function* collectErrorsWithoutIndexers(type, validation, path, input) {
  var properties = type.properties;

  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    yield* property.errors(validation, path, input);
  }
}

function* collectErrorsExact(type, validation, path, input) {
  var properties = type.properties;
  var length = properties.length;

  loop: for (var key in input) {
    // eslint-disable-line guard-for-in
    for (var i = 0; i < length; i++) {
      var property = properties[i];
      if (property.key === key) {
        yield* property.errors(validation, path, input);
        continue loop;
      }
    }
    // if we got this far the property does not exist in the object.
    yield [path, getErrorMessage('ERR_UNKNOWN_KEY', key), type];
  }
}

function indent(input) {
  var lines = input.split('\n');
  var length = lines.length;

  for (var i = 0; i < length; i++) {
    lines[i] = `  ${ lines[i] }`;
  }
  return lines.join('\n');
}

var IntersectionType = function (_Type) {
  inherits(IntersectionType, _Type);

  function IntersectionType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, IntersectionType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = IntersectionType.__proto__ || Object.getPrototypeOf(IntersectionType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'IntersectionType', _this.types = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(IntersectionType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var types = this.types;
      var length = types.length;

      for (var i = 0; i < length; i++) {
        yield* types[i].errors(validation, path, input);
      }
    }

    /**
     * Get a property with the given name, or undefined if it does not exist.
     */

  }, {
    key: 'getProperty',
    value: function getProperty(key) {
      var types = this.types;
      var length = types.length;

      for (var i = length - 1; i >= 0; i--) {
        var type = types[i];
        if (typeof type.getProperty === 'function') {
          var prop = type.getProperty(key);
          if (prop) {
            return prop;
          }
        }
      }
    }

    /**
     * Determine whether a property with the given name exists.
     */

  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      var types = this.types;
      var length = types.length;

      for (var i = 0; i < length; i++) {
        var type = types[i];
        if (typeof type.hasProperty === 'function' && type.hasProperty(key)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var types = this.types;
      var length = types.length;

      for (var i = 0; i < length; i++) {
        var type = types[i];
        if (!type.accepts(input)) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var types = this.types;
      var identicalCount = 0;
      if (input instanceof IntersectionType) {
        var inputTypes = input.types;
        loop: for (var i = 0; i < types.length; i++) {
          var type = types[i];
          for (var j = 0; j < inputTypes.length; j++) {
            var result = compareTypes(type, inputTypes[i]);
            if (result === 0) {
              identicalCount++;
              continue loop;
            } else if (result === 1) {
              continue loop;
            }
          }
          // if we got this far then nothing accepted this type.
          return -1;
        }
        return identicalCount === types.length ? 0 : 1;
      } else {
        for (var _i = 0; _i < types.length; _i++) {
          var _type = types[_i];
          var _result = compareTypes(_type, input);
          if (_result === -1) {
            return -1;
          } else if (_result === 0) {
            identicalCount++;
          }
        }
        return identicalCount === types.length ? 0 : 1;
      }
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var _ref2;

      var callProperties = [];
      var properties = [];
      var indexers = [];
      var types = this.types,
          context = this.context;

      for (var i = 0; i < types.length; i++) {
        var type = types[i].unwrap();
        invariant(type instanceof ObjectType, 'Can only intersect object types');
        callProperties.push.apply(callProperties, toConsumableArray(type.callProperties));
        indexers.push.apply(indexers, toConsumableArray(type.indexers));
        mergeProperties(properties, type.properties);
      }
      return (_ref2 = context).object.apply(_ref2, callProperties.concat(properties, indexers));
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.types.join(' & ');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        types: this.types
      };
    }
  }]);
  return IntersectionType;
}(Type);

function getPropertyIndex(name, properties) {
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].name === name) {
      return i;
    }
  }
  return -1;
}

function mergeProperties(target, source) {
  for (var i = 0; i < source.length; i++) {
    var typeProp = source[i];
    var index = getPropertyIndex(typeProp.key, target);
    if (index === -1) {
      target.push(typeProp);
    } else {
      target[index] = typeProp;
    }
  }
  return target;
}

var MixedType = function (_Type) {
  inherits(MixedType, _Type);

  function MixedType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, MixedType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = MixedType.__proto__ || Object.getPrototypeOf(MixedType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'MixedType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(MixedType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {}
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return true;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'mixed';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return MixedType;
}(Type);

var TypeAlias = function (_Type) {
  inherits(TypeAlias, _Type);

  function TypeAlias() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeAlias);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeAlias.__proto__ || Object.getPrototypeOf(TypeAlias)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeAlias', _this.constraints = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeAlias, [{
    key: 'addConstraint',
    value: function addConstraint() {
      for (var _len2 = arguments.length, constraints = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        constraints[_key2] = arguments[_key2];
      }

      addConstraints.apply(undefined, [this].concat(toConsumableArray(constraints)));
      return this;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;

      var hasErrors = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = type.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          hasErrors = true;
          yield error;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasErrors) {
        yield* collectConstraintErrors(this, validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      if (!type.accepts(input)) {
        return false;
      } else if (!constraintsAccept(this, input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input === this) {
        return 0; // should never need this because it's taken care of by compareTypes.
      } else if (this.hasConstraints) {
        // if we have constraints the types cannot be the same
        return -1;
      } else {
        return compareTypes(this.type, input);
      }
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len3 = arguments.length, typeInstances = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        typeInstances[_key3] = arguments[_key3];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.hasProperty === 'function') {
        return inner.hasProperty(name);
      } else {
        return false;
      }
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.getProperty === 'function') {
        return inner.getProperty(name);
      }
    }
  }, {
    key: 'toString',
    value: function toString(withDeclaration) {
      var name = this.name,
          type = this.type;

      if (withDeclaration) {
        return `type ${ name } = ${ type.toString() };`;
      } else {
        return name;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        name: this.name,
        type: this.type
      };
    }
  }, {
    key: 'hasConstraints',
    get: function get$$1() {
      return this.constraints.length > 0;
    }
  }]);
  return TypeAlias;
}(Type);

var NullLiteralType = function (_Type) {
  inherits(NullLiteralType, _Type);

  function NullLiteralType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NullLiteralType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NullLiteralType.__proto__ || Object.getPrototypeOf(NullLiteralType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'NullLiteralType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NullLiteralType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (input !== null) {
        yield [path, getErrorMessage('ERR_EXPECT_NULL'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === null;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof NullLiteralType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'null';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return NullLiteralType;
}(Type);

var VoidType = function (_Type) {
  inherits(VoidType, _Type);

  function VoidType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, VoidType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = VoidType.__proto__ || Object.getPrototypeOf(VoidType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'VoidType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(VoidType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (input !== undefined) {
        yield [path, getErrorMessage('ERR_EXPECT_VOID'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === undefined;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof VoidType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'void';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return VoidType;
}(Type);

var NullableType = function (_Type) {
  inherits(NullableType, _Type);

  function NullableType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NullableType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NullableType.__proto__ || Object.getPrototypeOf(NullableType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'NullableType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NullableType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (input != null) {
        yield* this.type.errors(validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      if (input == null) {
        return true;
      } else {
        return this.type.accepts(input);
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof NullLiteralType || input instanceof VoidType) {
        return 1;
      } else if (input instanceof NullableType) {
        return compareTypes(this.type, input.type);
      } else {
        var result = compareTypes(this.type, input);
        if (result === -1) {
          return -1;
        } else {
          return 1;
        }
      }
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `? ${ this.type.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return NullableType;
}(Type);

var NumericLiteralType = function (_Type) {
  inherits(NumericLiteralType, _Type);

  function NumericLiteralType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NumericLiteralType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NumericLiteralType.__proto__ || Object.getPrototypeOf(NumericLiteralType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'NumericLiteralType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NumericLiteralType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var value = this.value;

      if (input !== value) {
        yield [path, getErrorMessage('ERR_EXPECT_EXACT_VALUE', value), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === this.value;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof NumericLiteralType && input.value === this.value) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `${ this.value }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        value: this.value
      };
    }
  }]);
  return NumericLiteralType;
}(Type);

var NumberType = function (_Type) {
  inherits(NumberType, _Type);

  function NumberType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, NumberType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = NumberType.__proto__ || Object.getPrototypeOf(NumberType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'NumberType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(NumberType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (typeof input !== 'number') {
        yield [path, getErrorMessage('ERR_EXPECT_NUMBER'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return typeof input === 'number';
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof NumberType) {
        return 0;
      } else if (input instanceof NumericLiteralType) {
        return 1;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'number';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return NumberType;
}(Type);

var PartialType = function (_Type) {
  inherits(PartialType, _Type);

  function PartialType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, PartialType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = PartialType.__proto__ || Object.getPrototypeOf(PartialType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'PartialType', _this.typeParameters = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(PartialType, [{
    key: 'typeParameter',
    value: function typeParameter(id, bound, defaultType) {
      var target = new TypeParameter(this.context);
      target.id = id;
      target.bound = bound;
      target.default = defaultType;
      this.typeParameters.push(target);
      return target;
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      var constraints = this.constraints,
          type = this.type;

      var hasErrors = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = type.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          hasErrors = true;
          yield error;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasErrors && constraints) {
        yield* collectConstraintErrors(this, validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var constraints = this.constraints,
          type = this.type;

      if (!type.accepts(input)) {
        return false;
      } else if (constraints && !constraintsAccept(this, input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input === this) {
        return 0;
      } else {
        return compareTypes(this.type, input);
      }
    }
  }, {
    key: 'toString',
    value: function toString(expand) {
      var type = this.type;

      return type.toString(expand);
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        typeParameters: this.typeParameters,
        type: this.type
      };
    }
  }]);
  return PartialType;
}(Type);

var ParameterizedTypeAlias = function (_TypeAlias) {
  inherits(ParameterizedTypeAlias, _TypeAlias);

  function ParameterizedTypeAlias() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ParameterizedTypeAlias);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ParameterizedTypeAlias.__proto__ || Object.getPrototypeOf(ParameterizedTypeAlias)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ParameterizedTypeAlias', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ParameterizedTypeAlias, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      for (var _len2 = arguments.length, typeInstances = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        typeInstances[_key2 - 3] = arguments[_key2];
      }

      yield* getPartial.apply(undefined, [this].concat(toConsumableArray(typeInstances))).errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      for (var _len3 = arguments.length, typeInstances = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        typeInstances[_key3 - 1] = arguments[_key3];
      }

      var partial = getPartial.apply(undefined, [this].concat(toConsumableArray(typeInstances)));
      if (!partial.accepts(input)) {
        return false;
      } else if (!constraintsAccept(this, input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input === this) {
        return 0; // should never need this because it's taken care of by compareTypes.
      } else if (this.hasConstraints) {
        // if we have constraints the types cannot be the same
        return -1;
      } else {
        return compareTypes(getPartial(this), input);
      }
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      for (var _len4 = arguments.length, typeInstances = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        typeInstances[_key4 - 1] = arguments[_key4];
      }

      var inner = this.unwrap.apply(this, toConsumableArray(typeInstances));
      if (inner && typeof inner.hasProperty === 'function') {
        return inner.hasProperty.apply(inner, [name].concat(toConsumableArray(typeInstances)));
      } else {
        return false;
      }
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      for (var _len5 = arguments.length, typeInstances = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        typeInstances[_key5 - 1] = arguments[_key5];
      }

      var inner = this.unwrap.apply(this, toConsumableArray(typeInstances));
      if (inner && typeof inner.getProperty === 'function') {
        return inner.getProperty.apply(inner, [name].concat(toConsumableArray(typeInstances)));
      }
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      for (var _len6 = arguments.length, typeInstances = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        typeInstances[_key6] = arguments[_key6];
      }

      return getPartial.apply(undefined, [this].concat(toConsumableArray(typeInstances))).unwrap();
    }
  }, {
    key: 'toString',
    value: function toString(withDeclaration) {
      var partial = getPartial(this);
      var typeParameters = partial.typeParameters;

      var items = [];
      for (var i = 0; i < typeParameters.length; i++) {
        var typeParameter = typeParameters[i];
        items.push(typeParameter.toString(true));
      }

      var name = this.name;

      var identifier = typeParameters.length > 0 ? `${ name }<${ items.join(', ') }>` : name;

      if (withDeclaration) {
        return `type ${ identifier } = ${ partial.toString() };`;
      } else {
        return identifier;
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var partial = getPartial(this);
      return partial.toJSON();
    }
  }]);
  return ParameterizedTypeAlias;
}(TypeAlias);

function getPartial(parent) {
  var typeCreator = parent.typeCreator,
      context = parent.context,
      name = parent.name;

  var partial = new PartialType(context);
  partial.name = name;
  partial.type = typeCreator(partial);
  partial.constraints = parent.constraints;

  var typeParameters = partial.typeParameters;

  for (var _len7 = arguments.length, typeInstances = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    typeInstances[_key7 - 1] = arguments[_key7];
  }

  var limit = Math.min(typeInstances.length, typeParameters.length);
  for (var i = 0; i < limit; i++) {
    var typeParameter = typeParameters[i];
    var typeInstance = typeInstances[i];
    if (typeParameter.bound && typeParameter.bound !== typeInstance) {
      // if the type parameter is already bound we need to
      // create an intersection type with this one.
      typeParameter.bound = context.intersect(typeParameter.bound, typeInstance);
    } else {
      typeParameter.bound = typeInstance;
    }
  }

  return partial;
}

var ParameterizedFunctionType = function (_Type) {
  inherits(ParameterizedFunctionType, _Type);

  function ParameterizedFunctionType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ParameterizedFunctionType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ParameterizedFunctionType.__proto__ || Object.getPrototypeOf(ParameterizedFunctionType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ParameterizedFunctionType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ParameterizedFunctionType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      for (var _len2 = arguments.length, typeInstances = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        typeInstances[_key2 - 3] = arguments[_key2];
      }

      yield* getPartial$1.apply(undefined, [this].concat(toConsumableArray(typeInstances))).errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      for (var _len3 = arguments.length, typeInstances = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        typeInstances[_key3 - 1] = arguments[_key3];
      }

      return getPartial$1.apply(undefined, [this].concat(toConsumableArray(typeInstances))).accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(getPartial$1(this), input);
    }
  }, {
    key: 'acceptsParams',
    value: function acceptsParams() {
      var _getPartial$type;

      return (_getPartial$type = getPartial$1(this).type).acceptsParams.apply(_getPartial$type, arguments);
    }
  }, {
    key: 'acceptsReturn',
    value: function acceptsReturn(input) {
      return getPartial$1(this).type.acceptsReturn(input);
    }
  }, {
    key: 'assertParams',
    value: function assertParams() {
      var _getPartial$type2;

      return (_getPartial$type2 = getPartial$1(this).type).assertParams.apply(_getPartial$type2, arguments);
    }
  }, {
    key: 'assertReturn',
    value: function assertReturn(input) {
      return getPartial$1(this).type.assertReturn(input);
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      for (var _len4 = arguments.length, typeInstances = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        typeInstances[_key4] = arguments[_key4];
      }

      return getPartial$1.apply(undefined, [this].concat(toConsumableArray(typeInstances))).unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      var partial = getPartial$1(this);
      var type = partial.type,
          typeParameters = partial.typeParameters;

      if (typeParameters.length === 0) {
        return type.toString();
      }
      var items = [];
      for (var i = 0; i < typeParameters.length; i++) {
        var typeParameter = typeParameters[i];
        items.push(typeParameter.toString(true));
      }
      return `<${ items.join(', ') }> ${ type.toString() }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var partial = getPartial$1(this);
      return partial.toJSON();
    }
  }, {
    key: 'typeParameters',
    get: function get$$1() {
      return getPartial$1(this).typeParameters;
    }
  }, {
    key: 'params',
    get: function get$$1() {
      return getPartial$1(this).type.params;
    }
  }, {
    key: 'rest',
    get: function get$$1() {
      return getPartial$1(this).type.rest;
    }
  }, {
    key: 'returnType',
    get: function get$$1() {
      return getPartial$1(this).type.returnType;
    }
  }]);
  return ParameterizedFunctionType;
}(Type);

function getPartial$1(parent) {
  var context = parent.context,
      bodyCreator = parent.bodyCreator;

  var partial = new PartialType(context);
  var body = bodyCreator(partial);
  partial.type = context.function.apply(context, toConsumableArray(body));

  var typeParameters = partial.typeParameters;

  for (var _len5 = arguments.length, typeInstances = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    typeInstances[_key5 - 1] = arguments[_key5];
  }

  var limit = Math.min(typeInstances.length, typeParameters.length);
  for (var i = 0; i < limit; i++) {
    var typeParameter = typeParameters[i];
    var typeInstance = typeInstances[i];
    if (typeParameter.bound && typeParameter.bound !== typeInstance) {
      // if the type parameter is already bound we need to
      // create an intersection type with this one.
      typeParameter.bound = context.intersect(typeParameter.bound, typeInstance);
    } else {
      typeParameter.bound = typeInstance;
    }
  }

  return partial;
}

var RefinementType = function (_Type) {
  inherits(RefinementType, _Type);

  function RefinementType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, RefinementType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = RefinementType.__proto__ || Object.getPrototypeOf(RefinementType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'RefinementType', _this.constraints = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(RefinementType, [{
    key: 'addConstraint',
    value: function addConstraint() {
      for (var _len2 = arguments.length, constraints = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        constraints[_key2] = arguments[_key2];
      }

      addConstraints.apply(undefined, [this].concat(toConsumableArray(constraints)));
      return this;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;

      var hasErrors = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = type.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          hasErrors = true;
          yield error;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasErrors) {
        yield* collectConstraintErrors(this, validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      if (!type.accepts(input)) {
        return false;
      } else if (!constraintsAccept(this, input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input === this) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len3 = arguments.length, typeInstances = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        typeInstances[_key3] = arguments[_key3];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.hasProperty === 'function') {
        return inner.hasProperty(name);
      } else {
        return false;
      }
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.getProperty === 'function') {
        return inner.getProperty(name);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var type = this.type;

      return `$Refinment<${ type.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return RefinementType;
}(Type);

var StringLiteralType = function (_Type) {
  inherits(StringLiteralType, _Type);

  function StringLiteralType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, StringLiteralType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = StringLiteralType.__proto__ || Object.getPrototypeOf(StringLiteralType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'StringLiteralType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(StringLiteralType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var value = this.value;

      if (input !== value) {
        yield [path, getErrorMessage('ERR_EXPECT_EXACT_VALUE', this.toString()), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === this.value;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof StringLiteralType && input.value === this.value) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify(this.value);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        value: this.value
      };
    }
  }]);
  return StringLiteralType;
}(Type);

var StringType = function (_Type) {
  inherits(StringType, _Type);

  function StringType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, StringType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = StringType.__proto__ || Object.getPrototypeOf(StringType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'StringType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(StringType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      if (typeof input !== 'string') {
        yield [path, getErrorMessage('ERR_EXPECT_STRING'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return typeof input === 'string';
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof StringLiteralType) {
        return 1;
      } else if (input instanceof StringType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'string';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return StringType;
}(Type);

var SymbolLiteralType = function (_Type) {
  inherits(SymbolLiteralType, _Type);

  function SymbolLiteralType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, SymbolLiteralType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = SymbolLiteralType.__proto__ || Object.getPrototypeOf(SymbolLiteralType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'SymbolLiteralType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(SymbolLiteralType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var value = this.value;

      if (input !== value) {
        yield [path, getErrorMessage('ERR_EXPECT_EXACT_VALUE', this.toString()), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return input === this.value;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof SymbolLiteralType && input.value === this.value) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `typeof ${ String(this.value) }`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        value: this.value
      };
    }
  }]);
  return SymbolLiteralType;
}(Type);

var SymbolType = function (_Type) {
  inherits(SymbolType, _Type);

  function SymbolType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, SymbolType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = SymbolType.__proto__ || Object.getPrototypeOf(SymbolType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'SymbolType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(SymbolType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      // Issue 252
      if (typeof input !== 'symbol') {
        yield [path, getErrorMessage('ERR_EXPECT_SYMBOL'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return typeof input === 'symbol';
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (input instanceof SymbolLiteralType) {
        return 1;
      } else if (input instanceof SymbolType) {
        return 0;
      } else {
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'Symbol';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return SymbolType;
}(Type);

/**
 * # ThisType
 * Captures a reference to a particular instance of a class or a value,
 * and uses that value to perform an identity check.
 * In the case that `this` is undefined, any value will be permitted.
 */

var ThisType = function (_Type) {
  inherits(ThisType, _Type);

  function ThisType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ThisType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ThisType.__proto__ || Object.getPrototypeOf(ThisType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ThisType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ThisType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var recorded = this.recorded;

      if (input === recorded) {
        return;
      } else if (typeof recorded === 'function' && input instanceof recorded) {
        return;
      } else if (recorded != null) {
        yield [path, getErrorMessage('ERR_EXPECT_THIS'), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var recorded = this.recorded;

      if (input === recorded) {
        return true;
      } else if (typeof recorded === 'function' && input instanceof recorded) {
        return true;
      } else if (recorded != null) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      if (!(input instanceof ThisType)) {
        return -1;
      } else if (input.recorded && this.recorded) {
        return input.recorded === this.recorded ? 0 : -1;
      } else if (this.recorded) {
        return 0;
      } else {
        return 1;
      }
    }

    /**
     * Get the inner type.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this;
    }
  }, {
    key: 'toString',
    value: function toString(withBinding) {
      return 'this';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return ThisType;
}(Type);

var warnedInstances$1 = new WeakSet();

var TypeBox = function (_Type) {
  inherits(TypeBox, _Type);

  function TypeBox() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeBox.__proto__ || Object.getPrototypeOf(TypeBox)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeBox', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeBox, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.type, input);
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this.type;

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.type.toString();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.type.toJSON();
    }
  }, {
    key: 'name',
    get: function get$$1() {
      return this.type.name;
    }
  }, {
    key: 'type',
    get: function get$$1() {
      var reveal = this.reveal;

      var type = reveal();
      if (!type) {
        if (!warnedInstances$1.has(this)) {
          this.context.emitWarningMessage('Failed to reveal boxed type.');
          warnedInstances$1.add(this);
        }
        return this.context.mixed();
      } else if (!(type instanceof Type)) {
        // we got a boxed reference to something like a class
        return this.context.ref(type);
      }
      return type;
    }
  }]);
  return TypeBox;
}(Type);

var warnedMissing = {};

var TypeReference = function (_Type) {
  inherits(TypeReference, _Type);

  function TypeReference() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeReference);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeReference.__proto__ || Object.getPrototypeOf(TypeReference)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeReference', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeReference, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.type, input);
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        name: this.name
      };
    }
  }, {
    key: 'type',
    get: function get$$1() {
      var context = this.context,
          name = this.name;

      var type = context.get(name);
      if (!type) {
        if (!warnedMissing[name]) {
          context.emitWarningMessage(`Cannot resolve type: ${ name }`);
          warnedMissing[name] = true;
        }
        return context.any();
      }
      return type;
    }
  }]);
  return TypeReference;
}(Type);

var warnedInstances$2 = new WeakSet();

var RevealedName = Symbol('RevealedName');
var RevealedValue = Symbol('RevealedValue');

var TypeTDZ = function (_Type) {
  inherits(TypeTDZ, _Type);

  function TypeTDZ() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeTDZ);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeTDZ.__proto__ || Object.getPrototypeOf(TypeTDZ)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeTDZ', _this[RevealedName] = undefined, _this[RevealedValue] = undefined, _temp), possibleConstructorReturn(_this, _ret);
  }

  // Issue 252


  // Issue 252


  createClass(TypeTDZ, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* getRevealed(this).errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return getRevealed(this).accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(getRevealed(this), input);
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = getRevealed(this);

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      return getRevealed(this).unwrap();
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.hasProperty === 'function') {
        return inner.hasProperty(name);
      } else {
        return false;
      }
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      var inner = this.unwrap();
      if (inner && typeof inner.getProperty === 'function') {
        return inner.getProperty(name);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return getRevealed(this).toString();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return getRevealed(this).toJSON();
    }
  }, {
    key: 'name',
    get: function get$$1() {
      var name = this[RevealedName];
      if (!name) {
        name = getRevealed(this).name;
      }
      return name;
    },
    set: function set$$1(value) {
      this[RevealedName] = value;
    }
  }]);
  return TypeTDZ;
}(Type);

function getRevealed(container) {
  var existing = container[RevealedValue];
  if (existing) {
    return existing;
  } else {
    var reveal = container.reveal;

    var type = reveal();
    if (!type) {
      if (!warnedInstances$2.has(container)) {
        var name = container[RevealedName];
        if (name) {
          container.context.emitWarningMessage(`Failed to reveal type called "${ name }" in Temporal Dead Zone.`);
        } else {
          container.context.emitWarningMessage('Failed to reveal unknown type in Temporal Dead Zone.');
        }
        warnedInstances$2.add(container);
      }
      return container.context.mixed();
    } else if (!(type instanceof Type)) {
      // we got a boxed reference to something like a class
      return container.context.ref(type);
    }
    return type;
  }
}

var UnionType = function (_Type) {
  inherits(UnionType, _Type);

  function UnionType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, UnionType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = UnionType.__proto__ || Object.getPrototypeOf(UnionType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'UnionType', _this.types = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(UnionType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var types = this.types;
      var length = types.length;

      for (var i = 0; i < length; i++) {
        var type = types[i];
        if (type.accepts(input)) {
          return;
        }
      }
      yield [path, getErrorMessage('ERR_NO_UNION', this.toString()), this];
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var types = this.types;
      var length = types.length;

      for (var i = 0; i < length; i++) {
        var type = types[i];
        if (type.accepts(input)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var types = this.types;
      if (input instanceof UnionType) {
        var inputTypes = input.types;
        var identicalCount = 0;
        loop: for (var i = 0; i < types.length; i++) {
          var type = types[i];
          for (var j = 0; j < inputTypes.length; j++) {
            var result = compareTypes(type, inputTypes[i]);
            if (result === 0) {
              identicalCount++;
              continue loop;
            } else if (result === 1) {
              continue loop;
            }
          }
          // if we got this far then nothing accepted this type.
          return -1;
        }

        if (identicalCount === types.length) {
          return 0;
        } else {
          return 1;
        }
      } else {
        for (var _i = 0; _i < types.length; _i++) {
          var _type = types[_i];
          if (compareTypes(_type, input) >= 0) {
            return 1;
          }
        }
        return -1;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var types = this.types;

      var normalized = new Array(types.length);
      for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if (type.typeName === 'FunctionType' || type.typeName === 'ParameterizedFunctionType') {
          normalized[i] = `(${ type.toString() })`;
        } else {
          normalized[i] = type.toString();
        }
      }
      return normalized.join(' | ');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        types: this.types
      };
    }
  }]);
  return UnionType;
}(Type);

function registerPrimitiveTypes(t) {
  primitiveTypes.null = Object.freeze(new NullLiteralType(t));
  primitiveTypes.empty = Object.freeze(new EmptyType(t));
  primitiveTypes.number = Object.freeze(new NumberType(t));
  primitiveTypes.boolean = Object.freeze(new BooleanType(t));
  primitiveTypes.string = Object.freeze(new StringType(t));
  primitiveTypes.symbol = Object.freeze(new SymbolType(t));
  primitiveTypes.any = Object.freeze(new AnyType(t));
  primitiveTypes.mixed = Object.freeze(new MixedType(t));
  primitiveTypes.void = Object.freeze(new VoidType(t));
  primitiveTypes.existential = Object.freeze(new ExistentialType(t));
  return t;
}

function registerBuiltinTypeConstructors(t) {

  t.declareTypeConstructor({
    name: 'Date',
    impl: Date,
    typeName: 'DateType',
    *errors(validation, path, input) {
      if (!(input instanceof Date)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Date'), this];
      } else if (isNaN(input.getTime())) {
        yield [path, getErrorMessage('ERR_INVALID_DATE'), this];
      }
    },
    accepts(input) {
      return input instanceof Date && !isNaN(input.getTime());
    },
    inferTypeParameters(input) {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Promise',
    impl: Promise,
    typeName: 'PromiseType',
    *errors(validation, path, input, futureType) {
      invariant(futureType, 'Must specify type parameter for Promise.');
      var context = this.context;

      if (!context.checkPredicate('Promise', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_PROMISE', futureType), this];
      }
    },
    accepts(input) {
      var context = this.context;

      return context.checkPredicate('Promise', input);
    },
    inferTypeParameters(input) {
      return [];
    }
  });

  t.declareTypeConstructor({
    name: 'Map',
    impl: Map,
    typeName: 'MapType',
    *errors(validation, path, input, keyType, valueType) {
      invariant(keyType, 'Must specify two type parameters for Map.');
      invariant(valueType, 'Must specify two type parameters for Map.');
      var context = this.context;

      if (!context.checkPredicate('Map', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Map'), this];
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = slicedToArray(_ref, 2);

          var key = _ref2[0];
          var value = _ref2[1];

          if (!keyType.accepts(key)) {
            yield [path, getErrorMessage('ERR_EXPECT_KEY_TYPE', keyType), this];
          }

          yield* valueType.errors(validation, path.concat(key), value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    accepts(input, keyType, valueType) {
      var context = this.context;

      if (!context.checkPredicate('Map', input)) {
        return false;
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref3 = _step2.value;

          var _ref4 = slicedToArray(_ref3, 2);

          var key = _ref4[0];
          var value = _ref4[1];

          if (!keyType.accepts(key) || !valueType.accepts(value)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    },
    inferTypeParameters(input) {
      var keyTypes = [];
      var valueTypes = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        loop: for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _ref5 = _step3.value;

          var _ref6 = slicedToArray(_ref5, 2);

          var key = _ref6[0];
          var value = _ref6[1];

          findKey: {
            for (var i = 0; i < keyTypes.length; i++) {
              var type = keyTypes[i];
              if (type.accepts(key)) {
                break findKey;
              }
            }
            keyTypes.push(t.typeOf(key));
          }

          for (var _i = 0; _i < valueTypes.length; _i++) {
            var _type = valueTypes[_i];
            if (_type.accepts(value)) {
              continue loop;
            }
          }
          valueTypes.push(t.typeOf(value));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var typeInstances = [];

      if (keyTypes.length === 0) {
        typeInstances.push(t.existential());
      } else if (keyTypes.length === 1) {
        typeInstances.push(keyTypes[0]);
      } else {
        typeInstances.push(t.union.apply(t, keyTypes));
      }

      if (valueTypes.length === 0) {
        typeInstances.push(t.existential());
      } else if (valueTypes.length === 1) {
        typeInstances.push(valueTypes[0]);
      } else {
        typeInstances.push(t.union.apply(t, valueTypes));
      }

      return typeInstances;
    }
  });

  t.declareTypeConstructor({
    name: 'Set',
    impl: Set,
    typeName: 'SetType',
    *errors(validation, path, input, valueType) {
      invariant(valueType, 'Must specify type parameter for Set.');
      var context = this.context;

      if (!context.checkPredicate('Set', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', 'Set'), this];
        return;
      }
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = input[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var value = _step4.value;

          yield* valueType.errors(validation, path, value);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    },
    accepts(input, valueType) {
      var context = this.context;

      if (!context.checkPredicate('Set', input)) {
        return false;
      }
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = input[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var value = _step5.value;

          if (!valueType.accepts(value)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return true;
    },
    inferTypeParameters(input) {
      var valueTypes = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        loop: for (var _iterator6 = input[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var value = _step6.value;

          for (var i = 0; i < valueTypes.length; i++) {
            var type = valueTypes[i];
            if (type.accepts(value)) {
              continue loop;
            }
          }
          valueTypes.push(t.typeOf(value));
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      if (valueTypes.length === 0) {
        return [t.existential()];
      } else if (valueTypes.length === 1) {
        return [valueTypes[0]];
      } else {
        return [t.union.apply(t, valueTypes)];
      }
    }
  });

  return t;
}

function registerTypePredicates(context) {
  context.setPredicate('Array', function (input) {
    return Array.isArray(input);
  });
  context.setPredicate('Map', function (input) {
    return input instanceof Map;
  });
  context.setPredicate('Set', function (input) {
    return input instanceof Set;
  });
  context.setPredicate('Promise', function (input) {
    if (input instanceof Promise) {
      return true;
    } else if (input !== null && typeof input === 'object' && typeof input.then === 'function') {
      return input.then.length >= 2;
    } else {
      return false;
    }
  });
}

var TypeInferer = function () {
  function TypeInferer(context) {
    classCallCheck(this, TypeInferer);

    this.context = context;
  }

  createClass(TypeInferer, [{
    key: 'infer',
    value: function infer(input) {
      var primitive = this.inferPrimitive(input);
      if (primitive) {
        return primitive;
      }
      var inferred = new Map();
      return this.inferComplex(input, inferred);
    }
  }, {
    key: 'inferInternal',
    value: function inferInternal(input, inferred) {
      var primitive = this.inferPrimitive(input);
      if (primitive) {
        return primitive;
      }
      return this.inferComplex(input, inferred);
    }
  }, {
    key: 'inferPrimitive',
    value: function inferPrimitive(input) {
      var context = this.context;

      if (input === null) {
        return context.null();
      } else if (input === undefined) {
        return context.void();
      } else if (typeof input === 'number') {
        return context.number();
      } else if (typeof input === 'boolean') {
        return context.boolean();
      } else if (typeof input === 'string') {
        return context.string();
      }
      // Issue 252
      else if (typeof input === 'symbol') {
          return context.symbol(input);
        } else {
          return undefined;
        }
    }
  }, {
    key: 'inferComplex',
    value: function inferComplex(input, inferred) {
      var context = this.context;


      if (typeof input === 'function') {
        return this.inferFunction(input, inferred);
      } else if (input !== null && typeof input === 'object') {
        return this.inferObject(input, inferred);
      } else {
        return context.any();
      }
    }
  }, {
    key: 'inferFunction',
    value: function inferFunction(input, inferred) {
      var context = this.context;
      var length = input.length;

      var body = new Array(length + 1);
      for (var i = 0; i < length; i++) {
        body[i] = context.param(String.fromCharCode(97 + i), context.existential());
      }
      body[length] = context.return(context.existential());
      return context.fn.apply(context, body);
    }
  }, {
    key: 'inferObject',
    value: function inferObject(input, inferred) {
      var existing = inferred.get(input);
      if (existing) {
        return existing;
      }
      var context = this.context;

      var type = void 0;

      // Temporarily create a box for this type to catch cyclical references.
      // Nested references to this object will receive the boxed type.
      var box = context.box(function () {
        return type;
      });
      inferred.set(input, box);

      if (context.checkPredicate('Array', input)) {
        type = this.inferArray(input, inferred);
      } else if (!(input instanceof Object)) {
        type = this.inferDict(input, inferred);
      } else if (input.constructor !== Object) {
        var handler = context.getTypeConstructor(input.constructor);
        if (handler) {
          var typeParameters = handler.inferTypeParameters(input);
          type = handler.apply.apply(handler, toConsumableArray(typeParameters));
        } else {
          type = context.ref(input.constructor);
        }
      } else {
        var body = [];
        for (var key in input) {
          // eslint-disable-line
          var value = input[key];
          body.push(context.property(key, this.inferInternal(value, inferred)));
        }
        type = context.object.apply(context, body);
      }

      // Overwrite the box with the real value.
      inferred.set(input, type);
      return type;
    }
  }, {
    key: 'inferDict',
    value: function inferDict(input, inferred) {
      var numericIndexers = [];
      var stringIndexers = [];
      loop: for (var key in input) {
        // eslint-disable-line
        var value = input[key];
        var types = isNaN(+key) ? stringIndexers : numericIndexers;
        for (var i = 0; i < types.length; i++) {
          var type = types[i];
          if (type.accepts(value)) {
            continue loop;
          }
        }
        types.push(this.inferInternal(value, inferred));
      }

      var context = this.context;

      var body = [];
      if (numericIndexers.length === 1) {
        body.push(context.indexer('index', context.number(), numericIndexers[0]));
      } else if (numericIndexers.length > 1) {
        body.push(context.indexer('index', context.number(), context.union.apply(context, numericIndexers)));
      }

      if (stringIndexers.length === 1) {
        body.push(context.indexer('key', context.string(), stringIndexers[0]));
      } else if (stringIndexers.length > 1) {
        body.push(context.indexer('key', context.string(), context.union.apply(context, stringIndexers)));
      }

      return context.object.apply(context, body);
    }
  }, {
    key: 'inferArray',
    value: function inferArray(input, inferred) {
      var context = this.context;

      var types = [];
      var values = [];
      var length = input.length;

      loop: for (var i = 0; i < length; i++) {
        var item = input[i];
        var inferredType = this.inferInternal(item, inferred);
        for (var j = 0; j < types.length; j++) {
          var type = types[j];
          if (type.accepts(item) && inferredType.accepts(values[j])) {
            continue loop;
          }
        }
        types.push(inferredType);
        values.push(item);
      }
      if (types.length === 0) {
        return context.array(context.any());
      } else if (types.length === 1) {
        return context.array(types[0]);
      } else {
        return context.array(context.union.apply(context, types));
      }
    }
  }]);
  return TypeInferer;
}();

function makeReactPropTypes(objectType) {
  var output = {};

  var _loop = function _loop(property) {
    output[property.key] = function (props, propName, componentName) {
      return makeError(property, props);
    };
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = objectType.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      _loop(property);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return output;
}

var delimiter$1 = '\n-------------------------------------------------\n\n';

function makeWarningMessage(validation) {
  if (!validation.hasErrors()) {
    return;
  }
  var input = validation.input,
      context = validation.context;

  var collected = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = validation.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = slicedToArray(_ref, 3);

      var path = _ref2[0];
      var message = _ref2[1];
      var expectedType = _ref2[2];

      var expected = expectedType ? expectedType.toString() : "*";
      var actual = context.typeOf(_resolvePath(input, path)).toString();

      var field = stringifyPath(validation.path.concat(path));

      collected.push(`${ field } ${ message }\n\nExpected: ${ expected }\n\nActual: ${ actual }\n`);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return `Warning: ${ collected.join(delimiter$1) }`;
}

function makeUnion(context, types) {
  var length = types.length;
  var merged = [];
  for (var i = 0; i < length; i++) {
    var type = types[i];
    if (type instanceof UnionType) {
      mergeUnionTypes(merged, type.types);
    } else {
      merged.push(type);
    }
  }
  var union = new UnionType(context);
  union.types = merged;
  return union;
}

function mergeUnionTypes(aTypes, bTypes) {
  loop: for (var i = 0; i < bTypes.length; i++) {
    var bType = bTypes[i];
    for (var j = 0; j < aTypes.length; j++) {
      var aType = aTypes[j];
      if (compareTypes(aType, bType) !== -1) {
        continue loop;
      }
    }
    aTypes.push(bType);
  }
}

function makePropertyDescriptor(typeSource, input, propertyName, descriptor, shouldAssert) {
  if (typeof descriptor.get === 'function' && typeof descriptor.set === 'function') {
    return augmentExistingAccessors(typeSource, input, propertyName, descriptor, shouldAssert);
  } else {
    return propertyToAccessor(typeSource, input, propertyName, descriptor, shouldAssert);
  }
}

function makePropertyName(name) {
  return `_flowRuntime$${ name }`;
}

function getClassName(input) {
  if (typeof input === 'function') {
    return input.name || '[Class anonymous]';
  } else if (typeof input.constructor === 'function') {
    return getClassName(input.constructor);
  } else {
    return '[Class anonymous]';
  }
}

function resolveType(receiver, typeSource) {
  if (typeof typeSource === 'function') {
    return typeSource.call(receiver);
  } else {
    return typeSource;
  }
}

function propertyToAccessor(typeSource, input, propertyName, descriptor, shouldAssert) {
  var safeName = makePropertyName(propertyName);
  var className = getClassName(input);
  var initializer = descriptor.initializer,
      writable = descriptor.writable,
      config = objectWithoutProperties(descriptor, ['initializer', 'writable']); // eslint-disable-line no-unused-vars

  var propertyPath = [className, propertyName];

  return _extends({}, config, {
    type: 'accessor',
    get() {
      if (safeName in this) {
        return this[safeName];
      } else if (initializer) {
        var type = resolveType(this, typeSource);
        var _value = initializer.call(this);
        var context = type.context;
        context.check(type, _value, 'Default value for property', propertyPath);
        Object.defineProperty(this, safeName, {
          writable: true,
          value: _value
        });
        return _value;
      } else {
        Object.defineProperty(this, safeName, {
          writable: true,
          value: undefined
        });
      }
    },
    set(value) {
      var type = resolveType(this, typeSource);
      var context = type.context;
      if (shouldAssert) {
        context.assert(type, value, 'Property', propertyPath);
      } else {
        context.warn(type, value, 'Property', propertyPath);
      }
      if (safeName in this) {
        this[safeName] = value;
      } else {
        Object.defineProperty(this, safeName, {
          writable: true,
          value: value
        });
      }
    }
  });
}

function augmentExistingAccessors(typeSource, input, propertyName, descriptor, shouldAssert) {

  var className = getClassName(input);
  var propertyPath = [className, propertyName];

  var originalSetter = descriptor.set;

  descriptor.set = function set$$1(value) {
    var type = resolveType(this, typeSource);
    var context = type.context;
    if (shouldAssert) {
      context.assert(type, value, 'Property', propertyPath);
    } else {
      context.warn(type, value, 'Property', propertyPath);
    }
    originalSetter.call(this, value);
  };
}

// eslint-disable-line no-redeclare

function annotateValue(input, type) {
  // eslint-disable-line no-redeclare
  if (type instanceof Type) {
    input[TypeSymbol] = type;
    return input;
  } else {
    var _ret = function () {
      var type = input;
      return {
        v: function v(input) {
          input[TypeSymbol] = type;
          return input;
        }
      };
    }();

    if (typeof _ret === "object") return _ret.v;
  }
}

var Declaration = function (_Type) {
  inherits(Declaration, _Type);

  function Declaration() {
    classCallCheck(this, Declaration);
    return possibleConstructorReturn(this, (Declaration.__proto__ || Object.getPrototypeOf(Declaration)).apply(this, arguments));
  }

  return Declaration;
}(Type);

var VarDeclaration = function (_Declaration) {
  inherits(VarDeclaration, _Declaration);

  function VarDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, VarDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = VarDeclaration.__proto__ || Object.getPrototypeOf(VarDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'VarDeclaration', _this.constraints = [], _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(VarDeclaration, [{
    key: 'addConstraint',
    value: function addConstraint() {
      for (var _len2 = arguments.length, constraints = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        constraints[_key2] = arguments[_key2];
      }

      addConstraints.apply(undefined, [this].concat(toConsumableArray(constraints)));
      return this;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;

      var hasErrors = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = type.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          hasErrors = true;
          yield error;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!hasErrors) {
        yield* collectConstraintErrors(this, validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      if (!type.accepts(input)) {
        return false;
      } else if (!constraintsAccept(this, input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.type, input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `declare var ${ this.name }: ${ this.type.toString() };`;
    }
  }]);
  return VarDeclaration;
}(Declaration);

var TypeDeclaration = function (_Declaration) {
  inherits(TypeDeclaration, _Declaration);

  function TypeDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, TypeDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = TypeDeclaration.__proto__ || Object.getPrototypeOf(TypeDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'TypeDeclaration', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(TypeDeclaration, [{
    key: 'addConstraint',
    value: function addConstraint() {
      var _typeAlias;

      (_typeAlias = this.typeAlias).addConstraint.apply(_typeAlias, arguments);
      return this;
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.typeAlias.errors(validation, path, input);
    }
  }, {
    key: 'apply',
    value: function apply() {
      var _typeAlias2;

      return (_typeAlias2 = this.typeAlias).apply.apply(_typeAlias2, arguments);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.typeAlias.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.typeAlias, input);
    }
  }, {
    key: 'hasProperty',
    value: function hasProperty(name) {
      var _typeAlias3;

      for (var _len2 = arguments.length, typeInstances = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        typeInstances[_key2 - 1] = arguments[_key2];
      }

      return (_typeAlias3 = this.typeAlias).hasProperty.apply(_typeAlias3, [name].concat(toConsumableArray(typeInstances)));
    }
  }, {
    key: 'getProperty',
    value: function getProperty(name) {
      var _typeAlias4;

      for (var _len3 = arguments.length, typeInstances = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        typeInstances[_key3 - 1] = arguments[_key3];
      }

      return (_typeAlias4 = this.typeAlias).getProperty.apply(_typeAlias4, [name].concat(toConsumableArray(typeInstances)));
    }

    /**
     * Get the inner type or value.
     */

  }, {
    key: 'unwrap',
    value: function unwrap() {
      var _typeAlias5;

      return (_typeAlias5 = this.typeAlias).unwrap.apply(_typeAlias5, arguments);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `declare ${ this.typeAlias.toString(true) };`;
    }
  }, {
    key: 'type',
    get: function get$$1() {
      return this.typeAlias.type;
    }
  }]);
  return TypeDeclaration;
}(Declaration);

var ModuleDeclaration = function (_Declaration) {
  inherits(ModuleDeclaration, _Declaration);

  function ModuleDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ModuleDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ModuleDeclaration.__proto__ || Object.getPrototypeOf(ModuleDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ModuleDeclaration', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ModuleDeclaration, [{
    key: 'get',
    value: function get$$1(name) {
      var moduleExports = this.moduleExports;

      if (moduleExports) {
        var exporting = moduleExports.unwrap();
        if (typeof exporting.getProperty === 'function') {
          var prop = exporting.getProperty(name);
          if (prop) {
            return prop.unwrap();
          }
        }
      } else {
        var declaration = this.declarations[name];
        if (declaration) {
          return declaration.unwrap();
        }
      }
    }
  }, {
    key: 'errors',
    value: function* errors(validation, path, input) {
      // Can't validate a module directly.
      // @todo should this throw?
    }
  }, {
    key: 'import',
    value: function _import(moduleName) {
      if (/^\.\//.test(moduleName)) {
        moduleName = `${ this.name }${ moduleName.slice(1) }`;
      }
      return this.innerContext.import(moduleName);
    }
  }, {
    key: 'toString',
    value: function toString() {
      var name = this.name,
          declarations = this.declarations,
          modules = this.modules,
          moduleExports = this.moduleExports;

      var body = [];
      for (var _name in declarations) {
        // eslint-disable-line guard-for-in
        var declaration = declarations[_name];
        body.push(declaration.toString(true));
      }
      if (modules) {
        for (var _name2 in modules) {
          // eslint-disable-line guard-for-in
          var module = modules[_name2];
          body.push(module.toString());
        }
      }
      if (moduleExports) {
        body.push(moduleExports.toString());
      }
      return `declare module "${ name }" {\n${ indent$1(body.join('\n\n')) }}`;
    }
  }, {
    key: 'moduleType',
    get: function get$$1() {
      if (this.moduleExports) {
        return 'commonjs';
      } else {
        return 'es6';
      }
    }
  }, {
    key: 'isCommonJS',
    get: function get$$1() {
      return this.moduleExports ? true : false;
    }
  }, {
    key: 'isES6',
    get: function get$$1() {
      return this.moduleExports ? false : true;
    }
  }, {
    key: 'declarations',
    get: function get$$1() {
      var innerContext = this.innerContext;

      return innerContext[NameRegistrySymbol];
    }
  }, {
    key: 'modules',
    get: function get$$1() {
      var innerContext = this.innerContext;

      return innerContext[ModuleRegistrySymbol];
    }
  }]);
  return ModuleDeclaration;
}(Declaration);

function indent$1(input) {
  var lines = input.split('\n');
  var length = lines.length;

  for (var i = 0; i < length; i++) {
    lines[i] = `  ${ lines[i] }`;
  }
  return lines.join('\n');
}

var ModuleExports = function (_Declaration) {
  inherits(ModuleExports, _Declaration);

  function ModuleExports() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ModuleExports);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ModuleExports.__proto__ || Object.getPrototypeOf(ModuleExports)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ModuleExports', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ModuleExports, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(validation, path, input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `declare module.exports: ${ this.type.toString() };`;
    }
  }]);
  return ModuleExports;
}(Declaration);

var ClassDeclaration = function (_Declaration) {
  inherits(ClassDeclaration, _Declaration);

  function ClassDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ClassDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ClassDeclaration.__proto__ || Object.getPrototypeOf(ClassDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ClassDeclaration', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ClassDeclaration, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var body = this.body;

      var superClass = this.superClass && this.superClass.unwrap();
      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_INSTANCEOF', this.name), this];
        return;
      }
      if (superClass) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = superClass.errors(validation, path, input)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref2 = _step.value;

            var _ref3 = slicedToArray(_ref2, 3);

            var errorPath = _ref3[0];
            var errorMessage = _ref3[1];
            var expectedType = _ref3[2];

            var propertyName = errorPath[path.length];
            if (body.getProperty(propertyName)) {
              continue;
            } else {
              yield [errorPath, errorMessage, expectedType];
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      yield* body.errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var body = this.body;

      var superClass = this.superClass && this.superClass.unwrap();
      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        return false;
      } else if (superClass && !superClass.accepts(input)) {
        return false;
      } else if (!body.accepts(input)) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.body, input);
    }

    /**
     * Get a property with the given name, or undefined if it does not exist.
     */

  }, {
    key: 'getProperty',
    value: function getProperty(key) {
      var body = this.body,
          superClass = this.superClass;

      var prop = body.getProperty(key);
      if (prop) {
        return prop;
      } else if (superClass && typeof superClass.getProperty === 'function') {
        return superClass.getProperty(key);
      }
    }

    /**
     * Determine whether a property with the given name exists.
     */

  }, {
    key: 'hasProperty',
    value: function hasProperty(key) {
      var body = this.body,
          superClass = this.superClass;

      if (body.hasProperty(key)) {
        return true;
      } else if (superClass && typeof superClass.hasProperty === 'function') {
        return superClass.hasProperty(key);
      } else {
        return false;
      }
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len2 = arguments.length, typeInstances = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        typeInstances[_key2] = arguments[_key2];
      }

      target.typeInstances = typeInstances;
      return target;
    }
  }, {
    key: 'toString',
    value: function toString(withDeclaration) {
      var name = this.name,
          superClass = this.superClass,
          body = this.body;

      if (withDeclaration) {
        var superClassName = superClass && (typeof superClass.name === 'string' && superClass.name || superClass.toString());
        return `declare class ${ name }${ superClassName ? ` extends ${ superClassName }` : '' } ${ body.toString() }`;
      } else {
        return name;
      }
    }
  }]);
  return ClassDeclaration;
}(Declaration);

var ParameterizedClassDeclaration = function (_Declaration) {
  inherits(ParameterizedClassDeclaration, _Declaration);

  function ParameterizedClassDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ParameterizedClassDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ParameterizedClassDeclaration.__proto__ || Object.getPrototypeOf(ParameterizedClassDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ParameterizedClassDeclaration', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ParameterizedClassDeclaration, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      for (var _len2 = arguments.length, typeInstances = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        typeInstances[_key2 - 3] = arguments[_key2];
      }

      yield* getPartial$2.apply(undefined, [this].concat(toConsumableArray(typeInstances))).errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      for (var _len3 = arguments.length, typeInstances = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        typeInstances[_key3 - 1] = arguments[_key3];
      }

      return getPartial$2.apply(undefined, [this].concat(toConsumableArray(typeInstances))).accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return getPartial$2(this).compareWith(input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      for (var _len4 = arguments.length, typeInstances = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        typeInstances[_key4] = arguments[_key4];
      }

      return getPartial$2.apply(undefined, [this].concat(toConsumableArray(typeInstances))).unwrap();
    }
  }, {
    key: 'apply',
    value: function apply() {
      var target = new TypeParameterApplication(this.context);
      target.parent = this;

      for (var _len5 = arguments.length, typeInstances = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        typeInstances[_key5] = arguments[_key5];
      }

      target.typeInstances = typeInstances;
      return target;
    }
  }, {
    key: 'toString',
    value: function toString(withDeclaration) {
      return getPartial$2(this).toString(withDeclaration);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return getPartial$2(this).toJSON();
    }
  }]);
  return ParameterizedClassDeclaration;
}(Declaration);

function getPartial$2(parent) {
  var context = parent.context,
      bodyCreator = parent.bodyCreator;

  var partial = new PartialType(context);
  var body = bodyCreator(partial);
  if (Array.isArray(body)) {
    partial.type = context.class.apply(context, [parent.name].concat(toConsumableArray(body)));
  } else {
    partial.type = context.class(parent.name, body);
  }

  var typeParameters = partial.typeParameters;

  for (var _len6 = arguments.length, typeInstances = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    typeInstances[_key6 - 1] = arguments[_key6];
  }

  var limit = Math.min(typeInstances.length, typeParameters.length);
  for (var i = 0; i < limit; i++) {
    var typeParameter = typeParameters[i];
    var typeInstance = typeInstances[i];
    if (typeParameter.bound && typeParameter.bound !== typeInstance) {
      // if the type parameter is already bound we need to
      // create an intersection type with this one.
      typeParameter.bound = context.intersect(typeParameter.bound, typeInstance);
    } else {
      typeParameter.bound = typeInstance;
    }
  }

  return partial;
}

var ExtendsDeclaration = function (_Declaration) {
  inherits(ExtendsDeclaration, _Declaration);

  function ExtendsDeclaration() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ExtendsDeclaration);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ExtendsDeclaration.__proto__ || Object.getPrototypeOf(ExtendsDeclaration)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ExtendsDeclaration', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ExtendsDeclaration, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(validation, path, input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type.unwrap();
    }
  }, {
    key: 'toString',
    value: function toString(withDeclaration) {
      var type = this.type;

      if (withDeclaration) {
        return `extends ${ type.toString() }`;
      } else {
        return type.toString();
      }
    }
  }]);
  return ExtendsDeclaration;
}(Declaration);

// If A and B are object types, $Diff<A,B> is the type of objects that have
// properties defined in A, but not in B.
// Properties that are defined in both A and B are allowed too.

var $DiffType = function (_Type) {
  inherits($DiffType, _Type);

  function $DiffType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $DiffType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $DiffType.__proto__ || Object.getPrototypeOf($DiffType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$DiffType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($DiffType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var aType = this.aType,
          bType = this.bType;

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }
      aType = aType.unwrap();
      bType = bType.unwrap();
      invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
      var properties = aType.properties;
      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        if (bType.hasProperty(property.key)) {
          continue;
        }
        yield* property.errors(validation, path.concat(property.key), input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var aType = this.aType,
          bType = this.bType;

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        return false;
      }
      aType = aType.unwrap();
      bType = bType.unwrap();
      invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
      var properties = aType.properties;
      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        if (bType.hasProperty(property.key)) {
          continue;
        }
        if (!property.accepts(input)) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var _context;

      var aType = this.aType,
          bType = this.bType;

      aType = aType.unwrap();
      bType = bType.unwrap();
      invariant(aType instanceof ObjectType && bType instanceof ObjectType, 'Can only $Diff object types.');
      var properties = aType.properties;
      var args = [];
      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        if (bType.hasProperty(property.key)) {
          continue;
        }
        args.push(property);
      }
      return (_context = this.context).object.apply(_context, args);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$Diff<${ this.aType.toString() }, ${ this.bType.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        aType: this.aType,
        bType: this.bType
      };
    }
  }]);
  return $DiffType;
}(Type);

// Any subtype of T

var $FlowFixMeType = function (_Type) {
  inherits($FlowFixMeType, _Type);

  function $FlowFixMeType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $FlowFixMeType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $FlowFixMeType.__proto__ || Object.getPrototypeOf($FlowFixMeType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$FlowFixMeType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($FlowFixMeType, [{
    key: 'errors',
    value: function* errors(validation, input) {
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return 1;
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '$FlowFixMe';
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName
      };
    }
  }]);
  return $FlowFixMeType;
}(Type);

// The set of keys of T.

var $KeysType = function (_Type) {
  inherits($KeysType, _Type);

  function $KeysType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $KeysType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $KeysType.__proto__ || Object.getPrototypeOf($KeysType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$KeysType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($KeysType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type.unwrap();
      invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

      var properties = type.properties;
      var length = properties.length;
      for (var i = 0; i < length; i++) {
        var property = properties[i];
        if (input === property.key) {
          return;
        }
      }
      var keys = new Array(length);
      for (var _i = 0; _i < length; _i++) {
        keys[_i] = properties[_i].key;
      }
      yield [path, getErrorMessage('ERR_NO_UNION', keys.join(' | ')), this];
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type.unwrap();
      invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

      var properties = type.properties;
      var length = properties.length;
      for (var i = 0; i < length; i++) {
        var property = properties[i];
        if (input === property.key) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var _context;

      var context = this.context;
      var type = this.type.unwrap();
      invariant(type instanceof ObjectType, 'Can only $Keys<T> object types.');

      var properties = type.properties;
      var length = properties.length;
      var keys = new Array(length);
      for (var i = 0; i < length; i++) {
        var property = properties[i];
        keys[i] = context.literal(property.key);
      }
      return (_context = this.context).union.apply(_context, keys);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$Keys<${ this.type.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return $KeysType;
}(Type);

// Map over the keys and values in an object.

var $ObjMapiType = function (_Type) {
  inherits($ObjMapiType, _Type);

  function $ObjMapiType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $ObjMapiType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $ObjMapiType.__proto__ || Object.getPrototypeOf($ObjMapiType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$ObjMapiType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($ObjMapiType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = target.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          var returnType = applied.invoke(context.literal(prop.key), prop.value);

          var value = input[prop.key];
          yield* returnType.errors(validation, path.concat(prop.key), value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        return false;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = target.properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var prop = _step2.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          var returnType = applied.invoke(context.literal(prop.key), prop.value);

          var value = input[prop.key];
          if (!returnType.accepts(value)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      var args = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = target.properties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var prop = _step3.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          args.push(context.property(prop.key, applied.invoke(context.literal(prop.key), prop.value)));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return context.object.apply(context, args);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$ObjMapi<${ this.object.toString() }, ${ this.mapper.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        object: this.object,
        mapper: this.mapper
      };
    }
  }]);
  return $ObjMapiType;
}(Type);

// Map over the keys in an object.

var $ObjMapType = function (_Type) {
  inherits($ObjMapType, _Type);

  function $ObjMapType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $ObjMapType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $ObjMapType.__proto__ || Object.getPrototypeOf($ObjMapType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$ObjMapType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($ObjMapType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = target.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          var returnType = applied.invoke(context.literal(prop.key));

          var value = input[prop.key];
          yield* returnType.errors(validation, path.concat(prop.key), value);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        return false;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = target.properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var prop = _step2.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          var returnType = applied.invoke(context.literal(prop.key));

          var value = input[prop.key];
          if (!returnType.accepts(value)) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var object = this.object,
          mapper = this.mapper,
          context = this.context;

      var target = object.unwrap();
      invariant(target instanceof ObjectType, 'Target must be an object type.');

      var args = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = target.properties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var prop = _step3.value;

          var applied = mapper.unwrap();
          invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

          args.push(context.property(prop.key, applied.invoke(context.literal(prop.key))));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return context.object.apply(context, args);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$ObjMap<${ this.object.toString() }, ${ this.mapper.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        object: this.object,
        mapper: this.mapper
      };
    }
  }]);
  return $ObjMapType;
}(Type);

// The type of the named object property

var $PropertyType = function (_Type) {
  inherits($PropertyType, _Type);

  function $PropertyType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $PropertyType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $PropertyType.__proto__ || Object.getPrototypeOf($PropertyType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$PropertyType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($PropertyType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.unwrap().errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.unwrap().accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var object = this.object,
          property = this.property;

      var unwrapped = object.unwrap();
      invariant(typeof unwrapped.getProperty === 'function', 'Can only use $PropertyType on Objects.');
      return unwrapped.getProperty(property).unwrap();
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$PropertyType<${ this.object.toString() }, ${ String(this.property) }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        object: this.object,
        property: this.property
      };
    }
  }]);
  return $PropertyType;
}(Type);

// An object of type $Shape<T> does not have to have all of the properties
// that type T defines. But the types of the properties that it does have
// must accepts the types of the same properties in T.

var $ShapeType = function (_Type) {
  inherits($ShapeType, _Type);

  function $ShapeType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $ShapeType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $ShapeType.__proto__ || Object.getPrototypeOf($ShapeType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$ShapeType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($ShapeType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var type = this.type;


      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_OBJECT'), this];
        return;
      }

      type = type.unwrap();
      invariant(typeof type.getProperty === 'function', 'Can only $Shape<T> object types.');

      for (var key in input) {
        // eslint-disable-line guard-for-in
        var property = type.getProperty(key);
        if (!property) {
          continue;
        }
        yield* property.errors(validation, path, input);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var type = this.type;

      if (input === null || typeof input !== 'object' && typeof input !== 'function') {
        return false;
      }
      type = type.unwrap();
      invariant(typeof type.getProperty === 'function', 'Can only $Shape<T> object types.');
      for (var key in input) {
        // eslint-disable-line guard-for-in
        var property = type.getProperty(key);
        if (!property || !property.accepts(input)) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var _context;

      var type = this.type;

      type = type.unwrap();
      var context = this.context;
      invariant(type instanceof ObjectType, 'Can only $Shape<T> object types.');
      var properties = type.properties;
      var args = new Array(properties.length);
      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        args[i] = context.property(property.key, property.value, true);
      }
      return (_context = this.context).object.apply(_context, args);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$Shape<${ this.type.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return $ShapeType;
}(Type);

// Any subtype of T

var $SubType = function (_Type) {
  inherits($SubType, _Type);

  function $SubType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $SubType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $SubType.__proto__ || Object.getPrototypeOf($SubType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$SubType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($SubType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(input, path);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$Subtype<${ this.type.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return $SubType;
}(Type);

// Any, but at least T.

var $SuperType = function (_Type) {
  inherits($SuperType, _Type);

  function $SuperType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $SuperType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $SuperType.__proto__ || Object.getPrototypeOf($SuperType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$SuperType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($SuperType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      yield* this.type.errors(validation, path, input);
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      return this.type.accepts(input);
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      return this.type;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$Supertype<${ this.type.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        type: this.type
      };
    }
  }]);
  return $SuperType;
}(Type);

// Map over the values in a tuple.

var $TupleMapType = function (_Type) {
  inherits($TupleMapType, _Type);

  function $TupleMapType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, $TupleMapType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = $TupleMapType.__proto__ || Object.getPrototypeOf($TupleMapType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = '$TupleMapType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass($TupleMapType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var tuple = this.tuple,
          mapper = this.mapper,
          context = this.context;

      var target = tuple.unwrap();
      invariant(target instanceof TupleType, 'Target must be a tuple type.');

      if (!context.checkPredicate('Array', input)) {
        yield [path, getErrorMessage('ERR_EXPECT_ARRAY'), this];
        return;
      }

      for (var i = 0; i < target.types.length; i++) {
        var type = target.types[i];
        var applied = mapper.unwrap();
        invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

        var expected = applied.invoke(type);
        var value = input[i];
        yield* expected.errors(validation, path.concat(i), value);
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var tuple = this.tuple,
          mapper = this.mapper,
          context = this.context;

      var target = tuple.unwrap();
      invariant(target instanceof TupleType, 'Target must be a tuple type.');

      if (!context.checkPredicate('Array', input)) {
        return false;
      }

      for (var i = 0; i < target.types.length; i++) {
        var type = target.types[i];
        var applied = mapper.unwrap();
        invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

        if (!applied.invoke(type).accepts(input[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      return compareTypes(this.unwrap(), input);
    }
  }, {
    key: 'unwrap',
    value: function unwrap() {
      var tuple = this.tuple,
          mapper = this.mapper,
          context = this.context;

      var target = tuple.unwrap();
      invariant(target instanceof TupleType, 'Target must be an tuple type.');

      var args = [];
      for (var i = 0; i < target.types.length; i++) {
        var type = target.types[i];
        var applied = mapper.unwrap();
        invariant(applied instanceof FunctionType, 'Mapper must be a function type.');

        args.push(applied.invoke(type).unwrap().unwrap());
      }

      return context.tuple.apply(context, args);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `$TupleMap<${ this.tuple.toString() }, ${ this.mapper.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        tuple: this.tuple,
        mapper: this.mapper
      };
    }
  }]);
  return $TupleMapType;
}(Type);

var ClassType = function (_Type) {
  inherits(ClassType, _Type);

  function ClassType() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ClassType);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ClassType.__proto__ || Object.getPrototypeOf(ClassType)).call.apply(_ref, [this].concat(args))), _this), _this.typeName = 'ClassType', _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ClassType, [{
    key: 'errors',
    value: function* errors(validation, path, input) {
      var instanceType = this.instanceType,
          context = this.context;

      if (typeof input !== 'function') {
        yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
      }
      var expectedType = instanceType.unwrap();
      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (input === expectedType.impl) {
          return;
        } else if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
          return;
        } else {
          yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
          return;
        }
      }
      var annotation = context.getAnnotation(input);
      if (annotation) {
        if (!expectedType.acceptsType(annotation)) {

          var acceptsInstance = annotation instanceof ClassDeclaration && expectedType.acceptsType(annotation.body);

          if (!acceptsInstance) {
            yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
          }
        }
        return;
      }
      var matches = void 0;
      // we're dealing with a type
      switch (input.typeName) {
        case 'NumberType':
        case 'NumericLiteralType':
          matches = input === Number;
          break;
        case 'BooleanType':
        case 'BooleanLiteralType':
          matches = input === Boolean;
          break;
        case 'StringType':
        case 'StringLiteralType':
          matches = input === String;
          break;
        case 'ArrayType':
        case 'TupleType':
          matches = input === Array;
          break;
        default:
          return;
      }
      if (!matches) {
        yield [path, getErrorMessage('ERR_EXPECT_CLASS', instanceType.toString()), this];
      }
    }
  }, {
    key: 'accepts',
    value: function accepts(input) {
      var instanceType = this.instanceType,
          context = this.context;

      if (typeof input !== 'function') {
        return false;
      }
      var expectedType = instanceType.unwrap();
      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (input === expectedType.impl) {
          return true;
        } else if (typeof expectedType.impl === 'function') {
          if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
            return true;
          } else {
            return false;
          }
        }
      }

      var annotation = context.getAnnotation(input);

      if (annotation) {
        return expectedType.acceptsType(annotation);
      } else if (expectedType instanceof TypeParameterApplication) {
        expectedType = expectedType.parent;
      }

      if (expectedType instanceof GenericType && typeof expectedType.impl === 'function') {
        if (expectedType.impl.prototype.isPrototypeOf(input.prototype)) {
          return true;
        } else {
          return false;
        }
      }

      // we're dealing with a type
      switch (input.typeName) {
        case 'NumberType':
        case 'NumericLiteralType':
          return input === Number;
        case 'BooleanType':
        case 'BooleanLiteralType':
          return input === Boolean;
        case 'StringType':
        case 'StringLiteralType':
          return input === String;
        case 'ArrayType':
        case 'TupleType':
          return input === Array;
        default:
          return false;
      }
    }
  }, {
    key: 'compareWith',
    value: function compareWith(input) {
      var instanceType = this.instanceType;

      if (input instanceof ClassType) {
        return compareTypes(instanceType, input.instanceType);
      }
      return -1;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return `Class<${ this.instanceType.toString() }>`;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        typeName: this.typeName,
        instanceType: this.instanceType
      };
    }
  }]);
  return ClassType;
}(Type);

/**
 * Keeps track of invalid references in order to prevent
 * multiple warnings.
 */
var warnedInvalidReferences = new WeakSet();

var TypeContext = function () {
  function TypeContext() {
    classCallCheck(this, TypeContext);
    this.mode = 'assert';
    this[NameRegistrySymbol] = {};
    this[TypePredicateRegistrySymbol] = {};
    this[TypeConstructorRegistrySymbol] = new Map();
    this[InferrerSymbol] = new TypeInferer(this);
    this[ModuleRegistrySymbol] = {};
  }

  /**
   * Calls to `t.check(...)` will call either
   * `t.assert(...)` or `t.warn(...)` depending on this setting.
   */


  // Issue 252


  // Issue 252


  // Issue 252


  // Issue 252


  // Issue 252


  // Issue 252


  createClass(TypeContext, [{
    key: 'makeJSONError',


    // Issue 252
    value: function makeJSONError$$1(validation) {
      return makeJSONError(validation);
    }
  }, {
    key: 'makeTypeError',
    value: function makeTypeError$$1(validation) {
      return makeTypeError(validation);
    }
  }, {
    key: 'createContext',
    value: function createContext() {
      var context = new TypeContext();
      // Issue 252
      context[ParentSymbol] = this;
      return context;
    }
  }, {
    key: 'typeOf',
    value: function typeOf(input) {

      var annotation = this.getAnnotation(input);
      if (annotation) {
        return annotation;
      }
      // Issue 252
      var inferrer = this[InferrerSymbol];
      inferrer;

      return inferrer.infer(input);
    }
  }, {
    key: 'compareTypes',
    value: function compareTypes$$1(a, b) {
      return compareTypes(a, b);
    }
  }, {
    key: 'get',
    value: function get$$1(name) {
      // Issue 252
      var item = this[NameRegistrySymbol][name];

      for (var _len = arguments.length, propertyNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        propertyNames[_key - 1] = arguments[_key];
      }

      if (item != null) {
        var current = typeof item === 'function' ? new item(this) : item;
        for (var i = 0; i < propertyNames.length; i++) {
          var propertyName = propertyNames[i];
          if (typeof current.getProperty !== 'function') {
            return;
          }
          current = current.getProperty(propertyName);
          if (!current) {
            return;
          }
          current = current.unwrap();
        }
        return current;
      }
      // Issue 252
      var parent = this[ParentSymbol];
      if (parent) {
        var fromParent = parent.get.apply(parent, [name].concat(toConsumableArray(propertyNames)));
        if (fromParent) {
          return fromParent;
        }
      }

      // if we got this far, see if we have a global type with this name.
      if (typeof global[name] === 'function') {
        var target = new GenericType(this);
        target.name = name;
        target.impl = global[name];
        // Issue 252
        this[NameRegistrySymbol][name] = target;
        return target;
      }
    }

    /**
     * Get the predicate for a given type name.
     * e.g. `t.getPredicate('Array')`.
     */

  }, {
    key: 'getPredicate',
    value: function getPredicate(name) {
      var item = this[TypePredicateRegistrySymbol][name];
      if (item) {
        return item;
      }
      var parent = this[ParentSymbol];
      if (parent) {
        return parent.getPredicate(name);
      }
    }

    /**
     * Set the predicate for a given type name.
     * This can be used to customise the behaviour of things like Array
     * detection or allowing Thenables in place of the global Promise.
     */

  }, {
    key: 'setPredicate',
    value: function setPredicate(name, predicate) {
      this[TypePredicateRegistrySymbol][name] = predicate;
    }

    /**
     * Check the given value against the named predicate.
     * Returns false if no such predicate exists.
     * e.g. `t.checkPredicate('Array', [1, 2, 3])`
     */

  }, {
    key: 'checkPredicate',
    value: function checkPredicate(name, input) {
      var predicate = this.getPredicate(name);
      if (predicate) {
        return predicate(input);
      } else {
        return false;
      }
    }

    /**
     * Returns a decorator for a function or object with the given type.
     */

  }, {
    key: 'decorate',
    value: function decorate(type, shouldAssert) {
      var _this2 = this;

      if (shouldAssert == null) {
        shouldAssert = this.mode === 'assert';
      }
      return function (input, propertyName, descriptor) {
        if (descriptor && typeof propertyName === 'string') {
          return makePropertyDescriptor(type, input, propertyName, descriptor, Boolean(shouldAssert));
        } else {
          invariant(typeof type !== 'function', 'Cannot decorate an object or function as a method.');
          return _this2.annotate(input, type);
        }
      };
    }

    /**
     * Annotates an object or function with the given type.
     * If a type is specified as the sole argument, returns a
     * function which can decorate classes or functions with the given type.
     */

  }, {
    key: 'annotate',
    value: function annotate(input, type) {
      if (type === undefined) {
        return annotateValue(input);
      } else {
        return annotateValue(input, type);
      }
    }
  }, {
    key: 'getAnnotation',
    value: function getAnnotation(input) {
      if (input !== null && typeof input === 'object' || typeof input === 'function') {
        // Issue 252
        return input[TypeSymbol];
      }
    }
  }, {
    key: 'hasAnnotation',
    value: function hasAnnotation(input) {
      if (input == null) {
        return false;
      } else {
        return input[TypeSymbol] ? true : false;
      }
    }
  }, {
    key: 'setAnnotation',
    value: function setAnnotation(input, type) {
      input[TypeSymbol] = type;
      return input;
    }
  }, {
    key: 'type',
    value: function type(name, _type) {
      if (typeof _type === 'function') {
        var target = new ParameterizedTypeAlias(this);
        target.name = name;
        target.typeCreator = _type;
        return target;
      } else {
        var _target = new TypeAlias(this);
        _target.name = name;
        _target.type = _type;
        return _target;
      }
    }
  }, {
    key: 'declare',
    value: function declare(name, type) {

      if (name instanceof Declaration) {
        type = name;
        name = type.name;
      } else if (name instanceof TypeAlias) {
        type = name;
        name = type.name;
      }
      if (typeof type === 'function') {
        type = this.type(name, type);
      }
      if (type instanceof ModuleDeclaration) {
        var moduleRegistry = this[ModuleRegistrySymbol];
        moduleRegistry[name] = type;
        return type;
      } else {
        invariant(typeof name === 'string', 'Name must be a string');
        invariant(type instanceof Type, 'Type must be supplied to declaration');
        var nameRegistry = this[NameRegistrySymbol];

        if (type instanceof Declaration) {
          nameRegistry[name] = type;
          return type;
        } else if (type instanceof TypeAlias || type instanceof ParameterizedTypeAlias) {
          var target = new TypeDeclaration(this);
          target.name = name;
          target.typeAlias = type;
          nameRegistry[name] = target;
          return target;
        } else {
          var _target2 = this.var(name, type);
          nameRegistry[name] = _target2;
          return _target2;
        }
      }
    }
  }, {
    key: 'declarations',
    value: function* declarations() {
      var nameRegistry = this[NameRegistrySymbol];
      for (var key in nameRegistry) {
        // eslint-disable-line guard-for-in
        yield [key, nameRegistry[key]];
      }
    }
  }, {
    key: 'modules',
    value: function* modules() {
      var moduleRegistry = this[ModuleRegistrySymbol];
      for (var key in moduleRegistry) {
        // eslint-disable-line guard-for-in
        yield moduleRegistry[key];
      }
    }
  }, {
    key: 'import',
    value: function _import(moduleName) {
      var moduleRegistry = this[ModuleRegistrySymbol];
      if (moduleRegistry[moduleName]) {
        return moduleRegistry[moduleName];
      }

      var _moduleName$split = moduleName.split('/'),
          _moduleName$split2 = slicedToArray(_moduleName$split, 1),
          head = _moduleName$split2[0];

      var module = moduleRegistry[head];
      if (module) {
        return module.import(moduleName);
      }
      var parent = this[ParentSymbol];
      if (parent) {
        return parent.import(moduleName);
      }
    }
  }, {
    key: 'declareTypeConstructor',
    value: function declareTypeConstructor(_ref) {
      var name = _ref.name,
          impl = _ref.impl,
          typeName = _ref.typeName,
          errors = _ref.errors,
          accepts = _ref.accepts,
          inferTypeParameters = _ref.inferTypeParameters;

      var nameRegistry = this[NameRegistrySymbol];

      if (nameRegistry[name]) {
        this.emitWarningMessage(`Redeclaring type: ${ name }, this may be unintended.`);
      }

      var target = new TypeConstructor(this);
      target.name = name;
      target.typeName = typeName;
      target.impl = impl;
      target.errors = errors;
      target.accepts = accepts;
      target.inferTypeParameters = inferTypeParameters;

      nameRegistry[name] = target;

      if (typeof impl === 'function') {
        // Issue 252
        var handlerRegistry = this[TypeConstructorRegistrySymbol];
        handlerRegistry;

        if (handlerRegistry.has(impl)) {
          this.emitWarningMessage(`A type handler already exists for the given implementation of ${ name }.`);
        }
        handlerRegistry.set(impl, target);
      }
      return target;
    }
  }, {
    key: 'getTypeConstructor',
    value: function getTypeConstructor(impl) {
      // Issue 252
      var handlerRegistry = this[TypeConstructorRegistrySymbol];
      handlerRegistry;

      return handlerRegistry.get(impl);
    }
  }, {
    key: 'literal',
    value: function literal(input) {
      if (input === undefined) {
        return this.void();
      } else if (input === null) {
        return this.null();
      } else if (typeof input === 'boolean') {
        return this.boolean(input);
      } else if (typeof input === 'number') {
        return this.number(input);
      } else if (typeof input === 'string') {
        return this.string(input);
      }
      // Issue 252
      else if (typeof input === 'symbol') {
          return this.symbol(input);
        } else {
          return this.typeOf(input);
        }
    }
  }, {
    key: 'null',
    value: function _null() {
      return primitiveTypes.null;
    }
  }, {
    key: 'nullable',
    value: function nullable(type) {
      var target = new NullableType(this);
      target.type = type;
      return target;
    }
  }, {
    key: 'existential',
    value: function existential() {
      return primitiveTypes.existential;
    }
  }, {
    key: 'empty',
    value: function empty() {
      return primitiveTypes.empty;
    }
  }, {
    key: 'any',
    value: function any() {
      return primitiveTypes.any;
    }
  }, {
    key: 'mixed',
    value: function mixed() {
      return primitiveTypes.mixed;
    }
  }, {
    key: 'void',
    value: function _void() {
      return primitiveTypes.void;
    }
  }, {
    key: 'this',
    value: function _this(input) {
      var target = new ThisType(this);
      if (input !== undefined) {
        target.recorded = input;
      }
      return target;
    }
  }, {
    key: 'number',
    value: function number(input) {
      if (input !== undefined) {
        var target = new NumericLiteralType(this);
        target.value = input;
        return target;
      } else {
        return primitiveTypes.number;
      }
    }
  }, {
    key: 'boolean',
    value: function boolean(input) {
      if (input !== undefined) {
        var target = new BooleanLiteralType(this);
        target.value = input;
        return target;
      } else {
        return primitiveTypes.boolean;
      }
    }
  }, {
    key: 'string',
    value: function string(input) {
      if (input !== undefined) {
        var target = new StringLiteralType(this);
        target.value = input;
        return target;
      } else {
        return primitiveTypes.string;
      }
    }
  }, {
    key: 'symbol',
    value: function symbol(input) {
      if (input !== undefined) {
        var target = new SymbolLiteralType(this);
        target.value = input;
        return target;
      } else {
        return primitiveTypes.symbol;
      }
    }
  }, {
    key: 'typeParameter',
    value: function typeParameter(id, bound, defaultType) {
      var target = new TypeParameter(this);
      target.id = id;
      target.bound = bound;
      target.default = defaultType;
      return target;
    }
  }, {
    key: 'flowInto',
    value: function flowInto(typeParameter) {
      return flowIntoTypeParameter(typeParameter);
    }

    /**
     * Bind the type parameters for the parent class of the given instance.
     */

  }, {
    key: 'bindTypeParameters',
    value: function bindTypeParameters(subject) {

      var instancePrototype = Object.getPrototypeOf(subject);
      // Issue
      var parentPrototype = instancePrototype && Object.getPrototypeOf(instancePrototype);
      // Issue
      var parentClass = parentPrototype && parentPrototype.constructor;

      if (!parentClass) {
        this.emitWarningMessage('Could not bind type parameters for non-existent parent class.');
        return subject;
      }
      // Issue 252
      var typeParametersPointer = parentClass[TypeParametersSymbol];

      if (typeParametersPointer) {
        var typeParameters = subject[typeParametersPointer];
        var keys = Object.keys(typeParameters);

        for (var _len2 = arguments.length, typeInstances = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          typeInstances[_key2 - 1] = arguments[_key2];
        }

        var length = Math.min(keys.length, typeInstances.length);
        for (var i = 0; i < length; i++) {
          var typeParam = typeParameters[keys[i]];
          typeParam.bound = typeInstances[i];
        }
      }
      return subject;
    }
  }, {
    key: 'module',
    value: function module(name, body) {
      var target = new ModuleDeclaration(this);
      target.name = name;
      var innerContext = this.createContext();
      // Issue 252
      innerContext[ParentSymbol] = this;
      // Issue 252
      innerContext[CurrentModuleSymbol] = target;

      target.innerContext = innerContext;
      body(innerContext);
      return target;
    }
  }, {
    key: 'moduleExports',
    value: function moduleExports(type) {
      var currentModule = this[CurrentModuleSymbol];
      if (!currentModule) {
        throw new Error('Cannot declare module.exports outside of a module.');
      }
      var target = new ModuleExports(this);
      target.type = type;
      currentModule.moduleExports = target;
      return target;
    }
  }, {
    key: 'var',
    value: function _var(name, type) {
      var target = new VarDeclaration(this);
      target.name = name;
      target.type = type;
      return target;
    }
  }, {
    key: 'class',
    value: function _class(name, head) {
      if (typeof head === 'function') {
        var _target3 = new ParameterizedClassDeclaration(this);
        _target3.name = name;
        _target3.bodyCreator = head;
        return _target3;
      }
      var target = new ClassDeclaration(this);
      target.name = name;

      for (var _len3 = arguments.length, tail = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        tail[_key3 - 2] = arguments[_key3];
      }

      if (head != null) {
        tail.unshift(head);
      }
      var length = tail.length;

      var properties = [];
      var body = void 0;

      for (var i = 0; i < length; i++) {
        var item = tail[i];
        if (item instanceof ObjectTypeProperty) {
          properties.push(item);
        } else if (item instanceof ObjectType) {
          invariant(!body, 'Class body must only be declared once.');
          body = item;
        } else if (item instanceof ExtendsDeclaration) {
          invariant(!target.superClass, 'Classes can only have one super class.');
          target.superClass = item;
        } else if (item != null && typeof item === 'object' && !(item instanceof Type)) {
          for (var propertyName in item) {
            // eslint-disable-line
            properties.push(this.property(propertyName, item[propertyName]));
          }
        } else {
          throw new Error('ClassDeclaration cannot contain the given type directly.');
        }
      }
      if (!body) {
        body = new ObjectType(this);
      }
      if (properties.length) {
        var _body$properties;

        (_body$properties = body.properties).push.apply(_body$properties, properties);
      }
      target.body = body;
      return target;
    }
  }, {
    key: 'extends',
    value: function _extends(subject) {
      var target = new ExtendsDeclaration(this);

      for (var _len4 = arguments.length, typeInstances = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        typeInstances[_key4 - 1] = arguments[_key4];
      }

      target.type = this.ref.apply(this, [subject].concat(toConsumableArray(typeInstances)));
      return target;
    }
  }, {
    key: 'fn',
    value: function fn(head) {
      for (var _len5 = arguments.length, tail = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        tail[_key5 - 1] = arguments[_key5];
      }

      return this.function.apply(this, [head].concat(tail));
    }
  }, {
    key: 'function',
    value: function _function(head) {
      if (typeof head === 'function') {
        var _target4 = new ParameterizedFunctionType(this);
        _target4.bodyCreator = head;
        return _target4;
      }
      var target = new FunctionType(this);
      if (head != null) {
        for (var _len6 = arguments.length, tail = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          tail[_key6 - 1] = arguments[_key6];
        }

        tail.unshift(head);
        var length = tail.length;

        for (var i = 0; i < length; i++) {
          var item = tail[i];
          if (item instanceof FunctionTypeParam) {
            target.params.push(item);
          } else if (item instanceof FunctionTypeRestParam) {
            target.rest = item;
          } else if (item instanceof FunctionTypeReturn) {
            target.returnType = item;
          } else {
            throw new Error('FunctionType cannot contain the given type directly.');
          }
        }
      }
      if (!target.returnType) {
        target.returnType = this.any();
      }
      return target;
    }
  }, {
    key: 'param',
    value: function param(name, type) {
      var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var target = new FunctionTypeParam(this);
      target.name = name;
      target.type = type;
      target.optional = optional;
      return target;
    }
  }, {
    key: 'rest',
    value: function rest(name, type) {
      var target = new FunctionTypeRestParam(this);
      target.name = name;
      target.type = type;
      return target;
    }
  }, {
    key: 'return',
    value: function _return(type) {
      var target = new FunctionTypeReturn(this);
      target.type = type;
      return target;
    }
  }, {
    key: 'generator',
    value: function generator(yieldType, returnType, nextType) {
      var target = new GeneratorType(this);
      target.yieldType = yieldType;
      target.returnType = returnType || this.any();
      target.nextType = nextType || this.any();
      return target;
    }
  }, {
    key: 'object',
    value: function object(head) {
      var target = new ObjectType(this);
      if (head != null && typeof head === 'object' && !(head instanceof Type)) {
        for (var propertyName in head) {
          // eslint-disable-line
          target.properties.push(this.property(propertyName, head[propertyName]));
        }
      } else {
        var body = void 0;

        for (var _len7 = arguments.length, tail = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
          tail[_key7 - 1] = arguments[_key7];
        }

        if (head) {
          body = [head].concat(toConsumableArray(tail));
        } else {
          body = tail;
        }
        var _body = body,
            length = _body.length;

        for (var i = 0; i < length; i++) {
          var item = body[i];
          if (item instanceof ObjectTypeProperty) {
            target.properties.push(item);
          } else if (item instanceof ObjectTypeIndexer) {
            target.indexers.push(item);
          } else if (item instanceof ObjectTypeCallProperty) {
            target.callProperties.push(item);
          } else {
            throw new Error('ObjectType cannot contain the given type directly.');
          }
        }
      }
      return target;
    }
  }, {
    key: 'exactObject',
    value: function exactObject(head) {
      for (var _len8 = arguments.length, tail = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        tail[_key8 - 1] = arguments[_key8];
      }

      var object = this.object.apply(this, [head].concat(toConsumableArray(tail)));
      object.exact = true;
      return object;
    }
  }, {
    key: 'callProperty',
    value: function callProperty(value) {
      var target = new ObjectTypeCallProperty(this);
      target.value = value;
      return target;
    }
  }, {
    key: 'property',
    value: function property(key, value) {
      var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var target = new ObjectTypeProperty(this);
      target.key = key;
      if (value instanceof Type) {
        target.value = value;
      } else {
        target.value = this.object(value);
      }
      target.optional = optional;
      return target;
    }
  }, {
    key: 'indexer',
    value: function indexer(id, key, value) {
      var target = new ObjectTypeIndexer(this);
      target.id = id;
      target.key = key;
      target.value = value;
      return target;
    }
  }, {
    key: 'method',
    value: function method(name, head) {
      var target = new ObjectTypeProperty(this);
      target.key = name;

      for (var _len9 = arguments.length, tail = Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
        tail[_key9 - 2] = arguments[_key9];
      }

      target.value = this.function.apply(this, [head].concat(tail));
      return target;
    }
  }, {
    key: 'staticCallProperty',
    value: function staticCallProperty(value) {
      var prop = this.callProperty(value);
      prop.static = true;
      return prop;
    }
  }, {
    key: 'staticProperty',
    value: function staticProperty(key, value) {
      var optional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var prop = this.property(key, value, optional);
      prop.static = true;
      return prop;
    }
  }, {
    key: 'staticMethod',
    value: function staticMethod(name, head) {
      for (var _len10 = arguments.length, tail = Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
        tail[_key10 - 2] = arguments[_key10];
      }

      var prop = this.method.apply(this, [name, head].concat(tail));
      prop.static = true;
      return prop;
    }
  }, {
    key: 'tuple',
    value: function tuple() {
      var target = new TupleType(this);

      for (var _len11 = arguments.length, types = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        types[_key11] = arguments[_key11];
      }

      target.types = types;
      return target;
    }
  }, {
    key: 'array',
    value: function array(elementType) {
      var target = new ArrayType(this);
      target.elementType = elementType || this.any();
      return target;
    }
  }, {
    key: 'union',
    value: function union() {
      for (var _len12 = arguments.length, types = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        types[_key12] = arguments[_key12];
      }

      return makeUnion(this, types);
    }
  }, {
    key: 'intersect',
    value: function intersect() {
      var target = new IntersectionType(this);

      for (var _len13 = arguments.length, types = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        types[_key13] = arguments[_key13];
      }

      target.types = types;
      return target;
    }
  }, {
    key: 'intersection',
    value: function intersection() {
      return this.intersect.apply(this, arguments);
    }
  }, {
    key: 'box',
    value: function box(reveal) {
      var box = new TypeBox(this);
      box.reveal = reveal;
      return box;
    }
  }, {
    key: 'tdz',
    value: function tdz(reveal, name) {
      var tdz = new TypeTDZ(this);
      tdz.reveal = reveal;
      tdz.name = name;
      return tdz;
    }
  }, {
    key: 'ref',
    value: function ref(subject) {
      var target = void 0;
      if (typeof subject === 'string') {
        // try and eagerly resolve the reference
        target = this.get(subject);
        if (!target) {
          // defer dereferencing for now
          target = new TypeReference(this);
          target.name = subject;
        }
      } else if (typeof subject === 'function') {
        // Issue 252
        var handlerRegistry = this[TypeConstructorRegistrySymbol];
        handlerRegistry;

        // see if we have a dedicated TypeConstructor for this.
        target = handlerRegistry.get(subject);

        if (!target) {
          // just use a generic type handler.
          target = new GenericType(this);
          target.impl = subject;
          target.name = subject.name;
        }
      } else if (subject instanceof Type) {
        target = subject;
      } else {
        if (subject == null || typeof subject !== 'object') {
          this.emitWarningMessage(`Could not reference the given type, try t.typeOf(value) instead. (got ${ String(subject) })`);
        } else if (!warnedInvalidReferences.has(subject)) {
          this.emitWarningMessage('Could not reference the given type, try t.typeOf(value) instead.');
          warnedInvalidReferences.add(subject);
        }
        return this.any();
      }

      for (var _len14 = arguments.length, typeInstances = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
        typeInstances[_key14 - 1] = arguments[_key14];
      }

      if (typeInstances.length) {
        var _target5;

        invariant(typeof target.apply === 'function', `Cannot apply non-applicable type: ${ target.typeName }.`);
        return (_target5 = target).apply.apply(_target5, toConsumableArray(typeInstances));
      } else {
        return target;
      }
    }
  }, {
    key: 'validate',
    value: function validate(type, input) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var path = arguments[3];

      var validation = new Validation(this, input);
      if (path) {
        var _validation$path;

        (_validation$path = validation.path).push.apply(_validation$path, toConsumableArray(path));
      } else if (typeof type.name === 'string') {
        validation.path.push(type.name);
      }
      validation.prefix = prefix;
      validation.errors = Array.from(type.errors(validation, [], input));
      return validation;
    }
  }, {
    key: 'check',
    value: function check(type, input) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var path = arguments[3];

      if (this.mode === 'assert') {
        return this.assert(type, input, prefix, path);
      } else {
        return this.warn(type, input, prefix, path);
      }
    }
  }, {
    key: 'assert',
    value: function assert(type, input) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var path = arguments[3];

      var validation = this.validate(type, input, prefix, path);
      var error = this.makeTypeError(validation);
      if (error) {
        throw error;
      }
      return input;
    }
  }, {
    key: 'warn',
    value: function warn(type, input) {
      var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var path = arguments[3];

      var validation = this.validate(type, input, prefix, path);
      var message = makeWarningMessage(validation);
      if (typeof message === 'string') {
        this.emitWarningMessage(message);
      }
      return input;
    }

    /**
     * Emits a warning message, using `console.warn()` by default.
     */

  }, {
    key: 'emitWarningMessage',
    value: function emitWarningMessage(message) {
      console.warn('flow-runtime:', message);
    }
  }, {
    key: 'propTypes',
    value: function propTypes(type) {
      return makeReactPropTypes(type.unwrap());
    }
  }, {
    key: 'match',
    value: function match() {
      for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      var clauses = args.pop();
      if (!Array.isArray(clauses)) {
        throw new Error('Invalid pattern, last argument must be an array.');
      }
      clauses;
      var pattern = this.pattern.apply(this, toConsumableArray(clauses));
      return pattern.apply(undefined, args);
    }
  }, {
    key: 'pattern',
    value: function pattern() {
      for (var _len16 = arguments.length, clauses = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        clauses[_key16] = arguments[_key16];
      }

      var length = clauses.length;

      var tests = new Array(length);
      for (var i = 0; i < length; i++) {
        var clause = clauses[i];
        var annotation = this.getAnnotation(clause);
        if (!annotation) {
          if (i !== length - 1) {
            throw new Error(`Invalid Pattern - found unannotated function in position ${ i }, default clauses must be last.`);
          }
          tests[i] = true;
        } else {
          invariant(annotation instanceof FunctionType || annotation instanceof ParameterizedFunctionType, 'Pattern clauses must be annotated functions.');
          tests[i] = annotation;
        }
      }
      return function () {
        for (var _i = 0; _i < tests.length; _i++) {
          var test = tests[_i];
          var _clause = clauses[_i];
          if (test === true) {
            return _clause.apply(undefined, arguments);
          } else if (test.acceptsParams.apply(test, arguments)) {
            return _clause.apply(undefined, arguments);
          }
        }
        var error = new TypeError('Value did not match any of the candidates.');
        error.name = 'RuntimeTypeError';
        throw error;
      };
    }
  }, {
    key: 'wrapIterator',
    value: function wrapIterator(type) {
      var t = this;
      return function* wrappedIterator(input) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            yield t.check(type, item);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      };
    }
  }, {
    key: 'refinement',
    value: function refinement(type) {
      var target = new RefinementType(this);
      target.type = type;

      for (var _len17 = arguments.length, constraints = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
        constraints[_key17 - 1] = arguments[_key17];
      }

      target.addConstraint.apply(target, toConsumableArray(constraints));
      return target;
    }
  }, {
    key: '$diff',
    value: function $diff(aType, bType) {
      var target = new $DiffType(this);
      target.aType = aType;
      target.bType = bType;
      return target;
    }
  }, {
    key: '$flowFixMe',
    value: function $flowFixMe() {
      return new $FlowFixMeType(this);
    }
  }, {
    key: '$keys',
    value: function $keys(type) {
      var target = new $KeysType(this);
      target.type = type;
      return target;
    }
  }, {
    key: '$objMap',
    value: function $objMap(object, mapper) {
      var target = new $ObjMapType(this);
      target.object = object;
      target.mapper = mapper;
      return target;
    }
  }, {
    key: '$objMapi',
    value: function $objMapi(object, mapper) {
      var target = new $ObjMapiType(this);
      target.object = object;
      target.mapper = mapper;
      return target;
    }
  }, {
    key: '$propertyType',
    value: function $propertyType(object, property) {
      var target = new $PropertyType(this);
      target.object = object;
      if (property instanceof Type) {
        var unwrapped = property.unwrap();
        target.property = unwrapped.value;
      } else {
        target.property = property;
      }
      return target;
    }
  }, {
    key: '$shape',
    value: function $shape(type) {
      var target = new $ShapeType(this);
      target.type = type;
      return target;
    }
  }, {
    key: '$subtype',
    value: function $subtype(type) {
      var target = new $SubType(this);
      target.type = type;
      return target;
    }
  }, {
    key: '$supertype',
    value: function $supertype(type) {
      var target = new $SuperType(this);
      target.type = type;
      return target;
    }
  }, {
    key: '$tupleMap',
    value: function $tupleMap(tuple, mapper) {
      var target = new $TupleMapType(this);
      target.tuple = tuple;
      target.mapper = mapper;
      return target;
    }
  }, {
    key: 'Class',
    value: function Class(instanceType) {
      var target = new ClassType(this);
      target.instanceType = instanceType;
      return target;
    }
  }]);
  return TypeContext;
}();

var globalContext$1 = new TypeContext();
registerPrimitiveTypes(globalContext$1);
registerBuiltinTypeConstructors(globalContext$1);
registerTypePredicates(globalContext$1);

var index$1 = x => (
	x instanceof Promise ||
	(
		x !== null &&
		typeof x === 'object' &&
		typeof x.then === 'function' &&
		typeof x.catch === 'function'
	)
);

aru.store = {};

aru.set = function () {
  var _ref = _asyncToGenerator(index.mark(function _callee(key, value) {
    var value$;
    return index.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            globalContext$1.string().assert(key);
            globalContext$1.any().assert(value);

            _context.prev = 2;
            _context.next = 5;
            return value;

          case 5:
            value$ = _context.sent;

            this.store[key] = value$;
            _context.next = 11;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](2);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

aru.setSync = function (key, value) {
  globalContext$1.string().assert(key);
  globalContext$1.any().assert(value);

  if (typeof value === 'function') {
    try {
      var value$ = value();
      this.store[key] = value$;
    } catch (err) {}
  } else {
    try {
      this.store[key] = value;
    } catch (err) {}
  }
};

aru.get = function (key) {
  globalContext$1.string().assert(key);

  var value = this.store[key];
  if (key in this.store) {
    return value;
  }
  return null;
};

aru.has = function (key) {
  globalContext$1.string().assert(key);

  if (key in this.store) {
    return true;
  }
  return false;
};

aru.left = function (key, cb) {
  globalContext$1.string().assert(key);
  globalContext$1.function(globalContext$1.return(globalContext$1.any())).assert(cb);

  if (key in this.store) {
    return null;
  }
  return cb();
};

aru.right = function (key, cb) {
  globalContext$1.string().assert(key);
  globalContext$1.function(globalContext$1.return(globalContext$1.any())).assert(cb);

  if (key in this.store) {
    return cb();
  }
  return null;
};

function aru() {
  if (arguments.length === 0) {
    throw new Error('Required arguments');
  }

  if (arguments.length === 1) {
    return aru.get.apply(aru, arguments);
  }

  if (arguments.length > 1) {
    if (index$1(arguments[1])) {
      return aru.set.apply(aru, arguments);
    }
    return aru.setSync.apply(aru, arguments);
  }
}

return aru;

}());

//# sourceMappingURL=aru.js.map