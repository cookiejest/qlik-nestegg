
const electron = require('electron')
const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const { session } = electron;

const isOnline = require('is-online');
var moment = require('moment');
var request = require('request');
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
    gup: function (name, url) {
        //Get GET params from URL
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    },
    generateToken: function (username, password) {
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

            }).then(() => {
                logger.debug('All Done!');
                return resolve();
            })
                .catch(function (error) {

                    reject(error);
                    logger.error(error);


                })
        })

    },
    checkAuth: function () {
        return new Promise((resolve, reject) => {
            //Check internet access
            self.checkInternetAccess().then(() => {

                return self.getToken('Nestegg', 'webservice')
            }).then((passwordresult) => {

                return self.checkTokenValid(passwordresult)

            }).then((result) => {

                console.log('Final Outcome', JSON.parse(result))

                var result = JSON.parse(result);

                if (result.message == 'You are connected! Great Job.') {

                    return resolve();

                } else {

                    reject(result.message)

                }

                //Redirect to user login.

            }).catch(function (error) {
                reject(error);
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


            var url = global['config'].webservice + "/authenticate/api/clients";

            var params = {
                name: data.machinename,
                id: data.id,
                secret: data.secret
            }


            var options = {
                method: 'POST',
                uri: url,
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

                    if (body == 'Unauthorized') {

                        return reject(body);

                    } else if (body.codeName == "DuplicateKey") {

                        return reject("Machine already registered.");

                    } else {


                        logger.debug(body);
                        //Returns output
                        return resolve(data);

                    }

                }

            })





        })

    },
    requestOauthCode: function (data) {
        return new Promise((resolve, reject) => {


            var url = global['config'].webservice + "/authenticate/oauth2/authorize?client_id=" + data.id + "&response_type=code&redirect_uri=" + "http://localhost:8083" + "&immediate=true";


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

                    logger.debug('The transaction_id', data.transaction_id);
                    data.transaction_id = JSON.parse(body).transaction_id;

                    //Returns output
                    return resolve(data);
                }

            })


        })
    },
    approveOauthTransaction: function (data) {
        return new Promise((resolve, reject) => {

            var url = global['config'].webservice +"/authenticate/oauth2/authorize";

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



                    var code = self.gup('code', r.headers.location)
                    data.code = code;
                    logger.debug('The Code', code);
                    return resolve(data);
                }

            });


        })

    },
    getOauthToken: function (data) {
        return new Promise((resolve, reject) => {


            var url = global['config'].webservice + "/authenticate/oauth2/token";

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

                    if (body == 'Unauthorized') {
                        return reject(body)
                    } else {
                        //  keytar.setPassword('Nestegg', 'webservice', body.access_token.value)
                        logger.debug('THE BODY getoauthtoken', body)
                        data.access_token = JSON.parse(body).access_token.value;

                        //Returns output


                        return resolve(data);
                    }
                }
            });



        })

    },
    saveToken: function (data) {
        return new Promise((resolve, reject) => {


            logger.debug('Save token Data', data);

            keytar.setPassword('Nestegg', 'webservice', data.access_token).then((result) => {
                resolve('Complete');

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
                logger.debug('Get password val', result)

                if (result == null) {

                    return reject({ message: "No token exists." });
                } else {

                    logger.debug('Get password val', result)
                    var passwordkey = result;
                    return resolve(passwordkey);


                }


            }).catch(function (error) {

                reject(error);
                logger.error(error);
            })



        })
    },
    checkTokenValid: function (bearerToken) {
        return new Promise((resolve, reject) => {

            var url = global['config'].webservice + "/api/helloworld";
            logger.debug('bearer token is', bearerToken)

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

                    logger.debug('THE BODY', body);

                    if (body == 'Unauthorized') {
                        return reject('Token not valid.')

                    } else {

                        //Returns output
                        return resolve(body);
                    }
                }

            })

            //Check for internet connection

            //if exists attempt to ping server - if returned fail then delete token and reject

            //if ok then resolve



        })
    },
    checkInternetAccess: function () {
        return new Promise((resolve, reject) => {



            isOnline().then((online) => {

                if (online == true) {
                    return resolve(online)
                } else {
                    return reject('No Internet Connection')
                }


            }).catch(function (error) {

                logger.error('The error', error);

                return reject(error);



            })


        })
    }
}



