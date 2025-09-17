import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CheckoutSessionRequest } from '@/types/subscription';

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutSessionRequest = await req.json();
    const { priceId, successUrl, cancelUrl, customerEmail } = body;

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create checkout session with Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        priceId,
      },
      subscription_data: {
        metadata: {
          priceId,
        },
      },
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: false,
      },
      // Add custom text to make cancel option more visible
      custom_text: {
        submit: {
          message: 'Having trouble? You can cancel and try again anytime.',
        },
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to create checkout session' 
      },
      { status: 500 }
    );
  }
}