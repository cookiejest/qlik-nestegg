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
const fork = require('child_process').fork;
var exec = require('child_process').exec;

let mainMenu = Menu.buildFromTemplate(require(global['rootPath'] + '/controllers/mainMenu.js'))
let startupController = require(global['rootPath'] + '/controllers/startupController')
let qlikCommands = require(global['rootPath'] + '/controllers/qlikCommands')
let logger = require('electron-log');


var self = module.exports = {
    startUp: function () {

        self.createLoaderWindow()
            .then(self.createAuthWindow)
            .then(self.attemptConnect)
            //.then(self.createMainWindow)
            .then(self.createTestWindow)
            .catch(function (error) {

                logger.error(error);
            })


        self.startWebServer()

    },
    attemptConnect: function () {
        return new Promise((resolve, reject) => {
            var conncounter = 0;
            var currentissue;
            testqlikconn = setInterval(function () {

                conncounter += 1;

                //Set interval to recheck every 3 seconds.

                logger.verbose('Attempt connection ', conncounter);

                //self.checkQlikConnection();
                var dotest = qlikCommands.checkQlikConnection(currentissue).then((testresult) => {

                    logger.verbose('Check Qlik Connection result: ' + testresult);

                    clearInterval(testqlikconn);

                    return resolve('Connected');

                }).catch(function (error) {
                    currentissue = error;

                    logger.error('Parent loop' + error);
                })


            }, 3000)
        });
    },
    createAuthWindow: function () {
        return new Promise((resolve, reject) => {

            logger.verbose('Create auth window')

            //Create a loader window.
            authWindow = new BrowserWindow({
                width: 500,
                height: 600,
                minWidth: 500,
                minHeight: 600,
                maxWidth: 500,
                maxHeight: 600,
                frame: false,
                backgroundColor: 'ffffff'
            });


            authWindow.loadURL(url.format({
                pathname: path.join(global['viewsPath'], 'register.html'),
                protocol: 'file:',
                slashes: true
            }))


            logger.verbose('Show auth window')

            authWindow.show();
            loaderWindow.hide();

            authWindow.webContents.openDevTools()

            //resolve('Showing Auth Window');


        })
    },
    createLoaderWindow: function () {
        return new Promise((resolve, reject) => {

            logger.verbose('Create loader window')

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

            logger.verbose('Show loader window')

            loaderWindow.show();
            self.createTray();
            //loaderWindow.webContents.openDevTools()

            setInterval(function () {

                resolve('Done first part');
            }, 2000);

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
        //mainWindow.webContents.openDevTools()

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



            qlikCommands.getDocList().then((docObjectArray) => {

                mainWindow.webContents.send('appDocListChannel', docObjectArray)

            });


        })

        return mainWindow;

    },
    startWebServer: function () {
        return new Promise((resolve, reject) => {

            //Create session object using specified dimension and measure/variable values


            logger.verbose('Start Web Server')



            // open source file for reading
            //var r = fs.createReadStream('./test/templates/header.txt');

            //var r2 = fs.createReadStream('./test/scripts/' + fileName + '.w0w');






            const parameters = [];

            const options = {
                stdio: ['pipe', 'pipe', 'pipe', 'ipc']
            };


            //Start child process
            var webserverinstance = fork('controllers\\webServerController.js', parameters, options, function (err, stdout, stderr) {
                // Node.js will invoke this callback when the 
                console.log(stdout);
            });

            webserverinstance.stdout.on('data', function (data) {
                console.log(data.toString());
            });

            /*

            exec('tasklist', function(err, stdout, stderr) {
              // stdout is a string containing the output of the command.
              // parse it and look for the apache and mysql processes.
              console.log('TASK LIST OUTPUT', stdout)
            });
*/

        })
    },
    createTestWindow: function () {

        console.log('Main window open fired')


        let winState = windowStateKeeper({
        });

        // Create the browser window.
        mainWindow = new BrowserWindow({
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
            pathname: path.join(global['viewsPath'], 'editor.html'),
            protocol: 'file:',
            slashes: true
        }))

        //Set top navigation
        Menu.setApplicationMenu(mainMenu);

        //Open Dev tools
        //mainWindow.webContents.openDevTools()

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



            qlikCommands.getDocList().then((docObjectArray) => {

                mainWindow.webContents.send('appDocListChannel', docObjectArray)

            });


        })

        return mainWindow;

    },


    createTray: function () {

        tray = new Tray(path.join(global['publicPath'], '/nestegg_48x48.png'))

        tray.setToolTip('w0w application');

        const trayMenu = Menu.buildFromTemplate([
            { role: 'quit' },
            {
                label: 'Open',
                click: () => {
                    if (mainWindow) {
                        mainWindow.focus();

                    } else {
                        //Start the whole app
                        self.createTestWindow();
                    }
                }
            }])

        tray.on('double-click', function () {

            if (mainWindow) {
                mainWindow.focus();

            } else {
                //Start the whole app
                self.createTestWindow();
            }


        })


        tray.setContextMenu(trayMenu)

    }
}