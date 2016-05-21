import React, {PropTypes} from 'react';
import {Accordion, ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from '../store/rest';
import filter from '../store/filter';
import SearchBox from '../components/search_box';

import {t} from 'i18n';
const T = (s, opts) => t('filters.'+s, opts);

class Filters extends React.Component {

  componentDidMount() {
    this.props.dispatch(rest.actions.categories.sync({q: {orders_state_eq: 'open'}}));
    this.props.dispatch(rest.actions.orders.sync());
  }

  render() {
    let i = 0;
    const search_term = this.props.filter.article_name_or_article_note_or_article_manufacturer_cont;
    return (
      <div>
        <SearchBox style={styles.searchBox} className='panel panel-default'
          value={search_term} active={!!search_term} onChange={this._onSearch.bind(this)} />
        <Accordion defaultActiveKey={1}>
          {this.hasCategories() ?
              // @todo move knowledge of search param key to rest.js
              this._renderPanel('article_article_category_id', i += 1, T('categories'), this.props.categories.data.data) : null}
          {this.hasOrders() ?
              this._renderPanel('order_id', i += 1, T('orders'), this.props.orders.data.data) : null}
        </Accordion>
      </div>
    );
  }

  _renderPanel(id, key, title, items) {
    return (
      <Panel eventKey={key} header={title}>
        <ListGroup fill>
          {items.map((item) => (
            <ListGroupItem key={item.id} href='#' active={this.props.filter[`${id}_eq`] === item.id}
                           onClick={this._onClick.bind(this, id, item.id)}>{item.name}</ListGroupItem>
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

  _onSearch(term) {
    this.props.dispatch(filter.actions.replace({article_name_or_article_note_or_article_manufacturer_cont: term}));
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
  }
};
