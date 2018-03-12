
const { ipcRenderer, remote } = require('electron')



// Wait for the DOM to be ready
$(function () {


  ipcRenderer.on('error_message', (event, message) => {


    console.log(message)

    $('#login_button').removeClass('is-loading');


    $("#submiterror").html(message);
    $("#submiterror").show()
})


  $("#submiterror").hide()

  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='login']").validate({
    errorClass: "help is-danger",
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },
    // Specify validation error messages
    messages: {
      email: "Please enter a valid email address",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      }
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function (form) {
      //form.submit();
      //Send completion IPC to retrieve token.
      $('#login_button').addClass('is-loading')
      console.log('Login form clicked!', form);

      ipcRenderer.send('LoginAttempt', $('#email').val(),  $('#password').val());

    }
  });




  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  $("form[name='registration']").validate({
    errorClass: "help is-danger",
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      name: "required",
      company: "required",
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true
      },
      password: {
        required: true,
        minlength: 5
      }
    },
    // Specify validation error messages
    messages: {
      name: "Please enter your name",
      company: "Please enter your company",
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long"
      },
      email: "Please enter a valid email address"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function (form) {
      //form.submit();


      //Send IPC thing

      $.post("http://localhost:8083/authenticate/api/signup", {
        name: $('#name').val(),
        email: $('#email').val(),
        company: $('#company').val(),
        password: $('#password').val()
      })
        .done(function (data) {

          if (data.status == 'fail') {
            $("#submiterror").html(data.message)
            $("#submiterror").show()
          } else {

            ipcRenderer.send('LoginAttempt', $('#email').val(),  $('#password').val());

          }
          console.log(data)
          // alert("Data Loaded: " + data);
        });


    }
  });

})
