
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, ChevronDown, Car, Home, Plane, Cloud } from 'lucide-react';

const BelgiumTripPlanner = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const tripStart = new Date('2026-04-24T00:00:00');
  
  const homeAddress = 'Turnhoutsebaan 124, Antwerp, Vlaams Gewest 2140';
  const airbnbUrl = 'https://www.airbnb.no/rooms/5379855?c=.pi80.pkTUVTU0FHSU5HX05FV19NRVNTQUdFX0VNQUlMX0RJR0VTVA%3D%3D&euid=89572c7e-ce74-68bf-4db0-0011c89423b7&source_impression_id=p3_1776447471_P3bqafetU3f15BrZ';
  
  const activities = [
    {
      id: 0,
      day: 'friday-24',
      date: '2026-04-24',
      time: '18:05',
      name: 'Fly til Brussel',
      description: 'Brussels Airlines SN2284 • OSL → BRU • Ankomst 20:05',
      location: 'Oslo Lufthavn, Gardermoen',
      type: 'flight'
    },
    {
      id: 1,
      day: 'saturday-25',
      date: '2026-04-25',
      time: '17:00',
      name: 'Le Bistro - Porte de Hal',
      description: 'Middagsreservasjon',
      location: 'https://www.google.com/maps/place/Le+Bistro+-+Porte+de+Hal/@50.8337852,4.2989698,8467m/data=!3m1!1e3!4m6!3m5!1s0x47c3c465e98edb6d:0x12d48f1220d176e4!8m2!3d50.8335134!4d4.3452957!16s%2Fg%2F11bxglvkm9'
    },
    {
      id: 2,
      day: 'sunday-26',
      date: '2026-04-26',
      time: '17:30',
      name: 'V Modern Italian Antwerp Tower',
      description: 'Middagsreservasjon',
      location: 'https://www.google.com/maps/place/V+modern+Italian+Antwerp+tower/@51.2153229,4.4069649,5251m/data=!3m1!1e3!4m6!3m5!1s0x47c3f74010187447:0x7c6a6c841d234596!8m2!3d51.2181134!4d4.4162049!16s%2Fg%2F11t3kqwlwg'
    },
    {
      id: 3,
      day: 'sunday-26',
      date: '2026-04-26',
      time: '20:30',
      name: 'Eric Clapton Concert',
      description: 'Konsert på AFAS Dome',
      location: 'AFAS Dome, Antwerp'
    },
    {
      id: 4,
      day: 'monday-27',
      date: '2026-04-27',
      time: '15:20',
      name: 'Fly hjem til Oslo',
      description: 'Brussels Airlines • BRU → OSL • Ankomst 17:15',
      location: 'Brussels Airport (BRU)',
      type: 'flight'
    }
  ];

  const weatherData = [
    { day: 'Fre 24', emoji: '⛅', temp: '14°', desc: 'Delvis skyet' },
    { day: 'Lør 25', emoji: '☀️', temp: '17°', desc: 'Sol' },
    { day: 'Søn 26', emoji: '🌤️', temp: '16°', desc: 'Lettskyet' },
    { day: 'Man 27', emoji: '🌧️', temp: '13°', desc: 'Regn' }
  ];

  const [weatherData_live, setWeatherData_live] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // WMO Weather interpretation codes to emoji + description in Norwegian
  const getWeatherInfo = (code) => {
    if (code === 0) return { emoji: '☀️', desc: 'Klart' };
    if (code === 1) return { emoji: '🌤️', desc: 'Lettskyet' };
    if (code === 2) return { emoji: '⛅', desc: 'Delvis skyet' };
    if (code === 3) return { emoji: '☁️', desc: 'Overskyet' };
    if (code === 45 || code === 48) return { emoji: '🌫️', desc: 'Tåke' };
    if (code >= 51 && code <= 57) return { emoji: '🌦️', desc: 'Yr' };
    if (code >= 61 && code <= 67) return { emoji: '🌧️', desc: 'Regn' };
    if (code >= 71 && code <= 77) return { emoji: '🌨️', desc: 'Snø' };
    if (code >= 80 && code <= 82) return { emoji: '🌧️', desc: 'Regnbyger' };
    if (code >= 85 && code <= 86) return { emoji: '🌨️', desc: 'Snøbyger' };
    if (code >= 95) return { emoji: '⛈️', desc: 'Torden' };
    return { emoji: '🌤️', desc: '—' };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Antwerpen koordinater
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=51.2194&longitude=4.4025&daily=weather_code,temperature_2m_max&timezone=Europe%2FBrussels&start_date=2026-04-24&end_date=2026-04-27'
        );
        const data = await res.json();
        
        if (data.daily) {
          const dayLabels = ['Fre 24', 'Lør 25', 'Søn 26', 'Man 27'];
          const live = data.daily.time.map((date, i) => {
            const info = getWeatherInfo(data.daily.weather_code[i]);
            return {
              day: dayLabels[i] || date,
              emoji: info.emoji,
              temp: `${Math.round(data.daily.temperature_2m_max[i])}°`,
              desc: info.desc
            };
          });
          setWeatherData_live(live);
        }
      } catch (err) {
        console.error('Weather fetch failed:', err);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const displayWeather = weatherData_live || weatherData;

  const days = [
    { id: 'friday-24', label: 'Fredag, Apr 24', date: '2026-04-24', subtitle: 'Ankomst', emoji: '✈️' },
    { id: 'saturday-25', label: 'Lørdag, Apr 25', date: '2026-04-25', emoji: '🌟' },
    { id: 'sunday-26', label: 'Søndag, Apr 26', date: '2026-04-26', emoji: '🎵' },
    { id: 'monday-27', label: 'Mandag, Apr 27', date: '2026-04-27', subtitle: 'Hjemreise', emoji: '🏠' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateCountdown = () => {
    const now = currentTime;
    const diff = tripStart - now;
    
    if (diff < 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const getDayActivities = (dayId) => {
    return activities.filter(a => a.day === dayId).sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openBolt = (address) => {
    // Bolt deep link - opens app if installed, falls back to web
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://bolt.eu/en/?destination=${encodedAddress}`, '_blank');
  };

  const countdown = calculateCountdown();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-50'} transition-colors duration-700 ease-in-out pb-20`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-b backdrop-blur-xl bg-opacity-80 sticky top-0 z-50 transition-all duration-700`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="w-14"></div>
            <h1 className={`text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Tur til Belgia
            </h1>
            
            {/* Apple-style Toggle Switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative w-14 h-8 rounded-full transition-all duration-500 ease-in-out ${
                isDarkMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 ease-in-out transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          <div className={`flex items-center justify-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Apr 24 - 27, 2026</span>
          </div>
          
          {countdown && (
            <div className="flex items-center justify-center gap-2 text-sm font-medium mt-3">
              <span className={`px-3 py-1.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {countdown.days}d
              </span>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>:</span>
              <span className={`px-3 py-1.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {countdown.hours}h
              </span>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>:</span>
              <span className={`px-3 py-1.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {countdown.minutes}m
              </span>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>:</span>
              <span className={`px-3 py-1.5 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-pulse`}>
                {countdown.seconds}s
              </span>
              <span className={`ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} text-xs`}>til avreise</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Weather */}
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} transition-all duration-700`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
              <Cloud className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base`}>Vær i Antwerpen</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {weatherData.map((w, i) => (
              <div key={i} className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-xl p-3 text-center`}>
                <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{w.day}</div>
                <div className="text-2xl mb-1">{w.emoji}</div>
                <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{w.temp}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1 truncate`}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Airbnb */}
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} transition-all duration-700`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
              <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base`}>🏠 Airbnb</h3>
          </div>
          <div 
            onClick={() => copyToClipboard(homeAddress)}
            className={`${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl p-4 cursor-pointer transition-all duration-200 active:scale-[0.99]`}
          >
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{homeAddress}</div>
            <div className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mt-2 font-medium`}>Trykk for å kopiere</div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(homeAddress)}`, '_blank')}
              className={`flex-1 text-sm font-medium flex items-center justify-center gap-2 px-3 py-2.5 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-lg hover:opacity-80 transition-opacity`}
            >
              <MapPin className="w-4 h-4" />
              Åpne i kart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openBolt(homeAddress);
              }}
              className="flex-1 text-sm font-medium flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500/20 text-green-600 rounded-lg hover:opacity-80 transition-opacity"
              style={{ color: isDarkMode ? '#34d399' : '#059669' }}
            >
              <Car className="w-4 h-4" />
              Bestill Bolt
            </button>
            <button
              onClick={() => window.open(airbnbUrl, '_blank')}
              className="flex-1 text-sm font-medium flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 90, 95, 0.2)' : '#fef2f2',
                color: isDarkMode ? '#ff8a8f' : '#ff5a5f'
              }}
            >
              <Home className="w-4 h-4" />
              Airbnb
            </button>
          </div>
        </div>

        {/* Dagsplan */}
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} transition-all duration-700`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>📅 Dagsplan</h2>

          <div className="space-y-3">
            {days.map((day) => {
              const dayActivities = getDayActivities(day.id);
              const isExpanded = expandedDay === day.id;
              const hasActivities = dayActivities.length > 0;

              return (
                <div key={day.id} className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} transition-all duration-200`}>
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                    className={`w-full px-4 py-3 flex justify-between items-center transition-colors duration-200 ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{day.emoji}</span>
                      <div className="text-left">
                        <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base`}>{day.label}</div>
                        {day.subtitle && (
                          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>{day.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActivities && (
                        <span className={`px-2.5 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold`}>
                          {dayActivities.length}
                        </span>
                      )}
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={`px-4 pb-4 pt-2 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                      {dayActivities.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="text-3xl mb-2">✨</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Ingen planer ennå</div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayActivities.map((activity) => (
                            <div 
                              key={activity.id} 
                              className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-xl p-4 transition-all duration-200`}
                            >
                              <div className="flex-1 min-w-0">
                                {activity.time && (
                                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mb-2 flex items-center gap-1`}>
                                    {activity.type === 'flight' ? <Plane className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {activity.time}
                                  </div>
                                )}
                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-base mb-1`}>
                                  {activity.name}
                                </div>
                                {activity.description && (
                                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{activity.description}</div>
                                )}
                                {activity.location && activity.type !== 'flight' && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <button
                                      onClick={() => window.open(activity.location.includes('http') ? activity.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`, '_blank')}
                                      className={`text-xs font-medium flex items-center gap-1 px-3 py-1.5 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-lg hover:opacity-80 transition-opacity`}
                                    >
                                      <MapPin className="w-3 h-3" />
                                      Åpne i kart
                                    </button>
                                    <button
                                      onClick={() => openBolt(activity.name)}
                                      className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                                      style={{ 
                                        backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.2)' : '#ecfdf5',
                                        color: isDarkMode ? '#34d399' : '#059669'
                                      }}
                                    >
                                      <Car className="w-3 h-3" />
                                      Bestill Bolt
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BelgiumTripPlanner;
