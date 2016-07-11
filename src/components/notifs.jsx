import React from 'react';
import {Notifs as ReNotifs} from 'redux-notifications';
import css from 'redux-notifications/css/styles.css';

// bootstrap theme (omitting action)
const Notif = ({kind, componentClassName, message}) => (
  <div className={`alert alert-${kind}`}>{message}</div>
);

Notif.propTypes = {
  message: React.PropTypes.string.isRequired,
  kind: React.PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  componentClassName: React.PropTypes.string,
};

const Notifs = () => <ReNotifs CustomComponent={Notif} />;

export default Notifs;
