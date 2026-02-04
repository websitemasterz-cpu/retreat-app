// src/App.jsx - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
// ... (keep all icon imports as they are)

export default function GreenwichSDARetreatApp() {
  // STATE VARIABLES
  // ... (keep all existing state variables)

  // Add these refs for file inputs
  const photoInputRef = useRef(null);
  
  // TRAILS DATA - Add this
  const trailData = [
    {
      id: 1,
      name: 'Glenridding Dodd Loop',
      distance: '1.5 miles',
      difficulty: 'Easy',
      duration: '1-2 hours',
      elevation: '200m',
      description: 'Gentle walk with stunning views over Ullswater.',
      points: 20,
      completed: false,
      lat: 54.5350,
      lng: -2.9500
    },
    {
      id: 2,
      name: 'Aira Force Circular',
      distance: '2.5 miles',
      difficulty: 'Easy/Moderate',
      duration: '2-3 hours',
      elevation: '150m',
      description: 'Beautiful waterfall walk through ancient woodland.',
      points: 25,
      completed: false,
      lat: 54.5733,
      lng: -2.9067
    },
    {
      id: 3,
      name: 'Helvellyn via Striding Edge',
      distance: '8 miles',
      difficulty: 'Challenging',
      duration: '6-7 hours',
      elevation: '950m',
      description: 'England\'s 3rd highest peak via famous ridge walk.',
      points: 50,
      completed: false,
      lat: 54.5275,
      lng: -3.0164
    },
    {
      id: 4,
      name: 'Ullswater Lakeside Path',
      distance: '3 miles',
      difficulty: 'Easy',
      duration: '1.5-2 hours',
      elevation: '50m',
      description: 'Gentle lakeside walk with steamer views.',
      points: 15,
      completed: false,
      lat: 54.5500,
      lng: -2.9300
    }
  ];

  // ... (keep all existing data and functions)

  // FIX: Enhanced handlePhotoUpload function
  const handlePhotoUpload = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const onPhotoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addNotification('File too large! Please select image under 5MB.');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        addNotification('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          caption: photoCaption || 'Retreat memory',
          timestamp: new Date().toISOString(),
          author: currentUser.name,
          likes: 0,
          comments: []
        };
        setPhotos(prev => [newPhoto, ...prev]);
        setProgressMetrics(prev => ({ ...prev, photosShared: prev.photosShared + 1 }));
        
        // Award points for sharing
        setCurrentUser(prev => ({
          ...prev,
          points: prev.points + 10
        }));
        
        setPhotoCaption('');
        addNotification('Photo uploaded successfully! +10 points 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  // FIX: Enhanced addPrayerRequest function
  const addPrayerRequest = () => {
    if (!prayerText.trim()) {
      addNotification('Please enter a prayer request');
      return;
    }
    
    if (prayerText.length > 500) {
      addNotification('Prayer request too long (max 500 characters)');
      return;
    }
    
    const newRequest = {
      id: Date.now(),
      text: prayerText,
      author: currentUser.name || 'Anonymous',
      timestamp: new Date().toISOString(),
      prayers: 0,
      prayedBy: []
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    setProgressMetrics(prev => ({ ...prev, prayerCount: prev.prayerCount + 1 }));
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + 5
    }));
    setPrayerText('');
    addNotification('Prayer request shared! +5 points 🙏');
  };

  // FIX: Enhanced addTestimonial function
  const addTestimonial = () => {
    if (!testimonialText.trim()) {
      addNotification('Please share your story');
      return;
    }
    
    if (testimonialText.length > 1000) {
      addNotification('Story too long (max 1000 characters)');
      return;
    }
    
    const newTestimonial = {
      id: Date.now(),
      text: testimonialText,
      author: currentUser.name || 'Brother in Christ',
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + 10
    }));
    setTestimonialText('');
    addNotification('Testimony shared! +10 points 🙌');
  };

  // FIX: Enhanced prayForRequest function
  const prayForRequest = (requestId) => {
    setPrayerRequests(prev => prev.map(request => {
      if (request.id === requestId && !prayedForRequests.includes(requestId)) {
        return {
          ...request,
          prayers: request.prayers + 1,
          prayedBy: [...(request.prayedBy || []), currentUser.name]
        };
      }
      return request;
    }));
    
    if (!prayedForRequests.includes(requestId)) {
      setPrayedForRequests(prev => [...prev, requestId]);
      setCurrentUser(prev => ({
        ...prev,
        points: prev.points + 2
      }));
      addNotification('Prayed for request! +2 points 🙏');
    }
  };

  // FIX: Enhanced likeTestimonial function
  const likeTestimonial = (testimonialId) => {
    setTestimonials(prev => prev.map(testimonial => {
      if (testimonial.id === testimonialId && !likedTestimonials.includes(testimonialId)) {
        return {
          ...testimonial,
          likes: testimonial.likes + 1,
          likedBy: [...(testimonial.likedBy || []), currentUser.name]
        };
      }
      return testimonial;
    }));
    
    if (!likedTestimonials.includes(testimonialId)) {
      setLikedTestimonials(prev => [...prev, testimonialId]);
      addNotification('Testimony liked! ❤️');
    }
  };

  // FIX: Complete trails component
  const TrailsComponent = () => {
    const [filteredTrails, setFilteredTrails] = useState(trailData);
    const [selectedTrail, setSelectedTrail] = useState(null);

    const handleFilterChange = (filterType, value) => {
      setTrailFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    };

    const markTrailComplete = (trailId) => {
      const trail = trailData.find(t => t.id === trailId);
      if (trail && !hikedTrails.includes(trailId)) {
        setHikedTrails(prev => [...prev, trailId]);
        setCurrentUser(prev => ({
          ...prev,
          points: prev.points + (trail.points || 20)
        }));
        setProgressMetrics(prev => ({
          ...prev,
          trailsCompleted: prev.trailsCompleted + 1,
          totalMilesHiked: prev.totalMilesHiked + parseFloat(trail.distance)
        }));
        addNotification(`Completed ${trail.name}! +${trail.points} points 🏔️`);
      }
    };

    // Filter trails based on filters
    useEffect(() => {
      let filtered = [...trailData];
      
      if (trailFilters.difficulty !== 'all') {
        filtered = filtered.filter(trail => 
          trail.difficulty.toLowerCase().includes(trailFilters.difficulty.toLowerCase())
        );
      }
      
      if (trailFilters.maxDistance < 30) {
        filtered = filtered.filter(trail => 
          parseFloat(trail.distance) <= trailFilters.maxDistance
        );
      }
      
      setFilteredTrails(filtered);
    }, [trailFilters]);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Mountain className="w-7 h-7 text-white" />
            Trail Finder
          </h2>
          <p className="text-green-100">Discover and track hiking trails</p>
        </div>

        {/* Trail Filters */}
        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Max Distance</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={trailFilters.maxDistance}
                  onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium">{trailFilters.maxDistance} miles</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={trailFilters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full bg-slate-700/50 rounded-lg px-4 py-2"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setTrailFilters({
                  maxDistance: 30,
                  minLength: 0,
                  maxLength: 30,
                  difficulty: 'all'
                })}
                className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Trail List */}
          <div className="space-y-4">
            {filteredTrails.map(trail => (
              <div key={trail.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mountain className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold">{trail.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trail.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                        trail.difficulty === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {trail.difficulty}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-slate-400" />
                        <span>{trail.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TimeIcon className="w-4 h-4 text-slate-400" />
                        <span>{trail.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span>{trail.elevation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{trail.points} pts</span>
                      </div>
                    </div>
                    <p className="text-slate-300 mt-3">{trail.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <button
                      onClick={() => markTrailComplete(trail.id)}
                      disabled={hikedTrails.includes(trail.id)}
                      className={`w-full py-2 rounded-lg font-medium ${
                        hikedTrails.includes(trail.id)
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {hikedTrails.includes(trail.id) ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => setSelectedTrail(trail)}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trail Progress */}
        <ProgressTracker />
      </div>
    );
  };

  // FIX: Enhanced MapVisualization with better positioning
  const MapVisualization = () => {
    const distanceToBase = getDistanceToBase();
    const directionToBase = getDirectionToBase();
    
    const getMapPosition = () => {
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        return { top: '50%', left: '50%' };
      }
      
      // Calculate relative position
      const latDiff = currentLocation.lat - baseLocation.lat;
      const lngDiff = currentLocation.lng - baseLocation.lng;
      
      // Convert to percentage (approx 0.1 degree = 10% on map)
      const scale = 500; // Increased scale for better visibility
      const top = 50 - (latDiff * scale);
      const left = 50 + (lngDiff * scale);
      
      return {
        top: `${Math.max(5, Math.min(95, top))}%`,
        left: `${Math.max(5, Math.min(95, left))}%`
      };
    };
    
    const position = getMapPosition();
    
    return (
      <div className="mt-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-5 border border-blue-700/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapIcon2 className="w-5 h-5 text-blue-400" />
            Location Map Visualization
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMapZoom(prev => Math.min(prev + 2, 20))}
              className="p-1 bg-slate-700/50 rounded hover:bg-slate-700"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setMapZoom(prev => Math.max(prev - 2, 8))}
              className="p-1 bg-slate-700/50 rounded hover:bg-slate-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={getUserLocation}
              className="p-2 bg-blue-600/50 rounded hover:bg-blue-600"
            >
              <Navigation2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="relative bg-slate-800/30 rounded-xl p-4 mb-4 border border-slate-700">
          {/* Map container */}
          <div className="relative h-64 w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-slate-700">
            {/* Background pattern */}
            <div className="absolute inset-0">
              {/* Grid */}
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute h-px bg-slate-700/50 w-full" style={{ top: `${i * 10}%` }}></div>
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute w-px bg-slate-700/50 h-full" style={{ left: `${i * 10}%` }}></div>
              ))}
              
              {/* Lake District features */}
              <div className="absolute w-1/3 h-1/4 left-1/3 top-1/3 bg-blue-900/20 border border-blue-700/30 rounded-full"></div>
              <div className="absolute w-16 h-16 bg-gray-800/40 rounded-full top-1/4 left-1/4"></div>
              <div className="absolute w-20 h-20 bg-gray-800/40 rounded-full top-3/4 left-3/4"></div>
            </div>
            
            {/* Base location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg animate-pulse">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg">
                  Base Camp
                </div>
              </div>
            </div>
            
            {/* User location marker - FIXED POSITIONING */}
            {currentLocation && currentLocation.lat && currentLocation.lng && (
              <div className="absolute z-20" style={position}>
                <div className="relative animate-bounce">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-bold bg-blue-900/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-blue-700">
                    You are here
                  </div>
                </div>
                
                {/* Connection line */}
                <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
                     width="100%" height="100%" style={{pointerEvents: 'none'}}>
                  <line 
                    x1="50%" y1="50%" 
                    x2={position.left} y2={position.top}
                    stroke="#10b981" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                </svg>
              </div>
            )}
            
            {/* Compass */}
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
              <Compass className="w-5 h-5 text-slate-400" />
            </div>
            
            {/* Scale */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-white"></div>
                <span className="text-xs">~5 miles</span>
              </div>
            </div>
          </div>
          
          {/* Location info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Distance to Base</div>
              <div className="text-2xl font-bold text-emerald-400">{distanceToBase} miles</div>
              <div className="text-sm text-slate-300 mt-1">
                Direction: <span className="text-emerald-300 font-medium">{directionToBase}</span>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Your Coordinates</div>
              <div className="text-sm font-mono text-slate-300">
                {currentLocation ? (
                  <>
                    {currentLocation.lat?.toFixed(4) || 'N/A'}° N<br/>
                    {currentLocation.lng?.toFixed(4) || 'N/A'}° W
                  </>
                ) : (
                  'Location not available'
                )}
              </div>
              {currentLocation?.accuracy && (
                <div className="text-xs text-slate-400 mt-1">
                  Accuracy: ±{(currentLocation.accuracy * 0.000621371).toFixed(1)} miles
                </div>
              )}
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-400 mb-1">Base Coordinates</div>
              <div className="text-sm font-mono text-slate-300">
                {baseLocation.lat.toFixed(4)}° N<br/>
                {baseLocation.lng.toFixed(4)}° W
              </div>
              <div className="text-xs text-slate-400 mt-1">Bury Jubilee Centre</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-slate-400 italic">
          Map visualization showing your position relative to base camp. Enable location services for accurate tracking.
        </div>
      </div>
    );
  };

  // FIX: Update the prayer component textarea
  const PrayerComponent = () => {
    // ... (keep existing PrayerComponent code, but ensure textarea has proper styling)
    
    return (
      <div className="space-y-6">
        {/* ... other prayer component code ... */}
        
        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Share a Prayer Request</h3>
          <div className="space-y-4 mb-6">
            <textarea
              value={prayerText}
              onChange={(e) => setPrayerText(e.target.value)}
              placeholder="Share what's on your heart... (Max 500 characters)"
              className="w-full bg-slate-700/50 rounded-xl p-4 min-h-[120px] resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">
                {prayerText.length}/500 characters
              </span>
              <button
                onClick={addPrayerRequest}
                className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-medium"
              >
                Share Request
              </button>
            </div>
          </div>
          
          {/* ... rest of prayer component ... */}
        </div>
      </div>
    );
  };

  // FIX: Update the testimonial component textarea
  const TestimonialsComponent = () => {
    // ... (keep existing TestimonialsComponent code, but ensure textarea has proper styling)
    
    return (
      <div className="space-y-6">
        {/* ... other testimonial component code ... */}
        
        <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Share Your Story</h3>
          <div className="space-y-4 mb-6">
            <textarea
              value={testimonialText}
              onChange={(e) => setTestimonialText(e.target.value)}
              placeholder="Share how God is working during this retreat... (Max 1000 characters)"
              className="w-full bg-slate-700/50 rounded-xl p-4 min-h-[120px] resize-none focus:ring-2 focus:ring-amber-500 focus:outline-none"
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">
                {testimonialText.length}/1000 characters
              </span>
              <button
                onClick={addTestimonial}
                className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-lg font-medium"
              >
                Share Story
              </button>
            </div>
          </div>
          
          {/* ... rest of testimonial component ... */}
        </div>
      </div>
    );
  };

  // Add hidden file input for photos
  const hiddenFileInput = (
    <input
      type="file"
      ref={photoInputRef}
      onChange={onPhotoFileSelect}
      accept="image/*"
      className="hidden"
    />
  );

  // ... rest of your component code remains the same

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Add the hidden file input */}
      {hiddenFileInput}
      
      {/* ... rest of your JSX code ... */}
      
      {/* Update the photos upload button */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* ... existing photos component code ... */}
          
          <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
            {/* ... existing header ... */}
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Share Your Photos</h3>
                <p className="text-sm text-slate-400">Upload photos from the retreat</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="bg-slate-700/50 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                <button
                  onClick={handlePhotoUpload}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>
            
            {/* ... rest of photos component ... */}
          </div>
        </div>
      )}
    </div>
  );
}
