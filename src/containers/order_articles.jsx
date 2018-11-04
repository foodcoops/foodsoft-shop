import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'i18n-js';
import { Button, Glyphicon, OverlayTrigger, Table, Popover } from 'react-bootstrap';

import { compact, min } from 'lodash';
import { connect } from 'react-redux';
import {
  createGroupOrderArticle,
  updateGroupOrderArticle
} from '../actions/group_order_articles';
import lastBox from '../lib/last_box';

import CountryIcon from '../components/country_icon';
import DeltaInput from '../components/delta_input';
import Price from '../components/price';
import UnitBar from '../components/unit_bar';
import UnitsBox from '../components/units_box';
import { FromByInNote } from '../components/article_description';
import ArticleInfoIcon from '../components/article_info_icon';
import { UnitsToOrderDesc, LastBoxDesc } from '../components/article_quantities_description';
import Pagination from '../components/pagination';

// tooltip shorthand
let i = 0;
const Tip = ({ text, children }) => (
  <OverlayTrigger placement='bottom' overlay={<Popover id={`tooltip-${i++}`} style={styles.tooltip}>{text}</Popover>}>
    <div style={styles.tooltipInner}>{children}</div>
  </OverlayTrigger>
);

const StaticInput = ({ value, color }) => (
  <span style={{color: color}}>{value}</span>
);

// @todo get currency from api
// @note assumes relevant data is already loaded
class OrderArticles extends React.Component {
  render() {
    const _orders = this.props.orders, _oas = this.props.order_articles, _goas = this.props.group_order_articles;
    if (!_oas.data || !_orders.data) { return <div />; }
    const orders = _orders.data;
    const oas = _oas.data;
    const goas = _goas.data || [];
    const anyTolerance = !!_oas.data.find((oa) => oa.article.unit_quantity > 1);
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
              const order = orders.find((o) => o.id === oa.order_id) || {};
              const goa = goas.find((goa) => goa.order_article_id === oa.id);
              const goaQ = goa ? goa.quantity : 0;
              const goaT = goa ? goa.tolerance : 0;
              const {missing} = lastBox(oa);
              const disabled = goa && String(goa.id).startsWith('optimist:'); // workaround for optimistic create
              return (
                <tr key={oa.id}>
                  <td style={styles.name}>{oa.article.name}</td>
                  <td style={styles.country}>
                    <Tip text={<FromByInNote article={oa.article} />}>
                      <ArticleInfoIcon article={oa.article} highlight={!!oa.article.note} />
                    </Tip>
                  </td>
                  <td style={styles.unit}>{oa.article.unit}</td>
                  <td style={styles.priceWithSep}><Price value={oa.price} /></td>
                  <td style={styles.amount}>
                    {order.is_open
                      ? <DeltaInput value={goaQ}
                                    min={order.is_boxfill ? goaQ : 0}
                                    max={order.is_boxfill ? (goaQ + missingUnits) : oa.article.quantity_available}
                                    disabled={disabled || !order.is_open}
                                    color={this._colorQuantity(goa)}
                                    onChange={(e,value) => this._onChangeAmount(oa, goa, 'quantity', value)} />
                      : <StaticInput value={goaQ} color={this._colorQuantity(goa)} />}
                  </td>
                  {anyTolerance ?
                    <td style={styles.amount}>
                      {hasTolerance
                        ? order.is_open
                          ? <DeltaInput value={goaT}
                                        min={order.is_boxfill ? goaT : 0}
                                        max={order.is_boxfill ? (goaT + missingUnits) : (oa.article.unit_quantity - 1)}
                                        disabled={disabled || !order.is_open}
                                        color={this._colorTolerance(goa)}
                                        onChange={(e,value) => this._onChangeAmount(oa, goa, 'tolerance', value)} />
                          : <StaticInput value={goaT} color={this._colorTolerance(goa)} />
                        : null}
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
        {_oas.pages > 1 ?
          <div style={styles.pagination}>
            <Pagination totalPages={_oas.pages} currentPage={this.props.filter.page || 1}
                        hideFirstAndLastPageLinks={_oas.pages <= 6}
                        onChange={(page) => this._onChangePage(page)} />
          </div> : null }
      </div>
    );
  }

  _onChangeAmount(oa, goa, what, value) {
    if (goa) {
      this.props.dispatch(updateGroupOrderArticle(goa.id, {[what]: Number(value)}));
    } else {
      this.props.dispatch(createGroupOrderArticle({ order_article_id: oa.id, [what]: Number(value) }));
    }
  }

  _onChangePage(page) {
    this.props.dispatch(replaceFilter({ ...this.props.filter, page: page }));
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
    opacity: 0.4,
    width: 42
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
    paddingRight: 0,
    width: 85
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
    whiteSpace: 'nowrap',
    width: '4em'
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
  tooltipInner: {
    display: 'inline-block'
  }
};

OrderArticles.propTypes = {
  filter: PropTypes.object.isRequired,
  orders: PropTypes.object.isRequired,
  order_articles: PropTypes.object.isRequired,
  group_order_articles: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function select(state, props) {
  return { filter: state.filter, orders: state.orders, order_articles: state.order_articles, group_order_articles: state.group_order_articles };
}

export default connect(select)(OrderArticles);
