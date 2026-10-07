# Graph Demo

A small graph-based social network demo built with Express on the backend and React on the frontend. The app stores nodes and edges in memory using Graphology and lets you explore connections, shortest paths, and second-degree suggestions.


<img width="999" height="723" alt="Screenshot 2026-10-07 at 10 37 13 PM" src="https://github.com/user-attachments/assets/edfd675d-ff9d-4222-be1b-b63e6c0888a9" />

<img width="1042" height="666" alt="Screenshot 2026-10-07 at 10 36 44 PM" src="https://github.com/user-attachments/assets/6e7cf8e9-7e25-418a-a41d-6b533821998b" />


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
