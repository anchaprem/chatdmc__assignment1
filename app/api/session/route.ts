import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getPlanById } from '@/lib/subscription-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get subscription details if available
    let subscriptionData = null;
    if (session.subscription && typeof session.subscription === 'object') {
      const subscription = session.subscription;
      const priceId = subscription.items?.data[0]?.price?.id;
      
      // Figure out which plan based on price ID
      let planId = 'monthly';
      if (priceId === 'price_1S5qavBpmBtDUil154oVhrMz') {
        planId = 'yearly';
      }
      
      const plan = getPlanById(planId);
      
      subscriptionData = {
        id: subscription.id,
        status: subscription.status,
        amount: subscription.items?.data[0]?.price?.unit_amount || 0,
        currency: subscription.items?.data[0]?.price?.currency || 'usd',
        plan: plan?.name || 'Unknown Plan',
        planId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      // Store subscription data for client-side storage
      // TODO: Use database in production
      const storageData = {
        id: subscription.id,
        planId,
        status: subscription.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        amount: subscription.items?.data[0]?.price?.unit_amount || 0,
        currency: subscription.items?.data[0]?.price?.currency || 'usd',
        customerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
      };

      // Send data back to client
      return NextResponse.json({
        session: {
          id: session.id,
          status: session.payment_status,
          amount: subscriptionData.amount,
          currency: subscriptionData.currency,
          plan: subscriptionData.plan,
        },
        subscription: storageData
      });
    }

    // Return basic session info for non-subscription sessions
    return NextResponse.json({
      session: {
        id: session.id,
        status: session.payment_status,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        plan: 'Unknown Plan',
      },
      subscription: null
    });

  } catch (error) {
    console.error('Error retrieving session:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to retrieve session' 
      },
      { status: 500 }
    );
  }
}