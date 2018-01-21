module.exports = {
    print: function (ObjectId, Format) {


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

    },
    testLogin: function (docId) {


        
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
            .catch(err => console.log('Something went wrong :(', err));


    },
    getDocObjects: function (docId) {



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
            .catch(err => console.log('Something went wrong :(', err));


    }
};