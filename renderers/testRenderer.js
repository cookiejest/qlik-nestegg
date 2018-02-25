const { ipcRenderer, remote, Notification } = require('electron')

const { dialog, app } = require('electron').remote;




$(document).ready(function () {


    console.log("ready!");

   var openfilename = '';

    ipcRenderer.send('load_file_data', openfilename);

    editor.setReadOnly(true);

    $('#run_test_button').prop('disabled', true);
    $('#delete_test_button').prop('disabled', true);
    $('#save_test').prop('disabled', true);

    $('#stop_test_button').prop('disabled', true);


    ipcRenderer.send('retrieve_tests', 'get');

    ipcRenderer.on('retrieve_tests', (event, files) => {

        $(".testnav").empty();

        $.each(files, function (key, value) {

            var cleanval = value.replace('.w0w', '')

            if (cleanval == openfilename) {

                var activestring = ' is-active';
            } else {

                var activestring = '';
            }


            var navlink = '<a class="panel-block filebutton' + activestring + '" filename="' + cleanval + '"><span class="panel-icon"><i class="fas fa-book"></i></span>' + cleanval + '</a>'

            $(".testnav").append(navlink);



            console.log('Files printed to view');
            //Load the file into into javascript array

        });


        

        $('.filebutton').click(function () {

            console.log($(this).attr('filename'))

            ipcRenderer.send('load_file_data', $(this).attr('filename'));

        })

    })



    $('#run_test_button').click(function () {


        var editorvalue = editor.getValue();

        var data = {
            "fileName": openfilename,
            "fileContent": editorvalue
        };


        

        ipcRenderer.send('save_test_data', data);


        $('#run_test_button').addClass("is-loading");
        $('#run_test_button').prop('disabled', true);

        $('#stop_test_button').prop('disabled', false);

        console.log('Start test!');

        setTimeout(() => {
            ipcRenderer.send('run_test', openfilename);
          }
          ,500)



        var messagestring = '<a class="button is-small is-info"><span class="icon is-small"><i class="fas fa-play-circle"></i></span></a> Script Started!';

        $("#logmessages").append(messagestring + "</br>");
        var elem = document.getElementById('logmessages');

        elem.scrollTop = elem.scrollHeight;


    })


    ipcRenderer.on('run_test', (event, data) => {
        $('#run_test_button').removeClass("is-loading");
        console.log(data);

    })

    $('#new_test').click(function () {

        $("#new_test_modal").addClass("is-active");
    })


    $('#new_test_close').click(function () {


        $("#new_test_modal").removeClass("is-active");
    })


    $('#confirm_new_test_button').click(function () {

        $('#confirm_new_test_button').addClass("is-loading");

        console.log($('#new_test_name').val());

        ipcRenderer.send('new_test_channel', $('#new_test_name').val());

        $('#new_test_name').val('');

    })



    ipcRenderer.on('new_test_channel', (event, filename) => {

        $("#new_test_modal").removeClass("is-active");
        $('#confirm_new_test_button').removeClass("is-loading");
        console.log('Time to load the file!');
        //Load the file into into javascript array

        openfilename = filename;

        //Load file data

        ipcRenderer.send('load_file_data', filename);
        console.log('The open file name is ', openfilename)
        ipcRenderer.send('retrieve_tests', 'get');

    })




    ipcRenderer.on('load_file_data', (event, data) => {


        console.log(data);
        $("#new_test_modal").removeClass("is-active");
        $('#confirm_new_test_button').removeClass("is-loading");
        console.log('Time to load the file!');
        ipcRenderer.send('retrieve_tests', 'get');
        console.log(data.filecontent);
        editor.setValue(data.filecontent)
        //Load the file into into javascript array

        editor.setReadOnly(false);

        $('#run_test_button').prop('disabled', false);
        $('#delete_test_button').prop('disabled', false);
        $('#save_test').prop('disabled', false);


        openfilename = data.filename;

        //Set the text editor value to the file contents



    })



    
    ipcRenderer.on('save_test_data', (event, filename) => {

        setTimeout(function () {

            $('#save_test').removeClass("is-loading");

            console.log('File is saved!');
        }, 250)
        //Load the file into into javascript array

        // openfilename = filename;





    })



    ipcRenderer.on('log_message', (event, data) => {

        console.log(data);

        if (data.type == 'pass') {



            var messagestring = '<a class="button is-small is-success"><span class="icon is-small"><i class="fas fa-check"></i></span></a> <span class="is-success" >TEST: ' + data.message + "</span>";

            $("#logmessages").append(messagestring + "</br>");

        } else if (data.type == 'fail') {


            var messagestring = '<a class="button is-small is-danger"><span class="icon is-small"><i class="fas fa-times"></i></span></a> <span class="is-danger" >TEST: ' + data.message + "</span> - <i>" + data.error.message + '</i>';

            $("#logmessages").append(messagestring + "</br>");
        } else if (data.type == 'complete') {

            var messagestring = '<a class="button is-small is-info"><span class="icon is-small"><i class="fas fa-trophy"></i></span></a> <span class="is-danger" >' + data.message + " <b><span class='is-success button is-small '>" + data.passcounter + " pass</span> <span class='button is-small  is-danger'>" + data.failcounter + " fail<span></b> out of <b>" + data.totalcounter + "</b></span>";

            $('#run_test_button').removeClass("is-loading");
            $('#run_test_button').prop('disabled', false);
            $('#stop_test_button').prop('disabled', true);


            $("#logmessages").append(messagestring + "</br>");
        } else if (data.type == 'script error') {

            var messagestring = '<a class="button is-small is-warning"><span class="icon is-small"><i class="fas fa-exclamation-triangle"></i></span></a> <span class="is-danger" >' + data.message + "</span> - <i>" + data.error.message + "</i>";

            $('#run_test_button').removeClass("is-loading");

            $("#logmessages").append(messagestring + "</br>");
        }



        var elem = document.getElementById('logmessages');

        elem.scrollTop = elem.scrollHeight;


        //Load the file into into javascript array

        // openfilename = filename;





    })


    ipcRenderer.on('error_message', (event, message) => {



        $('#error_modal').addClass("is-active");

    
  $("#error_message").html(message);

    })






    ipcRenderer.on('delete_test_data', (event, filename) => {

        console.log('File deleted!');

        editor.setReadOnly(true);

        $('#run_test_button').prop('disabled', true);
        $('#delete_test_button').prop('disabled', true);
        $('#save_test').prop('disabled', true);



        editor.setValue("//Please create or select a test script to begin.");
        ipcRenderer.send('retrieve_tests', 'get');
        $('#delete_test_confirm').removeClass("is-loading");

        $("#delete_test_modal").removeClass("is-active");


    })





    $('#save_test').click(function () {

        $('#save_test').addClass("is-loading");

        var editorvalue = editor.getValue();

        var data = {
            "fileName": openfilename,
            "fileContent": editorvalue
        };

        ipcRenderer.send('save_test_data', data);


        //  console.log(editorvalue);

    })

    $('#delete_test_button').click(function () {

        $("#delete_test_modal").addClass("is-active");
    })

    $('#delete_test_confirm').click(function () {
        $('#delete_test_confirm').addClass("is-loading");


        ipcRenderer.send('delete_test_data', openfilename);


    })



    $('#delete_test_close').click(function () {


        $("#delete_test_modal").removeClass("is-active");
    })


    $('#error_modal_close').click(function () {
        
        $(".button").removeClass("is-loading");
        $("#error_modal").removeClass("is-active");
    })






})
