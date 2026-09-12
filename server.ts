import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateMoleculeData, generateQuestionsData } from './chemistry/generator';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API Endpoint to generate real 3D molecular structure from any chemical or IUPAC name
app.post('/api/generate-molecule', async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Chemical or IUPAC name is required.' });
  }

  try {
    const result = await generateMoleculeData(name.trim());
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating molecule:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate 3D molecule' });
  }
});

// AI Question Generator Endpoint
app.post('/api/generate-questions', async (req, res) => {
  const { educationLevel = 'class_11', count = 3, weakTopics = [] } = req.body;

  try {
    const result = await generateQuestionsData(educationLevel, count, weakTopics);
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate questions' });
  }
});

// Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HoloHydro full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
