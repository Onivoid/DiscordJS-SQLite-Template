## Étape 1: Prérequis
Assurez-vous que vous avez les dernières versions de Node.js et NPM installées sur votre système. Vous aurez également besoin d'un compte Discord pour créer votre bot et obtenir son token d'authentification.

## Étape 2: Initialisation du projet
> Créez un nouveau dossier pour votre projet et ouvrez-le dans votre éditeur de code préféré. Dans le terminal, exécutez la commande suivante pour initialiser le projet :
```powershell
npm init -y
```
Cela va créer un fichier package.json dans votre dossier de projet.

## Étape 3: Installation des dépendances
Vous aurez besoin d'installer les dépendances suivantes pour votre projet :

* `discord.js` : une bibliothèque Node.js pour interagir avec l'API Discord
* `dotenv` : une bibliothèque Node.js pour charger les variables d'environnement à partir d'un fichier `.env`
* `sequelize` : une bibliothèque Node.js pour interagir avec des bases de données relationnelles
* `sqlite3` : une bibliothèque Node.js pour interagir avec des bases de données SQLite

> Exécutez la commande suivante pour installer ces dépendances:
```powershell
npm install discord.js dotenv sequelize sqlite3
```

## Étape 4: Création de la structure de fichiers et de dossiers
> Créez un dossier `src` pour contenir tous vos fichiers source. À l'intérieur de `src`, créez un dossier `commands` pour stocker tous vos fichiers de commande, un dossier `config` pour stocker tous vos fichiers de configuration, et un dossier `database` pour stocker tous vos fichiers de base de données.

## Étape 5: Configuration de Dotenv
> Créez un fichier `.env` dans la racine de votre projet et ajoutez votre token Discord en tant que variable d'environnement:
```env
DISCORD_TOKEN = "<votre_token_discord>"
```
> Ensuite, dans votre fichier `src/config/config.js`, ajoutez le code suivant pour charger vos variables d'environnement à partir du fichier `.env` :
```javascript
require('dotenv').config();
```

## Étape 6: Configuration de Sequelize
> Dans le dossier `database`, créez un fichier `index.js` pour configurer Sequelize. Vous pouvez utiliser le code suivant comme base:
```javascript
const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false,
});

module.exports = sequelize;
```
Cela configure Sequelize pour utiliser une base de données SQLite stockée dans le dossier `data`.

## Étape 7: Création d'une commande
> Dans le dossier `commands`, créez un fichier `ping.js` pour votre première commande. Vous pouvez utiliser le code suivant comme base:
```javascript
const { Message } = require('discord.js');

class PingCommand {
  /**
   * @param {Message} message
   * @param {Array<string>} args
   */
  static async execute(message, args) {
    const pingMessage = await message.channel.send('Pinging...');

    pingMessage.edit(
      `Pong! Latency is ${pingMessage.createdTimestamp - message.createdTimestamp}ms.`
    );
  }

  static get description() {
    return 'Ping the bot.';
  }

  static get usage() {
    return '!ping';
  }
}

module.exports = PingCommand;
```
Ce code définit une classe `PingCommand` avec une méthode `execute()` qui répond à la commande avec un message de ping. Les propriétés `description` et `usage` sont utilisées pour afficher des informations sur la commande dans votre bot.

## Étape 8: Chargement des commandes
> Dans votre fichier `index.js`, ajoutez le code suivant pour charger dynamiquement tous vos fichiers de commande:
```javascript
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client();
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.join(__dirname, 'src/commands'))
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'src/commands', file));
  client.commands.set(command.name, command);
}

client.on('message', (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.DISCORD_TOKEN);
```
Ce code charge dynamiquement tous vos fichiers de commande et les stocke dans une collection pour une utilisation ultérieure. Il définit également un gestionnaire d'événements `message` qui exécute les commandes lorsque le bot reçoit un message.

## Étape 9: Exécution du bot
> Exécutez la commande suivante dans votre terminal pour lancer votre bot:
```powershell
node index.js
```
Votre bot devrait maintenant être en ligne et répondre à vos commandes Discord !