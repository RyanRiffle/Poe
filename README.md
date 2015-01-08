Poe
======

A word processor built with HTML, CSS, and CoffeeScript. The current goal of Poe is to have a working word processor base. Then loading and saving will be implemented. This application is following [Writer Concept](http://bassultra.deviantart.com/art/Writer-Concept-351501580) by spiceofdesign on DeviantArt.

The application is under heavy development. However it is hosted for a demo on [Github Pages](http://www.ryanriffle.github.io/Poe/demo/app.html).

### Requirements
Coffeescript
```
npm install -g coffee-script
```

Bower
```
npm install -g bower
```


### Building
To begin run `make build-deps`. This will use bower to download jQuery and Twitter Bootstrap.

Then compile for the platform you would like.
```
//Compile for use on web server
make standalone

//Compile for OS.js
make OSjs
```

##### Standalone
In order for the application to work you will need a http server or allow your browser to make cross-origin requests. I use python for a simple http server to develop the application
```
python -m SimpleHTTPServer
```
Open the browser and navigate to the server or index.html page if you enabled cross-origin.

##### OS.js
The package will be located in `Poe/Poe-OSjs`

In order to then use it copy the package folder into your local copy of OS.js to `OS.js-v2/src/packages/default/` then run the server from inside OS.js-v2 folder
```
~/OS.js-v2$ node src/server-node/server.js dist-dev
```

### Documentation
The documentation can be generated using codo.
```
//Install codo
npm install -g codo

//Generate docs
make docs
```
The documentation is stored in `doc`

#### Note
Poe has only been tested in Google Chrome at this time since it is being used in the development process.
