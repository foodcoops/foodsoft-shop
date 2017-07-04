import React from 'react';
import PropTypes from 'prop-types';
import {Button, FormControl, FormGroup, Glyphicon, InputGroup} from 'react-bootstrap';
import InputField from 'react-debounce-input';

// search box with icon and debounce delay; can be reset if value is empty
const SearchBox = ({active, value, onChange, ...props}) => {
  return (
    <FormGroup {...props}>
      <InputField initialValue={value} value={value ? undefined : ''}placeholder='Search ...'
        onChange={onChange} debounceTimeout={350} className='form-control' />
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
