/**
 * @jsx React.DOM
 */
var React = require('react');
var ContentEditable = React.createClass({
  render: function(){
    return <div 
    onKeyDown={this.onKeyDown}
    onInput={this.emitChange} 
    onBlur={this.emitChange}
    contentEditable
    dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
  },
  shouldComponentUpdate: function(nextProps){
    return nextProps.html !== this.getDOMNode().innerHTML;
  },
  onKeyDown: function() {
    if (this.props.onKeyDown) {
      this.props.onKeyDown.apply(this, arguments);
    }
  },
  emitChange: function(){
    var html = this.getDOMNode().innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {

      this.props.onChange({
        target: {
          value: html
        }
      });
    }
    this.lastHtml = html;
  }
});

module.exports = ContentEditable;
