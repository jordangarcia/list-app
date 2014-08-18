/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @jsx React.DOM
 */

var React = require('react');

var ListItem = require('components/ListItem.react');
var ListStore = require('stores/ListStore');
var SelectedItemStore = require('stores/SelectedItemStore');

function getStateFromStores() {
  var rootList = ListStore.getRootList();
  var selectedItem = SelectedItemStore.get();

  return {
    items: rootList.children || [],
    selectedItem: selectedItem,
  }
}

var ListApp = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ListStore.addChangeListener(this._onChange);
    SelectedItemStore.addChangeListener(this._onChange);
  },

  render: function() {
    var selectedItem = this.state.selectedItem;
    return (
      <ul className="listApp">
        {this.state.items.map(function(list) {
          return <ListItem list={list}
                           selectedItem={selectedItem} />
        })}
      </ul>
    );
  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    var state = getStateFromStores();
    console.log('onChange', state);
    this.setState(state);
  }

});

module.exports = ListApp;
