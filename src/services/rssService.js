import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
});

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const TEST_FEEDS = [
    { name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', topic: 'General' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', topic: 'Technology' },
    { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', topic: 'General' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', topic: 'Technology' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', topic: 'Technology' },
];

/**
 * Extract text content from a value that might be a string or an object with #text property
 * @param {string|Object} value - Value to extract text from
 * @param {string} fallback - Fallback value if extraction fails
 * @returns {string} Extracted text content
 */
function extractText(value, fallback = '') {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value['#text']) return value['#text'];
    return fallback;
}

/**
 * Normalize parsed RSS/Atom feed items to a common format
 * @param {Object} parsed - Parsed XML object
 * @param {string} sourceName - Name of the feed source
 * @returns {Array} Array of normalized article objects
 */
function normalizeItems(parsed, sourceName) {
    let items = [];

    // Handle RSS 2.0 format
    if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
        items = Array.isArray(parsed.rss.channel.item)
            ? parsed.rss.channel.item
            : [parsed.rss.channel.item];

        return items.map(item => ({
            title: extractText(item.title, 'Untitled'),
            url: extractText(item.link || item.guid, '#'),
            source: sourceName,
        }));
    }

    // Handle Atom format
    if (parsed.feed && parsed.feed.entry) {
        items = Array.isArray(parsed.feed.entry)
            ? parsed.feed.entry
            : [parsed.feed.entry];

        return items.map(item => ({
            title: extractText(item.title, 'Untitled'),
            url: item.link?.['@_href'] || extractText(item.id, '#'),
            source: sourceName,
        }));
    }

    return [];
}

/**
 * Fetch and parse a single RSS feed
 * @param {Object} feed - Feed configuration object with name, url, and topic
 * @returns {Promise<Array>} Array of article objects
 */
export async function fetchFeed(feed) {
    try {
        const proxiedUrl = CORS_PROXY + encodeURIComponent(feed.url);
        const response = await fetch(proxiedUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xml = await response.text();
        const parsed = parser.parse(xml);

        return normalizeItems(parsed, feed.name);
    } catch (error) {
        console.error(`Failed to fetch ${feed.name}:`, error);
        return []; // Return empty array on failure
    }
}

/**
 * Fetch all configured RSS feeds in parallel
 * @returns {Promise<Array>} Combined array of all articles from all feeds
 */
export async function fetchAllFeeds() {
    const results = await Promise.all(TEST_FEEDS.map(fetchFeed));
    return results.flat(); // Flatten array of arrays into single array
}
