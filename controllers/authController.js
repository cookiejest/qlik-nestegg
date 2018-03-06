
const electron = require('electron')
const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const { session } = electron;

const isOnline = require('is-online');
var moment = require('moment');
//var request = require('request');
//NEEDED TO ENABLE COOKIE SHARING BETWEEN REQUESTS
var request = request.defaults({ jar: true })
const keytar = require('keytar')
let logger = require('electron-log');
//const keytar = require('keytar-prebuild');
var testrunner;



var self = module.exports = {
    makeid: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 8; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    getToken: function (username, password) {
        return new Promise((resolve, reject) => {

            self.prepareOauthProcess(username, password).then((data) => {

                return self.createClient(data);

            }).then((data) => {

                return self.requestOauthCode(data);

            }).then((data) => {

                return self.approveOauthTransaction(data);

            }).then((data) => {

                return self.getOauthToken(data);

            }).then((data) => {

                return self.saveToken(data);

            })
                .catch(function (error) {

                    logger.error(error);


                })
        })

    },
    prepareOauthProcess: function (username, password) {
        return new Promise((resolve, reject) => {

            var params = {
                username: username,
                password: password,
                machinename: global['machineid'],
                id: self.makeid(),
                secret: self.makeid(),
                redirect_uri: "http://localhost:8083",
                authheader: 'Basic ' + new Buffer(username + ":" + password).toString('base64')
            }


            console.log(params)

            return resolve(params)

        })
    },
    createClient: function (data) {
        return new Promise((resolve, reject) => {


            //var url = "http://localhost:8083/authenticate/api/clients";

            var params = {
                name: data.compname,
                id: data.id,
                secret: data.secret
            }


            var options = {
                method: 'POST',
                uri: 'http://localhost:8083/authenticate/api/clients',
                form: params,
                headers: {
                    'Authorization': data.authheader
                }
            };

            request.post(options, function (e, r, body) {

                if (e) {
                    logger.error(e)
                    return reject(e);
                } else {
                    logger.debug(body);
                    //Returns output
                    return resolve(data);
                }

            })





        })

    },
    requestOauthCode: function (data) {
        return new Promise((resolve, reject) => {


            var url = "http://localhost:8083" + "/authenticate/oauth2/authorize?client_id=" + data.id + "&response_type=code&redirect_uri=" + "http://localhost:8083" + "&immediate=true";


            var options = {
                method: 'GET',
                uri: url,
                headers: {
                    'Authorization': data.authheader
                }
            };


            request(options, function (e, r, body) {

                if (e) {
                    logger.error(e)
                    return reject(e);
                } else {

                    data.transaction_id = JSON.parse(body).transaction_id;
                    logger.debug('The transaction_id', data.transaction_id);
                    //Returns output
                    return resolve(data);
                }

            })


        })
    },
    approveOauthTransaction: function (data) {
        return new Promise((resolve, reject) => {

            var url = "http://localhost:8083/authenticate/oauth2/authorize";

            var params = {
                transaction_id: data.transaction_id,
                allow: "Allow"
            }

            var options = {
                method: 'POST',
                uri: url,
                form: params,
                headers: {
                    'Authorization': data.authheader
                }
            };

            request(options, function (e, r, body) {

                // logger.error(r)
                if (e) {
                    logger.error(e)

                    return reject(e);
                } else {
                    //logger.debug(r);
                    data.code = r.headers.location;
                    //Returns output


                    function gup(name, url) {
                        if (!url) url = location.href;
                        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                        var regexS = "[\\?&]" + name + "=([^&#]*)";
                        var regex = new RegExp(regexS);
                        var results = regex.exec(url);
                        return results == null ? null : results[1];
                    }

                    var code = gup('code', r.headers.location)
                    data.code = code;
                    logger.debug('The Code', code);
                    return resolve(data);
                }

            });


        })

    },
    getOauthToken: function (data) {
        return new Promise((resolve, reject) => {


            var url = "http://localhost:8083/authenticate/oauth2/token";

            var params = {
                code: data.code,
                grant_type: "authorization_code",
                redirect_uri: data.redirect_uri
            }


            var options = {
                method: 'POST',
                uri: url,
                form: params,
                headers: {
                    'Authorization': 'Basic ' + new Buffer(data.id + ":" + data.secret).toString('base64')
                }
            };

            request(options, function (e, r, body) {

                // logger.error(r)
                if (e) {
                    logger.error(e)

                    return reject(e);
                } else {


                    //  keytar.setPassword('Nestegg', 'webservice', body.access_token.value)
                    data.access_token = body.access_token.value;
                    logger.info(body)
                    //Returns output


                    return resolve(data);
                }

            });



        })

    },
    saveToken: function (data) {
        return new Promise((resolve, reject) => {


            keytar.setPassword('Nestegg', 'webservice', data.access_token).then((result) => {


                return resolve(result);
            }).catch(function (error) {

                reject(error);
                logger.error(error);
            })


        })
    },
    getToken: function (service, account) {
        return new Promise((resolve, reject) => {


            keytar.getPassword(service, account).then((result) => {

                //Store in session

                return resolve(result);


            }).catch(function (error) {

                reject(error);
                logger.error(error);
            })


        })
    },
    CheckTokenValid: function (bearerToken) {
        return new Promise((resolve, reject) => {

            var url = "http://localhost:8083/api/helloworld";


            var options = {
                method: 'GET',
                uri: url,
                auth: {
                    bearer: bearerToken
                }
            };

            //Check if gettoken exists  - if not reject
            request.get(options, function (e, r, body) {

                if (e) {
                    logger.error(e)
                    return reject(e);
                } else {
                    logger.debug(body);
                    //Returns output
                    return resolve(bearerToken);
                }

            })

            //Check for internet connection

            //if exists attempt to ping server - if returned fail then delete token and reject

            //if ok then resolve



        })
    },
    checkInternetAccess: function () {
        return new Promise((resolve, reject) => {



            isOnline().then(online => {
                console.log(online);
                return resolve(result)
            }).catch(function (error) {

                return reject('No internet connection');
                logger.error(error);


            })


        })
    }
}



