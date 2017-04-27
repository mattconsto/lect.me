#!/bin/bash

# Configure timezone and locale
# http://serverfault.com/a/689947
echo "Europe/London" > /etc/timezone && \
  dpkg-reconfigure -f noninteractive tzdata && \
  sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
  sed -i -e 's/# en_GB.UTF-8 UTF-8/en_GB.UTF-8 UTF-8/' /etc/locale.gen && \
  echo 'LANG="en_GB.UTF-8"'> /etc/default/locale && \
  dpkg-reconfigure --frontend=noninteractive locales && \
  update-locale LANG=en_GB.UTF-8

# Start Nginx proxy
nginx

# Start MongoDB
mongod --fork --logpath /project/mongo.log

# Start our app
cd /project/bundle
(cd programs/server && npm install)
MONGO_URL=mongodb://localhost:27017/lectme ROOT_URL=http://lect.me PORT=3000 node main.js

# Wait for ever, so docker doesn't kill this VM
bash