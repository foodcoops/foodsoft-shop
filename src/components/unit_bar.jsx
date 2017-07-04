import React from 'react';
import PropTypes from 'prop-types';
import {ProgressBar} from 'react-bootstrap'
import lastBox from '../lib/last_box';

function UnitBar({order_article}) {
  const box = lastBox(order_article);
  const {unit_quantity} = order_article.article;

  // amounts in the last remaining (not filled) box
  const reverse = box.quantity === 0;
  const pf = 100 / unit_quantity; // amount to percentage

  const boxToleranceClip = Math.min(unit_quantity, box.tolerance);
  const boxToleranceLabel = box.tolerance > boxToleranceClip ? `${boxToleranceClip}+` : box.tolerance;

  return (
    <div>
      <ProgressBar style={styles.container}>
        <ProgressBar key={1} now={box.quantity * pf} label={box.quantity> 0 ? box.quantity : null} style={styles.normal} />
        <ProgressBar key={2} now={boxToleranceClip * pf} label={boxToleranceLabel} style={reverse ? styles.lightReverse : styles.light} />
        <ProgressBar key={3} now={box.missing * pf} label={box.missing > 0 ? box.missing : null} style={styles.text} />
      </ProgressBar>
    </div>
  );
}

UnitBar.propTypes = {
  order_article: PropTypes.object.isRequired,
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
