const strings = {
  'en-US': {
    launch: (channelName) =>
      `Starting Rainwave. Playing the ${channelName} channel. ` +
      'Say switch to OC ReMix, covers, chiptune, or all to change channels.',
    switchTo: (channelName) => `Switching to Rainwave ${channelName}.`,
    unknownChannel:
      "I didn't catch which channel you wanted. Say game, OC ReMix, covers, chiptune, or all.",
    unknownChannelReprompt: 'Which Rainwave channel would you like?',
    notPlaying:
      "Rainwave isn't playing right now. Say play game music to start.",
    nowPlaying: (channelName, title, artist, album) =>
      `Now playing on Rainwave ${channelName}: "${title}" by ${artist} from ${album}.`,
    listeningTo: (channelName) =>
      `You're listening to the Rainwave ${channelName} channel.`,
    help:
      'Rainwave streams video game music radio. ' +
      'Say play game, play OC ReMix, play covers, play chiptune, or play all. ' +
      "You can also say what's playing, next channel, pause, or stop.",
    helpReprompt: 'Which channel would you like?',
    error: 'Sorry, something went wrong. Please try again.',
  },
  'pt-BR': {
    launch: (channelName) =>
      `Iniciando o Rainwave. Tocando o canal ${channelName}. ` +
      'Diga mudar para OC ReMix, covers, chiptune ou todos para trocar de canal.',
    switchTo: (channelName) => `Mudando para o Rainwave ${channelName}.`,
    unknownChannel:
      'Não entendi qual canal você quer. Diga game, OC ReMix, covers, chiptune ou todos.',
    unknownChannelReprompt: 'Qual canal do Rainwave você quer ouvir?',
    notPlaying:
      'O Rainwave não está tocando agora. Diga tocar game music para começar.',
    nowPlaying: (channelName, title, artist, album) =>
      `Tocando agora no Rainwave ${channelName}: "${title}" de ${artist}, do álbum ${album}.`,
    listeningTo: (channelName) =>
      `Você está ouvindo o canal ${channelName} do Rainwave.`,
    help:
      'O Rainwave é uma rádio de música de videogame. ' +
      'Diga tocar game, tocar OC ReMix, tocar covers, tocar chiptune ou tocar todos. ' +
      'Você também pode perguntar o que está tocando, próximo canal, pausar ou parar.',
    helpReprompt: 'Qual canal você quer ouvir?',
    error: 'Desculpe, algo deu errado. Por favor, tente novamente.',
  },
};

function getStrings(locale) {
  return strings[locale] || strings['en-US'];
}

module.exports = { getStrings };
