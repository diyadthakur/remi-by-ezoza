# Remi — Gentle Companion (PWA prototype)

Remi is a mobile-first progressive web app prototype for gentle daily routine reminders, personal memory prompts, mood check-ins, calming messages, trusted contacts, a one-time location check, and a local-only care dashboard demonstration.

## Run locally
Serve the folder through a local web server or open `index.html` for basic UI testing. Installability and service-worker offline caching require HTTPS or localhost.

## Publish with GitHub Pages
1. Create a GitHub repository, e.g. `remi-companion`.
2. Upload the contents of this folder to the repository root (not a nested folder).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/(root)`, and save.
5. After publishing, your URL will look like `https://YOUR-USERNAME.github.io/remi-companion/`.
6. Open the URL on your phone. iPhone: Safari → Share → Add to Home Screen. Android: Chrome menu → Install app or Add to Home screen.

## Features that work in this prototype
- Mobile-first patient-facing interface and installable PWA manifest.
- Daily routine checklist; users can add and remove reminders.
- Personal memory cards and relationship notes.
- Mood check-ins with supportive, non-diagnostic responses.
- Calming messages read using device text-to-speech when available.
- Trusted contact list with tap-to-call links.
- Optional one-time browser geolocation and a map link.
- Care team dashboard demonstration: locally saved mood check-ins, routine completion counts, manually added care notes, demo patient profile, and JSON export.
- Local browser storage and service worker caching for basic offline use after the first successful load.

## Important: dashboard is NOT connected to a care team
Patient data and dashboard data live in the same browser's local storage on the same device. The dashboard is a prototype visualization only. It does not sync to another phone, notify doctors or carers, provide clinical monitoring, detect behavioural changes, or send alerts. A role selector is not authentication. Do not use this prototype for real patient care or emergencies.

Data stored in browser local storage is not encrypted by this prototype. Do not enter real patient records, medical details, identity documents, or sensitive personal information.

## Not implemented; requires infrastructure or dedicated hardware
- Secure remote sync and caregiver/clinician accounts.
- Identity verification, consent management, access permissions, encryption, audit logs, and deletion/retention controls.
- Reliable notification and escalation service.
- Clinically validated mood/behaviour change detection.
- Continuous GPS, route deviation detection, and indoor navigation.
- Eye scanning / biometric identity verification.
- Independent wearable/necklace GPS with its own battery and cellular connectivity.
- Recorded human voice clips.

A production version needs privacy/security engineering, consent and capacity safeguards, clinical validation, accessibility testing with people living with dementia, a secure backend, alert-delivery testing, and hardware engineering for any wearable. Co-design with patients, carers, clinicians, and relevant regulators before real-world use.
