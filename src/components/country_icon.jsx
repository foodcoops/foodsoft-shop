import React from 'react';

// needs to have flag-icon-css stylesheet loaded

const CountryIcon = ({code}) => (code && code.length==2) ?
  <div className={`famfamfam-flags ${code.toLowerCase()}`} /> : null;

export default CountryIcon;
