#!/bin/bash

rm -rf lect.me
rm -f lect.me.tar.gz
git clone git@github.com:mattconsto/lect.me.git
cd lect.me
npm install --production
meteor.bat build .. --architecture os.linux.x86_64
cd ..
