'use client';

import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

export interface VapiMessage {
  type: string;
  transcript?: string;
  role?: 'user' | 'assistant';
  content?: string;
  timestamp?: string;
}

export function useVapi() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VapiMessage[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsSessionActive(true);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsSessionActive(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant finished speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message: any) => {
      console.log('Message received:', message);
      
      // Only process final transcripts, not partial ones
      if (message.type === 'transcript' && message.transcript && message.transcriptType === 'final') {
        setMessages((prev) => {
          const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          // Check if the last message is from the same role and recent (within 5 seconds)
          const lastMessage = prev[prev.length - 1];
          const isRecentMessage = lastMessage && 
            lastMessage.role === message.role && 
            lastMessage.timestamp === timestamp;
          
          if (isRecentMessage) {
            // Append to the existing message
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + ' ' + message.transcript,
            };
            return updated;
          } else {
            // Add as a new message
            return [
              ...prev,
              {
                type: 'transcript',
                role: message.role,
                content: message.transcript,
                timestamp,
              },
            ];
          }
        });
      }
    });

    vapiInstance.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapiInstance.on('error', (error: any) => {
      console.warn('VAPI error:', error);
      // Don't treat VAPI errors as critical - they're often just connection issues
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const start = useCallback(async () => {
    if (!vapi) return;

    try {
      // Use the assistant ID from VAPI dashboard
      await vapi.start('b497d653-42b2-4657-b831-9dfc975254a5');
    } catch (error) {
      console.error('Failed to start VAPI:', error);
    }
  }, [vapi]);

  const stop = useCallback(() => {
    if (!vapi) return;
    vapi.stop();
  }, [vapi]);

  const send = useCallback((message: string) => {
    if (!vapi) return;
    vapi.send({
      type: 'add-message',
      message: {
        role: 'system',
        content: message,
      },
    });
  }, [vapi]);

  const receiveAgentMessage = useCallback((agentData: { action: string; message: string; data?: any }) => {
    if (!vapi) return;
    
    // Send to VAPI as system message so it speaks it out
    vapi.send({
      type: 'add-message',
      message: {
        role: 'system',
        content: `ALERT: ${agentData.message}. Please acknowledge.`
      }
    });
    
    // Also add to local messages for UI display
    setMessages(prev => [...prev, {
      type: 'agent-alert',
      role: 'assistant',
      content: agentData.message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [vapi]);

  return {
    isSessionActive,
    isSpeaking,
    messages,
    volumeLevel,
    start,
    stop,
    send,
    receiveAgentMessage,
  };
}

