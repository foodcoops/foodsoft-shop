import React from 'react';
import {ProgressBar} from 'react-bootstrap'

function UnitBar({unit_quantity, quantity, tolerance, result}) {
  // amounts in the last remaining (not filled) box
  const rQuantity = Math.max(0, quantity - result);
  const rTolerance = tolerance - Math.max(0, result - quantity);
  const rMissing = Math.max(0, unit_quantity - rQuantity - rTolerance);

  const reverse = rQuantity == 0;
  const pf = 100 / unit_quantity; // amount to percentage

  const rToleranceClip = Math.min(unit_quantity, rTolerance);
  const rToleranceLabel = rTolerance > rToleranceClip ? `${rToleranceClip}+` : rTolerance;

  return (
    <div>
      <ProgressBar style={styles.container}>
        <ProgressBar key={1} now={rQuantity * pf} label={rQuantity> 0 ? rQuantity : null} style={styles.normal} />
        <ProgressBar key={2} now={rToleranceClip * pf} label={rToleranceLabel} style={reverse ? styles.lightReverse : styles.light} />
        <ProgressBar key={3} now={rMissing * pf} label={rMissing} style={styles.text} />
      </ProgressBar>
    </div>
  );
}

UnitBar.propTypes = {
  result: React.PropTypes.number.isRequired,
  quantity: React.PropTypes.number.isRequired,
  tolerance: React.PropTypes.number.isRequired,
  unit_quantity: React.PropTypes.number.isRequired
};

const styles = {
  container: {
    verticalAlign: 'middle',
    display: 'inline-block',
    marginBottom: 0,
    width: '5em'
  },
  normal: {
    backgroundColor: '#0e90d2',
    color: '#ddd'
  },
  light: {
    backgroundColor: '#54afdd',
    color: '#ddd'
  },
  lightReverse: {
    float: 'right',
    backgroundColor: '#ebf1f5',
    color: '#bbb'
  },
  text: {
    backgroundColor: 'inherit',
    boxShadow: 'inherit',
    color: '#ddd'
  }
};

export default UnitBar;
