import { NextRequest, NextResponse } from 'next/server';
import { sendEmergencyAlertViaTelegram, PoliceIncident, FireIncident } from '@/lib/composio-telegram-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { incident, customMessage } = body;

    // Validate required fields
    if (!incident) {
      return NextResponse.json(
        { success: false, error: 'Incident data is required' },
        { status: 400 }
      );
    }

    // Validate incident structure - support both 'risk' (fire) and 'priority' (police)
    const requiredFields = ['id', 'name', 'lat', 'lon', 'last_update'];
    const hasPriority = incident.priority || incident.risk;
    const missingFields = requiredFields.filter(field => !incident[field]);
    
    if (missingFields.length > 0 || !hasPriority) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}${!hasPriority ? ', priority/risk' : ''}` 
        },
        { status: 400 }
      );
    }

    // Send the emergency alert via Composio + Telegram
    const result = await sendEmergencyAlertViaTelegram(incident as PoliceIncident | FireIncident, customMessage);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageSid: result.messageId,
        message: 'Emergency alert sent successfully via Telegram'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to send emergency alert' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send emergency alerts.' },
    { status: 405 }
  );
}
