'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Maximize2, X } from 'lucide-react';
import { getFireVideo } from '@/lib/video-mapping';

interface VideoPreviewProps {
  fireName: string | null;
  className?: string;
}

export default function VideoPreview({ fireName, className = '' }: VideoPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);
  
  const videoInfo = getFireVideo(fireName);
  const hasVideo = videoInfo?.videoUrl;

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('msfullscreenchange', handleFullscreenChange); // IE11

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Listen for ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideoPopup) {
        closeVideoPopup();
      }
    };

    if (showVideoPopup) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showVideoPopup]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      try {
        if (!document.fullscreenElement) {
          // Try native fullscreen first
          if (videoRef.current.requestFullscreen) {
            await videoRef.current.requestFullscreen();
          } else if (videoRef.current.webkitRequestFullscreen) { // Safari
            await videoRef.current.webkitRequestFullscreen();
          } else if (videoRef.current.msRequestFullscreen) { // IE11
            await videoRef.current.msRequestFullscreen();
          } else {
            // Fallback to popup window
            setShowVideoPopup(true);
          }
        } else {
          // Exit fullscreen
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { // Safari
            await document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE11
            await document.msExitFullscreen();
          }
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
        // Fallback to popup window if native fullscreen fails
        setShowVideoPopup(true);
      }
    }
  };

  const handlePopupFullscreen = () => {
    setShowVideoPopup(true);
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (!hasVideo) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center h-32 text-white/60">
          <div className="text-center">
            <X className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Video Currently Unavailable</p>
            <p className="text-xs opacity-75 mt-1">Live footage not available for this incident</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden ${className}`}>
        {/* Video Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Live Footage</h4>
            <p className="text-xs text-white/70">{videoInfo?.description}</p>
          </div>
          <button
            onClick={handleFullscreen}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"></path>
              </svg>
            ) : (
              <Maximize2 className="w-4 h-4 text-white/80" />
            )}
          </button>
        </div>

        {/* Video Container */}
        <div className="relative group">
          <video
            ref={videoRef}
            className="w-full h-32 object-cover cursor-pointer"
            poster={videoInfo?.thumbnailUrl}
            onEnded={handleVideoEnd}
            onClick={handlePlay}
            preload="metadata"
          >
            <source src={videoInfo?.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Overlay - only show when not playing */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePlay}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <Play className="w-6 h-6 text-white" />
              </button>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlay}
                className="p-1.5 bg-black/50 backdrop-blur-sm rounded hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <div className="w-3 h-3 text-white flex space-x-0.5">
                    <div className="w-0.5 h-3 bg-white"></div>
                    <div className="w-0.5 h-3 bg-white"></div>
                  </div>
                ) : (
                  <Play className="w-3 h-3 text-white" />
                )}
              </button>
            </div>
            
            <div className="text-xs text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              {fireName}
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup Modal */}
      {showVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-white">{fireName} - Live Footage</h3>
                <p className="text-sm text-gray-300">{videoInfo?.description}</p>
              </div>
              <button
                onClick={closeVideoPopup}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Popup Video */}
            <div className="relative w-full h-full">
              <video
                ref={popupVideoRef}
                className="w-full h-full object-contain"
                poster={videoInfo?.thumbnailUrl}
                controls
                autoPlay
                preload="metadata"
              >
                <source src={videoInfo?.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Popup Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (popupVideoRef.current) {
                      popupVideoRef.current.pause();
                    }
                  }}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded hover:bg-black/70 transition-colors"
                >
                  <div className="w-4 h-4 text-white flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (popupVideoRef.current) {
                      popupVideoRef.current.play();
                    }
                  }}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded hover:bg-black/70 transition-colors"
                >
                  <Play className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="text-sm text-white/80 bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                Press ESC to close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
