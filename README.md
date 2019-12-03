# Chat App

Le but du projet est de construire une application de chat instantané. L'idée est de commencer petit pour construire quelque chose de plus en plus intéressant. Dans les grandes lignes, l'idée est de reprendre IRC from scratch et de l'améliorer.

Un serveur basique est fourni. Celui-ci pourra évoluer au fil du temps et des besoins. Celui-ci comporte deux endpoints REST : `/subscribe`, `/message` ainsi que `/direct-message`. Celles-ci sont toutes des `POST`.

- `/subscribe` permet de s'abonner aux différents messages entrants en notification push. L'abonnement est fait automatiquement au lancement de l'application.
- `/message` permet d'envoyer un message à toutes les personnes connectées à l'application, y compris l'émetteur. Body : `{ title: String, message: String, username: String }`. La réponse est de type `{ direct: false, title: String, message: String, username: String }`.
- `/direct-message` permet d'envoyer un message uniquement à une seule personne si celle-ci est connectée. Body : `{ title: String, message: String, username: String }`. La réponse est de type `{ direct: true, title: String, message: String, username: String }`.


Une instance tourne en continu sur les serveurs de Heroku. Elle est accessible à l'adresse [`https://cfa-chat-app.herokuapp.com/`](https://cfa-chat-app.herokuapp.com/). Le code se trouve sur [GitHub](https://github.com/ghivert/chat-app). Vous pouvez facilement l'instancier sur votre
ordinateur. Les informations sont dans le README du dépôt. Pour s'assurer d'y accéder, il faut créer la variable d'environnement `ELM_APP_PROD` dans votre `.env`.

Le serveur accepte tous les CORS. Vous n'aurez pas de problème pour vous y connecter. Le front tourne pour sa part à l'aide de Webpack. Il suffit de cloner le dépôt, d'installer les dépendances avec Yarn, et d'exécuter un `yarn start` pour lancer le dev serveur. Un peu de configuration est nécessaire en plaçant un `.env` à la racine du projet. Celui-ci devra contenir une variable `ELM_APP_VAPID_PUBLIC_KEY`. La valeur sur le serveur est `BCGVfnh3sQqAB6tep5s1PNzSI1pKYnv4jRw37obTLn9ot0BNANFVf-q6TdKyJ_SIy7T__5uHXKxGQMekImLOUCs`. Dans le cas où vous faites tourner le serveur sur votre ordinateur, générer deux clés comme indiqué dans le README puis indiquer la clé publique.

Tout le code peut être modifié, serveur compris.

# Les objectifs

## Objectifs obligatoires

- Pouvoir se connecter sur l'application et renseigner un username.
- Pouvoir voir les messages des autres personnes connectées sur l'application. Les messages s'afficheront sous la forme `[username]: content`.
- Pouvoir écrire un message dans un champ de texte, et envoyer le message au reste des personnes connectées.
- Quand un utilisateur se connecte, tout le monde doit recevoir un message `X vient de se connecter`.

## Objectifs secondaires

- Sauvegarder les messages en localStorage et les restaurer au lancement de l'application.
- Pouvoir envoyer des GIF. Ces GIF devront pouvoir être récupérés depuis internet.
- Pouvoir envoyer des emojis à l'aide d'un sélécteur d'emojis.
- Pouvoir chatter en privé dans des canaux dédiés. Il faudra modifier le serveur web.
- Créer des channels pour des discussions à thème.
- Et tout ce que vous pouvez proposer pour améliorer l'application.
