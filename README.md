# static-literal-parts

Dynamic static parts for tagged template literals. Templates are cached when the
same static values are used.

## Installation

```sh
yarn add git+https://github.com/johanholmerin/static-literal-parts#semver:^1.1.0
```

## Usage

```javascript
import { stat, wrap } from 'static-literal-parts';

function render({ type, name }) {
  return wrap(html)`
    <${stat(type)}>
      Hello ${name}!
    </${stat(type)}>
  `;
}
```

## Browser support

Native WeakMap support required
