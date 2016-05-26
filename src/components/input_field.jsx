import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';

import {debounce} from 'lodash';

// Bootstrap {FormControl} that debounces value changes
class InputField extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: null,
      typing: false,
    };

    this._onChangeDebounced = debounce(this._onChangeDebouncedHandler, this.props.delay);
  }

  render() {
    return <FormControl {...this.props} value={this._getValue()} onChange={this._onChange.bind(this)} />;
  }

  _getValue() {
    return this.state.typing ? this.state.value : this.props.value;
  }

  _onChange(e, value = e.target.value) {
    e.persist();
    this.setState({value: value, typing: true});
    this._onChangeDebounced(e, value);
  }

  _onChangeDebouncedHandler(e, value) {
    if (this.props.onChange) { this.props.onChange(e, value); }
    this.setState({typing: false});
  }

}

InputField.defaultProps = {
  delay: 350
};

InputField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  delay: PropTypes.number.isRequired,
};

export default InputField;
