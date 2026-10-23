import express from 'express';
import cors from 'cors';
import { getEpisodes } from './utils/rss';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Existing episodes route
app.get('/api/episodes', async (_req, res) => {
  try {
    const episodes = await getEpisodes();
    res.json(episodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

// Add the ElevenLabs TTS proxy route
app.get('/api/tts', async (req, res) => {
  const text = req.query.text as string | undefined;
  const voiceId = (req.query.voice as string) || 'XrExE9yKIg1WjnnlVkGX';

  if (!text) {
    res.status(400).json({ error: 'Text query parameter is required' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY environment variable is missing');
    res.status(500).json({ error: 'TTS API key not configured on server' });
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_flash_v2_5',
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
      'Cache-Control': 'public, max-age=86400',
    });

    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('TTS endpoint exception:', err);
    res.status(500).json({ error: 'Internal server error during TTS synthesis' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});