import express from 'express';
import cors from 'cors';
import { getEpisodes } from './utils/rss';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Existing episodes endpoint
app.get('/api/episodes', async (_req, res) => {
  try {
    const episodes = await getEpisodes();
    res.json(episodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

// ElevenLabs TTS proxy endpoint
app.get('/api/tts', async (req, res) => {
  const text = req.query.text as string | undefined;

  if (!text) {
    res.status(400).json({ error: 'Text query parameter is required' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY environment variable is not set');
    res.status(500).json({ error: 'TTS service not configured' });
    return;
  }

  // "Rachel" voice ID (or swap with any preferred voice ID from your ElevenLabs account)
  const VOICE_ID = 'jUPSOpRcPt8GMPsWx5fy';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_flash_v2_5', // Fast, low-latency model for short announcements
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      res.status(response.status).json({ error: 'ElevenLabs TTS synthesis failed' });
      return;
    }

    const audioBuffer = await response.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength.toString(),
      'Cache-Control': 'public, max-age=86400', // Cache repeated announcements for 24h
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS endpoint exception:', err);
    res.status(500).json({ error: 'Internal server error during TTS synthesis' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});