const { ipcRenderer, remote } = require('electron')


$(document).ready(function () {


    $('.version_holder').html(remote.getGlobal('app_version'))

});