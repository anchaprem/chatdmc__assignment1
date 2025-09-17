import { SubscriptionManager } from '@/components/SubscriptionManager';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Subscription Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your subscription plans and billing information.
            </p>
          </div>
          
          {/* Main content */}
          <SubscriptionManager />
        </div>
      </div>
    </div>
  );
}