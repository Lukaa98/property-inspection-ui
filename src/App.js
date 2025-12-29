import { Container, Typography } from '@mui/material';
import ResumeEditor from './components/ResumeEditor';

function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resume Block Editor (Demo)
      </Typography>

      <ResumeEditor />
    </Container>
  );
}

export default App;
