
const electron = require('electron')
// Module to control application life.
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray, ipcMain } = electron

//For DEV
require('electron-reload')(__dirname);

const windowStateKeeper = require('electron-window-state')

const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');
//var senseUtilities = require('enigma.js/sense-utilities');
var readline = require('readline');


let mainMenu = Menu.buildFromTemplate(require('./mainmenu.js'))
let mainWindow
let loaderWindow
//////////////////////////////

global['app_version'] = 1.1


//////////////////////////////////////////////


app.setBadgeCount(10);



function createMainWindow() {

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
    pathname: path.join(__dirname, 'index.html'),
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


  let mainContents = mainWindow.webContents


  mainContents.on('did-finish-load', () => {

    connectqlik()



  })

}







//Create loader window
function createLoaderWindow() {

  //Create a loader window.
  let loaderWindow = new BrowserWindow({
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
    pathname: path.join(__dirname, 'loader.html'),
    protocol: 'file:',
    slashes: true
  }))

  console.log('show loader window');
  loaderWindow.show();




  function loadtasks() {


    function establishDesktopConnection() {
      return new Promise((resolve, reject) => {

        var attemptcounter = 0;

        var testqlikconn = setInterval(function () {


          const ws = new WebSocket('ws://localhost:4848/app/engineData');




          ws.addEventListener('error', (err) => {

            console.log('Connection attempt: ', attemptcounter);
            attemptcounter += 1;

            if (attemptcounter == 1) {
              loaderWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'openqlikplease.html'),
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

            resolve('Connected')


          });


        }, 3000)




        console.log('Start load tasks');


      })
    }

    function checkQlikLogin() {
      return new Promise((resolve, reject) => {


      })
    }


    establishDesktopConnection()
      .then(checkQlikLogin)
      .then(values => {

        console.log(values);

        createMainWindow();

        loaderWindow.hide();

        mainWindow.show();

        console.log('create main window now');


      }).catch(function (error) {
        console.log(error);
      })



  }

  loadtasks()

}


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





function itemPrinter(objectid) {
  return new Promise((resolve, reject) => {

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
      pathname: path.join(__dirname, 'print-container.html'),
      protocol: 'file:',
      slashes: true
    }))


    console.log('test3')

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


  });
}




function connectqlik() {

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
      return
    })
    .then(() => qix.close())
    .then(() => console.log(' Qix Session closed'))
    .catch(err => console.log('Something went wrong :(', err));


  /*
  const ws = new WebSocket('ws://localhost:4848/app/engineData');

  //Pull list of documents from Qlik
  ws.on('open', function open() {

    ws.send(JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "handle": -1,
      "method": "GetDocList",
      "params": {}
    }), function (data, err) {

      //console.log('returned data ', data);
      //data will come back on message
      console.log(err);
    });

  });

  //Wait for response and start request
  ws.on('message', function incoming(data) {

    //console.log(data);

    var data = JSON.parse(data);

    if (data.id == 1) {
      //1: Initial getdoclist request


      mainWindow.webContents.send('applistchannel', data.result.qDocList)

      //Terminate Connection
      ws.terminate();

    }


  });

*/


}




//////////////////////////////////////////////////////////////////////////////////



//Handle responses from renderer

ipcMain.on('appobjectlist', (event, docId) => {


  const qix = enigma.create({
    schema,
    url: 'ws://localhost:4848/app/' + docId + '/engineData',
    createSocket: url => new WebSocket(url)
  });

  qix.on('traffic:sent', data => console.log('sent:', data));
  qix.on('traffic:received', data => console.log('received:', data));

  qix.open()
    .then(function (global) {

      return global.openDoc(docId, '', '', '', false)
    })
    .then((app) => {
      return app.getAllInfos()
    })
    .then((genericobjects) => {
      mainWindow.webContents.send('appobjectlist', genericobjects)
    })
    .then(() => qix.close())
    .then(() => console.log(' Qix Session closed'))
    .catch(err => console.log('Something went wrong :(', err));
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


function createTray() {
  tray = new Tray('./app_logo1.png')
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
      createLoaderWindow()
    }


  })


  tray.setContextMenu(trayMenu)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function (event) {


  createLoaderWindow()


  //itemPrinter('BHTXyNM')

  /* Create Tray Icon */
  createTray()





})