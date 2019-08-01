import SimpleNode from './simpleNode';

export default class GroupNode extends SimpleNode {
  subNodes: Array<SimpleNode> = [];

  constructor(subNodes: Array<SimpleNode>) {
    super(null);
    this.subNodes = subNodes;
  }
}
