## DateTime Module

| First Available 	| Last Updated  | Lifecycle     | Files |
|-----------------	|----------     |----------     |------ |
| v2.3.0 	        | v2.5.1        | Stable        | [modules/datetime][datetimeModule] 	|

The DateTime Module provides tools for formatting dates and times in a manner that is consistent
with the product design guidelines. The DateTime module uses MomentJS under the hood for powerful,
localized date formatting.

#### How To Import

This module is not imported automatically into your app with WebUI-Core.  If you choose to use it,
you need to set the DateTime Module as a dependency in your application.

**JSPM + SystemJS**

```javascript
require('webui-core');
require('webui-core/modules/datetime');

module.exports = angular.module('myApp', ['webui-core', 'webui-datetime']);
```

**Bower**

DateTime Module requires ```Moment v2.11.2``` and ```Moment-Timezone v0.5.0```.

You can install them with Bower into your project **OR** load them from CDN at runtime.

```bash
$> bower install moment#2.11.2 moment-timezone#0.5.0
```

index.html

```html
<head>
    <!-- Load Moment and Moment-Timzone from CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.0/moment-timezone.min.js"></script>

    <!-- webui-core and module scripts -->
    <script src="/bower_components/webui-core/dist/webui-core.min.js"></script>
    <script src="/bower_components/webui-core/dist/webui-datetime.min.js"></script>
</head>
```

app.js

```javascript
angular.module('myApp', ['webui-core', 'webui-datetime']);
```

#### Date Formatting

There are three methods for formatting dates + times using the DateTime module. 

* Directive ```<spsui-date>``` (preferred method)
* Filter in code ```var string = spsuiDateFilter(date, 'FORMAT');```
* Filter in view ```{{ctrl.date | spsuiDate : 'FORMAT'}}``` (not recommended)

Each method uses the current user's language, locale and timezone preferences to format 
the dates in a consistent and localized manner.  Refer to the Available Formats table below
for a complete list of formats.

* If the user has not set a locale preference, ```English (US)``` is used.
* If the user has not set a timezone preference, their local timezone is guessed.

#### Using the Directive

The ```<spsui-date>``` directive is the preferred method of rendering dates in a view.

```html
<!-- Formatted Date -->
<spsui-date value="ctrl.date" format="FORMAT_STRING"></spsui-date>

<!-- Relative Formatted Date -->
<spsui-date value="ctrl.date" format="FORMAT_STRING" relative="true"></spsui-date>
```

#### Using the Filter in a View

Using the spsuiDate filter in a view is not recommended, but it is available for instances 
where the directive cannot be used.

```html
<!-- Formatted Date -->
<p>{{ctrl.date | spsuiDate : 'FORMAT_STRING'}}</p>

<!-- Relative Formatted Date -->
<p>{{ctrl.date | spsuiDate : 'FORMAT_STRING' : 'RELATIVE'}}</p>
```

#### Using the Filter in a Controller

The spsuiDate filter can be used in a controller for additional control.

```javascript
MyController.$inject = ['spsuiDateFilter'];

function MyController(spsuiDateFilter) {

    var date = new Date();
    var formattedDate = spsuiDateFilter(date, 'FORMAT_STRING');
    var relativeDate = spsuiDateFilter(date, 'FORMAT_STRING', 'RELATIVE');
}
```

#### Supported Object Types

The date filter supports JS date objects, Moment objects, and date strings. If the date filter cannot
parse a date it will log a warning in the console and return the original input value.

```javascript
function MyController() {

    // Date filter supports the following date types:

    this.date = moment();
    this.date = new Date();
    this.date = '02/29/2016 3:03:50 PM CST';
}
```

#### Available Formats

Dates and times will be formatted according to the user's preferred locale and timezone settings.

```html
<spsui-date value="ctrl.date" format="SHORT_TIME_ZONE"></spsui-date> <!-- 3:03 PM CST -->
<spsui-date value="ctrl.date" format="LONG_DATE"></spsui-date> <!-- February 29, 2016 -->
```

Below is a list of the available formats with example localized outputs.

| Format String | English (US) Output | Ukrainian Output |
|-------------- |-------------------- |----------------- |
| SHORT_TIME | 3:03 PM | 15:03 |
| SHORT_TIME_ZONE | 3:03 PM CST | 15:03 CST |
| LONG_TIME | 3:03:50 PM | 15:03:50 |
| LONG_TIME_ZONE | 3:03:50 PM CST | 15:03:50 CST |
| NUM_DATE | 02/29/2016 | 29.02.2016 |
| SHORT_DATE | Feb 29, 2016 | 29 лют 2016 р. |
| LONG_DATE | February 29, 2016 | 29 лютого 2016 р. |
| SHORT_DATETIME | Feb 29, 2016 @ 3:03 PM | 29 лют 2016 р., 15:03 |
| SHORT_DATETIME_ZONE | Feb 29, 2016 @ 3:03 PM CST | 29 лют 2016 р., 15:03 CST |
| LONG_DATETIME | February 29, 2016 @ 3:03 PM | 29 лютого 2016 р., 15:03 |
| LONG_DATETIME_ZONE | February 29, 2016 @ 3:03 PM CST | 29 лютого 2016 р., 15:03 CST |
| SHORT_FULLDATETIME | Mon Feb 29, 2016 @ 3:03 PM | пн, 29 лют 2016 р., 15:03 |
| SHORT_FULLDATETIME_ZONE | Mon Feb 29, 2016 @ 3:03 PM CST | пн, 29 лют 2016 р., 15:03 CST |
| LONG_FULLDATETIME | Monday February 29, 2016 @ 3:03 PM | понеділок, 29 лютого 2016 р., 15:03 |
| LONG_FULLDATETIME_ZONE | Monday February 29, 2016 @ 3:03 PM CST | понеділок, 29 лютого 2016 р., 15:03 CST |

#### Relative Dates and Times

Occasionally a product design may indicate that the date will be displayed in a relative manner.
Design guidelines dictate that relative dates should not be used if the date is greater than 7 days.
The date filter takes care of this automatically and resorts to the specified format if the date is
too far away.

```javascript
ctrl.date1 = moment().subtract(3, 'days');
ctrl.date2 = moment().subtract(2, 'weeks');
```

```html
<!-- "3 days ago" -->
<spsui-date value="ctrl.date1" format="LONG_DATE" relative="true"></spsui-date>

<!-- "February 15, 2016" -->
<spsui-date value="ctrl.date2" format="LONG_DATE" relative="true"></spsui-date>
```

---

[datetimeModule]: https://github.com/SPSCommerce/webui-core/blob/master/core/modules/datetime
