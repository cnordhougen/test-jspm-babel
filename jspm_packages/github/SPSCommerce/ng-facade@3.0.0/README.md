# ng-facade
Angular 2 facade over Angular 1.

# Installation
```
jspm install ng-facade=github:cnordhougen/ng-facade
jspm install text=github:systemjs/plugin-text
```
SystemJS's text plugin is a peer dependency, but JSPM does not support peer dependencies yet. You will also need to have [Babel](https://babeljs.io) set up with the ES2015 and stage-1 presets (stage-1 being for class properties support). Right now you will also need the transform-decorators-legacy plugin until the revised decorators proposal settles down and it returns to the stage-1 or higher preset.

# Usage
ng-facade provides a set of [JS decorators](https://tc39.github.io/proposal-decorators/) and other classes and utilities that allow you to write an Angular 1 application using syntax that is closer to the Angular 2 TypeScript syntax. It also uses a set of template transformations that allow you to use some Angular 2 template syntax in your templates (although you don't have to).

It works as simply as possible, just using the information it has from these decorators to register modules, directives, and services with Angular 1 behind the scenes rather than attempt to emulate Angular 2 behavior. It aims to simply be a way to write an Angular 1 app in a way that's much nicer and more like what you'll be doing post-transition.

You can find documentation in the [wiki](https://github.com/SPSCommerce/ng-facade/wiki).
