import {t} from 'i18n';
import React, {PropTypes} from 'react';
import {Pagination, Table} from 'react-bootstrap';

import {connect} from 'react-redux';
import rest from '../store/rest';
import filter from '../store/filter';

import CountryIcon from '../components/country_icon';
import Price from '../components/price';
import DeltaInput from '../components/delta_input';
import UnitBar from '../components/unit_bar';
import UnitsBox from '../components/units_box';

// @todo get currency from api
class OrderArticles extends React.Component {

  componentDidMount() {
    this.props.dispatch(filter.actions.update());
    this.props.dispatch(rest.actions.group_order_articles.sync({per_page: -1})); // get all
  }

  render() {
    if (!this.props.order_articles.data.data) { return <div />; }
    const goas = this.props.group_order_articles.data.data || [];
    const anyTolerance = !!this.props.order_articles.data.data.find((oa) => oa.article.unit_quantity > 1);
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
            {this.props.order_articles.data.data.map((oa) => {
              const hasTolerance = oa.article.unit_quantity > 1;
              const goa = goas.find((goa) => goa.order_article_id == oa.id);
              return (
                <tr key={oa.id}>
                  <td style={styles.name}>{oa.article.name}</td>
                  <td style={styles.country}><CountryIcon code={oa.article.origin} /></td>
                  <td style={styles.unit}>{oa.article.unit}</td>
                  <td style={styles.priceWithSep}><Price value={oa.price} /></td>
                  <td style={styles.amount}>
                    <DeltaInput value={goa ? goa.quantity : 0} min={0} max={oa.article.quantity_available}
                                color={this._colorQuantity(goa)}
                                onChange={(val) => this._onChangeAmount(oa, goa, 'quantity', val)} />
                  </td>
                  {anyTolerance ?
                    <td style={styles.amount}>{hasTolerance ?
                        <DeltaInput value={goa ? goa.tolerance : 0} min={0} max={oa.article.unit_quantity}
                                    color={this._colorTolerance(goa)}
                                    onChange={(val) => this._onChangeAmount(oa, goa, 'tolerance', val)} /> : null }
                    </td> : null }
                  <td style={styles.priceWithSep}>{goa ? <Price value={goa.total_price} /> : null}</td>
                  {anyTolerance ?
                    <td style={styles.unitBar}>{hasTolerance ?
                        <UnitBar unit_quantity={oa.article.unit_quantity}
                                 result={oa.units_to_order * oa.article.unit_quantity}
                                 quantity={oa.quantity} tolerance={oa.tolerance} /> : null }
                    </td> : null }
                  <td style={Object.assign({}, styles.boxes, {textAlign: anyTolerance ? 'right' : 'center'})}>
                    {hasTolerance ? <span>+ </span> : null}
                    <UnitsBox boxes={oa.units_to_order} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {this.props.order_articles.data.meta && this.props.order_articles.data.meta.total_pages > 1 ?
          <div style={styles.pagination}>
            <Pagination items={this.props.order_articles.data.meta.total_pages} maxButtons={10} boundaryLinks
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
        this.props.dispatch(rest.actions.group_order_articles.update(goa.id, {[what]: value}, () => {
          this.props.dispatch(rest.actions.order_articles.get(goa.order_article_id));
        }));
      }
    } else if (value && value !== 0) {
      // no existing group_order_article, create one
      this.props.dispatch(rest.actions.group_order_articles.create({order_article_id: oa.id, [what]: value}, () => {
        this.props.dispatch(rest.actions.order_articles.get(oa.id));
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
  country: {
    verticalAlign: 'middle',
    width: 18,
    opacity: 0.5
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
  }
};

OrderArticles.propTypes = {
  order_articles: PropTypes.object.isRequired,
  group_order_articles: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect((state) => {
  return {filter: state.filter, order_articles: state.order_articles, group_order_articles: state.group_order_articles}
})(OrderArticles);
