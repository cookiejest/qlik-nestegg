const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
//Public resource folder path

const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');


module.exports = {
    create: function () {
        return new Promise((resolve, reject) => {
            console.log('create main loader window');

            //Create a loader window.
            loaderWindow = new BrowserWindow({
                width: 400,
                height: 400,
                minWidth: 400,
                minHeight: 400,
                maxWidth: 400,
                maxHeight: 400,
                frame: false,
                backgroundColor: 'ffffff'
            });


            loaderWindow.loadURL(url.format({
                pathname: path.join(global['viewsPath'], 'loader.html'),
                protocol: 'file:',
                slashes: true
            }))

            console.log('show loader window');
            loaderWindow.show();

            //loaderWindow.webContents.openDevTools()

            return resolve(loaderWindow);


        })
    },
    establishDesktopConnection: function () {
        return new Promise((resolve, reject) => {
            var attemptcounter = 0;

            var testqlikconn = setInterval(function () {

                const ws = new WebSocket('ws://localhost:4848/app/engineData');


                ws.addEventListener('error', (err) => {

                    console.log('Connection attempt: ', attemptcounter);
                    attemptcounter += 1;

                    if (attemptcounter == 1) {

                        loaderWindow.loadURL(url.format({
                            pathname: path.join(global['viewsPath'], 'openqlikplease.html'),
                            protocol: 'file:',
                            slashes: true
                        }))


                    }
                    console.log(err.message)
                });

                ws.on('connection', function connection(ws) {

                    console.log('Connection done!');

                })

                ws.on('open', function open() {
                    console.log('open!');

                    clearInterval(testqlikconn);

                    return resolve('Connected')


                });


            }, 3000)




            console.log('Start load tasks');

        });
    },
    checkQlikLogin: function () {
        return new Promise((resolve, reject) => {
            var attemptcounter = 0;

            var testlogin = setInterval(function () {



                ws.addEventListener('error', (err) => {

                    console.log('Connection attempt: ', attemptcounter);
                    attemptcounter += 1;

                    if (attemptcounter == 1) {

                        loaderWindow.loadURL(url.format({
                            pathname: path.join(global['viewsPath'], 'openqlikplease.html'),
                            protocol: 'file:',
                            slashes: true
                        }))


                    }
                    console.log(err.message)
                });

                ws.on('connection', function connection(ws) {

                    console.log('Connection done!');

                })

                ws.on('open', function open() {
                    console.log('open!');

                    clearInterval(testqlikconn);

                    return resolve('Connected')


                });


            }, 3000)



        })

    },
    createTray: function () {

        tray = new Tray(path.join(global['publicPath'], '/app_logo1.png'))

        tray.setToolTip('w0w application');

        const trayMenu = Menu.buildFromTemplate([
            { label: 'test tray item' },
            { role: 'quit' },
            {
                label: 'Open',
                click: () => { createLoaderWindow() }
            }])

        tray.on('double-click', function () {

            if (mainWindow) {
                mainWindow.focus();

            } else {
                mainLoader.startUp()
            }


        })


        tray.setContextMenu(trayMenu)

    },

    startUp: function () {
        console.log('test');

        self.create()
        /*
            .then(mainLoader.establishDesktopConnection)
            .then(mainLoader.checkQlikLogin)
            .then(mainWindow.create)
            .then(values => {

                console.log('ALL SET UP');

            
               // mainLoader.createTray();

            }).catch(function (error) {
                console.log(error);
                return 'not connected';
            })
*/
    }

}