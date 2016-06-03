import React, {PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';

function glyph(props) {
  return [
    <Glyphicon {...props} key={1} />,
    <span className='sr-only' key={2}>info</span>,
  ];
}

const InfoIcon = ({hasInfo, url}) => {
  if (hasInfo && url && url != '') {
    return <a href={url} target='_blank'>{glyph({glyph: 'info-sign', style: styles.link})}</a>;
  } else if (hasInfo) {
    return <span>{glyph({glyph: 'info-sign', style: styles.info})}</span>;
  } else if (url && url != '') {
    return <a href={url} target='_blank'>{glyph({glyph: 'new-window', style: styles.link})}</a>;
  } else {
    return null;
  }
}

InfoIcon.propTypes = {
  hasInfo: PropTypes.bool,
  url: PropTypes.string,
};

const styles = {
  info: {
    color: '#ddd',
  },
  link: {
    color: '#9cc8df',
  },
};

export default InfoIcon;
