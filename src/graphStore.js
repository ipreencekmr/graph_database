const Graph = require("graphology");
const { bidirectional } = require("graphology-shortest-path");

class GraphStore {
  constructor() {
    this.graph = new Graph({ type: "undirected" });
    this.seed();
  }

  seed() {
    ["Ada", "Ben", "Cleo", "Dev", "Eli", "Fay", "Gus"].forEach((node) =>
      this.graph.addNode(node),
    );
    [
      ["Ada", "Ben"],
      ["Ben", "Cleo"],
      ["Cleo", "Dev"],
      ["Dev", "Eli"],
      ["Ada", "Fay"],
      ["Fay", "Gus"],
    ].forEach(([from, to]) => this.graph.addEdge(from, to));
  }

  snapshot() {
    return {
      nodes: this.graph.nodes(),
      edges: this.graph.edges().map((edge) => this.graph.extremities(edge)),
    };
  }

  addNode(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) throw new Error("Name is required.");
    if (this.graph.hasNode(trimmed))
      throw new Error(`${trimmed} already exists.`);

    this.graph.addNode(trimmed);
    return this.snapshot();
  }

  addEdge(from, to) {
    if (!this.graph.hasNode(from) || !this.graph.hasNode(to)) {
      throw new Error("Pick two existing people.");
    }
    if (from === to) {
      throw new Error("Pick two different people.");
    }
    if (this.graph.hasEdge(from, to)) {
      throw new Error("Already connected.");
    }

    this.graph.addEdge(from, to);
    return this.snapshot();
  }

  findPath(from, to) {
    if (!this.graph.hasNode(from) || !this.graph.hasNode(to)) {
      throw new Error("Unknown person.");
    }

    return { path: bidirectional(this.graph, from, to) };
  }

  suggest(id) {
    if (!this.graph.hasNode(id)) {
      throw new Error("Unknown person.");
    }

    const direct = new Set(this.graph.neighbors(id));
    const counts = {};

    direct.forEach((neighbor) => {
      this.graph.forEachNeighbor(neighbor, (other) => {
        if (other !== id && !direct.has(other)) {
          counts[other] = (counts[other] || 0) + 1;
        }
      });
    });

    return {
      suggestions: Object.entries(counts)
        .map(([name, mutual]) => ({ name, mutual }))
        .sort((a, b) => b.mutual - a.mutual),
    };
  }
}

module.exports = new GraphStore();
