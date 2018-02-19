/**
 * @module models/utilities/Enigma
 * @param {object} config - The configuration for host, database name, username and password
 * @description
 * Connect to the Engine API with Enigma.js
*/

const logger = require('./Logger');
const enigma = require('enigma.js');
const WebSocket = require('ws');
// const path = require('path');
// const fs = require('fs');
// const jwt = require('jsonwebtoken');
const schema = require('enigma.js/schemas/12.20.0.json');

const Enigma = class {
	constructor(input) {
		this._input = {
			host: (input.host) ? input.host : 'localhost',
			appId: (input.appId) ? String(input.appId) : false,
			expr: (input.expr) ? String(input.expr) : false,
			userDirectory: (input.userDirectory) ? String(input.userDirectory) : '',
			userId: (input.userId) ? String(input.userId) : ''
		};
		this.session = null;
		this.global = null;
		this.app = null;
	}	
	async connect() {
		try {
			this.session = enigma.create({
				schema,
				url: (this._input.appId) ? `wss://${this._input.host}/app/${this._input.appId}` : `wss://${this._input.host}/app/engineData`,
				createSocket: url => new WebSocket(url)
			});
			this.global = await this.session.open();
			logger.log(`Connection openned: `, { model: `Enigma` });
			if (this._input.appId) {
				this.app = await this.global.openDoc(this._input.appId);
			}
			return true;
		}
		catch (error) {
			logger.info(`error: ${error}`, { model: `models/webapps/Type::listing` });
			return error;
		}
	}
	disconnect() {
		if (this.session) {
			this.session.close();
			this.clients = [];
			logger.log(`Connection closed: `, { model: `Enigma` });
		}
	}
	async getDocList() {
		try {
			let list = await this.global.getDocList();
			const apps = [];
			for (let n of list) {
				apps.push({
					'title': (n.qTitle || n.qDocName),
					'id': n.qDocId,
					'thumb': n.qThumbnail.qUrl
				});
			}
			logger.log(`Apps on this Engine that the configured user can open: ${apps}`, { model: `Enigma` });
			return apps;
		}
		catch (error) {
			logger.info(`error: ${error}`, { model: `models/utilities/Enigma::getDocList()` });
			return error;
		}
	}
	async kpiMulti(exprs) {
		try {
			await this.connect();
			let results = [];
			for (let expr of exprs) {
				let result = await this.getHyperCube([], [expr], 1);
				results.push(result[0]);
			}
			return results;
		}
		catch (error) {
			logger.error(`error: ${JSON.stringify(error)}`, { model: `Enigma::kpiMulti()` });
		}
	}
	async kpi(expr) {
		try {
			await this.connect();
			let result = await this.getHyperCube([], [expr], 1);
			return result;
		}
		catch (error) {
			logger.error(`error: ${JSON.stringify(error)}`, { model: `Enigma::kpi()` });
		}
	}
	getHyperCube(dimensions, measures, limit) {
		return new Promise((resolve, reject) => {
			let qDimensions = [],
				qMeasures = [];
			if (dimensions.length) {
				for (let value of dimensions) {
					qDimensions.push({
						"qLibraryId": "",
						"qNullSuppression": false,
						qDef: {
							qGrouping: "N",
							qFieldDefs: [value],
							"qFieldLabels": [""]
						}
					});
				}
			}
			if (measures.length) {
				for (let value of measures) {
					qMeasures.push({
						qDef: {
							"qLabel": "",
							"qGrouping": "N",
							"qDef": value
						}
					});
				}
			}
			let obj = {
				"qInfo": {
					"qId": "",
					"qType": "HyperCube"
				},
				"qHyperCubeDef": {
					"qDimensions": qDimensions,
					"qMeasures": qMeasures,
					"qInitialDataFetch": [
						{
							"qTop": 0,
							"qLeft": 0,
							"qHeight": (limit) ? limit : 50, // Limit Results
							"qWidth": 20 // Total Columns
						}
					]
				}
			};
			this.app.createSessionObject(obj).then(function (list) {
				list.getLayout().then(function (layout) {
					resolve(layout.qHyperCube.qDataPages[0].qMatrix);
				});
			})
				.catch((error) => {
					logger.error(`error: ${JSON.stringify(error)}`, { model: `Enigma::getHyperCube()` });
					reject(error);
				});
		});
	}
};

module.exports = Enigma;