// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Navigation, Clock, Sun, Cloud, CloudRain, Bell, X, Upload, Send, Map, Thermometer, Wind, Droplets, ChevronRight } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
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
  const [currentDay, setCurrentDay] = useState('saturday'); // Track current day
  const [selectedLocation, setSelectedLocation] = useState('base');

  // Current user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      bg: 'bg-emerald-500',
    };
  });

  // Mock data
  const [allUsers] = useState([
    { id: 1, name: 'David M.', avatar: '👨‍🦰', bg: 'bg-blue-500' },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', bg: 'bg-emerald-500' },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', bg: 'bg-amber-500' },
  ]);

  // Weather
  const [weather] = useState({
    temperature: 18,
    condition: 'Partly Cloudy',
    feelsLike: 16,
    humidity: 65,
    windSpeed: 12,
    precipitation: 20,
    forecast: [
      { day: 'Today', high: 18, low: 12, icon: '⛅' },
      { day: 'Sat', high: 16, low: 11, icon: '🌦️' },
      { day: 'Sun', high: 14, low: 9, icon: '☁️' },
    ]
  });

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

  // Effects
  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
    const savedPhotos = localStorage.getItem('retreatCommunityPhotos');
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    
    const savedPrayers = localStorage.getItem('retreatCommunityPrayers');
    if (savedPrayers) setPrayerRequests(JSON.parse(savedPrayers));

    const savedTestimonials = localStorage.getItem('retreatCommunityTestimonials');
    if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));
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
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny') || condition.includes('Clear')) return <Sun className="w-6 h-6 text-amber-400" />;
    if (condition.includes('Rain')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

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
  };

  const latestPhoto = photos[0];
  const latestPrayer = prayerRequests[0];
  const latestTestimonial = testimonials[0];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calculate distance between locations (simplified)
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

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div className="px-4 py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold">{currentSchedule.day}'s Schedule</h2>
                  <p className="text-slate-400">21-24 August 2026 • {currentSchedule.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{allUsers.length} members</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentSchedule.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-2xl p-4 border-l-4 border-emerald-500 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-emerald-400">
                          {item.time}
                        </span>
                        {locations[item.location] && (
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                            {locations[item.location].distance}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                      
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{locations[item.location]?.name || item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WORKING Day Selector */}
            <div className="mt-8 bg-slate-800/50 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(scheduleData).map(([key, day]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentDay(key);
                      addNotification(`Switched to ${day.day}'s schedule`);
                    }}
                    className={`rounded-xl p-4 text-center transition-all ${
                      currentDay === key
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-bold">{day.day}</div>
                    <div className="text-sm opacity-80">{day.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Interactive Map</h2>
              <p className="text-blue-100">Tap locations for details</p>
            </div>
            
            {/* INTERACTIVE MAP */}
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
              <div className="relative h-64 bg-gradient-to-br from-slate-900 to-blue-900/50 rounded-xl mb-6 overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Map className="w-32 h-32 text-slate-700/50" />
                </div>
                
                {/* Location Dots - INTERACTIVE */}
                <button 
                  onClick={() => setSelectedLocation('base')}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-transform ${selectedLocation === 'base' ? 'scale-110' : ''} ${locations.base.color}`}
                >
                  <span className="text-xl">{locations.base.icon}</span>
                </button>
                
                <button 
                  onClick={() => setSelectedLocation('airaForce')}
                  className={`absolute top-1/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-transform ${selectedLocation === 'airaForce' ? 'scale-110' : ''} ${locations.airaForce.color}`}
                >
                  <span className="text-lg">{locations.airaForce.icon}</span>
                </button>
                
                <button 
                  onClick={() => setSelectedLocation('helvellyn')}
                  className={`absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-transform ${selectedLocation === 'helvellyn' ? 'scale-110' : ''} ${locations.helvellyn.color}`}
                >
                  <span className="text-lg">{locations.helvellyn.icon}</span>
                </button>
                
                <button 
                  onClick={() => setSelectedLocation('ullswater')}
                  className={`absolute bottom-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-transform ${selectedLocation === 'ullswater' ? 'scale-110' : ''} ${locations.ullswater.color}`}
                >
                  <span className="text-lg">{locations.ullswater.icon}</span>
                </button>
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="25%" y2="33%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="67%" y2="75%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
              
              {/* Selected Location Details */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${locations[selectedLocation].color} flex items-center justify-center`}>
                    <span className="text-xl">{locations[selectedLocation].icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{locations[selectedLocation].name}</h3>
                    <p className="text-sm text-slate-400">{locations[selectedLocation].distance} from base</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4">{locations[selectedLocation].description}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Latitude</div>
                    <div>{locations[selectedLocation].lat.toFixed(4)}°</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Longitude</div>
                    <div>{locations[selectedLocation].lng.toFixed(4)}°</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-400">Distance</div>
                    <div className="text-emerald-400">{locations[selectedLocation].distance}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* All Locations List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-3">All Locations</h3>
              {Object.entries(locations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  className={`w-full bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 transition-colors ${
                    selectedLocation === key ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${location.color} flex items-center justify-center`}>
                    <span className="text-lg">{location.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-slate-400">{location.distance} • {location.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Community Photos</h2>
              <p className="text-pink-100">{photos.length} photos shared</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border-2 border-dashed border-slate-600 text-center mb-6">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Camera className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                <p className="font-medium">Upload Photo</p>
                <p className="text-slate-400 text-sm mt-1">Tap to select from your device</p>
              </label>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-slate-800/50 rounded-xl overflow-hidden">
                    <img 
                      src={photo.src} 
                      alt="Retreat" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${photo.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                            <span className="text-xs">{photo.userAvatar}</span>
                          </div>
                          <span className="text-sm font-medium">{photo.userName}</span>
                        </div>
                        <button 
                          onClick={() => likeItem('photo', photo.id)}
                          className="flex items-center gap-1 text-pink-400"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{photo.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No photos yet</p>
                <p className="text-sm text-slate-500 mt-2">Be the first to share!</p>
              </div>
            )}
          </div>
        );

      case 'prayer':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Prayer Wall</h2>
              <p className="text-amber-100">{prayerRequests.length} prayer requests</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Share a Prayer Request</h3>
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share what's on your heart..."
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 mb-4"
              />
              <button
                onClick={addPrayerRequest}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 py-3 rounded-lg font-semibold"
              >
                Share Prayer
              </button>
            </div>

            {prayerRequests.length > 0 ? (
              <div className="space-y-4">
                {prayerRequests.map(request => (
                  <div key={request.id} className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${request.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-lg">{request.userAvatar}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{request.userName}</h3>
                        <p className="text-xs text-slate-400">
                          {new Date(request.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">{request.text}</p>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => likeItem('prayer', request.id)}
                        className="flex items-center gap-2 text-amber-400"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{request.prayers} prayers</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No prayer requests yet</p>
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Stories & Testimonies</h2>
              <p className="text-teal-100">{testimonials.length} stories shared</p>
            </div>

            {/* ADD TESTIMONY FORM - WORKING */}
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Share Your Story</h3>
              <textarea
                value={testimonialText}
                onChange={(e) => setTestimonialText(e.target.value)}
                placeholder="How has God worked in your life during this retreat?"
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 mb-4"
              />
              <button
                onClick={addTestimonial}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 py-3 rounded-lg font-semibold"
              >
                Share Story
              </button>
            </div>

            {/* DISPLAY TESTIMONIES - WORKING */}
            {testimonials.length > 0 ? (
              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${testimonial.bg || 'bg-teal-500'} flex items-center justify-center`}>
                        <span className="text-lg">{testimonial.userAvatar}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{testimonial.userName}</h3>
                        <p className="text-xs text-slate-400">
                          {new Date(testimonial.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => likeItem('testimonial', testimonial.id)}
                        className="flex items-center gap-2 text-teal-400"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{testimonial.likes} likes</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-teal-400" />
                <p className="text-slate-400">No stories yet</p>
                <p className="text-sm text-slate-500 mt-2">Share your story to encourage others</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Greenwich SDA</h1>
            <p className="text-emerald-100 text-sm">Men's Retreat 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              {getWeatherIcon(weather.condition)}
              <span className="text-xl font-bold">{weather.temperature}°</span>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center"
            >
              <span className="text-lg">{currentUser.avatar}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{locations[selectedLocation].name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
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

      {/* Community Preview (only on schedule tab) */}
      {activeTab === 'schedule' && (latestPhoto || latestPrayer || latestTestimonial) && (
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Community Activity</h2>
              <button 
                onClick={() => {
                  if (latestPhoto) setActiveTab('photos');
                  else if (latestPrayer) setActiveTab('prayer');
                  else if (latestTestimonial) setActiveTab('testimonials');
                }}
                className="text-emerald-400 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="flex overflow-x-auto gap-3 pb-2">
              {latestPhoto && (
                <div 
                  onClick={() => setActiveTab('photos')}
                  className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Camera className="w-5 h-5 text-pink-400" />
                    <span className="font-medium">Latest Photo</span>
                  </div>
                  <div className="aspect-video bg-slate-700/50 rounded-lg mb-3 overflow-hidden">
                    <img src={latestPhoto.src} alt="Latest" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${latestPhoto.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-xs">{latestPhoto.userAvatar}</span>
                      </div>
                      <span className="text-sm">{latestPhoto.userName}</span>
                    </div>
                    <span className="text-xs text-slate-400">{latestPhoto.likes} likes</span>
                  </div>
                </div>
              )}
              
              {latestPrayer && (
                <div 
                  onClick={() => setActiveTab('prayer')}
                  className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-amber-400" />
                    <span className="font-medium">Prayer Request</span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-3">{latestPrayer.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${latestPrayer.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-xs">{latestPrayer.userAvatar}</span>
                      </div>
                      <span className="text-sm">{latestPrayer.userName}</span>
                    </div>
                    <span className="text-xs text-slate-400">{latestPrayer.prayers} prayers</span>
                  </div>
                </div>
              )}
              
              {latestTestimonial && (
                <div 
                  onClick={() => setActiveTab('testimonials')}
                  className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="w-5 h-5 text-teal-400" />
                    <span className="font-medium">Latest Story</span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-3 italic">"{latestTestimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${latestTestimonial.bg || 'bg-teal-500'} flex items-center justify-center`}>
                        <span className="text-xs">{latestTestimonial.userAvatar}</span>
                      </div>
                      <span className="text-sm">{latestTestimonial.userName}</span>
                    </div>
                    <span className="text-xs text-slate-400">{latestTestimonial.likes} likes</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 z-40">
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
        <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
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

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
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
                <p className="text-slate-400">Retreat Participant</p>
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
              
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-lg font-semibold mt-4"
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
