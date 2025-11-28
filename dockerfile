# Étape 1 : build Angular
FROM node:22-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code
COPY . .

# Build Angular en mode prod
RUN npm run build -- --configuration=production


# Étape 2 : image Nginx légère pour servir les fichiers
FROM nginx:1.27-alpine

# Supprime la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Ajoute notre config Nginx (on la crée juste après)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ Adapter ici le chemin du dossier dist
# Exemple si ton build crée dist/repart-phone
COPY --from=build /app/dist/repart-phone/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
