# Utiliser l'image officielle de nginx comme base
FROM nginx

# Copier le contenu du répertoire front-end dans le répertoire /usr/share/nginx/html du conteneur
COPY projet-web/public/* /usr/share/nginx/html

# Exposer le port 80 du conteneur
EXPOSE 80