'use client';

import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVapi } from '@/hooks/use-vapi';
import { useEffect } from 'react';

export function VoiceAssistant() {
  const { isSessionActive, isSpeaking, messages, volumeLevel, start, stop } = useVapi();

  const handleToggle = () => {
    if (isSessionActive) {
      stop();
    } else {
      start();
    }
  };

  return (
    <div className="glass-panel-interactive rounded-xl p-6 flex flex-col gap-4 flex-1 overflow-hidden fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">AI Voice Assistant</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-[#00C2FF] cyan-glow' : 'bg-white/20'}`} />
          <span className="text-xs text-white/70 font-medium">
            {isSessionActive ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Voice Control Button */}
      <div className="flex justify-center py-4">
        <Button
          onClick={handleToggle}
          size="lg"
          className={`w-20 h-20 rounded-full transition-all duration-300 ${
            isSessionActive
              ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 fire-glow scale-110'
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {isSessionActive ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </Button>
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

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && !isSessionActive && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Mic className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-sm text-white/50">
              Click the microphone to start voice conversation
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`space-y-3 border-b border-white/10 pb-4 ${
              index === messages.length - 1 ? 'border-b-0' : ''
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
      </div>

      {/* Status Text */}
      <div className="text-xs text-center text-white/40">
        {isSessionActive ? (
          <span>🎙️ Voice session active - speak naturally</span>
        ) : (
          <span>Press microphone to activate voice control</span>
        )}
      </div>
    </div>
  );
}

