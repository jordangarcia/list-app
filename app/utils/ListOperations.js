var merge = require('react/lib/merge');

/**
 * Creates a list object
 */
function createList(values) {
  return merge({
    id: null,
    parent: null,
    value: null,
    children: [],
  }, values);
}

module.exports = {
  createList: createList,
};
