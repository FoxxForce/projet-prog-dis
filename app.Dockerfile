# Utilisez une image de base Node.js avec Alpine Linux
FROM node:14

RUN apt-get update && apt-get install -y postgresql-client

# Créez le répertoire /app dans le conteneur et définissez-le comme répertoire de travail
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json dans le conteneur
COPY projet-web/package*.json ./

# Copiez les sources JavaScript dans le conteneur
COPY projet-web .

# Installez les dépendances du projet avec npm
RUN npm install

# Installez le module pg pour se connecter à PostgreSQL
RUN npm install pg
RUN npm install express
RUN npm install ejs


# Exposez le port 4000 du conteneur
EXPOSE 4000

# Démarrez l'application avec la commande node index.js
CMD ["node", "Serveur.js"]