> :warning: **There are risks when using any kind of unofficial software**: Be very careful! If you lose your account, it is entirely your responsibility.

# Bombcrypto-superbot

This bot is a product of reverse engineering Bombcrypto game. It simulates the game and send messages using `websocket`. Since it does not require a browser to work, the main usage is for **multi-account**. Have fun!

moderated by Lucas Vieceli

if you don't have a computer available to run the bot, you can use the service for free via telegram. https://t.me/bombcryptoFreeBot

group telegram https://t.me/+tQcb45U9MwAxYWMx

## Features

It does the following:

-   Automatic farming on Treasure Hunt
-   Automatic Adventure mode (see usage section)
-   Automatic Amazon mode
-   Handles Home feature if a house is available

## Installation

You need the following packages installed for this bot to work:

-   https://git-scm.com/downloads
-   https://nodejs.org/en/download/ Version **16** at least.

Open bash on a folder you want the project to be cloned. Windows users (_shame_) can open **Git Bash** right-clicking on the Desktop folder or any other folder.

With a bash window open:

```bash
npm install -g yarn
git clone https://github.com/lucasvieceli/bombcrypto-superbot
cd bombcrypto-superbot
yarn install
```

Whenever the project updates, you can update your local files through `git`. Open a bash terminal on the project folder (right-click **Git Bash** inside the project folder for Windows users):

```bash
git pull
```

This command may fail if you have changed some of the files locally. If you did that, I assume you know how to use `git`. If you do not, https://git-scm.com/book.

## Usage

Open a bash terminal on the project folder, run the following command:

```bash
LOGIN=user:test:123 TELEGRAM_KEY=d2f43td2346f23... yarn go
```

If you get this error "Please update your code version", you need to update the code by running

```bash
git pull
```

The envirement variables are explained below:

-   `[LOGIN]` (**required**): The login string should be written in of the the following formats:
    -   Login/Password mode: `user:[username]:[password]`. In this mode, you pass the `username` and the `password` registered for scholarship. The final string fould be like `LOGIN=user:username1:password1`.
    -   Wallet/PrivateKey mode (:warning: **Not recommended**. Do not share your private key with anyone.): `wallet:[walletId]:[privateKey]`. In this mode, you pass the `walletId` and the `privateKey` of your wallet in order to login with full access. This mode mimics the Metamask login process. This mode is here only for completeness.
-   `[VERSION]` (**required**): Version of bombcrypto.
-   `[TELEGRAMK_KEY]` (optional): The key of a telegram bot. See Telegram integration section.
-   `[NETWORK]` (optional): BSC or POLYGON, default BSC.
-   `[MODE_ADVENTURE]` (optional): if you want to play adventure mode.
-   `[MIN_HERO_ENERGY_PERCENTAGE]` (optional): Percentage that will put the heroes to work.
-   `[ADVENTURE_HEROES]` (optional): If you have adventure mode enabled, here you can inform the ids of the heroes that will be used, if not informed, all heroes will be used, separated by ":", Example 151515881:51878184:16187755.
-   `[HOUSE_HEROES]` (optional): If you have a house, here you can inform the ids of the heroes will use the house, separated by ":", Example 151515881:51878184:16187755.
-   `[SAVE_REWARDS_CSV]` (optional): whenever the bot is started, it will write a csv file, the "csv" folder with the bombcrypto username, with the rewards data.
-   `[ALERT_SHIELD]` (optional): The value of the shield to notify you when it's running low
-   `[NUM_HERO_WORK]` (optional): Number of heroes that will work at the same time (default 15)
-   `[TELEGRAM_CHAT_ID]` (optional): Telegram chat id, in case you want to receive notifications

## Telegram integration

If you want to see the progress of the bot on your phone, you may create a telegram bot through BotFather (https://t.me/botfather). With the created key, pass the `TELEGRAM_KEY` enviroment variable when initializing the bot.

Start a conversation with the created bot and send the following:

-   `/stats`: Brings information about the current map life, the amount of working heroes and the current hero selection identifier.
-   `/rewards`: Brings the current amount of coins, heroes to be claimed and keys you have in your account.
-   `/exit`: Will kill the bot.

# Início do zero

## Contratando servidor dedicado

Caso você não tenha um servidor para colocar seu bot, você pode contratar um servidor em https://linode.com, custa 5 dolares mensais e deve aguentar 10 contas

Para aceessar o servidor do Linode, você pode utilizar o programa "Termius" [(Download Windows)](https://termius.com/windows) [(Download Linux)](https://termius.com/linux), ele existe para computador, android e ios

Veja o vídeo de como contratar o serviço e acessar a máquina

## Configurando a máquina

Para utilizar o bot, você precisa ter o Nodejs, npm, yarn e pm2 instalado. Execute o seguinte comando que irá instalar tudo automaticamente:

```
cd ~
curl -sL https://raw.githubusercontent.com/lucasvieceli/bombcrypto-superbot/novo/vm.sh -o vm.sh
bash vm.sh
```

## Configurações iniciais do bot

Caso queira ver vídeo:

Execute o seguinte comando que irá baixar todo o projeto e instalar as dependências para você:

```
cd ~
curl -sL https://raw.githubusercontent.com/lucasvieceli/bombcrypto-superbot/novo/init.sh -o init.sh
bash init.sh
cd bombcrypto-superbot
```

Para configura suas contas você precisará editar um arquivo "src/ecosystem.config.js",

```
nano src/ecosystem.config.js
```

Você verá algo como isso aqui:

```
module.exports = {
    apps: [
        {
            name: "client1", //Um nome para identificação
            instances: "1",
            exec_mode: "fork",
            script: "npm run start",
            env: {//aqui você irá colocar as configurações
                DEBUG_LEVEL: "info",
                MIN_HERO_ENERGY_PERCENTAGE: "50",
                LOGIN: "user:CHANGE:CHANGE",
                TELEGRAM_KEY: "CHANGE",
                NETWORK: "POLYGON",
                ALERT_SHIELD: 50,
                NUM_HERO_WORK: 5,
                TELEGRAM_CHAT_ID: "CHANGE"
            },
        },
    ],
};

```

Caso você queira colocar mais de uma conta, basta colocar mais um item, ficando assim:

```
module.exports = {
    apps: [
        {
            name: "client1", //Um nome para identificação
            instances: "1",
            exec_mode: "fork",
            script: "npm run start",
            env: {//aqui você irá colocar as configurações
                DEBUG_LEVEL: "info",
                MIN_HERO_ENERGY_PERCENTAGE: "50",
                LOGIN: "user:CHANGE:CHANGE",
                TELEGRAM_KEY: "CHANGE",
                NETWORK: "POLYGON",
                ALERT_SHIELD: 50,
                NUM_HERO_WORK: 5,
                TELEGRAM_CHAT_ID: "CHANGE"
            },
        },
        {
            name: "client2", //Um nome para identificação
            instances: "1",
            exec_mode: "fork",
            script: "npm run start",
            env: {//aqui você irá colocar as configurações
                DEBUG_LEVEL: "info",
                MIN_HERO_ENERGY_PERCENTAGE: "50",
                LOGIN: "user:CHANGE:CHANGE",
                TELEGRAM_KEY: "CHANGE",
                NETWORK: "POLYGON",
                ALERT_SHIELD: 50,
                NUM_HERO_WORK: 5,
                TELEGRAM_CHAT_ID: "CHANGE"
            },
        },
    ],
};

```

Salve o arquivo (CTRL + X) ele vai pergunte se você confirma, digite Y e ENTER

## Criando bot no telegram

Para você conseguir ter a TELEGRAM_KEY, vá ate seu telegram e pesquise por "botfather" e inicie uma conversa.

Digite:

```
/newbot
```

Ele vai te perguntar qual nome você gostaria do bot. Depois de informar o nome, ele vai te retornar uma mensagem parecida com essa:

```
Done! Congratulations on your new bot. You will find it at t.me/testeeee. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.

Use this token to access the HTTP API:
5966491474:AAHy6SQXGYJQqiuQ9zdqW3rI3g-123123
Keep your token secure and store it safely, it can be used by anyone to control your bot.

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
```

a onde está "Use this token to access the HTTP API:" é sua chave TELEGRAM_KEY, exemplo "5966491474:AAHy6SQXGYJQqiuQ9zdqW3rI3g-123123"

Então coloque essa chave no arquivo de configuração do bot "src/ecosystem.config.js". LEMBRANDO QUE CADA CONTA, PRECISA TER UMA CHAVE DIFERENTE

## Recuperando TELEGRAM_CHAT_ID

Para você ter o seu chat id, você precisa entrar nessa conversa: https://t.me/RawDataBot, e clicar em iniciar, ele irá te responder algo do tipo:

```
{
    "update_id": 823632503,
    "message": {
        "message_id": 1752228,
        "from": {
            "id": 123123123,
            "is_bot": false,
            "first_name": "NOME",
            "last_name": "NOME",
            "username": "NOME",
            "language_code": "pt-br"
        },
        "chat": {
            "id": 1291257220,
            "first_name": "NOME",
            "last_name": "NOME",
            "username": "NOME",
            "type": "private"
        },
        "date": 1670437683,
        "text": "/start",
        "entities": [
            {
                "offset": 0,
                "length": 6,
                "type": "bot_command"
            }
        ]
    }
```

Em "chat" está seu id, no meu caso foi "1291257220", então coloque esse id no arquivo "src/ecosystem.config.js", pode ser utilizado o mesmo id para todas as contas
