# Agent-Sandbox

A minimal sandbox for experimenting with agent UI components and visualizers.

This repository contains a frontend app (built with Vite + React) demonstrating UI components for agent cards, lists and chain visualizers. Use it as a playground for prototyping agents, chains, and selection flows.

## Highlights
- Lightweight Vite + React demo app
- Reusable components for agent UIs and chain visualization
- Mock data for fast iteration

## Tech Stack
- React (Vite)
- CSS
- Javascript

## Project Structure (brief)
- `frontend/` — Vite + React application
  - `src/components/` — UI components: `AgentCard`, `AgentList`, `ChainVisualizer`, `ChainPreview`, `SelectionBucket`
  - `src/data/mockAgents.js` — example agents used by the UI
  - `src/App.jsx`, `src/main.jsx` — app wiring and root

## Component Notes
- `AgentCard.jsx`: single-agent presentation with actions and metadata
- `AgentList.jsx`: layout and filtering for a collection of agents
- `ChainVisualizer.jsx` and `ChainPreview.jsx`: represent chain structure for chain visualization/Preview
- `SelectionBucket.jsx`: simple selection area for drag/drop or chosen agents

## Development

1. Start development server:

```bash
cd frontend
npm install
npm run dev
```

2. Open the URL printed by Vite (usually `http://localhost:5173`).
