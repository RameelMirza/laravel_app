# # Set the base image
# FROM php:8.2-fpm

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     libpng-dev \
#     libjpeg-dev \
#     libfreetype6-dev \
#     libzip-dev \
#     unzip \
#     git \
#     && docker-php-ext-configure gd --with-freetype --with-jpeg \
#     && docker-php-ext-install gd zip

# # Set working directory
# WORKDIR /var/www

# # Install Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # Copy application code
# COPY . .

# # Install PHP dependencies
# RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# # Install Node.js and npm
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
#     apt-get install -y nodejs

# # Install npm dependencies
# RUN npm install && npm run build

# # Expose port 9000
# EXPOSE 9000

# # Start PHP FPM server
# CMD ["php-fpm"]

# RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# RUN apt-get update && apt-get install -y sudo

# # Create user and group
# RUN groupadd -g 1000 www-data && useradd -u 1000 -g www-data -m www-data

# # Copy files and set ownership
# COPY . /var/www
# RUN chown -R www-data:www-data /var/www/database



# Set the base image
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip

# Set working directory
WORKDIR /var/www

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Install npm dependencies
RUN npm install && npm run build

# Set permissions for storage and cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Check if the group and user exist, if not, create them
RUN if ! getent group www-data; then \
        groupadd -g 1000 www-data; \
    fi && \
    if ! id -u www-data; then \
        useradd -u 1000 -g www-data -m www-data; \
    fi

# Change ownership for the entire application directory
RUN chown -R www-data:www-data /var/www

# Expose port 9000
EXPOSE 9000

# Start PHP FPM server
CMD ["php-fpm"]
