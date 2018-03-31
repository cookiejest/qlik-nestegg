
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
const machinenodeid = require('node-machine-id');
const { machineId, machineIdSync } = machinenodeid;
const schema = require('enigma.js/schemas/12.20.0.json');
//var senseUtilities = require('enigma.js/sense-utilities');
var readline = require('readline');
var pjson = require('./package.json');


global['rootPath'] = __dirname;

//Public resource folder path
global['viewsPath'] = path.join(global['rootPath'], 'views')
global['publicPath'] = path.join(global['rootPath'], 'public')
global['app_version'] = pjson.version;

global['userDataPath'] = (electron.app || electron.remote.app).getPath('userData');

global['environment'] = 'development';

global['machineid'] = machineIdSync();
let logger = require('electron-log');


global['config'] = require('./config.js').get(global['environment']);

logger.info('Web service url', global['config'].webservice)
logger.info('Unique machine id', global['machineid'])
logger.info('User data path', userDataPath);
logger.info('Environment is ', global['environment']);



//Check for password in secure place

//If exists attempt to use it

//If it works continue

//If it fails prompt for login


//const updater = require('./updater')



let mainMenu = Menu.buildFromTemplate(require(global['rootPath'] + '/controllers/mainMenu.js'))
let startupController = require(global['rootPath'] + '/controllers/startupController')
let testController = require(global['rootPath'] + '/controllers/testController')
let qlikCommands = require(global['rootPath'] + '/controllers/qlikCommands')
let authController = require(global['rootPath'] + '/controllers/authController')

const keytar = require('keytar')




//Check user data folders exist.. if not create them.
if (!fs.existsSync(userDataPath + '/scripts')) {
  fs.mkdirSync(userDataPath + '/scripts');
}


if (!fs.existsSync(userDataPath + '/output')) {
  fs.mkdirSync(userDataPath + '/output');
}



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

  /*
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
*/


});

//Listen for app to quit
app.on('browser-window-focus', function (event) {

  //console.log('Window in focus');

});



//////////////////////////////////////////////////////////////////////////////////

ipcMain.on('new_test_channel', (event, testName) => {

  console.log('Create test file')
  logger.info('Create new Test file...' + testName);

  /*
    testController.checkIfExists(new_test_name).then((result) => {
      logger.info('Does file exist already?', result)
    });
  */

  testController.checkValidFileName(testName)
    .then((testName) => {

      logger.verbose('File name is valid')

      //Append Header content
      return testController.checkIfExists(testName);

    })
    .then((testName) => {


      //Append Header content
      logger.verbose('Filename does not already exist')
      return testController.saveTestScript(testName, '')

    })
    .then((testName) => {

      console.log(testName);
      logger.verbose('Saved new test script' + testName);


      event.sender.send('new_test_channel', testName)


    }).catch(function (error) {

      console.log(error)

      //logger.warn(error);
      event.sender.send('error_message', error);

    })

  /*
//Check file name is valid
testController.checkValidFileName(new_test_name).then((result) => {

  logger.info('Is valid filename?', result)

}).catch(function (error) {

  console.log(error)

  //logger.warn(error);
  event.sender.send('error_message', error);

})


//Save blank test
testController.saveTestScript(new_test_name, '').then((result) => {

  logger.info('Save new test script...' + result);



  event.sender.send('new_test_channel', new_test_name)
  //mainWindow.webContents.send('new_test_channel', 'complete')

}).catch(function (error) {

  //logger.warn(error);
  event.sender.send('error_message', 'Could not create new file.')
})
*/

})


ipcMain.on('retrieve_tests', (event, value) => {

  //Retrieve test files

  testController.retrieveTestDocs().then((result) => {


    logger.debug('Retrieve test scripts...' + result);

    event.sender.send('retrieve_tests', result)
    //mainWindow.webContents.send('new_test_channel', 'complete')


  }).catch(function (error) {

    //logger.warn(error);
    event.sender.send('error_message', 'Could not retrieve test scripts.')
  })

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

ipcMain.on('stop_test', (event, value) => {

  logger.info('Stop test file..', value);



  testController.stopTestProcess().then((result) => {

    event.sender.send('stop_test', result)
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


  //Populate trigger item list
  ipcMain.on('LoginAttempt', (event, username, password) => {


    logger.debug('attempt user login');


    authController.generateToken(username, password).then((result) => {


      logger.debug('REsult from login', result);

      // mainWindow.webContents.send('docTriggerItemsChannel', docTriggerItemArray)
      //Redirect user to 
      app.relaunch()
      app.exit(0);
      
    }).catch(function (error) {

      event.sender.send('error_message', error);
      logger.error(error);
      //Bounce back error to login page

    })

  })


  logger.info('App ready, run startup controller..');




  //setTimeout(updater.check, 2000);


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

