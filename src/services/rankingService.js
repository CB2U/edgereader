/**
 * rankingService.js
 * Implementation of the client-side ranking algorithm for EdgeReader.
 * Scores articles based on recency, topics, sources, and keywords.
 */

/**
 * Scores a single article based on user preferences.
 * @param {Object} article - The article object to score.
 * @param {Object} prefs - User preferences from storageService.
 * @returns {number} The calculated score.
 */
export function scoreArticle(article, prefs) {
    let score = 0;

    // 1. Recency Decay (Max 100 points)
    // Linear decay over 24 hours.
    if (article.publishDate) {
        const ageMs = Date.now() - new Date(article.publishDate).getTime();
        const ageHours = ageMs / (1000 * 60 * 60);
        score += Math.max(0, 100 - ageHours);
    }

    // 2. Topic Matching (+50 points)
    if (article.topic && prefs.selectedTopics && prefs.selectedTopics.has(article.topic)) {
        score += 50;
    }

    // 3. Source Filtering & Priority
    if (prefs.disabledSources && prefs.disabledSources.has(article.source)) {
        return -1000; // Effectively filter out
    }
    if (prefs.enabledSources && prefs.enabledSources.has(article.source)) {
        score += 30;
    }

    // 4. Keyword Matching (+20 per keyword, max 60 total)
    if (prefs.keywords && prefs.keywords.size > 0) {
        let keywordBonus = 0;
        const searchArea = `${article.title || ''} ${article.description || ''}`.toLowerCase();

        prefs.keywords.forEach(keyword => {
            if (searchArea.includes(keyword.toLowerCase())) {
                keywordBonus += 20;
            }
        });

        score += Math.min(60, keywordBonus);
    }

    return score;
}

/**
 * Ranks a list of articles based on user preferences.
 * Filters out articles with score < -500.
 * @param {Array} articles - List of articles to rank.
 * @param {Object} prefs - User preferences from storageService.
 * @returns {Array} Sorted and filtered list of articles.
 */
export function rankArticles(articles, prefs) {
    const startTime = performance.now();

    const ranked = articles
        .map(article => ({
            ...article,
            _score: scoreArticle(article, prefs)
        }))
        .filter(article => article._score > -500)
        .sort((a, b) => b._score - a._score);

    const duration = performance.now() - startTime;
    console.log(`[Ranking] Ranked ${articles.length} articles in ${duration.toFixed(2)}ms`);

    return ranked;
}
