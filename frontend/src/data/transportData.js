/* ── HeritageX Transport & Itinerary Data ── */

export const CAB_PROVIDERS = [
  { id: 'ola', name: 'Ola', logo: 'car', color: '#ffd700', rating: 4.2 },
  { id: 'uber', name: 'Uber', logo: 'car', color: '#000000', rating: 4.3 },
  { id: 'rapido', name: 'Rapido', logo: 'bike', color: '#006bff', rating: 4.1 },
  { id: 'local', name: 'Local Cab', logo: 'taxi', color: '#ff6b00', rating: 4.0 },
  { id: 'yatri', name: 'Yatri Cabs', logo: 'car', color: '#00a651', rating: 4.4 },
];

export const VEHICLE_TYPES = [
  { id: 'mini', name: 'Mini / Hatchback', icon: 'car', capacity: 4, ac: true, type: 'Cab', perKm: 12, baseFare: 50 },
  { id: 'sedan', name: 'Sedan', icon: 'car', capacity: 4, ac: true, type: 'Cab', perKm: 14, baseFare: 60 },
  { id: 'suv', name: 'SUV / Premium', icon: 'car', capacity: 6, ac: true, type: 'Cab', perKm: 18, baseFare: 80 },
  { id: 'auto', name: 'Auto Rickshaw', icon: 'taxi', capacity: 3, ac: false, type: 'Auto', perKm: 8, baseFare: 30 },
  { id: 'bike', name: 'Bike Taxi', icon: 'bike', capacity: 1, ac: false, type: 'Bike', perKm: 6, baseFare: 25 },
  { id: 'bike-rent', name: 'Bike Rental', icon: 'bike', capacity: 1, ac: false, type: 'Rental', perDay: 400, deposit: 2000 },
  { id: 'scooter-rent', name: 'Scooter Rental', icon: 'bike', capacity: 2, ac: false, type: 'Rental', perDay: 350, deposit: 1500 },
  { id: 'cycle-rent', name: 'Cycle Rental', icon: 'bike', capacity: 1, ac: false, type: 'Rental', perDay: 100, deposit: 500 },
  { id: 'car-rent', name: 'Car Rental (Self Drive)', icon: 'key', capacity: 5, ac: true, type: 'Rental', perDay: 1800, deposit: 5000 },
];

export const POPULAR_ROUTES = [
  { id: 'hotel-airport', from: 'Hotel', to: 'Airport', icon: 'plane', description: 'Drop to airport in time for your flight', distanceKm: 15 },
  { id: 'airport-hotel', from: 'Airport', to: 'Hotel', icon: 'hotel', description: 'Pickup from airport to your hotel', distanceKm: 15 },
  { id: 'hotel-station', from: 'Hotel', to: 'Railway Station', icon: 'train', description: 'Drop to railway station', distanceKm: 8 },
  { id: 'station-hotel', from: 'Railway Station', to: 'Hotel', icon: 'hotel', description: 'Pickup from railway station', distanceKm: 8 },
  { id: 'hotel-attraction', from: 'Hotel', to: 'Tourist Attraction', icon: 'landmark', description: 'Visit the main attraction from your hotel', distanceKm: 5 },
  { id: 'attraction-hotel', from: 'Tourist Attraction', to: 'Hotel', icon: 'hotel', description: 'Return from attraction to hotel', distanceKm: 5 },
  { id: 'hotel-restaurant', from: 'Hotel', to: 'Restaurant', icon: 'utensils', description: 'Evening dinner at top-rated restaurant', distanceKm: 3 },
  { id: 'hotel-market', from: 'Hotel', to: 'Local Market', icon: 'shopping', description: 'Shopping trip to local bazaar', distanceKm: 4 },
  { id: 'bus-stand', from: 'Hotel', to: 'Bus Stand', icon: 'bus', description: 'Drop to bus stand for onward journey', distanceKm: 7 },
];

export function calculateFare(vehicle, distanceKm) {
  if (vehicle.type === 'Rental') {
    return { perDay: vehicle.perDay, deposit: vehicle.deposit };
  }
  const fare = vehicle.baseFare + (vehicle.perKm * distanceKm);
  const withSurge = Math.round(fare * (1 + Math.random() * 0.3));
  return { minFare: Math.round(fare * 0.9), maxFare: Math.round(fare * 1.2), estimatedFare: withSurge, eta: `${Math.floor(3 + Math.random() * 12)} mins` };
}

export function generateTransportOptions(route) {
  return VEHICLE_TYPES.filter(v => v.type !== 'Rental').map(v => ({
    ...v,
    providers: CAB_PROVIDERS.slice(0, 2 + Math.floor(Math.random() * 3)).map(p => ({
      ...p,
      fare: calculateFare(v, route.distanceKm || 8),
      eta: `${Math.floor(2 + Math.random() * 15)} mins`,
      promoAvailable: Math.random() > 0.7,
    })),
  }));
}

/* ── Itinerary Generator ── */
export const ACTIVITY_TYPES = {
  morning: ['Heritage Site Visit', 'Sunrise Point', 'Morning Puja/Ceremony', 'Guided Heritage Walk', 'Museum Visit'],
  afternoon: ['Local Market Exploration', 'Handicraft Shopping', 'Cultural Workshop', 'Heritage Site Visit', 'Photography Walk'],
  evening: ['Sunset View', 'Light & Sound Show', 'Local Cuisine Dinner', 'Cultural Performance', 'Riverside/Lakeshore Walk'],
  night: ['Night Photography', 'Local Nightlife', 'Rest & Relaxation'],
};

const DESTINATION_ITINERARIES = {
  'taj-mahal': {
    city: 'Agra',
    days: {
      1: [
        { time: '06:00', activity: 'Sunrise visit to Taj Mahal', type: 'Heritage', duration: '2h', icon: 'landmark', notes: 'Go early to avoid crowds and see the Taj glow at sunrise' },
        { time: '09:00', activity: 'Breakfast at rooftop restaurant', type: 'Food', duration: '1h', icon: 'coffee' },
        { time: '10:30', activity: 'Agra Fort visit', type: 'Heritage', duration: '2h', icon: 'castle', notes: 'UNESCO World Heritage Site — great views of Taj from here' },
        { time: '13:00', activity: 'Lunch at Pind Balluchi', type: 'Food', duration: '1h', icon: 'utensils' },
        { time: '14:30', activity: 'Fatehpur Sikri Day Trip', type: 'Heritage', duration: '3h', icon: 'landmark', notes: '37km from Agra — the abandoned Mughal capital' },
        { time: '18:30', activity: 'Mehtab Bagh Sunset View', type: 'Scenic', duration: '1h', icon: 'sunrise' },
        { time: '20:00', activity: 'Dinner & Petha shopping', type: 'Food/Shopping', duration: '2h', icon: 'shopping' },
      ],
      2: [
        { time: '07:00', activity: 'Taj Mahal re-visit (inside mausoleum)', type: 'Heritage', duration: '2h', icon: 'landmark' },
        { time: '09:30', activity: 'Itimad-ud-Daulah (Baby Taj)', type: 'Heritage', duration: '1.5h', icon: 'landmark' },
        { time: '11:30', activity: 'Chini Ka Rauza', type: 'Heritage', duration: '1h', icon: 'landmark' },
        { time: '13:00', activity: 'Lunch at Pinch of Spice', type: 'Food', duration: '1h', icon: 'utensils' },
        { time: '14:30', activity: 'Sadar Bazaar Shopping', type: 'Shopping', duration: '2h', icon: 'shopping' },
        { time: '17:00', activity: 'Mohabbat the Taj Show (cultural)', type: 'Culture', duration: '2h', icon: 'music' },
        { time: '20:00', activity: 'Farewell dinner at hotel', type: 'Food', duration: '1.5h', icon: 'wine' },
      ],
    }
  },
  'jaipur': {
    city: 'Jaipur',
    days: {
      1: [
        { time: '08:00', activity: 'Amber Fort & Palace', type: 'Heritage', duration: '3h', icon: 'castle', notes: 'Book elephant ride in advance or opt for jeep' },
        { time: '12:00', activity: 'Lunch at 1135 AD (Amber Fort)', type: 'Food', duration: '1h', icon: 'utensils' },
        { time: '14:00', activity: 'City Palace Museum', type: 'Heritage', duration: '2h', icon: 'landmark' },
        { time: '16:30', activity: 'Jantar Mantar Observatory', type: 'Heritage', duration: '1h', icon: 'search' },
        { time: '18:00', activity: 'Hawa Mahal (Sunset View)', type: 'Heritage', duration: '1h', icon: 'castle' },
        { time: '19:30', activity: 'Bapu Bazaar Shopping', type: 'Shopping', duration: '1.5h', icon: 'shopping' },
        { time: '21:00', activity: 'Dinner at Chokhi Dhani', type: 'Food', duration: '2h', icon: 'music', notes: 'Rajasthani cultural village experience with folk dance' },
      ],
      2: [
        { time: '07:30', activity: 'Nahargarh Fort sunrise', type: 'Scenic', duration: '2h', icon: 'sunrise' },
        { time: '10:00', activity: 'Jaigarh Fort & Jaivana Cannon', type: 'Heritage', duration: '2h', icon: 'castle' },
        { time: '12:30', activity: 'Lunch at Suvarna Mahal', type: 'Food', duration: '1h', icon: 'utensils' },
        { time: '14:00', activity: 'Block Printing Workshop', type: 'Culture', duration: '2h', icon: 'activity' },
        { time: '16:30', activity: 'Johari Bazaar jewelry shopping', type: 'Shopping', duration: '2h', icon: 'gift' },
        { time: '19:00', activity: 'Kanak Vrindavan Garden', type: 'Nature', duration: '1h', icon: 'flower' },
        { time: '20:30', activity: 'Dinner at Niros Restaurant', type: 'Food', duration: '1.5h', icon: 'utensils' },
      ],
    }
  },
  default: {
    city: 'Destination',
    days: {}
  }
};

export function generateItinerary(destinationId, destinationName, city, days, budget) {
  const template = DESTINATION_ITINERARIES[destinationId] || DESTINATION_ITINERARIES.default;
  const budgetActivities = {
    budget: ['Local transport by auto', 'Street food lunch', 'Self-guided walking tour'],
    premium: ['Private cab', 'Restaurant meals', 'Guided tour with audio'],
    luxury: ['Chauffeur-driven car', 'Fine dining', 'Private heritage walk with expert guide'],
  };

  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    const templateDay = template.days[d];
    if (templateDay) {
      itinerary.push({ day: d, date: null, activities: templateDay });
    } else {
      // Generate generic day for longer trips
      itinerary.push({
        day: d,
        date: null,
        activities: [
          { time: '08:00', activity: d === days ? 'Checkout & Departure' : 'Morning heritage exploration', type: 'Heritage', duration: '3h', icon: 'landmark' },
          { time: '12:00', activity: 'Lunch at local restaurant', type: 'Food', duration: '1h', icon: 'utensils' },
          { time: '14:00', activity: 'Cultural experience / Shopping', type: 'Culture', duration: '3h', icon: 'shopping' },
          { time: '18:00', activity: 'Evening stroll & local market', type: 'Leisure', duration: '2h', icon: 'sunset' },
          { time: '20:00', activity: 'Dinner at recommended restaurant', type: 'Food', duration: '1.5h', icon: 'utensils' },
        ]
      });
    }
  }

  return {
    destination: destinationName,
    city: template.city || city,
    days,
    budget,
    totalDays: days,
    budgetTips: budgetActivities[budget] || budgetActivities.premium,
    itinerary,
  };
}
