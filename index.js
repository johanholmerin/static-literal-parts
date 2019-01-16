const values = new WeakMap();
const literals = new WeakMap();

function getLit(template) {
  if (!literals.has(template)) {
    literals.set(template, {});
  }
  return literals.get(template);
}

function taggedTemplateLiteral(strings, raw) {
  return Object.freeze(
    Object.defineProperties(strings, {
      raw: { value: Object.freeze(raw) }
    })
  );
}

function createLit(templates, parts) {
  const newTemplate = [];
  const newRaw = [];
  const newParts = parts.filter(part => !values.has(part));

  for (let index = 0; index < templates.length; index++) {
    const template = templates[index];
    const part = parts[index];

    if (values.has(part)) {
      const value = values.get(part);
      newTemplate.push(template + value + templates[index+1]);
      newRaw.push(templates.raw[index] + value + templates.raw[index+1]);
      index++;
    } else {
      newTemplate.push(template);
      newRaw.push(templates.raw[index]);
    }
  }

  return [
    taggedTemplateLiteral(newTemplate, newRaw),
    ...newParts
  ];
}

export function stat(value) {
  const obj = Object.create(null);
  values.set(obj, value);
  return obj;
}

export function wrap(fn) {
  return (template, ...parts) => {
    const staticValues = parts.map(value => {
      return values.has(value) ? values.get(value) : '';
    }).join();
    const cache = getLit(template);

    if (!(staticValues in cache)) {
      cache[staticValues] = createLit(template, parts);
    }

    return fn(...cache[staticValues]);
  };
}
