import { NextRequest, NextResponse } from 'next/server';
import { readSubscriptionsFromFile, writeSubscriptionsToFile } from '@/lib/file-storage';

export async function GET(req: NextRequest) {
  try {
    // Read subscriptions from file storage
    const subscriptions = readSubscriptionsFromFile();
    
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error retrieving subscriptions:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to retrieve subscriptions' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Clear all subscriptions from file storage
    writeSubscriptionsToFile([]);
    
    return NextResponse.json({ success: true, message: 'All subscriptions cleared' });
  } catch (error) {
    console.error('Error clearing subscriptions:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to clear subscriptions' 
      },
      { status: 500 }
    );
  }
}