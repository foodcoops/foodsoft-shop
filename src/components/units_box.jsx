import React from 'react';
import PropTypes from 'prop-types';
import iconBox from '../../assets/icon-box-bg.svg';

const UnitsBox = ({boxes}) => (
  <span style={styles.container}>{boxes}</span>
);

UnitsBox.propTypes = {
  boxes: PropTypes.number
};

export default UnitsBox;

const styles = {
  container: {
    backgroundImage: `url(${iconBox})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
    display: 'inline-block',
    minWidth: 18,
    minHeight: 18,
    textAlign: 'center',
  },
};
