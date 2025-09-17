'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionCard } from './SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Subscription } from '@/types/subscription';
import { getStoredSubscriptions, getSubscriptionStatus, updateStoredSubscription } from '@/lib/subscription-utils';

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      // TODO: Need to optimize this - loading from both local and server
      const localSubscriptions = getStoredSubscriptions();
      
      // Try to get data from server as well
      let serverSubscriptions: Subscription[] = [];
      try {
        const response = await fetch('/api/subscriptions');
        if (response.ok) {
          const data = await response.json();
          serverSubscriptions = data.subscriptions || [];
        }
      } catch (serverError) {
        console.log('Server error - using local data only:', serverError);
      }
      
      // Combine local and server data - server data takes priority
      const allSubscriptions = [...localSubscriptions];
      serverSubscriptions.forEach(serverSub => {
        const existingIndex = allSubscriptions.findIndex(sub => sub.id === serverSub.id);
        if (existingIndex >= 0) {
          // Update existing subscription with server data
          allSubscriptions[existingIndex] = {
            ...allSubscriptions[existingIndex],
            ...serverSub,
            currentPeriodStart: new Date(serverSub.currentPeriodStart),
            currentPeriodEnd: new Date(serverSub.currentPeriodEnd),
          };
        } else {
          // Add new subscription from server
          allSubscriptions.push({
            ...serverSub,
            currentPeriodStart: new Date(serverSub.currentPeriodStart),
            currentPeriodEnd: new Date(serverSub.currentPeriodEnd),
          });
        }
      });
      
      setSubscriptions(allSubscriptions);
      
      // Save to localStorage for offline access
      if (allSubscriptions.length > 0) {
        localStorage.setItem('subscriptions', JSON.stringify(allSubscriptions));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      // Call API to cancel subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Update UI immediately
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, cancelAtPeriodEnd: true }
            : sub
        )
      );

      // Update local storage
      updateStoredSubscription(subscriptionId, { cancelAtPeriodEnd: true });

      // Try to update server storage too
      try {
        await fetch('/api/update-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId,
            updates: { cancelAtPeriodEnd: true }
          }),
        });
      } catch (serverError) {
        console.log('Server update failed:', serverError);
      }

      // Reload data to make sure everything is in sync
      await loadSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    }
  };

  const handleClearStorage = () => {
    if (confirm('Clear all subscription data? This will remove all stored subscriptions.')) {
      localStorage.removeItem('subscriptions');
      // Clear server storage too
      fetch('/api/subscriptions', { method: 'DELETE' }).catch(() => {
        // Ignore if server call fails
      });
      setSubscriptions([]);
    }
  };

  const subscriptionStatus = getSubscriptionStatus(subscriptions);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!subscriptionStatus.hasActiveSubscription ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No Active Subscriptions</h3>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have any active subscriptions. Choose a plan to get started.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/pricing')}>
              View Pricing Plans
            </Button>
            <Button variant="outline" onClick={handleClearStorage}>
              Clear Storage
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Subscriptions</h2>
          <div className="grid gap-4">
            {subscriptions
              .filter(sub => sub.status !== 'canceled' || sub.cancelAtPeriodEnd)
              .map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onCancel={handleCancelSubscription}
                />
              ))}
          </div>
          
          <div className="pt-6 border-t">
            <div className="flex gap-4">
              {/* Only show change plan if no active subscription or subscription is cancelled */}
              {!subscriptions.some(sub => sub.status === 'active' && !sub.cancelAtPeriodEnd) ? (
                <Button 
                  onClick={() => router.push('/pricing')}
                >
                  {subscriptions.some(sub => sub.cancelAtPeriodEnd) ? 'Choose New Plan' : 'View Pricing Plans'}
                </Button>
              ) : (
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    To change your plan, you must first cancel your current active subscription. 
                    You&apos;ll continue to have access until the end of your billing period.
                  </p>
                  <Button 
                    variant="outline"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    Change Plan (Cancel current subscription first)
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handleClearStorage}
              >
                Clear Storage
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}