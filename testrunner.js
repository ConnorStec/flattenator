import assert from 'assert';
import flattenator from './index.js';

const config = {};

// It defaults output to an empty array
assert.deepStrictEqual(flattenator(config), []);

// It flattens a 2D array
config.inputObject = [1, [2, 3]];
assert.deepStrictEqual(flattenator(config), [1, 2, 3]);

// It flattens a 3D array
config.inputObject = [1, [2, [3, 4]]];
assert.deepStrictEqual(flattenator(config), [1, 2, 3, 4]);

// It flattens nested objects
const parent = {id: 1, name: 'boop'};
const child1 = {id: 2, name: 'snoop'};
const child2 = {id: 3, name: 'zoop'};

config.inputObject = {
  ...parent,
  children: [
    child1,
    child2,
  ]
};
config.nestingKey = 'children';
assert.deepStrictEqual(flattenator(config), [parent, child1, child2]);

// It returns only the desired properties per flattened object
config.persistKeys = ['name'];
console.log(JSON.stringify(flattenator(config)));
assert.deepStrictEqual(flattenator(config), [
  {name: 'boop'},
  {name: 'snoop'},
  {name: 'zoop'},
]);