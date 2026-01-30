// src/App.jsx - COMPLETE VERSION WITH LIVE WEATHER & NEW FEATURES
import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, 
  Navigation, Clock, Sun, Cloud, CloudRain, Bell, X, Upload, Send, Map, 
  Thermometer, Wind, Droplets, ChevronRight, AlertCircle, Battery, Wifi, 
  Volume2, CheckCircle, Star, TrendingUp, Activity, Shield, Download, Share, 
  Filter, Search, Eye, EyeOff, Lock, Unlock, Gift, Trophy, Award, Target, 
  Coffee, Moon, Sunrise, Sunset, RefreshCw, WifiOff, Zap, BarChart, 
  Package, Map as MapIcon, Compass, Navigation2, Phone, Mail, UserCheck 
} from 'lucide-react';

// Your OpenWeatherMap API Key (GET FROM https://openweathermap.org/api)
const WEATHER_API_KEY = fb0a3cd5c57ec8df7ce77859e35f2d06; // REPLACE THIS

export default function GreenwichSDARetreatApp() {
  // Core states (same as your code)
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentDay, setCurrentDay] = useState('saturday');
  const [selectedLocation, setSelectedLocation] = useState('base');

  // NEW STATES FOR ENHANCED FEATURES
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [streakDays, setStreakDays] = useState(3);
  const [achievements, setAchievements] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [hikeProgress, setHikeProgress] = useState(45);
  const [meditationMinutes, setMeditationMinutes] = useState(15);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Current user with enhanced data
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      bg: 'bg-emerald-500',
      points: 150,
      level: 2,
      rank: 'Explorer',
    };
  });

  // Mock data
  const [allUsers] = useState([
    { id: 1, name: 'David M.', avatar: '👨‍🦰', bg: 'bg-blue-500', online: true },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', bg: 'bg-emerald-500', online: true },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', bg: 'bg-amber-500', online: false },
  ]);

  // Location data for map
  const locations = {
    base: { 
      name: 'Bury Jubilee Centre', 
      lat: 54.5262, 
      lng: -2.9620,
      description: 'Our retreat base camp',
      distance: '0 km',
      icon: '🏠',
      color: 'bg-emerald-500'
    },
    airaForce: { 
      name: 'Aira Force Waterfall', 
      lat: 54.5733, 
      lng: -2.9067,
      description: '65-foot waterfall walk',
      distance: '4.8 km',
      icon: '💧',
      color: 'bg-blue-500'
    },
    helvellyn: { 
      name: 'Helvellyn Summit', 
      lat: 54.5275, 
      lng: -3.0164,
      description: 'England\'s 3rd highest peak',
      distance: '6.5 km',
      icon: '⛰️',
      color: 'bg-amber-500'
    },
    ullswater: { 
      name: 'Ullswater Lake', 
      lat: 54.5500, 
      lng: -2.9300,
      description: 'Boat cruises & lakeside walks',
      distance: '3.2 km',
      icon: '🛥️',
      color: 'bg-indigo-500'
    }
  };

  // Schedule data for each day
  const scheduleData = {
    friday: {
      day: 'Friday',
      date: '21 Aug',
      schedule: [
        { time: '06:00', activity: 'Depart London', location: 'base', emoji: '🚌' },
        { time: '14:00', activity: 'Arrival & Check-in', location: 'base', emoji: '🏠' },
        { time: '15:00', activity: 'Orientation Walk', location: 'base', emoji: '🥾' },
        { time: '17:30', activity: 'Dinner', location: 'base', emoji: '🍽️' },
        { time: '19:00', activity: 'Welcome Worship', location: 'base', emoji: '🙏' },
      ],
      devotional: {
        title: 'Taking Charge: You Will Part the Waters',
        scripture: 'Exodus 14:13-16',
        quote: '"Do not be afraid. Stand firm and you will see the deliverance the Lord will bring you today."',
      }
    },
    saturday: {
      day: 'Saturday',
      date: '22 Aug',
      schedule: [
        { time: '07:00', activity: 'Morning Devotion', location: 'base', emoji: '📖' },
        { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
        { time: '09:00', activity: 'Aira Force & Gowbarrow Fell Hike', location: 'airaForce', emoji: '🏔️' },
        { time: '14:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
        { time: '16:00', activity: 'Optional: Ullswater Steamer', location: 'ullswater', emoji: '⛴️' },
        { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
        { time: '19:30', activity: 'Evening Worship & Discussion', location: 'base', emoji: '🙏' },
        { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
      ],
      devotional: {
        title: 'Biblical Manhood: Living Under Christ\'s Lordship',
        scripture: '1 Corinthians 16:13-14',
        quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love."',
      }
    },
    sunday: {
      day: 'Sunday',
      date: '23 Aug',
      schedule: [
        { time: '06:30', activity: 'Morning Devotion & Prayer', location: 'base', emoji: '📖' },
        { time: '07:15', activity: 'Early Breakfast', location: 'base', emoji: '🍳' },
        { time: '08:00', activity: 'HELVELLYN SUMMIT HIKE', location: 'helvellyn', emoji: '⛰️' },
        { time: '15:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
        { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
        { time: '19:30', activity: 'Evening Worship & Communion', location: 'base', emoji: '✝️' },
      ],
      devotional: {
        title: 'Fear Not, Stand Firm',
        scripture: 'Joshua 1:9',
        quote: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged."',
      }
    },
    monday: {
      day: 'Monday',
      date: '24 Aug',
      schedule: [
        { time: '07:00', activity: 'Final Morning Devotion', location: 'base', emoji: '📖' },
        { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
        { time: '09:00', activity: 'Lakeside Walk & Closing Worship', location: 'ullswater', emoji: '🚶' },
        { time: '10:30', activity: 'Pack Up & Check Out', location: 'base', emoji: '🎒' },
        { time: '12:00', activity: 'Depart for London', location: 'base', emoji: '🚌' }
      ],
      devotional: {
        title: 'Going Forward: Living as Men of Faith',
        scripture: 'Philippians 3:13-14',
        quote: '"Forgetting what is behind and straining towards what is ahead, I press on towards the goal."',
      }
    }
  };

  // Get current schedule based on selected day
  const currentSchedule = scheduleData[currentDay];

  // ======================
  // ENHANCED EFFECTS
  // ======================
  
  // Load all data on mount
  useEffect(() => {
    // Load user data
    const saved = localStorage.getItem('retreatCurrentUser');
    if (saved) setCurrentUser(JSON.parse(saved));
    
    // Load photos
    const savedPhotos = localStorage.getItem('retreatCommunityPhotos');
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    
    // Load prayers
    const savedPrayers = localStorage.getItem('retreatCommunityPrayers');
    if (savedPrayers) setPrayerRequests(JSON.parse(savedPrayers));

    // Load testimonials
    const savedTestimonials = localStorage.getItem('retreatCommunityTestimonials');
    if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));

    // Load achievements
    const savedAchievements = localStorage.getItem('retreatAchievements');
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    else setAchievements(getDefaultAchievements());

    // Load emergency contacts
    const savedContacts = localStorage.getItem('retreatEmergencyContacts');
    if (savedContacts) setEmergencyContacts(JSON.parse(savedContacts));
    else setEmergencyContacts(getDefaultContacts());

    // Get user location for weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchLiveWeather(location.lat, location.lng);
        },
        () => {
          // Default to Lake District if location denied
          fetchLiveWeather(54.5262, -2.9620);
        }
      );
    } else {
      fetchLiveWeather(54.5262, -2.9620);
    }

    // Battery monitoring
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Connection status monitoring
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Time updater
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  // Save user data
  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityPrayers', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityTestimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('retreatAchievements', JSON.stringify(achievements));
  }, [achievements]);

  // ======================
  // LIVE WEATHER FUNCTIONS
  // ======================
  
  const fetchLiveWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      // If no API key, use mock data
      if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('API key not configured');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      
      // Get forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      
      setLiveWeather({
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        icon: getWeatherIconCode(data.weather[0].id),
        forecast: processForecastData(forecastData),
        lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        city: data.name
      });
      
    } catch (error) {
      console.log('Using mock weather data:', error.message);
      setWeatherError('Using sample data - Add API key for live weather');
      setLiveWeather(getMockWeatherData());
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherIconCode = (code) => {
    if (code >= 200 && code < 300) return '⛈️';
    if (code >= 300 && code < 400) return '🌧️';
    if (code >= 500 && code < 600) return '🌧️';
    if (code >= 600 && code < 700) return '❄️';
    if (code === 800) return '☀️';
    if (code > 800) return '☁️';
    return '⛅';
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-6 h-6 text-slate-300" />;
    if (condition.includes('clear') || condition.includes('sun')) return <Sun className="w-6 h-6 text-amber-400" />;
    if (condition.includes('rain') || condition.includes('drizzle')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  const getMockWeatherData = () => ({
    temperature: 18,
    feelsLike: 16,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    sunrise: '06:45',
    sunset: '20:15',
    icon: '⛅',
    forecast: [
      { day: 'Today', high: 18, low: 12, icon: '⛅', condition: 'Partly Cloudy' },
      { day: 'Sat', high: 16, low: 11, icon: '🌧️', condition: 'Light Rain' },
      { day: 'Sun', high: 14, low: 9, icon: '☁️', condition: 'Cloudy' },
      { day: 'Mon', high: 17, low: 12, icon: '☀️', condition: 'Sunny' }
    ],
    lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    city: 'Lake District'
  });

  const processForecastData = (data) => {
    const dailyForecasts = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          day: date,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: getWeatherIconCode(item.weather[0].id),
          condition: item.weather[0].description
        };
      } else {
        dailyForecasts[date].high = Math.max(dailyForecasts[date].high, Math.round(item.main.temp_max));
        dailyForecasts[date].low = Math.min(dailyForecasts[date].low, Math.round(item.main.temp_min));
      }
    });
    
    return Object.values(dailyForecasts).slice(0, 4);
  };

  // ======================
  // NEW FEATURE FUNCTIONS
  // ======================

  const getDefaultAchievements = () => [
    { id: 1, name: 'Early Riser', description: 'Complete morning devotion for 3 days', icon: '☀️', earned: true, progress: 100 },
    { id: 2, name: 'Prayer Warrior', description: 'Pray for 5+ requests', icon: '🙏', earned: true, progress: 100 },
    { id: 3, name: 'Community Builder', description: 'Share 3 photos or stories', icon: '📸', earned: false, progress: 66 },
    { id: 4, name: 'Summit Seeker', description: 'Complete Helvellyn hike', icon: '⛰️', earned: false, progress: 45 },
    { id: 5, name: 'Encourager', description: 'Like 10+ posts', icon: '❤️', earned: false, progress: 40 },
  ];

  const getDefaultContacts = () => [
    { id: 1, name: 'Retreat Leader', phone: '+44 7911 123456', role: 'Emergency Contact' },
    { id: 2, name: 'Mountain Rescue', phone: '999', role: 'Emergency Services' },
    { id: 3, name: 'Local Hospital', phone: '+44 17684 82288', role: 'Westmorland Hospital' },
    { id: 4, name: 'Weather Alert', phone: '', role: 'Met Office: 0370 900 0100' },
  ];

  // ======================
  // CORE FUNCTIONS
  // ======================

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          timestamp: new Date().toISOString(),
          likes: 0
        };
        setPhotos(prev => [newPhoto, ...prev]);
        addNotification('New photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const addPrayerRequest = () => {
    if (!prayerText.trim()) return;
    
    const newRequest = {
      id: Date.now(),
      text: prayerText,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      prayers: 0
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    setPrayerText('');
    addNotification('Prayer request shared');
    
    // Update achievement
    setAchievements(prev => 
      prev.map(a => a.id === 2 ? { ...a, progress: Math.min(a.progress + 20, 100) } : a)
    );
  };

  const addTestimonial = () => {
    if (!testimonialText.trim()) return;
    
    const newTestimonial = {
      id: Date.now(),
      text: testimonialText,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    setTestimonialText('');
    addNotification('Testimony shared');
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const likeItem = (type, id) => {
    if (type === 'photo') {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } else if (type === 'testimonial') {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
    } else if (type === 'prayer') {
      setPrayerRequests(prev => prev.map(p => p.id === id ? { ...p, prayers: p.prayers + 1 } : p));
    }
    addNotification('You liked a post');
    
    // Update encourager achievement
    setAchievements(prev => 
      prev.map(a => a.id === 5 ? { ...a, progress: Math.min(a.progress + 10, 100) } : a)
    );
  };

  const refreshWeather = () => {
    setIsRefreshing(true);
    if (userLocation) {
      fetchLiveWeather(userLocation.lat, userLocation.lng);
    } else {
      fetchLiveWeather(54.5262, -2.9620);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const calculateDistance = (from, to) => {
    const distances = {
      'base-airaForce': '4.8 km',
      'base-helvellyn': '6.5 km',
      'base-ullswater': '3.2 km',
      'airaForce-helvellyn': '8.2 km',
      'airaForce-ullswater': '5.1 km',
      'helvellyn-ullswater': '7.3 km'
    };
    return distances[`${from}-${to}`] || '-- km';
  };

  const latestPhoto = photos[0];
  const latestPrayer = prayerRequests[0];
  const latestTestimonial = testimonials[0];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // ======================
  // NEW FEATURE COMPONENTS
  // ======================

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
        {emergencyContacts.map(contact => (
          <a
            key={contact.id}
            href={contact.phone ? `tel:${contact.phone}` : '#'}
            className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg hover:bg-red-900/40 transition-colors"
          >
            <div>
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-red-300">{contact.role}</div>
            </div>
            {contact.phone && (
              <div className="text-red-400 font-mono text-sm">{contact.phone}</div>
            )}
          </a>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-red-700/30">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              addNotification('Your location has been shared with leaders');
              setCurrentUser(prev => ({ ...prev, points: prev.points + 5 }));
            }}
            className="bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Share Location
          </button>
          <button 
            onClick={() => {
              setHikeProgress(prev => Math.min(prev + 25, 100));
              addNotification('Safety check-in complete ✓');
              setCurrentUser(prev => ({ ...prev, points: prev.points + 10 }));
            }}
            className="bg-amber-600 hover:bg-amber-700 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Check-in Safe
          </button>
        </div>
      </div>
    </div>
  );

  const ProgressTracker = () => (
    <div className="mt-6 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-5 border border-purple-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Your Progress
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-300">{streakDays} day streak</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Helvellyn Hike Progress</span>
          <span className="text-emerald-400">{hikeProgress}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${hikeProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Today's Meditation</span>
          <span className="text-blue-400">{meditationMinutes} min</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(meditationMinutes / 60) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold mb-3 text-slate-300">Recent Achievements</h4>
      <div className="grid grid-cols-2 gap-3">
        {achievements.slice(0, 4).map(achievement => (
          <div 
            key={achievement.id}
            className={`bg-slate-800/50 rounded-xl p-3 ${achievement.earned ? 'border border-amber-500/30' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{achievement.icon}</span>
              <span className="text-sm font-medium">{achievement.name}</span>
            </div>
            <div className="text-xs text-slate-400">{achievement.description}</div>
            {!achievement.earned && (
              <div className="mt-2">
                <div className="w-full bg-slate-700/30 rounded-full h-1">
                  <div 
                    className="bg-emerald-500 h-1 rounded-full"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const EnhancedWeather = () => (
    <div className="mt-6 bg-gradient-to-r from-sky-800/40 to-cyan-800/40 backdrop-blur rounded-2xl p-5 border border-sky-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {weatherLoading ? (
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            getWeatherIcon(liveWeather?.condition)
          )}
          {weatherLoading ? 'Loading Weather...' : 'Live Weather'}
        </h3>
        <div className="flex items-center gap-2">
          {weatherError && (
            <span className="text-xs text-amber-400">⚠️ {weatherError}</span>
          )}
          <button 
            onClick={refreshWeather}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            disabled={weatherLoading || isRefreshing}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {liveWeather && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-900/30 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">{liveWeather.icon}</div>
              <div className="text-3xl font-bold">{liveWeather.temperature}°</div>
              <div className="text-sm text-slate-300 capitalize">{liveWeather.condition}</div>
              <div className="text-xs text-sky-300 mt-1">{liveWeather.city}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="w-4 h-4" />
                  <span>Feels like</span>
                </div>
                <span className="font-medium">{liveWeather.feelsLike}°</span>
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
            </div>
          </div>
          
          <div className="pt-4 border-t border-sky-700/30">
            <h4 className="text-sm font-semibold mb-3 text-slate-300">4-Day Forecast</h4>
            <div className="flex overflow-x-auto gap-4 pb-2">
              {liveWeather.forecast.map((day, idx) => (
                <div key={idx} className="flex-shrink-0 bg-slate-800/30 rounded-xl p-3 min-w-24 text-center">
                  <div className="text-sm font-medium">{day.day}</div>
                  <div className="text-2xl my-2">{day.icon}</div>
                  <div className="text-sm">
                    <div className="font-bold">{day.high}°</div>
                    <div className="text-slate-400 text-xs">{day.low}°</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 capitalize">{day.condition}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-sky-700/30 text-center">
            <p className="text-xs text-sky-300">
              Last updated: {liveWeather.lastUpdated} • {userLocation ? 'Your location active' : 'Using default location'}
            </p>
          </div>
        </>
      )}
    </div>
  );

  const SystemStatus = () => (
    <div className="mt-6 bg-gradient-to-r from-slate-800/40 to-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-300">System Status</h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}></div>
          <span className="text-xs">{connectionStatus}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Battery className="w-6 h-6 text-slate-400" />
            <div 
              className="absolute top-1 left-1 h-4 bg-emerald-500 rounded-sm"
              style={{ width: `${batteryLevel * 0.16}px` }}
            ></div>
          </div>
          <span className="text-xs mt-1">{batteryLevel}%</span>
        </div>
        
        <button 
          onClick={() => {
            setOfflineMode(!offlineMode);
            addNotification(offlineMode ? 'Back online' : 'Offline mode enabled');
          }}
          className="flex flex-col items-center"
        >
          {offlineMode ? (
            <WifiOff className="w-6 h-6 text-amber-500" />
          ) : (
            <Wifi className="w-6 h-6 text-emerald-500" />
          )}
          <span className="text-xs mt-1">{offlineMode ? 'Offline' : 'Online'}</span>
        </button>
        
        <button 
          onClick={() => {
            setDarkMode(!darkMode);
            addNotification(darkMode ? 'Light mode' : 'Dark mode');
          }}
          className="flex flex-col items-center"
        >
          {darkMode ? (
            <Moon className="w-6 h-6 text-blue-400" />
          ) : (
            <Sun className="w-6 h-6 text-amber-400" />
          )}
          <span className="text-xs mt-1">{darkMode ? 'Dark' : 'Light'}</span>
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Storage Used</span>
          <span className="text-emerald-400">
            {Math.round((JSON.stringify(photos).length + JSON.stringify(prayerRequests).length) / 1024)}KB
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1">
          <div 
            className="bg-emerald-500 h-1 rounded-full"
            style={{ width: '35%' }}
          ></div>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="mt-6 grid grid-cols-4 gap-3">
      <button 
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          addNotification('Link copied to clipboard!');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors active:scale-95"
      >
        <Share className="w-5 h-5 text-blue-400 mb-1" />
        <span className="text-xs">Share App</span>
      </button>
      
      <button 
        onClick={() => {
          const data = {
            photos: photos.length,
            prayers: prayerRequests.length,
            testimonials: testimonials.length,
            user: currentUser.name,
            backupDate: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `retreat-backup-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          addNotification('Data backup downloaded');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors active:scale-95"
      >
        <Download className="w-5 h-5 text-emerald-400 mb-1" />
        <span className="text-xs">Backup Data</span>
      </button>
      
      <button 
        onClick={() => {
          setStreakDays(prev => prev + 1);
          setCurrentUser(prev => ({ ...prev, points: prev.points + 15 }));
          addNotification('Daily check-in complete! +15 points');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors active:scale-95"
      >
        <CheckCircle className="w-5 h-5 text-green-400 mb-1" />
        <span className="text-xs">Daily Check-in</span>
      </button>
      
      <button 
        onClick={() => {
          setCurrentUser(prev => ({ ...prev, points: prev.points + 10 }));
          addNotification('+10 points earned!');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors active:scale-95"
      >
        <Gift className="w-5 h-5 text-pink-400 mb-1" />
        <span className="text-xs">Earn Points</span>
      </button>
    </div>
  );

  // ======================
  // RENDER TAB CONTENT (Your existing functions)
  // ======================
  
  // [Keep ALL your existing renderTabContent() function exactly as you have it]
  // This includes schedule, location, photos, prayer, and testimonials rendering
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-100 to-gray-300'} text-white`}>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Greenwich SDA</h1>
            <p className="text-emerald-100 text-sm">Men's Retreat 2026</p>
          </div>
          <div className="flex items-center gap-3">
            {liveWeather && !weatherLoading && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                {getWeatherIcon(liveWeather.condition)}
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">{liveWeather.temperature}°</span>
                  <span className="text-xs ml-1">C</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowUserModal(true)}
              className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center relative"
            >
              <span className="text-lg">{currentUser.avatar}</span>
              {currentUser.level > 1 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-xs">
                  {currentUser.level}
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {userLocation ? 'Your Location Active' : 'Lake District'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs bg-emerald-800/30 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{currentUser.points} pts</span>
            </div>
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

      {/* Main Content */}
      <div className="pb-24">
        <div className="px-4 py-6">
          {/* Your existing tab content */}
          {renderTabContent()}
          
          {/* ADD NEW FEATURES TO SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <>
              <EnhancedWeather />
              <EmergencyFeatures />
              <ProgressTracker />
              <SystemStatus />
              <QuickActions />
            </>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-40">
        <div className="flex justify-around items-center h-16">
          {[
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'location', icon: Navigation, label: 'Map' },
            { id: 'photos', icon: Camera, label: 'Photos' },
            { id: 'prayer', icon: Heart, label: 'Prayer' },
            { id: 'testimonials', icon: MessageCircle, label: 'Stories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 active:scale-95 transition-transform ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-full ${
                activeTab === tab.id ? 'bg-emerald-400/10' : ''
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-slate-800 w-full max-w-sm h-full border-l border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadNotifications > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-emerald-400 text-sm"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`bg-slate-700/50 rounded-xl p-4 ${!notification.read ? 'border-l-2 border-emerald-400' : ''}`}
                    >
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

      {/* Enhanced User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-slate-400">{currentUser.rank}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{currentUser.points} points</span>
                  </div>
                  <div className="text-xs px-2 py-0.5 bg-emerald-800/30 rounded-full">
                    Level {currentUser.level}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{photos.filter(p => p.userId === currentUser.id).length}</div>
                  <div className="text-sm">Photos</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-teal-400">{prayerRequests.filter(p => p.userId === currentUser.id).length}</div>
                  <div className="text-sm">Prayers</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{testimonials.filter(t => t.userId === currentUser.id).length}</div>
                  <div className="text-sm">Stories</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Daily Streak</span>
                  <span className="text-emerald-400 font-bold">{streakDays} days</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-2 rounded-full ${i < streakDays ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-lg font-semibold mt-4 hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
