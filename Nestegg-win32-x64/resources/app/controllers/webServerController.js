//Start Test
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  console.log('THIS IS FROM THE CHILD PROCESS EXPRESS APP!')
  res.send('hello world')
})



// respond with "hello world" when a GET request is made to the homepage
app.get('/test/run', function (req, res) {
  console.log('Run the test dude')

  console.log('THE REQUEST', req.body)
  res.send('hello world')
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))