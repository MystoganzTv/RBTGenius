# Store Setup Quickstart

This is the shortest path to get `RBT Genius` mobile billing working.

Follow these steps in order.

## 1. App Store Connect

Create one subscription group:

- `RBT Genius Premium`

Create these two auto-renewable subscriptions inside that group:

1. `com.mystodev.rbtgenius.premium.monthly`
2. `com.mystodev.rbtgenius.premium.yearly`

Set prices:

1. Monthly: `19.99 USD`
2. Yearly: `215.89 USD`

## 2. Google Play Console

Create one subscription:

- `premium`

Create these two base plans:

1. `monthly`
2. `yearly`

Set prices:

1. Monthly: `19.99 USD`
2. Yearly: `215.89 USD`

Do not add offers or free trials yet.

## 3. RevenueCat

Create or open the `RBT Genius` project.

Create one entitlement:

- `premium`

Create one offering:

- `default`

Add products:

1. Apple monthly: `com.mystodev.rbtgenius.premium.monthly`
2. Apple yearly: `com.mystodev.rbtgenius.premium.yearly`
3. Google monthly: `premium:monthly`
4. Google yearly: `premium:yearly`

Attach them like this:

1. Package `MONTHLY`
   - Apple monthly
   - Google monthly
2. Package `ANNUAL`
   - Apple yearly
   - Google yearly

Make both packages unlock:

- `premium`

## 4. Netlify env vars

Add these values in Netlify:

1. `REVENUECAT_IOS_API_KEY`
2. `REVENUECAT_ANDROID_API_KEY`
3. `REVENUECAT_SECRET_KEY`
4. `REVENUECAT_PROJECT_ID`
5. `REVENUECAT_PREMIUM_ENTITLEMENT_ID=premium`
6. `REVENUECAT_OFFERING_ID=default`
7. `REVENUECAT_PRODUCTS_PREMIUM_MONTHLY=com.mystodev.rbtgenius.premium.monthly,premium:monthly`
8. `REVENUECAT_PRODUCTS_PREMIUM_YEARLY=com.mystodev.rbtgenius.premium.yearly,premium:yearly`

## 5. Redeploy

After env vars are saved:

1. redeploy preview
2. test billing
3. only then push to production

## 6. Test on iPhone

Verify:

1. monthly purchase works
2. yearly purchase works
3. restore purchases works
4. `Profile` updates to premium
5. `Mock Exams` and `Analytics` unlock

## 7. Test on Android

Verify:

1. monthly purchase works
2. yearly purchase works
3. restore purchases works
4. `Profile` updates to premium
5. `Mock Exams` and `Analytics` unlock

## 8. Final check

Before store submission, make sure the app listing says only what exists today:

- Practice
- Flashcards
- Mock Exams
- AI Tutor
- Analytics

Do not list:

- `40-hour course`

## If you get stuck

Use these repo docs:

- `STORE_PRODUCT_SETUP.md`
- `STORE_READINESS_CHECKLIST.md`
- `MOBILE_APP_NOTES.md`
