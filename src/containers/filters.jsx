import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Badge, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Panel, Tooltip, Well } from 'react-bootstrap';

import moment from 'moment';
import { connect } from 'react-redux';
import { fetchOrders } from '../actions/orders';
import { fetchCategories } from '../actions/categories';
import { replaceFilter } from '../actions/filter';
import SearchBox from '../components/search_box';

import {t, l} from 'i18n-js';
const T = (s, opts) => t('filters.'+s, opts);

function getOrderName(order) {
  const days = order.ends ? Math.round(moment(order.ends).diff(moment(), 'days', true)) : null;
  const tooltip = <Tooltip id={'filter-order-'+order.id}>{T('order_open_until', {ends: moment(order.ends).format('lll')})}</Tooltip>;
  return (
    <span>
      {order.name}
      {(days && days >= 0) ?
        <OverlayTrigger placement='right' overlay={tooltip}>
          <small style={styles.ends}>{days > 0 ? T('days_short', {count: days}) : <Glyphicon glyph='time' />}</small>
        </OverlayTrigger> : null}
    </span>
  );
}

class Filters extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchCategories());
    this.props.dispatch(fetchOrders());
  }

  render() {
    let i = 0;
    const {search, ordered} = this.props.filter;
    return (
      <div>
        {/* We want to be able to reset the searchbox,  */}
        <SearchBox style={styles.searchBox} className='panel panel-default'
          value={search} active={!!search} onChange={this._onSearch.bind(this)} />
        {/* Ordered by everyone */}
        <Panel style={styles.everyoneBox}>
          <ListGroup fill>
            <ListGroupItem href='#' active={ordered === 'all'} onClick={this._onClickEveryone.bind(this)}>
              <Glyphicon glyph='th-large' style={styles.listGroupIcon} />{' '}{T('everyone')}
            </ListGroupItem>
          </ListGroup>
        </Panel>
        {/* Selectors */}
        <Accordion defaultActiveKey={1}>
          {this.hasCategories() ?
              // @todo move knowledge of search param key to rest.js
              this._renderPanel('article_article_category_id', i += 1, T('categories'), this.props.categories.data) : null}
          {this.hasOrders() ?
              this._renderPanel('order_id', i += 1, T('orders'), this.props.orders.data, getOrderName) : null}
        </Accordion>
      </div>
    );
  }

  _renderPanel(id, key, title, items, getName = (i) => i.name) {
    return (
      <Panel eventKey={key} header={title}>
        <ListGroup fill>
          {items.map((item) => (
            <ListGroupItem key={item.id} href='#' active={this.props.filter[`${id}_eq`] === item.id}
                           onClick={this._onClick.bind(this, id, item.id)}>{getName(item)}</ListGroupItem>
          ))}
        </ListGroup>
      </Panel>
    );
  }

  hasCategories() {
    return this.props.categories.data && this.props.categories.data.length > 1;
  }
  hasOrders() {
    return this.props.orders.data && this.props.orders.data.length > 1;
  }

  _onClick(key, value) {
    this.props.dispatch(replaceFilter({ [`${key}_eq`]: value }));
  }

  _onClickEveryone() {
    this.props.dispatch(replaceFilter({ ordered: 'all' }));
  }

  _onSearch(e) {
    this.props.dispatch(replaceFilter({ search: e.target.value }));
  }
}

Filters.propTypes = {
  orders: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function select(state, props) {
  return { filter: state.filter, orders: state.orders, categories: state.categories };
}

export default connect(select)(Filters);

const styles = {
  searchBox: {
    marginBottom: 5,
    border: 'none', // for panel-like appearence, input already has border
  },
  everyoneBox: {
    marginBottom: 5,
  },
  ends: {
    marginLeft: '0.5em',
    opacity: 0.75,
  },
  listGroupIcon: {
    float: 'right',
    color: '#aaa',
    lineHeight: 1.42, // @todo get from bootstrap
  }
};
