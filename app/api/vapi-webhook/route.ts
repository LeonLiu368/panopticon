import { NextRequest, NextResponse } from 'next/server';

// In-memory store for agent messages (for SSE streaming)
// In production, use Redis or similar
let agentMessages: Array<{ action: string; message: string; timestamp: string; data?: any }> = [];
const MAX_MESSAGES = 100;

// POST: Receive messages from AI agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, data } = body;

    if (!action || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: action and message are required' },
        { status: 400 }
      );
    }

    // Store message with timestamp
    const agentMessage = {
      action,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    agentMessages.push(agentMessage);
    
    // Keep only last 100 messages
    if (agentMessages.length > MAX_MESSAGES) {
      agentMessages = agentMessages.slice(-MAX_MESSAGES);
    }

    console.log(`[VAPI Webhook] Received ${action}: ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Agent message received',
      queued: agentMessages.length
    });
  } catch (error) {
    console.error('VAPI webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET: Retrieve recent messages (for polling)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const since = url.searchParams.get('since');
    
    let messages = agentMessages;
    
    // Filter by timestamp if provided
    if (since) {
      const sinceDate = new Date(since);
      messages = messages.filter(msg => new Date(msg.timestamp) > sinceDate);
    }

    return NextResponse.json({
      messages,
      count: messages.length,
      latest_timestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    });
  } catch (error) {
    console.error('Error fetching VAPI messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

