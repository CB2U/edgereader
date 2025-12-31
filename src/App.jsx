import { Container, Typography, Button, Box } from '@mui/material';
import './App.css';

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          EdgeReader
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          News aggregation at the edge. Your content, your device, zero tracking.
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 4 }}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default App;

