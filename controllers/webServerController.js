//Start Test
var express = require('express')
var app = express()



//Host vue.js app
app.use('/', express.static('./app/dist'))


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


app.listen(3001, () => console.log('Example app listening on port 3001!'))