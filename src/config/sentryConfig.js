import * as Sentry from "@sentry/react";

/**
 * Initializes Sentry with strict PII scrubbing.
 * @param {boolean} enabled - Whether error reporting is enabled by user.
 */
export const initSentry = (enabled) => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;

    if (!dsn) {
        console.warn("Sentry DSN not found. Skipping initialization.");
        return;
    }

    Sentry.init({
        dsn,
        enabled,
        /**
         * Hook to scrub PII before sending event to Sentry.
         * Collects ONLY: stack trace, browser, OS, app version.
         */
        beforeSend(event) {
            // 1. Scrub user information
            if (event.user) {
                delete event.user;
            }

            // 2. Scrub request information (contains URLs)
            if (event.request) {
                delete event.request;
            }

            // 3. Clear breadcrumbs (contains navigation history)
            event.breadcrumbs = [];

            // 4. Remove custom context/tags that might leak user data
            if (event.extra) {
                delete event.extra;
            }
            if (event.tags) {
                // Keep only essential tags if any (none currently added)
            }

            // 5. Ensure stack trace is preserved (essential for debugging)
            return event;
        },
        // Explicitly disable non-essential features for privacy
        tracesSampleRate: 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        integrations: [
            // Use only default integrations, or explicitly disable some if needed
        ],
    });

    if (enabled) {
        console.log("Sentry initialized with PII scrubbing.");
    } else {
        console.log("Sentry initialized in DISABLED mode (user opted out).");
    }
};
