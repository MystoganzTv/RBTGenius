# Store Console Walkthrough

This is the practical walkthrough for setting up mobile subscriptions for `RBT Genius`.

Use this together with:

- `STORE_SETUP_QUICKSTART.md`
- `STORE_PRODUCT_SETUP.md`
- `.env.mobile.billing.example`

## Recommended order

1. `App Store Connect`
2. `Google Play Console`
3. `RevenueCat`
4. `Netlify`
5. test on devices

## 1. App Store Connect

Official reference:

- https://developer.apple.com/help/app-store-connect/manage-subscriptions/offer-auto-renewable-subscriptions/

### Path to open

1. Log into `App Store Connect`
2. Open `Apps`
3. Click your app
4. In the left sidebar, under `Monetization`, click `Subscriptions`

### Create the subscription group

1. Click the `+` button
2. If Apple shows the extra warning for another group, acknowledge it
3. Enter:
   - Reference name: `RBT Genius Premium`
4. Click `Create`

### Create the monthly subscription

1. Click the group `RBT Genius Premium`
2. Click `Create`
3. Enter:
   - Reference name: `RBT Genius Premium Monthly`
   - Product ID: `com.mystodev.rbtgenius.premium.monthly`
   - Duration: `1 month`
4. Save

### Create the yearly subscription

1. Stay inside the same group
2. Click `+` or `Create`
3. Enter:
   - Reference name: `RBT Genius Premium Yearly`
   - Product ID: `com.mystodev.rbtgenius.premium.yearly`
   - Duration: `1 year`
4. Save

### Set subscription levels

Inside the same group, set the levels so upgrades and downgrades stay clean.

Recommended:

- Level 1: yearly
- Level 2: monthly

### Add localizations

Still inside `Monetization > Subscriptions`:

1. Click the group
2. Click `+` next to `App Store Localizations`
3. Add at least `English (U.S.)`
4. Then open each subscription and add localized display name and description

Recommended display names:

- `RBT Genius Premium Monthly`
- `RBT Genius Premium Yearly`

### Set pricing

Apple pricing is handled per subscription.

Open each subscription and set the price:

- monthly: `19.99 USD`
- yearly: `215.89 USD`

### Apple sandbox note

Apple notes that subscription metadata changes can take up to around an hour to appear in sandbox.

## 2. Google Play Console

Official reference:

- https://support.google.com/googleplay/android-developer/answer/140504?hl=en

### Path to open

1. Log into `Google Play Console`
2. Open your app
3. In the left navigation open:
   - `Monetize with Play`
   - `Products`
   - `Subscriptions`

### Create the subscription object

1. Click `Create subscription`
2. Enter:
   - Product ID / Subscription ID: `premium`
   - Name: `RBT Genius Premium`
3. Save

### Create the monthly base plan

1. Open the `premium` subscription
2. Click `Add base plan`
3. Enter:
   - Base plan ID: `monthly`
   - Type: `Auto-renewing`
   - Billing period: `Monthly`
4. Set pricing and availability
5. Save
6. Click `Activate`

### Create the yearly base plan

1. Still inside `premium`
2. Click `Add base plan`
3. Enter:
   - Base plan ID: `yearly`
   - Type: `Auto-renewing`
   - Billing period: `Yearly`
4. Set pricing and availability
5. Save
6. Click `Activate`

### Pricing

Recommended starting prices:

- monthly: `19.99 USD`
- yearly: `215.89 USD`

### Do not add offers yet

Google supports offers, but for first launch keep it simple:

- no intro offers
- no free trial
- no promo phases

Just get:

- `premium:monthly`
- `premium:yearly`

working first.

## 3. RevenueCat

Official references:

- https://www.revenuecat.com/docs/getting-started/entitlements
- https://www.revenuecat.com/docs/offerings/overview
- https://www.revenuecat.com/docs/offerings/products-overview

### Create or open the project

1. Log into `RevenueCat`
2. Open your `RBT Genius` project

### Add store connections

Before products can sync correctly:

1. connect `App Store`
2. connect `Google Play`

Do this in the project integrations / store connection area.

### Create the entitlement

1. Open the entitlement section
2. Click `New entitlement`
3. Enter:
   - Entitlement ID: `premium`
   - Name: `Premium`

### Add products

Open the product catalog area and add / import:

1. `com.mystodev.rbtgenius.premium.monthly`
2. `com.mystodev.rbtgenius.premium.yearly`
3. `premium:monthly`
4. `premium:yearly`

### Attach products to the entitlement

All four products should unlock:

- `premium`

### Create the offering

1. Open `Offerings`
2. Click `+ New`
3. Enter:
   - Identifier: `default`
   - Description: `Default Premium Offering`

### Add packages inside the offering

Inside the `default` offering:

1. Add package `MONTHLY`
   - assign Apple monthly
   - assign Google monthly

2. Add package `ANNUAL`
   - assign Apple yearly
   - assign Google yearly

### Mark it as the default offering

RevenueCat recommends using the current/default offering when the app asks for offerings.
That matches the code already in this repo.

Make sure:

- `default` is the project’s default offering

## 4. Netlify

### Path to open

1. Log into `Netlify`
2. Open site: `rbtgenius`
3. Open `Site configuration`
4. Open `Environment variables`

### Variables to add

Use:

- `.env.mobile.billing.example`

Copy these values and replace placeholders:

1. `REVENUECAT_IOS_API_KEY`
2. `REVENUECAT_ANDROID_API_KEY`
3. `REVENUECAT_SECRET_KEY`
4. `REVENUECAT_PROJECT_ID`
5. `REVENUECAT_PREMIUM_ENTITLEMENT_ID`
6. `REVENUECAT_OFFERING_ID`
7. `REVENUECAT_PRODUCTS_PREMIUM_MONTHLY`
8. `REVENUECAT_PRODUCTS_PREMIUM_YEARLY`

Keep existing Stripe values too:

1. `STRIPE_SECRET_KEY`
2. `STRIPE_WEBHOOK_SECRET`
3. `STRIPE_PRICE_PREMIUM_MONTHLY`
4. `STRIPE_PRICE_PREMIUM_YEARLY`

### After saving env vars

1. trigger a new deploy
2. test on preview first
3. only after that, move to production

## 5. Device testing

### iPhone

Use:

- Sandbox tester
- or `TestFlight`

Test:

1. buy monthly
2. buy yearly
3. restore purchases
4. subscription switch
5. manage subscription link

### Android

Use:

- internal testing track

Test:

1. buy monthly
2. buy yearly
3. restore purchases
4. subscription switch
5. manage subscription link

## 6. What success looks like

When it is working correctly:

1. web keeps using Stripe
2. iOS and Android use store billing
3. `Pricing` shows native flow on mobile
4. `Profile` updates to premium after purchase
5. `Mock Exams`, `Analytics`, and premium limits unlock

## 7. What not to do yet

Do not add these until the base flow works:

- free trials
- promo offers
- intro pricing
- extra subscription tiers
- 40-hour course billing

Keep launch simple first.
