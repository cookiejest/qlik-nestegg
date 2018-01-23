const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');


const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');


let mainMenu = Menu.buildFromTemplate(require('./mainMenu.js'))
let startupController = require('./startupController')
let qlikCommands = require('./qlikCommands')


var self = module.exports = {
    create: function () {
        return new Promise((resolve, reject) => {

            

        })
    }
};