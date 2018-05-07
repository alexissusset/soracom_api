'use strict'

/* Soracom API
*	var Soracom = require('./soracom');
*	var soracom = new Soracom({email: 'mail address',password:'password'});
*	var soracom = new Soracom({authKeyId: 'keyId',authKey:'secret'});
*	var soracom = new Soracom({userName:'user name',password:'password',operatorId:'Operator ID'}); // SAM User login
*/
module.exports = function(obj) {
	const https = require('https');
	const HOST = "api.soracom.io";
	const PATH = '/v1';
	var node = this;
	node.login = obj;
	node.session = {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		}
	};
	if (node.login.tokenTimeoutSeconds === undefined) {
		node.login.tokenTimeoutSeconds = 86400;
	}
	node.get = function(path,callback) {
		httpRequest('GET',path,function(err,res){
			callback(err,res);
		});
	};
	node.post = function(path, params,callback) {
		httpRequest('POST',path,params,function(err,res){
			callback(err,res);
		});
	};
	node.put = function(path, params,callback) {
		httpRequest('PUT',path,params,function(err,res){
			callback(err,res);
		});
	}
	node.delete = function(path, params,callback) {
		httpRequest('DELETE',path,params,function(err,res){
			callback(err,res);
		});
	}
	function getToken(callback) {
		var options = {
			host: HOST,
			path: PATH+'/auth',
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}
		var req = https.request(options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				var res = JSON.parse(chunk);
				try {
					node.session.headers["X-Soracom-API-Key"] = res.apiKey;
					node.session.operatorId = res.operatorId;
					node.session.userName = res.userName;
					node.session.headers["X-Soracom-Token"] = res.token;
					node.session.timeout = (new Date()).getTime() + node.login.tokenTimeoutSeconds;
					callback(null,node.session);
				} catch(e) {
					callback('login error.',null);
				}
			});
			req.on('error', (e) => {
				callback(e.message,null);
			});
		});
		req.write(JSON.stringify(node.login));
		req.end();
	}
	function checkToken(callback) {
		if (typeof node.session === "undefined" ) {
			if (node.session.timeout !== undefined) {
				if (node.session.timeout < (new Date()).getTime()){
					callback(null,true);
					return;
				}
			}
		}
		getToken(function(err,res){
			callback(err,res);
		});
	}
	function httpRequest(method,path,params,callback) {
		if(typeof params === 'function') { callback = params; }
		checkToken(function(err,res){
			if(err === null) {
				var options = {
					host: HOST,
					path: PATH+path,
					method: method,
					headers: node.session.headers
				};
				var req = https.request(options, (res) => {
					let data = '';
					res.setEncoding('utf8');
					res.on('data', (chunk) => {
						data += chunk;
					});
					res.on('end', () => {
						if(res.statusCode < 200 || res.statusCode > 299){
							// API Error
							callback(data,null);							
						}else{
							callback(null,data);
						}
					});
				}).on('error', (e) => {
					callback(e,null);
				});
				if(method !== 'GET') {
					if(typeof params !== 'function') {
						req.write(JSON.stringify(params));
					} else {
						req.write(JSON.stringify({}));
					}
				}
				req.end();
			} else {
				callback(err,null);
			}
		});
	}
};

