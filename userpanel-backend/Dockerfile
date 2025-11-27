FROM php:8.2-apache

# Install required extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends zip unzip git libzip-dev \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory to the backend app folder
WORKDIR /var/www/html

# Copy the current build context (the backend folder) into the container
# Use `COPY . /var/www/html/` because Render builds this Dockerfile with
# the service `root` set to the `userpanel-backend` directory.
COPY . /var/www/html/

# Fix permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
