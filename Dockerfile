# Tic-Tac-Toe static site served via Nginx
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy game files into nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Nginx listens on port 80 by default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
