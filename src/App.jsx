import { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { fetchAllFeeds } from './services/rssService';
import { loadPreferences } from './services/storageService';
import { rankArticles } from './services/rankingService';
import './App.css';

/**
 * Format a date as relative time (e.g., "2h ago", "3d ago", "Dec 30")
 * @param {Date|null} date - Date to format
 * @returns {string} Formatted relative date string
 */
function formatRelativeDate(date) {
  if (!date) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    async function loadApp() {
      try {
        setLoading(true);
        // Load preferences
        const userPrefs = await loadPreferences();
        setPrefs(userPrefs);

        // Fetch articles
        const fetchedArticles = await fetchAllFeeds();
        if (fetchedArticles.length === 0) {
          setError('Failed to load feeds. Please check your internet connection.');
        } else {
          // Rank articles
          const ranked = rankArticles(fetchedArticles, userPrefs);
          setArticles(ranked);
        }
      } catch (err) {
        console.error('Error loading app data:', err);
        setError('Failed to load feeds. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          EdgeReader
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {articles.length} articles from {[...new Set(articles.map(a => a.source))].length} sources
        </Typography>
        <List>
          {articles.map((article, index) => (
            <ListItem
              key={index}
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
  );
}

export default App;


