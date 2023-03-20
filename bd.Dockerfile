# Utilisez une image de base PostgreSQL
FROM postgres:13

# Copiez le fichier init.sql dans le répertoire /docker-entrypoint-initdb.d du conteneur
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Définissez les variables d'environnement pour la configuration de la base de données
ENV POSTGRES_DB='projet2'
ENV POSTGRES_USER='useradmin'
ENV POSTGRES_PASSWORD='mypass'