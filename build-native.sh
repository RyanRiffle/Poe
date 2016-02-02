#!/bin/sh
if [ $1 = "osx" ]; then
	electron-packager ./build Poe --platform=darwin --arch=x64 --version=0.36.2 --overwrite
	mkdir build-native
	mv Poe-darwin-x64 build-native/Poe-darwin-x64
fi

if [ $1 = "win32" ]; then
	electron-packager ./build Poe --platform=win32 --arch=ia32 --version=0.36.2 --overwrite
	mkdir build-native
	mv Poe-win32-ia32 build-native/Poe-win32-ia32
fi

if [ $1 = "win64" ]; then
	electron-packager ./build Poe --platform=win32 --arch=x64 --version=0.36.2 --overwrite
	mkdir build-native
	mv Poe-win32-x64 build-native/Poe-win32-x64
fi
