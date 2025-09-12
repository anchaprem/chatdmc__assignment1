import { NextRequest, NextResponse } from 'next/server';
import { readSubscriptionsFromFile, storeSubscriptionToFile } from '@/lib/file-storage';

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, updates } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Read current subscriptions
    const subscriptions = readSubscriptionsFromFile();
    const subscriptionIndex = subscriptions.findIndex(sub => sub.id === subscriptionId);

    if (subscriptionIndex === -1) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update the subscription
    const updatedSubscription = {
      ...subscriptions[subscriptionIndex],
      ...updates,
      // Ensure dates are properly handled
      currentPeriodStart: subscriptions[subscriptionIndex].currentPeriodStart,
      currentPeriodEnd: subscriptions[subscriptionIndex].currentPeriodEnd,
    };

    // Store updated subscription
    storeSubscriptionToFile(updatedSubscription);

    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription 
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to update subscription' 
      },
      { status: 500 }
    );
  }
}