## Localization Module

| First Available 	| Last Updated  | Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |----------     |-----------    |------ |
| v2.5.0 	        | v2.6.1        | New           | n/a           | [modules/localization][localizationModule] 	|

The Localization Module is used for localizing applications and components.

#### Configuration

```javascript
angular.module('myApp')
    .config(['localizationServiceProvider'], function(localizationServiceProvider) {
        
        // This will automatically cloak (hide) your translated content until 
        // the translations are loaded. Prevents "Flash of Untranslated Content".
        
        localizationServiceProvider.setCloaking(true);
    });
```

#### Module Usage
 
> Note: The values used should match the folder name in which you upload your translations.

```javascript
angular.module('myApp')
    .run(function (localizationService) {

        localizationService.localize({
            app: 'your-app-name'  // setup localization for an app
        });
                
        localizationService.localize({
            component: 'your-component-name' // or for a component
        });
    });
```

#### Supported Languages

Commerce Platform currently supports the following languages:

* English (en-US.json)
* Spanish (es-ES.json)
* French (fr-FR.json)
* French Canadian (fr-CA.json)
* Chinese Simplified (zh-CN.json)
* Chinese Traditional (zh-TW.json)

#### How to Translate Content

> Note: The localization module configures Angular Translate behind the scenes. You can use any method 
> for translating your app as supported by Angular Translate.  [See here for Angular Translate docs](https://angular-translate.github.io/docs/#/guide/05_using-translate-directive).

You will need to replace all text in your application with translation keys.

Before:
```html
<h1>Welcome to Your App</h1>
<p>This application will help you do things.</p>
```

After: 
```html
<h1 translate="yourapp.welcome.heading"></h1>
<p translate="yourapp.welcome.body"></p>
```

#### Setting up Translation Files

Translation files are flat JSON files.  You need one for each supported language.

en-US.json
```json
{
    "yourapp.welcome.heading": "Welcome to Your App",
    "yourapp.welcome.body": "This application will help you do things."
}
```

es-ES.json
```json
{
    "yourapp.welcome.heading": "Bienvenido a su Aplicación",
    "yourapp.welcome.body": "Esta aplicación le ayudará a hacer las cosas."
}
```

#### Naming your Translation Keys
 
Depending upon the size of your application, you may have dozens of translation keys. For this
reason it is important to follow some guidelines when naming your translation keys.

[Please refer to this Confluence page on Naming your Translation Keys](https://spscommerce.atlassian.net/wiki/display/FUL/Namespacing+the+keys+you+use+for+translation)


#### Location of your Translation Files

During local development you will want to reference your translation files locally. To do so, 
specify a path to your translations during configuration.

```javascript
angular.module('myApp')
    .run(function (localizationService) {
               
        localizationService.localize({
            app: 'your-app-name',
            path: './lang/' // <- local path to translations
        });
    });
```

While in production, you may want to load your translation files from CDN. To do so, you will
need to upload your files to the following locations:

For Apps:
```
static-assets.spscommerce.com/framework/i18n/apps/{your-app-name}/{translation-version}/
```

For Components:
```
static-assets.spscommerce.com/framework/i18n/components/{your-component-name}/{translation-version}/
```

#### Translation Versioning

The Localization Module enforces translation versioning. This means that translations can be 
updated without redeploying. Versions are maintained using folders. The version naming convention 
does not matter. We use a simple incrementing integer for our applications and components, 
eg: 1, 2, 3, ... 500, etc.

#### Version JSON files

Every localized app and component needs a set of version JSON files. These version files
are responsible for reporting which translation version to use in a given environment. 

> Note: The environment will be auto-detected while your app is running in Commerce Platform. 

Set of version JSON files:

* dev.json
* test.json
* stage.json
* prod.json

Each version file looks like:

```json
{
  "version": "2"
}
```

This allows you to stage language changes between environments.

#### Translation Files

Your final translation folder structure will look similar to this:

```
├── apps
│   │
│   └── your-app
│       │
│       ├── 1
│       │   ├── en-US.json
│       │   ├── es-ES.json
│       │   ├── fr-CA.json
│       │   ├── fr-FR.json
│       │   ├── zh-CN.json
│       │   └── zh-TW.json
│       │
│       ├── 2
│       │   ├── en-US.json
│       │   ├── es-ES.json
│       │   ├── fr-CA.json
│       │   ├── fr-FR.json
│       │   ├── zh-CN.json
│       │   └── zh-TW.json
│       │
│       ├── dev.json
│       ├── prod.json
│       ├── stage.json
│       └── test.json
│       
└── components
    │
    └── your-component
        │
        ├── 1
        │   ├── en-US.json
        │   ├── es-ES.json
        │   ├── fr-CA.json
        │   ├── fr-FR.json
        │   ├── zh-CN.json
        │   └── zh-TW.json
        │
        ├── 2
        │   ├── en-US.json
        │   ├── es-ES.json
        │   ├── fr-CA.json
        │   ├── fr-FR.json
        │   ├── zh-CN.json
        │   └── zh-TW.json
        │
        ├── dev.json
        ├── prod.json
        ├── stage.json
        └── test.json
```

---

[localizationModule]: https://github.com/SPSCommerce/webui-core/blob/master/core/modules/localization
