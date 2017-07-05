#!/bin/bash
npm install
jspm install
gulp build
gulp dist
git commit -m 'Dist'
git push -f origin master:test
