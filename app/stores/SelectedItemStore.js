var _             = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes   = require('../constants/ActionTypes');
var EventEmitter  = require('events').EventEmitter;
var merge         = require('react/lib/merge');
var mergeInto     = require('react/lib/mergeInto');
var invariant     = require('react/lib/invariant');
var ListOperations = require('utils/ListOperations');

var CHANGE_EVENT = 'change';

var data = {
  selectedItemId: null,
  focusPosition: null
};

/**
 * Updates the selectedItemId and focusPosition
 * @param {List} listItem
 * @param {Boolean} focusAtEnd
 */
function focusListItem(listItem, focusAtEnd) {
  data.selectedItemId = listItem.id;
  data.focusPosition = focusAtEnd ? listItem.value.length : 0;
}

var SelectedItemStore = merge(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  get: function() {
    return data;
  },
});

SelectedItemStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.FOCUS_LIST_ITEM:
      focusListItem(action.listItem, action.focusAtEnd);
      SelectedItemStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = SelectedItemStore;
