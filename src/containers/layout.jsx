import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import rest from '../store/rest';
import { Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Notifs from '../components/notifs';

class Layout extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.user.sync());
  }

  render() {
    return (
      <div>
        {/* <Notifs /> */}
        <Navbar>
          <Navbar.Brand>
            <LinkContainer to='/'><a>Foodsoft shop</a></LinkContainer>
          </Navbar.Brand>
          <Nav pullRight>
            {this.props.user.data.data ?
              <NavItem>{this.props.user.data.data.name}</NavItem> :
              <NavItem>Login</NavItem>}
          </Nav>
        </Navbar>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }

};

Layout.propTypes = {
  user: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired,
};

export default withRouter(connect((state) => {
  return {user: state.user}
})(Layout));
