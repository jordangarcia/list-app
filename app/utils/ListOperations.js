var merge     = require('react/lib/merge');
var invariant = require('react/lib/invariant');

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

function getPrevItem(listItem) {
  var parentList = listItem.parent.children;
  invariant(
    parentList.indexOf(listItem) !== -1,
    'List item not in parent list'
  );
  var ind = parentList.indexOf(listItem);

  if (parentList[ind - 1]) {
    return parentList[ind - 1];
  }
}

function getNextItem(listItem) {
  var parentList = listItem.parent.children;
  invariant(
    parentList.indexOf(listItem) !== -1,
    'List item not in parent list'
  );
  var ind = parentList.indexOf(listItem);

  if (parentList[ind + 1]) {
    return parentList[ind + 1];
  }
}

/**
 * Removes the current item from it's parent list
 * Nulls out list.parent
 * @param {List} listItem
 */
function removeItem(listItem) {
  var parentList = listItem.parent.children;
  var ind        = parentList.indexOf(listItem);
  parentList.splice(ind, 1);
  listItem.parent = null;
}


module.exports = {
  createList: createList,
  getPrevItem: getPrevItem,
  getNextItem: getNextItem,
  removeItem: removeItem,
};
