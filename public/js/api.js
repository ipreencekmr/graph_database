async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

window.graphApi = {
  getGraph: () => jsonRequest("/api/graph"),

  createNode: (name) =>
    jsonRequest("/api/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),

  createEdge: (from, to) =>
    jsonRequest("/api/edges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    }),

  findPath: (from, to) =>
    jsonRequest(
      `/api/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  suggest: (id) => jsonRequest(`/api/suggest?id=${encodeURIComponent(id)}`),
};
