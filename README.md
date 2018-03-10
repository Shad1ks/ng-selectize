# ng-selectize

### Description

AngularJS wrapper for Selectize.

### Demo

- [Plunker](http://plnkr.co/edit/oTOKIW?p=preview)

### Plans

- [ ] Simplify usage of optgroups functionality.

### Requirements

- [JQuery](http://jquery.com/)
- [AngularJS](http://angularjs.org/)
- [Selectize](http://selectize.github.io/selectize.js/)

### Setup

```html
<link rel="stylesheet" href=".../selectize.default.css">
<!--Need just for options auto width functionality.-->
<link rel="stylesheet" href="../src/css/ng-selectize.css">

<script type="text/javascript" src=".../jquery.js"></script>
<script type="text/javascript" src=".../standalone/selectize.js"></script>

<script type="text/javascript" src=".../angular.js"></script>
<script type="text/javascript" src=".../src/js/ng-selectize.js"></script>
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

### Additional

- **Default options**<br>In addition to pass options with options attribute you can set them in html.

```html
<ng-selectize ng-model="ctx.value">
    <option value="1">Option - 1</option>
</ng-selectize>
```

- **Disabled and Required**<br>Use to set dropdown as disabled or required.

```html
<ng-selectize ng-model="ctx.value" ng-disabled="{expression}" ng-required="{expression}"></ng-selectize>
```

- **On change**<br>Simplified method to detect changes.
  - Includes new and old value.

```html
<ng-selectize ng-model="ctx.value" on-change="ctx.onChange(val, oldVal)"></ng-selectize>
```

- **Multiple**<br>Use to set dropdown as multiple.
  - Includes *remove_button* plugin.

```html
<ng-selectize ng-model="ctx.value" is-multiple="true"></ng-selectize>
```

- **Tag**<br>Use to add tag functionality.
  - Includes special tag validation function. Accept tag value and return bool. *(Optional)*
  - Includes ability to change text *Add*. *(Optional)*
  - Includes option adding to options list if ng-model has a value but this value not exists in the options list.
  - Includes *restore_on_backspace* plugin.

```html
<ng-selectize ng-model="ctx.value" is-tag="true" is-tag-valid="ctx.isTagValid" tag-text="Push"></ng-selectize>
```

- **No default**<br>By default if no value in ng-model, the value will be set to first option if it exists. Use it to off this functionality.
  - Includes similiar check to off default tag option.

```html
<ng-selectize ng-model="ctx.value" is-no-default="true" is-tag-no-default="true"></ng-selectize>
```

- **Parse**<br>By default dropdown set a *string* typed value to ng-model. Use it to parse a value to int or bool before setting the value.

```html
<ng-selectize ng-model="ctx.value" is-int="true" is-bool="true"></ng-selectize>
```

- **Auto width**<br>Use to set auto width for the options block.
  - Need to include styles from css folder.

```html
<ng-selectize ng-model="ctx.value" use-auto-width="true"></ng-selectize>
```

### License

Copyright © 2018 Igor Karpov