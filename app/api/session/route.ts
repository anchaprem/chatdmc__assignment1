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

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract subscription details if it exists
    let subscriptionData = null;
    if (session.subscription && typeof session.subscription === 'object') {
      const subscription = session.subscription;
      const priceId = subscription.items?.data[0]?.price?.id;
      
      // Determine plan based on price ID
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
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      };

      // Store subscription data in localStorage via client-side storage
      // This is a temporary solution - in production, use a database
      const storageData = {
        id: subscription.id,
        planId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        amount: subscription.items?.data[0]?.price?.unit_amount || 0,
        currency: subscription.items?.data[0]?.price?.currency || 'usd',
        customerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
      };

      // Return subscription data so client can store it
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

    // For non-subscription sessions, return basic session info
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