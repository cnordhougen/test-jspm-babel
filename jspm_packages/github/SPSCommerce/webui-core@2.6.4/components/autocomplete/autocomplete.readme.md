## spsui-autocomplete

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.4.0 	        | New           | [screenshot][autocomplete-ss]           | [components/autocomplete][autocomplete] 	|

*This is a new feature. You are encouraged to use it and [report any issues you may find][issues].*

This component provides autocomplete (typeahead) functionality on a text input.

#### How to Import

**JSPM + SystemJS**

Require the Autocomplete module into your app and list it as a dependency.

app.js

```javascript
require('webui-core');
require('webui-core/components/autocomplete');

module.exports = angular.module('myApp', ['webui-core', 'webui-autocomplete']);
```

**Bower**

index.html

```html
<head>
    <!-- Webui-core and module scripts -->
    <script src="/bower_components/webui-core/dist/webui-core.min.js"></script>
    <script src="/bower_components/webui-core/dist/webui-autocomplete.min.js"></script>
</head>
```

#### Examples

##### Example Static Usage

Array of strings with an onChange callback.  

your-view.html

```html
<spsui-autocomplete
    source="ctrl.source"
    ng-model="ctrl.selected"
    on-change="ctrl.onChange"
    placeholder="Enter a Month of the Year"></spsui-autocomplete>
```

your-view.ctrl.js

```javascript
function MyController() {

    this.source = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
  
    this.onChange = function(selection) {
      console.log('Selection', selection);
    };
      
}
```

##### Example Async Usage

Source is a function that fetches suggestions from an HTTP call.

your-view.html

```html
<spsui-autocomplete
    source="ctrl.source"
    ng-model="ctrl.selected"></spsui-autocomplete>
```

your-view.ctrl.js

```javascript
MyController.$inject = ['$http'];

function MyController($http) {

    this.source = function(query) {

        // Source functions are passed the query string so that they can
        // be passed to a service. This example returns the promise from
        // the $http GET request. 

        var config = {params: {search: query}};

        return $http.get('/your-api/items/', config).then(function(resp) {
            return resp.data.results || [];
        });
    };
}
```

##### Example API Usage

Get a handle on the API via the onReady callback, use it in the view or the controller.

your-view.html

```html
<spsui-autocomplete
    id-key="'id'"
    text-key="'name'"
    model-type="object"
    source="ctrl.source"
    ng-model="ctrl.selected"
    on-ready="ctrl.acReady"></spsui-autocomplete>

<p>
  Selected Item
  ID: {{ctrl.acAPI.selected.id}}
  Value: {{ctrl.acAPI.selected.value}}
</p>

<button ng-click="ctrl.acAPI.searchFor('ba')">Search "ba"</button>
<button ng-click="ctrl.acAPI.searchAndSelect('baz')">Select "baz"</button>
<button ng-click="ctrl.acAPI.clearSearch()">Clear Search</button>
```

your-view.ctrl.js

```javascript
function MyController() {
  
    var _this = this;
    
    this.source = [
        {id: 1, name: 'Foo'},
        {id: 2, name: 'Bar'},
        {id: 3, name: 'Baz'},      
    ];
  
    this.acReady = function(api) {
        _this.acAPI = api;
    };
}
```

#### Component Attributes

| Attribute   | Type     | Required | Description                              | Default |
| ----------- | -------- | -------- | ---------------------------------------- | ------- |
| ng-model    | object   | yes      | object that will be populated with selection |         |
| source      | mixed    | yes      | array or function, see below for more details |         |
| allow-custom-input | boolean | no | if true, ngModel is updated on text field input | false |
| debounce    | number   | no       | milliseconds to wait before lookup       | 300     |
| hint        | boolean  | no       | display hint inline as user types        | false   |
| id-key      | mixed    | no       | string or function, see below for more details | "id"        |
| limit       | number   | no       | max items to show in the suggestion menu | 10      |
| model-type  | string   | no       | what type to export to ngModel: "string" or  "object" | "string"         |
| minchars    | number   | no       | how many chars must be entered before lookup | 3       |
| on-change   | function | no       | callback fired when selection changes    |         |
| on-ready    | function | no       | callback fired when API is ready for use |         |
| placeholder | string   | no       | placeholder text to display in the empty input |         |
| select-on-enter | boolean | no    | should autocomplete selection be made on enter key press | false |
| text-key    | mixed    | no       | string or function, see below for more details | "value"        |


##### The Source Attribute

The source attribute can be one of three types of object.

1. An array of items (strings, numbers, objects, etc).
2. A function that returns an array of items.
3. A function that returns a promise that is resolved with an array of items.

In the end your source always needs to end up as an array, whether it's returned from a function,
or resolved in a promise.

##### The id-key and text-key Attributes

When your final source is an array of {Objects}, you need to determine which properties contain the id and text values you want to use when populating the autocomplete suggestions.

>   Note: the **text-key** attribute is required for proper rendering of suggestions in the dropdown.
>
>   The **id-key** attribute is only required when utilizing the api.selected.id shorthand.

The id-key and text-key attributes can be one of two types:

1. A string that represents the key to use.
2. A function that returns the formatted value.

##### Key as a String Example

Let's take this basic source for example:

```javascript
this.source = [
    {id: 1, name: 'John'},
    {id: 2, name: 'Paul'},
    {id: 3, name: 'George'},
    {id: 4, name: 'Ringo'},
];
```

Using the string ```'name'``` key to pull the names from the users. (notice the single quotes);

```html
<spsui-autocomplete
    id-key="'id'"
    text-key="'name'"
    model-type="object"
    source="ctrl.source"
    ng-model="ctrl.selected"></spsui-autocomplete>
```

##### Key as a Function Example

Let's take this more complex source for example, where the value we want to match is nested further inside the object and split between two different fields.

```javascript
this.source = [
    {id: 1, details: {username: 'jlennon', name: {first: 'John', last: 'Lennon'}}},
    {id: 2, details: {username: 'pmccartney', name: {first: 'Paul', last: 'McCartney'}}},
    {id: 3, details: {username: 'gharrison', name: {first: 'George', last: 'Harrison'}}},
    {id: 4, details: {username: 'rstarr', name: {first: 'Ringo', last: 'Starr'}}},
];

this.textKeyFn = function(user) {

    // The text-key functions are passed each object in the source
    // and you need to return it's view value. In this case, we want 
    // to concatenate the first and last names for a full name.

    return user.details.name.first + ' ' + user.details.name.last;
}
```

Use our display function to pull the names from a deeper part of the items.

```html
<spsui-autocomplete
    id-key="'id'"
    model-type="object"
    source="ctrl.source"
    text-key="ctrl.textKeyFn"
    ng-model="ctrl.selected"></spsui-autocomplete>
```

#### The Component API

Access the component API via the onReady callback.  See above example for usage.

| Method                            | Description                              |
| --------------------------------- | ---------------------------------------- |
| clearSearch()                     | Remove search value from the text input and clear any selected objects from the ng-model. |
| closeMenu()                       | Close the suggestion menu (if it is open). |
| focus()                           | Move user focus to the autocomplete input. |
| openMenu()                        | Open the suggestion menu (if it is closed). |
| searchAndSelect(string, [number]) | Enter a given search string into the field and automatically select a suggestion by index (starts with 0).  If no index value is supplied, the first suggestion is selected. |
| searchFor(string, [boolean])      | Enter a given search string into the field and open the suggestion menu. Optional boolean will silence the search (not display the menu) if true. |
| selectItem(object)                | Select an item in the autocomplete by passing in an object. |
| selectSuggestion([number])        | Select a suggested item in the menu by index (starts with 0). If no index value is supplied, the first suggestion is selected. |

| Property       | Type    | Description                              |
| -------------- | ------- | ---------------------------------------- |
| state.open     | Boolean | Whether the suggestion menu is currently open or not |
| selected.id    | String  | The id value of the selected item, as parsed by the id-key. |
| selected.value | String  | The text value of the selected item, as parsed by the text-key. |

---

[autocomplete]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/autocomplete
[autocomplete-ss]: https://cloud.githubusercontent.com/assets/44441/18771894/47c23946-8108-11e6-89ae-cc8361adbb12.png
