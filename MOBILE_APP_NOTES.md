# Mobile App Notes

RBT Genius now uses a shared mobile path on top of the existing web app:

- `PWA` for installable browser behavior
- `Capacitor` for native `iOS` and `Android`

## Current setup

- Bundle id: `com.mystodev.rbtgenius`
- Web output directory: `dist`
- Native projects:
  - `ios/`
  - `android/`
- Native shell support already added:
  - safe-area aware layout
  - native status bar sync with light/dark theme
  - splash screen handoff

## Commands

1. `npm run mobile:sync`
2. `npm run mobile:ios`
3. `npm run mobile:android`
4. `npm run cap:run:ios`
5. `npm run cap:run:android`

## Local iPhone testing prerequisite

Right now this machine does not have full `Xcode` installed, only `Command Line Tools`.

That means:

- `iOS Simulator` is not available yet
- `xcodebuild` is not available yet
- the Capacitor iOS project exists, but cannot be run locally until Xcode is installed

To test the UI on iPhone without App Store membership:

1. install full `Xcode` from the Mac App Store
2. open Xcode once and finish the extra component install
3. switch the developer directory to Xcode
4. use `npm run mobile:ios`

Important:

- You do **not** need App Store Connect membership just to test the UI in Simulator.
- You **do** need Apple store setup if you want to test real native iPhone subscriptions.
- Android remains the easiest path to test native billing first.

## What is already true

- We are not building a second product from scratch.
- The same React app is being packaged for mobile stores.
- The current app offer is still exam prep:
  - practice
  - flashcards
  - mock exams
  - AI tutor
  - analytics
- The `40-hour course` is still future work and should stay marked as `coming soon`.

## What still must happen before store submission

1. Finish real store configuration in RevenueCat and the app stores:
   - `REVENUECAT_IOS_API_KEY`
   - `REVENUECAT_ANDROID_API_KEY`
   - `REVENUECAT_SECRET_KEY`
   - `REVENUECAT_PROJECT_ID`
   - `REVENUECAT_PREMIUM_ENTITLEMENT_ID`
   - `REVENUECAT_PRODUCTS_PREMIUM_MONTHLY`
   - `REVENUECAT_PRODUCTS_PREMIUM_YEARLY`
2. Add clearer mobile-native value:
   - push reminders
   - offline flashcards
   - saved study sessions
3. Finish store assets and compliance:
   - final app icon set
   - splash assets
   - screenshots
   - privacy nutrition labels / data safety form
   - support URL and review notes

## Recommended next product steps

- native billing
- offline flashcards
- push study reminders
- small mobile onboarding flow
