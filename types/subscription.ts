import Stripe from 'stripe';

export interface Subscription {
  id: string;
  planId: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  customerId: string;
  stripeSubscriptionId: string;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
}

export interface User {
  id: string;
  email: string;
  stripeCustomerId?: string;
  subscriptions: Subscription[];
}

export interface CheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: Stripe.Subscription | Stripe.Invoice | Stripe.Customer;
  };
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: SubscriptionPlan;
  subscription?: Subscription;
}

export type SubscriptionAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CANCEL_SUBSCRIPTION'; payload: string };