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

function addList(list, below) {
  list.id = ++_ID;
  listRegistry[list.id] = list;

  if (!list.parent) {
    list.parent = rootList;
  }

  if (!below) {
    // not appending below a specific item
    list.parent.children.push(list)
  } else {
    invariant(
      list.parent.children.indexOf(below) !== -1,
      'Cannot append list item below item with id = %s',
      below.id
    );
    var ind = list.parent.children.indexOf(below) + 1;
    // insert list item after the `below` item
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

function focusListItem(listItem) {
  traverseList(rootList, function(item) {
    item.hasFocus = (item.id === listItem.id);
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
  }
});

ListStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.FOCUS_LIST_ITEM:
      focusListItem(action.listItem);
      ListStore.emitChange();
      break;

    case ActionTypes.ADD_LIST_ITEM:
      addList(action.newListItem, action.below);
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
