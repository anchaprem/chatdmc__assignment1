'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircleIcon } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled and no charges were made.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Don't worry, no payment was processed. You can try again anytime 
              or contact our support team if you're experiencing issues.
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/pricing')}
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Go Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}