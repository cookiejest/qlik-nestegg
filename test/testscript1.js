

let w0w = require(global['rootPath'] + '/controllers/qlikCommands');

var expect = require(global['rootPath'] + '/node_modules/expect.js');

let qlikDoc = 'C:\\Users\\adamc\\Documents\\Qlik\\Sense\\Apps\\Consumer Sales.qvf';


it('My First Test', function () {

	var testcase = {
		"dimensions": [{
			"fieldname": "Product Group Desc",
			"value": "Beverages"
		},
		{
			"fieldname": "Sales Rep Name",
			"value": "Amanda Honda"
		}
		],
		"measures": [{
			"expressionvalue": "sum([YTD Sales Amount])",
			"minvalue": 100,
			"maxvalue": 990000
		}]
	}

	return w0w.inRange(qlikDoc, testcase).then(function (data) {

		expect(data).to.equal(true);

	})


});

