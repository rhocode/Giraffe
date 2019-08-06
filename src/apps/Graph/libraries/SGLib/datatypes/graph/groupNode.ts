import SimpleNode from './simpleNode';

export default class GroupNode extends SimpleNode {
  subNodes: Array<SimpleNode> = [];
  visited: boolean = false;

  constructor(subNodes: Array<SimpleNode>) {
    super(null);
    this.subNodes = subNodes;
    if (subNodes.length === 0) {
      throw new Error('GroupNode subNodes cannot be zero length');
    }
  }

  isCyclic() {
    return this.subNodes.length > 1;
  }

  singleNode() {
    if (!this.isCyclic()) {
      return this.subNodes[0];
    } else {
      throw new Error('This is a cyclic cluster!');
    }
  }

  cyclicNodes() {
    return this.subNodes;
  }
}
