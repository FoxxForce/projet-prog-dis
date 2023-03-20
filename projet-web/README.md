L'utilisateur "useradmin" doit exister dans la bdd avec le mdp "mypass", mais normalement, le script sql créer l'utilisateur et lui attribue les droits d'action sur les tables

Création et initialisation de la base de données :
- lancer psql
- Créer la base de données avec `CREATE DATABASE projet;`
- Quitter psql puis lancer la commande `psql projet2`
- importer le fichier init.sql avec la commande `\i init.sql`

Lancer le serveur :
- nodejs Serveur.js
