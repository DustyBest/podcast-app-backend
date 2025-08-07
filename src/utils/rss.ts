import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
    'https://video-api.wsj.com/podcast/rss/wsj/minute-briefing?_gl=1*ss93nb*_gcl_au*Njg3ODY2MzcuMTc1NDQ0MzM2Ng..*_ga*MTU1ODM5Njk0OS4xNzU0NDQzMzY2*_ga_K2H7B9JRSS*czE3NTQ0NDMzNjYkbzEkZzEkdDE3NTQ0NDM1MzQkajMzJGwwJGgxNTUzNjgwMzkw',
    'https://video-api.wsj.com/podcast/rss/wsj/whats-news?_gl=1*1b1cqvz*_gcl_au*Njg3ODY2MzcuMTc1NDQ0MzM2Ng..*_ga*MTU1ODM5Njk0OS4xNzU0NDQzMzY2*_ga_K2H7B9JRSS*czE3NTQ0NDMzNjYkbzEkZzEkdDE3NTQ0NDM1MDkkajU4JGwwJGgxNTUzNjgwMzkw',
    'https://podcast.voice.api.bbci.co.uk/rss/audio/p002vsmz?api_key=JqAy8fGqi8lpxLsr3WaGxyG31AZ5URMr',
    'https://feeds.megaphone.fm/ign-game-entertainment-news',
    'https://video-api.wsj.com/podcast/rss/wsj/tech-news-briefing',
    'https://feeds.megaphone.fm/ESP4070128464',
    'https://feeds.megaphone.fm/CBS8358037229',
    'https://www.spreaker.com/show/1401466/episodes/feed',
    'http://www3.nhk.or.jp/rj/podcast/rss/english.xml'
];

(async () => {
  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      console.log(`Fetched: ${url}`);
    } catch (err) {
      console.error(`Error fetching ${url}:`, (err as Error).message);
    }
  }
})();

type Episode = {
  title: string | undefined;
  audioUrl: string;
  description: string | undefined;
  source: string | undefined;
  image: string | undefined;
};

export async function getEpisodes() {
  const results = await Promise.all(
    feeds.map(async (url, index) => {
      try {
        const feed = await parser.parseURL(url);

        const showImage =
          feed.image?.url ||
          feed.itunes?.image ||
          (typeof feed.itunes?.image === 'string' ? feed.itunes.image : undefined);

        const latest = feed.items.sort((a, b) => {
          return new Date(b.pubDate ?? '').getTime() - new Date(a.pubDate ?? '').getTime();
        })[0];

        if (!latest?.enclosure?.url) {
          console.warn(`No audio URL for ${url}`);
          return null;
        }

        return {
          index,
          episode: {
            title: latest.title,
            audioUrl: latest.enclosure.url,
            description: latest.contentSnippet,
            source: feed.title,
            image: showImage,
          }
        };
      } catch (err) {
        console.error(`❌ Error fetching ${url}:`, (err as Error).message);
        return null;
      }
    })
  );

  function isEpisodeResult(
    entry: typeof results[number]
  ): entry is { index: number; episode: Episode } {
    return entry !== null;
  }

  const filteredResults = results.filter(isEpisodeResult);

  filteredResults.sort((a, b) => a.index - b.index);

  return filteredResults.map(entry => entry.episode);
}

