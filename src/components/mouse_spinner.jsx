import React, {PropTypes} from 'react';

const MouseSpinner = ({active, className, children, ...props}) => (
  <div {...props} className={active ? [className, 'cursor-loading'].join(' ') : className}>
    <style>{
        ['', 'a', 'a:link', 'a:visited', 'a:focus', 'a:hover', 'a:active', 'input'].map((s) => (
          `body .cursor-loading ${s}`
        )).join(', ') + ' { cursor: progress !important; }'
    }</style>
    {children}
  </div>
);

MouseSpinner.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default MouseSpinner;
