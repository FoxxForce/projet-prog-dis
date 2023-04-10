# Utilisez une image de base PostgreSQL
FROM postgres:latest

# Copiez le fichier init.sql dans le répertoire /docker-entrypoint-initdb.d du conteneur
COPY projet-web/init.sql /docker-entrypoint-initdb.d/init.sql

# Définissez les variables d'environnement pour la configuration de la base de données
ENV POSTGRES_DB='projet'
ENV POSTGRES_USER='useradmin'
ENV POSTGRES_PASSWORD='mypass'

# Attendre que le serveur PostgreSQL soit prêt avant de lancer la commande psql
CMD ["bash", "-c", "sleep 10s && psql -d projet -U useradmin -f /docker-entrypoint-initdb.d/init.sql"]
