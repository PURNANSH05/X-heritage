/* ── HeritageX Hotel Data ── */
/* Realistic hotel data near Indian heritage destinations */

export const HOTEL_AMENITIES = {
  wifi: { label: 'Free WiFi', icon: '📶' },
  pool: { label: 'Swimming Pool', icon: '🏊' },
  spa: { label: 'Spa & Wellness', icon: '💆' },
  gym: { label: 'Fitness Center', icon: '🏋️' },
  restaurant: { label: 'Restaurant', icon: '🍽️' },
  bar: { label: 'Bar & Lounge', icon: '🍸' },
  parking: { label: 'Free Parking', icon: '🅿️' },
  ac: { label: 'Air Conditioning', icon: '❄️' },
  breakfast: { label: 'Free Breakfast', icon: '🥐' },
  concierge: { label: 'Concierge', icon: '🎩' },
  laundry: { label: 'Laundry Service', icon: '👔' },
  airport: { label: 'Airport Shuttle', icon: '🚌' },
  petFriendly: { label: 'Pet Friendly', icon: '🐾' },
  rooftop: { label: 'Rooftop View', icon: '🌇' },
  heritage: { label: 'Heritage Property', icon: '🏰' },
  yoga: { label: 'Yoga Classes', icon: '🧘' },
};

export const ROOM_TYPES = [
  { id: 'standard', name: 'Standard Room', capacity: 2, description: 'Comfortable room with all basic amenities', multiplier: 1 },
  { id: 'deluxe', name: 'Deluxe Room', capacity: 2, description: 'Spacious room with upgraded furnishings and city/garden view', multiplier: 1.4 },
  { id: 'superior', name: 'Superior Room', capacity: 2, description: 'Premium room with enhanced amenities and premium view', multiplier: 1.8 },
  { id: 'suite', name: 'Junior Suite', capacity: 3, description: 'Separate living area with king-size bed and lounge', multiplier: 2.5 },
  { id: 'premium-suite', name: 'Premium Suite', capacity: 4, description: 'Luxurious suite with private terrace and panoramic views', multiplier: 4.0 },
  { id: 'family', name: 'Family Room', capacity: 4, description: 'Spacious room with extra beds suitable for families', multiplier: 1.6 },
  { id: 'villa', name: 'Private Villa', capacity: 6, description: 'Standalone villa with private pool and butler service', multiplier: 6.0 },
];

export const HOTELS_DATABASE = [
  // Agra / Taj Mahal
  { id: 'h001', name: 'The Oberoi Amarvilas', destination: 'agra', destinationCity: 'Agra', stars: 5, category: 'Luxury', pricePerNight: 28000, rating: 4.9, reviews: 2847, distanceFromAttr: '600m from Taj Mahal', amenities: ['wifi','pool','spa','gym','restaurant','bar','concierge','breakfast','airport','heritage'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', description: 'Iconic luxury hotel with unobstructed Taj Mahal views from every room.', cancellation: 'Free cancellation up to 24 hours before check-in', featured: true },
  { id: 'h002', name: 'ITC Mughal', destination: 'agra', destinationCity: 'Agra', stars: 5, category: 'Luxury', pricePerNight: 18000, rating: 4.7, reviews: 1923, distanceFromAttr: '1.2km from Taj Mahal', amenities: ['wifi','pool','spa','gym','restaurant','bar','parking','ac','concierge','heritage'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', description: 'A grand Mughal-style resort with sprawling gardens and world-class dining.', cancellation: 'Free cancellation up to 48 hours', featured: true },
  { id: 'h003', name: 'Taj Hotel & Convention Centre', destination: 'agra', destinationCity: 'Agra', stars: 5, category: 'Luxury', pricePerNight: 12000, rating: 4.6, reviews: 1456, distanceFromAttr: '2km from Taj Mahal', amenities: ['wifi','pool','spa','restaurant','bar','parking','ac','gym'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400', description: 'Modern luxury with excellent conference facilities and city views.', cancellation: 'Non-refundable', featured: false },
  { id: 'h004', name: 'Hotel Sheela', destination: 'agra', destinationCity: 'Agra', stars: 3, category: 'Budget', pricePerNight: 1800, rating: 4.0, reviews: 890, distanceFromAttr: '500m from Taj Mahal', amenities: ['wifi','ac','parking','restaurant'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400', description: 'Budget-friendly hotel within walking distance of the Taj Mahal.', cancellation: 'Free cancellation', featured: false },

  // Jaipur
  { id: 'h005', name: 'Rambagh Palace', destination: 'jaipur', destinationCity: 'Jaipur', stars: 5, category: 'Luxury', pricePerNight: 35000, rating: 4.9, reviews: 3210, distanceFromAttr: '3km from City Palace', amenities: ['wifi','pool','spa','gym','restaurant','bar','heritage','concierge','breakfast','parking','yoga'], image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400', description: 'Former royal palace of Maharaja of Jaipur — now a legendary heritage hotel.', cancellation: 'Free cancellation up to 72 hours', featured: true },
  { id: 'h006', name: 'Samode Palace', destination: 'jaipur', destinationCity: 'Jaipur', stars: 5, category: 'Luxury', pricePerNight: 22000, rating: 4.8, reviews: 1678, distanceFromAttr: '40km from Jaipur', amenities: ['wifi','pool','spa','restaurant','heritage','concierge','breakfast','yoga'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', description: '475-year-old palace with hand-painted frescoes and royal ambience.', cancellation: 'Free cancellation up to 48 hours', featured: true },
  { id: 'h007', name: 'Hotel Arya Niwas', destination: 'jaipur', destinationCity: 'Jaipur', stars: 3, category: 'Budget', pricePerNight: 2200, rating: 4.2, reviews: 1240, distanceFromAttr: '1km from Hawa Mahal', amenities: ['wifi','ac','restaurant','parking','yoga'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', description: 'Popular backpacker-friendly hotel in the heart of the Pink City.', cancellation: 'Free cancellation', featured: false },
  { id: 'h008', name: 'Taj Jai Mahal Palace', destination: 'jaipur', destinationCity: 'Jaipur', stars: 5, category: 'Luxury', pricePerNight: 19000, rating: 4.7, reviews: 2100, distanceFromAttr: '2km from City Palace', amenities: ['wifi','pool','spa','gym','restaurant','bar','heritage','concierge','breakfast'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400', description: '18th-century palace hotel with 18 acres of Mughal gardens.', cancellation: 'Non-refundable', featured: true },

  // Varanasi
  { id: 'h009', name: 'Brijrama Palace', destination: 'varanasi', destinationCity: 'Varanasi', stars: 5, category: 'Luxury', pricePerNight: 16000, rating: 4.8, reviews: 987, distanceFromAttr: 'On the Ganges Ghats', amenities: ['wifi','restaurant','bar','heritage','concierge','breakfast','rooftop'], image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400', description: '250-year-old heritage haveli directly on the Ganges with ghat views.', cancellation: 'Free cancellation up to 48 hours', featured: true },
  { id: 'h010', name: 'Taj Ganges', destination: 'varanasi', destinationCity: 'Varanasi', stars: 5, category: 'Luxury', pricePerNight: 12000, rating: 4.6, reviews: 1456, distanceFromAttr: '3km from Dashashwamedh Ghat', amenities: ['wifi','pool','spa','gym','restaurant','bar','parking','concierge'], image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400', description: 'Serene 5-star retreat with lush gardens and excellent Varanasi cuisine.', cancellation: 'Free cancellation', featured: false },
  { id: 'h011', name: 'Zostel Varanasi', destination: 'varanasi', destinationCity: 'Varanasi', stars: 1, category: 'Hostel', pricePerNight: 650, rating: 4.3, reviews: 2340, distanceFromAttr: '200m from Assi Ghat', amenities: ['wifi','ac','rooftop'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', description: 'Trendy backpacker hostel with rooftop Ganga views — great social vibe.', cancellation: 'Free cancellation', featured: false },

  // Goa
  { id: 'h012', name: 'Taj Exotica Resort & Spa', destination: 'goa', destinationCity: 'Goa', stars: 5, category: 'Resort', pricePerNight: 26000, rating: 4.9, reviews: 3890, distanceFromAttr: 'Benaulim Beach', amenities: ['wifi','pool','spa','gym','restaurant','bar','airport','concierge','breakfast','yoga'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', description: 'Breathtaking beachfront resort with award-winning spa on South Goa\'s finest beach.', cancellation: 'Free cancellation up to 72 hours', featured: true },
  { id: 'h013', name: 'W Goa', destination: 'goa', destinationCity: 'Goa', stars: 5, category: 'Luxury', pricePerNight: 22000, rating: 4.8, reviews: 2670, distanceFromAttr: 'Vagator Beach', amenities: ['wifi','pool','spa','gym','restaurant','bar','concierge','breakfast'], image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400', description: 'Ultra-hip luxury resort on the cliffs of Vagator with stunning Arabian Sea views.', cancellation: 'Non-refundable', featured: true },
  { id: 'h014', name: 'Pousada Tauma', destination: 'goa', destinationCity: 'Goa', stars: 4, category: 'Boutique', pricePerNight: 6500, rating: 4.5, reviews: 890, distanceFromAttr: 'Calangute Beach', amenities: ['wifi','pool','restaurant','spa','yoga','petFriendly'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', description: 'Charming boutique property in a restored Goan Portuguese house.', cancellation: 'Free cancellation', featured: false },
  { id: 'h015', name: 'Zostel Goa', destination: 'goa', destinationCity: 'Goa', stars: 1, category: 'Hostel', pricePerNight: 900, rating: 4.4, reviews: 3200, distanceFromAttr: 'Anjuna Beach', amenities: ['wifi','pool','bar','ac'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', description: 'Lively party hostel near Anjuna beach — great for solo travelers.', cancellation: 'Free cancellation', featured: false },

  // Delhi
  { id: 'h016', name: 'The Leela Palace New Delhi', destination: 'delhi', destinationCity: 'New Delhi', stars: 5, category: 'Luxury', pricePerNight: 32000, rating: 4.9, reviews: 4120, distanceFromAttr: '3km from India Gate', amenities: ['wifi','pool','spa','gym','restaurant','bar','concierge','breakfast','airport','parking'], image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=400', description: 'Delhi\'s premier luxury address on the Diplomatic Enclave with palatial interiors.', cancellation: 'Free cancellation up to 48 hours', featured: true },
  { id: 'h017', name: 'The Imperial New Delhi', destination: 'delhi', destinationCity: 'New Delhi', stars: 5, category: 'Heritage', pricePerNight: 18000, rating: 4.8, reviews: 2890, distanceFromAttr: '2km from Connaught Place', amenities: ['wifi','pool','spa','gym','restaurant','bar','heritage','concierge','breakfast'], image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400', description: 'Colonial-era heritage hotel with an art deco design and world-class service.', cancellation: 'Free cancellation up to 24 hours', featured: true },
  { id: 'h018', name: 'Bloom Boutique', destination: 'delhi', destinationCity: 'New Delhi', stars: 3, category: 'Boutique', pricePerNight: 3200, rating: 4.3, reviews: 1560, distanceFromAttr: 'Paharganj area', amenities: ['wifi','ac','restaurant','rooftop'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', description: 'Stylish mid-range boutique near New Delhi Railway Station.', cancellation: 'Free cancellation', featured: false },

  // Hampi
  { id: 'h019', name: 'Evolve Back Kamalapura Palace', destination: 'hampi', destinationCity: 'Hampi', stars: 5, category: 'Resort', pricePerNight: 22000, rating: 4.9, reviews: 780, distanceFromAttr: '2km from Virupaksha Temple', amenities: ['wifi','pool','spa','restaurant','heritage','concierge','yoga','rooftop'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', description: 'Award-winning eco-luxury resort built within a 14th-century palace complex.', cancellation: 'Free cancellation up to 72 hours', featured: true },
  { id: 'h020', name: 'Hampi\'s Boulders', destination: 'hampi', destinationCity: 'Hampi', stars: 4, category: 'Boutique', pricePerNight: 8500, rating: 4.6, reviews: 456, distanceFromAttr: '5km from Virupaksha Temple', amenities: ['wifi','pool','restaurant','rooftop'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', description: 'Unique eco-resort set amidst dramatic boulder-strewn landscape.', cancellation: 'Non-refundable', featured: false },

  // Rann of Kutch
  { id: 'h021', name: 'Rann Utsav Tent City', destination: 'rann-of-kutch', destinationCity: 'Bhuj', stars: 4, category: 'Resort', pricePerNight: 12000, rating: 4.7, reviews: 2340, distanceFromAttr: 'On the Great Rann', amenities: ['wifi','restaurant','pool','breakfast','concierge','yoga'], image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', description: 'Luxury tent city on the White Rann — a truly once-in-a-lifetime experience.', cancellation: 'Non-refundable (seasonal property)', featured: true },

  // Kedarnath
  { id: 'h022', name: 'GMVN Guest House', destination: 'kedarnath', destinationCity: 'Kedarnath', stars: 2, category: 'Budget', pricePerNight: 1200, rating: 3.8, reviews: 1890, distanceFromAttr: '500m from Kedarnath Temple', amenities: ['wifi','restaurant'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400', description: 'Government-run guest house with basic amenities near the famous temple.', cancellation: 'Free cancellation', featured: false },
];

export function searchHotels(destination, checkin, checkout, guests = 2, category = null) {
  let results = HOTELS_DATABASE.filter(h =>
    h.destination.toLowerCase().includes(destination.toLowerCase()) ||
    h.destinationCity.toLowerCase().includes(destination.toLowerCase())
  );
  if (category) {
    results = results.filter(h => h.category.toLowerCase() === category.toLowerCase());
  }
  const nights = checkin && checkout
    ? Math.max(1, Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)))
    : 1;
  return results.map(h => ({
    ...h,
    totalPrice: h.pricePerNight * nights,
    nights,
    availableRooms: Math.floor(1 + Math.random() * 8),
    roomTypes: ROOM_TYPES.map(rt => ({
      ...rt,
      price: Math.round(h.pricePerNight * rt.multiplier / 100) * 100,
      available: Math.random() > 0.3,
    })),
  }));
}

export function getHotelById(id) {
  const hotel = HOTELS_DATABASE.find(h => h.id === id);
  if (!hotel) return null;
  return {
    ...hotel,
    roomTypes: ROOM_TYPES.map(rt => ({
      ...rt,
      price: Math.round(hotel.pricePerNight * rt.multiplier / 100) * 100,
      available: Math.random() > 0.3,
    })),
  };
}
