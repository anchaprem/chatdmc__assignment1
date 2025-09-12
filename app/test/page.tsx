'use client';

import { Button } from '@/components/ui/button';

export default function TestPage() {
  const clearStorage = () => {
    localStorage.clear();
    alert('Storage cleared! Refresh the page to see changes.');
  };

  const checkStorage = () => {
    const subscriptions = localStorage.getItem('subscriptions');
    alert(`Stored subscriptions: ${subscriptions || 'None'}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Developer Tools</h1>
        <div className="flex flex-col gap-4">
          <Button onClick={clearStorage}>
            Clear All Storage
          </Button>
          <Button variant="outline" onClick={checkStorage}>
            Check Storage
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}