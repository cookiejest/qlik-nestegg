
const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain, Notification } = electron




//For DEV
//require('electron-reload')(__dirname);


const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');
//var senseUtilities = require('enigma.js/sense-utilities');
var readline = require('readline');

global['rootPath'] = __dirname;

//Public resource folder path
global['viewsPath'] = path.join(__dirname, 'views')
global['publicPath'] = path.join(__dirname, 'public')
global['app_version'] = 1.1

let mainMenu = Menu.buildFromTemplate(require(__dirname + '/controllers/mainMenu.js'))
let startupController = require(__dirname + '/controllers/startupController')
let testController = require(__dirname + '/controllers/testController')
let qlikCommands = require(__dirname + '/controllers/qlikCommands')

let logger = require(__dirname + '/utilities/Logger')

/*
logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Hello world');
logger.warn('Warning message');
logger.error('Error info');

*/

//////////////////////////////



//////////////////////////////////////////////


//app.setBadgeCount(10);


//var mainWindow1 = mainWindow.create();


//App events



var preventquitconfirmed = 'no';

//Listen for app to quit
app.on('before-quit', function (event) {

  //console.log('App quiting... stopping quit!');

  logger.info('App quiting');


  //Closes window but does not end nodejs process

  if (preventquitconfirmed == 'yes') {
    once(function () { app.quit() });

  } else {

    event.preventDefault();
    dialog.showMessageBox({ message: 'Are you sure you want to completely close the application? This will stop chart listeners.', buttons: ['Quit', 'Cancel'] }, (buttonIndex) => {

      if (buttonIndex === 0) {
        preventquitconfirmed = 'yes';
        app.quit();
      }
    })

  }



});

//Listen for app to quit
app.on('browser-window-focus', function (event) {

  //console.log('Window in focus');

});



//////////////////////////////////////////////////////////////////////////////////

ipcMain.on('new_test_channel', (event, new_test_name) => {


  logger.info('Create new Test file...' + new_test_name);


  testController.saveTestScript(new_test_name, '').then((result) => {

    logger.info('Save new test script...' + result);



    event.sender.send('new_test_channel', new_test_name)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})


ipcMain.on('retrieve_tests', (event, value) => {

  //Retrieve test files

  testController.retrieveTestDocs().then((result) => {


    logger.debug('Retrieve test scripts...' + result);

    event.sender.send('retrieve_tests', result)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})



ipcMain.on('save_test_data', (event, value) => {


  testController.saveTestScript(value.fileName, value.fileContent).then((result) => {


    logger.debug('Save test data script...' + result);

    event.sender.send('save_test_data', result)



  });


})



ipcMain.on('delete_test_data', (event, value) => {


  logger.debug('filename from renderer..' + value);

  testController.deleteTestScript(value).then((result) => {


    logger.debug('delete test script result..' + result);

    event.sender.send('delete_test_data', result)



  });


})


ipcMain.on('load_file_data', (event, value) => {

  //console.log('retrieve file');

  testController.retrieveTestContent(value).then((result) => {


    logger.debug('retrieve test content..');


    var content = { "filename": value, "filecontent": result };

    event.sender.send('load_file_data', content)
    //mainWindow.webContents.send('new_test_channel', 'complete')


  }).catch(function (error) {


    logger.warn(error);

  })
})




ipcMain.on('run_test', (event, value) => {

  logger.info('Starting test file..', value);

  testController.startTestProcess(value).then((result) => {


    logger.info('startTestProcess Complete...' + result);




    event.sender.send('run_test', result)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})


//Handle responses from renderer
//Populate doc Object List
ipcMain.on('docObjectListChannel', (event, docId) => {

  logger.debug('Get doc objects');


  qlikCommands.getDocObjects(docId, ["gauge", "table", "piechart", "listbox", "linechart", "sheet"]).then((docObjectArray) => {

    //Filter doc objects array

    logger.debug(docObjectArray);

    mainWindow.webContents.send('docObjectListChannel', docObjectArray)

  })






  //Populate trigger item list
  ipcMain.on('docTriggerItemsChannel', (event, docId) => {


    logger.debug('Get doc trigger items!');

    qlikCommands.getDocTriggerItems(docId).then((docTriggerItemArray) => {

      //Filter doc objects array
      logger.debug('Get doc trigger items!');

      logger.debug(docTriggerItemArray);

      mainWindow.webContents.send('docTriggerItemsChannel', docTriggerItemArray)

    })

  })

  //////////////////////


})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function (event) {

  logger.info('App ready, run startup controller..');
  /*
  let myNotification = new Notification('Title', {
    body: 'Lorem Ipsum Dolor Sit Amet'
  })

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }

*/


  //testController.saveTestScript('some new content', 'sometest1');


  startupController.startUp();


  //testController.startTest();

  //itemPrinter('BHTXyNM')


})

