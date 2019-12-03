# Chat App

Ce serveur permet de faire tourner l'application [Chat App](https://github.com/ghivert/chat-app-front).

# Getting Started

[Node.js](https://nodejs.org/en/) >= 10 doit être installé. [Yarn](https://yarnpkg.com/lang/en/) doit être installé. [NVM](https://github.com/nvm-sh/nvm) est conseillé pour gérer les installations de Node.

Cette suite de commande n'a été vérifié que sous Unix ! (Ou sous [MinGW](http://www.mingw.org/) ou [Cygwin](https://www.cygwin.com/) ou [WSL](https://docs.microsoft.com/fr-fr/windows/wsl/install-win10).)

```bash
git clone git@github.com:ghivert/chat-app.git
cd chat-app
touch .env
yarn
yarn web-push generate-vapid-keys
# Entrez les valeurs en tant que VAPID_PUBLIC_KEY & VAPID_PRIVATE_KEY
echo PORT=4000 >> .env
yarn start
```
