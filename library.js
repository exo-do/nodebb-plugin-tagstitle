"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var db = module.parent.require('./database');
var Tags = module.parent.require('./topics/tags'),
    async = require('async');;

var tagsTitle = {};

var errorController = {};
errorController.getErrorPage = function (req, res, next, data) {
      //Will render the new template.
      res.render('topic-error', data);
    };

  tagsTitle.init = function(params, callback) {
    var middleware = params.middleware,
    controllers = params.controllers;
    

    
    //Regisrter routes for the new template with params.router.get
    params.router.get('/topicerror',middleware.buildHeader, errorController.getErrorPage);
    params.router.get('/api/topicerror', errorController.getErrorPage);
    callback();
  };

// filter:privileges.topics.get
tagsTitle.privilegesTopicsGet = function(privileges, callback) {
	var thing = true;
  //Dummy asignment for the redirect url.
	if (thing){
    privileges.redirectUrl = '/users';
  }
	callback(null, privileges);
};

// filter:topic.build
tagsTitle.topicBuild = function (data, callback) {
	if (data.templateData.privileges.redirectUrl) {
		if (data.templateData.privileges.redirectUrl === '/users') {
      var errorMessage = {};
      errorMessage.message = 'Este es mi error bitch';
      errorMessage.errorType = 'Este hilo es +prv.';
      errorController.getErrorPage(data.req,data.res,data.next,errorMessage);
		}else{
			callback(null, data);
		}
	}else{
		callback(null, data);
	}
};



module.exports = tagsTitle;
