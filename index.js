export default function flattenator({
  inputObject,
  nestingKey,
  persistKeys,
  iterFunc,
}) {
  const output = [];
  function flatten(input) {
    if (Array.isArray(input)) {
      input.forEach((element) => {
        if (Array.isArray(element)) {
          flatten(element);
        } else if (isObject(element)) {
          output.push(formatObject(element));
        } else {
          output.push(element);
        }
      });
    } else {
      // Just assume if it's not an arr then it's a nested object
      if (input) {
        output.push(formatObject(input));
        if (input[nestingKey]) flatten(input[nestingKey]);
      }
    };
  }

  function formatObject(obj) {
    /*
    persistKeys should only affect the obj's original keys
    If we're adding a key via a func, for sure it should stay
    */
    const preFuncKeys = Object.keys(obj);
    if (iterFunc) iterFunc(obj);
    return Object.entries(obj).reduce((result, [key, value]) => {
      if ((key !== nestingKey) && (persistKeys ? persistKeys.includes(key) : true)) result[key] = value;
      if (!preFuncKeys.includes(key)) result[key] = value;
      return result;
    }, {});
  }

  flatten(inputObject);
  return output;
}

function isObject(input) {
  return typeof input === 'object' && input !== null;
}
