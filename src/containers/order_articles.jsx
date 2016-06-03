import {t} from 'i18n';
import React, {PropTypes} from 'react';
import {Glyphicon, OverlayTrigger, Table, Pagination, Popover} from 'react-bootstrap';

import {compact, min} from 'lodash';
import {connect} from 'react-redux';
import rest from '../store/rest';
import filter from '../store/filter';
import lastBox from '../lib/last_box';

import CountryIcon from '../components/country_icon';
import DeltaInput from '../components/delta_input';
import InfoIcon from '../components/info_icon';
import Price from '../components/price';
import UnitBar from '../components/unit_bar';
import UnitsBox from '../components/units_box';
import {FromByIn} from '../components/article_description';
import {UnitsToOrderDesc, LastBoxDesc} from '../components/article_quantities_description';

// tooltip shorthand
let i = 0;
const Tip = ({text, children}) => (
  <OverlayTrigger placement='bottom' overlay={<Popover id={`tooltip-${i++}`} style={styles.tooltip}>{text}</Popover>}>
    <span>{children}</span>
  </OverlayTrigger>
);

// @todo get currency from api
class OrderArticles extends React.Component {

  componentDidMount() {
    this.props.dispatch(filter.actions.update());
    this.props.dispatch(rest.actions.orders.sync()); // @todo make sure we have all
    this.props.dispatch(rest.actions.group_order_articles.sync({per_page: -1})); // get all
  }

  render() {
    const _orders = this.props.orders, _oas = this.props.order_articles, _goas = this.props.group_order_articles;
    if (!_oas.data.data || !_orders.data.data) { return <div />; }
    const orders = _orders.data.data;
    const oas = _oas.data.data;
    const goas = _goas.data.data || [];
    const anyTolerance = !!_oas.data.data.find((oa) => oa.article.unit_quantity > 1);
    return (
      <div style={styles.container}>
        <Table hover>
          <thead>
            <tr>
              <th style={styles.name}>{t('order_articles.name')}</th>
              <th style={styles.country} />
              <th style={styles.unit}>{t('order_articles.unit')}</th>
              <th style={styles.priceWithSep}>{t('order_articles.price')}</th>
              <th style={styles.amount}>{t('order_articles.amount')}</th>
              {anyTolerance ? <th style={styles.amount}>{t('order_articles.extra')}</th> : null}
              <th style={styles.priceWithSep}>{t('order_articles.sum')}</th>
              {anyTolerance ?
                <th style={styles.boxesHeadingWide} colSpan={2}>{t('order_articles.everyone')}</th> :
                <th style={styles.boxesHeadingNarrow}>{t('order_articles.everyone_short')}</th>}
            </tr>
          </thead>
          <tbody>
            {oas.map((oa) => {
              const hasTolerance = oa.article.unit_quantity > 1;
              const order = orders.find((o) => o.id === oa.order_id);
              const goa = goas.find((goa) => goa.order_article_id === oa.id);
              const goaQ = goa ? goa.quantity : 0;
              const goaT = goa ? goa.tolerance : 0;
              const {missing} = lastBox(oa);
              return (
                <tr key={oa.id}>
                  <td style={styles.name}>
                    {oa.article.name}
                    {oa.article.note || oa.article.url ?
                      <span style={styles.icon}>
                        {oa.article.note ?
                          <Tip text={oa.article.note}><InfoIcon url={oa.article.url} hasInfo={true} /></Tip> :
                          <InfoIcon url={oa.article.url} />}
                      </span> : null}
                  </td>
                  <td style={styles.country}>
                    <Tip text={<FromByIn article={oa.article} />}><CountryIcon code={oa.article.origin} /></Tip>
                  </td>
                  <td style={styles.unit}>{oa.article.unit}</td>
                  <td style={styles.priceWithSep}><Price value={oa.price} /></td>
                  <td style={styles.amount}>
                    <DeltaInput value={goaQ}
                                min={order.is_boxfill ? goaQ : 0}
                                max={order.is_boxfill ? (goaQ + missingUnits) : oa.article.quantity_available}
                                color={this._colorQuantity(goa)}
                                onChange={(e,value) => this._onChangeAmount(oa, goa, 'quantity', value)} />
                  </td>
                  {anyTolerance ?
                    <td style={styles.amount}>{hasTolerance ?
                        <DeltaInput value={goaT}
                                    min={order.is_boxfill ? goaT : 0}
                                    max={order.is_boxfill ? (goaT + missingUnits) : (oa.article.unit_quantity - 1)}
                                    color={this._colorTolerance(goa)}
                                    onChange={(e,value) => this._onChangeAmount(oa, goa, 'tolerance', value)} /> : null }
                    </td> : null }
                  <td style={styles.priceWithSep}>{goa ? <Price value={goa.total_price} /> : null}</td>
                  {anyTolerance ?
                    <td style={styles.unitBar}>{hasTolerance ?
                      <Tip text={<LastBoxDesc order_article={oa} />}>
                        <UnitBar order_article={oa} />
                      </Tip> : null }
                    </td> : null }
                  <td style={Object.assign({}, styles.boxes, {textAlign: anyTolerance ? 'right' : 'center'})}>
                    {hasTolerance ? <span>+ </span> : null}
                    <Tip text={<UnitsToOrderDesc order_article={oa} />}>
                      <UnitsBox boxes={oa.units_to_order} />
                    </Tip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {_oas.data.meta && _oas.data.meta.total_pages > 1 ?
          <div style={styles.pagination}>
            <Pagination items={_oas.data.meta.total_pages} maxButtons={10} boundaryLinks
                        prev={true} next={true}
                        activePage={this.props.filter.page || 1} onSelect={(page) => this._onChangePage(page)} />
          </div> : null }
      </div>
    );
  }

  _onChangeAmount(oa, goa, what, value) {
    // @todo move order_articles.get() call to rest.js (not sure how yet)
    // @todo perhaps change api to only work with order_article_id and get rid of group_order_articles
    if (goa) {
      const goa_q = what === 'quantity' ? Number(value) : goa.quantity;
      const goa_t = what === 'tolerance' ? Number(value) : goa.tolerance;
      if (goa_q === 0 && goa_t === 0) {
        // amounts are zero, destroy it
        // (we could update it too, but the response would be that it's deleted, we can't understand that response from update)
        this.props.dispatch(rest.actions.group_order_articles.destroy(goa.id, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      } else {
        // update existing group_order_article
        this.props.dispatch(rest.actions.group_order_articles.update(goa.id, {[what]: value}, (error) => {
          error || this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      }
    } else if (value && value !== 0) {
      // no existing group_order_article, create one
      this.props.dispatch(rest.actions.group_order_articles.create({order_article_id: oa.id, [what]: value}, (error) => {
        error || this.props.dispatch(rest.actions.order_articles.get(oa.id));
      }));
    }
  }

  _onChangePage(page) {
    this.props.dispatch(filter.actions.update({page: page}));
  }

  _colorQuantity(goa) {
    if (!goa || goa.quantity <= 0)  { return '#555'; }
    if (goa.result === 0)           { return '#d50'; }
    if (goa.result < goa.quantity)  { return '#933'; }
    return '#080';
  }

  _colorTolerance(goa) {
    if (!goa || goa.tolerance <= 0) { return '#555'; }
    return null;
  }
}

const styles = {
  name: {
    verticalAlign: 'middle'
  },
  icon: {
    marginLeft: '0.3em',
    fontSize: '90%',
  },
  country: {
    verticalAlign: 'middle',
    paddingLeft: 3,
    opacity: 0.4
  },
  unit: {
    verticalAlign: 'middle',
    width: '4.5em',
    textAlign: 'right'
  },
  price: {
    verticalAlign: 'middle',
    width: '5em',
    textAlign: 'right'
  },
  priceWithSep: {
    verticalAlign: 'middle',
    width: '6em',
    textAlign: 'right',
    borderRight: '1px dashed #ddd',
    paddingRight: 14
  },
  amount: {
    verticalAlign: 'middle',
    width: 94,
    textAlign: 'center'
  },
  unitBar: {
    verticalAlign: 'middle',
    paddingLeft: 14,
    paddingRight: 0
  },
  boxesHeadingWide: {
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  boxesHeadingNarrow: {
    verticalAlign: 'middle',
    textAlign: 'center',
    width: '4em'
  },
  boxes: {
    verticalAlign: 'middle',
    fontSize: '90%',
    color: '#7a7a7a',
    whiteSpace: 'nowrap'
  },
  pagination: {
    width: '100%',
    textAlign: 'center'
  },
  tooltip: {
    fontSize: '80%',
    backgroundColor: '#f7f7f7',
    boxShadow: 'none',
    textAlign: 'center',
  },
};

OrderArticles.propTypes = {
  orders: PropTypes.object.isRequired,
  order_articles: PropTypes.object.isRequired,
  group_order_articles: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect((state) => {
  return {filter: state.filter, orders: state.orders, order_articles: state.order_articles, group_order_articles: state.group_order_articles}
})(OrderArticles);
