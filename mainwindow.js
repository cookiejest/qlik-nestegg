


module.exports = {

  create: function () {
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
}