import { NextRequest, NextResponse } from 'next/server';
import { readSubscriptionsFromFile } from '@/lib/file-storage';

export async function GET(req: NextRequest) {
  try {
    const fileSubscriptions = readSubscriptionsFromFile();
    
    return NextResponse.json({ 
      fileStorage: fileSubscriptions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error debugging subscriptions:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to debug subscriptions',
        fileStorage: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}