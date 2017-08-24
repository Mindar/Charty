# Charty
This is charty, a declarative, easy to use, zero-code chart library. That's right, you don't need to write a single line of javascript to create a diagram or chart. For now only modern browsers are supported, older browsers might follow eventually.

## Usage
Right now Charty is still under development, so the documentation leaves much to desire. This will change once the API stablizies a little more. There has to be a working example before it makes sense to begin writing extensive documentation. But fear not. Once Charty is up and running, its documentation will become priority #1. That being said, you might be able to figure out how to use Charty on your own by looking at the `./samples/basic` directory. This directory contains a simple example that shows Charty's basic functionality.

## Build
To build Charty you first have to install it's dependencies by running `npm install` in Charty's root. Then you can run the build script `npm run build`. The build result will be saved in the root directory in the file `charty.js`. To change the output, you can either rename that file after it was generated or modify the `./scripts/build.js` file to suit your needs.

## Goals
The goal of Charty is to provide a simple, **declarative**, way to add charts to web pages. Many of the most used modern chart libraries take a somewhat imperative approach to this problem. I.e. they all require that you write at least some javascript. And that sucks! Why? Because a chart is really more like an image than code, so why treat it like code? Wouldn't it be cool to declare some kind of `<chart>` tag with a `src="data.csv"` attribute as data source and have it 'just work'? Charty's goal is to make adding a chart to your website as easy as adding a chart to an excel file.

Charty will eventually support interactive charts without requiring a single line of javascript code. This will work by adding child elements to a charty tag. It could work like this:

- Add a &lt;charty-linechart&gt; tag to your page
- Add a &lt;div&gt; or other element as a child to this chart tag and give it a custom attribute (e.g. `x-charty-tooltip`) to mark it as the tooltip
- The tooltip element will automatically overlaid over the chart by Charty without requiring any more work on your end

Customization of legends, titles and descriptions would work similarly, by adding other child elements to your chart. For example one could imagine a `<charty-legend>` element that represents a chart's legend or a `<charty-axis>` element representing a chart's axis. Customization of colors and the general visual appearance would be done by css, similar to how it works for literally every other html element. If required charty could even introduce some custom css properties.

Charty will eventually even support streaming data in charts. The charts would update themselves dynamically whenever new data arrives without requiring you to write *any* code at all. This will work by adding some kind of `streaming` or `autoupdate` attribute to the chart. The Charty backend will then automatically open a websocket or ajax requests for the chart so that it's alway kept up to date.

Of course even with all this functionality you might still want to modify a chart from js. That'll be possible too. Charty will behave just like any other html tag you're used to. You'll be able to modify many Charty internals like a chart's title, data, legend, etc from your own js code. Charty will provide an extensive API for plotting straight from js. Usage would be similar to how you use a `<canvas>` element.

## Dependencies
Charty will never have any runtime dependencies. Hooray!

To build it however, you will need some dev-dependencies:
- [Typescript Compiler](https://www.npmjs.com/package/typescript)
- [Browserify](https://www.npmjs.com/package/browserify)
- [Tsify (Browserify plugin)](https://www.npmjs.com/package/tsify)

And for testing:
- some webserver that can serve static http