import React from 'react';
import { connect } from 'react-redux';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { fetchNavigation } from '../actions/navigation';

function navitem(item, level, options={}) {
  if (item.items) {
    return (
      <NavDropdown title={item.name} id={item.name} {...options}>
        {item.items.map((i,n) => navitem(i, level+1, {key: n}))}
      </NavDropdown>
    );
  } else if (item.url && level == 0) {
    return <NavItem href={item.url} {...options}>{item.name}</NavItem>;
  } else if (item.url) {
    return <MenuItem href={item.url} {...options}>{item.name}</MenuItem>;
  }
}

class Navigation extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchNavigation());
  }

  render() {
    const { navigation } = this.props;
    return (
      <Nav {...this.props}>
        {navigation.map((i,n) => navitem(i, 0, {key: n}))}
      </Nav>
    );
  }
};

function select(state, props) {
  return { navigation: state.navigation.data };
}

export default connect(select)(Navigation);
