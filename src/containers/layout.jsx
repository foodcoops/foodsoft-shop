import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Clearfix, DropdownButton, MenuItem, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { foodsoftUrl } from '../config';
import { fetchCurrentUser } from '../actions/user';
import { fetchConfig } from '../actions/config';
import Notifications from '../containers/notifications';
import Navigation from '../containers/navigation';
import Logo from '../components/logo';
import './layout.css';

import { t } from 'i18n';
const T = (s, opts) => t('navigation.'+s, opts);

class Layout extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchConfig());
    this.props.dispatch(fetchCurrentUser());
  }

  render() {
    const { user, config } = this.props;
    return (
      <div>
        <Notifications />
        <div className='nav-pre-header'>
          <div className='logo pull-left'>
            <a href={foodsoftUrl}><Logo /></a>
          </div>
          <Nav bsStyle='pills' className='nav-pre-buttons' pullRight>
            <NavDropdown title={user.name} id='user-dropdown'>
              <MenuItem href={`${foodsoftUrl}/home/profile`} eventKey='1'>{T('profile')}</MenuItem>
              <MenuItem href={`${foodsoftUrl}/home/ordergroup`} eventKey='2'>{T('ordergroup')}</MenuItem>
              <MenuItem href={`${foodsoftUrl}/logout`} eventKey='3'>{T('logout')}</MenuItem>
            </NavDropdown>
            <NavItem href={config.homepage}>{config.name}</NavItem>
            {config.help_url ? <NavItem href={config.help_url}>{T('help')}</NavItem> : null}
            <NavItem href={`${foodsoftUrl}/feedback/new`}>{T('feedback')}</NavItem>
          </Nav>
          <Clearfix />
        </div>
        <Navbar fluid>
          <Navigation />
        </Navbar>
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }

};

Layout.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.bool.string
  }).isRequired,
  config: PropTypes.object.isRequired
};

function select(state, props) {
  return { user: state.user, config: state.config.data };
}

export default withRouter(connect(select)(Layout));
