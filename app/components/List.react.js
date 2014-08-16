/**
 * @jsx React.DOM
 */
var React = require('react');

var List = React.createClass({

  render: function() {
    var list = this.props.list;
    return (
      <li>
        {list.value}
      </li>
    );
  }

});

module.exports = List;
