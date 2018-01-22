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

var self = module.exports = {
    printObject: function (ObjectId, Format) {


        app.disableHardwareAcceleration();

        let bgWin

        bgWin = new BrowserWindow({
            show: false,
            height: 700,
            width: 700,
            webPreferences: {
                offscreen: true
            }
        })

        //bgWin.webContents.openDevTools()


        bgWin.loadURL(url.format({
            pathname: path.join(publicPath, 'print-container.html'),
            protocol: 'file:',
            slashes: true
        }))


        bgWin.webContents.on('did-finish-load', () => {



            console.log('loading is done')

            console.log('contents finished loading');

            setTimeout(function () {
                bgWin.webContents.capturePage(image => {
                    //console.log(bgWin.getTitle())

                    console.log('take a picture');
                    var img = image.toPNG()



                    fs.writeFile('test.png', img, (err) => {
                        if (err) { console.log(err) } else {
                            console.log('It\'s saved!');
                            bgWin.close();
                        }
                    })


                });
            }, 5000);


        })

    },
    checkQlikConnection: function (currentissue) {
        return new Promise((resolve, reject) => {



            const qix = enigma.create({
                schema,
                url: 'ws://localhost:4848/app/engineData',
                createSocket: url => new WebSocket(url)
            });


            qix.open()
                .then(function (global) {

                    return global.getAuthenticatedUser();
                }).then(() => {
                    //Check if testqlik conn exists, if so clear interval
                    return resolve(true);
                })
                .catch(err => {

                    if (err.parameter == 'User authentication failure') {
                        reject('User needs to login!');
                        //console.log('User needs to login!')
                        if (currentissue != 'User needs to login!') {
                            loaderWindow.loadURL(url.format({
                                pathname: path.join(global['viewsPath'], 'logintoqlikplease.html'),
                                protocol: 'file:',
                                slashes: true
                            }))

                            currentissue = 'User needs to login!';


                            loaderWindow.show();
                        }
                    } else if (err.error.code == 'ECONNREFUSED') {
                        //console.log(err.error.code)
                        // console.log('Qlik Sense Desktop not open!')
                        reject('Qlik Sense Desktop not open!');

                        if (currentissue != 'Qlik Sense Desktop not open!') {
                            loaderWindow.loadURL(url.format({
                                pathname: path.join(global['viewsPath'], 'openqlikplease.html'),
                                protocol: 'file:',
                                slashes: true
                            }))

                            currentissue = 'Qlik Sense Desktop not open!';

                            loaderWindow.show();
                        }
                    }

                    // console.log(err);
                });

        })
    },

    getDocObjects: function (docId) {
        return new Promise((resolve, reject) => {
            const qix = enigma.create({
                schema,
                url: 'ws://localhost:4848/app/' + docId + '/engineData',
                createSocket: url => new WebSocket(url)
            });


            qix.open()
                .then(function (global) {

                    return global.openDoc(docId, '', '', '', false)
                })
                .then((app) => {
                    return app.getAllInfos()
                })
                .then((genericobjects) => {
                    //mainWindow.webContents.send('appobjectlist', genericobjects)
                    var genericobjects = genericobjects
                })
                .then(() => qix.close())
                .then(() => {
                    return (genericobjects)
                    console.log(' Qix Session closed')
                })
                .catch(err => {
                    console.log('Something went wrong :(', err)

                });

        });
    },

    getDocList: function () {
        return new Promise((resolve, reject) => {

            console.log('getDocList Fired');

            const qix = enigma.create({
                schema,
                url: 'ws://localhost:4848/app/engineData',
                createSocket: url => new WebSocket(url)
            });

            qix.open()
                .then((global) => {

                    return global.getDocList()
                })
                .then((docList) => {
                    /*console.log(docList);*/
                    mainWindow.webContents.send('applistchannel', docList)

                })
                .then(() => qix.close())
                .then(() => console.log(' Qix Session closed'))
                .catch(err => console.log('Something went wrong :(', err));

        });
    }
}