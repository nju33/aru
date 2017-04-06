# aru

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

If there is, without error checking.

## Install or Download

```sh
yarn add aru
npm i -S aru
```

Or access to [releases page](https://github.com/nju33/aru/releases).
Then, download the latest version.

## Usage

```js
import aru from 'aru';
const aru = require('aru');
```

or

```html
<script src="https://unpkg.com/aru/dist/aru.js"></script>
<script src="path/tp/aru.js"></script>
```

### API

#### `aru(key, value): promise or undefined`

- `key`: `string`
- `value`: `any`

Set a `value`. (Do noting if catch error)

#### `aru(key): value-type or null`

- `key`: `string`

Get the `value`.

#### `aru.has(key): boolean`

- `key`: `string`

Wheter key exists.

#### `aru.left(key, cb): return-value-of-cb or null`

- `key`: `string`
- `cb`: `function`

If there is no that `key`, execute `cb`

#### `aru.right(key, cb): type-of-return-value-of-cb or null`

- `key`: `string`
- `cb`: `function`

If there is that `key`, execute `cb`

### Example

```js
aru('str', 'str');
aru('str'); // 'str'
aru.has('str'); // true
aru.left('str', () => 'str'); // null
aru.right('str', () => 'str'); // 'str'

aru('func', () => 'func');
aru('func'); // 'func'
aru.has('func'); // true
aru.left('func', () => 'func'); // null
aru.right('func', () => 'func'); // 'func'

await aru('resolve', Promise.resolve('resolve'));
aru('resolve'); // 'resolve'
aru.has('resolve'); // true
aru.left('resolve', () => 'resolve') // null
aru.right('resolve', () => 'resolve') // 'resolve'

await aru('promise:reject', Promise.reject('reject'));
aru('reject'); // null
aru.has('reject') // false
aru.left('reject', () => 'reject') // 'reject'
aru.right('reject', () => 'reject') // null
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
