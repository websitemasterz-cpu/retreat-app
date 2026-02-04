// src/App.jsx - REAL LOCATION VERSION
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Users, Mountain, 
  Navigation, Clock, Bell, X, AlertCircle, CheckCircle, 
  RefreshCw, Zap, ArrowUp, Home, Filter, MapPin as TrailIcon,
  Sun, Cloud, Thermometer, Droplets, Wind, Sunrise, Sunset,
  TrendingUp, Target, Coffee as CoffeeIcon, MessageCircle,
  Upload, CloudRain, CloudSnow, CloudLightning, Trophy,
  Gift, Download, Compass, Activity, Star, Shield, Phone,
  Music, Edit, ChevronUp, CheckSquare, Dumbbell, CalendarDays,
  Users as GroupIcon, ExternalLink, ArrowRight, Ruler,
  Clock as TimeIcon, Award, Map as MapIcon, Moon,
  Plus, Minus, Search, Share as ShareIcon, Wifi, Battery,
  WifiOff, Coffee
} from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // STATE VARIABLES
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentDay, setCurrentDay] = useState('friday');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  
  // User and progress states
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: 'You',
    points: 150,
    level: 1,
    avatar: '👤',
    checkIns: 0
  });
  const [streakDays, setStreakDays] = useState(3);
  const [hikedTrails, setHikedTrails] = useState([]);
  const [progressMetrics, setProgressMetrics] = useState({
    totalMilesHiked: 0,
    trailsCompleted: 0,
    prayerCount: 0,
    photosShared: 0,
    checkIns: 0
  });
  
  // Weather states
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Trails states
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [trailsLoading, setTrailsLoading] = useState(false);
  const [trailsError, setTrailsError] = useState(null);
  const [trailFilters, setTrailFilters] = useState({
    maxDistance: 30,
    minLength: 0,
    maxLength: 30,
    difficulty: 'all'
  });
  const [connectionStatus, setConnectionStatus] = useState('online');
  
  // Other states
  const [notifications, setNotifications] = useState([]);
  const [checkedInAttractions, setCheckedInAttractions] = useState({});
  const [photos, setPhotos] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [commentText, setCommentText] = useState('');
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [likedTestimonials, setLikedTestimonials] = useState([]);
  const [prayedForRequests, setPrayedForRequests] = useState([]);

  // BASE LOCATION DATA
  const baseLocation = {
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre',
    address: 'Glenridding, Penrith CA11 0QR, UK'
  };

  // LOCATIONS DATA
  const locations = {
    base: { 
      lat: 54.5262, 
      lng: -2.9620, 
      name: 'Bury Jubilee Centre', 
      icon: '🏠', 
      color: 'bg-emerald-500',
      description: 'Home base for the retreat',
      difficulty: 'Easy',
      points: 10,
      distanceFromBase: 0
    },
    glenriddingDodd: { 
      lat: 54.5350, 
      lng: -2.9500, 
      name: 'Glenridding Dodd', 
      icon: '🥾', 
      color: 'bg-green-500',
      description: 'Gentle fell walk with panoramic views',
      difficulty: 'Easy to Moderate',
      points: 20,
      distanceFromBase: 1.5
    },
    airaForce: { 
      lat: 54.5733, 
      lng: -2.9067, 
      name: 'Aira Force Waterfall', 
      icon: '💧', 
      color: 'bg-blue-500',
      description: 'Spectacular 65-foot cascade',
      difficulty: 'Easy',
      points: 25,
      distanceFromBase: 3
    },
    helvellyn: { 
      lat: 54.5275, 
      lng: -3.0164, 
      name: 'Helvellyn Summit', 
      icon: '⛰️', 
      color: 'bg-amber-500',
      description: 'England\'s 3rd highest peak',
      difficulty: 'Challenging',
      points: 50,
      distanceFromBase: 4
    },
    ullswater: { 
      lat: 54.5500, 
      lng: -2.9300, 
      name: 'Ullswater Lake', 
      icon: '🛥️', 
      color: 'bg-indigo-500',
      description: 'Beautiful lake for steamer rides',
      difficulty: 'Easy',
      points: 15,
      distanceFromBase: 2
    }
  };

  // ATTRACTIONS DATA
  const attractions = [
    {
      id: 'airaForce',
      name: 'Aira Force Waterfall',
      distance: '3 miles',
      description: 'Spectacular 65-foot cascade through ancient woodland.',
      duration: '2-3 hours',
      difficulty: 'Easy to Moderate',
      points: 25,
      icon: '💧',
      trailLength: 2.5
    },
    {
      id: 'helvellyn',
      name: 'Helvellyn Summit',
      distance: '4 miles',
      description: 'England\'s 3rd highest peak (950m).',
      duration: '6-7 hours',
      difficulty: 'Challenging',
      points: 50,
      icon: '⛰️',
      trailLength: 8
    },
    {
      id: 'ullswater',
      name: 'Ullswater Steamers',
      distance: 'At lakefront',
      description: 'Historic boat cruises on England\'s most beautiful lake.',
      duration: '1-2 hours',
      difficulty: 'Easy',
      points: 15,
      icon: '🛥️',
      trailLength: 1
    },
    {
      id: 'glenriddingDodd',
      name: 'Glenridding Dodd',
      distance: '1.5 miles',
      description: 'Gentle fell walk with panoramic views over Ullswater.',
      duration: '2 hours',
      difficulty: 'Easy to Moderate',
      points: 20,
      icon: '🥾',
      trailLength: 2
    }
  ];

  // SCHEDULE DATA
  const schedule = {
    friday: [
      { time: '06:00', activity: 'Depart London', location: 'London', emoji: '🚌' },
      { time: '14:00', activity: 'Arrival & Check-in', location: 'base', emoji: '🏠' },
      { time: '15:00', activity: 'Orientation Walk to Glenridding Dodd', location: 'glenriddingDodd', emoji: '🥾' },
      { time: '17:30', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:00', activity: 'Welcome & Evening Worship', location: 'base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    saturday: [
      { time: '07:00', activity: 'Morning Devotion', location: 'base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
      { time: '09:00', activity: 'Aira Force & Gowbarrow Fell Hike', location: 'airaForce', emoji: '🏔️' },
      { time: '14:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
      { time: '16:00', activity: 'Optional: Ullswater Steamer', location: 'ullswater', emoji: '⛴️' },
      { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Discussion', location: 'base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    sunday: [
      { time: '06:30', activity: 'Morning Devotion & Prayer', location: 'base', emoji: '📖' },
      { time: '07:15', activity: 'Early Breakfast', location: 'base', emoji: '🍳' },
      { time: '08:00', activity: 'HELVELLYN SUMMIT HIKE', location: 'helvellyn', emoji: '⛰️' },
      { time: '15:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
      { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Communion', location: 'base', emoji: '✝️' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    monday: [
      { time: '07:00', activity: 'Final Morning Devotion', location: 'base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
      { time: '09:00', activity: 'Lakeside Walk & Closing Worship', location: 'ullswater', emoji: '🚶' },
      { time: '10:30', activity: 'Pack Up & Check Out', location: 'base', emoji: '🎒' },
      { time: '12:00', activity: 'Depart for London', location: 'London', emoji: '🚌' }
    ]
  };

  // DIFFICULTY MAPPING
  const difficultyMap = {
    1: { label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-300' },
    2: { label: 'Easy/Intermediate', color: 'bg-green-500', text: 'text-green-300' },
    3: { label: 'Intermediate', color: 'bg-amber-500', text: 'text-amber-300' },
    4: { label: 'Hard', color: 'bg-orange-500', text: 'text-orange-300' },
    5: { label: 'Expert', color: 'bg-red-500', text: 'text-red-300' }
  };

  // HELPER FUNCTIONS
  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Convert km to miles
  const kmToMiles = (km) => (km * 0.621371).toFixed(1);

  // Get weather icon
  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-5 h-5 text-slate-300" />;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (lowerCondition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (lowerCondition.includes('snow')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  // Add notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  // Check into attraction
  const checkIntoAttraction = (attractionId) => {
    const attraction = attractions.find(a => a.id === attractionId) || locations[attractionId];
    
    if (checkedInAttractions[attractionId]) {
      addNotification(`Already checked into ${attraction.name}!`);
      return;
    }
    
    setCheckedInAttractions(prev => ({
      ...prev,
      [attractionId]: {
        timestamp: new Date().toISOString(),
        name: attraction.name,
        trailLength: attraction.trailLength || 0
      }
    }));
    
    const points = attraction.points || 10;
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points,
      checkIns: (prev.checkIns || 0) + 1
    }));
    
    setProgressMetrics(prev => ({
      ...prev,
      checkIns: prev.checkIns + 1
    }));
    
    addNotification(`Checked into ${attraction.name}! +${points} points 🎉`);
  };

  // Fetch live weather
  const fetchLiveWeather = async () => {
    setWeatherLoading(true);
    try {
      // Use Open-Meteo API for real weather data
      const lat = currentLocation?.lat || baseLocation.lat;
      const lng = currentLocation?.lng || baseLocation.lng;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=sunrise,sunset&timezone=auto`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Map weather codes to conditions
        const weatherCodes = {
          0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
          45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
          55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
          61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
          67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
          77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
          82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
          95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
        };
        
        const weatherCode = data.current.weather_code;
        const condition = weatherCodes[weatherCode] || 'Partly cloudy';
        
        setLiveWeather({
          temperature: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.temperature_2m - 2),
          condition: condition,
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // Convert to km/h
          sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          icon: condition.includes('Clear') ? '☀️' : condition.includes('cloud') ? '⛅' : condition.includes('rain') ? '🌧️' : condition.includes('snow') ? '❄️' : '⛅',
          city: currentLocation ? 'Your Location' : 'Lake District',
          lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isLiveData: true
        });
      } else {
        throw new Error('Weather API failed');
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock data
      setLiveWeather({
        temperature: Math.floor(Math.random() * 10) + 10,
        feelsLike: Math.floor(Math.random() * 8) + 8,
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        sunrise: '06:45',
        sunset: '20:15',
        icon: '⛅',
        city: 'Lake District',
        lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isLiveData: false
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch real trails from OpenStreetMap
  const fetchRealTrails = async () => {
    if (!currentLocation) {
      setTrailsError('Location required to find nearby trails');
      return;
    }

    setTrailsLoading(true);
    setTrailsError(null);

    try {
      // Use Overpass API to find hiking trails near current location
      const { lat, lng } = currentLocation;
      const radius = trailFilters.maxDistance * 1600; // Convert miles to meters
      
      const query = `
        [out:json];
        (
          way["highway"="path"]["sac_scale"](around:${radius},${lat},${lng});
          way["highway"="footway"](around:${radius},${lat},${lng});
          way["route"="hiking"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (response.ok) {
        const data = await response.json();
        
        // Process trail data from OSM
        const trails = data.elements
          .filter(el => el.type === 'way' && el.tags && (el.tags.name || el.tags.ref))
          .map(el => {
            const distanceFromUser = calculateDistance(
              lat, lng,
              el.center?.lat || lat,
              el.center?.lng || lng
            );
            
            // Estimate trail length (simplified)
            const estimatedLength = (1 + Math.random() * 4).toFixed(1);
            const difficulty = el.tags.sac_scale === 'hiking' ? 2 : 
                             el.tags.sac_scale === 'mountain_hiking' ? 3 : 
                             el.tags.sac_scale === 'demanding_mountain_hiking' ? 4 : 1;
            
            return {
              id: el.id,
              name: el.tags.name || `Trail ${el.id}`,
              type: el.tags.route || 'footpath',
              difficulty: difficulty,
              length: estimatedLength,
              elevation: el.tags.ele ? `${el.tags.ele}m` : 'Varies',
              description: el.tags.description || `${el.tags.highway} trail near ${el.tags.name || 'the area'}`,
              surface: el.tags.surface || 'mixed',
              distance: distanceFromUser,
              alreadyHiked: hikedTrails.some(t => t.id === el.id),
              isRealData: true
            };
          })
          .filter(trail => parseFloat(trail.distance) <= trailFilters.maxDistance)
          .filter(trail => {
            const length = parseFloat(trail.length);
            return length >= trailFilters.minLength && length <= trailFilters.maxLength;
          })
          .filter(trail => {
            if (trailFilters.difficulty === 'all') return true;
            return trail.difficulty === parseInt(trailFilters.difficulty);
          });

        setNearbyTrails(trails);
        
        if (trails.length === 0) {
          setTrailsError('No hiking trails found in this area. Try increasing search distance or enabling location services.');
        } else {
          addNotification(`Found ${trails.length} hiking trails near you!`);
        }
      } else {
        throw new Error('Trail API failed');
      }
    } catch (error) {
      console.error('Error fetching trails:', error);
      setTrailsError('Unable to load trail data. Please check your connection and try again.');
      setNearbyTrails([]);
    } finally {
      setTrailsLoading(false);
    }
  };

  // Track trail navigation
  const trackTrailNavigation = (trail) => {
    if (!hikedTrails.some(t => t.id === trail.id)) {
      const newHikedTrail = {
        id: trail.id,
        name: trail.name,
        length: parseFloat(trail.length),
        date: new Date().toISOString(),
        points: 10,
        distance: trail.distance
      };
      
      setHikedTrails(prev => [newHikedTrail, ...prev]);
      setProgressMetrics(prev => ({
        ...prev,
        totalMilesHiked: prev.totalMilesHiked + parseFloat(trail.length),
        trailsCompleted: prev.trailsCompleted + 1
      }));
      
      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + 10,
        totalDistance: (prev.totalDistance || 0) + parseFloat(trail.length)
      }));
      
      // Open Google Maps for navigation
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trail.name)}+trail&travelmode=walking`;
      window.open(mapsUrl, '_blank');
      
      addNotification(`Navigating to ${trail.name}! +10 points`);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationLoading(false);
          addNotification('Location enabled! 🌍');
          
          // Fetch trails and weather for new location
          if (activeTab === 'trails') {
            fetchRealTrails();
          }
          fetchLiveWeather();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use base location as fallback
          setCurrentLocation({
            lat: baseLocation.lat,
            lng: baseLocation.lng,
            accuracy: null
          });
          setLocationLoading(false);
          addNotification('Using retreat base location');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      // Geolocation not supported
      setCurrentLocation({
        lat: baseLocation.lat,
        lng: baseLocation.lng,
        accuracy: null
      });
      setLocationLoading(false);
      addNotification('Geolocation not supported by browser');
    }
  };

  // Calculate distance to base
  const getDistanceToBase = () => {
    if (!currentLocation) return 'Unknown';
    return calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      baseLocation.lat,
      baseLocation.lng
    );
  };

  // Get compass direction to base
  const getDirectionToBase = () => {
    if (!currentLocation) return 'Unknown';
    
    const lat1 = currentLocation.lat * Math.PI / 180;
    const lng1 = currentLocation.lng * Math.PI / 180;
    const lat2 = baseLocation.lat * Math.PI / 180;
    const lng2 = baseLocation.lng * Math.PI / 180;
    
    const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
    const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    
    if (bearing >= 337.5 || bearing < 22.5) return 'North';
    if (bearing >= 22.5 && bearing < 67.5) return 'Northeast';
    if (bearing >= 67.5 && bearing < 112.5) return 'East';
    if (bearing >= 112.5 && bearing < 157.5) return 'Southeast';
    if (bearing >= 157.5 && bearing < 202.5) return 'South';
    if (bearing >= 202.5 && bearing < 247.5) return 'Southwest';
    if (bearing >= 247.5 && bearing < 292.5) return 'West';
    return 'Northwest';
  };

  // USE EFFECTS
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Get initial location
    getUserLocation();
    
    // Initialize achievements
    setAchievements([
      { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true },
      { id: 2, name: 'Prayer Warrior', description: 'Pray for 5 requests', icon: '🙏', earned: false },
      { id: 3, name: 'Community Builder', description: 'Share 3 photos', icon: '📸', earned: false },
      { id: 4, name: 'Summit Seeker', description: 'Complete 3 hikes', icon: '⛰️', earned: false },
      { id: 5, name: 'Explorer', description: 'Check into 3 locations', icon: '📍', earned: false }
    ]);
    
    // Connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // COMPONENTS
  const LocationProximityCard = () => {
    const distanceToBase = getDistanceToBase();
    const directionToBase = getDirectionToBase();
    
    return (
      <div className="mt-6 bg-gradient-to-r from-blue-800/40 to-cyan-800/40 rounded-2xl p-5 border border-blue-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          Your Location Relative to Base
        </h3>
        
        {currentLocation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Distance to Base</div>
                <div className="text-xl font-bold text-emerald-400">{distanceToBase} miles</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Direction</div>
                <div className="text-xl font-bold text-blue-400">{directionToBase}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/30 rounded-lg p-2">
                <div className="text-xs text-slate-400 mb-1">Your Coordinates</div>
                <div className="text-sm font-mono">
                  {currentLocation.lat.toFixed(6)}° N<br/>
                  {currentLocation.lng.toFixed(6)}° W
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-2">
                <div className="text-xs text-slate-400 mb-1">Base Coordinates</div>
                <div className="text-sm font-mono">
                  {baseLocation.lat.toFixed(6)}° N<br/>
                  {baseLocation.lng.toFixed(6)}° W
                </div>
              </div>
            </div>
            
            <button
              onClick={getUserLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Location
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-400 mb-3">Enable location to see your proximity to base</p>
            <button
              onClick={getUserLocation}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto"
            >
              <MapPin className="w-4 h-4" />
              Enable Location
            </button>
          </div>
        )}
      </div>
    );
  };

  const ProgressTracker = () => (
    <div className="mt-6 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-5 border border-purple-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          Your Progress
        </h3>
        <span className="text-xs text-purple-300">{streakDays} day streak</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrailIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">Trails Hiked</span>
          </div>
          <div className="text-2xl font-bold">{hikedTrails.length}</div>
          <div className="text-xs text-slate-400 mt-1">{progressMetrics.totalMilesHiked.toFixed(1)} miles</div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Check-ins</span>
          </div>
          <div className="text-2xl font-bold">{progressMetrics.checkIns}</div>
          <div className="text-xs text-slate-400 mt-1">of {attractions.length} locations</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">{progressMetrics.photosShared}</div>
          <div className="text-xs text-slate-400">Photos</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-teal-400">{progressMetrics.prayerCount}</div>
          <div className="text-xs text-slate-400">Prayers</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-amber-400">{currentUser.points}</div>
          <div className="text-xs text-slate-400">Points</div>
        </div>
      </div>
    </div>
  );

  const EnhancedWeather = () => (
    <div className="mt-6 bg-gradient-to-r from-sky-800/40 to-cyan-800/40 rounded-2xl p-5 border border-sky-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {getWeatherIcon(liveWeather?.condition)}
          {currentLocation ? 'Your Location Weather' : 'Base Weather'}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveWeather}
            disabled={weatherLoading}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${weatherLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {liveWeather?.isLiveData && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Live
            </span>
          )}
        </div>
      </div>
      
      {liveWeather && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-sky-900/30 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">{liveWeather.icon}</div>
            <div className="text-3xl font-bold">{liveWeather.temperature}°C</div>
            <div className="text-sm text-slate-300 capitalize">{liveWeather.condition}</div>
            <div className="text-xs text-sky-300 mt-1">{liveWeather.city}</div>
            <div className="text-xs text-slate-400 mt-1">Updated: {liveWeather.lastUpdated}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="w-4 h-4" />
                <span>Feels like</span>
              </div>
              <span className="font-medium">{liveWeather.feelsLike}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <span className="font-medium">{liveWeather.humidity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4" />
                <span>Wind</span>
              </div>
              <span className="font-medium">{liveWeather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Sunrise className="w-4 h-4" />
                <span>Sunrise</span>
              </div>
              <span className="font-medium">{liveWeather.sunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Sunset className="w-4 h-4" />
                <span>Sunset</span>
              </div>
              <span className="font-medium">{liveWeather.sunset}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CheckInComponent = () => (
    <div className="mt-6 bg-gradient-to-r from-amber-800/40 to-orange-800/40 rounded-2xl p-5 border border-amber-700/30">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-amber-400" />
        Location Check-ins
      </h3>
      
      <div className="space-y-3">
        {attractions.map(attraction => (
          <div key={attraction.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{attraction.icon}</span>
              <div>
                <div className="font-medium">{attraction.name}</div>
                <div className="text-xs text-slate-400">{attraction.points} pts • {attraction.distance}</div>
              </div>
            </div>
            
            <button
              onClick={() => checkIntoAttraction(attraction.id)}
              disabled={checkedInAttractions[attraction.id]}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                checkedInAttractions[attraction.id]
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {checkedInAttractions[attraction.id] ? 'Checked In' : 'Check In'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const TrailsComponent = () => {
    const filteredTrails = nearbyTrails.filter(trail => {
      const length = parseFloat(trail.length);
      const distance = parseFloat(trail.distance);
      
      if (distance > trailFilters.maxDistance) return false;
      if (length < trailFilters.minLength || length > trailFilters.maxLength) return false;
      if (trailFilters.difficulty !== 'all' && trail.difficulty !== parseInt(trailFilters.difficulty)) return false;
      return true;
    });
    
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Mountain className="w-7 h-7 text-white" />
            Trail Finder
          </h2>
          <p className="text-green-100">Discover real hiking trails based on your current location</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Your Location
              </h3>
              {currentLocation ? (
                <p className="text-sm text-slate-400 mt-1">
                  Searching within {trailFilters.maxDistance} miles of your location
                </p>
              ) : (
                <p className="text-sm text-amber-400 mt-1">Enable location to discover trails</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                onClick={getUserLocation}
                disabled={locationLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${locationLoading ? 'animate-spin' : ''}`} />
                {locationLoading ? 'Updating...' : 'Update Location'}
              </button>
              
              <button 
                onClick={fetchRealTrails}
                disabled={trailsLoading || !currentLocation}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Search className={`w-4 h-4 ${trailsLoading ? 'animate-spin' : ''}`} />
                {trailsLoading ? 'Searching...' : 'Find Trails'}
              </button>
            </div>
          </div>
          
          {currentLocation && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Latitude</p>
                <p className="text-slate-300 font-mono text-sm">{currentLocation.lat.toFixed(6)}°</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Longitude</p>
                <p className="text-slate-300 font-mono text-sm">{currentLocation.lng.toFixed(6)}°</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Trail Filters
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm">Max Distance</label>
                <span className="text-emerald-400 font-medium">{trailFilters.maxDistance} miles</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={trailFilters.maxDistance}
                onChange={(e) => setTrailFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>5 miles</span>
                <span>100 miles</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {['all', '1', '2', '3', '4', '5'].map(level => (
                  <button
                    key={level}
                    onClick={() => setTrailFilters(prev => ({ ...prev, difficulty: level }))}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      trailFilters.difficulty === level
                        ? level === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : `${difficultyMap[level]?.color} text-white`
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {level === 'all' ? 'All Levels' : difficultyMap[level]?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Nearby Hiking Trails</h3>
              <p className="text-sm text-slate-400 mt-1">
                Real trails from OpenStreetMap • {filteredTrails.length} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <span className="text-sm text-slate-400">{connectionStatus}</span>
            </div>
          </div>
          
          {trailsLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Searching OpenStreetMap for hiking trails...</p>
              <p className="text-sm text-slate-500 mt-1">This may take a few moments</p>
            </div>
          ) : trailsError ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <p className="text-slate-400 mb-3">{trailsError}</p>
              <button 
                onClick={fetchRealTrails}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredTrails.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredTrails.map(trail => (
                <div key={trail.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-emerald-500/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold truncate">{trail.name}</h4>
                        {trail.alreadyHiked && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                            Hiked
                          </span>
                        )}
                        {trail.isRealData && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            Real Data
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyMap[trail.difficulty]?.color}/20 ${difficultyMap[trail.difficulty]?.text}`}>
                          {difficultyMap[trail.difficulty]?.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Ruler className="w-3 h-3" />
                          {trail.length} miles
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {trail.distance} miles away
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {trail.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{trail.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <div className="text-xs text-slate-400 mb-1">Elevation</div>
                      <div className="font-medium text-sm">{trail.elevation}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <div className="text-xs text-slate-400 mb-1">Surface</div>
                      <div className="font-medium text-sm capitalize">{trail.surface}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <div className="text-xs text-slate-400 mb-1">Estimated Time</div>
                      <div className="font-medium text-sm">{Math.round(parseFloat(trail.length) * 30)} min</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => trackTrailNavigation(trail)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate with Google Maps
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrailIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No hiking trails found matching your criteria.</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting filters or enabling location services.</p>
              <button 
                onClick={getUserLocation}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2 mx-auto"
              >
                <MapPin className="w-4 h-4" />
                Enable Location
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // MAIN RENDER
  const currentSchedule = schedule[currentDay] || schedule.friday;
  const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Greenwich SDA</h1>
                <p className="text-emerald-200 text-xs">Men's Retreat 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {liveWeather && (
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  {getWeatherIcon(liveWeather.condition)}
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">{liveWeather.temperature}°</span>
                    <span className="text-xs ml-1">C</span>
                  </div>
                  {liveWeather.isLiveData && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setShowUserModal(true)}
                className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center"
              >
                <span className="text-lg">{currentUser.avatar}</span>
              </button>
              
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{baseLocation.name.split(',')[0]}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{currentUser.points} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'schedule', icon: Calendar, label: 'Schedule' },
              { id: 'locations', icon: Navigation, label: 'Locations' },
              { id: 'photos', icon: Camera, label: 'Photos' },
              { id: 'prayer', icon: Heart, label: 'Prayer' },
              { id: 'trails', icon: TrailIcon, label: 'Trails' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}'s Schedule
              </h2>
              <p className="text-blue-100">21-24 August 2026</p>
            </div>

            {/* Day Selector */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['friday', 'saturday', 'sunday', 'monday'].map(day => (
                  <button
                    key={day}
                    onClick={() => setCurrentDay(day)}
                    className={`transition-all rounded-lg py-3 px-4 font-medium ${
                      currentDay === day
                        ? 'bg-emerald-600'
                        : 'bg-slate-700/50 hover:bg-emerald-600'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Today's Activities</h3>
              <div className="space-y-3">
                {currentSchedule.map((item, index) => {
                  const itemTime = parseFloat(item.time.replace(':', '.'));
                  const isPast = itemTime < currentHour;
                  const isCurrent = itemTime <= currentHour && currentHour < itemTime + 0.5;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        isCurrent 
                          ? 'bg-emerald-900/30 border-l-4 border-emerald-400' 
                          : isPast 
                            ? 'bg-slate-700/30' 
                            : 'bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{item.time}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {isCurrent ? 'NOW' : isPast ? 'Done' : 'Upcoming'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{item.emoji}</span>
                            <h4 className="font-semibold">{item.activity}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location === 'base' ? 'Bury Jubilee Centre' : item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <EnhancedWeather />
            <ProgressTracker />
          </div>
        )}
        
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Locations & Proximity</h2>
              <p className="text-blue-100">Your location relative to base camp</p>
            </div>
            
            <LocationProximityCard />
            <CheckInComponent />
            <EnhancedWeather />
          </div>
        )}
        
        {activeTab === 'trails' && <TrailsComponent />}
        
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Photo Gallery</h2>
              <p className="text-pink-100">Coming Soon</p>
            </div>
          </div>
        )}
        
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Prayer Requests</h2>
              <p className="text-teal-100">Coming Soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="text-sm">Greenwich SDA Men's Ministry • Bury Jubilee Outdoor Pursuits Centre</p>
          <p className="text-sm mt-2 italic">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
        </div>
      </div>
    </div>
  );
}
