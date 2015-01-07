all: clean standalone docs OSjs

clean:
	rm -rf ./js
	rm -rf ./Poe-OSjs

build-deps:
	bower install jquery bootstrap

compileJS:
	coffee -cm --output js/ coffee/

standalone: compileJS

docs:
	codo coffee/*

OSjs: clean
	mkdir Poe-OSjs
	coffee -c --output Poe-OSjs/js coffee/*
	coffee -c --output Poe-OSjs/ coffee/OSjs/
	mkdir ./Poe-OSjs/lib
	cp -r css Poe-OSjs/css
	cp coffee/OSjs/package.json Poe-OSjs/package.json
	cp -r ./bower_components/jquery/dist/jquery.js ./Poe-OSjs/lib/jquery.js
	#cp -r ./Poe-OSjs ~/OS.js/OS.js-v2/src/packages/default
