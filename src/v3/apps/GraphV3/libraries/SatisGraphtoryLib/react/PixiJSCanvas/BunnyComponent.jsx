import React from 'react';
import { Sprite, useTick } from '@inlet/react-pixi';

const BunnyComponent = (props) => {
  const { x, y } = props;
  const [motion, setMotion] = React.useState({
    x: x + Math.sin(0) * 100,
    y: y + Math.sin(0 / 1.5) * 100,
    rotation: Math.sin(0) * Math.PI,
    anchor: Math.sin(0 / 2),
  });
  const iter = React.useRef(0);
  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);
    setMotion({
      x: x + Math.sin(i) * 100,
      y: y + Math.sin(i / 1.5) * 100,
      rotation: Math.sin(i) * Math.PI,
      anchor: Math.sin(i / 2),
    });
  });
  return (
    <Sprite
      image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      {...motion}
    />
  );
};

export default BunnyComponent;
