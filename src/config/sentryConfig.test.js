import { describe, it, expect, vi } from 'vitest';
import { initSentry } from './sentryConfig';
import * as Sentry from "@sentry/react";

vi.mock("@sentry/react", () => ({
    init: vi.fn(),
    getCurrentHub: vi.fn(() => ({
        getClient: vi.fn(() => ({
            getOptions: vi.fn(() => ({ enabled: true }))
        }))
    }))
}));

describe('sentryConfig PII Scrubbing', () => {
    it('beforeSend hook should scrub sensitive data', () => {
        // 1. Capture the init call to get the beforeSend hook
        initSentry(true);
        const initOptions = vi.mocked(Sentry.init).mock.calls[0][0];
        const { beforeSend } = initOptions;

        // 2. Define a mock event with PII
        const mockEvent = {
            user: { id: '123', email: 'user@example.com' },
            request: { url: 'https://edgereader.app/article/456', headers: { 'Cookie': 'secret' } },
            breadcrumbs: [{ category: 'navigation', message: 'visit home' }],
            extra: { someData: 'val' },
            tags: { source: 'reuters' },
            exception: { values: [{ type: 'Error', value: 'Crash' }] },
            contexts: { browser: { name: 'Chrome' }, os: { name: 'Linux' } }
        };

        // 3. Run the scrubbing hook
        const scrubbedEvent = beforeSend(mockEvent);

        // 4. Assertions
        expect(scrubbedEvent.user).toBeUndefined();
        expect(scrubbedEvent.request).toBeUndefined();
        expect(scrubbedEvent.breadcrumbs).toHaveLength(0);
        expect(scrubbedEvent.extra).toBeUndefined();

        // Essential debugging info should be preserved
        expect(scrubbedEvent.exception).toBeDefined();
        expect(scrubbedEvent.contexts.browser.name).toBe('Chrome');
        expect(scrubbedEvent.contexts.os.name).toBe('Linux');
    });

    it('initSentry should respect the enabled flag', () => {
        vi.clearAllMocks();

        // Test enabled = false
        initSentry(false);
        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
            enabled: false
        }));

        // Test enabled = true
        initSentry(true);
        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
            enabled: true
        }));
    });
});
