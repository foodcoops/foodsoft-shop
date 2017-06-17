import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Glyphicon, InputGroup } from 'react-bootstrap';

class DeltaInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const onDelta = this.onDelta.bind(this);
    const { min, max, delta, color, value } = this.props;
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
        this.onChange(event, value);
      }
    }
    return true;
  }
}

DeltaInput.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  delta: PropTypes.number.isRequired,
  color: PropTypes.string,
  onChange: PropTypes.func,
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
