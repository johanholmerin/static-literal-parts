const tap = require('tap');
import { stat, wrap } from './index.js';

tap.test('static value is inserted', t => {
  const value = wrap(t => t[0])`Hello ${stat('Hello')} Lorem ${'Foo'}!`;

  t.equal(value, 'Hello Hello Lorem ');

  t.end();
});

tap.test('template shape', t => {
  const wrapped = wrap(t => t)`Hello \n ${'Foo'}!`;
  const standard = (t => t)`Hello \n ${'Foo'}!`;

  t.same(wrapped, standard);
  t.same(wrapped.raw, standard.raw);

  t.end();
});

tap.test('template is cached', t => {
  function test(name) {
    return wrap(t => t)`
      <${stat('div')}>
        Hello ${name}!
      </${stat('div')}>
    `;
  }

  t.equal(test('World'), test('Foo'));
  t.end();
});

tap.test('template is not cached when changing static part', t => {
  function test(tag) {
    return wrap(t => t)`<${stat(tag)} />`;
  }

  t.notEqual(test('div', 'World'), test('button', 'World'));
  t.end();
});

tap.test('wrap ', t => {
  function test(template, ...parts) {
    t.same(template, ['\n    <div>\n      Hello ', '!\n    </div>\n  ']);
    t.same(parts, ['Foo']);
  }

  wrap(test)`
    <${stat('div')}>
      Hello ${'Foo'}!
    </${stat('div')}>
  `;

  t.end();
});
