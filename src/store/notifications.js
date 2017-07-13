import { danger } from '../actions/notifications';

// middleware to show notification on error actions
const notificationsMiddleware = store => next => action => {
  if (/_FAILURE$/.test(action.type)) {
     const error = action.payload;
     if (error) next(danger(error.message));
  }
  return next(action);
};

export default notificationsMiddleware;
