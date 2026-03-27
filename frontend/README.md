# Cloud Cost Intelligence System - Premium Dashboard

This is the fully responsive, production-ready React frontend for the Cloud Cost Intelligence Backend. It is built using a modern stack designed for high-performance and premium SaaS aesthetics.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS V4 (utilizing V4's new standalone Vite plugin and theming via CSS Variables)
- **Icons:** Lucide-React
- **Charts:** Recharts
- **Animation:** Tailwind built-in transitions + CSS Keyframes
- **API Integration:** Axios

## Getting Started

1. **Install Dependencies**
Run the following command to download `react`, `tailwindcss`, `recharts`, and more:
```bash
npm install
```

2. **Start the Development Server**
```bash
npm run dev
```

3. **View the Application**
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend Connection
The application is currently configured to point to `http://localhost:8000/api/v1` via Axios in `src/services/api.ts`.
Make sure your FastAPI backend (from the previous step) is running on port 8000!

## Features Included
1. **Glassmorphism Sidebar & Topbar**
2. **Dashboard Overview** - Real-time metrics, interactive SVG area charts, and responsive donut charts.
3. **Live Activity Feed** - Simulated real-time WebSocket ticker showing detected cost spikes and resolutions.
4. **Optimization Actions** - History of automated AI actions to stop/start EC2 instances.
5. **Anomaly Table** - Highlighting severity with color-coded custom indicators.
