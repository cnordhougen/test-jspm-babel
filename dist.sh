#!/bin/bash
npm install
jspm install
gulp build
gulp dist
if [ -f "index.js" ];
then
    git add .
    git commit -m 'Dist'
    git push -f origin HEAD:test
else
    exit 1
fi
