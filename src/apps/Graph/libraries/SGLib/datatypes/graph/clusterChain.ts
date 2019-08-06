import SimpleCluster from './simpleCluster';

export default class ClusterChain {
  sources: SimpleCluster;
  intermediates: SimpleCluster;
  targets: SimpleCluster;

  constructor(
    sources: SimpleCluster,
    intermediates: SimpleCluster,
    targets: SimpleCluster
  ) {
    this.sources = sources;
    this.intermediates = intermediates;
    this.targets = targets;
  }
}
