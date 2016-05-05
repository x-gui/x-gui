**cmp** is a minimalist set of web components for building consistent web app user interfaces.

Screenshot (demo app shows composition of components)
![](https://cloud.githubusercontent.com/assets/182479/15037378/60eec6a0-124f-11e6-8aaf-a44e6f5ba301.png)

## Install

```
bower install rchrd2/cmp
```

## Some guidelines
  - Avoid using a web component framework. Use only VanillaJS.  
  - Try to not create deep dependancies. Try to keep each component shallow.  
  - Consider only one of two of these components could be included without extra overhead.  
  - Do not use ShadowDOM, because the polyfill is expensive.  
  - Flexbox is used for layout and positioning.

## Structure

Each component is placed in it's own directory, eg `/x-component-name`. Within that directory there's `x-component-name.html` and an example html file showing usage named `x-component-name-example.html`.

By convention components are prefixed with `x-`. Custom elements are required to have a hyphen in the name. I consider `x` as a short way of flagging "custom".

If a component is intended as only a library import, prefix it with `lib-` instead of `x-`. For example, `lib-yaml`.

## Why?

These web components are basic building blocks for rapidly putting together web apps. The goal is to have a consistent user interface across different web apps. These were create for Sandstorm apps, but can be used for anything.

For more information see my slides from my talk at a Sandstorm Meet Up: http://www.slideshare.net/ohm-ad3HoH/texteditor-designing-open-source-apps.

The /demos shows examples of composing these web components into an app.

The name "cmp" was chosen as short hand for "component". Having a short name is useful, because other components can be created outside of this main project, but use the "cmp" namespace. For example a component that requires a third-party library could be called, "cmp-3rd-party".


## Warning

This is a work in progress. Some of the components may be incomplete. See comments in source code.


## Dependencies

At the moment, there are some some open source libraries included within components. However, components themselves are written using vanilla JavaScript without a library like Polymer or React.


## Author
  - Richard Caceres (@rchrd2)


## License

MIT
