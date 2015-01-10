all: clean build-deps standalone OSjs docs

clean:
	rm -rf ./js
	rm -rf ./Poe-OSjs
	rm -rf ./doc

build-deps:
	bower install jquery bootstrap

compileJS:
	coffee -cm --output js/ coffee/

dev-standalone:
	coffee -cwm --output js/ coffee/

dev-OSjs: OSjs

standalone: compileJS

docs:
	codo coffee/*

OSjs: clean
	mkdir Poe-OSjs
	coffee -c --output Poe-OSjs/js coffee/*
	coffee -c --output Poe-OSjs/js/FileFormat coffee/FileFormat
	coffee -c --output Poe-OSjs/ coffee/OSjs/
	mkdir ./Poe-OSjs/lib
	cp -r ./bower_components/jquery/dist/jquery.js ./Poe-OSjs/lib/jquery.js
	cp -r ./lib/* ./Poe-OSjs/lib
	
	cp -r css Poe-OSjs/css
	cp coffee/OSjs/package.json Poe-OSjs/package.json
	cp -r ./Poe-OSjs ~/OS.js/OS.js-v2/src/packages/default
