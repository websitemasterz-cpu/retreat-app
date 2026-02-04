// src/App.jsx - COMPLETE VERSION WITH ALL FEATURES
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
  Plus, Minus, Search, Share as ShareIcon
} from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // STATE VARIABLES
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentDay, setCurrentDay] = useState('friday');
  const [currentLocation] = useState({ lat: 54.5262, lng: -2.9620 });
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

  // DATA STRUCTURES
  const baseLocation = {
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre',
    address: 'Glenridding, Penrith CA11 0QR, UK'
  };

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

  // COMPLETE SCHEDULE FOR ALL DAYS
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

  // DEVOTIONALS FOR ALL DAYS
  const devotionals = {
    friday: {
      title: 'Taking Charge: You Will Part the Waters',
      scripture: 'Exodus 14:13-16',
      quote: '"Do not be afraid. Stand firm and you will see the deliverance the Lord will bring you today." - Exodus 14:13',
      reflection: 'God calls men to step forward in faith even when the path seems impossible.',
      content: 'Moses stood before the Israelites as they faced the Red Sea...'
    },
    saturday: {
      title: 'Biblical Manhood: Living Under Christ\'s Lordship',
      scripture: '1 Corinthians 16:13-14',
      quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love." - 1 Corinthians 16:13-14',
      reflection: 'True strength is found in submission to Christ.',
      content: 'Biblical manhood is often misunderstood in our culture...'
    },
    sunday: {
      title: 'Fear Not, Stand Firm',
      scripture: 'Joshua 1:9',
      quote: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." - Joshua 1:9',
      reflection: 'Courage is not the absence of fear, but faith in action despite fear.',
      content: 'God spoke these words to Joshua as he was about to lead Israel...'
    },
    monday: {
      title: 'Going Forward: Living as Men of Faith',
      scripture: 'Philippians 3:13-14',
      quote: '"Forgetting what is behind and straining towards what is ahead, I press on towards the goal to win the prize for which God has called me." - Philippians 3:13-14',
      reflection: 'Retreat experiences must translate into daily obedience.',
      content: 'As our retreat comes to an end, we face the challenge...'
    }
  };

  // KITCHEN DATA
  const kitchenData = {
    friday: {
      breakfast: { menu: 'On the road', team: ['Travel Day'] },
      lunch: { menu: 'On the road', team: ['Travel Day'] },
      dinner: { menu: 'Welcome Dinner: Roast Chicken with Vegetables', team: ['Kitchen Staff', 'Volunteers'] }
    },
    saturday: {
      breakfast: { menu: 'Full English Breakfast', team: ['Team A: John, Mike, David'] },
      lunch: { menu: 'Packed Lunch: Sandwiches, Crisps, Fruit', team: ['Team A: John, Mike, David'] },
      dinner: { menu: 'Spaghetti Bolognese with Garlic Bread', team: ['Team B: Peter, James, Andrew'] }
    },
    sunday: {
      breakfast: { menu: 'Continental Breakfast', team: ['Team B: Peter, James, Andrew'] },
      lunch: { menu: 'Trail Snacks Provided', team: ['Team B: Peter, James, Andrew'] },
      dinner: { menu: 'Sunday Roast: Beef, Yorkshire Puddings', team: ['Team C: Thomas, Matthew, Simon'] }
    },
    monday: {
      breakfast: { menu: 'Breakfast Buffet', team: ['Team C: Thomas, Matthew, Simon'] },
      lunch: { menu: 'Sandwiches and Soup', team: ['Team C: Thomas, Matthew, Simon'] },
      dinner: { menu: 'On the road', team: ['Travel Day'] }
    }
  };

  // SAMPLE TRAILS DATA
  const sampleTrails = [
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
      alreadyHiked: false
    },
    {
      id: 2,
      name: 'Forest Loop Trail',
      type: 'hiking',
      difficulty: 2,
      length: '3.6',
      elevation: '180m',
      description: 'Beautiful forest trail with wildlife spotting',
      surface: 'dirt',
      distance: '2.9',
      alreadyHiked: false
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
      alreadyHiked: false
    }
  ];

  // SAMPLE PHOTOS
  const samplePhotos = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      caption: 'Beautiful mountain view from our hike',
      timestamp: new Date().toISOString(),
      author: 'John Doe',
      likes: 5,
      comments: [
        { id: 1, author: 'Mike', text: 'Amazing view!', timestamp: new Date().toISOString() }
      ]
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      caption: 'Morning devotion at the lake',
      timestamp: new Date().toISOString(),
      author: 'Jane Smith',
      likes: 8,
      comments: []
    }
  ];

  // SAMPLE PRAYER REQUESTS
  const samplePrayerRequests = [
    {
      id: 1,
      text: 'Please pray for my family back home',
      author: 'Anonymous',
      timestamp: new Date().toISOString(),
      prayers: 3
    },
    {
      id: 2,
      text: 'Praying for strength and guidance during this retreat',
      author: 'Brother in Christ',
      timestamp: new Date().toISOString(),
      prayers: 5
    }
  ];

  // SAMPLE TESTIMONIALS
  const sampleTestimonials = [
    {
      id: 1,
      text: 'God spoke to me powerfully during the morning devotion. I feel renewed!',
      author: 'David',
      timestamp: new Date().toISOString(),
      likes: 4
    },
    {
      id: 2,
      text: 'The fellowship with other brothers has been a blessing beyond measure.',
      author: 'Peter',
      timestamp: new Date().toISOString(),
      likes: 2
    }
  ];

  // DIFFICULTY MAPPING
  const difficultyMap = {
    1: { label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-300' },
    2: { label: 'Easy/Intermediate', color: 'bg-green-500', text: 'text-green-300' },
    3: { label: 'Intermediate', color: 'bg-amber-500', text: 'text-amber-300' },
    4: { label: 'Hard', color: 'bg-orange-500', text: 'text-orange-300' },
    5: { label: 'Expert', color: 'bg-red-500', text: 'text-red-300' }
  };

  // HELPER FUNCTIONS
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

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

  const fetchLiveWeather = async () => {
    setWeatherLoading(true);
    try {
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
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-5 h-5 text-slate-300" />;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (lowerCondition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (lowerCondition.includes('snow')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          caption: photoCaption,
          timestamp: new Date().toISOString(),
          author: currentUser.name,
          likes: 0,
          comments: []
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setProgressMetrics(prev => ({ ...prev, photosShared: prev.photosShared + 1 }));
        setPhotoCaption('');
        addNotification('Photo uploaded successfully! 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  const addPrayerRequest = () => {
    if (!prayerText.trim()) return;
    
    const newRequest = {
      id: Date.now(),
      text: prayerText,
      author: currentUser.name || 'Anonymous',
      timestamp: new Date().toISOString(),
      prayers: 0
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    setProgressMetrics(prev => ({ ...prev, prayerCount: prev.prayerCount + 1 }));
    setPrayerText('');
    addNotification('Prayer request shared 🙏');
  };

  const addTestimonial = () => {
    if (!testimonialText.trim()) return;
    
    const newTestimonial = {
      id: Date.now(),
      text: testimonialText,
      author: currentUser.name || 'Brother in Christ',
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    setTestimonialText('');
    addNotification('Testimony shared 🙌');
  };

  const fetchNearbyTrails = () => {
    setTrailsLoading(true);
    setTrailsError(null);
    
    setTimeout(() => {
      const filteredTrails = sampleTrails.filter(trail => {
        if (parseFloat(trail.distance) > trailFilters.maxDistance) return false;
        const length = parseFloat(trail.length);
        if (length < trailFilters.minLength || length > trailFilters.maxLength) return false;
        if (trailFilters.difficulty !== 'all' && trail.difficulty !== parseInt(trailFilters.difficulty)) return false;
        return true;
      });
      
      setNearbyTrails(filteredTrails);
      setTrailsLoading(false);
      
      if (filteredTrails.length === 0) {
        setTrailsError('No trails found matching your criteria.');
      } else {
        addNotification(`Found ${filteredTrails.length} nearby trails!`);
      }
    }, 1000);
  };

  const trackTrailNavigation = (trail) => {
    if (!hikedTrails.some(t => t.id === trail.id)) {
      const newHikedTrail = {
        id: trail.id,
        name: trail.name,
        length: parseFloat(trail.length),
        date: new Date().toISOString(),
        points: 10
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
      
      addNotification(`Started navigation to ${trail.name}! +10 points`);
    }
  };

  // COMPONENTS
  const DaySelector = () => (
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
  );

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
          <div className="text-xs text-slate-400 mt-1">of 5 locations</div>
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
          Live Weather
        </h3>
        <button 
          onClick={fetchLiveWeather}
          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>
      
      {liveWeather && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-sky-900/30 rounded-xl p-4 text-center">
            <div className="text-4xl mb-2">{liveWeather.icon}</div>
            <div className="text-3xl font-bold">{liveWeather.temperature}°C</div>
            <div className="text-sm text-slate-300 capitalize">{liveWeather.condition}</div>
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
                <div className="text-xs text-slate-400">{attraction.points} pts</div>
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

  const EmergencyFeatures = () => (
    <div className="mt-6 bg-gradient-to-r from-red-800/40 to-rose-800/40 rounded-2xl p-5 border border-red-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          Safety & Emergency
        </h3>
        <span className="text-xs text-red-300">Tap to call</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4" />
            <div>
              <div className="font-medium">Retreat Leader</div>
              <div className="text-sm text-red-300">Emergency Contact</div>
            </div>
          </div>
          <div className="text-red-400 font-mono text-sm">+44 7911 123456</div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4" />
            <div>
              <div className="font-medium">Mountain Rescue</div>
              <div className="text-sm text-red-300">Emergency Services</div>
            </div>
          </div>
          <div className="text-red-400 font-mono text-sm">999</div>
        </div>
      </div>
    </div>
  );

  const DevotionalComponent = () => {
    const devotional = devotionals[currentDay] || devotionals.friday;
    
    return (
      <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-6 border border-purple-700/30">
        <h3 className="text-lg font-semibold mb-4">Today's Devotional</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold mb-2">{devotional.title}</h4>
            <p className="text-sm text-purple-300">{devotional.scripture}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg italic">
            "{devotional.quote}"
          </div>
          <div className="text-slate-300">
            <p className="mb-2">Reflection:</p>
            <p>{devotional.reflection}</p>
          </div>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            Read Full Devotional →
          </button>
        </div>
      </div>
    );
  };

  const KitchenComponent = () => {
    const dayData = kitchenData[currentDay] || kitchenData.friday;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Kitchen & Dining</h2>
          <p className="text-orange-100">{currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}'s Menu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-400" />
              Breakfast
            </h3>
            <p className="text-slate-300 mb-3">{dayData.breakfast.menu}</p>
            <div className="text-sm text-emerald-300">
              Team: {dayData.breakfast.team.join(', ')}
            </div>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              Lunch
            </h3>
            <p className="text-slate-300 mb-3">{dayData.lunch.menu}</p>
            <div className="text-sm text-emerald-300">
              Team: {dayData.lunch.team.join(', ')}
            </div>
          </div>
          
          <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              Dinner
            </h3>
            <p className="text-slate-300 mb-3">{dayData.dinner.menu}</p>
            <div className="text-sm text-emerald-300">
              Team: {dayData.dinner.team.join(', ')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PhotosComponent = () => {
    const displayPhotos = photos.length > 0 ? photos : samplePhotos;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Photo Gallery</h2>
          <p className="text-pink-100">Share and view retreat memories</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Share Your Photos</h3>
              <p className="text-sm text-slate-400">Upload photos from the retreat</p>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Add a caption..."
                className="bg-slate-700/50 rounded-lg px-4 py-2 text-sm"
              />
              <label className="cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPhotos.map(photo => (
              <div key={photo.id} className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600">
                <img 
                  src={photo.src} 
                  alt={photo.caption}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-slate-300 mb-2">{photo.caption}</p>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>by {photo.author}</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{photo.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PrayerComponent = () => {
    const displayRequests = prayerRequests.length > 0 ? prayerRequests : samplePrayerRequests;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Prayer Requests</h2>
          <p className="text-teal-100">Share and pray for one another</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Share a Prayer Request</h3>
          <div className="space-y-4 mb-6">
            <textarea
              value={prayerText}
              onChange={(e) => setPrayerText(e.target.value)}
              placeholder="Share what's on your heart..."
              className="w-full bg-slate-700/50 rounded-xl p-4 min-h-[120px] resize-none"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={addPrayerRequest}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-medium"
              >
                Share Request
              </button>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Prayer Requests</h3>
          <div className="space-y-4">
            {displayRequests.map(request => (
              <div key={request.id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
                <p className="text-slate-300 mb-3">{request.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">by {request.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
                      <Heart className="w-4 h-4" />
                      <span>Pray ({request.prayers})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TestimonialsComponent = () => {
    const displayTestimonials = testimonials.length > 0 ? testimonials : sampleTestimonials;
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Shared Stories</h2>
          <p className="text-amber-100">Testimonies and experiences from the retreat</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Share Your Story</h3>
          <div className="space-y-4 mb-6">
            <textarea
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              placeholder="Share how God is working during this retreat..."
              className="w-full bg-slate-700/50 rounded-xl p-4 min-h-[120px] resize-none"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={addTestimonial}
                className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-lg font-medium"
              >
                Share Story
              </button>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Recent Stories</h3>
          <div className="space-y-4">
            {displayTestimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
                <p className="text-slate-300 mb-3 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">— {testimonial.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                      <Heart className="w-4 h-4" />
                      <span>{testimonial.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TrailsComponent = () => {
    const displayTrails = nearbyTrails.length > 0 ? nearbyTrails : sampleTrails;
    
    return (
      <div className="space-y-6 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Mountain className="w-7 h-7 text-white" />
            Trail Finder
          </h2>
          <p className="text-green-100">Discover hiking trails near you</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-5 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                Trail Filters
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Search within {trailFilters.maxDistance} miles
              </p>
            </div>
            
            <button 
              onClick={fetchNearbyTrails}
              disabled={trailsLoading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${trailsLoading ? 'animate-spin' : ''}`} />
              {trailsLoading ? 'Searching...' : 'Find Trails'}
            </button>
          </div>
          
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
            <h3 className="text-lg font-semibold">Nearby Trails</h3>
            <span className="text-sm text-slate-400">{displayTrails.length} trails found</span>
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
            </div>
          ) : (
            <div className="space-y-4">
              {displayTrails.map(trail => (
                <div key={trail.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold">{trail.name}</h4>
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
                  
                  <p className="text-slate-300 text-sm mb-4">{trail.description}</p>
                  
                  <button
                    onClick={() => trackTrailNavigation(trail)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    Start Navigation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // USE EFFECTS
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Initialize data
    fetchLiveWeather();
    setAchievements([
      { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true },
      { id: 2, name: 'Prayer Warrior', description: 'Pray for 5 requests', icon: '🙏', earned: false },
      { id: 3, name: 'Community Builder', description: 'Share 3 photos', icon: '📸', earned: false }
    ]);
    
    // Initialize sample data
    setNearbyTrails(sampleTrails);
    setPhotos(samplePhotos);
    setPrayerRequests(samplePrayerRequests);
    setTestimonials(sampleTestimonials);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  <span className="text-xl font-bold">{liveWeather.temperature}°</span>
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
              <span>Bury Jubilee Centre, Glenridding</span>
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
              { id: 'kitchen', icon: CoffeeIcon, label: 'Kitchen' },
              { id: 'devotional', icon: Book, label: 'Devotional' },
              { id: 'photos', icon: Camera, label: 'Photos' },
              { id: 'prayer', icon: Heart, label: 'Prayer' },
              { id: 'testimonials', icon: MessageCircle, label: 'Stories' },
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

            <DaySelector />

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

            <DevotionalComponent />
            <EnhancedWeather />
            <CheckInComponent />
            <EmergencyFeatures />
            <ProgressTracker />
          </div>
        )}
        
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Locations & Attractions</h2>
              <p className="text-blue-100">Explore the Lake District</p>
            </div>
            
            <CheckInComponent />
            <EnhancedWeather />
            <EmergencyFeatures />
          </div>
        )}
        
        {activeTab === 'kitchen' && <KitchenComponent />}
        {activeTab === 'devotional' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Daily Devotionals</h2>
              <p className="text-purple-100">Spiritual nourishment for the retreat</p>
            </div>
            <DevotionalComponent />
          </div>
        )}
        
        {activeTab === 'photos' && <PhotosComponent />}
        {activeTab === 'prayer' && <PrayerComponent />}
        {activeTab === 'testimonials' && <TestimonialsComponent />}
        {activeTab === 'trails' && <TrailsComponent />}
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

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-slate-800 w-full max-w-sm h-full border-l border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div key={notification.id} className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-200">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mb-3">
                <span>{currentUser.avatar}</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-slate-400">Level {currentUser.level} Explorer</p>
                <div className="flex items-center gap-2 mt-2 justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{currentUser.points} points</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{progressMetrics.photosShared}</div>
                <div className="text-sm text-slate-400">Photos</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-teal-400">{progressMetrics.prayerCount}</div>
                <div className="text-sm text-slate-400">Prayers</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{hikedTrails.length}</div>
                <div className="text-sm text-slate-400">Trails</div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowUserModal(false);
                addNotification('Profile saved! ✅');
              }}
              className="w-full bg-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="text-sm">Greenwich SDA Men's Ministry</p>
          <p className="text-sm mt-2 italic">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
        </div>
      </div>
    </div>
  );
}
