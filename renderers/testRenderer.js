const { ipcRenderer, remote } = require('electron')

const { dialog, app } = require('electron').remote;

$(document).ready(function () {


    console.log("ready!");

    var openfilename = 'example';

    ipcRenderer.send('load_file_data', openfilename);

    editor.setReadOnly(true);

    $('#run_test_button').prop('disabled', true);
    $('#delete_test_button').prop('disabled', true);
    $('#save_test').prop('disabled', true);


    ipcRenderer.send('retrieve_tests', 'get');

    ipcRenderer.on('retrieve_tests', (event, files) => {

        $("tests").empty();

        $.each(files, function (key, value) {

            var cleanval = value.replace('.w0w', '')

            if (cleanval == openfilename) {

                var activestring = 'color: white;';
            } else {

                var activestring = '';
            }

            $("tests").append("<test style='margin-left: 15px;'><a class='filebutton' style='" + activestring + "' filename='" + cleanval + "' href='#'>" + cleanval + "</a></test></br>");



            console.log('Files printed to view');
            //Load the file into into javascript array

        });


        $('.filebutton').click(function () {

            console.log($(this).attr('filename'))

            ipcRenderer.send('load_file_data', $(this).attr('filename'));

        })

    })



    $('#run_test_button').click(function () {

        $('#run_test_button').addClass("is-loading");
        console.log('Start test!');
        ipcRenderer.send('run_test', openfilename);


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
        console.log('The open file nname is ', openfilename)
        ipcRenderer.send('retrieve_tests', 'get');

    })




    ipcRenderer.on('load_file_data', (event, data) => {

        console.log('File retrieved from main');
        console.log(data);
        $("#new_test_modal").removeClass("is-active");
        $('#confirm_new_test_button').removeClass("is-loading");
        console.log('Time to load the file!');
        ipcRenderer.send('retrieve_tests', 'get');
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



    ipcRenderer.on('log_message', (event, filename) => {


        $("log_messages").append("<log_message>" +  + "</log_message></br>");



        //Load the file into into javascript array

        // openfilename = filename;





    })


    ipcRenderer.on('delete_test_data', (event, filename) => {

        console.log('File deleted!');

        editor.setReadOnly(true);

        $('#run_test_button').prop('disabled', true);
        $('#delete_test_button').prop('disabled', true);
        $('#save_test').prop('disabled', true);



        editor.setValue("//Please create or select a load script to begin.");
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



})
