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
        
        // Handle successful subscription creation
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Store subscription data (in a real app, this would go to a database)
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: subscription.status as any,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
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
          status: subscription.status as any,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
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
        
        // Handle successful payment
        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );
          
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: subscription.status as any,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
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
        
        // Handle failed payment - could update subscription status to past_due
        if ((invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            (invoice as any).subscription as string
          );
          
          const priceId = subscription.items.data[0]?.price.id;
          const subscriptionData = {
            id: subscription.id,
            planId: priceId === 'price_1S5qavBpmBtDUil154oVhrMz' ? 'yearly' as const : 'monthly' as const,
            status: 'past_due' as const,
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
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