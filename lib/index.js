// @flow

import t from 'flow-runtime';
import isPromise from 'p-is-promise';

aru.store = {};

aru.set = async function (key: string, value: any) {
  t.string().assert(key);
  t.any().assert(value);

  try {
    const value$ = await value;
    this.store[key] = value$;
  } catch (err) {}
};

aru.setSync = function (key: string, value: any) {
  t.string().assert(key);
  t.any().assert(value);

  if (typeof value === 'function') {
    try {
      const value$ = value();
      this.store[key] = value$;
    } catch (err) {}
  } else {
    try {
      this.store[key] = value;
    } catch (err) {}
  }
};

aru.get = function (key: string) {
  t.string().assert(key);

  const value = this.store[key];
  if (key in this.store) {
    return value;
  }
  return null;
};

aru.has = function (key: string) {
  t.string().assert(key);

  if (key in this.store) {
    return true;
  }
  return false;
};

aru.left = function (key: string, cb: () => any) {
  t.string().assert(key);
  t.function(t.return(t.any())).assert(cb);

  if (key in this.store) {
    return null;
  }
  return cb();
};

aru.right = function (key: string, cb: () => any) {
  t.string().assert(key);
  t.function(t.return(t.any())).assert(cb);

  if (key in this.store) {
    return cb();
  }
  return null;
};

export default function aru() {
  if (arguments.length === 0) {
    throw new Error('Required arguments');
  }

  if (arguments.length === 1) {
    return aru.get.apply(aru, arguments);
  }

  if (arguments.length > 1) {
    if (isPromise(arguments[1])) {
      return aru.set.apply(aru, arguments);
    }
    return aru.setSync.apply(aru, arguments);
  }
}
