#!/bin/bash

locale-gen en_US en_US.UTF-8
nginx
cd /project/meteor
meteor npm update
meteor --allow-superuser
bash