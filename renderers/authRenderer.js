
const { ipcRenderer, remote } = require('electron')



// Wait for the DOM to be ready
$(function () {

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

      var myclientid = "this_is_my_id";

      var machineid = remote.getGlobal('machineid')

      console.log(machineid)

      var username = $("#email").val();
      var password = $("#password").val();

      function make_base_auth(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
      }

      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 8; i < 20; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }

      console.log(makeid());


      var tempid = makeid();
      var tempsecret = makeid();

      var addupdateclient_url = "http://localhost:8083/authenticate/api/clients"


console.log({tempusername: tempid, temppassword: tempsecret})

      $.ajax({
        type: "POST",
        data: { name: machineid, id: tempid, secret: tempsecret },
        url: addupdateclient_url,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        }
      }).done(function (response) {
        console.log(response)


        var authurl = "http://localhost:8083/authenticate/oauth2/autoauthorize?client_id=" + tempid + "&response_type=code&redirect_uri=http://localhost:8083/authenticate/api/response"

        console.log(authurl)

        $.ajax({
          type: "GET",
          url: authurl,
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
          }
        }).done(function (response) {
          console.log(response)


          $.ajax({
            type: "POST",
            data: { code: response.code, grant_type: "authorization_code", redirect_uri: "http://google.com"},
            url: "http://localhost:8083/authenticate/oauth2/token",
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', make_base_auth(tempid, tempsecret));
            }
          }).done(function (response) {
            console.log(response)
          });


        });

      });


      /*
            var authurl = "http://localhost:8083/authenticate/oauth2/autoauthorize?client_id=" + myclientid + "&response_type=code&redirect_uri=http://localhost:8083/authenticate/api/response"
      
            console.log(authurl)
      
            $.ajax({
              type: "GET",
              url: authurl,
              beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', make_base_auth(tempid, tempsecret));
              }
            }).done(function (response) {
              console.log(response)
            });
      
      
      */


    }
  });
});
