# Rainwave Alexa Skill

An Alexa skill for streaming [Rainwave.cc](https://rainwave.cc) video game music radio on Echo devices. Supports English and Brazilian Portuguese.

## Features

- Stream any of Rainwave's five channels: Game, OC ReMix, Covers, Chiptune, All
- Ask what's currently playing (title, artist, album via the Rainwave API)
- Switch channels by voice
- Transport controls on Echo lock screen / physical buttons

## Voice Commands

### English
| Say | Action |
|-----|--------|
| "Alexa, open rainwave" | Start the Game channel |
| "Alexa, ask rainwave to play OC ReMix" | Switch to a specific channel |
| "Alexa, ask rainwave what's playing" | Current song info |
| "Alexa, next channel" | Cycle to the next channel |
| "Alexa, pause / stop / resume" | Playback controls |

### Português (BR)
| Diga | Ação |
|------|------|
| "Alexa, abrir rainwave" | Iniciar o canal Game |
| "Alexa, pedir ao rainwave para tocar chiptune" | Trocar de canal |
| "Alexa, pedir ao rainwave o que está tocando" | Info da música atual |
| "Alexa, próximo canal" | Avançar para o próximo canal |
| "Alexa, pausar / parar / continuar" | Controles de reprodução |

## Channels

| Slot value | Channel |
|------------|---------|
| `game` | Game music |
| `ocremix` | OC ReMix remixes |
| `covers` | Game music covers |
| `chiptune` | Chiptune / 8-bit |
| `all` | All channels mixed |

## Project Structure

```
├── ask-resources.json                        # ASK CLI v2 deployment config
├── skill-package/
│   ├── skill.json                            # Skill manifest
│   └── interactionModels/custom/
│       ├── en-US.json                        # English interaction model
│       └── pt-BR.json                        # Portuguese interaction model
└── lambda/
    ├── index.js                              # Main Alexa request handler
    ├── channels.js                           # Channel definitions and helpers
    ├── rainwave.js                           # Rainwave API v4 client
    ├── strings.js                            # Localized response strings
    └── package.json
```

## Requirements

- [Node.js](https://nodejs.org) 14+
- [ASK CLI v2](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html): `npm install -g ask-cli`
- [Amazon Developer account](https://developer.amazon.com) (free)
- [AWS account](https://aws.amazon.com) (free tier is sufficient)

## Deployment

**1. Configure ASK CLI** (first time only):
```bash
ask configure
```
This links your Amazon Developer account and AWS credentials.

**2. Install Lambda dependencies:**
```bash
cd lambda && npm install
```

**3. Deploy:**
```bash
ask deploy
```

This creates the skill in the Alexa Developer Console, deploys a Lambda function on AWS, and wires everything together automatically.

**4. Test:**

Go to [developer.amazon.com/alexa/console/ask](https://developer.amazon.com/alexa/console/ask) → your skill → **Test** tab → type `open rainwave`.

On your Echo: say **"Alexa, open rainwave"**.

## Redeploying

After any code or model changes, just run `ask deploy` again from the project root.

## Cost

Free. The skill runs on AWS Lambda's permanent free tier (1M requests/month). Audio streams directly from Rainwave's servers — Lambda only handles small JSON responses.

## License

GPL-3.0
