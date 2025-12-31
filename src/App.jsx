import { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress, Alert, Drawer, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchAllFeeds } from './services/rssService';
import { loadPreferences } from './services/storageService';
import { rankArticles } from './services/rankingService';
import { insertArticles, deleteOldArticles, getArticles } from './services/articleStorage';
import './App.css';
import OfflineIndicator from './components/OfflineIndicator';
import RefreshButton from './components/RefreshButton';
import SettingsPanel from './components/SettingsPanel';

/**
 * Format a date as relative time (e.g., "2h ago", "3d ago", "Dec 30")
 * @param {Date|null} date - Date to format
 * @returns {string} Formatted relative date string
 */
function formatRelativeDate(date) {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // 1. Load preferences
      const userPrefs = await loadPreferences();
      setPrefs(userPrefs);

      // 2. Try fetching from network if online
      let fetchedArticles = [];
      if (navigator.onLine) {
        try {
          fetchedArticles = await fetchAllFeeds();
          if (fetchedArticles.length > 0) {
            // Cache new articles to IndexedDB
            const inserted = await insertArticles(fetchedArticles);
            const deleted = await deleteOldArticles(100);
            console.log(`📦 Cache: Inserted ${inserted} new articles, pruned ${deleted} old articles`);
          }
        } catch (fetchErr) {
          console.warn('Network fetch failed, falling back to cache:', fetchErr);
        }
      }

      // 3. If network fetch failed or offline, load from cache
      if (fetchedArticles.length === 0) {
        console.log('🔄 Loading articles from IndexedDB cache...');
        fetchedArticles = await getArticles(100);
      }

      if (fetchedArticles.length === 0) {
        setError('No articles available. Please connect to the internet to fetch the latest news.');
      } else {
        // Rank articles
        const ranked = rankArticles(fetchedArticles, userPrefs);
        setArticles(ranked);
      }
    } catch (err) {
      console.error('Error loading app data:', err);
      setError('An unexpected error occurred. Please try reloading.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    if (!isOnline) {
      setError('Cannot refresh while offline');
      return;
    }
    loadData(true);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <OfflineIndicator isOnline={isOnline} />
      <Container maxWidth="md">
        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
          </Box>
        )}
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1">
                EdgeReader
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {articles.length} articles from {[...new Set(articles.map(a => a.source))].length} sources
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RefreshButton
                onRefresh={handleRefresh}
                isLoading={refreshing}
                isOnline={isOnline}
              />
              <IconButton
                onClick={() => setSettingsOpen(true)}
                title="Settings"
                aria-label="Settings"
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
          <List>
            {articles.map((article, index) => (
              <ListItem
                key={article.id || index}
                component="a"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={article.title}
                  secondary={
                    <>
                      {article.description && (
                        <Typography component="span" variant="body2" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          {article.description.length > 150
                            ? article.description.substring(0, 150) + '...'
                            : article.description}
                        </Typography>
                      )}
                      <Typography component="span" variant="caption" color="text.secondary">
                        {article.source}{article.publishDate && ` • ${formatRelativeDate(article.publishDate)}`}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: { xs: '100vw', sm: 400 } }}>
          <SettingsPanel />
        </Box>
      </Drawer>
    </>
  );
}

export default App;
