import React from 'react';

// needs to have flag-icon-css stylesheet loaded

const CountryIcon = ({code}) => (code && code.length==2) ?
  <span className={`flag-icon flag-icon-${code.toLowerCase()}`} style={styles.icon} /> : null;

const styles = {
  icon: {
    width: 18,
    lineHeight: '12px',
    borderWidth: 1,
    borderRadius: 2,
    borderStyle: 'solid',
    borderColor: '#ddd'
  }
}

export default CountryIcon;
