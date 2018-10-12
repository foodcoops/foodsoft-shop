import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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
    <TransitionGroup>
      {notifications.map((n, i) => (
        <CSSTransition classNames='notifications-transition' timeout={500} key={i}>
          <Notification {...n} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </div>
);

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default connect((state) => {
  return {notifications: state.notifications};
})(Notifications);
