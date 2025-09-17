import fs from 'fs';
import path from 'path';
import os from 'os';
import { Subscription } from '@/types/subscription';

// Store data in temp directory for deployment
const STORAGE_FILE = path.join(os.tmpdir(), 'subscriptions.json');

// Make sure directory exists
function ensureDataDir() {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read subscriptions from file
export function readSubscriptionsFromFile(): Subscription[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Convert date strings back to Date objects
    return parsed.map((sub: { currentPeriodStart: string; currentPeriodEnd: string; [key: string]: unknown }) => ({
      ...sub,
      currentPeriodStart: new Date(sub.currentPeriodStart),
      currentPeriodEnd: new Date(sub.currentPeriodEnd),
    }));
  } catch (error) {
    console.error('Error reading subscriptions from file:', error);
    return [];
  }
}

// Write subscriptions to file
export function writeSubscriptionsToFile(subscriptions: Subscription[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error writing subscriptions to file:', error);
  }
}

// Store a single subscription
export function storeSubscriptionToFile(subscription: Subscription) {
  const subscriptions = readSubscriptionsFromFile();
  const existingIndex = subscriptions.findIndex(sub => sub.id === subscription.id);
  
  if (existingIndex >= 0) {
    subscriptions[existingIndex] = subscription;
  } else {
    subscriptions.push(subscription);
  }
  
  writeSubscriptionsToFile(subscriptions);
}

// Remove a subscription
export function removeSubscriptionFromFile(subscriptionId: string) {
  const subscriptions = readSubscriptionsFromFile();
  const filtered = subscriptions.filter(sub => sub.id !== subscriptionId);
  writeSubscriptionsToFile(filtered);
}