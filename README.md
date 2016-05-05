# Custom Web Components

## Some guidelines:
  - Try to avoid using a web component framework. Use only VanillaJS.  
  - Try to not create deep dependancies. Try to keep each component shallow.  
  - Do not use ShadowDOM, because the polyfill is expensive.  


## Structure

Each component is placed in `/components/component-name`. Within that directory there's `component-name.html` and an example html file showing usage named `component-name-example.html`.


## Why?

These web components are basic building blocks for rapidly putting together web apps. The goal is to have a consistent user interface across different web apps. These were create for Sandstorm apps, but can be used for anything.

For more information see my slides from my talk at a Sandstorm Meet Up: http://www.slideshare.net/ohm-ad3HoH/texteditor-designing-open-source-apps.

The /demos shows examples of composing these web components into an app.


## Warning

This is a work in progress. Still figuring out how to distribute these web components. Some of the components are incomplete. See comments.


## Dependencies

At the moment, there are some some open source libraries included within components. However, components themselves are written using vanilla JavaScript without a library like Polymer or React.


## Author
  - Richard Caceres (@rchrd2)


## License

MIT
