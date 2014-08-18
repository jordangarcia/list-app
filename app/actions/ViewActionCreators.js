var AppDispatcher = require('../dispatcher/AppDispatcher');
var ListStore = require('../stores/ListStore');
var ActionTypes = require('../constants/ActionTypes');
var ListOperations = require('utils/ListOperations');

module.exports = {
  /**
   * Handle enter press
   */
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
        insertBelow: listItem,
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
        insertBelow: listItem,
      });

      // focus the newly created list item
      this.focusListItem(newListItem);
    }
  },

  /**
   * @param {List} currentItem
   * @param {String} dir ('up'|'down')
   */
  moveFocus: function(currentItem, dir, focusAtEnd) {
    var itemToFocus;
    if (dir === 'up') {
      itemToFocus = ListOperations.getPrevItem(currentItem);
    } else {
      itemToFocus = ListOperations.getNextItem(currentItem);
    }

    if (itemToFocus) {
      AppDispatcher.handleViewAction({
        type: ActionTypes.FOCUS_LIST_ITEM,
        listItem: itemToFocus,
        focusAtEnd: !!focusAtEnd,
      });
    } else {
      // if there is no next item move the cursor to beginning
      // or end of line
      AppDispatcher.handleViewAction({
        type: ActionTypes.FOCUS_LIST_ITEM,
        listItem: currentItem,
        focusAtEnd: (dir === 'down'),
      });
    }
  },

  /**
   * @param {List} listItem
   */
  focusListItem: function(listItem, focusAtEnd) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FOCUS_LIST_ITEM,
      listItem: listItem,
      focusAtEnd: !!focusAtEnd,
    });
  },

  indentListItem: function(listItem) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.INDENT_LIST_ITEM,
      listItem: listItem,
    });
  },

  deindentListItem: function(listItem) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.DEINDENT_LIST_ITEM,
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
