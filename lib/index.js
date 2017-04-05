import isPromise from 'p-is-promise';

aru.store = {};

aru.set = async function set(key, value) {
  try {
    this.store[key] = await value;
  } catch (err) {}
}

aru.setSync = function setSync(key, value) {
  if (typeof value === 'function') {
    try {
      this.store[key] = value();
    } catch (err) {}
  } else {
    try {
      this.store[key] = value;
    } catch (err) {}
  }
}

aru.get = function get(key) {
  const value = this.store[key];
  if (typeof value === 'undefined') {
    return null;
  }
  return value;
}

aru.has = function has(key) {
  const value = this.store[key];
  if (typeof value === 'undefined') {
    return false;
  }
  return true;
}

aru.left = function left(key, cb) {
  const value = this.store[key];
  if (typeof value === 'undefined') {
    return cb();
  }
  return null;
}

aru.right = function right(key, cb) {
  const value = this.store[key];
  if (typeof value === 'undefined') {
    return null;
  }
  return cb();
}

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
    } else {
      return aru.setSync.apply(aru, arguments);
    }
  }
}
