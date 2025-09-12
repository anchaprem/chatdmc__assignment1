'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, CreditCardIcon, AlertCircleIcon } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { formatPrice, formatDate, getDaysUntilBilling, getPlanById } from '@/lib/subscription-utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onCancel: (subscriptionId: string) => Promise<void>;
}

export function SubscriptionCard({ subscription, onCancel }: SubscriptionCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const plan = getPlanById(subscription.planId);
  const daysUntilBilling = getDaysUntilBilling(subscription);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      await onCancel(subscription.id);
    } catch (error) {
      console.error('Cancel subscription error:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Canceled</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{plan?.name || 'Unknown Plan'}</CardTitle>
            <CardDescription>
              {formatPrice(subscription.amount / 100, subscription.currency)} / {plan?.interval || 'month'}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
          <span>Subscription ID: {subscription.id}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <span>Next billing: {formatDate(subscription.currentPeriodEnd)}</span>
          <span className="text-muted-foreground">
            ({daysUntilBilling} days)
          </span>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
              <AlertCircleIcon className="w-4 h-4" />
              <span>This subscription will be canceled at the end of the current period.</span>
            </div>
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
              <p className="font-medium text-blue-900 mb-1">Ready to change plans?</p>
              <p className="text-blue-800">
                You can now select a new plan. Your access continues until {formatDate(subscription.currentPeriodEnd)}.
              </p>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current period:</span>
            <span>
              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span>{formatPrice(subscription.amount / 100, subscription.currency)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}