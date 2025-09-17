import { SubscriptionPlan, Subscription, SubscriptionStatus } from '@/types/subscription';

// Define subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    description: 'Perfect for trying out our service',
    price: 25,
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_1S5qauBpmBtDUil1ZfM5aeXP', // Monthly price ID
    features: [
      'Full access to all features',
      'Email support',
      'Monthly billing',
      'Cancel anytime'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    description: 'Best value for long-term users',
    price: 250,
    currency: 'usd',
    interval: 'year',
    stripePriceId: 'price_1S5qavBpmBtDUil154oVhrMz', // Yearly price ID
    features: [
      'Full access to all features',
      'Priority email support',
      'Yearly billing (2 months free)',
      'Cancel anytime',
      'Advanced analytics'
    ]
  }
];

export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

export const formatPrice = (price: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const getSubscriptionStatus = (subscriptions: Subscription[]): SubscriptionStatus => {
  const activeSubscription = subscriptions.find(
    sub => sub.status === 'active' || sub.status === 'trialing'
  );

  if (activeSubscription) {
    const plan = getPlanById(activeSubscription.planId);
    return {
      hasActiveSubscription: true,
      currentPlan: plan,
      subscription: activeSubscription
    };
  }

  return {
    hasActiveSubscription: false
  };
};

export const isSubscriptionActive = (subscription: Subscription): boolean => {
  return subscription.status === 'active' || subscription.status === 'trialing';
};

export const getNextBillingDate = (subscription: Subscription): Date => {
  return new Date(subscription.currentPeriodEnd);
};

export const getDaysUntilBilling = (subscription: Subscription): number => {
  const nextBilling = getNextBillingDate(subscription);
  const now = new Date();
  const diffTime = nextBilling.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Removed mock data - not needed for production

// Helper functions for localStorage
export const getStoredSubscriptions = (): Subscription[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('subscriptions');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((sub: { currentPeriodStart: string; currentPeriodEnd: string; [key: string]: unknown }) => ({
      ...sub,
      currentPeriodStart: new Date(sub.currentPeriodStart),
      currentPeriodEnd: new Date(sub.currentPeriodEnd),
    }));
  } catch (error) {
    console.error('Error reading subscriptions from localStorage:', error);
    return [];
  }
};

export const storeSubscription = (subscription: Subscription): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getStoredSubscriptions();
    const updated = [...existing.filter(s => s.id !== subscription.id), subscription];
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  } catch (error) {
    console.error('Error storing subscription to localStorage:', error);
  }
};

export const removeStoredSubscription = (subscriptionId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getStoredSubscriptions();
    const updated = existing.filter(s => s.id !== subscriptionId);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing subscription from localStorage:', error);
  }
};

// Utility to update a specific subscription in localStorage
export const updateStoredSubscription = (subscriptionId: string, updates: Partial<Subscription>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getStoredSubscriptions();
    const updated = existing.map(sub => 
      sub.id === subscriptionId 
        ? { ...sub, ...updates }
        : sub
    );
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating subscription in localStorage:', error);
  }
};