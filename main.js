
const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

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


let mainMenu = Menu.buildFromTemplate(require('./controllers/mainMenu.js'))
let startupController = require('./controllers/startupController')
let testController = require('./controllers/testController')
let qlikCommands = require('./controllers/qlikCommands')


//////////////////////////////

//Public resource folder path
global['viewsPath'] = path.join(__dirname, 'views')
global['publicPath'] = path.join(__dirname, 'public')
global['app_version'] = 1.1


//////////////////////////////////////////////


//app.setBadgeCount(10);


//var mainWindow1 = mainWindow.create();



//App events

var preventquitconfirmed = 'no';
//Listen for app to quit
app.on('before-quit', function (event) {

  console.log('App quiting... stopping quit!');

  console.log(preventquitconfirmed);


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

  console.log('Create new Test file...', new_test_name);

  testController.saveTestScript(new_test_name, '').then((result) => {

    console.log(result);

    event.sender.send('new_test_channel', new_test_name)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})






ipcMain.on('retrieve_tests', (event, value) => {

  console.log('retrieve files please');

  testController.retrieveTestDocs().then((result) => {

    console.log(result);

    event.sender.send('retrieve_tests', result)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})



ipcMain.on('save_test_data', (event, value) => {


  testController.saveTestScript(value.fileName, value.fileContent).then((result) => {

    console.log(result);

    event.sender.send('save_test_data', result)



  });


})



ipcMain.on('delete_test_data', (event, value) => {

  console.log('filename from renderer', value)

  testController.deleteTestScript(value).then((result) => {

    console.log(result);

    event.sender.send('delete_test_data', result)



  });


})




ipcMain.on('load_file_data', (event, value) => {

  console.log('retrieve file');

  testController.retrieveTestContent(value).then((result) => {

    console.log(result);

    var content = { "filename": value, "filecontent": result };

    event.sender.send('load_file_data', content)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})



ipcMain.on('run_test', (event, value) => {

  console.log('Start the test');

  testController.startTest(value).then((result) => {


    console.log(result);


    event.sender.send('run_test', result)
    //mainWindow.webContents.send('new_test_channel', 'complete')

  });


})


//Handle responses from renderer
//Populate doc Object List
ipcMain.on('docObjectListChannel', (event, docId) => {

  console.log('Get doc objects!');

  qlikCommands.getDocObjects(docId, ["gauge", "table", "piechart", "listbox", "linechart", "sheet"]).then((docObjectArray) => {

    //Filter doc objects array

    mainWindow.webContents.send('docObjectListChannel', docObjectArray)

  })






  //Populate trigger item list
  ipcMain.on('docTriggerItemsChannel', (event, docId) => {

    console.log('Get doc objects!');

    qlikCommands.getDocTriggerItems(docId).then((docTriggerItemArray) => {

      //Filter doc objects array

      mainWindow.webContents.send('docTriggerItemsChannel', docTriggerItemArray)

    })

  })

  //////////////////////





  /*
      .then(function (app) {
        console.log("app Opened");
        console.log(app);
        return app.getAllInfos()
      })
  */

  /*
  .then(function (genericobjects) {
    console.log('THE generic objects', genericobjects);
    return;
  })
  .then(function () {
    session.close()
      .then(function () {
        console.log("session closed.")
      })
  })
*/




  /*
  const qix = new WebSocket('ws://localhost:4848/app/engineData');
 
 
  //Pull list of documents from Qlik
  qix.on('open', function open() {
 
    console.log('App to open: ', docId);
 
 
    //Open Document
    qix.send(JSON.stringify({
      "method": "OpenDoc",
      "handle": -1,
      "id": 1,
      "params": [
        docId
      ],
      "outKey": -1
    }), function (data, err) {
 
      //console.log('returned data ', data);
      //data will come back on message
      console.log('Doc open attempt started.');
      console.log(err);
    });
 
  });
 
 
  //Wait for response and start request
  qix.on('message', function incoming(data) {
 
    //console.log(data);
 
    var data = JSON.parse(data);
 
 
    if (data.id == 1) {
 
      console.log('Response from open document recieved');
 
      console.log('Retrieve generic objects');
 
      qix.send(JSON.stringify({
        "handle": 1,
        "method": "GetAllInfos",
        "params": {},
        "outKey": -1,
        "id": 2
      }), function (data, err) {
 
        //console.log('returned data ', data);
        //data will come back on message
        console.log('request for generic objects sent');
        console.log(err);
      });
 
    }
 
    if (data.id == 2) {
 
      console.log('Response from GetAllInfos recieved');
 
      //Terminate Connection
      qix.close();
      //qix.destroy();
      qix.terminate();
      console.log(data);
      delete qix;
      mainWindow.webContents.send('appobjectlist', data)
 
    }
 
 
    qix.onclose = () => {
      console.log("closed");
  };
 
  })
 
*/

})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function (event) {


  //testController.saveTestScript('some new content', 'sometest1');


  startupController.startUp();


  //testController.startTest();

  //itemPrinter('BHTXyNM')


})