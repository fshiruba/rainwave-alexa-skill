const CHANNELS = {
  game: {
    id: 1,
    name: 'Game',
    streamUrl: 'https://stream.rainwave.cc/game.mp3',
    token: 'rainwave:game',
  },
  ocremix: {
    id: 2,
    name: 'OC ReMix',
    streamUrl: 'https://stream.rainwave.cc/ocremix.mp3',
    token: 'rainwave:ocremix',
  },
  covers: {
    id: 3,
    name: 'Covers',
    streamUrl: 'https://stream.rainwave.cc/covers.mp3',
    token: 'rainwave:covers',
  },
  chiptune: {
    id: 4,
    name: 'Chiptune',
    streamUrl: 'https://stream.rainwave.cc/chiptune.mp3',
    token: 'rainwave:chiptune',
  },
  all: {
    id: 5,
    name: 'All',
    streamUrl: 'https://stream.rainwave.cc/all.mp3',
    token: 'rainwave:all',
  },
};

const CHANNEL_KEYS = Object.keys(CHANNELS);

function getChannelByToken(token) {
  return Object.values(CHANNELS).find(ch => ch.token === token) || null;
}

function getNextChannel(currentToken) {
  const current = getChannelByToken(currentToken);
  if (!current) return CHANNELS.game;
  const currentKey = CHANNEL_KEYS.find(k => CHANNELS[k] === current);
  const nextIndex = (CHANNEL_KEYS.indexOf(currentKey) + 1) % CHANNEL_KEYS.length;
  return CHANNELS[CHANNEL_KEYS[nextIndex]];
}

module.exports = { CHANNELS, getChannelByToken, getNextChannel };
