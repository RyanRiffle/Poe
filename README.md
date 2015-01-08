# Note
I am looking for someone to continue development on this application. Starting mid January I will not be able to access a computer for a minimum of two months. If you would be interested in taking over for that time you can email me at ryanriffle@icloud.com or on [Google+](https://plus.google.com/115441007574184937069).

Poe
======

A word processor built with HTML, CSS, and CoffeeScript. The current goal of Poe is to have a working word processor base. Then loading and saving will be implemented. This application is following [Writer Concept](http://bassultra.deviantart.com/art/Writer-Concept-351501580) by spiceofdesign on DeviantArt.

The application is under heavy development. However it is up on [Heroku](https://poejs.herokuapp.com/) for a preview and the heroku page will always be the same as the stable master branch.

### Building
To build Poe you will need coffeescript installed.
```
	npm install -g coffee-script
```
In order for the application to work you will need a http server or allow your browser to make cross-origin requests. I use python for a simple http server to develop the application
```
	python -m SimpleHTTPServer
```
In the root directory of the project compile all of the coffeescript files
```
	coffee -cm --output js/ coffee/*
```
Open the browser and navigate to the server or app.html page if you enabled cross-origin.

### Documentation
The documentation can be generated using codo.
```
    npm install -g codo
```
then while in the root directory of the project
```
    codo coffee/*
```
The documentation is stored in `doc`

#### Note
Poe has only been tested in Google Chrome at this time since it is being used in the development process.
