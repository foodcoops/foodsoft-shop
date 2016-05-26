import React, {PropTypes} from 'react';
import {Button, FormControl, FormGroup, Glyphicon, InputGroup} from 'react-bootstrap';
import InputField from './input_field';

const SearchBox = ({active, value, onChange, ...props}) => {
  return (
    <FormGroup {...props}>
      <InputField value={value || ''} placeholder='Search ...' onChange={onChange}/>
      <FormControl.Feedback>
        <Glyphicon glyph='search' className={active ? 'text-primary' : null} style={active ? styles.iconActive : styles.iconNormal}/>
      </FormControl.Feedback>
    </FormGroup>
  );
};

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  active: PropTypes.bool,
  value: PropTypes.string,
};

const styles = {
  iconActive: {
  },
  iconNormal: {
    color: '#aaa'
  }
}

export default SearchBox;
