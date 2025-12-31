import { openDB } from 'idb';

/**
 * storageService.js
 * Encapsulates all IndexedDB operations for user preferences.
 * Stored locally in the browser, never transmitted to any server.
 */

const DB_NAME = 'edgereader';
const DB_VERSION = 1;
const STORE_NAME = 'preferences';
const PREFS_KEY = 'userPreferences';

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

/**
 * Returns the default preferences for new users.
 * @returns {Object} UserPreferences with Sets
 */
export function getDefaultPreferences() {
    return {
        selectedTopics: new Set(['Technology', 'Science', 'General']),
        enabledSources: new Set(), // Empty = all enabled
        disabledSources: new Set(),
        keywords: new Set(),
    };
}

/**
 * Converts Sets to Arrays for storage (IndexedDB doesn't support Sets).
 * @param {Object} prefs - UserPreferences with Sets
 * @returns {Object} Serialized preferences with Arrays
 */
function serializePreferences(prefs) {
    return {
        selectedTopics: Array.from(prefs.selectedTopics),
        enabledSources: Array.from(prefs.enabledSources),
        disabledSources: Array.from(prefs.disabledSources),
        keywords: Array.from(prefs.keywords),
    };
}

/**
 * Converts Arrays back to Sets after loading.
 * @param {Object} stored - Serialized preferences from DB
 * @returns {Object} UserPreferences with Sets
 */
function deserializePreferences(stored) {
    return {
        selectedTopics: new Set(stored.selectedTopics || []),
        enabledSources: new Set(stored.enabledSources || []),
        disabledSources: new Set(stored.disabledSources || []),
        keywords: new Set(stored.keywords || []),
    };
}

/**
 * Saves user preferences to IndexedDB.
 * @param {Object} prefs - UserPreferences with Sets
 * @returns {Promise<void>}
 */
export async function savePreferences(prefs) {
    try {
        const db = await initDB();
        const serialized = serializePreferences(prefs);
        await db.put(STORE_NAME, serialized, PREFS_KEY);
        console.log('Preferences saved successfully');
    } catch (error) {
        console.error('Error saving preferences:', error);
        throw error;
    }
}

/**
 * Loads user preferences from IndexedDB.
 * Returns defaults if none exist.
 * @returns {Promise<Object>} UserPreferences with Sets
 */
export async function loadPreferences() {
    try {
        const db = await initDB();
        const stored = await db.get(STORE_NAME, PREFS_KEY);

        if (!stored) {
            console.log('No preferences found, using defaults');
            return getDefaultPreferences();
        }

        return deserializePreferences(stored);
    } catch (error) {
        console.error('Error loading preferences:', error);
        return getDefaultPreferences();
    }
}

/**
 * Updates partial user preferences by merging with existing.
 * @param {Object} partial - Partial UserPreferences
 * @returns {Promise<Object>} Updated UserPreferences with Sets
 */
export async function updatePreferences(partial) {
    try {
        const existing = await loadPreferences();

        // Merge partial updates
        const updated = {
            selectedTopics: partial.selectedTopics || existing.selectedTopics,
            enabledSources: partial.enabledSources || existing.enabledSources,
            disabledSources: partial.disabledSources || existing.disabledSources,
            keywords: partial.keywords || existing.keywords,
        };

        await savePreferences(updated);
        return updated;
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
}
