/**
 * @module flattenator
 * Flattens a given input array or nested object chain
 * @param {Object} config - Config object.
 * @param {Array.<any>|Object} inputObject - The base object to iterate over.
 * @param {string} nestingKey - When working with nested objects, the property to follow and continue the recursion. This property will always be removed from the final output.
 * @param {Array.<string>} persistKeys - When working with nested objects, the properties to return for each iterated object in the result.
 * @param {Function} iterFunc - When working with nested objects, a custom function to run on each iteration to produce any custom results.
 * @returns {Array.<any>} The resulting flattened array.
 */
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
          if (element[nestingKey]) flatten(element[nestingKey]);
        } else {
          output.push(element);
        }
      });
    } else {
      if (input) {
        output.push(formatObject(input));
        if (input[nestingKey]) flatten(input[nestingKey]);
      }
    };
  }

  function formatObject(obj) {
    if (iterFunc) iterFunc(obj);
    return Object.entries(obj).reduce((result, [key, value]) => {
      if ((key !== nestingKey) && (persistKeys ? persistKeys.includes(key) : true)) result[key] = value;
      return result;
    }, {});
  }

  flatten(inputObject);
  return output;
}

function isObject(input) {
  return typeof input === 'object' && input !== null;
}
