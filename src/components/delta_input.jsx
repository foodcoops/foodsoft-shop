import {debounce} from 'lodash';
import React from 'react';
import {Button, FormControl, Glyphicon, InputGroup} from 'react-bootstrap';

class DeltaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
    this.onChangeDebounced = debounce(this.onChange, 500);
  }

  componentWillReceiveProps(nextProps) {
    // @todo find out if this is ok
    this.setState({value: nextProps.value});
  }

  render() {
    const value = this.state.value;
    const onDelta = this.onDelta.bind(this);
    const {min, max, delta, color} = this.props;
    const valueNext = (value || 0) + delta;
    const valuePrev = (value || 0) - delta;
    return (
      <InputGroup>
        <InputGroup.Button>
          <Button onClick={(e) => onDelta(e, valueNext)} disabled={max !== null && valueNext > max} style={styles.button}>
            <Glyphicon glyph='plus' style={styles.icon} />
          </Button>
        </InputGroup.Button>
        <FormControl type='text' value={value} onChange={(e) => onDelta(e, e.target.value)} style={{color: color || 'black', ...styles.input}} />
        <InputGroup.Button>
          <Button onClick={(e) => onDelta(e, valuePrev)} disabled={min !== null && valuePrev < min} style={styles.button}>
            <Glyphicon glyph='minus' style={styles.icon} />
          </Button>
        </InputGroup.Button>
      </InputGroup>
    );
  }

  onChange(event, value) {
    this.props.onChange(event, value);
  }

  onDelta(event, value) {
    const {min, max} = this.props;
    if (this.props.onChange !== null) {
      if ((min === null || value >= min) && (max === null || value <= max)) {
        this.setState({value: value});
        this.onChangeDebounced.bind(this)(event, value);
      }
    }
    return true;
  }
}

DeltaInput.propTypes = {
  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  delta: React.PropTypes.number.isRequired,
  color: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

DeltaInput.defaultProps = {
  delta: 1,
  color: null,
  min: null,
  max: null,
  onChange: null
};

const styles = {
  button: {
    paddingLeft: 8,
    paddingRight: 8,
    cursor: 'inherit' // avoid 'forbidden' when disabled
  },
  icon: {
    top: -1, // fix for vertical alignment
    fontSize: 10
  },
  input: {
    width: '3em',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  }
};

export default DeltaInput;
