import stringGen from 'v3/utils/stringGen';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

export const addChild = (child: PIXI.DisplayObject) => {
  const id = stringGen(10);
  pixiJsStore.update((s) => {
    s.children.set(id, child);

    if (s.application.stage) {
      s.application.stage.addChild(...s.childQueue, child);
      s.childQueue = [];
    } else {
      s.childQueue.push(child);
    }
  });

  return id;
};

export const removeChild = (id: string) => {
  pixiJsStore.update((s) => {
    if (!s.children.get(id)) {
      throw new Error('Unknown child ' + id);
    }

    const childToRemove = s.children.get(id)!;
    s.children.delete(id);

    let index = s.childQueue.indexOf(childToRemove);
    if (index !== -1) {
      s.childQueue.splice(index, 1);
    } else {
      s.application.stage.removeChild(childToRemove);
    }
  });
};
