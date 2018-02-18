# ng-selectize

### Description

AngularJS wrapper for Selectize.

### Requirements

- [JQuery](http://jquery.com/)
- [AngularJS](http://angularjs.org/)
- [Selectize](http://selectize.github.io/selectize.js/)

### Setup

```html
<link rel="stylesheet" href=".../selectize.default.css">

<script type="text/javascript" src=".../jquery.js"></script>
<script type="text/javascript" src=".../standalone/selectize.js"></script>

<script type="text/javascript" src=".../angular.js"></script>
<script type="text/javascript" src=".../src/ng-selectize.js"></script>
```

```javascript
angular.module("App", ["ngSelectize"]);
```

### Usage

```javascript
var ctx = this;

ctx.config = {
  valueField: "id",
  labelField: "text"
}

ctx.options = [
  { id: "1", text: "Option - 1" },
  { id: "2", text: "Option - 2" },
  { id: "3", text: "Option - 3" },
  { id: "4", text: "Option - 4" },
  { id: "5", text: "Option - 5" }
]

ctx.value = null;
```


```html
<ng-selectize config="ctx.config" options="ctx.options" ng-model="ctx.value"></ng-selectize>
```

### Options

To be continued...