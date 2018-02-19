const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

const { ipcRenderer, remote } = require('electron')

const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
const fork = require('child_process').fork;

const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');


let qlikCommands = require(global['rootPath'] + '/controllers/qlikCommands')
var Mocha = require('mocha');
var moment = require('moment');

let logger = require(global['rootPath'] + '/utilities/Logger')


var self = module.exports = {
    saveTestScript: function (testName, testContent) {
        return new Promise((resolve, reject) => {

            var fileContent = testContent;

            // The absolute path of the new file with its name
            var filepath = global['rootPath'] + '/test/scripts/' + testName + '.w0w';

            logger.debug('Save test script path: ' + filepath);

            fs.writeFile(filepath, fileContent, (err) => {
                if (err) {

                    logger.error(err);
                    return reject(err);
                } else {

                    logger.verbose('file saved!');

                    return resolve(filepath);
                }

            });

        })
    },
    deleteTestScript: function (testName) {
        return new Promise((resolve, reject) => {


            // The absolute path of the new file with its name
            var filepath = global['testFolderPath'] + testName + '.w0w';

            fs.unlink(filepath, function (error) {
                if (error) {
                    logger.error(err);
                    throw error;
                } else {
                    return resolve(testName);
                    logger.verbose('Deleted File');
                }
            });

        })
    },
    retrieveTestDocs: function () {
        return new Promise((resolve, reject) => {
            // The absolute path of the new file with its name

            var testsfolder = global['rootPath'] + '\\test\\scripts\\';

            logger.debug(testsfolder);

            fs.readdir(testsfolder, (err, files) => {

                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {

                    logger.verbose('Test Docs Retrieved');
                    return resolve(files);
                }

            })

        })
    },
    retrieveTestContent: function (filename) {
        return new Promise((resolve, reject) => {



            var filecontent = fs.readFile(global['rootPath'] + '/test/scripts/' + filename + '.w0w', function (err, f) {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {
                    var data = f.toString()
                    logger.verbose('Retrieved test content');
                    return resolve(data);
                }
            })



        })
    },
    createTestOutputFile: function (testContent, testName, rundatetime) {
        return new Promise((resolve, reject) => {


            var formatted_rundatetime = moment().format('YYYY-MM-DD-HH-mm-ss')
            var fileContent = testContent;

            // The absolute path of the new file with its name
            var filePath = global['rootPath'] + '/test/output/' + testName + ' ' + formatted_rundatetime + '.txt';

            logger.verbose(filePath);


            fs.writeFile(filePath, fileContent, (err, outputfile) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                } else {

                    logger.verbose("Test output file saved!");
                    return resolve(filePath);
                }

            });

        })
    },
    appendTestOutputFile: function (filePath, dataToAppend) {
        return new Promise((resolve, reject) => {


            fs.appendFile(filePath, '\n' + dataToAppend, (err) => {
                if (err) {
                    logger.error(err);
                    return reject(err);

                } else {
                    logger.verbose("The data to append was added to file!");

                    return resolve(filePath);
                }
            });

        })
    },
    stringifyError: function (err, filter, space) {
        var plainObject = {};
        Object.getOwnPropertyNames(err).forEach(function (key) {
            plainObject[key] = err[key];
        });
        return JSON.stringify(plainObject, filter, space);
    },
    startTest: function (filePath) {
        return new Promise((resolve, reject) => {


            logger.verbose('Create mocha instance');

            var mocha = new Mocha({});


            mocha.addFile(filePath);

            var passcounter = 0;
            var failcounter = 0;
            var totalcounter = 0;

            mocha.run()
                .on('test', function (test) {

                    logger.verbose('Test started: ' + test.title);

                    self.appendTestOutputFile(filePath, 'Test started: ' + test.title);
                    //ipcRenderer.send('log_message', test.title);

                    totalcounter += 1;
                    //  electron.getWindow('windowName').webContents.send('info' , {msg:'hello from main process'});

                })
                .on('test end', function (test) {

                    logger.verbose('Test done: ' + test.title);

                    self.appendTestOutputFile(filePath, 'Result: ' + test.state);
                    //mainWindow.webContents.send('log_message', test.state)
                })
                .on('pass', function (test) {

                    logger.verbose('Test passed: ' + test.title);


                    self.appendTestOutputFile(filePath, 'Test passed!');

                    passcounter += 1;

                    var data = {
                        "type": "pass",
                        "message": test.title + ' PASSED'
                    }

                    //Send message to main process
                    process.send(data);
                })
                .on('fail', function (test, err) {


                    //self.appendTestOutputFile(filePath, 'Test Failed!');
                    self.appendTestOutputFile(filePath, err);




                    logger.verbose('Test Failed');

                    logger.debug(self.stringifyError(err, null, '\t'));

                    var data = {
                        "type": "fail",
                        "message": test.title + ' ' + ' FAILED',
                        "error": JSON.parse(self.stringifyError(err, null, '\t'))
                    }

                    failcounter += 1;


                    //Send message to main process
                    process.send(data);


                })
                .on('end', function () {


                    logger.verbose('Test Script Complete!');


                    var data = {
                        "type": "complete",
                        "message": 'Script Completed!',
                        "passcounter": passcounter,
                        "failcounter": failcounter,
                        "totalcounter": totalcounter
                    }

                    //Send message to main process
                    process.send(data);

                    // process.exit();

                    return resolve('done!');
                })



        })


    },
    startTestProcess: function (fileName) {
        return new Promise((resolve, reject) => {

            //Create session object using specified dimension and measure/variable values


            logger.verbose('Start test from within test controller: ' + fileName);


            // open source file for reading
            //var r = fs.createReadStream('./test/templates/header.txt');

            //var r2 = fs.createReadStream('./test/scripts/' + fileName + '.w0w');

            var headercontent;

            fs.readFile(global['rootPath'] + '/test/templates/' + 'header.txt', 'utf8', function (err, data) {
                if (err) {

                    logger.error(err)
                    process.exit(1);
                } else {
                    logger.verbose('header data retrieved')

                    headercontent = data;


                    fs.readFile(global['rootPath'] + '/test/scripts/' + fileName + '.w0w', 'utf8', function (err, data) {
                        if (err) {

                            logger.error(err)
                            process.exit(1);
                        } else {
                            logger.verbose('test content retrieved')

                            testcontent = data;


                            var rundatetime = new Date();

                            self.createTestOutputFile('//Test started at ' + rundatetime, fileName)
                                .then((filePath) => {
                                    logger.verbose('Header appended to content')
                                    //Append Header content
                                    return self.appendTestOutputFile(filePath, headercontent);

                                })
                                .then((filePath) => {
                                    console.log('next step..')
                                    //Append Header content
                                    logger.verbose('Test script body appended to content')
                                    return self.appendTestOutputFile(filePath, testcontent + '\n \n //////////////////////////////////////////// \n //Start Of Logging');

                                })
                                .then((filePath) => {


                                    logger.verbose('Test file combined...' + filePath)
                                    const parameters = [filePath];

                                    const options = {
                                        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
                                    };

                                    logger.verbose('Create test runner child process..')


                                    //var childprocess_script = '.\\controllers\\testrunner.js';

                                    var childprocess_script = global['rootPath'] +  '\\testrunner.js';


                                    logger.verbose(childprocess_script)

                                    //Start child process
                                    var testrunner = fork(childprocess_script, parameters, options);



                                    testrunner.stdout.on('data', function (data) {

                                        logger.debug('Test Runner Message: ' + data.toString())



                                    });

                                    
                                    testrunner.on('message', (msg) => {

                                        logger.verbose('Message from testrunner child process' + msg)


                                        mainWindow.webContents.send('log_message', msg)
                                    });
                                    


                                    testrunner.on('error', (error) => {

                                        logger.error(error);

                                    });


                                }).catch(function (error) {

                                    logger.error(error);
                                })



                        }

                    });



                }

            });






        })
    },
    stopTest: function (Data) {
        return new Promise((resolve, reject) => {

            //Create session object using specified dimension and measure/variable values


            //Check value against specific Information

            //Check measure


        })
    },
    printTestMessages: function (Data) {
        return new Promise((resolve, reject) => {

            //Print the output somewhere


        })
    }
}