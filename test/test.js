
var assert = require('assert');
const path = require('path')
const url = require('url')
const WebSocket = require('ws');
const fs = require('fs');
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');
//var senseUtilities = require('enigma.js/sense-utilities');
var readline = require('readline');
let qlikCommands = require('../controllers/qlikCommands')
var expect = require('expect.js');

var testdoc = 'C:\\Users\\adamc\\Documents\\Qlik\\Sense\\Apps\\Consumer Sales.qvf';

/*
//ONE MEASURE TESTS
it(' Two Dimensions, One Measure, Min and Max Value, expected result: True', function() { // no done


    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 200, "maxvalue": 10000  }]
    }
    
    var expectedresult = true;
    // note the return
    return qlikCommands.checkSessionObject(testdoc,alerttriggerdata).then(function(data){

        expect(data).to.equal(expectedresult);

    });// no catch, it'll figure it out since the promise is rejected
});



it('Two Dimensions, One Measure, Min Value Only, expected result: True', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 500}]
    }
    
    var expectedresult = true;
    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){

        expect(data).to.equal(expectedresult);

    });// no catch, it'll figure it out since the promise is rejected
});


it('Two Dimensions, One Measure, Max Value Only, expected result: True', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "maxvalue": 10000  }]
    }

    var expectedresult = true;
    

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});




it('Two Dimensions, One Measure, Min and Max Value, expected result: False', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 200, "maxvalue": 800  }]
    }
    

    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});



it('Two Dimensions, One Measure, Min Value Only, expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 9100}]
    }

    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('Two Dimensions, One Measure, Max Value Only, expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "maxvalue": 600  }]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


//TWO MEASURE TESTS


it('Two Dimensions, TWO Measures with ranges (first valid, second invalid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
            { "expressionvalue": "sum([YTD Sales Amount])", "maxvalue": 1200  },
        { "expressionvalue": "Sum([Sales Margin Amount])/Sum([Sales Amount])", "maxvalue": 0.2  }
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});
*/

/*
it('Two Dimensions, One different Measure with ranges MINMAX (valid), expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.1, "maxvalue": 0.7  } //should pass
    ]
    }


    var expectedresult = true;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});

it('Two Dimensions, One different Measure with ranges MINMAX (invalid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.1, "maxvalue": 0.3  } //should fail
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});
*/

it('Two Dimensions, TWO Measures with ranges MINMAX (first valid, second valid), expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
            { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300, "maxvalue": 1200  }, //should pass
        { "expressionvalue": "sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.1, "maxvalue": 0.7  } //should pass
    ]
    }


    var expectedresult = true;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});



            //TEST: Two Dimensions, TWO Measures with ranges, expected result: False   

            /*
            var alerttriggerdata = {
                "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
                "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300 }, 
                { "expressionvalue": "Sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.7, "maxvalue": 0.8 }]
            }            
            */