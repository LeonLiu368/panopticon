"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, SkipBack, SkipForward, Wind, Activity, AlertTriangle, Mic, Volume2, ChevronLeft, ChevronRight, PanelLeft, PanelRight, MicOff, ChevronUp, Minimize2, Bot, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import CaliforniaMap from "@/components/california-map"
import { useVapi } from "@/hooks/use-vapi"
import { useWeather } from "@/hooks/use-weather"
import IncidentsList from '@/components/IncidentsList'
import { PoliceIncident, FireIncident } from '@/lib/composio-telegram-service'

// Helper functions for severity-based colors
function getHumidityColor(humidity: number): string {
  if (humidity < 20) return '#FF4444'; // Critical - very dry, high fire risk
  if (humidity < 30) return '#FF6B00'; // High risk
  if (humidity < 50) return '#FFA800'; // Moderate
  return '#00C2FF'; // Good
}

function getTemperatureColor(temp: number): string {
  if (temp >= 100) return '#FF4444'; // Extreme heat
  if (temp >= 90) return '#FF6B00'; // Very hot
  if (temp >= 80) return '#FFA800'; // Hot
  if (temp >= 70) return '#00C2FF'; // Warm
  if (temp >= 50) return '#00FFB3'; // Mild
  return '#00C2FF'; // Cool
}

function getVisibilityColor(visibilityMiles: number): string {
  if (visibilityMiles < 1) return '#FF4444'; // Poor
  if (visibilityMiles < 3) return '#FF6B00'; // Moderate
  if (visibilityMiles < 6) return '#FFA800'; // Fair
  return '#00C2FF'; // Good
}

function getVisibilityLabel(visibilityMiles: number): string {
  if (visibilityMiles < 1) return 'Poor';
  if (visibilityMiles < 3) return 'Moderate';
  if (visibilityMiles < 6) return 'Fair';
  return 'Good';
}

function getAirQualityColor(aqi: number): string {
  if (aqi >= 201) return '#8B1A1A'; // Very Unhealthy (Purple/Maroon)
  if (aqi >= 151) return '#FF4444'; // Unhealthy (Red)
  if (aqi >= 101) return '#FF6B00'; // Unhealthy for Sensitive Groups (Orange)
  if (aqi >= 51) return '#FFA800'; // Moderate (Yellow)
  return '#00FFB3'; // Good (Green)
}

function getAirQualityLabel(aqi: number): string {
  if (aqi >= 201) return 'Very Unhealthy';
  if (aqi >= 151) return 'Unhealthy';
  if (aqi >= 101) return 'Unhealthy (Sensitive)';
  if (aqi >= 51) return 'Moderate';
  return 'Good';
}

export default function OrionDashboard() {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [aiAssistantCollapsed, setAiAssistantCollapsed] = useState(false)
  const [environmentalConditionsCollapsed, setEnvironmentalConditionsCollapsed] = useState(false)
  const [activeIncidentsCollapsed, setActiveIncidentsCollapsed] = useState(false)
  const [incidentCount, setIncidentCount] = useState(0)
  const [currentIncidents, setCurrentIncidents] = useState<PoliceIncident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<PoliceIncident | null>(null)
  const [alertSending, setAlertSending] = useState(false)
  const [alertStatus, setAlertStatus] = useState<string | null>(null)
  const [unitStats, setUnitStats] = useState<{ available: number; dispatched: number; active: number; eta?: string }>({ available: 0, dispatched: 0, active: 0 })
  const [allUnitStats, setAllUnitStats] = useState<{ available: number; dispatched: number; active: number }>({ available: 0, dispatched: 0, active: 0 })
  const [dispatchSending, setDispatchSending] = useState(false)
  const [refreshUnitTrigger, setRefreshUnitTrigger] = useState(0)
  
  // VAPI voice integration
  const { isSessionActive, isSpeaking, messages: vapiMessages, volumeLevel, start, stop, receiveAgentMessage } = useVapi()
  
  // Map center tracking for weather
  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(null)
  const { weather, loading: weatherLoading } = useWeather(mapCenter?.lat ?? null, mapCenter?.lon ?? null)
  
  // Poll for AI agent messages
  useEffect(() => {
    let lastTimestamp: string | null = null;
    
    const pollAgentMessages = async () => {
      try {
        const url = lastTimestamp 
          ? `/api/vapi-webhook?since=${encodeURIComponent(lastTimestamp)}`
          : '/api/vapi-webhook';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          // Process each new message
          data.messages.forEach((msg: any) => {
            receiveAgentMessage({
              action: msg.action,
              message: msg.message,
              data: msg.data
            });
          });
          
          // Update last timestamp
          lastTimestamp = data.latest_timestamp;
        }
      } catch (error) {
        console.error('Error polling agent messages:', error);
      }
    };
    
    // Poll every 5 seconds
    const interval = setInterval(pollAgentMessages, 5000);
    pollAgentMessages(); // Initial poll
    
    return () => clearInterval(interval);
  }, [receiveAgentMessage])
  
  // Map navigation function
  const [navigateToIncident, setNavigateToIncident] = useState<((incident: any) => void) | null>(null)
  
  // Map ready callback
  const handleMapReady = (navFunction: any) => {
    setNavigateToIncident(() => navFunction);
  };

  // Map movement callback
  const handleMapMove = (center: { lat: number; lon: number }) => {
    setMapCenter(center);
  };
  
  const handleVoiceToggle = () => {
    if (isSessionActive) {
      stop()
    } else {
      start()
    }
  }

  const handleIncidentSelect = (incident: any) => {
    if (!incident) {
      console.warn('No incident provided to handleIncidentSelect');
      return;
    }
    
    // Convert to PoliceIncident format with last_update
    const policeIncident: PoliceIncident = {
      id: typeof incident.id === 'string' ? incident.id : String(incident.id || ''),
      name: incident.name || null,
      priority: incident.priority || incident.risk || null, // Support both priority and risk
      lat: incident.lat || null,
      lon: incident.lon || null,
      containment: incident.containment || null,
      last_update: incident.last_update || new Date().toISOString(),
      description: incident.description || null,
      incident_type: incident.incident_type || null
    };
    setSelectedIncident(policeIncident);
  };

  const handleUnitUpdate = useCallback(async (stats: { available: number; dispatched: number; active: number }, activeUnits?: any[]) => {
    // Store global stats
    setAllUnitStats(stats);
    
    // If we have a selected incident, calculate stats for nearby police stations
    if (selectedIncident && activeUnits) {
      try {
        // Fetch all police stations with their unit stats
        const response = await fetch('/api/dispatch-unit');
        const data = await response.json();
        
        if (data.stats) {
          // Calculate distance from incident to each station
          const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };
          
          // Get police stations data
          const stationsResponse = await fetch('/api/incident-state');
          const stationsData = await stationsResponse.json();
          const stations = stationsData.stations || [];
          
          // Find stations within 100km of this incident
          const nearbyStations = stations.filter((station: any) => {
            const distance = calculateDistance(
              selectedIncident.lat || 0,
              selectedIncident.lon || 0,
              station.lat,
              station.lon
            );
            return distance <= 100; // 100km radius
          });
          
          // Calculate available units from nearby stations only
          const nearbyStationIds = new Set(nearbyStations.map((s: any) => s.id));
          const availableNearby = data.stats
            .filter((s: any) => nearbyStationIds.has(s.station_id))
            .reduce((sum: number, s: any) => sum + (s.available_units || 0), 0);
          
          // Filter for THIS incident
          const incidentId = String(selectedIncident.id);
          const forThisIncident = activeUnits.filter((u: any) => String(u.incident_id) === incidentId);
          
          const dispatched = forThisIncident.filter((u: any) => u.status === 'dispatched' || u.status === 'en_route').length;
          const active = forThisIncident.filter((u: any) => u.status === 'on_scene').length;
          
          // Calculate ETA for dispatched units
          let eta = undefined;
          if (dispatched > 0) {
            // Find nearest station to incident
            let minDistance = Infinity;
            for (const station of nearbyStations) {
              const distance = calculateDistance(
                selectedIncident.lat || 0,
                selectedIncident.lon || 0,
                station.lat,
                station.lon
              );
              if (distance < minDistance) {
                minDistance = distance;
              }
            }
            // Assume average speed of 60 mph (1 mile per minute)
            // Convert km to miles and calculate minutes
            const distanceMiles = minDistance * 0.621371;
            const estimatedMinutes = Math.ceil(distanceMiles / 1.0); // 60 mph = 1 mile per minute
            eta = `${estimatedMinutes} min`;
          }
          
          setUnitStats({
            available: availableNearby, // Available units from nearby stations only
            dispatched: dispatched, // Units en route to THIS incident
            active: active, // Units on scene at THIS incident
            eta: eta
          });
        }
      } catch (error) {
        console.error('Error fetching incident-specific stats:', error);
        // Fallback to global stats
        setUnitStats(stats);
      }
    } else {
      // No incident selected, show global stats
      setUnitStats(stats);
    }
  }, [selectedIncident]);

  // Update unit stats when selected incident changes
  useEffect(() => {
    // Trigger a recalculation of stats for the new incident
    setRefreshUnitTrigger(prev => prev + 1);
  }, [selectedIncident?.id]);

  const handleIncidentClick = (incident: any) => {
    // Validate incident object and coordinates before attempting navigation
    // Note: navigateToIncident will call onIncidentSelect which sets selectedIncident
    if (incident && 
        incident.lat && incident.lon && 
        !isNaN(incident.lat) && !isNaN(incident.lon) &&
        incident.lat !== 0 && incident.lon !== 0 &&
        navigateToIncident) {
      handleIncidentSelect(incident)
      navigateToIncident(incident)
    } else {
      console.warn('Cannot navigate to incident with invalid data:', {
        incident: incident ? incident.id : 'null',
        name: incident?.name,
        lat: incident?.lat,
        lon: incident?.lon
      });
    }
  }

  const handleEmergencyAlert = async () => {
    if (!selectedIncident) {
      setAlertStatus('Please select an incident first');
      setTimeout(() => setAlertStatus(null), 3000);
      return;
    }

    setAlertSending(true);
    setAlertStatus(null);

    try {
      const response = await fetch('/api/send-emergency-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident: selectedIncident,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAlertStatus(`Emergency alert sent successfully! Message ID: ${result.messageSid}`);
      } else {
        setAlertStatus(`Failed to send alert: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      setAlertStatus('Failed to send emergency alert. Please try again.');
    } finally {
      setAlertSending(false);
      // Clear status after 5 seconds
      setTimeout(() => setAlertStatus(null), 5000);
    }
  }

  const handleDispatchUnit = async () => {
    if (!selectedIncident) {
      console.warn('[UI] No incident selected');
      return;
    }

    if (unitStats.available === 0) {
      console.warn('[UI] No available units');
      return;
    }

    console.log('[UI] Dispatching unit for incident:', selectedIncident.id);
    setDispatchSending(true);

    try {
      const response = await fetch('/api/dispatch-unit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidentId: selectedIncident.id,
          incidentLat: selectedIncident.lat,
          incidentLon: selectedIncident.lon,
        }),
      });

      const result = await response.json();
      console.log('[UI] Dispatch response:', result);

      if (result.success) {
        console.log('[UI] ✅ Dispatch successful, refreshing unit data');
        // Trigger unit refresh
        setRefreshUnitTrigger(prev => prev + 1);
      } else {
        console.error('[UI] ❌ Dispatch failed:', result.error);
        console.error('[UI] Error details:', result.details);
        console.error('[UI] Full response:', result);
      }
    } catch (error) {
      console.error('[UI] Error dispatching unit:', error);
    } finally {
      setDispatchSending(false);
    }
  }

  // Calculate dynamic height based on actual incident count and content
  const calculateDynamicHeight = () => {
    if (incidentCount === 0) return 200 // Minimum height when no incidents
    
    // Calculate based on actual content - no extra padding at bottom:
    // - Header section: ~80px (title + padding)
    // - Each incident item: ~120px (actual content size)
    // - Space between items: 16px (space-y-4)
    // - Container padding: 48px (p-6 = 24px top + 24px bottom)
    
    const headerHeight = 80
    const containerPadding = 48
    const itemHeight = 120 // Actual content size
    const itemSpacing = 16
    
    // Calculate exact height needed - no extra space
    const totalItemHeight = incidentCount * itemHeight
    const totalSpacingHeight = Math.max(0, (incidentCount - 1) * itemSpacing)
    const exactContentHeight = headerHeight + containerPadding + totalItemHeight + totalSpacingHeight
    
    // Set reasonable bounds
    const minHeight = 200
    const maxHeight = 600
    
    return Math.max(minHeight, Math.min(exactContentHeight, maxHeight))
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* Full-screen interactive map background */}
      <div className="absolute inset-0 z-0">
        <CaliforniaMap 
          className="w-full h-full" 
          onMapReady={handleMapReady}
          onMapMove={handleMapMove}
          windSpeed={weather?.wind.speed}
          windDirection={weather?.wind.deg}
          onIncidentSelect={handleIncidentSelect}
          onUnitUpdate={handleUnitUpdate}
          refreshUnitTrigger={refreshUnitTrigger}
          selectedIncidentId={selectedIncident?.id || null}
        />
      </div>

      {/* Top Navigation - Glass Panel */}
      <header className="relative h-16 glass-panel-interactive rounded-none border-b border-white/10 flex items-center justify-between px-8 shrink-0 z-20 fade-in">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Police Dispatch</h1>
          </div>
          <span className="text-sm text-white/70 font-medium">Control Center</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00C2FF] cyan-glow" />
            <span className="text-sm text-white/90 font-medium">Operational</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Wind className="w-4 h-4" />
            <span className="text-sm font-medium">
              {weatherLoading ? (
                "Loading..."
              ) : weather ? (
                `${weather.wind.speed} mph ${weather.wind.direction}`
              ) : (
                "15 mph NW"
              )}
            </span>
          </div>
        </div>
      </header>

      <div className="relative flex-1 flex gap-6 p-6 overflow-hidden z-10 pointer-events-none">
        {/* Left Sidebar - Overview */}
        <aside className="w-[320px] flex flex-col gap-4 pointer-events-auto">
          {/* Active Incidents */}
          <div className="glass-panel rounded-xl fade-in">
            {activeIncidentsCollapsed ? (
              /* Collapsed State */
              <div 
                className="p-3 cursor-pointer hover:bg-white/5 transition-all duration-200"
                onClick={() => setActiveIncidentsCollapsed(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-white">Active Incidents</h2>
                    <Badge className="bg-[#FF6B00]/20 text-[#FF6B00] border-0 text-xs font-medium px-2 py-1">{incidentCount}</Badge>
                </div>
                  <ChevronUp className="w-4 h-4 text-white/60" />
                </div>
              </div>
            ) : (
              /* Expanded State */
              <div 
                className="p-6 flex flex-col overflow-hidden"
                style={{ 
                  minHeight: '200px', 
                  maxHeight: '420px',
                  height: `${Math.min(calculateDynamicHeight(), 420)}px`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">Active Incidents</h2>
                  <div className="flex items-center gap-2">
                  <Badge className="bg-[#FF6B00]/20 text-[#FF6B00] border-0 text-xs font-medium px-2 py-1">{incidentCount}</Badge>
                    <Button
                      onClick={() => setActiveIncidentsCollapsed(true)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200"
                    >
                      <Minimize2 className="w-3 h-3 text-white/60" />
                    </Button>
                  </div>
            </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  <IncidentsList 
                    onIncidentClick={handleIncidentClick} 
                    onIncidentCountChange={setIncidentCount}
                    onIncidentsUpdate={setCurrentIncidents}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Unit Status & Controls - Show when incident is selected */}
          {selectedIncident && (
            <div className="glass-panel rounded-lg fade-in p-2 space-y-1.5 mt-2">
              {/* Compact Header */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">🚓</span>
                <h4 className="text-[10px] font-semibold text-white">Available Units</h4>
              </div>
              
              {/* Compact Unit Stats */}
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="bg-white/5 rounded p-1">
                  <div className="text-base font-bold text-[#00FFB3] leading-none">{unitStats.available}</div>
                  <div className="text-[9px] text-white/60 mt-0.5">Available</div>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <div className="text-base font-bold text-[#FFA800] leading-none">{unitStats.dispatched}</div>
                  <div className="text-[9px] text-white/60 mt-0.5">En Route</div>
                </div>
                <div className="bg-white/5 rounded p-1">
                  <div className="text-base font-bold text-[#FF6B00] leading-none">{unitStats.active}</div>
                  <div className="text-[9px] text-white/60 mt-0.5">On Scene</div>
                </div>
              </div>

              {/* ETA Display - Only show when units are en route */}
              {unitStats.eta && unitStats.dispatched > 0 && (
                <div className="bg-blue-500/10 border border-blue-400/20 rounded px-2 py-1 text-center">
                  <span className="text-[9px] text-blue-300/70">ETA:</span>
                  <span className="text-xs font-bold text-blue-400 ml-1">{unitStats.eta}</span>
                </div>
              )}

              {/* Compact Dispatch Button */}
              <Button 
                onClick={handleDispatchUnit}
                disabled={dispatchSending || !selectedIncident || unitStats.available === 0}
                className={`w-full border-0 h-8 rounded-md text-[10px] font-semibold shadow-lg transition-all duration-200 ${
                  selectedIncident && !dispatchSending && unitStats.available > 0
                    ? 'bg-gradient-to-r from-[#3b82f6] to-[#1e40af] hover:from-[#3b82f6]/90 hover:to-[#1e40af]/90 text-white hover:scale-[1.02]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {dispatchSending ? 'Dispatching...' : unitStats.available > 0 ? `Send Unit` : 'No Units'}
              </Button>
            </div>
          )}
        </aside>

        {/* Center - Transparent area for map interaction */}
        <main className="flex-1 relative pointer-events-none">
          {/* This area allows map interaction while being transparent */}
        </main>

        {/* Right Sidebar - Relative Base Positions with Independent Movement */}
        <aside className="w-[380px] h-[calc(100vh-8rem)] relative pointer-events-auto">
          {/* AI Assistant - Base Position Relative to Top */}
          <div className="glass-panel-interactive rounded-xl fade-in absolute top-0 right-0 w-full z-20">
            {aiAssistantCollapsed ? (
              /* Collapsed State */
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
                    {/* Microphone button next to title */}
                    <Button
                      onClick={handleVoiceToggle}
                      size="sm"
                      className={`transition-all duration-300 ${
                        isSessionActive
                          ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 fire-glow'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {isSessionActive ? (
                        <MicOff className="w-4 h-4 text-white" />
                      ) : (
                        <Mic className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Status indicator on the right */}
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isSessionActive ? 'bg-[#00C2FF] cyan-glow' : 'bg-white/20'}`} />
                      <span className="text-xs text-white/70 font-medium">{isSessionActive ? 'Live' : 'Offline'}</span>
                    </div>
                    
                    {/* Expand button */}
                    <Button
                      onClick={() => setAiAssistantCollapsed(false)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200"
                    >
                      <ChevronUp className="w-3 h-3 text-white/60" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Expanded State */
              <div className="p-6 flex flex-col gap-4 h-[350px] overflow-hidden">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">AI Voice Assistant</h2>
                  <div className="flex items-center gap-3">
                    {/* Voice Control Button */}
                    <Button
                      onClick={handleVoiceToggle}
                      size="sm"
                      className={`transition-all duration-300 ${
                        isSessionActive
                          ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 fire-glow'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {isSessionActive ? (
                        <MicOff className="w-4 h-4 text-white" />
                      ) : (
                        <Mic className="w-4 h-4 text-white" />
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-[#00C2FF] cyan-glow' : 'bg-white/20'}`} />
                      <span className="text-xs text-white/70 font-medium">{isSessionActive ? 'Live' : 'Offline'}</span>
                    </div>
                    
                    <Button
                      onClick={() => setAiAssistantCollapsed(true)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200"
                    >
                      <Minimize2 className="w-3 h-3 text-white/60" />
                    </Button>
                  </div>
                </div>

                {/* Volume Level Indicator */}
                {isSessionActive && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg">
                    <Activity className="w-4 h-4 text-[#00C2FF]" />
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00C2FF] to-[#00C2FF]/80 rounded-full transition-all duration-100"
                        style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {/* Show VAPI messages if session has been started, otherwise show welcome message */}
                  {vapiMessages.length > 0 || isSessionActive ? (
                    <>
                      {vapiMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`space-y-3 ${
                            index !== vapiMessages.length - 1 ? 'border-b border-white/10 pb-4' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {message.role === 'assistant' ? (
                              <Volume2 className="w-4 h-4 text-[#00C2FF]" />
                            ) : (
                              <Mic className="w-4 h-4 text-white/60" />
                            )}
                            <span className="text-xs text-white/60 font-mono">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-white/90 leading-relaxed font-medium">
                            {message.content}
                          </p>
                        </div>
                      ))}
                      {isSpeaking && (
                        <div className="space-y-3 animate-pulse">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-[#00C2FF]" />
                            <span className="text-xs text-white/60 font-mono">Now</span>
                          </div>
                          <p className="text-sm text-white/50 leading-relaxed font-medium italic">
                            Speaking...
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-4 max-w-md">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#FF6B00] flex items-center justify-center">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white mb-2">
                            Welcome to Police Dispatch
                          </p>
                          <p className="text-sm text-white/70 mb-4">
                            Your AI-powered police dispatch assistant
                          </p>
                          <div className="text-left space-y-2 text-xs text-white/60">
                            <div className="flex items-start gap-2">
                              <span className="text-[#3b82f6] mt-0.5">•</span>
                              <span>Real-time incident monitoring and alerts</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#3b82f6] mt-0.5">•</span>
                              <span>Live weather and environmental conditions</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#3b82f6] mt-0.5">•</span>
                              <span>Voice-activated incident reporting</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#3b82f6] mt-0.5">•</span>
                              <span>Unit dispatch and coordination</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                   )}
                 </div>
               </div>
             )}
            </div>

          {/* Environmental Conditions - Only show when incident is selected */}
          {selectedIncident && (
          <div className="glass-panel rounded-xl fade-in absolute top-[30px] right-0 w-full z-10">
            {environmentalConditionsCollapsed ? (
              /* Collapsed State */
              <div 
                className="p-3 cursor-pointer hover:bg-white/5 transition-all duration-200"
                onClick={() => setEnvironmentalConditionsCollapsed(false)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Environmental Conditions</h3>
                  <ChevronUp className="w-4 h-4 text-white/60" />
                </div>
              </div>
            ) : (
              /* Expanded State */
              <div className="p-4 flex flex-col overflow-hidden h-[240px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">Environmental Conditions</h3>
                  <Button
                    onClick={() => setEnvironmentalConditionsCollapsed(true)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-white/10 rounded-md transition-all duration-200"
                  >
                    <Minimize2 className="w-3 h-3 text-white/60" />
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-4 h-full">
                    {/* Left Half - Weather */}
                    <div className="flex-1 space-y-3">
                      <h4 className="text-sm font-semibold text-white mb-3">Weather</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 font-medium">Humidity</span>
                          <span className="text-base font-bold" style={{ 
                            color: weather ? getHumidityColor(weather.humidity) : '#00C2FF' 
                          }}>
                            {weatherLoading ? '...' : weather ? `${weather.humidity}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 font-medium">Temperature</span>
                          <span className="text-base font-bold" style={{ 
                            color: weather ? getTemperatureColor(weather.temp) : '#FF6B00' 
                          }}>
                            {weatherLoading ? '...' : weather ? `${weather.temp}°F` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 font-medium">Visibility</span>
                          <span className="text-base font-bold" style={{ 
                            color: weather?.visibility ? getVisibilityColor(weather.visibility) : '#00C2FF' 
                          }}>
                            {weatherLoading ? '...' : weather?.visibility ? getVisibilityLabel(weather.visibility) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/70 font-medium">Air Quality</span>
                          <span className="text-base font-bold" style={{ 
                            color: weather?.airQuality?.aqi ? getAirQualityColor(weather.airQuality.aqi) : '#FF4444' 
                          }}>
                            {weatherLoading ? '...' : weather?.airQuality?.aqi ? getAirQualityLabel(weather.airQuality.aqi) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Half - Risk Factors */}
                    <div className="flex-1 space-y-3">
                      <h4 className="text-sm font-semibold text-white mb-3">Risk Factors</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70 font-medium">Fire Danger</span>
                            <span className="font-semibold text-[#FF4444]">Extreme</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[95%] bg-gradient-to-r from-[#FF4444] to-[#FF4444]/80 rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70 font-medium">Fuel Moisture</span>
                            <span className="font-semibold text-[#FF6B00]">Critical</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[88%] bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/80 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Emergency Alert - Only show when incident is selected */}
          {selectedIncident && (
          <div className="absolute bottom-0 right-0 w-full z-30 space-y-2">
            {/* Alert Status Message */}
            {alertStatus && (
              <div className={`p-3 rounded-lg text-xs font-medium animate-in slide-in-from-bottom-2 ${
                alertStatus.includes('successfully') 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {alertStatus.includes('successfully') ? '✓ ' : '✗ '}
                {alertStatus.replace('Emergency alert sent successfully! Message ID: ', 'Alert sent! SID: ')}
              </div>
            )}
            
            {/* Emergency Alert Button */}
            <Button 
              onClick={handleEmergencyAlert}
              disabled={alertSending || !selectedIncident}
              className={`w-full border-0 h-12 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                selectedIncident && !alertSending
                  ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white hover:scale-[1.02]'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {alertSending ? 'Sending Alert...' : selectedIncident ? `Alert: ${selectedIncident.name}` : 'Select Incident First'}
            </Button>
          </div>
          )}
        </aside>
      </div>
    </div>
  )
}