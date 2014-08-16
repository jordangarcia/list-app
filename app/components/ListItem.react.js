/**
 * @jsx React.DOM
 */
var React = require('react');

var ContentEditable = require('components/ContentEditable.react');
var ViewActions = require('actions/ViewActionCreators');

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

var ListItem = React.createClass({

  componentDidUpdate: function() {
    if (this.props.list.hasFocus) {
      this.refs.input.getDOMNode().focus();
    }
  },

  _onChange: function(event) {
    var value = event.target.value;
    ViewActions.updateListItem(this.props.list, {
      value: value
    });
  },

  _onKeyDown: function(event) {
    if (event.key === 'Enter') {
      // create a new list and pass the current list as the parent
      var caretPos = getCaretPosition(this.refs.input.getDOMNode());
      ViewActions.enterPressed(this.props.list, caretPos);
      event.nativeEvent.preventDefault();
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
