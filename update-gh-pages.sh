#!/bin/bash
# set -x
set -o errexit

cp -r ./docs/* ./gh-pages
rm -rf ./gh-pages/typedoc
cd ./ts
npm run docs:build
