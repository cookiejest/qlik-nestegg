const windowStateKeeper = require('electron-window-state')

module.exports = {

  create: function () {

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


    mainWindow.webContents.on('did-finish-load', () => {

      connectqlik()


    })

    return mainWindow;

  },
  connectqlik: function () {

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

}