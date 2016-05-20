import React, {PropTypes} from 'react';
import {Button, FormGroup, FormControl, Glyphicon, InputGroup} from 'react-bootstrap';

import _ from 'lodash';

class SearchBox extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: null,
      typing: false,
    };

    this._onChangeDebounced = _.debounce(this._onChangeDebouncedHandler, 350);
  }

  render() {
    const active = this.props.active === true;
    const value = this.state.typing ? this.state.value : this.props.value
    return (
      <FormGroup onChange={this._onChange.bind(this)} className={this.props.className} style={this.props.style}>
        <FormControl value={value || ''} placeholder='Search ...'/>
        <FormControl.Feedback>
          <Glyphicon glyph='search' className={active ? 'text-primary' : null} style={active ? styles.iconActive : styles.iconNormal}/>
        </FormControl.Feedback>
      </FormGroup>
    );
  }

  _onChange(e) {
    const term = e.target.value;
    this.setState({value: term, typing: true});
    this._onChangeDebounced(term);
  }

  _onChangeDebouncedHandler(term) {
    if (this.props.onChange) { this.props.onChange(term); }
    this.setState({typing: false});
  }

}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  active: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

const styles = {
  iconActive: {
  },
  iconNormal: {
    color: '#aaa'
  }
}

export default SearchBox;
