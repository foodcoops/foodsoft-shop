import React from 'react';
import PropTypes from 'prop-types';
import {Notifs as ReNotifs} from 'redux-notifications';
import css from 'redux-notifications/src/styles.css';

// bootstrap theme (omitting action)
const Notif = ({kind, componentClassName, message}) => (
  <div className={`alert alert-${kind}`}>{message}</div>
);

Notif.propTypes = {
  message: PropTypes.string.isRequired,
  kind: PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  componentClassName: PropTypes.string,
};

const Notifs = () => <ReNotifs CustomComponent={Notif} />;

export default Notifs;
