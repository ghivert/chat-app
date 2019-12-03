# Chat App

Ce serveur permet de faire tourner l'application [Chat App](https://github.com/ghivert/chat-app-front).

# Getting Started

[Node.js](https://nodejs.org/en/) >= 10 doit être installé. [Yarn](https://yarnpkg.com/lang/en/) doit être installé. [NVM](https://github.com/nvm-sh/nvm) est conseillé pour gérer les installations de Node.

```bash
git clone git@github.com:ghivert/chat-app.git
cd chat-app
touch .env
yarn
yarn webpush generate-vapid-keys
# Entrez les valeurs en tant que VAPID_PUBLIC_KEY & VAPID_PRIVATE_KEY
echo PORT=4000 >> .env
yarn start
```
