"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var db = module.parent.require('./database');
var Tags = module.parent.require('./topics/tags'),
    async = require('async');;

var tagsTitle = {};



  /*tagsTitle.init = function(params, callback) {
    var middleware = params.middleware,
    controllers = params.controllers;
    
    controllers.getErrorPage = function (req, res, next) {
      //Will render the new template.
      res.render('topic-error', {});
    };
    //Regisrter routes for the new template with params.router.get
    params.router.get('/topicerror',middleware.buildHeader, controllers.getErrorPage);
    params.router.get('/api/topicerror', controllers.getErrorPage);
    callback();
  };*/

// filter:privileges.topics.get
tagsTitle.privilegesTopicsGet = function(privileges, callback) {
	var thing = true;
  //Dummy asignment for the redirect url.
	if (thing){
    privileges.redirectUrl = 'http://localhost:4567/users';
  }
	callback(null, privileges);
};

// filter:topic.build
tagsTitle.topicBuild = function (data, callback) {
	if (data.templateData.privileges.redirectUrl) {
    //Execute redirect to the new page.
		data.res.redirect(data.templateData.privileges.redirectUrl);
    //data.template.name= 'topic-error';
	}else{
		callback(null, data);
	}
};



module.exports = tagsTitle;
