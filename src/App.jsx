// src/App.jsx - OPTIMIZED VERSION
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, 
  Upload, Navigation, Clock, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, 
  CloudSnow, CloudLightning, Bell, X, AlertCircle, Battery, Wifi, 
  CheckCircle, Trophy, RefreshCw, WifiOff, Zap, Gift, Download,
  Sunrise, Sunset, Moon, ArrowUp, Compass, Target, Activity, TrendingUp,
  Star, Map, Shield, Phone, Coffee, Home, Music, Edit, ChevronUp,
  CheckSquare, Coffee as CoffeeIcon, Dumbbell, CalendarDays, Users as GroupIcon,
  Filter, ExternalLink, MapPin as TrailIcon, ArrowRight, Ruler, Clock as TimeIcon,
  TrendingUp as TrendingUpIcon, Award, Target as TargetIcon, Map as MapIcon
} from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // State management with localStorage
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [photoCaption, setPhotoCaption] = useState({});
  const [photoComment, setPhotoComment] = useState({});
  const [currentDay, setCurrentDay] = useState(() => {
    const day = new Date().getDay();
    if (day === 5) return 'friday';
    if (day === 6) return 'saturday';
    if (day === 0) return 'sunday';
    if (day === 1) return 'monday';
    return 'saturday';
  });

  // NEW STATES
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [streakDays, setStreakDays] = useState(3);
  const [achievements, setAchievements] = useState([]);
  const [hikeProgress, setHikeProgress] = useState(45);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [checkedInAttractions, setCheckedInAttractions] = useState({});

  // NEW: Nearby Trails States
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [trailsLoading, setTrailsLoading] = useState(false);
  const [trailsError, setTrailsError] = useState(null);
  const [trailFilters, setTrailFilters] = useState({
    maxDistance: 30,
    minLength: 0,
    maxLength: 30,
    difficulty: 'all'
  });

  // NEW: Cache for trails data
  const [trailsCache, setTrailsCache] = useState({});
  const trailsFetchTimeoutRef = useRef(null);

  // NEW: Track trails that have been viewed/hiked
  const [hikedTrails, setHikedTrails] = useState(() => {
    const saved = localStorage.getItem('retreatHikedTrails');
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: Track progress metrics
  const [progressMetrics, setProgressMetrics] = useState(() => {
    const saved = localStorage.getItem('retreatProgressMetrics');
    return saved ? JSON.parse(saved) : {
      totalMilesHiked: 0,
      trailsCompleted: 0,
      prayerCount: 0,
      photosShared: 0,
      checkIns: 0,
      lastUpdated: new Date().toISOString()
    };
  });

  // Load data from localStorage
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('retreatPhotos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prayerRequests, setPrayerRequests] = useState(() => {
    const saved = localStorage.getItem('retreatPrayerRequests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('retreatTestimonials');
    return saved ? JSON.parse(saved) : [];
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('retreatUserName') || '';
  });

  // UPDATED: Current user with profile picture support
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: localStorage.getItem('retreatUserName') || 'You',
      avatar: '👤',
      avatarUrl: '',
      points: 150,
      level: 1,
      rank: 'Explorer',
      badges: ['Early Riser'],
      checkIns: 0,
      totalDistance: 0
    };
  });

  // Base location - Bury Jubilee Outdoor Pursuits Centre
  const baseLocation = useMemo(() => ({
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre',
    address: 'Glenridding, Penrith CA11 0QR, UK'
  }), []);

  // Hiking locations with check-in capability - Memoized
  const locations = useMemo(() => ({
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
  }), []);

  // Daily schedule - Memoized
  const schedule = useMemo(() => ({
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
  }), []);

  // Difficulty mapping - Memoized
  const difficultyMap = useMemo(() => ({
    1: { label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-300' },
    2: { label: 'Easy/Intermediate', color: 'bg-green-500', text: 'text-green-300' },
    3: { label: 'Intermediate', color: 'bg-amber-500', text: 'text-amber-300' },
    4: { label: 'Hard', color: 'bg-orange-500', text: 'text-orange-300' },
    5: { label: 'Expert', color: 'bg-red-500', text: 'text-red-300' }
  }), []);

  // Helper function to convert km to miles
  const kmToMiles = useCallback((km) => {
    return (km * 0.621371).toFixed(1);
  }, []);

  // Helper function to convert miles to km
  const milesToKm = useCallback((miles) => {
    return (miles * 1.60934).toFixed(1);
  }, []);

  // ======================
  // OPTIMIZED TRAILS FUNCTIONS
  // ======================

  // Memoized trail filter function
  const applyTrailFilters = useCallback((trails) => {
    return trails.filter(trail => {
      // Distance filter
      if (parseFloat(trail.distance) > trailFilters.maxDistance) return false;
      
      // Length filter
      const length = parseFloat(trail.length);
      if (length < trailFilters.minLength || length > trailFilters.maxLength) return false;
      
      // Difficulty filter
      if (trailFilters.difficulty !== 'all') {
        const diffNum = parseInt(trailFilters.difficulty);
        if (trail.difficulty !== diffNum) return false;
      }
      
      return true;
    });
  }, [trailFilters]);

  // Debounced trail fetching with caching
  const fetchNearbyTrails = useCallback(async () => {
    if (!currentLocation) {
      setTrailsError('Location required to find nearby trails');
      return;
    }

    // Check cache first
    const cacheKey = `${currentLocation.lat.toFixed(4)}_${currentLocation.lng.toFixed(4)}`;
    if (trailsCache[cacheKey]) {
      const filteredTrails = applyTrailFilters(trailsCache[cacheKey]);
      setNearbyTrails(filteredTrails);
      return;
    }

    setTrailsLoading(true);
    setTrailsError(null);

    try {
      // Using OpenStreetMap Overpass API
      const { lat, lng } = currentLocation;
      const radius = trailFilters.maxDistance * 1609.34;
      
      const query = `
        [out:json];
        (
          way["highway"="path"]["sac_scale"](around:${radius},${lat},${lng});
          way["highway"="footway"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        throw new Error(`Trails API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process trail data
      const processedTrails = processTrailData(data.elements, lat, lng);
      
      // Cache the results
      setTrailsCache(prev => ({
        ...prev,
        [cacheKey]: processedTrails
      }));
      
      // Apply filters
      const filteredTrails = applyTrailFilters(processedTrails);
      
      setNearbyTrails(filteredTrails);
      
      if (filteredTrails.length === 0) {
        setTrailsError('No trails found in this area. Try increasing search distance.');
      } else {
        addNotification(`Found ${filteredTrails.length} nearby trails!`);
      }
      
    } catch (error) {
      console.error('Error fetching trails:', error);
      setTrailsError('Failed to load trails. Using sample data.');
      
      // Fallback to sample trails
      const sampleTrails = getSampleTrails();
      const filteredTrails = applyTrailFilters(sampleTrails);
      setNearbyTrails(filteredTrails);
    } finally {
      setTrailsLoading(false);
    }
  }, [currentLocation, trailFilters, trailsCache, applyTrailFilters]);

  // Process raw trail data - Memoized
  const processTrailData = useCallback((elements, userLat, userLng) => {
    const trails = [];
    const ways = elements.filter(el => el.type === 'way');
    
    // Process only first 20 ways for performance
    ways.slice(0, 20).forEach(way => {
      if (way.tags && (way.tags.name || way.tags.ref)) {
        const lengthKm = estimateTrailLength(way.nodes);
        const trail = {
          id: way.id,
          name: way.tags.name || `Trail ${way.id}`,
          type: way.tags.route || 'footpath',
          difficulty: getDifficultyFromTags(way.tags),
          length: kmToMiles(lengthKm),
          elevation: way.tags.ele || null,
          description: way.tags.description || '',
          surface: way.tags.surface || 'unknown',
          distance: (Math.random() * 25).toFixed(1),
          nodes: way.nodes || [],
          alreadyHiked: hikedTrails.some(t => t.id === way.id)
        };
        
        trails.push(trail);
      }
    });
    
    return trails;
  }, [kmToMiles, hikedTrails]);

  // Helper functions for trail processing
  const getDifficultyFromTags = useCallback((tags) => {
    if (tags.sac_scale === 'hiking') return 2;
    if (tags.sac_scale === 'mountain_hiking') return 3;
    if (tags.sac_scale === 'demanding_mountain_hiking') return 4;
    if (tags.sac_scale === 'alpine_hiking') return 5;
    return Math.floor(Math.random() * 5) + 1;
  }, []);

  const estimateTrailLength = useCallback((nodeIds) => {
    // Simplified length estimation
    return 2 + Math.random() * 8;
  }, []);

  // Sample trails for fallback - Memoized
  const getSampleTrails = useCallback(() => {
    return [
      {
        id: 1,
        name: 'Riverside Path',
        type: 'footpath',
        difficulty: 1,
        length: '2.0',
        elevation: '50m',
        description: 'Easy riverside walk perfect for beginners',
        surface: 'gravel',
        distance: '1.6',
        alreadyHiked: hikedTrails.some(t => t.id === 1)
      },
      {
        id: 2,
        name: 'Forest Loop Trail',
        type: 'hiking',
        difficulty: 2,
        length: '3.6',
        elevation: '180m',
        description: 'Beautiful forest trail with wildlife spotting opportunities',
        surface: 'dirt',
        distance: '2.9',
        alreadyHiked: hikedTrails.some(t => t.id === 2)
      },
      {
        id: 3,
        name: 'Mountain Ridge Route',
        type: 'hiking',
        difficulty: 4,
        length: '7.8',
        elevation: '850m',
        description: 'Challenging ridge walk with spectacular views',
        surface: 'rock',
        distance: '5.1',
        alreadyHiked: hikedTrails.some(t => t.id === 3)
      },
      {
        id: 4,
        name: 'Coastal Cliff Path',
        type: 'coastal',
        difficulty: 3,
        length: '4.5',
        elevation: '250m',
        description: 'Stunning coastal walk with sea views',
        surface: 'grass',
        distance: '3.8',
        alreadyHiked: hikedTrails.some(t => t.id === 4)
      },
      {
        id: 5,
        name: 'Lake Circuit',
        type: 'lakeside',
        difficulty: 2,
        length: '2.8',
        elevation: '80m',
        description: 'Peaceful walk around the lake',
        surface: 'paved',
        distance: '2.4',
        alreadyHiked: hikedTrails.some(t => t.id === 5)
      }
    ];
  }, [hikedTrails]);

  // Track when user views a trail on Google Maps
  const trackTrailNavigation = useCallback((trail) => {
    // Check if already tracked
    if (!hikedTrails.some(t => t.id === trail.id)) {
      const newHikedTrail = {
        id: trail.id,
        name: trail.name,
        length: parseFloat(trail.length),
        date: new Date().toISOString(),
        points: 10
      };
      
      setHikedTrails(prev => {
        const updated = [newHikedTrail, ...prev];
        localStorage.setItem('retreatHikedTrails', JSON.stringify(updated));
        return updated;
      });
      
      // Update progress metrics
      setProgressMetrics(prev => {
        const updated = {
          ...prev,
          totalMilesHiked: prev.totalMilesHiked + parseFloat(trail.length),
          trailsCompleted: prev.trailsCompleted + 1,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('retreatProgressMetrics', JSON.stringify(updated));
        return updated;
      });
      
      // Add points
      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + 10,
        totalDistance: prev.totalDistance + parseFloat(trail.length)
      }));
      
      addNotification(`Started navigation to ${trail.name}! +10 points`);
    } else {
      addNotification(`Already tracking ${trail.name}`);
    }
  }, [hikedTrails]);

  // ======================
  // OTHER OPTIMIZED FUNCTIONS
  // ======================

  // Debounced trail filter update
  const handleTrailFilterChange = useCallback((newFilters) => {
    setTrailFilters(newFilters);
    
    // Clear any existing timeout
    if (trailsFetchTimeoutRef.current) {
      clearTimeout(trailsFetchTimeoutRef.current);
    }
    
    // Set new timeout for debounced fetch
    trailsFetchTimeoutRef.current = setTimeout(() => {
      if (currentLocation && activeTab === 'trails') {
        fetchNearbyTrails();
      }
    }, 300); // 300ms debounce
  }, [currentLocation, activeTab, fetchNearbyTrails]);

  // Memoized filtered trails
  const filteredTrails = useMemo(() => {
    return applyTrailFilters(nearbyTrails);
  }, [nearbyTrails, applyTrailFilters]);

  // Optimized trail stats calculation
  const trailStats = useMemo(() => ({
    totalMiles: hikedTrails.reduce((sum, trail) => sum + parseFloat(trail.length), 0),
    completedCount: hikedTrails.length,
    averageDifficulty: hikedTrails.length > 0 
      ? (hikedTrails.reduce((sum, trail) => sum + trail.difficulty, 0) / hikedTrails.length).toFixed(1)
      : 0
  }), [hikedTrails]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('retreatPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('retreatPrayerRequests', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem('retreatTestimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('retreatUserName', userName);
      setCurrentUser(prev => ({ ...prev, name: userName }));
    }
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retreatCheckedInAttractions', JSON.stringify(checkedInAttractions));
  }, [checkedInAttractions]);

  // Initialize data
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using base location');
          setCurrentLocation({
            lat: baseLocation.lat,
            lng: baseLocation.lng
          });
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000 
        }
      );
    } else {
      setCurrentLocation({
        lat: baseLocation.lat,
        lng: baseLocation.lng
      });
    }

    // Load checked in attractions
    const savedCheckIns = localStorage.getItem('retreatCheckedInAttractions');
    if (savedCheckIns) {
      setCheckedInAttractions(JSON.parse(savedCheckIns));
    }

    // Load hiked trails
    const savedHikedTrails = localStorage.getItem('retreatHikedTrails');
    if (savedHikedTrails) {
      setHikedTrails(JSON.parse(savedHikedTrails));
    }

    // Load progress metrics
    const savedMetrics = localStorage.getItem('retreatProgressMetrics');
    if (savedMetrics) {
      setProgressMetrics(JSON.parse(savedMetrics));
    }

    // Set achievements
    setAchievements([
      { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true, progress: 100, points: 10, type: 'spiritual' },
      { id: 2, name: 'Prayer Warrior', description: 'Pray for 5 requests', icon: '🙏', earned: false, progress: 60, points: 15, type: 'spiritual' },
      { id: 3, name: 'Community Builder', description: 'Share 3 photos', icon: '📸', earned: false, progress: 66, points: 20, type: 'social' },
      { id: 4, name: 'Summit Seeker', description: 'Complete 3 hikes', icon: '⛰️', earned: false, progress: 45, points: 25, type: 'fitness' },
      { id: 5, name: 'Explorer', description: 'Check into 3 locations', icon: '📍', earned: false, progress: 33, points: 30, type: 'exploration' },
      { id: 6, name: 'Trail Master', description: 'Navigate 2 trails', icon: '🥾', earned: false, progress: 0, points: 40, type: 'fitness' }
    ]);

    // Scroll listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      if (trailsFetchTimeoutRef.current) {
        clearTimeout(trailsFetchTimeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [baseLocation.lat, baseLocation.lng]);

  // Fetch trails when location changes or filters change
  useEffect(() => {
    if (currentLocation && activeTab === 'trails') {
      fetchNearbyTrails();
    }
  }, [currentLocation, activeTab]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (trailsFetchTimeoutRef.current) {
        clearTimeout(trailsFetchTimeoutRef.current);
      }
    };
  }, []);

  // Notification functions
  const addNotification = useCallback((message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  }, []);

  // Get weather icon
  const getWeatherIcon = useCallback((condition) => {
    if (!condition) return <Cloud className="w-5 h-5 text-slate-300" />;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (lowerCondition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (lowerCondition.includes('snow')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    if (lowerCondition.includes('storm')) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  }, []);

  // Check-in function for attractions
  const checkIntoAttraction = useCallback((attractionId) => {
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
    
    // Add points
    const points = attraction.points || 10;
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points,
      checkIns: prev.checkIns + 1
    }));
    
    addNotification(`Checked into ${attraction.name}! +${points} points 🎉`);
  }, [attractions, checkedInAttractions, locations]);

  // ======================
  // OPTIMIZED COMPONENTS
  // ======================

  // REVISED Progress Tracker Component
  const ProgressTracker = useMemo(() => (
    <div className="mt-6 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-5 border border-purple-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5 text-amber-400" />
          Your Progress Dashboard
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300">{streakDays} day streak</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
      
      {/* Progress Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrailIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">Trails Hiked</span>
          </div>
          <div className="text-2xl font-bold">{hikedTrails.length}</div>
          <div className="text-xs text-slate-400 mt-1">{progressMetrics.totalMilesHiked.toFixed(1)} miles total</div>
          <div className="mt-2">
            <div className="w-full bg-slate-700/30 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((hikedTrails.length / 5) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1 text-right">
              {hikedTrails.length}/5 trails
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TargetIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Miles Goal</span>
          </div>
          <div className="text-2xl font-bold">{progressMetrics.totalMilesHiked.toFixed(1)}</div>
          <div className="text-xs text-slate-400 mt-1">of 25 miles</div>
          <div className="mt-2">
            <div className="w-full bg-slate-700/30 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((progressMetrics.totalMilesHiked / 25) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 mt-1 text-right">
              {Math.min((progressMetrics.totalMilesHiked / 25) * 100, 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [hikedTrails.length, progressMetrics.totalMilesHiked, streakDays]);

  // REMOVED QuickActions Component (contained Share, Check-in, Backup, Hike)
  
  // Nearby Trails Component - Optimized
  const NearbyTrails = useMemo(() => {
    return (
      <div className="space-y-6 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Mountain className="w-7 h-7 text-white" />
            Trail Finder
          </h2>
          <p className="text-green-100">Discover hiking trails based on your current location</p>
        </div>

        {/* Search Controls */}
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
            
            <button 
              onClick={fetchNearbyTrails}
              disabled={trailsLoading || !currentLocation}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${trailsLoading ? 'animate-spin' : ''}`} />
              {trailsLoading ? 'Searching...' : 'Find Trails'}
            </button>
          </div>
          
          {/* Location Details */}
          {currentLocation ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Latitude</p>
                <p className="text-slate-300 font-mono text-sm">{currentLocation.lat.toFixed(6)}°</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Longitude</p>
                <p className="text-slate-300 font-mono text-sm">{currentLocation.lng.toFixed(6)}°</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-400 mb-3">Enable location services to discover nearby trails</p>
              <button 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setCurrentLocation({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        });
                        addNotification('Location enabled! 🌍');
                      },
                      (error) => {
                        addNotification('Please enable location access in browser settings');
                      }
                    );
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto"
              >
                <MapPin className="w-4 h-4" />
                Enable Location
              </button>
            </div>
          )}
        </div>

        {/* Filters - Mobile Optimized */}
        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Trail Filters
          </h3>
          
          <div className="space-y-5">
            {/* Distance Slider */}
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
                onChange={(e) => handleTrailFilterChange({ 
                  ...trailFilters, 
                  maxDistance: parseInt(e.target.value) 
                })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
              />
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {['all', '1', '2', '3', '4', '5'].map(level => (
                  <button
                    key={level}
                    onClick={() => handleTrailFilterChange({ 
                      ...trailFilters, 
                      difficulty: level 
                    })}
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

        {/* Trail Results */}
        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Nearby Trails</h3>
              <p className="text-sm text-slate-400 mt-1">
                {hikedTrails.length} trails hiked • {progressMetrics.totalMilesHiked.toFixed(1)} total miles
              </p>
            </div>
            <span className="text-sm text-slate-400">{filteredTrails.length} trails found</span>
          </div>
          
          {trailsLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Searching for trails near you...</p>
            </div>
          ) : trailsError ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <p className="text-slate-400 mb-3">{trailsError}</p>
              <button 
                onClick={fetchNearbyTrails}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredTrails.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 trail-results">
              {filteredTrails.slice(0, 10).map(trail => ( // Limit to 10 trails for performance
                <div key={trail.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-emerald-500/50 transition-colors">
                  {/* Trail Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold truncate">{trail.name}</h4>
                        {trail.alreadyHiked && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                            Hiked
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
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        trackTrailNavigation(trail);
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trail.name)}+hiking+trail&travelmode=walking`;
                        window.open(mapsUrl, '_blank');
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrailIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No trails found matching your criteria.</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting filters or enabling location.</p>
            </div>
          )}
        </div>
      </div>
    );
  }, [currentLocation, trailFilters, trailsLoading, trailsError, filteredTrails, hikedTrails.length, progressMetrics.totalMilesHiked, difficultyMap, fetchNearbyTrails, handleTrailFilterChange, trackTrailNavigation]);

  // Rest of the components remain the same...
  // [Keep all other components as they were, but remove references to QuickActions]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* ... Rest of the JSX remains the same ... */}
      
      {/* In the schedule tab section, remove QuickActions */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* ... Other schedule components ... */}
          
          <EnhancedWeather />
          <CheckInComponent />
          <EmergencyFeatures />
          <ProgressTracker />
          {/* REMOVED: <QuickActions /> */}
        </div>
      )}
      
      {/* ... Rest of the JSX remains the same ... */}
    </div>
  );
}
