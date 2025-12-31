import { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { fetchAllFeeds } from './services/rssService';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeeds() {
      try {
        const fetchedArticles = await fetchAllFeeds();
        if (fetchedArticles.length === 0) {
          setError('Failed to load feeds. Please check your internet connection.');
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        console.error('Error loading feeds:', err);
        setError('Failed to load feeds. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadFeeds();
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
                secondary={article.source}
                primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;


