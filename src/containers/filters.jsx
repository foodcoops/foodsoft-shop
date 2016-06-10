import React, {PropTypes} from 'react';
import {Accordion, Badge, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Panel, Tooltip} from 'react-bootstrap';

import moment from 'moment';
import {connect} from 'react-redux';
import rest from '../store/rest';
import filter from '../store/filter';
import SearchBox from '../components/search_box';

import {t, l} from 'i18n';
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
    this.props.dispatch(rest.actions.categories.sync({q: {orders_state_eq: 'open'}}));
    this.props.dispatch(rest.actions.orders.sync());
  }

  render() {
    let i = 0;
    const {search} = this.props.filter;
    return (
      <div>
        {/* We want to be able to reset the searchbox,  */}
        <SearchBox style={styles.searchBox} className='panel panel-default'
          value={search} active={!!search} onChange={this._onSearch.bind(this)} />
        <Accordion defaultActiveKey={1}>
          {this.hasCategories() ?
              // @todo move knowledge of search param key to rest.js
              this._renderPanel('article_article_category_id', i += 1, T('categories'), this.props.categories.data.data) : null}
          {this.hasOrders() ?
              this._renderPanel('order_id', i += 1, T('orders'), this.props.orders.data.data, getOrderName) : null}
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
    return this.props.categories.data.data && this.props.categories.data.data.length > 1;
  }
  hasOrders() {
    return this.props.orders.data.data && this.props.orders.data.data.length > 1;
  }

  _onClick(key, value) {
    this.props.dispatch(filter.actions.replace({[`${key}_eq`]: value}));
  }

  _onSearch(e) {
    this.props.dispatch(filter.actions.replace({search: e.target.value}));
  }
}

Filters.propTypes = {
  orders: PropTypes.object.isRequired,
  categories: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect((state) => {
  return {filter: state.filter, orders: state.orders, categories: state.categories};
})(Filters);

const styles = {
  searchBox: {
    marginBottom: 5,
    border: 'none', // for panel-like appearence, input already has border
  },
  ends: {
    marginLeft: '0.5em',
    opacity: 0.75,
  }
};
