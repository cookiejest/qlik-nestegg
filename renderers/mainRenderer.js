// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



const { ipcRenderer, remote } = require('electron')

const { dialog, app } = require('electron').remote;


//ipcRenderer.send('channel1', 'hello from the renderer process on channel 1')

/*
ipcRenderer.on('sync-channel', (event, args) => {
  console.log(args + 'in browser');

});
*/

/*
setTimeout(() => {
  let mainResponse = ipcRenderer.sendSync('sync-channel', 'some request');
}
,4000)
*/

//Global variable example
console.log(remote.getGlobal('app_version'))


ipcRenderer.on('applistchannel', (event, args) => {
  console.log('Applist data');
  console.log(args);


  $.each(args, function (key, value) {
    $("#qlikapps").append($('<option></option>').val(value.qDocId).html(value.qTitle));
  });



  //Populate menu on left


  //event.sender.send('applistchannel', 'Message recieved on  on channel 1 renderer');

});


$('#qlikapps').change(function () {


  alert($('#qlikapps option:selected').val());
  ipcRenderer.send('appobjectlist', $('#qlikapps option:selected').val());



});

//Handle response from appobjectlist
ipcRenderer.on('appobjectlist', (event, args) => {

  console.log('Applist data');
  console.log(args);
  $("#channellist").empty();

  $.each(args, function (key, value) {

    $("#channellist").append('<channelname>' + value.qId + '</channelname>');
  });





});


/*
console.log(mainResponse);

ipcRenderer.on('channel1', (event, args) => {
    console.log(args);
    event.sender.send('channel2', 'Message recieved on  on channel 1 renderer');
  });

  ipcRenderer.on('private', (event, args) => {
    console.log(args);
    
  });


  ipcRenderer.on('channel2', (event, args) => {
    console.log(args);
    event.sender.send('channel2', 'Message recieved on  on channel 2 renderer');

  });
*/


//Remote - allow access objects wihtout custom IPC messages

//dialog.showMessageBox({message: 'a message dialog invoked via renderer.js', button: 'OK'})

/*
dialog.showMessageBox({message: 'Are you sure you want to quit?', buttons: ['Quit', 'Cancel']}, (buttonIndex)=> {

  if(buttonIndex===0) {
    app.quit();
  }
})
*/


onload = () => {



  const webview = document.querySelector('webview')
  const indicator = document.querySelector('.indicator')

  const loadstart = () => {
    indicator.innerText = 'loading...'
  }

  const loadstop = () => {
    indicator.innerText = ''
  }

  webview.addEventListener('did-start-loading', loadstart)
  webview.addEventListener('did-stop-loading', loadstop)

}
