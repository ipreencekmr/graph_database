# Graph Demo

A small graph-based social network demo built with Express on the backend and React on the frontend. The app stores nodes and edges in memory using Graphology and lets you explore connections, shortest paths, and second-degree suggestions.

## Features

- Add people to the graph
- Connect two existing people
- Find the shortest path between two nodes
- Suggest people you may know based on mutual connections
- Visualize the graph in the browser

## Tech Stack

- Node.js
- Express
- Graphology
- React

## Run locally

1. Install dependencies:
   npm install
2. Start the app:
   npm start
3. Open http://localhost:3000

## Project structure

- server.js: bootstraps the server
- src/: backend logic and routing
- public/: frontend HTML, CSS, and client-side JavaScript

## Notes

This project is intentionally lightweight and keeps the graph data in memory for demonstration purposes.
