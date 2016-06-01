import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import MouseSpinner from '../components/mouse_spinner';

const Loading = ({loading, children}) => (
  <MouseSpinner active={loading}>{children}</MouseSpinner>
);

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default connect((state) => {
  return {loading: state.loading};
})(Loading);
