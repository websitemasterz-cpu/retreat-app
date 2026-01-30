// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Upload, Navigation, Clock, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, CloudSnow, CloudLightning, ThumbsUp, Share2, Bell, Send, MoreVertical, Edit, Trash2, Check, X, RefreshCw, Image as ImageIcon, XCircle, Maximize2, Download, Filter } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // State management with enhanced user system
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [photoCaption, setPhotoCaption] = useState({});
  const [photoComment, setPhotoComment] = useState({});
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [draftPhotos, setDraftPhotos] = useState([]);
  const [photoFilter, setPhotoFilter] = useState('all');

  // Mock users database
  const mockUsers = [
    { id: 1, name: 'David M.', avatar: '👨‍🦰', color: 'text-blue-400', bg: 'bg-blue-500' },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', color: 'text-amber-400', bg: 'bg-amber-500' },
    { id: 4, name: 'John W.', avatar: '👨‍💼', color: 'text-purple-400', bg: 'bg-purple-500' },
    { id: 5, name: 'Thomas R.', avatar: '👨‍🔧', color: 'text-rose-400', bg: 'bg-rose-500' },
    { id: 6, name: 'James K.', avatar: '👨‍🏫', color: 'text-cyan-400', bg: 'bg-cyan-500' },
  ];

  // Current user state with localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to first user or create new
    return {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      isOnline: true,
      lastSeen: new Date().toISOString()
    };
  });

  // All users (current user + mock users)
  const [allUsers, setAllUsers] = useState([...mockUsers, currentUser]);

  // Load community data from localStorage
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityPhotos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prayerRequests, setPrayerRequests] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityPrayers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityTestimonials');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('retreatNotifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'welcome',
        message: 'Welcome to the retreat community! Start by sharing a prayer request.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [weather, setWeather] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock weather data
  const mockWeatherData = {
    temperature: 18,
    condition: 'Partly Cloudy',
    feelsLike: 16,
    humidity: 65,
    windSpeed: 12,
    precipitation: 20,
    icon: '⛅',
    forecast: [
      { day: 'Today', high: 18, low: 12, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Sat', high: 16, low: 11, condition: 'Light Rain', icon: '🌦️' },
      { day: 'Sun', high: 14, low: 9, condition: 'Cloudy', icon: '☁️' },
      { day: 'Mon', high: 17, low: 12, condition: 'Sunny', icon: '☀️' }
    ]
  };

  // Rest of the existing data structures remain the same...
  // [Previous data structures: baseLocation, locations, schedule, devotionals, attractions]

  // Save to localStorage whenever data changes
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
    localStorage.setItem('retreatNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Load draft photos from localStorage
  useEffect(() => {
    const savedDrafts = localStorage.getItem('retreatDraftPhotos');
    if (savedDrafts) {
      setDraftPhotos(JSON.parse(savedDrafts));
    }
  }, []);

  // Save draft photos to localStorage
  useEffect(() => {
    localStorage.setItem('retreatDraftPhotos', JSON.stringify(draftPhotos));
  }, [draftPhotos]);

  // Simulate community activity
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
        (error) => console.log('Location access denied')
      );
    }

    // Set mock weather data
    setWeather(mockWeatherData);

    // Simulate occasional community activity
    const simulateActivity = () => {
      if (Math.random() > 0.7 && prayerRequests.length > 0) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomPrayer = prayerRequests[Math.floor(Math.random() * prayerRequests.length)];
        
        if (randomPrayer.userId !== randomUser.id) {
          const newNotification = {
            id: Date.now(),
            type: 'prayer',
            message: `${randomUser.name} prayed for your request`,
            userId: randomUser.id,
            itemId: randomPrayer.id,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Increment prayer count
          setPrayerRequests(prev =>
            prev.map(prayer =>
              prayer.id === randomPrayer.id
                ? { ...prayer, prayers: prayer.prayers + 1 }
                : prayer
            )
          );
        }
      }
    };

    const activityInterval = setInterval(simulateActivity, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(activityInterval);
    };
  }, [prayerRequests]);

  // Filter photos based on selected filter
  const filteredPhotos = React.useMemo(() => {
    if (photoFilter === 'all') return photos;
    if (photoFilter === 'my') return photos.filter(photo => photo.userId === currentUser.id);
    if (photoFilter === 'liked') return photos.filter(photo => photo.likedBy?.includes(currentUser.id));
    return photos;
  }, [photos, photoFilter, currentUser.id]);

  // Enhanced photo upload with draft support
  const handlePhotoUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newDrafts = files.map(file => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            id: `draft_${Date.now()}_${Math.random()}`,
            src: reader.result,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            caption: '',
            timestamp: new Date().toISOString(),
            status: 'draft'
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newDrafts).then(drafts => {
      setDraftPhotos(prev => [...prev, ...drafts]);
    });
  }, []);

  // Save draft as final photo
  const saveDraftPhoto = useCallback((draft, caption) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(progressInterval);
      
      const newPhoto = {
        id: Date.now(),
        src: draft.src,
        caption: caption,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        userColor: currentUser.color,
        timestamp: new Date().toISOString(),
        comments: [],
        likes: 0,
        likedBy: [],
        location: currentLocation ? {
          lat: currentLocation.lat,
          lng: currentLocation.lng
        } : null,
        fileName: draft.name,
        fileSize: draft.size,
        uploadedAt: new Date().toISOString()
      };
      
      setPhotos(prev => [newPhoto, ...prev]);
      setDraftPhotos(prev => prev.filter(p => p.id !== draft.id));
      setIsUploading(false);
      setUploadProgress(0);
      
      // Notify community
      addNotification('new_photo', `${currentUser.name} shared a photo`, currentUser.id, newPhoto.id);
    }, 1000);
  }, [currentUser, currentLocation, addNotification]);

  // Delete draft photo
  const deleteDraftPhoto = useCallback((draftId) => {
    setDraftPhotos(prev => prev.filter(p => p.id !== draftId));
  }, []);

  // Download photo
  const downloadPhoto = useCallback((photo) => {
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = `retreat_photo_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // View photo in full screen
  const viewFullScreen = useCallback((photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  }, []);

  // Enhanced photo functions
  const updatePhotoCaption = useCallback((photoId, caption) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, caption }
          : photo
      )
    );
  }, []);

  const likePhoto = useCallback((photoId) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { 
              ...photo, 
              likes: photo.likes + 1,
              likedBy: [...(photo.likedBy || []), currentUser.id]
            }
          : photo
      )
    );
    
    const photo = photos.find(p => p.id === photoId);
    if (photo && photo.userId !== currentUser.id) {
      addNotification('like', `${currentUser.name} liked your photo`, currentUser.id, photoId);
    }
  }, [photos, currentUser, addNotification]);

  const addPhotoComment = useCallback((photoId, text) => {
    const newComment = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, comments: [...photo.comments, newComment] }
          : photo
      )
    );
    
    const photo = photos.find(p => p.id === photoId);
    if (photo && photo.userId !== currentUser.id) {
      addNotification('comment', `${currentUser.name} commented on your photo`, currentUser.id, photoId);
    }
  }, [photos, currentUser, addNotification]);

  const deletePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  // [Previous functions remain the same...]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Enhanced Mobile Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUserModal(true)}
                className="flex-shrink-0"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                  <span className="text-sm">{currentUser.avatar}</span>
                </div>
              </button>
              <div>
                <h1 className="text-xl font-bold leading-tight">Greenwich SDA</h1>
                <p className="text-emerald-200 text-xs">Men's Retreat 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {weather && (
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-sky-800/60 to-cyan-800/60 px-3 py-1.5 rounded-full">
                  {getWeatherIcon(weather.condition)}
                  <span className="text-sm font-bold">{weather.temperature}°</span>
                </div>
              )}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2"
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
          
          {/* Mobile Navigation Tabs - Scrollable */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              {[
                { id: 'schedule', icon: Calendar, label: 'Schedule' },
                { id: 'location', icon: Navigation, label: 'Map' },
                { id: 'devotional', icon: Book, label: 'Word' },
                { id: 'photos', icon: Camera, label: 'Photos' },
                { id: 'prayer', icon: Heart, label: 'Prayer' },
                { id: 'testimonials', icon: MessageCircle, label: 'Stories' },
                { id: 'attractions', icon: Mountain, label: 'Places' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs mt-1 font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-4 p-4">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Community Photos</h2>
                <p className="text-pink-100 text-sm">Share retreat memories</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-pink-500/20 px-2 py-1 rounded-full">
                  <span className="text-xs">{photos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Photos Section */}
          {draftPhotos.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-semibold mb-3 text-slate-300">Draft Photos ({draftPhotos.length})</h3>
              <div className="space-y-3">
                {draftPhotos.map(draft => (
                  <div key={draft.id} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={draft.src} 
                        alt="Draft" 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{draft.name}</p>
                        <p className="text-xs text-slate-400">
                          {(draft.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            value={draft.caption || ''}
                            onChange={(e) => {
                              setDraftPhotos(prev => 
                                prev.map(p => 
                                  p.id === draft.id 
                                    ? { ...p, caption: e.target.value }
                                    : p
                                )
                              );
                            }}
                            placeholder="Add a caption..."
                            className="flex-1 bg-slate-600/50 rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => saveDraftPhoto(draft, draft.caption)}
                            className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-sm"
                          >
                            Post
                          </button>
                          <button
                            onClick={() => deleteDraftPhoto(draft.id)}
                            className="bg-red-600/50 hover:bg-red-500/50 px-3 py-1 rounded text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Section - Mobile Optimized */}
          <div className="bg-slate-800/70 backdrop-blur rounded-xl p-4 border-2 border-dashed border-slate-600">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                multiple
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-8 h-8 text-pink-400" />
                </div>
                <p className="font-semibold mb-1">Upload Photos</p>
                <p className="text-slate-400 text-sm text-center">Tap to select from your gallery</p>
                <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG, HEIC</p>
              </div>
            </label>
            
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Photo Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'my', label: 'My Photos' },
              { id: 'liked', label: 'Liked' },
              { id: 'recent', label: 'Recent' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setPhotoFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  photoFilter === filter.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700/50 text-slate-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Photo Grid - Responsive */}
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="bg-slate-800/50 rounded-xl overflow-hidden group relative"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={photo.src} 
                      alt={photo.caption || 'Retreat photo'} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => viewFullScreen(photo)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            likePhoto(photo.id);
                          }}
                          className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full"
                        >
                          <Heart className={`w-4 h-4 ${photo.likedBy?.includes(currentUser.id) ? 'fill-pink-400 text-pink-400' : 'text-white'}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPhoto(photo);
                          }}
                          className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    {photo.likes > 0 && (
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-xs text-white">❤️ {photo.likes}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${photo.userColor.replace('text', 'bg')}`}>
                        <span className="text-xs">{photo.userAvatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{photo.userName}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(photo.timestamp).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {photo.caption && (
                      <p className="text-sm text-slate-300 line-clamp-2 mb-3">{photo.caption}</p>
                    )}
                    
                    {photo.comments.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setShowPhotoModal(true);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-300"
                      >
                        💬 {photo.comments.length} comments
                      </button>
                    )}
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
      )}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => {
                setShowPhotoModal(false);
                setSelectedPhoto(null);
              }}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img 
              src={selectedPhoto.src} 
              alt={selectedPhoto.caption || 'Retreat photo'} 
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            
            <div className="mt-4 bg-slate-800/90 backdrop-blur rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPhoto.userColor.replace('text', 'bg')}`}>
                    <span className="text-lg">{selectedPhoto.userAvatar}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-300">{selectedPhoto.userName}</h3>
                    <p className="text-xs text-slate-400">
                      {new Date(selectedPhoto.timestamp).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likePhoto(selectedPhoto.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-5 h-5 ${selectedPhoto.likedBy?.includes(currentUser.id) ? 'fill-pink-400 text-pink-400' : 'text-white'}`} />
                    <span>{selectedPhoto.likes}</span>
                  </button>
                  <button
                    onClick={() => downloadPhoto(selectedPhoto)}
                    className="p-2 hover:bg-slate-700/50 rounded-full"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {selectedPhoto.caption && (
                <p className="text-lg text-slate-300 mb-6 italic">"{selectedPhoto.caption}"</p>
              )}
              
              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="font-semibold">Comments ({selectedPhoto.comments.length})</h4>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedPhoto.comments.map(comment => (
                    <div key={comment.id} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.userColor.replace('text', 'bg')}`}>
                          <span className="text-xs">{comment.userAvatar}</span>
                        </div>
                        <span className="font-medium text-pink-200">{comment.userName}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.timestamp).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="flex gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                    <span className="text-sm">{currentUser.avatar}</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={photoComment[selectedPhoto.id] || ''}
                      onChange={(e) => setPhotoComment({...photoComment, [selectedPhoto.id]: e.target.value})}
                      placeholder="Add a comment..."
                      className="flex-1 bg-slate-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      onClick={() => {
                        if (photoComment[selectedPhoto.id]?.trim()) {
                          addPhotoComment(selectedPhoto.id, photoComment[selectedPhoto.id]);
                          setPhotoComment({...photoComment, [selectedPhoto.id]: ''});
                        }
                      }}
                      className="bg-pink-600 hover:bg-pink-500 px-4 rounded-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the existing tabs with mobile optimizations... */}
      {/* Note: Other tabs should follow similar mobile optimizations */}

      {/* Enhanced Mobile Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <Clock className="w-4 h-4 inline mr-1" />
              {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshCommunityData}
                disabled={isRefreshing}
                className="p-2"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-1 text-xs">
                <Users className="w-4 h-4" />
                <span>{allUsers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for bottom navigation */}
      <div className="pb-20" />
    </div>
  );
}
