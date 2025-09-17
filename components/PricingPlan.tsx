'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';
import { formatPrice } from '@/lib/subscription-utils';

// Props for pricing plan component
interface PricingPlanProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function PricingPlan({ plan, onSubscribe, isLoading = false, disabled = false }: PricingPlanProps) {
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (disabled) return;
    
    setSubscribing(true);
    try {
      await onSubscribe(plan.id);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setSubscribing(false);
    }
  };

  const isYearly = plan.interval === 'year';
  const monthlyPrice = isYearly ? plan.price / 12 : plan.price;
  const savings = isYearly ? (25 * 12) - plan.price : 0;

  return (
    <Card className={`relative ${isYearly ? 'border-primary shadow-lg' : ''}`}>
      {isYearly && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Best Value
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {formatPrice(plan.price)}
          </span>
          <span className="text-muted-foreground">
            /{plan.interval}
          </span>
          
          {isYearly && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">
                {formatPrice(monthlyPrice)}/month
              </div>
              <div className="text-sm text-green-600 font-medium">
                Save {formatPrice(savings)} per year
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          disabled={subscribing || isLoading || disabled}
          className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          size="lg"
        >
          {disabled 
            ? 'Cancel Current Subscription First' 
            : subscribing 
              ? 'Processing...' 
              : `Subscribe to ${plan.name}`
          }
        </Button>
      </CardFooter>
    </Card>
  );
}