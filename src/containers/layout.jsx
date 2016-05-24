import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import rest from '../store/rest';
import {Navbar, NavbarBrand, Nav, NavItem} from 'react-bootstrap';
import Notifs from '../components/notifs';

class Layout extends React.Component {
  componentDidMount() {
    this.props.dispatch(rest.actions.user.sync());
  }

  render() {
    return (
      <div>
        <Notifs />
        <Navbar>
          <NavbarBrand>Foodsoft shop</NavbarBrand>
          <Nav pullRight>
            {this.props.user.data.data ?
              <NavItem href="#">{this.props.user.data.data.name}</NavItem> :
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
    data: PropTypes.object.isRequired
  }).isRequired,
};

export default connect((state) => {
  return {user: state.user}
})(Layout);
