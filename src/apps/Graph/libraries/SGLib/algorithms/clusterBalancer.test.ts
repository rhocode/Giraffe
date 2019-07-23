import clusterBalancer from './clusterBalancer';
import SimpleNode from '../datatypes/simpleNode';
import SimpleCluster from '../datatypes/simpleCluster';

const generateSimpleCluster = () => {
  const A = new SimpleNode(null);
  const B = new SimpleNode(null);
  const C = new SimpleNode(null);
  const D = new SimpleNode(null);
  const E = new SimpleNode(null);
  const F = new SimpleNode(null);
  const G = new SimpleNode(null);
  const H = new SimpleNode(null);
  const I = new SimpleNode(null);
  const J = new SimpleNode(null);

  A.addOutput(B).setWeight(10);
  A.addOutput(C).setWeight(10);
  A.addOutput(D).setWeight(10);
  B.addOutput(E).setWeight(10);
  C.addOutput(E).setWeight(10);
  D.addOutput(F).setWeight(10);
  E.addOutput(G).setWeight(20);
  F.addOutput(G).setWeight(10);
  G.addOutput(H).setWeight(15);
  G.addOutput(I).setWeight(15);
  H.addOutput(J).setWeight(10);
  I.addOutput(J).setWeight(10);

  return new SimpleCluster([A, B, C, D, E, F, G, H, I, J]);
};

it('Simple cluster path can be generated', () => {
  generateSimpleCluster();
});

it('balances a cluster', () => {
  const cluster = generateSimpleCluster();

  clusterBalancer(cluster);
});
