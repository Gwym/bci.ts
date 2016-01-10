# bci.ts
Brain computer interface in Typescript

Note : a compiled version (javascript targeting ES6 and source map) is supplied, installing Typescript and compiling is optional,
only required if you want to modifiy sources, target another ES version or remove source mapping.

Usage
=====


Server :
-------

Install dependencies and launch server :

```
npm --prefix ./build/ install
node ./build/server/app.js
```


Client :
-------

Point your browser to server address set in configuration (default : http://127.0.0.1:8080/ ).


(Tested with NodeJs v5.0.0 and Chromium Version 47.0.2526.73 on Ubuntu 15.10 (64-bit))



Prerequisite for building
=========================

Install typescript (see http://www.typescriptlang.org/)
Install DefinitelyTyped for node, serialport and ws in ./server/typings (see http://definitelytyped.org/tsd/) 
Optional : install Visual Studio Code EDI (https://code.visualstudio.com/docs/languages/typescript)

Download or fetch project form Github, install dependencies for server side :
```
cd ./build
npm install
```

Server building :
==========================

With Visual Studio Code
-----------------------

Open the root folder (containing the server side tsconfig.json), hit Ctrl-Maj-B to compile. 
Click on the debug button then on the run button.

With command line
-----------------

Go to the root folder (containing the server side tsconfig.json) and compile

```
tsc -p
```

Generate client-server mapping (file commons.ts)

```
node ./build/server/common_tr.js
```


Client Webapp building :
=================

With Visual Studio Code
-----------------------

Open the /webapp folder (containing the client side tsconfig.json), hit Ctrl-Maj-B to compile. 

With command line
-----------------

Go to the /webapp folder (containing the client side tsconfig.json) and type

```
tsc -p
```
