
const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');


var moment = require('moment');
var request = require('request');


let logger = require('electron-log');
var testrunner;

var self = module.exports = {
    makeid: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 8; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    prepareOauthProcess: function (username, password) {
        return new Promise((resolve, reject) => {

            var params = {
                username: username,
                password: password,
                machinename: global['machineid'],
                id: self.makeid(),
                secret: self.makeid(),
                redirect_uri: "http://localhost:8083"
            }

            console.log(params)

            return resolve(params)

        })
    },
    createClient: function (data) {
        return new Promise((resolve, reject) => {


            var url = "http://localhost:8083/authenticate/api/clients";


            var params = {
                name: data.compname,
                id: data.temppublickey,
                secret: data.tempsecretkey
            }



        })

    },
    requestOauthCode: function (data) {
        return new Promise((resolve, reject) => {




        })
    },
    approveOauthTransaction: function (data) {
        return new Promise((resolve, reject) => {




        })

    },
    getOauthToken: function (data) {
        return new Promise((resolve, reject) => {



        })

    },
    storeOauthToken: function (data) {
        return new Promise((resolve, reject) => {


        })

    }


}