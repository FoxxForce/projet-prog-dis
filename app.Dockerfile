# Utilisez une image de base Node.js avec Alpine Linux
FROM node:16-alpine

# Créez le répertoire /app dans le conteneur et définissez-le comme répertoire de travail
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json dans le conteneur
COPY projet-web/package*.json ./

# Installez les dépendances du projet avec npm
RUN npm install

# Installez le module pg pour se connecter à PostgreSQL
RUN npm install pg
RUN npm install express
# Copiez les sources JavaScript dans le conteneur
COPY projet-web .

# Exposez le port 8080 du conteneur
EXPOSE 8080

# Démarrez l'application avec la commande node index.js
CMD ["node", "Serveur.js"]