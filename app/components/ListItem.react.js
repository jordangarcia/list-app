/**
 * @jsx React.DOM
 */
var React = require('react');

var ContentEditable = require('components/ContentEditable.react');
var ViewActions = require('actions/ViewActionCreators');

var TEXT_NODE_TYPE = 3;

function getCaretPosition(editableDiv) {
  var caretPos = 0, containerEl = null, sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

/**
 * Sets the caret position in the passed in el as pos
 * @param {HTMLElement} el
 * @param {number} pos
 */
function setCaretPosition(el, pos) {
  if (el.childNodes[0] && el.childNodes[0].nodeType === TEXT_NODE_TYPE) {
    el = el.childNodes[0];
  } else {
    return;
  }
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(el, pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

var ListItem = React.createClass({

  getInitialState: function() {
    return {
      isFocused: false,
      caretPos: -1,
    };
  },

  componentDidMount: function() {
    console.log('componentDidMount');
    this._setFocus();
  },

  componentDidUpdate: function() {
    console.log('componentDidUpdate');
    this._setFocus();
  },

  _setFocus: function() {
    var listItem = this.props.list;
    var selectedItem = this.props.selectedItem;
    if (listItem.id === selectedItem.selectedItemId) {
      if (!this.state.isFocused || this.state.caretPos !== selectedItem.focusPosition) {
        // if any state related to focus or caretPos changed
        console.log('found list item with focus');
        var el = this.refs.input.getDOMNode();
        el.focus();
        setCaretPosition(el, selectedItem.focusPosition);
        this.setState({
          isFocused: true,
          caretPos: selectedItem.focusPosition,
        });
      }
    } else {
      if (this.state.isFocused) {
        // to avoid recursion only setState to isFocused once
        this.setState({
          isFocused: false,
          caretPos: -1,
        });
      }
    }
  },

  _onChange: function(event) {
    var value = event.target.value;
    ViewActions.updateListItem(this.props.list, {
      value: value
    });
  },

  /**
   * @param {Event} event
   */
  _onKeyDown: function(event) {
    var currentListItem = this.props.list;
    var caretPos = getCaretPosition(this.refs.input.getDOMNode());

    console.log('keyDown', event.key, caretPos);
    switch(event.key) {
      case 'Enter':
        // create a new list and pass the current list as the parent
        ViewActions.enterPressed(currentListItem, caretPos);
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'ArrowUp':
        ViewActions.moveFocus(currentListItem, 'up');
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'ArrowDown':
        ViewActions.moveFocus(currentListItem, 'down');
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        if (caretPos === 0) {
          // set focus at end
          ViewActions.moveFocus(currentListItem, 'up', true);
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (caretPos === currentListItem.value.length) {
          // set focus at beginning
          ViewActions.moveFocus(currentListItem, 'down', false);
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  },

  render: function() {
    var list = this.props.list;
    return (
      <li>
        <ContentEditable onKeyDown={this._onKeyDown}
                         onChange={this._onChange}
                         html={list.value}
                         ref="input" />
        <ul>
          {list.children.map(function(item) {
            return <ListItem list={item} />
          })}
        </ul>
      </li>
    );
  }

});

module.exports = ListItem;
