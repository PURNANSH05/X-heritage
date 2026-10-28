# HeritageX

HeritageX is a MERN stack travel and heritage discovery platform that helps users explore historical destinations, browse monument details, scan monuments, and plan their trips more efficiently.

## Overview

This project brings together:
- heritage site discovery
- multilingual content support
- site details and reviews
- nearby destination recommendations
- booking links for travel and accommodation
- scanner-based monument lookup

It is designed to make heritage tourism more engaging, informative, and easier to plan.

## Features

- Search and filter heritage destinations by country, city, and category
- Detailed monument pages with history, visit tips, timings, and maps
- Multilingual interface and translated content
- Scanner-based monument recognition flow
- Favorite destination saving
- Nearby site discovery using location data
- Booking options for flights, trains, buses, and hotels
- Responsive UI for desktop and mobile users

## Tech Stack

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Routing: React Router
- Additional libraries: Axios, Framer Motion, Lucide React, Leaflet, html2canvas, jspdf

## Project Structure

```text
HeritageX/
├── backend/
│   ├── models/
│   ├── data/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── serve.js
│   ├── vite.config.js
│   ├── package.json
│   └── build.mjs
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md
├── start-site.cmd
└── INDIAN_DESTINATIONS_DATABASE.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance or MongoDB Atlas connection

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PURNANSH05/X-heritage.git
cd X-heritage
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Configure environment variables:

Create a `.env` file in the `backend` folder with your MongoDB connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/heritagex
PORT=4000
```

## Run the Project

### Option 1: Windows quick start

From the project root, run:

```bash
start-site.cmd
```

### Option 2: Manual run

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run build
node serve.js
```

Then open:

```text
http://localhost:4173
```

## API Notes

The project includes a REST API for:
- site listing and search
- destination detail retrieval
- nearby site lookup
- scanner support
- booking operations

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for details.

## Future Scope

- AI-based travel recommendations
- personalized itineraries
- stronger live booking integrations
- expanded multilingual support
- improved user dashboard and analytics

## License

This project is intended for academic and portfolio use.
