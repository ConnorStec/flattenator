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
assert.deepStrictEqual(flattenator(config), [
  {name: 'boop'},
  {name: 'snoop'},
  {name: 'zoop'},
]);

// It supports an iterateFunction for further manipulating elements while looping
config.persistKeys = ['name', 'newKey'];
config.iterFunc = function(obj) {
  obj.newKey = `${obj.id} - ${obj.name}`;
}
assert.deepStrictEqual(flattenator(config), [
  {name: 'boop', newKey: '1 - boop'},
  {name: 'snoop', newKey: '2 - snoop'},
  {name: 'zoop', newKey: '3 - zoop'},
]);

// iterFunc can manipulate further-nested objects
delete config.iterFunc;
config.persistKeys = ['name'];
config.inputObject = {
  ...parent,
  children: [
    {
      ...child1,
      children: [child2],
    }
  ]
};

assert.deepStrictEqual(flattenator(config), [
  {name: 'boop'},
  {name: 'snoop'},
  {name: 'zoop'},
]);

config.persistKeys = ['name', 'nameChain'];
config.iterFunc = function(obj) {
  obj.nameChain = obj.nameChain ? `${obj.nameChain}>>${obj.name}` : obj.name;
  (obj.children || []).forEach((c) => {
    c.nameChain = obj.nameChain;
  });
}

assert.deepStrictEqual(flattenator(config), [
  {name: 'boop', nameChain: 'boop'},
  {name: 'snoop', nameChain: 'boop>>snoop'},
  {name: 'zoop', nameChain: 'boop>>snoop>>zoop'},
]);
