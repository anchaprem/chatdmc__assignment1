import { NextResponse } from 'next/server';
import { readSubscriptionsFromFile, writeSubscriptionsToFile } from '@/lib/file-storage';

export async function GET() {
  try {
    // Get subscriptions from file
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

export async function DELETE() {
  try {
    // Clear all subscriptions
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