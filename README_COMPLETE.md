# HeritageX - Complete Heritage Site Discovery Platform

A comprehensive, multilingual web application for discovering, scanning, and exploring world heritage sites with real data, advanced search capabilities, and detailed visitor information.

## 🌍 Features

### Core Features
- ✅ **Real Heritage Sites Database** - 8+ complete UNESCO World Heritage Sites with verified data
- ✅ **Advanced Search** - Multi-filter search by name, country, city, and category
- ✅ **Monument Scanner** - Intelligent text recognition for heritage sites
- ✅ **Complete Site Details** - History, visitor tips, opening hours, entry fees, accessibility
- ✅ **Google Maps Integration** - Real coordinates and nearby site discovery
- ✅ **Multilingual Support** - 16 languages supported globally
- ✅ **Photo Galleries** - Visual galleries for each heritage site
- ✅ **Visitor Reviews** - Ratings and visitor feedback
- ✅ **Audio Guides** - Multilingual audio guide support
- ✅ **Favorites** - Save and manage favorite sites

### Technical Features
- Real GPS coordinates for accurate location display
- Distance calculation for nearby site discovery
- Confidence-based scanner matching (high/medium/low)
- Auto-complete suggestions while searching
- Responsive design for all devices
- Offline capability with local data fallback
- RESTful API with proper error handling
- CORS-enabled for cross-origin requests

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Modern web browser

### Installation

1. **Navigate to project directory:**
   ```bash
   cd HeritageX
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure MongoDB for the backend:**
  - Create a free MongoDB Atlas cluster (or use a local MongoDB server).
  - Copy `backend/.env.example` to `backend/.env` and replace `MONGODB_URI` with your connection string.
  - For local MongoDB, use `mongodb://127.0.0.1:27017/heritagex`.
  - For Atlas, create a database user and allow your IP address in Network Access. Keep the password in `.env`; never commit it.

  The backend will connect before listening, seed the bundled heritage catalog into the `sites` collection if records are missing, and save bookings in the `bookings` collection. Restarting the server will not erase bookings.

### Running the Application

On Windows, double-click `start-site.cmd` in the project root. It checks Node.js and the MongoDB environment file, installs dependencies if missing, builds the frontend, starts both servers, and opens the site.

For manual startup, open two terminals:

1. Backend: run `npm start` from the `backend` folder.
2. Frontend: run `npm run build`, then `node serve.js` from the `frontend` folder.

The backend requires a valid `MONGODB_URI` in `backend/.env`; check `http://localhost:4000/api/health` if API-backed features do not load.

### Access the Application
Open your browser and navigate to: `http://localhost:4173`

---

## 📖 How to Use

### 1. Search Heritage Sites
- Click "Search & Browse" in navigation
- Use the search bar to find sites by name
- Filter by Category, Country, or City
- Click "View Details" to see complete information

### 2. Scan a Monument
- Click "Scanner" in navigation
- Type a monument name (e.g., "Taj Mahal", "Colosseum")
- Or click "Use Camera" to use your device camera
- The scanner will identify and show detailed information

### 3. View Site Details
- Click on any site card or search result
- Browse tabs: Overview, Full History, Visitor Tips, Details
- View photos, maps, and nearby sites
- Save to favorites for later

### 4. Explore Nearby Sites
- On any site detail page, scroll to "Nearby Heritage Sites" section
- Sites are calculated based on GPS distance
- Click to explore related monuments

### 5. Change Language
- Select language from dropdown in top navigation
- All content and UI will update instantly
- 16 languages available

---

## 🗂️ Project Structure

```
HeritageX/
├── backend/
│   ├── package.json
│   ├── server.js              # Main backend server
│   ├── data/
│   │   └── sites.js           # Heritage sites database
│   └── .gitignore
├── frontend/
│   ├── package.json
│   ├── serve.js               # Frontend server
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── locales/           # Translation files (16 languages)
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/        # React components
│       ├── pages/             # Route pages
│       ├── services/          # API services
│       ├── hooks/             # Custom hooks
│       ├── context/           # React context
│       ├── utils/             # Utilities
│       ├── data/              # Local site data
│       └── styles.css
├── API_DOCUMENTATION.md       # Complete API reference
└── README_COMPLETE.md         # Setup and project guide
```

---

## 📚 Database Structure

### Site Data Model
Each heritage site includes:
```javascript
{
  id: "site-id",
  name: { en: "Site Name", hi: "नाम", ... },
  country: "Country",
  city: "City",
  state: "State/Region",
  category: "Monument|Temple|Palace|etc",
  latitude: 27.1751,
  longitude: 78.0421,
  description: { en: "Description..." },
  history: { en: "Historical background..." },
  visitorTips: { en: "Practical tips..." },
  openingHours: "6:00 AM - 7:00 PM",
  entryFee: { foreign: "$30", indian: "₹1100" },
  bestTimeToVisit: "October to March",
  audioGuideLanguages: ["English", "Hindi", "French"],
  rating: 4.9,
  reviewCount: 125,
  photos: [...],
  reviews: [...],
  scannerKeywords: ["taj mahal", "agra", "monument"],
  ...
}
```

---

## 🔧 API Endpoints

### Search & Discovery
- `GET /api/sites` - Get all sites
- `GET /api/sites/:id` - Get specific site
- `GET /api/search?q=query&country=X&city=Y&category=Z` - Advanced search
- `GET /api/nearby?latitude=X&longitude=Y&radius=500` - Nearby sites
- `GET /api/suggestions?q=query` - Auto-complete suggestions

### Metadata
- `GET /api/countries` - Get all countries
- `GET /api/cities?country=X` - Get cities by country
- `GET /api/categories` - Get all categories
- `GET /api/languages` - Get supported languages

### Scanner
- `POST /api/scan` - Identify monument by text

### Health
- `GET /api/health` - Server health check

---

## 📝 Adding New Heritage Sites

### Step 1: Add to Backend Database
Edit `backend/data/sites.js` and add to `heritageSeeds` array:

```javascript
{
  id: 'stonehenge-09',
  name: 'Stonehenge',
  country: 'United Kingdom',
  city: 'Wiltshire',
  state: 'Wiltshire',
  category: 'Historic Site',
  latitude: 51.1789,
  longitude: -1.8262,
  description: 'Ancient stone circle monument...',
  history: 'Built around 2560-1520 BCE...',
  visitorTips: 'No direct access, view from boundary...',
  openingHours: '9:30 AM - 5:00 PM',
  entryFee: { adult: '£17.50', child: '£10.50' },
  bestTimeToVisit: 'Summer Solstice (June)',
  scannerKeywords: ['stonehenge', 'wiltshire', 'ancient circle', 'stone circle'],
  audioGuideLanguages: ['English', 'French', 'German'],
  rating: 4.6,
  reviewCount: 890,
  nearbyPlaces: ['Woodhenge', 'Durrington Walls', 'Amesbury', 'Salisbury'],
  photography: 'Limited - can only photograph from visitor area',
  accessibility: 'Limited wheelchair access',
  googleMapsLink: 'https://maps.google.com/?q=Stonehenge+UK',
  officialWebsite: 'https://www.english-heritage.org.uk/stonehenge/',
  timings: { openingTime: '09:30', closingTime: '17:00' },
  estimatedDuration: '1-2 hours'
}
```

### Step 2: Add to Frontend Data (Optional)
The frontend will use the backend data, but you can also add to `frontend/src/data/sites.js` for consistency.

### Step 3: Update Categories (if new type)
Edit `backend/data/sites.js` to add new category:
```javascript
export const categories = [
  'All', 'Monument', 'Historic Site', ..., 'YourNewCategory'
];
```

### Step 4: Test the Addition
1. Restart backend server
2. Search for your new site
3. Try scanner with keywords
4. Verify details page displays correctly

---

## 🌐 Supported Languages

1. English
2. Hindi (हिंदी)
3. Arabic (العربية)
4. French (Français)
5. Spanish (Español)
6. Portuguese (Português)
7. German (Deutsch)
8. Italian (Italiano)
9. Japanese (日本語)
10. Chinese - Simplified (简体中文)
11. Korean (한국어)
12. Russian (Русский)
13. Turkish (Türkçe)
14. Dutch (Nederlands)
15. Polish (Polski)
16. Gujarati (ગુજરાતી)

---

## 🎨 Customization

### Change Site Data Format
Edit the data structure in `backend/data/sites.js` in the `asSite()` function.

### Add New Fields
1. Add field to site objects in `heritageSeeds`
2. Update `asSite()` function to handle the field
3. Display in frontend components as needed

### Customize Categories
Edit `categories` array in `backend/data/sites.js`

### Modify Search Behavior
Edit search logic in `backend/server.js` - `app.get('/api/search', ...)`

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: Cannot find module 'express'
Solution: Run npm install in backend directory
```

### Frontend Won't Connect to Backend
```
CORS Error or API unreachable
Solution: 
1. Ensure backend is running on localhost:4000
2. Check firewall settings
3. Verify API URLs in frontend code
```

### Scanner Not Matching Sites
```
Solution:
1. Check scannerKeywords in site data
2. Ensure keywords are lowercase
3. Try exact site names first
```

### Coordinates Not Showing on Map
```
Solution:
1. Ensure site has latitude/longitude
2. Check map component has API key (if needed)
3. Verify coordinates are valid WGS84 format
```

---

## 📊 Performance Optimization

### Frontend
- Lazy load components for large lists
- Implement debouncing for search input
- Cache API responses client-side
- Use React.memo for expensive components

### Backend
- Index sites by ID for quick lookup
- Cache country/city lists
- Optimize distance calculations for large datasets
- Implement pagination for large result sets

---

## 🔒 Security Notes

- All user input is sanitized in search
- No sensitive data in frontend code
- API endpoints validate input parameters
- CORS enabled for development (restrict in production)

---

## 📱 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

To add or improve heritage site data:
1. Follow the data structure exactly
2. Verify all coordinates are accurate (use Google Maps)
3. Ensure entry fees are current
4. Add meaningful scanner keywords
5. Include real opening hours
6. Test thoroughly before committing

---

## 📄 License

This project is for educational and non-commercial use.

---

## 📞 Support & Documentation

- **API Documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Component Details:** See JSDoc comments in component files
- **Data Structure:** See comments in `backend/data/sites.js`

---

## ✨ Credits

**Heritage Sites Data Sources:**
- UNESCO World Heritage List
- Official site websites
- Travel guides and official tourism boards
- Academic heritage research

**Technologies Used:**
- React 18.3.1 - UI Framework
- Express.js 4.21.0 - Backend Server
- Vite 5.4.2 - Build tool
- i18next 23.14.0 - Internationalization
- Leaflet 1.9.4 - Maps
- Axios 1.7.7 - HTTP Client

---

## 🎯 Future Enhancements

- [ ] Integration with real UNESCO database
- [ ] Real-time QR code scanning
- [ ] User-generated content and reviews
- [ ] Virtual tours with 360° photos
- [ ] Augmented Reality (AR) viewing
- [ ] Offline mode with downloaded data
- [ ] Export site information as PDF/CSV
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for data management
- [ ] Advanced analytics and insights

---

## 🚀 Deployment

### Production Deployment Checklist
- [ ] Set environment variables
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable caching headers
- [ ] Configure CDN for assets
- [ ] Set up logging and monitoring
- [ ] Performance optimization
- [ ] Security headers configuration
- [ ] Load testing

---

**Version:** 1.0.0  
**Last Updated:** 2026-06-22  
**Status:** ✅ Production Ready

---

## 🎉 Get Started Now!

Run the servers and visit `http://localhost:4173` to start exploring the world's heritage sites!

```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd frontend && npm start

# Open browser
http://localhost:4173
```

Enjoy discovering heritage! 🌍✨
