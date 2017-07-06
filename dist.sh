#!/bin/bash
npm install
jspm install
gulp build
gulp dist
mv .gitignore.dist .gitignore
rm dist.sh
git add .
git commit -m 'Dist'
git push -f origin HEAD:test
