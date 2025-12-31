import { openDB } from 'idb';

const DB_NAME = 'EdgeReaderDB';
const DB_VERSION = 1;
const STORE_NAME = 'articles';

let dbPromise = null;

/**
 * Initialize IndexedDB database with articles object store
 * @returns {Promise<IDBDatabase>} Database instance
 */
export async function initDatabase() {
    if (dbPromise) return dbPromise;

    try {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Create articles object store if it doesn't exist
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });

                    // Create indexes
                    store.createIndex('url', 'url', { unique: true });
                    store.createIndex('publishDate', 'publishDate', { unique: false });
                    store.createIndex('topic', 'topic', { unique: false });
                    store.createIndex('fetchedAt', 'fetchedAt', { unique: false });

                    console.log('✅ IndexedDB: Created articles object store with indexes');
                }
            },
        });

        await dbPromise;
        console.log('✅ IndexedDB: Database initialized successfully');
        return dbPromise;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to initialize database:', error);
        dbPromise = null;
        throw error;
    }
}

/**
 * Insert articles into IndexedDB with URL-based deduplication
 * @param {Array<Object>} articles - Array of article objects
 * @returns {Promise<number>} Number of articles inserted
 */
export async function insertArticles(articles) {
    if (!articles || articles.length === 0) return 0;

    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const urlIndex = store.index('url');

        let insertedCount = 0;
        const fetchedAt = Date.now();

        for (const article of articles) {
            try {
                // Check if article with this URL already exists
                const existing = await urlIndex.get(article.url);

                if (!existing) {
                    // Add fetchedAt timestamp and insert
                    await store.add({
                        ...article,
                        fetchedAt,
                        publishDate: article.publishDate?.toISOString() || new Date().toISOString(),
                        description: article.description || '',
                        imageUrl: article.imageUrl || '',
                        topic: article.topic || 'General',
                    });
                    insertedCount++;
                }
            } catch (error) {
                // Skip articles that fail to insert (e.g., duplicate URLs)
                console.warn(`⚠️ IndexedDB: Skipped article "${article.title}":`, error.message);
            }
        }

        await tx.done;
        console.log(`✅ IndexedDB: Inserted ${insertedCount} new articles (${articles.length - insertedCount} duplicates skipped)`);
        return insertedCount;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to insert articles:', error);
        return 0;
    }
}

/**
 * Get articles ordered by publish date (newest first)
 * @param {number} limit - Maximum number of articles to return
 * @param {number} offset - Number of articles to skip
 * @returns {Promise<Array>} Array of article objects
 */
export async function getArticles(limit = 50, offset = 0) {
    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('publishDate');

        // Get all articles ordered by publishDate (descending)
        const allArticles = await index.getAll();

        // Sort in descending order (newest first) and apply pagination
        const sortedArticles = allArticles
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(offset, offset + limit);

        await tx.done;
        return sortedArticles;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to get articles:', error);
        return [];
    }
}

/**
 * Get articles filtered by topic
 * @param {string} topic - Topic to filter by
 * @param {number} limit - Maximum number of articles to return
 * @returns {Promise<Array>} Array of article objects
 */
export async function getArticlesByTopic(topic, limit = 50) {
    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('topic');

        // Get all articles for this topic
        const articles = await index.getAll(topic);

        // Sort by publishDate (newest first) and apply limit
        const sortedArticles = articles
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, limit);

        await tx.done;
        return sortedArticles;
    } catch (error) {
        console.error(`❌ IndexedDB: Failed to get articles for topic "${topic}":`, error);
        return [];
    }
}

/**
 * Delete old articles to keep cache size under control
 * @param {number} keepCount - Number of most recent articles to keep
 * @returns {Promise<number>} Number of articles deleted
 */
export async function deleteOldArticles(keepCount = 100) {
    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('fetchedAt');

        // Get all articles ordered by fetchedAt
        const allArticles = await index.getAll();

        // Sort by fetchedAt (newest first)
        const sortedArticles = allArticles.sort((a, b) => b.fetchedAt - a.fetchedAt);

        // Delete articles beyond keepCount
        let deletedCount = 0;
        if (sortedArticles.length > keepCount) {
            const articlesToDelete = sortedArticles.slice(keepCount);

            for (const article of articlesToDelete) {
                await store.delete(article.id);
                deletedCount++;
            }
        }

        await tx.done;

        if (deletedCount > 0) {
            console.log(`✅ IndexedDB: Pruned ${deletedCount} old articles (keeping ${keepCount} most recent)`);
        }

        return deletedCount;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to delete old articles:', error);
        return 0;
    }
}

/**
 * Clear all articles from the cache
 * @returns {Promise<boolean>} True if successful
 */
export async function clearAllArticles() {
    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        await store.clear();
        await tx.done;

        console.log('✅ IndexedDB: Cleared all articles');
        return true;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to clear articles:', error);
        return false;
    }
}

/**
 * Get total number of cached articles
 * @returns {Promise<number>} Article count
 */
export async function getArticleCount() {
    try {
        const db = await initDatabase();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        const count = await store.count();
        await tx.done;

        return count;
    } catch (error) {
        console.error('❌ IndexedDB: Failed to get article count:', error);
        return 0;
    }
}
