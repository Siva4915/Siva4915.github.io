# Vuemora for Android

Vuemora installs on Android in two ways:

1. **APK (sideload)** — a native Capacitor shell containing the full app and media.
2. **PWA** — install the live site from Chrome as an app.

## Download the APK

Latest build:

**https://github.com/Siva4915/Siva4915.github.io/releases/latest/download/Vuemora-1.0.0-android.apk**

The file is about 36 MB because the five sample videos and all thumbnails are bundled for offline playback.

## Install on an Android phone

1. Open the download link on the phone.
2. If prompted, allow your browser or Files app to **install unknown apps**.
3. Open the downloaded **Vuemora-1.0.0-android.apk**.
4. Tap **Install**.
5. If Play Protect shows a warning, choose **Install anyway**. This is a debug-signed preview build, not a Play Store release.

The app appears as **Vuemora** and opens full-screen without a browser address bar.

## Install as a PWA instead

1. Open **https://siva4915.github.io/** in Chrome on Android.
2. Tap the three-dot menu.
3. Choose **Add to Home screen** or **Install app**.

The browser uses the manifest and service worker in `public/` to install Vuemora as a standalone app.

## App details

| Property | Value |
| --- | --- |
| App name | Vuemora |
| Package | com.vuemora.app |
| Version | 1.0.0 (versionCode 1) |
| Minimum Android | 7.0 (API 24) |
| Target SDK | 36 |
| Permissions | Internet only |
| Signing | Android debug key (sideload preview) |

## Build the APK from source

Requirements:

- Node.js 20+
- JDK 21 (the bundled Android Studio JBR is fine)
- Android SDK platform 36 and build-tools 36.x

Commands:

    npm install
    npm run build
    npx cap sync android
    cd android
    .\gradlew.bat assembleDebug

The APK is written to:

    android/app/build/outputs/apk/debug/app-debug.apk

This project was built and verified on Android 16 / API 36 using an emulator.

## Publishing a new Android build

1. Update the app version in `android/app/build.gradle` (versionCode and versionName).
2. Run the build commands above.
3. Rename the APK and upload it to a new GitHub release:

    gh release create v1.0.0-android "Vuemora-1.0.0-android.apk" --title "Vuemora for Android 1.0.0" --notes "Android APK build of Vuemora."

## Play Store / production signing

The APK in this repository's release is signed with the Android debug key so it can be installed directly for testing. A Play Store release needs:

- A private release keystore created and backed up by the owner.
- A signed Android App Bundle (.aab), not the debug APK.
- A Play Console account, store listing, privacy policy and content declarations.
- Review of the third-party media licences in [CREDITS.md](CREDITS.md).

Do not use the debug key for a public Play Store release.

## Source layout

- `android/` — native Capacitor Android project
- `capacitor.config.ts` — app ID, name and web directory
- `public/manifest.webmanifest` — PWA manifest
- `public/sw.js` — service worker for the browser build
- `public/icons/` — PWA, maskable and Apple icons
- `assets/` — source images used to generate Android launcher/splash assets
- `scripts/deploy-pages.ps1` — publish the web/PWA build
