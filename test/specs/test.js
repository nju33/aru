import test from 'ava';
import sinon from 'sinon';
import aru from '../../lib';

test('Throw when arguments length is 0', t => {
  const err = t.throws(aru);
  t.is(err.message, 'Required arguments');
});

test('String', t => {
  const left = sinon.spy();
  const right = sinon.spy();

  aru('str', 'str');
  t.true(aru.has('str'));
  t.is(aru('str'), 'str');

  aru.left('str', left);
  t.true(left.notCalled);

  aru.right('str', right);
  t.true(right.calledOnce);
});

test('Function', t => {
  const left = sinon.spy();
  const right = sinon.spy();

  aru('func', () => 1);
  t.true(aru.has('func'));
  t.is(aru('func'), 1);

  aru.left('str', left);
  t.true(left.notCalled);

  aru.right('func', right);
  t.true(right.calledOnce);
});

test('Promise:then', async t => {
  const left = sinon.spy();
  const right = sinon.spy();

  await aru('promise:resolve', Promise.resolve(1));
  t.true(aru.has('promise:resolve'));
  t.is(aru('promise:resolve'), 1);

  aru.left('promise:resolve', left);
  t.true(right.notCalled);

  aru.right('promise:resolve', right);
  t.true(right.calledOnce);
});

test('Promise:reject', async t => {
  const left = sinon.spy();
  const right = sinon.spy();

  await aru('promise:reject', Promise.reject(1));
  t.false(aru.has('promise:reject'));
  t.is(aru('promise:reject'), null);

  aru.left('promise:reject', left);
  t.true(left.calledOnce);

  aru.right('promise:reject', right);
  t.true(right.notCalled);
});
