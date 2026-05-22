const https = require('https');

const API_BASE = 'https://rainwave.cc/api4';

function getNowPlaying(stationId) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      `${API_BASE}/info?sid=${stationId}`,
      { headers: { 'User-Agent': 'RainwaveAlexaSkill/1.0' } },
      (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
      }
    );
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

function formatNowPlaying(data) {
  const song = data.sched_current &&
    data.sched_current.songs &&
    data.sched_current.songs[0];
  if (!song) return null;

  const title = song.title || 'Unknown';

  let artist = 'Unknown';
  if (Array.isArray(song.artists) && song.artists.length > 0) {
    artist = song.artists.map(a => a.name).join(', ');
  } else if (song.artist_tag) {
    artist = song.artist_tag;
  }

  let album = 'Unknown';
  if (Array.isArray(song.albums) && song.albums.length > 0) {
    album = song.albums[0].name;
  } else if (song.album_name) {
    album = song.album_name;
  }

  return { title, artist, album };
}

module.exports = { getNowPlaying, formatNowPlaying };
