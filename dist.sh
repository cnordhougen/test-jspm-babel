#!/bin/bash
npm install
jspm install
gulp build
gulp dist
git commit -am 'Dist'
git push -f origin master:test
