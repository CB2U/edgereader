import { describe, it, expect, beforeEach } from 'vitest';
import { getDefaultPreferences, loadPreferences, savePreferences, updatePreferences } from './storageService';
import 'fake-indexeddb/auto';

describe('storageService - Error Reporting Preference', () => {
    let testDbName;
    let testCounter = 0;

    beforeEach(() => {
        testCounter++;
        testDbName = `edgereader_test_${testCounter}`;
    });

    it('getDefaultPreferences should include errorReportingEnabled: true', () => {
        const prefs = getDefaultPreferences();
        expect(prefs).toHaveProperty('errorReportingEnabled', true);
    });

    it('loadPreferences should return default value true if not stored', async () => {
        const prefs = await loadPreferences(testDbName);
        expect(prefs.errorReportingEnabled).toBe(true);
    });

    it('savePreferences and loadPreferences should persist the value', async () => {
        const prefs = getDefaultPreferences();
        prefs.errorReportingEnabled = false;

        await savePreferences(prefs, testDbName);
        const storedPrefs = await loadPreferences(testDbName);

        expect(storedPrefs.errorReportingEnabled).toBe(false);
    });

    it('updatePreferences should partially update the value', async () => {
        // Start with default (true)
        let prefs = await loadPreferences(testDbName);
        expect(prefs.errorReportingEnabled).toBe(true);

        // Update to false
        await updatePreferences({ errorReportingEnabled: false }, testDbName);
        prefs = await loadPreferences(testDbName);
        expect(prefs.errorReportingEnabled).toBe(false);

        // Update other stuff but keep false
        await updatePreferences({ selectedTopics: new Set(['Health']) }, testDbName);
        prefs = await loadPreferences(testDbName);
        expect(prefs.errorReportingEnabled).toBe(false);
        expect(prefs.selectedTopics.has('Health')).toBe(true);

        // Update back to true
        await updatePreferences({ errorReportingEnabled: true }, testDbName);
        prefs = await loadPreferences(testDbName);
        expect(prefs.errorReportingEnabled).toBe(true);
    });
});
