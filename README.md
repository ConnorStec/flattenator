# The Flattenator

The Flattenator will completely flatten a given multidimensional array or deeply nested Javascript object. Hopefully you can avoid the data structures and workflows necessary to find this useful, but if you're working with wonky trees of data it may come in handy.

Please note the array flattening behavior of this module differs from the native `Array.prototype.flat()`.
```js
const arr = [0, 1, 2, [[[3, 4]]]];

console.log(arr.flat(2));
// expected output: [0, 1, 2, [3, 4]]

console.log(flattenator({inputObject: arr}));
// expected output: [0, 1, 2, 3, 4]
```

```js
import flattenator from 'flattenator';

const nestedGroup = {
  id: 1,
  name: 'parent1',
  children: [
    {
      id: 3,
      name: 'child1',
      children: [
        {
          id: 4,
          name: 'child2',
        }
      ]
    }
  ]
};

const result = flattenator({
  inputObject: nestedGroup,
  nestingKey: 'children',
  persistKeys: ['name', 'nameChain'],
  iterFunc: function(obj) {
    obj.nameChain = obj.nameChain ? `${obj.nameChain}>>${obj.name}` : obj.name;
    (obj.children || []).forEach((c) => {
      c.nameChain = obj.nameChain;
    });
  }
});

/*
result = [
  {name: 'parent', nameChain: 'parent1'},
  {name: 'child1', nameChain: 'parent1>>child1'},
  {name: 'child2', nameChain: 'parent1>>child1>>child2'}
]
*/
```

## Further Work
- Improve testing with a real runner or further custom work
- I'm sure the recursion can be simplified and clarified