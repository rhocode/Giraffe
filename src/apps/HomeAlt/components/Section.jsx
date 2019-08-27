import React from 'react';
import './Section.css';

const Section = props => {
  let classNames = ['Section'];
  if (!!props.right) classNames.push('right');
  if (!!props.left) classNames.push('left');
  if (!!props.style1) classNames.push('style1');
  if (!!props.style2) classNames.push('style2');
  if (!!props.style3) classNames.push('style3');

  return (
    <section className={classNames.join(' ')}>
      <div className="SectionContent">{props.children}</div>
    </section>
  );
};

export default Section;
