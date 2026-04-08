# iOS Simulator Setup

This is the path for testing `RBT Genius` on iPhone without using `Expo`.

## What we can do without paying Apple

You can still test:

- layout
- navigation
- login
- practice
- flashcards
- AI tutor
- profile
- overall mobile shell

inside the `iOS Simulator` without App Store membership.

## What you cannot fully test without Apple store setup

You will not be able to fully test:

- real App Store subscriptions
- App Store sandbox purchase flows
- production iPhone billing behavior

until the Apple subscription products exist in `App Store Connect`.

## Current blocker on this machine

This machine currently has:

- `Command Line Tools`

but not full:

- `Xcode`

That is why commands such as:

- `xcodebuild`
- `xcrun simctl`

are not available yet.

## Install Xcode

1. Open the Mac App Store
2. Search for `Xcode`
3. Install the full app
4. Open Xcode once after install
5. Let it finish installing extra components

## After Xcode is installed

Run this once if needed:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Then confirm:

```bash
xcodebuild -version
xcrun simctl list devices available
```

## Run the app in iOS Simulator

From this project:

```bash
npm run mobile:sync
npm run mobile:ios
```

That opens the Capacitor iOS project in Xcode.

Inside Xcode:

1. choose an iPhone simulator at the top
2. press the Run button

## Best testing plan right now

Recommended order:

1. install `Xcode`
2. test UI and flow in `iOS Simulator`
3. test native billing first on `Android`
4. configure Apple subscriptions later when ready

## Why we are not switching to Expo

We already have the correct path:

- shared React app
- Capacitor native shell
- native billing foundation

Switching to Expo would add migration work and still would not remove the Apple store requirement for real iPhone purchases.
