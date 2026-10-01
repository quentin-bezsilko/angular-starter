# ==============================
# Stage 1 - Build Angular
# ==============================

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production


# ==============================
# Stage 2 - Runtime Nginx
# ==============================

FROM nginx:alpine

# Suppression du contenu web Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Suppression de la configuration par défaut
RUN rm -f /etc/nginx/conf.d/default.conf

# Configuration Nginx Angular
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copie du build Angular
COPY --from=build /app/dist/angular-starter/browser /usr/share/nginx/html

# Angular génère index.csr.html pour le client-side rendering.
# On l'utilise comme point d'entrée de la SPA.
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]