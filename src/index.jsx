import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './store';
import Layout from './layout';
import Orders from './orders';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <Orders />
        </Layout>
      </Provider>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('app'));
