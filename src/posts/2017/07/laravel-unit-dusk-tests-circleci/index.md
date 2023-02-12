---
title: "Laravel Unit & Dusk Tests on CircleCI"
date: "2017-07-27"
excerpt: "Recently put together a config for running unit and dusk tests for Laravel on CircleCI 2.0. Checkout the gist for nvm and composer scripts https://gist.github.com/iWader/6e2f81e6147676c3a7fd36a1c1e7ea3e version: 2 jobs: build: working_directory: /var/www environment: BASH_ENV: ~/.bashrc docker: – image: php:7.1-cli environment: APP_ENV=testing – image: circleci/mysql:5.7 environment: MYSQL_ALLOW_EMPTY_PASSWORD=true MYSQL_ROOT_HOST=”%” MYSQL_USER=root steps: – run: name: Install System Dependencies command:"
---

Recently put together a config for running unit and dusk tests for Laravel on CircleCI 2.0.

Checkout the gist for nvm and composer scripts [https://gist.github.com/iWader/6e2f81e6147676c3a7fd36a1c1e7ea3e](https://gist.github.com/iWader/6e2f81e6147676c3a7fd36a1c1e7ea3e)

```yaml
version: 2

jobs:
  build:
    working_directory: /var/www

    environment:
      BASH_ENV: ~/.bashrc

    docker:
      - image: php:7.1-cli
        environment:
          APP_ENV=testing

      - image: circleci/mysql:5.7
        environment:
          MYSQL_ALLOW_EMPTY_PASSWORD=true
          MYSQL_ROOT_HOST="%"
          MYSQL_USER=root

    steps:

      - run:
          name: Install System Dependencies
          command: |
            apt-get update
            apt-get install -y libmcrypt-dev git unzip wget libpng-dev
            # These are required for e2e tests
            apt-get install -y libsqlite3-dev libnss3 libgconf-2-4 libfontconfig1 chromium xvfb

      - run:
          name: Install PHP Extensions
          command: docker-php-ext-install -j$(nproc) mcrypt pdo_mysql pdo_sqlite gd zip

      - checkout

      - run:
          name: Install NVM
          command: bash .circleci/nvm.sh

      - run:
          name: Install Composer
          command: bash .circleci/composer.sh

      - run:
          name: Install Composer Dependencies
          command: composer install --no-progress --no-suggest

      - run:
          name: PHPCS
          command: ./vendor/bin/phpcs --standard=PSR2 -p app config

      - run:
          name: Setup Environment
          command: |
            cp .env.dusk.testing .env
            php artisan key:generate
            php artisan passport:keys

      - run:
          name: Unit Tests
          command: APP_ENV=testing DB_DATABASE=circle_test ./vendor/bin/phpunit

      - run:
          name: Install Node Dependencies
          command: |
            node --version
            npm --version
            npm install

      - run:
          name: Webpack
          command: npm run prod

      - run:
          name: Start xvfb
          background: true
          command: /usr/bin/Xvfb :0 -screen 0 1280x720x24

      - run:
          name: Open Browsers
          background: true
          command: DISPLAY=:0 ./vendor/laravel/dusk/bin/chromedriver-linux

      - run:
          name: Serve Application
          background: true
          command: APP_ENV=testing DB_DATABASE=circle_test php artisan serve

      - run:
          name: e2e Tests
          command: php artisan dusk

      - store_artifacts:
          path: ./tests/Browser/console
          destination: console

      - store_artifacts:
          path: ./tests/Browser/screenshots
          destination: screenshots
```
