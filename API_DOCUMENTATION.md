# HeritageX API Documentation

## Base URL
```
http://localhost:4000/api
```

---

## Endpoints

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "ok": true,
  "service": "heritagex-backend",
  "database": "connected",
  "timestamp": "2026-06-22T10:30:00Z"
}
```

The health endpoint returns HTTP `503` with `ok: false` and `database: "disconnected"` when MongoDB is unavailable.

---

### 2. Get All Sites
```
GET /api/sites
```
**Response:** Array of all heritage sites with complete information

---

### 3. Get Site by ID
```
GET /api/sites/:id
```
**Example:** `/api/sites/taj-mahal-01`

**Response:**
```json
{
  "id": "taj-mahal-01",
  "name": { "en": "Taj Mahal", ... },
  "country": "India",
  "city": "Agra",
  "latitude": 27.1751,
  "longitude": 78.0421,
  "description": { "en": "The Taj Mahal is..." },
  "history": { "en": "Constructed over 22 years..." },
  "visitorTips": { "en": "Visit early morning..." },
  "openingHours": "6:00 AM - 7:00 PM",
  "entryFee": { "foreign": "$30 USD", "indian": "₹1100 INR" },
  "bestTimeToVisit": "October to March",
  "rating": 4.9,
  "reviews": 125,
  ...
}
```

---

### 4. Search Sites
```
GET /api/search?q=query&category=Category&country=Country&city=City
```

**Query Parameters:**
- `q` (optional) - Search text (searches across name, city, country, description)
- `category` (optional) - Filter by category (default: "All")
- `country` (optional) - Filter by country (default: "All")
- `city` (optional) - Filter by city (default: "All")

**Examples:**
```
GET /api/search?q=taj
GET /api/search?category=Monument
GET /api/search?country=India&city=Agra
GET /api/search?q=pyramid&country=Egypt
```

**Response:** Array of matching sites, sorted by relevance

---

### 5. Get All Countries
```
GET /api/countries
```

**Response:**
```json
["Cambodia", "China", "Egypt", "France", "India", "Italy", "Jordan", "Peru", "Spain"]
```

---

### 6. Get Cities by Country
```
GET /api/cities?country=CountryName
```

**Examples:**
```
GET /api/cities?country=India
GET /api/cities?country=France
```

**Response:**
```json
["Agra", "Varanasi"]
```

---

### 7. Get Categories
```
GET /api/categories
```

**Response:**
```json
[
  "All",
  "Monument",
  "Historic Site",
  "Landmark",
  "Archaeological Site",
  "Temple",
  "Palace",
  "Church",
  "Fortress",
  "Island Abbey",
  "Religious Site",
  "Cultural Site",
  "Mausoleum"
]
```

---

### 8. Find Nearby Sites
```
GET /api/nearby?latitude=LAT&longitude=LONG&radius=RADIUS_KM
```

**Query Parameters:**
- `latitude` (required) - Starting latitude
- `longitude` (required) - Starting longitude
- `radius` (optional) - Search radius in kilometers (default: 500)

**Example:**
```
GET /api/nearby?latitude=27.1751&longitude=78.0421&radius=1000
```

**Response:** Array of sites within radius, sorted by distance
```json
[
  {
    "id": "taj-mahal-01",
    "name": { "en": "Taj Mahal" },
    "city": "Agra",
    "country": "India",
    "distance": 0.0,
    ...
  },
  {
    "id": "other-site",
    "distance": 245.3,
    ...
  }
]
```

---

### 9. Get Auto-Complete Suggestions
```
GET /api/suggestions?q=query
```

**Query Parameters:**
- `q` (required) - Search query (minimum 2 characters)

**Example:**
```
GET /api/suggestions?q=taj
```

**Response:**
```json
[
  {
    "name": "Taj Mahal",
    "city": "Agra",
    "country": "India",
    "id": "taj-mahal-01"
  }
]
```

---

### 10. Scan Monument
```
POST /api/scan
Content-Type: application/json

{
  "input": "monument_name_or_keyword"
}
```

**Examples:**
```json
{ "input": "taj mahal" }
{ "input": "colosseum" }
{ "input": "great wall beijing" }
```

**Success Response (200):**
```json
{
  "matched": true,
  "confidence": "high",
  "site": {
    "id": "taj-mahal-01",
    "name": { "en": "Taj Mahal" },
    "city": "Agra",
    "country": "India",
    ...
  }
}
```

**Confidence Levels:**
- `high` - Exact keyword match found
- `medium` - Partial keyword match or partial text match
- `low` - Matched through general text search with fallback

**No Match Response (404):**
```json
{
  "message": "No exact match found. Try these heritage sites:",
  "suggestions": [
    { "id": "taj-mahal-01", "name": "Taj Mahal", "city": "Agra", "country": "India" },
    ...
  ]
}
```

---

### 11. Get Languages
```
GET /api/languages
```

**Response:**
```json
[
  { "code": "en", "label": "English" },
  { "code": "hi", "label": "Hindi" },
  { "code": "ar", "label": "Arabic" },
  { "code": "fr", "label": "French" },
  ...
]
```

---

## Error Handling

### Common Error Responses:

**400 - Bad Request**
```json
{
  "error": "latitude and longitude required"
}
```

**404 - Not Found**
```json
{
  "message": "Site not found"
}
```

**500 - Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Search Strategy

The search API uses a multi-level matching strategy:

1. **Exact Name Match** - Highest priority (multiple exact matches possible)
2. **Partial Text Match** - Site description, city, country contains query
3. **Keyword Match** - Scanner keywords field matches query
4. **Relevance Ranking** - Results sorted by rating when multiple matches exist

---

## Filtering Examples

### By Category Only
```
GET /api/search?category=Temple
```
Returns all temples

### By Country Only
```
GET /api/search?country=India
```
Returns all sites in India

### By Country and City
```
GET /api/search?country=France&city=Paris
```
Returns sites in Paris, France

### Combined Search
```
GET /api/search?q=ancient&country=Egypt&category=Monument
```
Returns monuments in Egypt matching "ancient"

---

## Scanner Examples

### Perfect Match
**Request:**
```json
POST /api/scan
{ "input": "taj mahal" }
```
**Response:** High confidence match with full site details

### Partial Match
**Request:**
```json
POST /api/scan
{ "input": "colosseum rome" }
```
**Response:** High/Medium confidence match

### Fuzzy Match
**Request:**
```json
POST /api/scan
{ "input": "pyramid giza" }
```
**Response:** May return Pyramids of Giza with appropriate confidence level

### No Match with Suggestions
**Request:**
```json
POST /api/scan
{ "input": "random monument" }
```
**Response:** 404 with array of suggested sites to try

---

## Performance Tips

1. **Use specific filters** - Narrow down results with country/city/category
2. **Cache results** - Store search results client-side when possible
3. **Use nearby API** - For location-based discovery instead of searching all sites
4. **Batch requests** - Get countries once, then cache cities per country
5. **Implement debouncing** - For real-time suggestion API calls

---

## Data Structure

### Site Object Fields:
```javascript
{
  id: string,                    // Unique identifier
  name: { [lang]: string },      // Localized name
  country: string,               // Country name
  city: string,                  // City name
  state: string,                 // State/Region
  category: string,              // Type of site
  latitude: number,              // GPS latitude
  longitude: number,             // GPS longitude
  description: { [lang]: string },
  history: { [lang]: string },
  visitorTips: { [lang]: string },
  openingHours: string,
  entryFee: { [category]: string },
  bestTimeToVisit: string,
  audioGuideLanguages: string[],
  rating: number,
  reviewCount: number,
  nearbyPlaces: string[],
  photography: string,
  accessibility: string,
  googleMapsLink: string,
  officialWebsite: string,
  clothingAdvice: string,
  estimatedDuration: string,
  altitude: string (optional),
  scannerKeywords: string[],
  qrCode: string,
  photos: Array<{ title, url }>,
  reviews: Array<Review>
}
```

---

## Integration Notes

- All endpoints support CORS
- All responses include proper headers
- Errors include descriptive messages
- Search is case-insensitive
- Coordinates use WGS84 format (standard GPS)
- Distances calculated using Haversine formula
- All prices in local currencies (clearly labeled)
- All times in 12/24 hour format (as specified)

---

## Version
**API Version:** 1.0
**Last Updated:** 2026-06-22
**Base URLs:** 
- Backend: http://localhost:4000
- Frontend: http://localhost:4173
