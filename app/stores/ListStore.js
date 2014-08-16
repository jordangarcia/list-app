var _ = require('underscore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var lists = {};

function addList(list) {
  lists[list.id] = list;
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
    return lists[id];
  },

  getAll: function() {
    return lists;
  },

  getRootList: function() {
    return _.values(lists)[0];
  }
});

ListStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_LIST:
      addList(action.list);
      ListStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = ListStore;
