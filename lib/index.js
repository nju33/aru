// @flow

import isPromise from 'p-is-promise';

aru.store = {};

aru.set = async function (key: string, value: any) {
  try {
    const value$ = await value;
    this.store[key] = value$;
  } catch (err) {}
};

aru.setSync = function (key: string, value: any) {
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
  const value = this.store[key];
  if (key in this.store) {
    return value;
  }
  return null;
};

aru.has = function (key: string) {
  if (key in this.store) {
    return true;
  }
  return false;
};

aru.delete = function (key: string): void {
  if (key in this.store) {
    delete this.store[key];
  }
}

aru.left = function (key: string, cb: () => any) {
  if (key in this.store) {
    return null;
  }
  return cb();
};

aru.right = function (key: string, cb: () => any) {
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
