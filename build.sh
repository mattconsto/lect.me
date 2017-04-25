#!/bin/bash

rm -rf project
rm -f project.tar.gz
git clone git@github.com:mattconsto/project.git
cd project
npm install --production
meteor.bat build .. --architecture os.linux.x86_64
cd ..
