#!/bin/bash

rm -rf project
git clone git@github.com:mattconsto/project.git
docker build -t educast .