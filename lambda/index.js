const Alexa = require('ask-sdk-core');
const { CHANNELS, getChannelByToken, getNextChannel } = require('./channels');
const { getNowPlaying, formatNowPlaying } = require('./rainwave');
const { getStrings } = require('./strings');

// --- Helpers ---

function resolveSlotId(slot) {
  const resolutions = slot &&
    slot.resolutions &&
    slot.resolutions.resolutionsPerAuthority;
  if (resolutions && resolutions.length > 0) {
    const auth = resolutions[0];
    if (
      auth.status &&
      auth.status.code === 'ER_SUCCESS_MATCH' &&
      auth.values &&
      auth.values.length > 0
    ) {
      return auth.values[0].value.id;
    }
  }
  return slot && slot.value ? slot.value.toLowerCase() : null;
}

function audioPlayerContext(handlerInput) {
  return handlerInput.requestEnvelope.context.AudioPlayer || {};
}

function t(handlerInput) {
  const locale = handlerInput.requestEnvelope.request.locale || 'en-US';
  return getStrings(locale);
}

function buildPlayDirective(channel, offsetInMilliseconds = 0) {
  return {
    type: 'AudioPlayer.Play',
    playBehavior: 'REPLACE_ALL',
    audioItem: {
      stream: {
        url: channel.streamUrl,
        token: channel.token,
        offsetInMilliseconds,
      },
      metadata: {
        title: `Rainwave — ${channel.name}`,
        subtitle: 'Video game music radio',
      },
    },
  };
}

// --- Request handlers ---

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const channel = CHANNELS.game;
    return handlerInput.responseBuilder
      .speak(t(handlerInput).launch(channel.name))
      .addDirective(buildPlayDirective(channel))
      .getResponse();
  },
};

const PlayChannelIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayChannelIntent'
    );
  },
  handle(handlerInput) {
    const s = t(handlerInput);
    const channelId = resolveSlotId(
      Alexa.getSlot(handlerInput.requestEnvelope, 'channel')
    );
    const channel = CHANNELS[channelId];

    if (!channel) {
      return handlerInput.responseBuilder
        .speak(s.unknownChannel)
        .reprompt(s.unknownChannelReprompt)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(s.switchTo(channel.name))
      .addDirective(buildPlayDirective(channel))
      .getResponse();
  },
};

const NowPlayingIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'NowPlayingIntent'
    );
  },
  async handle(handlerInput) {
    const s = t(handlerInput);
    const { token } = audioPlayerContext(handlerInput);
    const channel = token ? getChannelByToken(token) : null;

    if (!channel) {
      return handlerInput.responseBuilder
        .speak(s.notPlaying)
        .getResponse();
    }

    try {
      const data = await getNowPlaying(channel.id);
      const song = formatNowPlaying(data);
      if (song) {
        return handlerInput.responseBuilder
          .speak(s.nowPlaying(channel.name, song.title, song.artist, song.album))
          .getResponse();
      }
    } catch (e) {
      console.error('Rainwave API error:', e);
    }

    return handlerInput.responseBuilder
      .speak(s.listeningTo(channel.name))
      .getResponse();
  },
};

const NextIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent'
    );
  },
  handle(handlerInput) {
    const { token } = audioPlayerContext(handlerInput);
    const next = getNextChannel(token);
    return handlerInput.responseBuilder
      .speak(t(handlerInput).switchTo(next.name))
      .addDirective(buildPlayDirective(next))
      .getResponse();
  },
};

const PauseIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({ type: 'AudioPlayer.Stop' })
      .getResponse();
  },
};

const ResumeIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent'
    );
  },
  handle(handlerInput) {
    const { token } = audioPlayerContext(handlerInput);
    // Live stream — always restart from 0; the offset into a past live stream is meaningless
    const channel = token ? getChannelByToken(token) : CHANNELS.game;
    return handlerInput.responseBuilder
      .addDirective(buildPlayDirective(channel, 0))
      .getResponse();
  },
};

const StopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
      )
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({ type: 'AudioPlayer.Stop' })
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const s = t(handlerInput);
    return handlerInput.responseBuilder
      .speak(s.help)
      .reprompt(s.helpReprompt)
      .getResponse();
  },
};

// AudioPlayer events — must be handled but need no logic for a live stream
const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('AudioPlayer.');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

// Physical button / lock-screen transport controls on Echo devices
const PlaybackControllerHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('PlaybackController.');
  },
  handle(handlerInput) {
    const type = Alexa.getRequestType(handlerInput.requestEnvelope);
    const { token } = audioPlayerContext(handlerInput);

    if (type === 'PlaybackController.PlayCommandIssued') {
      const channel = token ? getChannelByToken(token) : CHANNELS.game;
      return handlerInput.responseBuilder
        .addDirective(buildPlayDirective(channel, 0))
        .getResponse();
    }

    if (type === 'PlaybackController.PauseCommandIssued') {
      return handlerInput.responseBuilder
        .addDirective({ type: 'AudioPlayer.Stop' })
        .getResponse();
    }

    if (type === 'PlaybackController.NextCommandIssued') {
      const next = getNextChannel(token);
      return handlerInput.responseBuilder
        .addDirective(buildPlayDirective(next))
        .getResponse();
    }

    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Unhandled error:', error);
    return handlerInput.responseBuilder
      .speak(t(handlerInput).error)
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayChannelIntentHandler,
    NowPlayingIntentHandler,
    NextIntentHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    StopIntentHandler,
    HelpIntentHandler,
    AudioPlayerEventHandler,
    PlaybackControllerHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
