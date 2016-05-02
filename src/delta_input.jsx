import React from 'react';
import {Button, FormControl, Glyphicon, InputGroup} from 'react-bootstrap';

function onDelta(value, min, max, onChange, event) {
  if (onChange !== null) {
    if ((min === null || value >= min) && (max === null || value <= max)) {
      onChange(value, event);
    }
  }
  return true;
}

function DeltaInput({value, min, max, delta, onChange}) {
  return (
    <InputGroup>
      <InputGroup.Button>
        <Button onClick={(e) => onDelta((value||0)+delta, min, max, onChange, e)} disabled={max !== null && value >= max} style={styles.button}>
          <Glyphicon glyph='plus' style={styles.icon} />
        </Button>
      </InputGroup.Button>
      <FormControl type='text' value={value} onChange={(e) => onDelta(e.target.value, min, max, onChange, e)} style={styles.input} />
      <InputGroup.Button>
        <Button onClick={(e) => onDelta((value||0)-delta, min, max, onChange, e)} disabled={min !== null && value >= max} style={styles.button}>
          <Glyphicon glyph='minus' style={styles.icon} />
        </Button>
      </InputGroup.Button>
    </InputGroup>
  );
}

DeltaInput.propTypes = {
  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  delta: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func,
};

DeltaInput.defaultProps = {
  delta: 1,
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
