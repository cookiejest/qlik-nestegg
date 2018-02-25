const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

const { ipcRenderer, remote } = require('electron')
global['rootPath'] = __dirname;

const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');


const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');


var Mocha = require('mocha');


let testController = require(global['rootPath'] + '/controllers/testController')


console.log('Test runner child process created for ' + process.argv[2])



//process.send('hello!');

//Get filename from parent process..



//Start mocha test in this child process
testController.startTest(process.argv[2]);


process.on('unhandledRejection', (reason) => {
    console.log('DUDDDEE!! reason:', reason);


    var data = {
        "type": "script error",
        "message": 'There is a script error',
        "error": JSON.parse(testController.stringifyError(reason, null, '\t'))
    }

    //Send message to main process
    
    process.send(data);



    process.exit();



    // application specific logging, throwing an error, or other logic here
});


/* Not supported on windows
process.on('SIGTERM', function handleSigterm() {
    console.log('Testrunner instance is closing nicely....')
    //more cleanup code
    //then truly exit.
    process.exit();
});
*/

process.on('message', (msg) => {
    console.log('Message from parent:', msg);

    if(msg.task=='kill') {

        console.log('Test process is killed.')
        process.exit();


    }

  });
