import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, CreditCardIcon, ShieldIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main hero section */}
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
    </div>
  );
}
