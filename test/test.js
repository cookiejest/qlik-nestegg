
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



////////////////TEST MEASURE OBJECT CREATE

describe('TEST Create Measure Object', function(){

it('min max both valid expected value true', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 200, "maxvalue": 10000  }
    }

    var expectedresult = true;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
        
        expect(data).to.equal(expectedresult);

    });
});



it('min only valid expected value true', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300 }
    }

    var expectedresult = true;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){

        expect(data).to.equal(expectedresult);

    });
});

it('max only valid expected value true', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "maxvalue": 10000 }
    }

    var expectedresult = true;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('max (valid) and min (invalid) expected value false', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 9100, "maxvalue": 10000 }
    }

    var expectedresult = false;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
        
        expect(data).to.equal(expectedresult);

    });
});



it('max (invalid) and min (invalid) expected value false', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 9200, "maxvalue": 9400 }
    }

    var expectedresult = false;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
        
        expect(data).to.equal(expectedresult);

    });
});


it('max only (invalid) expected value false', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "maxvalue": 600 }
    }

    var expectedresult = false;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
       
        expect(data).to.equal(expectedresult);

    });
});


it('min only (invalid) expected value false', function() { // no done

    var individualMeasureData = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measure": { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 9300 }
    }

    var expectedresult = false;

    // note the return
    return qlikCommands.createMeasureObject(testdoc , individualMeasureData).then(function(data){
        
        expect(data).to.equal(expectedresult);

    });
});

});


describe('TEST Check Session Object', function(){

//Test multi measure triggercheck
it('Two Dimensions, One Measure, Min and Max Value, expected result: True', function() { // no done


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


//Test multi measure triggercheck
it('Two Dimensions, One Measure, Min (valid) and Max (invalid) Value, expected result: False', function() { // no done


    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [{ "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 200, "maxvalue": 9000  }]
    }
    
    var expectedresult = false;
    // note the return
    return qlikCommands.checkSessionObject(testdoc,alerttriggerdata).then(function(data){

        expect(data).to.equal(expectedresult);

    });// no catch, it'll figure it out since the promise is rejected
});


//Test multi measure triggercheck
it('Two Dimensions, TWO Measures, both Min (valid) and Max (valid) Value, expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
            { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 100 , "maxvalue": 9200  },
        { "expressionvalue": "Sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.4, "maxvalue": 0.8  }
    ]
    }
    
    var expectedresult = true;
    // note the return
    return qlikCommands.checkSessionObject(testdoc,alerttriggerdata).then(function(data){

        expect(data).to.equal(expectedresult);

    });// no catch, it'll figure it out since the promise is rejected
});


//Test multi measure triggercheck
it('Two Dimensions, TWO Measures, first Min and max valid, second min (valid), max (invalid)  Value, expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
            { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 100 , "maxvalue": 9200  },
        { "expressionvalue": "Sum([Sales Margin Amount])/Sum([Sales Amount])", "minvalue": 0.2, "maxvalue": 0.3  }
    ]
    }
    
    var expectedresult = false;
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
       // console.log('Result: ', data)
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
        //console.log('Result: ', data)
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
        //console.log('Result: ', data)
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
       // console.log('Result: ', data)
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
      //  console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});



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
        //console.log('Result: ', data)
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
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});

it('Two Dimensions, Three Measure with ranges MINMAX (valid), expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 7200  }, //should fail
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300, "maxvalue": 10000  }, //should fail
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "minvalue": 0.3, "maxvalue": 0.9  } //should fail
    ]
    }


    var expectedresult = true;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('Two Dimensions, Three Measure with ranges MINMAX (one valid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 3200  }, //should fail
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300, "maxvalue": 4000  }, //should fail
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "minvalue": 0.3, "maxvalue": 0.9  } //should fail
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('Two Dimensions, Three Measure with ranges MINMAX (one invalid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 3200  }, //should fail
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300, "maxvalue": 4000  }, //should fail
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "minvalue": 0.3, "maxvalue": 0.9  } //should fail
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('Two Dimensions, Three Measure with mixed ranges of minmax and min (one invalid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 3200  }, //should fail
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300  }, //should pass
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "minvalue": 0.3, "maxvalue": 0.9  } //should pass
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});


it('Two Dimensions, Three Measure with mixed ranges of minmax and min or max (all valid), expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [{ "fieldname": "Product Group Desc", "value": "Beverages" }, { "fieldname": "Sales Rep Name", "value": "Amanda Honda" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 7200  }, //should pass
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300  }, //should pass
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "maxvalue": 0.9  } //should pass
    ]
    }


    var expectedresult = true;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });
});



it('Three Dimensions, Three Measure with mixed ranges of minmax and min or max (all valid), expected result: true', function() { // no done

    var alerttriggerdata = {
        "dimensions": [
            { "fieldname": "Customer", "value": "Heurikon" }, 
            { "fieldname": "Sales Rep Name", "value": "Bima Malek" }, 
            { "fieldname": "Product Group Desc", "value": "Canned Foods" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 7200  }, //should pass
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 300  }, //should pass
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "maxvalue": 0.9  } //should pass
    ]
    }


    var expectedresult = true;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });


});



it('Three Dimensions, Three Measure with mixed ranges of minmax and min or max (one invalid), expected result: false', function() { // no done

    var alerttriggerdata = {
        "dimensions": [
            { "fieldname": "Customer", "value": "Heurikon" }, 
            { "fieldname": "Sales Rep Name", "value": "Bima Malek" }, 
            { "fieldname": "Product Group Desc", "value": "Canned Foods" }],
        "measures": [
        { "expressionvalue": "sum([YTD Sales Margin Amount])", "minvalue": 500, "maxvalue": 7200  }, //should pass
        { "expressionvalue": "sum([YTD Sales Amount])", "minvalue": 2000  }, //should fail
        { "expressionvalue": "sum([YTD Sales Margin Amount])/Sum([YTD Sales Amount])", "maxvalue": 0.9  } //should pass
    ]
    }


    var expectedresult = false;

    // note the return
    return qlikCommands.checkSessionObject(testdoc ,alerttriggerdata).then(function(data){
        //console.log('Result: ', data)
        expect(data).to.equal(expectedresult);

    });

    
});


})