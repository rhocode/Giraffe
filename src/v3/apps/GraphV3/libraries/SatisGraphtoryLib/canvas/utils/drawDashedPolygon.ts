type point = {
  x: number;
  y: number;
};

const drawDashedPolygon = (
  context: PIXI.Graphics,
  polygons: point[],
  x: number,
  y: number,
  rotation: number,
  dash: number,
  gap: number,
  offsetPercentage: number
) => {
  let i;
  let p1;
  let p2;

  let dashLeft = 0;
  let gapLeft = 0;
  if (offsetPercentage > 0) {
    const progressOffset = (dash + gap) * offsetPercentage;
    if (progressOffset < dash) dashLeft = dash - progressOffset;
    else gapLeft = gap - (progressOffset - dash);
  }
  const rotatedPolygons = [];
  for (i = 0; i < polygons.length; i++) {
    const p = { x: polygons[i].x, y: polygons[i].y };
    const cosAngle = Math.cos(rotation);
    const sinAngle = Math.sin(rotation);
    const dx = p.x;
    const dy = p.y;
    p.x = dx * cosAngle - dy * sinAngle;
    p.y = dx * sinAngle + dy * cosAngle;
    rotatedPolygons.push(p);
  }
  for (i = 0; i < rotatedPolygons.length; i++) {
    p1 = rotatedPolygons[i];
    if (i === rotatedPolygons.length - 1) p2 = rotatedPolygons[0];
    else p2 = rotatedPolygons[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const normal = { x: dx / len, y: dy / len };
    let progressOnLine = 0;
    context.moveTo(
      x + p1.x + gapLeft * normal.x,
      y + p1.y + gapLeft * normal.y
    );
    while (progressOnLine <= len) {
      progressOnLine += gapLeft;
      if (dashLeft > 0) progressOnLine += dashLeft;
      else progressOnLine += dash;
      if (progressOnLine > len) {
        dashLeft = progressOnLine - len;
        progressOnLine = len;
      } else {
        dashLeft = 0;
      }
      context.lineTo(
        x + p1.x + progressOnLine * normal.x,
        y + p1.y + progressOnLine * normal.y
      );
      progressOnLine += gap;
      if (progressOnLine > len && dashLeft === 0) {
        gapLeft = progressOnLine - len;
      } else {
        gapLeft = 0;
        context.moveTo(
          x + p1.x + progressOnLine * normal.x,
          y + p1.y + progressOnLine * normal.y
        );
      }
    }
  }
};

export default drawDashedPolygon;
