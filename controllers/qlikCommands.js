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

    getAllDocObjects: function (docId) {
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




                    return resolve(genericobjects)
                })
                .then(() => qix.close())
                .then(() => {
                    console.log(' Qix Session closed')
                })
                .catch(err => {
                    console.log('Something went wrong :(', err)
                    return reject(err)
                });

        });
    },
    getDocObjects: function (docId, objectTypesArray) {
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
                    return app.getObjects({
                        "qTypes": objectTypesArray, "qIncludeSessionObjects": false, "qData": {
                            "title": "/title",
                            "tags": "/tags"
                        }
                    })
                })
                .then((qlikobjects) => {
                    //mainWindow.webContents.send('appobjectlist', genericobjects)


                    return resolve(qlikobjects)
                })
                .then(() => qix.close())
                .then(() => {
                    console.log(' Qix Session closed')
                })
                .catch(err => {
                    console.log('Something went wrong :(', err)
                    return reject(err)
                });

        });
    },
    getDocTriggerItems: function (docId) {
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
                    return app.createSessionObject({
                        "qInfo": {
                            "qId": "",
                            "qType": "SessionLists"
                        },
                        "qFieldListDef": {
                            "qShowSystem": true,
                            "qShowHidden": true,
                            "qShowSemantic": true,
                            "qShowSrcTables": true,
                            "qShowDerivedFields": true,
                            "qShowImplicit": true
                        },
                        "qDimensionListDef": {
                            "qType": "dimension",
                            "qData": {}
                        },
                        "qVariableListDef": {
                            "qType": "variable",
                            "qShowReserved": true,
                            "qShowConfig": true,
                            "qData": {
                                "tags": "/tags"
                            }
                        },
                        "qMeasureListDef": {
                            "qType": "measure",
                            "qData": {
                                "title": "/title",
                                "tags": "/tags"
                            }
                        }
                    })
                })
                .then((sessionObject) => {
                    //mainWindow.webContents.send('appobjectlist', genericobjects)

                    return sessionObject.getLayout()
                }).then((itemslist) => {
                    //mainWindow.webContents.send('appobjectlist', genericobjects)
                    console.log(itemslist)
                    return resolve(itemslist)
                })
                .then(() => qix.close())
                .then(() => {
                    console.log(' Qix Session closed')
                })
                .catch(err => {
                    console.log('Something went wrong :(', err)
                    return reject(err)
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


            const DimensionArray = {
                "qNullSuppression": true,
                "qDef": { "qFieldDefs": ["=if([Sales Rep Name]='Amanda Honda', [Sales Rep Name], null())"] },
            };

            qix.open()
                .then((global) => {

                    return global.getDocList()
                })
                .then((docList) => {

                    return resolve(docList);
                    /*console.log(docList);*/


                })
                .then(() => qix.close())
                .then(() => console.log(' Qix Session closed'))
                .catch(err => { return resolve(err) });

        });
    },
    libraryDimensionLookup: function (dimension) {
        return new Promise((resolve, reject) => {

        })
    },
    formatDimension: function (dimension) {
        return new Promise((resolve, reject) => {
            //Format dimensions for qlik hypercube

            //Library item
            if(dimension['qLibraryId']) {
                var value = {
                    "qNullSuppression": true,
                    "qLibraryId": ""
                };

            } else {



            //Non library item

            var string = "=if([" + dimension['fieldname'] + "]=" + "'" + dimension['value'] + "',[" + dimension['fieldname'] + "], null())";

            var value = {
                "qNullSuppression": true,
                "qDef": { "qFieldDefs": [string] }
            };

        }
            resolve(value);


        })
    },
    formatMeasure: function (measure, measureOrder) {
        return new Promise((resolve, reject) => {
            //Format dimensions for qlik hypercube

            var string = measure['expressionvalue'];


            resolve({
                "qDef": {"qDef": string}
            });

        })
    },
    formatRange: function (measure, measureOrder) {
        return new Promise((resolve, reject) => {
            //Format dimensions for qlik hypercube

            var string = measure['expressionvalue'];


            //Check if min or max exists
            if (measure['minvalue'] != null || measure['maxvalue'] != null) {

                var rangeItem = {
                    "qRange": {},
                    "qMeasureIx": measureOrder
                };


                if (measure['minvalue']) {
                    rangeItem.qRange.qMin = measure['minvalue'];
                }

                if (measure['maxvalue']) {
                    rangeItem.qRange.qMax = measure['maxvalue'];
                }


                resolve(rangeItem);

            } else {
                resolve();
            }


        })
    },
    createMeasureObject: function (docId, measureArray) {
        return new Promise((resolve, reject) => {

            

          //  console.log('checkSessionObject Fired');

            let i;
            let dimensionAddPromises = [];
            let measureAddPromises = [];
            let rangeAddPromises = [];

            for (i = 0; i < measureArray.dimensions.length; ++i) {
                dimensionAddPromises.push(self.formatDimension(measureArray.dimensions[i], i));
            }



            /////////////////////
            var string = measureArray.measure['expressionvalue'];

            var measureVal = {"qDef": {"qDef": string}};

            //console.log('measureVal', measureVal)

///////////////////

                var rangeItem = {
                    "qRange": {},
                    "qMeasureIx": 0
                };


                if (measureArray.measure['minvalue']) {
                    rangeItem.qRange.qMin = measureArray.measure['minvalue'];
                }

                if (measureArray.measure['maxvalue']) {
                    rangeItem.qRange.qMax = measureArray.measure['maxvalue'];
                }


                //console.log('rangeItem', rangeItem)


            const qix = enigma.create({
                schema,
                url: 'ws://localhost:4848/app/' + docId + '/engineData',
                createSocket: url => new WebSocket(url)
            });


            //qix.on('traffic:*', (direction, msg) => console.log(direction, JSON.stringify(msg)));


            let qDimensionVals;

            Promise.all(dimensionAddPromises)
                .then((results) => {
                    //console.log('DIMENSION FORMAT OUTPUT', results);
                    qDimensionVals = results;
                    return 'dimensionsformatted';
                })
                .then(() => qix.open())
                .then(function (global) {
                   // console.log('Open app')
                    return global.openDoc(docId, '', '', '', false)
                })
                .then((app) => {
                    
                    //Create session object to check numbers against
                    return app.createSessionObject({
                        "qInfo": {
                            "qType": "alert-object",
                        },
                        "qHyperCubeDef": {
                            "qDimensions": qDimensionVals,
                            "qMeasures": [measureVal],
                            "qInitialDataFetch": [
                                {
                                    "qHeight": 100,
                                    "qWidth": 10,
                                }
                            ]
                        }
                    })
                }).then((object) => object.getLayout()
                
                    // Select first measure ranges as defined by user
                    .then(() => object.rangeSelectHyperCubeValues('/qHyperCubeDef', [rangeItem]))
                    // Get layout and view the selected values
                    .then((result) => {
                        //console.log('FINAL RESULT', result)
                        //If nothing is selectable return false as does not match criteria
                        if (result == false) {
                            return false
                        } else {
                            return object.getLayout()
                        }
                    })
                    .then((layout) => {
                        //console.log('THE LAYOUT', layout);
                        //Check if the filtering still returns a row which means criteria is met
                        if (layout == false) {
                            //console.log('does not meet criteria')
                            return resolve(false)
                        } else {
                            //If there is selectable return positive  result
                            //console.log(layout.qHyperCube.qDataPages[0].qMatrix)
                            return resolve(true)
                        }
                    }))
                .then(() => qix.close())
                .then(() => {
                    //console.log(' Qix Session closed')
                })
                .catch(err => {
                    console.log('Something went wrong :(', err)
                    return reject(err)
                    //Create session object using specified dimension and measure/variable values


                    //Check value against specific Information

                    //Check measure

                    //Destroy and close session

                })

        
        })
    },
    checkSessionObject: function (docId, triggerArray) {
        return new Promise((resolve, reject) => {



            //console.log('checkSessionObject Fired');

            let i;
            let measureSplitPromises = [];
        
            var interationNumber = 0;
            var numberofmeasures = triggerArray.measures.length -1;
            var measureNumber = 0;
            var resultsarray = [];

            //console.log(triggerArray);

           // console.log('total number of measures', numberofmeasures)

            executeMeasure(0, triggerArray);

            function executeMeasure (measureNumber, triggerArray) {

                //console.log('Measure Number:', measureNumber)

                var individualMeasureData = {
                    "dimensions": triggerArray.dimensions,
                    "measure":  triggerArray.measures[measureNumber]
                }


                //console.log('individualMeasureData',individualMeasureData)


                self.createMeasureObject(docId, individualMeasureData).then((data)=> {
                    resultsarray.push(data);
                    //console.log(measureNumber + ' result ' + data);

                    if(measureNumber == numberofmeasures) {
                       // console.log('Last measure');
                       // console.log('resultsarray', resultsarray);
                        if(resultsarray.includes(false)==true) {
                            //Do not fire alert
                            return resolve(false);
                        } else {
                            //Fire alert
                            return resolve(true)
                        }

                    } else {



                        measureNumber+=1;
                    
                        executeMeasure(measureNumber, triggerArray)

                    }
                    
                
                }).catch(err => {
                    console.log('Something went wrong :(', err)
                    return reject(err)
                    //Create session object using specified dimension and measure/variable values
    
                })

            }
    


            //qix.on('traffic:*', (direction, msg) => console.log(direction, JSON.stringify(msg)));


        })
    }

}