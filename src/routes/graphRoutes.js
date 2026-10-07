const express = require("express");
const graphStore = require("../graphStore");

const router = express.Router();

router.get("/api/graph", (_, res) => {
  res.json(graphStore.snapshot());
});

router.post("/api/nodes", (req, res) => {
  try {
    res.json(graphStore.addNode(req.body.name));
  } catch (error) {
    const statusCode = /already exists/i.test(error.message) ? 409 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

router.post("/api/edges", (req, res) => {
  const { from, to } = req.body;

  try {
    res.json(graphStore.addEdge(from, to));
  } catch (error) {
    const statusCode = /already connected/i.test(error.message) ? 409 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

router.get("/api/path", (req, res) => {
  try {
    res.json(graphStore.findPath(req.query.from, req.query.to));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/api/suggest", (req, res) => {
  try {
    res.json(graphStore.suggest(req.query.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
