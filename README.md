# Stripe Subscription Management System

A modern subscription management system built with Next.js 15, TypeScript, Tailwind CSS 4, Shadcn/ui, and Stripe integration.

## ✨ Features

- **Subscription Plans**: Monthly ($25/month) and Yearly ($250/year) plans
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Subscription Management**: View, cancel, and manage active subscriptions
- **Modern UI**: Built with Tailwind CSS 4 and Shadcn/ui components
- **Type Safety**: Full TypeScript support throughout the application
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and loading states
- **Webhook Support**: Handle Stripe webhooks for subscription events

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for test keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stripe-subscription-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.local` and add your Stripe keys:
   ```env
   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-checkout-session/
│   │   ├── cancel-subscription/
│   │   └── webhooks/
│   ├── dashboard/
│   ├── payment/
│   │   ├── success/
│   │   └── cancel/
│   ├── pricing/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # Shadcn/ui components
│   ├── PricingPlan.tsx
│   ├── SubscriptionCard.tsx
│   └── SubscriptionManager.tsx
├── lib/
│   ├── stripe.ts              # Stripe configuration
│   ├── subscription-utils.ts  # Utility functions
│   └── utils.ts              # General utilities
├── types/
│   └── subscription.ts        # TypeScript interfaces
└── .env.local                 # Environment variables
```

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with feature highlights
- Navigation to pricing and dashboard
- Modern, responsive design

### Pricing Page (`/pricing`)
- Display subscription plans (Monthly & Yearly)
- Stripe Checkout integration
- Test card information

### Dashboard (`/dashboard`)
- View active subscriptions
- Subscription details and status
- Cancel subscription functionality
- Mock data for demonstration

### Payment Pages
- **Success** (`/payment/success`): Payment confirmation
- **Cancel** (`/payment/cancel`): Payment cancellation

## 🔧 Stripe Integration

### Products & Prices

You need to create products and prices in your Stripe Dashboard:

1. **Monthly Plan**
   - Amount: $25.00
   - Billing: Monthly
   - Update `stripePriceId` in `subscription-utils.ts`

2. **Yearly Plan**
   - Amount: $250.00  
   - Billing: Yearly
   - Update `stripePriceId` in `subscription-utils.ts`

### Test Cards

Use these test cards for development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### Webhooks

Set up webhooks in your Stripe Dashboard:

1. **Endpoint URL**: `https://your-domain.com/api/webhooks`
2. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with pk_) |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with sk_) |
| `STRIPE_WEBHOOK_SECRET` | Webhook endpoint secret (starts with whsec_) |
| `NEXT_PUBLIC_APP_URL` | Application base URL |

## 🎨 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn/ui
- **Payments**: Stripe
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚧 Development Notes

### Mock Data

The application uses localStorage and mock data for demonstration purposes. In a production environment, you would:

1. Replace localStorage with a proper database
2. Implement user authentication
3. Store subscription data server-side
4. Add proper error boundaries

### Error Handling

The application includes comprehensive error handling:

- API route error responses
- Client-side error states
- Loading indicators
- User-friendly error messages

### Security

- Environment variables for sensitive keys
- Webhook signature verification
- Type-safe API responses
- Input validation

## 🔗 API Routes

### `POST /api/create-checkout-session`

Creates a Stripe Checkout session for subscription.

**Body:**
```json
{
  "priceId": "price_xxx",
  "successUrl": "http://localhost:3000/payment/success",
  "cancelUrl": "http://localhost:3000/payment/cancel"
}
```

### `POST /api/cancel-subscription`

Cancels a subscription at the end of the billing period.

**Body:**
```json
{
  "subscriptionId": "sub_xxx"
}
```

### `POST /api/webhooks`

Handles Stripe webhook events.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).

---

**Note**: This is a demonstration application. For production use, implement proper user authentication, database storage, and additional security measures.