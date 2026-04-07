# Store Readiness Checklist

This project can now be packaged as a mobile app, but the checklist below should be completed before submitting to the App Store or Google Play.

## Product truth

Current mobile offer should match the existing product:

- Practice
- Flashcards
- Mock Exams
- AI Tutor
- Analytics

Do not market these as already included inside the app listing yet:

- `40-hour course`
- offline study mode
- push reminders
- native in-app subscriptions

## Technical checklist

- [x] PWA manifest
- [x] Capacitor `ios` project
- [x] Capacitor `android` project
- [x] safe-area aware app shell
- [x] native status bar handoff
- [x] splash screen handoff
- [ ] Apple in-app purchase
- [ ] Google Play Billing
- [x] RevenueCat client integration
- [ ] RevenueCat store products + entitlement configured
- [ ] RevenueCat server env vars set
- [ ] offline-safe flashcards
- [ ] push notifications

## Store assets

- [ ] final icon set
- [ ] launch / splash assets
- [ ] App Store screenshots
- [ ] Play Store screenshots
- [ ] short description
- [ ] full description
- [ ] privacy policy link
- [ ] support URL

## Compliance notes

- If premium is sold inside the mobile app, use native store billing.
- Keep the listing honest: this is an exam-prep app today, not a completed 40-hour training course.

## Internal reference

- Exact product IDs, RevenueCat mapping, and env vars:
  - `STORE_PRODUCT_SETUP.md`
