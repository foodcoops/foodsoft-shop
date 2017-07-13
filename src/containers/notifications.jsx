import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import './notifications.css';

const Notification = ({ message, kind }) => (
  <div className={`alert alert-${kind}`}>{message}</div>
);

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  kind: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired
};

const Notifications = ({ notifications }) => (
  <div className='notifications'>
    <CSSTransitionGroup
      transitionName='notifications-transition'
      transitionEnterTimeout={500}
      transitionLeaveTimeout={500}>
        {notifications.map((n, i) => (
          <Notification key={i} {...n} />
        ))}
    </CSSTransitionGroup>
  </div>
);

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default connect((state) => {
  return {notifications: state.notifications};
})(Notifications);
