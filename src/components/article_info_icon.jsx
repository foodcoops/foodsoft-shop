import React from 'react';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';

import {OriginIcon, FromByInNote} from './article_description';

function glyph(props) {
  return [
    <Glyphicon {...props} key={1} />,
    <span className='sr-only' key={2}>i</span>,
  ];
}

function ArticleInfoIcon({article, highlight}) {
  const url   = article.url;
  const icon  = 'info-sign';
  const style = url ? styles.linkHighlight : (highlight ? styles.infoHighlight : styles.info);

  const g = glyph({glyph: icon, style});
  const o = <span style={styles.flag}><OriginIcon article={article} /></span>;

  return url ?
    <a href={url} target='_blank' style={styles.container}>{g}{o}</a> :
    <span style={styles.container}>{g}{o}</span>;
}

ArticleInfoIcon.propTypes = {
  article: PropTypes.object.isRequired,
};

const iconCommon = {
  background: 'white',
  borderRight: '1.6px solid white',
  borderRadius: 14,
};
const styles = {
  container: {
    whiteSpace: 'nowrap',
  },
  info: {
    color: '#e0e0e0',
    ...iconCommon,
  },
  infoHighlight: {
    color: '#9a9a9a',
    ...iconCommon,
  },
  link: {
    color: '#9cc8df',
    ...iconCommon,
  },
  linkHighlight: {
    color: '#64A3CD',
    ...iconCommon,
  },
  flag: {
    display: 'inline-block',
    position: 'relative',
    left: -3.5,
    top: -0.5,
    zIndex: -1,
  },
};

export default ArticleInfoIcon;
