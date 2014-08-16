var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var ListOperations = require('utils/ListOperations');

module.exports = {

  enterPressed: function(listItem, position) {
    // if the caret is not at the end of the list item than we want to split

    if (position === listItem.value.length) {
      var newListItem = ListOperations.createList({
        value: '',
        parent: listItem.parent,
      });
      // insert a newly created list item below
      AppDispatcher.handleViewAction({
        type: ActionTypes.ADD_LIST_ITEM,
        newListItem: newListItem,
        below: listItem,
      });

      // focus the newly created list item
      this.focusListItem(newListItem);
    } else {
      // update the value since enter was pressed in between two string values
      var valuePart1 = listItem.value.slice(0, position)
      var valuePart2 = listItem.value.slice(position)
      this.updateListItem(listItem, {
        value: valuePart1
      });

      var newListItem = ListOperations.createList({
        value: valuePart2,
        parent: listItem.parent,
      });

      // insert a newly created list item below
      AppDispatcher.handleViewAction({
        type: ActionTypes.ADD_LIST_ITEM,
        newListItem: newListItem,
        below: listItem,
      });

      // focus the newly created list item
      this.focusListItem(newListItem);

    }
  },

  focusListItem: function(listItem) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FOCUS_LIST_ITEM,
      listItem: listItem,
    });
  },

  createList: function(parent) {
    var list = ListOperations.createList({
      value: '',
      parent: parent,
    });

    AppDispatcher.handleViewAction({
      type: ActionTypes.ADD_LIST_ITEM,
      newListItem: list,
    });

  },

  updateListItem: function(list, newData) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.UPDATE_LIST,
      list: list,
      data: newData
    });
  },

};
