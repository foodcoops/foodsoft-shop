import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { fetchCurrentUser } from '../actions/user';
import Notifs from '../components/notifs';

class Layout extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchCurrentUser());
  }

  render() {
    return (
      <div>
        <Notifs />
        <Navbar>
          <Navbar.Brand>
            <LinkContainer to='/'><a>Foodsoft shop</a></LinkContainer>
          </Navbar.Brand>
          <Nav pullRight>
            {this.props.user.loggedIn ?
              <NavItem href="#">{this.props.user.name}</NavItem> :
              <NavItem href="#">Login</NavItem>}
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
    loggedIn: PropTypes.bool.isRequired,
    name: PropTypes.bool.string
  }).isRequired,
};

function select(state, props) {
  return { user: state.user };
}

export default withRouter(connect(select)(Layout));
