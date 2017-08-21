# Charty
This is charty, a declarative, easy to use, zero-code chart library. That's right, you don't need to write any javascript whatsoever to use this library. Unfortunately it only really works on modern browsers right now.

## Usage
Right now Charty is still under development and is not supported for actual use cases at all. I first want to write some working code before I begin writing documentation. But fear not. I love writing documentation and once Charty is up and running the documentation will be priority #1. That being said, you might be able to figure out Charty on your own by looking at the `./samples/basic` directory, where I store my test environment for now.

## Build
To build Charty you need to first install it's dependencies by running `npm install`. Then you can run the build script `npm run build`. The output will be saved in the main directory in the file `charty.js`. To change the output, you can either just rename that file or modify the `./scripts/build.js` file, which uses browserify and tsify to turn the Typescript code into Javascript.

## Goals
The goal of Charty is to provide a simple, **declarative**, way to add charts to web pages. All chart libraries that I know of, take an imperative approach to this problem. I think that sucks. Really, a (static*) chart is very much like an image, so why treat it like code and not like an `<img>` tag? Wouldn't it be cool to declare some kind of `<chart>` tag with a `src="data.csv"` attribute as data source and have it 'just work'? I think it would be awesome to be able to add a chart as quickly to your website as you could add it to your excel table. Charty exists to make this dream a reality.

*Charty will eventually support interactive charts without requiring a single line of javascript code. This will work by leveraging child elements inside of a charty tag. I imagine this would work somehow like this:

- Add a &lt;charty-linechart&gt; tag to your page
- Add a &lt;div&gt; or other element as a child to this chart tag and give it a custom attribute (e.g. `x-charty-tooltip`) to mark it as the tooltip
- The tooltip element will automatically overlaid over the chart by Charty without requiring any more work on your end

Customization of legends, titles and descriptions would work similarly, by adding other child elements to your chart. For example one could imagine a `<charty-legend>` element that represents a chart's legend. Customization of colors etc would happen with the help of css, similar to how it works for all other html elements. Charty could interpret the css of the of the custom tags. There might even be custom css properties.

Charty will eventually even support streaming charts, that can dynamically update themselves without requiring *any* js code. This will work by adding a `streaming` or `autoupdate` attribute to the chart. The Charty backend will then automatically open a websocket or ajax requests for the chart so that it's alway kept up to date.

Of course even with all this functionality you might still want to modify a chart from js. That'll be possible too. Charty will behave just like any other html tag your used to. You'll be able to modify many Charty internals like a chart's title, data, legend, etc from your own js code. I think this will work similar to how a `<canvas>` tag and its context work right now.

## Dependencies
Charty will never have any runtime dependencies. Hooray!

To build it however, you will need some dev-dependencies:
- [Typescript Compiler](https://www.npmjs.com/package/typescript)
- [Browserify](https://www.npmjs.com/package/browserify)
- [Tsify (Browserify plugin)](https://www.npmjs.com/package/tsify)

And for testing:
- some webserver that can serve static http