import React from 'react';
import './Spotlight.css';

const Spotlight = props => {
  const { img, imgAlt, title, desc, to } = props;
  let classNames = ['Spotlight'];
  if (props.left) {
    classNames.push('left');
  } else {
    classNames.push('right');
  }
  return (
    <div className={classNames.join(' ')}>
      {img && to && (
        <a href={to} className="image">
          <img src={img} alt={imgAlt} />
        </a>
      )}
      <div className="content">
        {title && <h2 className="major">{title}</h2>}
        {desc && <p>{desc}</p>}
        {to && (
          <a href={to} className="special">
            Learn more
          </a>
        )}
      </div>
    </div>
  );
};

export default Spotlight;
