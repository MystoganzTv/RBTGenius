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

1. Replace web-only subscription checkout with native in-app purchase flows for Apple and Google if premium will be sold inside the app.
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
