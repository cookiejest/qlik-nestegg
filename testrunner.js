let logger = require('electron-log');
var Mocha = require('mocha');

global['rootPath'] = __dirname;

logger.info('Root path in testrunner.js is ' + global['rootPath']);

//let testController = require(global['rootPath'] + '/controllers/testController')

//const enigma = require('enigma.js');
//const schema = require('enigma.js/schemas/12.20.0.json');
logger.info('Test runner child process created for ' + process.argv)


var mocha = new Mocha({});


logger.debug('Create mocha instance');
var mocha = new Mocha({});
logger.log('THE FILE PATH', process.argv[2])

mocha.addFile(process.argv[2]);

var passcounter = 0;
var failcounter = 0;
var totalcounter = 0;


mocha.run()
    .on('test', function (test) {

        //console.log('Test started: ' + test.title);
        logger.debug('Test started: ' + test.title);

        // self.appendTestOutputFile(filePath, 'Test started: ' + test.title);
        //ipcRenderer.send('log_message', test.title);

        totalcounter += 1;
        //  electron.getWindow('windowName').webContents.send('info' , {msg:'hello from main process'});

    })
    .on('test end', function (test) {


        logger.debug('Test done: ' + test.title)

        // self.appendTestOutputFile(filePath, 'Result: ' + test.state);
        // mainWindow.webContents.send('log_message', test.state)
    })
    .on('pass', function (test) {


        logger.debug('Test passed: ' + test.title)


        passcounter += 1;

        var data = {
            "type": "pass",
            "message": test.title + ' PASSED'
        }

        //console.log(data);
        // self.appendTestOutputFile(filePath, 'Test passed!');


        logger.debug(data)

        //Send message to main process
        //Send message to main process

        //Only use process.send if child process

        process.send(data);




    })
    .on('fail', function (test, err) {

        if (err) {
            //console.log(err)
            logger.debug(err)
            //process.send(err);
        } else {

            // self.appendTestOutputFile(filePath, err);


            var data = {
                "type": "fail",
                "message": test.title + ' ' + ' FAILED',
                "error": JSON.parse(self.stringifyError(err, null, '\t'))
            }


            logger.debug('Test Failed')


            process.send(data);



        }

    })
    .on('end', function () {


        logger.debug('Test Script Complete')


        var data = {
            "type": "complete",
            "message": 'Script Completed!',
            "passcounter": passcounter,
            "failcounter": failcounter,
            "totalcounter": totalcounter
        }


        process.send(data);

        process.exit();

    })




process.on('message', (msg) => {
    console.log('Message from parent:', msg);

    if (msg.task == 'kill') {

        console.log('Test process is killed.')
        process.exit();


    }

});
