import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { storeSubscriptionToFile, removeSubscriptionFromFile } from '@/lib/file-storage';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing Stripe signature');
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // Process successful subscription
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Store subscription data - TODO: use database in production
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            amount: subscription.items.data[0]?.price.unit_amount || 0,
            currency: subscription.items.data[0]?.price.currency || 'usd',
            customerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
          };

          storeSubscriptionToFile(subscriptionData);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        
        const priceId = subscription.items.data[0]?.price.id;
        const subscriptionData = {
          id: subscription.id,
          planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
          status: subscription.status as 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          amount: subscription.items.data[0]?.price.unit_amount || 0,
          currency: subscription.items.data[0]?.price.currency || 'usd',
          customerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
        };

        storeSubscriptionToFile(subscriptionData);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);
        
        // Remove subscription from storage
        removeSubscriptionFromFile(subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        
        // Process successful payment
        if ((invoice as Stripe.Invoice & { subscription?: string }).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as Stripe.Invoice & { subscription?: string }).subscription as string
          );
          
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            amount: subscription.items.data[0]?.price.unit_amount || 0,
            currency: subscription.items.data[0]?.price.currency || 'usd',
            customerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
          };

          storeSubscriptionToFile(subscriptionData);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', invoice.id);
        
        // Handle failed payment
        if ((invoice as Stripe.Invoice & { subscription?: string }).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as Stripe.Invoice & { subscription?: string }).subscription as string
          );
          
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: 'past_due' as const,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            amount: subscription.items.data[0]?.price.unit_amount || 0,
            currency: subscription.items.data[0]?.price.currency || 'usd',
            customerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
          };

          storeSubscriptionToFile(subscriptionData);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}