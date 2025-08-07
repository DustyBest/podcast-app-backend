import express from 'express';
import cors from 'cors';
import { getEpisodes } from './utils/rss'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/episodes', async (_req, res) => {
  try {
    const episodes = await getEpisodes();
    res.json(episodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
