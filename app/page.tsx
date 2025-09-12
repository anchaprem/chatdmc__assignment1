import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, CreditCardIcon, ShieldIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Manage Your Subscriptions with Ease
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A powerful subscription management system built with Next.js 15, 
            Stripe integration, and modern UI components.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCardIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Powered by Stripe with industry-leading security standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    PCI DSS compliant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Fraud protection
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy Management</CardTitle>
                <CardDescription>
                  Intuitive dashboard to manage all your subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Real-time status updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    One-click cancellation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Billing history
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Flexible Plans</CardTitle>
                <CardDescription>
                  Choose between monthly and yearly subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Monthly billing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Yearly discounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    Cancel anytime
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Choose your plan and start managing your subscriptions today. 
            No setup fees, cancel anytime.
          </p>
          <Button asChild size="lg">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
