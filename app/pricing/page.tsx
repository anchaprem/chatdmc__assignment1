'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PricingPlan } from '@/components/PricingPlan';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SUBSCRIPTION_PLANS, getStoredSubscriptions } from '@/lib/subscription-utils';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  useEffect(() => {
    // Check if user has active subscriptions
    const subscriptions = getStoredSubscriptions();
    const activeSubscription = subscriptions.find(
      sub => sub.status === 'active' && !sub.cancelAtPeriodEnd
    );
    setHasActiveSubscription(!!activeSubscription);
  }, []);

  const handleSubscribe = async (planId: string) => {
    // Prevent subscription if user has active subscription
    if (hasActiveSubscription) {
      setError('You already have an active subscription. Please cancel it first to change plans.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: SUBSCRIPTION_PLANS.find(p => p.id === planId)?.stripePriceId,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect subscription plan for your needs. 
            All plans include full access to our platform with premium support.
          </p>
        </div>

        {error && (
          <Alert className="mb-8 max-w-2xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasActiveSubscription && (
          <Alert className="mb-8 max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <AlertDescription>
              <strong>Active Subscription Detected:</strong> You currently have an active subscription. 
              To change plans, please go to your dashboard and cancel your current subscription first. 
              You'll continue to have access until the end of your billing period.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PricingPlan
              key={plan.id}
              plan={plan}
              onSubscribe={handleSubscribe}
              isLoading={loading}
              disabled={hasActiveSubscription}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Test Card Information</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Success:</strong> 4242 4242 4242 4242</p>
              <p><strong>Decline:</strong> 4000 0000 0000 0002</p>
              <p>Use any future expiry date and any CVC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}