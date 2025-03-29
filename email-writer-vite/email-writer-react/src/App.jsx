import { useState } from 'react';
import './App.css';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
       tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: '16px', background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)' }}>
        <Typography variant='h3' component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#374151' }}>
          Email Reply Generator
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField 
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email Content"
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3, borderRadius: '8px' }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{ borderRadius: '8px', background: '#4F46E5', '&:hover': { background: '#4338CA' } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : "Generate Reply"}
          </Button>
        </Box>

        {error && (
          <Typography color='error' sx={{ mt: 3, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: '#374151' }}>
              Generated Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              inputProps={{ readOnly: true }}
              sx={{ borderRadius: '8px', background: '#FFFFFF' }}
            />

            <Button
              variant='outlined'
              sx={{ mt: 2, borderRadius: '8px', color: '#4F46E5', borderColor: '#4F46E5', '&:hover': { borderColor: '#4338CA' } }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
