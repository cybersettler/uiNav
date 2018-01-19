# uiNav

> websemble navigation list component

## Getting started

Include UI Nav in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiForm": "cybersettler/uiNav"
  }
}
```

## Supported style classes

* __navbar-left__: Defines navigation list alignment
inside a navigation bar.
* __navbar-right__: Defines navigation list alignment
inside a navigation bar.

## API

### data-model

Contains data to be displayed in the navigation elements.

### data-display

Configuration that determines how the navigation list
will be displayed. The following options are
supported:

* __styleClass__(string): The style class of the
list.
* __selectedIndex__(integer): Selected item index.
* __items__(array): The items of the navigation list
to be displayed.
    * __type__(enum: link | dropdown): Item type
    * __href__(string): link reference
    * __template__(string): Content template,
    will be passed a model.
    * __label__(string): Text to be displayed as
    the link label.
