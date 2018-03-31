//Start Test
var express = require('express')
const http = require('http');
const url = require('url');
const WebSocket = require('ws');


var app = express()

const { remote } = require('electron')


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });



//Host vue.js app
app.use('/', express.static('./views/app'))



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

    if (JSONData.type == 'updateActiveTest') {

      ws.send(JSON.stringify({
        "action": "updateActiveTestData", "data": [
          {
            id: 1,
            app_name: "some app1",
            dimension_conditions: [
              { dimension_name: "dim1", dimension_value: "someval" },
              { dimension_name: "dim2", dimension_value: "someval" }
            ],
            measure_conditions: [
              { measure_name: "measure1", measure_value: "someval1" },
              { measure_name: "measure2", measure_value: "someval2" }
            ],
            status: "pass"
          },
          {
            id: 2,
            app_name: "some app1",
            dimension_conditions: [
              { dimension_name: "dim3", dimension_value: "somevaASDl" },
              { dimension_name: "dim4", dimension_value: "somevSADal" }
            ],
            measure_conditions: [
              { measure_name: "measure1", measure_value: "someval1" },
              { measure_name: "measure2", measure_value: "someval2" }
            ],
            status: "pass"
          }
        ]
      }))

    }

  });

  //ws.send('something');

  ws.send(JSON.stringify({
    "action": "updateTestList", "data": [
      {
        test_name: "Test1"
      },
      {
        test_name: "Test2"
      },
      {
        test_name: "Test3"
      }
    ]
  }))

});


// respond with "hello world" when a GET request is made to the homepage
app.get('/test/run', function (req, res) {
  console.log('Run the test dude')

  console.log('THE REQUEST', req.body)
  res.send('hello world')
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