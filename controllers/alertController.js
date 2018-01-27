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
    create: function (Data) {
        return new Promise((resolve, reject) => {

            //Dimension Alerts

            //
            

        })
    },
    triggerCheck: function () {
        return new Promise((resolve, reject) => {

        //Create session object using specified dimension and measure/variable values


        //Check value against specific Information

        //Check measure
            
        //Destroy and close session

        })
    },
    getContentItem: function (Data) {
        return new Promise((resolve, reject) => {

        //Create session object using specified dimension and measure/variable values


        //Check value against specific Information

        //Check measure
            

        })
    },
    createMessage: function (Data) {
        return new Promise((resolve, reject) => {


            

        })
    }
};