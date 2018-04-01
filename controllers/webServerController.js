//Start Test
var express = require('express')
var cors = require('cors')
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

let qlikCommands = require('./qlikCommands')

var app = express()

app.use(cors())

const { remote } = require('electron')


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });



//Host vue.js app
app.use('/', express.static('./views/app'))

var dataarray = [{
  userid: "user1",
  testname: "sometestname",
  testcasearray: [{
    id: 1,
    app_name: "Executive Dashboard",
    dimension_conditions: [
      { dimension_name: "dimension1", dimension_value: "someval" },
      { dimension_name: "dimension2", dimension_value: "someval" }
    ],
    measure_conditions: [
      { measure_name: "measure1", measure_min_value: 30, measure_max_value: 50 },
      { measure_name: "measure2", measure_min_value: 20, measure_max_value: 30 }
    ],
    status: "pass"
  },
  {
    id: 2,
    app_name: "Consumer Sales",
    dimension_conditions: [
      { dimension_name: "dim3", dimension_value: "somevaASDl" },
      { dimension_name: "dim4", dimension_value: "somevSADal" },
      { dimension_name: "dim5", dimension_value: "somevSADal" }

    ],
    measure_conditions: [
      { measure_name: "measure1", measure_min_value: 30, measure_max_value: 50 },
      { measure_name: "measure3", measure_min_value: 20, measure_max_value: 30 }
    ],
    status: "pass"
  }
  ]
},
{
  testname: "sometestname2",
  userid: "user1",
  testcasearray: [{
    id: 1,
    app_name: "some app1",
    dimension_conditions: [
      { dimension_name: "dimension1", dimension_value: "dimval1" },
      { dimension_name: "dimension2", dimension_value: "dimval2" }
    ],
    measure_conditions: [
      { measure_name: "measure1", measure_min_value: 30, measure_max_value: 50 },
      { measure_name: "measure2", measure_min_value: 20, measure_max_value: 30 }
    ],
    status: "pass"
  },
  {
    id: 2,
    app_name: "some app1",
    dimension_conditions: [
      { dimension_name: "dimension3", dimension_value: "dimval3" },
      { dimension_name: "dimension4", dimension_value: "dimval1" },
      { dimension_name: "dim5", dimension_value: "somevSADal" }

    ],
    measure_conditions: [
      { measure_name: "measure1", measure_min_value: 30, measure_max_value: 50 },
      { measure_name: "measure2", measure_min_value: 20, measure_max_value: 30 }
    ],
    status: "pass"
  }
  ]
}];

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('error', function (error) {
    console.log(error)
  });

  ws.on('close', function () {
    console.log('Connection closed');
    //ws.terminate();
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    //ws.send('something from server');

    var JSONData = JSON.parse(message);


    if (JSONData.type == 'getActiveTest') {

      console.log('Get the active test request', JSONData)

      var result = dataarray.filter(function (obj) {
        console.log('In filter', obj)
        return obj.testname == JSONData.activeTest;
      });

      console.log('the result', result)

      ws.send(JSON.stringify({
        "action": "getActiveTestResponse", "data": result[0]
      }))
      console.log(dataarray)

    } else if (JSONData.type == 'updateTest') {


      //ISSUE IS HERE
      console.log('Run update test')

      //Remove old version
      for (var i = 0; i < dataarray.length; i++)
        if (dataarray[i].testname == JSONData.newtestdata.testname) {
          dataarray.splice(i, 1);
          break;
        }

        console.log('MODIFIED DATA ARRAY', dataarray)
      //Push new to databaase json obj
      dataarray.push(JSONData.newtestdata);

      //Return new val from the db object
      var result = dataarray.filter(function (obj) {
        console.log('In filter', obj)
        return obj.testname == JSONData.newtestdata.testname;
      });

      console.log('FINAL RESULT',result)

      ws.send(JSON.stringify({
        "action": "updateTestResponse", "data": result[0]
      }))


    }

  });

  //ws.send('something');

  //Done on first connection

  //Get list of tests

  var testlist = [];

  for (var i = 0; i < dataarray.length; i++) {

    var obj = {
      test_name: dataarray[i].testname
    };

    testlist.push(obj);
  }


  ws.send(JSON.stringify({
    "action": "updateTestList", "data": testlist
  }))

});


// respond with "hello world" when a GET request is made to the homepage
app.get('/test/run', function (req, res) {
  console.log('Run the test dude')

  console.log('THE REQUEST', req.body)
  res.send('hello world')
})


// respond with "hello world" when a GET request is made to the homepage
app.get('/applist', function (req, res) {

  qlikCommands.getDocList().then((docObjectArray) => {

    console.log(docObjectArray);

    var docarray =[];

    for (var i = 0; i < docObjectArray.length; i++) {

      docarray.push(docObjectArray[i].qTitle)
      //Do something
  }

    res.json(docarray)
    
    });

})


app.get('/dimensionlist', function (req, res) {

  
  qlikCommands.getAppFields('Executive Dashboard.qvf').then((fieldList) => {

   // res.json(fieldList.qFieldList.qItems)
    
    var fieldList = fieldList.qFieldList.qItems;

    var docarray =[];

    for (var i = 0; i < fieldList.length; i++) {

      docarray.push(fieldList[i].qName)
      //Do something
  }

    res.json(docarray)
   
    });


})

app.get('/dimensionvalues', function (req, res) {

  res.json({applist: ['hello world', 'app2','app3']})
})



/*
// respond with "hello world" when a GET request is made to the homepage
app.get('/helloworld', function (req, res) {
  res.send('hello world1')
})
*/


server.listen(3001, function listening() {
  console.log('Listening on %d', server.address().port);
});