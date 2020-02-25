# Chat App

Ce serveur permet de faire tourner l'application [Chat App](https://github.com/ghivert/chat-app-front).

# Getting Started

[Node.js](https://nodejs.org/en/) >= 10 doit être installé. [Yarn](https://yarnpkg.com/lang/en/) doit être installé. [NVM](https://github.com/nvm-sh/nvm) est conseillé pour gérer les installations de Node.

Cette suite de commande n'a été vérifié que sous Unix ! (Ou sous [MinGW](http://www.mingw.org/) ou [Cygwin](https://www.cygwin.com/) ou [WSL](https://docs.microsoft.com/fr-fr/windows/wsl/install-win10).)

```bash
# Cloner le dossier puis se déplacer dedans.
yarn
yarn setup
yarn start
```

# Scripts

```bash
yarn setup
```

Cette commande peuple le `.env` à la racine du projet. Elle génère deux clés vapid et mets le port à 4000.
