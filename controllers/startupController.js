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
    startUp: function () {

        self.createLoaderWindow()
            .then(self.attemptConnect)
            .then(self.createMainWindow)
            .catch(function (error) {
                console.log(error);

            })

    },
    attemptConnect: function () {
        return new Promise((resolve, reject) => {
            var conncounter = 0;
            var currentissue;
            testqlikconn = setInterval(function () {

                conncounter += 1;

                //Set interval to recheck every 3 seconds.

                console.log('Attempt connection ', conncounter);
                //self.checkQlikConnection();
                var dotest = qlikCommands.checkQlikConnection(currentissue).then((testresult) => {

                    console.log(testresult);
                    clearInterval(testqlikconn);
                    return resolve('Connected');

                }).catch(function (error) {
                    currentissue = error;
                    console.log('Parent loop', error);
                })


            }, 3000)
        });
    },
    createLoaderWindow: function () {
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
            self.createTray();
            //loaderWindow.webContents.openDevTools()

            resolve('Done first part');


        })
    },
    createMainWindow: function () {

        console.log('Main window open fired')


        let winState = windowStateKeeper({
            defaultWidth: 1200,
            defaultHeight: 1200
        });

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: winState.Width,
            height: winState.Height,
            x: winState.x,
            y: winState.y,
            minHeight: 350, minWidth: 450,
            icon: path.join(__dirname, 'app_logo1.ico'),
            show: false,
            title: "Wow"
        })

        winState.manage(mainWindow);

        //load the index.html of the app.
        mainWindow.loadURL(url.format({
            pathname: path.join(global['viewsPath'], 'index.html'),
            protocol: 'file:',
            slashes: true
        }))

        //Set top navigation
        Menu.setApplicationMenu(mainMenu);

        //Open Dev tools
        mainWindow.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            console.log('main window closed');
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null
        })


        mainWindow.webContents.on('did-finish-load', () => {

            mainWindow.show();
            loaderWindow.hide();

            var alerttriggerdata = {
                "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
                "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300, "maxvalue": 300 }, 
                { "expressionvalue": "Sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 300, "maxvalue": 300 }]
            }


            qlikCommands.checkSessionObject(
                'C:\\Users\\adamc\\Documents\\Qlik\\Sense\\Apps\\Consumer Sales.qvf', alerttriggerdata).then((result) => {

                    console.log('FINAL OUTCOME', result);

                });



            qlikCommands.getDocList().then((docObjectArray) => {

                mainWindow.webContents.send('appDocListChannel', docObjectArray)

            });


        })

        return mainWindow;

    },

    createTray: function () {

        tray = new Tray(path.join(global['publicPath'], '/app_logo1.png'))

        tray.setToolTip('w0w application');

        const trayMenu = Menu.buildFromTemplate([
            { label: 'test tray item' },
            { role: 'quit' },
            {
                label: 'Open',
                click: () => {
                    if (mainWindow) {
                        mainWindow.focus();

                    } else {
                        //Start the whole app
                        self.createMainWindow();
                    }
                }
            }])

        tray.on('double-click', function () {

            if (mainWindow) {
                mainWindow.focus();

            } else {
                //Start the whole app
                self.createMainWindow();
            }


        })


        tray.setContextMenu(trayMenu)

    }
}