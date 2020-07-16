import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

export const sortFunction = (x: number, y: number, multiplier: number = 1) => (
  ea: EdgeTemplate | null,
  eb: EdgeTemplate | null
): number => {
  if (eb === null) {
    return -1;
  }

  if (ea === null) {
    return 1;
  }

  const a = ea.targetNode;
  const b = eb.targetNode;

  return (a.container.position.x - b.container.position.y) * multiplier;

  // const yA = a.offsetHookY - y;
  // const xA = Math.abs(a.offsetHookX - x);
  // const yB = b.offsetHookY - y;
  // const xB = Math.abs(b.offsetHookX - x);
  //
  // if (yB / xB === yA / xA) {
  //   return xA - xB;
  // }

  // return (yA / xA - yB / xB) * multiplier;
};
