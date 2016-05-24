import React from 'react';
import {Notifs as ReNotifs} from 're-notif';
import css from 're-notif/src/re-notif.css';

// use bootstrap classes
const theme = {
  defaultClasses: 'alert',
  successClasses: 'alert-success',
  infoClasses: 'alert-info',
  warningClasses: 'alert-warning',
  dangerClasses: 'alert-danger',
};

const Notifs = () => <ReNotifs theme={theme} forceNotifsStyles />;

export default Notifs;
