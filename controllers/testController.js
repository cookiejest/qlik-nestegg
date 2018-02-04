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
var Mocha = require('mocha');
var moment = require('moment');


var self = module.exports = {
    saveTestScript: function (testName, testContent) {
        return new Promise((resolve, reject) => {

            var fileContent = testContent;

            // The absolute path of the new file with its name
            var filepath = "./test/scripts/" + testName + '.w0w';

            fs.writeFile(filepath, fileContent, (err) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                } else {

                    return resolve(filepath);
                }
                // console.log("The file was succesfully saved!");
            });

        })
    },
    deleteTestScript: function (testName) {
        return new Promise((resolve, reject) => {


            // The absolute path of the new file with its name
            var filepath = "./test/scripts/" + testName + '.w0w';

            fs.unlink(filepath, function (error) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    return resolve(testName);
                    console.log('Deleted file');
                }
            });

        })
    },
    retrieveTestDocs: function () {
        return new Promise((resolve, reject) => {

            fs.readdir('./test/scripts/', (err, files) => {

                if (err) {
                    console.log(err);
                    return reject(err);
                } else {
                    console.log(files);
                    return resolve(files);
                }

            })

        })
    },
    retrieveTestContent: function (filename) {
        return new Promise((resolve, reject) => {


            var filecontent = fs.readFile('./test/scripts/' + filename + '.w0w', function (err, f) {
                if (err) {
                    return reject(err);
                } else {
                    var data = f.toString()

                    return resolve(data);
                }
            })



        })
    },
    createTestOutputFile: function (testContent, testName, rundatetime) {
        return new Promise((resolve, reject) => {

            console.log('Create test output file')

            var formatted_rundatetime = moment().format('YYYY-MM-DD-HH-mm-ss')
            var fileContent = testContent;


            // The absolute path of the new file with its name
            var filePath = "./test/output/" + testName + ' ' + formatted_rundatetime + '.txt';

            fs.writeFile(filePath, fileContent, (err, outputfile) => {
                if (err) { throw err } else {

                    console.log(filePath);
                    console.log("The file was succesfully saved!");
                    return resolve(filePath);
                }

            });

        })
    },
    appendTestOutputFile: function (filePath, dataToAppend) {
        return new Promise((resolve, reject) => {

            /*
            console.log('This is the data', dataToAppend);
            console.log('This is the file path', filePath);
            */

            fs.appendFile(filePath, '\n' + dataToAppend, (err) => {
                if (err) { throw err } else {
                    //console.log('The "data to append" was appended to file!');
                    return resolve(filePath);
                }
            });

        })
    },
    startTest: function (fileName) {
        return new Promise((resolve, reject) => {

            //Create session object using specified dimension and measure/variable values

            console.log('start test from within node');

            var mocha = new Mocha({});


            // open source file for reading
            var r = fs.createReadStream('./test/templates/header.txt');

            var r2 = fs.createReadStream('./test/scripts/' + fileName + '.w0w');

            var headercontent;

            fs.readFile(path.join('./test/templates/header.txt'), 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                } else {

                    console.log(data);
                    headercontent = data;

                }

            });

            fs.readFile(path.join('./test/scripts/sometest1.w0w'), 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                } else {

                    console.log(data);
                    testcontent = data;

                }

            });


            var rundatetime = new Date();

            this.createTestOutputFile('//Test started at ' + rundatetime, 'My Big Test')
                .then((filePath) => {
                    //Append Header content
                    return self.appendTestOutputFile(filePath, headercontent);

                })
                .then((filePath) => {
                    //Append Header content
                    return self.appendTestOutputFile(filePath, testcontent + '\n \n //////////////////////////////////////////// \n //Start Of Logging');

                })
                .then((filePath) => {

                    //console.log('RUN MOCHA!');
                    mocha.addFile(filePath);

                    mocha.run()
                        .on('test', function (test) {
                            console.log('Test started: ' + test.title);
                            self.appendTestOutputFile(filePath, 'Test started: ' + test.title);
                        })
                        .on('test end', function (test) {
                            //console.log('Test done: ' + test.title);
                            self.appendTestOutputFile(filePath, 'Result: ' + test.state);
                        })
                        .on('pass', function (test) {
                            console.log('Test passed');
                            self.appendTestOutputFile(filePath, 'Test passed!');
                        })
                        .on('fail', function (test, err) {
                            console.log('Test fail');
                            //self.appendTestOutputFile(filePath, 'Test Failed!');
                            self.appendTestOutputFile(filePath, err);
                            console.log(err);
                        })
                        .on('end', function () {
                            console.log('All done');
                            return resolve('done!');
                        })
                })

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
};