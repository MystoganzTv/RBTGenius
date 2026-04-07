# Mobile App Notes

RBT Genius now supports a shared mobile path based on the existing web app:

- `PWA` for installable web behavior
- `Capacitor` for native `iOS` and `Android` shells

## Current setup

- Bundle id: `com.mystodev.rbtgenius`
- Web output directory: `dist`
- Sync command: `npm run mobile:sync`

## Store-readiness notes

The project is now technically ready to be wrapped as a mobile app, but there are still business and review items to finish before submission:

1. Apple and Google digital subscriptions inside the app should use native in-app purchase flows instead of only web checkout.
2. App Store review is more likely to pass if the app adds clear mobile-native value such as:
   - push reminders
   - offline flashcards
   - saved study sessions
   - smoother splash / launch experience
3. Final store assets are still needed:
   - app icon set
   - splash screen assets
   - screenshots
   - privacy metadata

## Native workflow

1. `npm run build:mobile`
2. `npm run cap:sync`
3. `npm run cap:open:ios`
4. `npm run cap:open:android`

## Recommendation

Use the same shared question bank and existing UI flow, but prioritize:

- mobile onboarding polish
- native billing
- push reminders
- offline-safe study surfaces
