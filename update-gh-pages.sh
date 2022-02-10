#!/bin/bash
# set -x
set -o errexit

cp -r ./docs/* ./gh-pages
cd ./ts
npm run docs:build
