var _             = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes   = require('../constants/ActionTypes');
var EventEmitter  = require('events').EventEmitter;
var merge         = require('react/lib/merge');
var mergeInto     = require('react/lib/mergeInto');
var invariant     = require('react/lib/invariant');
var ListOperations = require('utils/ListOperations');

var CHANGE_EVENT = 'change';

var _ID = 0;

var rootList = ListOperations.createList({
  id: ++_ID,
});

// registry of id => list
var listRegistry = {};

/**
 * adds a new listItem to the rootList or list.parent
 * @param {List} list
 * @param {List} insertBelow list item to insert below
 */
function addList(list, insertBelow) {
  list.id = ++_ID;
  listRegistry[list.id] = list;

  if (!list.parent) {
    list.parent = rootList;
  }

  if (!insertBelow) {
    // not appending insertBelow a specific item
    list.parent.children.push(list)
  } else {
    invariant(
      list.parent.children.indexOf(insertBelow) !== -1,
      'Cannot append list item insertBelow item with id = %s',
      insertBelow.id
    );
    var ind = list.parent.children.indexOf(insertBelow) + 1;
    // insert list item after the `insertBelow` item
    list.parent.children.splice(ind, 0, list);
  }

  if (list.children) {
    list.children.forEach(function(childList) {
      addList(childList);
    });
  }
}

function traverseList(list, fn) {
  list.children.forEach(function(item) {
    traverseList(item, fn);
    fn(item);
  });
}

/**
 * Tries to update a list in place, if it dones't
 * exist it adds
 */
function updateList(list, data) {
  invariant(
    listRegistry[list.id],
    'List with id = %s must be present in listRegistry',
    list.id
  );
  mergeInto(listRegistry[list.id], data);
}

var ListStore = merge(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return listRegistry[id];
  },

  getRootList: function() {
    return rootList;
  },

  getNextItem: function(listItem) {
    var parentList = listItem.parent.children;
    invariant(
      parentList.indexOf(listItem) !== -1,
      'List item not in parent list'
    );
    var ind = parentList.indexOf(listItem);

    if (parentList[ind + 1]) {
      return parentList[ind + 1];
    }
  },

  getPrevItem: function(listItem) {
    var parentList = listItem.parent.children;
    invariant(
      parentList.indexOf(listItem) !== -1,
      'List item not in parent list'
    );
    var ind = parentList.indexOf(listItem);

    if (parentList[ind - 1]) {
      return parentList[ind - 1];
    }
  },
});

ListStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.ADD_LIST_ITEM:
      addList(action.newListItem, action.insertBelow);
      ListStore.emitChange();
      break;

    case ActionTypes.UPDATE_LIST:
      updateList(action.list, action.data);
      ListStore.emitChange();
      break;

    case ActionTypes.RECEIVE_ROOT_LIST:
      action.list.forEach(function(list) {
        addList(list);
      });
      ListStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = ListStore;
