import clusterBalancer from './clusterBalancer';
import SimpleNode from '../datatypes/graph/simpleNode';
import SimpleCluster from '../datatypes/graph/simpleCluster';
import { stronglyConnectedComponents } from './stronglyConnectedComponents';
import maxFlow from './maxFlow';
import topologicalSort from './graphProcessor';
import generatePools from './calculatePool';

const generateCyclicCluster = () => {
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

  const K = new SimpleNode(null);
  const L = new SimpleNode(null);
  const M = new SimpleNode(null);
  const N = new SimpleNode(null);

  A.setClusterBoundary(true);
  N.setClusterBoundary(true);
  E.setClusterBoundary(true);
  F.setClusterBoundary(true);

  J.addOutput(K).setWeight(10);
  K.addOutput(L).setWeight(10);
  L.addOutput(M).setWeight(10);
  M.addOutput(K).setWeight(10);
  M.addOutput(N).setWeight(10);

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

  return new SimpleCluster([A, B, C, D, E, F, G, H, I, J, K, L, M, N]);
};

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

  A.setClusterBoundary(true);
  J.setClusterBoundary(true);

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

it('runs a strongly connected simple search', () => {
  const cluster = generateSimpleCluster();
  const result = stronglyConnectedComponents(cluster);
  expect(result).toEqual(
    expect.arrayContaining([[9], [7], [8], [6], [4], [1], [2], [5], [3], [0]])
  );
});

it('runs a strongly connected cyclic search', () => {
  const cluster = generateCyclicCluster();
  const result = stronglyConnectedComponents(cluster);
  expect(result).toEqual(
    expect.arrayContaining([
      [13],
      [12, 11, 10],
      [9],
      [7],
      [8],
      [6],
      [4],
      [1],
      [2],
      [5],
      [3],
      [0]
    ])
  );
});

it('runs a maxFlow analysis on the cluster', () => {
  const cluster = generateSimpleCluster();
  const { t, s, graph } = cluster.generateSimpleGraph();

  // console.error(t, s, graph);

  const flow = maxFlow(graph, s, t);
  // console.error(flow);
});

it('converts the cluster into a non-cyclic cluster', () => {
  const cluster = generateCyclicCluster();
  expect(cluster.nonCyclic).toBe(false);
  const nonCyclicCluster = cluster.generateNonCyclicCluster();
  expect(nonCyclicCluster.nonCyclic).toBe(true);
});

it('Runs a topological sort on a non-cyclic cluster', () => {
  const cluster = generateCyclicCluster();
  const nonCyclicCluster = cluster.generateNonCyclicCluster();
  expect(nonCyclicCluster.nonCyclic).toBe(true);
  const { normal, reversed } = topologicalSort(nonCyclicCluster);
  expect(normal).toBeDefined();
  expect(reversed).toBeDefined();
});

it('Runs pool analysis on a cluster', () => {
  const cluster = generateCyclicCluster();
  const nonCyclicCluster = cluster.generateNonCyclicCluster();
  expect(nonCyclicCluster.nonCyclic).toBe(true);
  const { normal } = topologicalSort(nonCyclicCluster);
  generatePools(nonCyclicCluster, normal);
});
