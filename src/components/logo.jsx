import React from 'react';

const Logo = () => (
  <span style={styles.container}>
    <span style={styles.food}>food</span>
    <span style={styles.soft}>soft</span>
  </span>
);

export default Logo;

const styles = {
  container: {
    margin: '10px 0 0 30px',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ed0606'
  },
  food: {
    padding: '2px 4px',
    color: 'white',
    backgroundColor: '#ed0606'
  },
  soft: {
  }
};
