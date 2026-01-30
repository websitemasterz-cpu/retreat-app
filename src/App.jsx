// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Navigation, Clock, Sun, Cloud, CloudRain, Bell, X } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Weather
  const [weather] = useState({
    temperature: 18,
    condition: 'Partly Cloudy',
  });

  // Daily schedule
  const schedule = {
    saturday: [
      { time: '07:00', activity: 'Morning Devotion', location: 'Base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'Base', emoji: '🍳' },
      { time: '09:00', activity: 'Aira Force & Gowbarrow Fell Hike', location: 'Aira Force', emoji: '🏔️' },
      { time: '14:00', activity: 'Return & Rest', location: 'Base', emoji: '😌' },
      { time: '16:00', activity: 'Optional: Ullswater Steamer', location: 'Ullswater', emoji: '⛴️' },
      { time: '18:00', activity: 'Dinner', location: 'Base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Discussion', location: 'Base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'Base', emoji: '☕' }
    ]
  };

  // Effects
  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny') || condition.includes('Clear')) return <Sun className="w-6 h-6 text-amber-400" />;
    if (condition.includes('Rain')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  const currentSchedule = { day: 'Saturday', schedule: schedule.saturday };

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
              <span className="text-sm">Bury Jubilee Centre</span>
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
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        <div className="px-4 py-6">
          {/* Schedule Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold">{currentSchedule.day}'s Schedule</h2>
                <p className="text-slate-400">21-24 August 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">7 members</span>
              </div>
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-4">
            {currentSchedule.schedule.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 rounded-2xl p-4 border-l-4 border-emerald-500"
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
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Day Selector */}
          <div className="mt-8 bg-slate-800/50 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Friday', 'Saturday', 'Sunday', 'Monday'].map((day) => (
                <button
                  key={day}
                  className={`rounded-xl p-4 text-center ${
                    day === 'Saturday'
                      ? 'bg-emerald-600'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <div className="font-bold">{day}</div>
                  <div className="text-sm opacity-80">
                    {day === 'Friday' ? '21 Aug' : 
                     day === 'Saturday' ? '22 Aug' :
                     day === 'Sunday' ? '23 Aug' : '24 Aug'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800">
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
              className={`flex flex-col items-center justify-center w-16 ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

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
            
            <input
              type="text"
              value={currentUser.name}
              onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-700 rounded-lg px-4 py-3 mb-4"
              placeholder="Your name"
            />
            
            <button
              onClick={() => setShowUserModal(false)}
              className="w-full bg-emerald-600 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
