# Jeu La Porte

**La Porte** est un jeu de grille interactif, jouable dans un navigateur, où le joueur doit naviguer d'un point de départ jusqu'à la porte, en ramassant une clé et en évitant les ennemis. Le jeu suit les statistiques des joueurs, prend en charge la connexion et l'inscription des utilisateurs, et offre une expérience utilisateur amusante et engageante.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Règles du jeu](#règles-du-jeu)
- [Structure des fichiers](#structure-des-fichiers)
- [Personnalisation](#personnalisation)
- [Améliorations futures](#améliorations-futures)
- [Licence](#licence)
- [Remerciements](#remerciements)

## Fonctionnalités

- **Authentification des utilisateurs** : Les joueurs peuvent se connecter, s'inscrire et voir leurs scores sauvegardés.
- **Plateau de jeu dynamique** : Une grille interactive 8x8 où le joueur doit récupérer une clé et atteindre la porte de sortie.
- **Suivi des scores** : Les scores sont mis à jour en fonction de la performance et sauvegardés entre les sessions.
- **Mouvement aléatoire des ennemis** : Les ennemis se déplacent aléatoirement sur la grille, ajoutant un défi supplémentaire.
- **Page de statistiques** : Affiche les scores de tous les joueurs sous forme de tableau.

## Technologies utilisées

- **Node.js** : Serveur backend avec le framework Express.
- **Express** : Gestion des routes, de l'authentification et de la logique de jeu.
- **JavaScript (ES6+)** : Implémentation de la logique de jeu côté client et serveur.
- **HTML/CSS** : Structure et style de l'interface utilisateur.
- **JSON** : Stockage de l'état du jeu et des données des utilisateurs.

## Installation

1. Clonez ce dépôt sur votre machine locale.
   ```
   git clone <https://github.com/o-Bunny-o/la_porte/>

2. Accédez au répertoire du projet.
    ```
    cd la_porte
    
3. Installez les dépendances :


npm install
Utilisation
Démarrez le serveur.


npm start
Ouvrez votre navigateur et allez à http://localhost:81 pour accéder au jeu.
Règles du jeu
But : Atteindre la porte avec la clé pour s’échapper.
Déplacement : Utilisez les flèches du clavier pour bouger vers le haut, le bas, la gauche ou la droite.
Ramassage de la clé : Déplacez-vous vers la case contenant la clé pour la ramasser.
Éviter les ennemis : Si vous vous déplacez sur une case occupée par un ennemi, vous perdez la partie.
Victoire : Si vous atteignez la porte avec la clé, vous gagnez 10 points.
Structure des fichiers
server.js : Fichier principal du serveur avec la logique de jeu, l'authentification des utilisateurs et les routes.
client.js : JavaScript côté client qui gère les interactions utilisateur, la connexion, le rendu du jeu et les mouvements.
index.html : Structure HTML pour le frontend du jeu.
styles.css : CSS pour la mise en page, le style et la conception réactive.
game_state.json : Stocke l'état actuel du jeu, y compris les positions du joueur, de la clé, de la porte et des ennemis.
users.json : Stocke les informations d'identification et les scores des utilisateurs.
public/assets : Contient des images de fond et d'autres ressources visuelles.
Personnalisation
Changer la taille du plateau de jeu : Modifiez la taille de la grille dans client.js et server.js pour créer une autre disposition de plateau.
Ajouter plus d'ennemis : Ajoutez d'autres positions d'ennemis dans game_state.json et personnalisez la logique de déplacement des ennemis dans server.js.
Ajuster les points : Modifiez l'incrément des scores dans server.js pour augmenter ou diminuer les points attribués en cas de victoire.
Changer le style : Modifiez styles.css pour changer les couleurs, les tailles de boutons ou les propriétés de disposition.
Améliorations futures
Niveaux de difficulté : Ajoutez des options pour varier la vitesse des ennemis ou ajouter des obstacles supplémentaires.
Tableau des meilleurs scores : Stockez les scores dans une base de données et affichez un classement des meilleurs joueurs.
Effets sonores : Améliorez l'expérience de jeu avec des sons pour les déplacements, les victoires/défaites et les interactions.
Design réactif : Optimisez l'interface utilisateur pour les vues mobiles et tablettes.
Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

Remerciements
Développé avec Node.js et le framework Express.
Inspiré par les jeux de puzzle classiques basés sur des grilles.
