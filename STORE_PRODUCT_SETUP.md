# Store Product Setup

This is the exact setup recommended for `RBT Genius` so the current mobile billing code can work cleanly across:

- `App Store`
- `Google Play`
- `RevenueCat`
- `Netlify` environment variables

The goal is to keep one shared premium access model:

- same app
- same premium entitlement
- same product truth
- different billing provider depending on platform

Web keeps using `Stripe`.
Native mobile uses `App Store` / `Google Play` through `RevenueCat`.

## Product truth

Today the app should still be sold honestly as:

- Practice
- Flashcards
- Mock Exams
- AI Tutor
- Analytics

Do not list these as live yet:

- `40-hour course`
- offline study mode
- push reminders

## Shared premium model

Use one entitlement only:

- `premium`

Use two subscription durations only:

- monthly
- yearly

This keeps the code and upgrade / downgrade flow simple.

## App Store Connect

Create one subscription group:

- Group reference name: `RBT Genius Premium`
- Group display name: `RBT Genius Premium`

Inside that group create two auto-renewable subscriptions:

1. Monthly
   - Product ID: `com.mystodev.rbtgenius.premium.monthly`
   - Reference name: `RBT Genius Premium Monthly`
   - Duration: `1 month`
   - Price: `19.99 USD`

2. Yearly
   - Product ID: `com.mystodev.rbtgenius.premium.yearly`
   - Reference name: `RBT Genius Premium Yearly`
   - Duration: `1 year`
   - Price: `215.89 USD`

Recommended subscription levels inside the same group:

- Level 1: `yearly`
- Level 2: `monthly`

That way Apple handles switching inside one group instead of treating them like separate memberships.

## Google Play Console

Create one subscription:

- Subscription ID: `premium`
- Display name: `RBT Genius Premium`

Inside that subscription create two base plans:

1. Monthly
   - Base plan ID: `monthly`
   - Type: `Auto-renewing`
   - Billing period: `Monthly`
   - Price: `19.99 USD`

2. Yearly
   - Base plan ID: `yearly`
   - Type: `Auto-renewing`
   - Billing period: `Yearly`
   - Price: `215.89 USD`

Do not add offers or free trials yet.
First get the simple recurring plans working.

## RevenueCat

Create or configure one project for this app:

- Project name: `RBT Genius`

### Entitlement

Create one entitlement:

- Entitlement ID: `premium`
- Display name: `Premium`

Both the monthly and yearly products should unlock this same entitlement.

### Products

Import or add these real store products:

- Apple monthly: `com.mystodev.rbtgenius.premium.monthly`
- Apple yearly: `com.mystodev.rbtgenius.premium.yearly`
- Google monthly: `premium:monthly`
- Google yearly: `premium:yearly`

### Offering

Create one offering:

- Offering ID: `default`
- Display name: `Default Premium Offering`

Inside that offering create two packages:

1. `MONTHLY`
   - Apple product: `com.mystodev.rbtgenius.premium.monthly`
   - Google product: `premium:monthly`

2. `ANNUAL`
   - Apple product: `com.mystodev.rbtgenius.premium.yearly`
   - Google product: `premium:yearly`

Attach all four store products to the entitlement:

- `premium`

## Netlify environment variables

The current code expects these variables:

- `REVENUECAT_IOS_API_KEY`
- `REVENUECAT_ANDROID_API_KEY`
- `REVENUECAT_SECRET_KEY`
- `REVENUECAT_PROJECT_ID`
- `REVENUECAT_PREMIUM_ENTITLEMENT_ID=premium`
- `REVENUECAT_OFFERING_ID=default`
- `REVENUECAT_PRODUCTS_PREMIUM_MONTHLY=com.mystodev.rbtgenius.premium.monthly,premium:monthly`
- `REVENUECAT_PRODUCTS_PREMIUM_YEARLY=com.mystodev.rbtgenius.premium.yearly,premium:yearly`

Notes:

- `REVENUECAT_IOS_API_KEY` and `REVENUECAT_ANDROID_API_KEY` are the public SDK keys used by the app.
- `REVENUECAT_SECRET_KEY` is server-only and must never go to the client.
- `REVENUECAT_PROJECT_ID` is used by the backend sync route.

## Current code behavior

With the configuration above:

- `web` pricing uses `Stripe`
- `ios/android` pricing uses `RevenueCat`
- successful native purchases sync back into the app account
- the same premium access unlocks:
  - full practice
  - full flashcards
  - mock exams
  - analytics
  - AI tutor premium limits

## Recommended setup order

1. Create Apple subscriptions
2. Create Google subscription + base plans
3. Import those products into RevenueCat
4. Create entitlement `premium`
5. Create offering `default`
6. Attach products to packages `MONTHLY` and `ANNUAL`
7. Add Netlify env vars
8. Test:
   - App Store sandbox / TestFlight
   - Google internal testing
   - restore purchases
   - switch monthly <-> yearly

## Test checklist

### Apple

- Buy monthly
- Buy yearly
- Restore purchases
- Upgrade / downgrade inside same subscription group
- Cancel from store settings

### Google

- Buy monthly
- Buy yearly
- Restore purchases
- Switch base plans
- Cancel from Play subscription settings

### App behavior

- Profile updates to the correct plan
- Pricing page shows native store flow on mobile
- Existing Stripe premium users keep access
- Mock exams and analytics unlock when premium is active

## Official references

- Apple subscriptions:
  - https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions/
  - https://developer.apple.com/help/app-store-connect/reference/auto-renewable-subscription-information/
- Google Play subscriptions:
  - https://support.google.com/googleplay/android-developer/answer/140504?hl=en
- RevenueCat:
  - https://www.revenuecat.com/docs/getting-started/entitlements
  - https://www.revenuecat.com/docs/offerings/overview
  - https://www.revenuecat.com/docs/offerings/products-overview
  - https://www.revenuecat.com/docs/projects/configuring-products
