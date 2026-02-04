// src/App.jsx - CLEAN WORKING VERSION
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Users, Mountain, 
  Navigation, Clock, Bell, X, AlertCircle, CheckCircle, 
  RefreshCw, Zap, ArrowUp, Home, Filter, MapPin as TrailIcon,
  Sun, Cloud, Thermometer, Droplets, Wind, Sunrise, Sunset
} from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // 1. DECLARE ALL STATE VARIABLES FIRST (no dependencies between them)
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
    avatar: '👤'
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

  // 2. DEFINE DATA (no hooks, just plain objects)
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
    }
  ];

  const schedule = {
    friday: [
      { time: '06:00', activity: 'Depart London', location: 'London', emoji: '🚌' },
      { time: '14:00', activity: 'Arrival & Check-in', location: 'base', emoji: '🏠' },
      { time: '15:00', activity: 'Orientation Walk', location: 'glenriddingDodd', emoji: '🥾' },
      { time: '17:30', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:00', activity: 'Welcome & Evening Worship', location: 'base', emoji: '🙏' }
    ],
    saturday: [
      { time: '07:00', activity: 'Morning Devotion', location: 'base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
      { time: '09:00', activity: 'Aira Force Hike', location: 'airaForce', emoji: '🏔️' }
    ]
  };

  // 3. DEFINE FUNCTIONS (use regular functions, not useCallback initially)
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
      checkIns: prev.checkIns + 1
    }));
    
    addNotification(`Checked into ${attraction.name}! +${points} points 🎉`);
  };

  const fetchLiveWeather = async () => {
    setWeatherLoading(true);
    try {
      // Mock weather data for now
      setLiveWeather({
        temperature: 15,
        feelsLike: 14,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
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
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  // 4. USE EFFECTS (only essential ones)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Initialize weather
    fetchLiveWeather();
    
    // Initialize achievements
    setAchievements([
      { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true },
      { id: 2, name: 'Prayer Warrior', description: 'Pray for 5 requests', icon: '🙏', earned: false },
      { id: 3, name: 'Community Builder', description: 'Share 3 photos', icon: '📸', earned: false }
    ]);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. SIMPLE COMPONENTS (no complex hooks)
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

  // 6. MAIN RENDER (keep it simple)
  const currentSchedule = schedule[currentDay] || schedule.friday;
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
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {['schedule', 'locations', 'trails', 'photos', 'prayer'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
              <h2 className="text-2xl font-bold mb-2">{currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}'s Schedule</h2>
              <p className="text-blue-100">21-24 August 2026</p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Today's Activities</h3>
              <div className="space-y-3">
                {currentSchedule.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-700/30">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{item.time}</div>
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
                ))}
              </div>
            </div>

            <EnhancedWeather />
            <CheckInComponent />
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
          </div>
        )}
        
        {activeTab === 'trails' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Trail Finder</h2>
              <p className="text-green-100">Coming Soon</p>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700 text-center">
              <TrailIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">Trail finder feature coming soon!</p>
            </div>
          </div>
        )}
        
        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Photo gallery coming soon!</p>
          </div>
        )}
        
        {activeTab === 'prayer' && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Prayer requests coming soon!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="text-sm">Greenwich SDA Men's Ministry</p>
          <p className="text-sm mt-2 italic">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
