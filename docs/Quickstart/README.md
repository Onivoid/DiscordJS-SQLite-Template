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
PREFIX = "<le_prefix_de_votre_bot>"
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
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Afficher la latence du bot'),
    async execute(interaction) {
        const now = Date.now();
        await interaction.reply(`La latence est de ${now - interaction.createdTimestamp}ms.`);
    },
};
```

## Étape 8: Chargement des commandes
> Dans votre fichier `index.js`, ajoutez le code suivant pour charger dynamiquement tous vos fichiers de commande:
```javascript
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('./src/config/config');

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});
client.commands = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
    console.log(`Invite Link: ${inviteLink}`);
});

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
```

## Étape 9: Exécution du bot
> Exécutez la commande suivante dans votre terminal pour lancer votre bot:
```powershell
node index.js
```
Votre bot devrait maintenant être en ligne et répondre à vos commandes Discord !