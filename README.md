# Charty
This is charty, a declarative, easy to use, zero-code chart library. That's right, you don't need to write a single line of javascript to create a diagram or chart. For now only modern browsers are supported, older browsers might follow eventually.

## Usage
Right now Charty is still under development, so the documentation is rather incomplete. This will change once the API stablizies a little more. There has to be a working example and a somewhat stable API before it makes sense to begin writing extensive documentation. But fear not. Once Charty is up and running, its documentation will become priority #1. In fact, missing or incomplete documentation will be considered a 'fatal bug'. That being said, you might be able to figure out how to use Charty on your own by looking at the `./samples/basic` directory. This directory contains a simple example that shows Charty's basic functionality.

## Build
To build Charty you first have to install it's dependencies by running `npm install` in Charty's root. Then you can run the build script `npm run build`. The build result will be saved in the root directory in the file `charty.js`. To change the output location, you can either rename that file after it was generated or modify the `./scripts/build.js` file to suit your needs.

## Goals
The goal of Charty is to provide a simple, **declarative**, way to add charts to web pages. Many of the most used modern chart libraries take a somewhat imperative approach to this problem. I.e. they all require that you write at least some javascript - even those who claim to be 'declarative'. That sucks! Why? Because a chart is more like an image than code, so why treat it like code? Wouldn't it be cool to declare some kind of `<chart>` tag with a `src="data.csv"` attribute as data source and have it 'just work'? Charty's goal is to make adding a chart to your website as easy as adding a chart to an excel file.

Charty will eventually support interactive charts without requiring a single line of javascript code. This will work by adding child elements to a charty tag. With all this "zero-code" stuff going on, one might think that javascript isn't supported very well in Charty. That's not true, in Charty JS is a first-class citizen. Charty will offer a full javascript API, so if you want to plot some data from js you can still do that easily. At some point Charty might even support streaming data in charts (without writing js). If a chart contains streaming data, charty's backend will automatically get the newest data for the chart and update the output accordingly. Customization of the way charts are rendered will be done through CSS. That way you can style your charts in the same way you style other html elements: By writing CSS. If necessary, Charty will introduce custom css properties for its charts.

## Dependencies
Charty will never have any runtime dependencies. Hooray!

To build it however, you will need some dev-dependencies:
- [Typescript Compiler](https://www.npmjs.com/package/typescript)
- [Browserify](https://www.npmjs.com/package/browserify)
- [Tsify (Browserify plugin)](https://www.npmjs.com/package/tsify)

And for testing:
- some webserver that can serve static http