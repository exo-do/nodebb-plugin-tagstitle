"use strict";

var User = module.parent.require('./user');

var tagsTitle = {};

  tagsTitle.init = function(params, callback) {
    var middleware = params.middleware,
    controllers = params.controllers;
    controllers.getErrorPage = function (req, res, next) {
      //Renderiza la plantilla topic-error en el futuro enlace del foro //servidor.com/topicerror
      res.render('topic-error', {});
    };
    //Creamos las direcciones //servidor.com/topicerror mediante params.router.get
    params.router.get('/topicerror',middleware.buildHeader, controllers.getErrorPage);
    params.router.get('/api/topicerror', controllers.getErrorPage);
    callback();
  };

  tagsTitle.getTopic = function (postContent, callback) {
    //Obtenemos los datos del usuario
    var userid = postContent.uid;
    var userdata = User.getUserData(userid, function(err,getUserData) {
    //Introducimos todos los datos del usuario en tagsTitle
      tagsTitle.postCount = getUserData.postcount;
      tagsTitle.reputation = getUserData.reputation;
    });
    //Metemos en una variable el título en minúscula
    var topicTitle = postContent.title.toLowerCase();
    //Comprobamos si hay etiquetas insertadas por el usuario en el título
    if(topicTitle.indexOf('+hd')  >= 0) {
      //Contiene la etiqueta +HD
      if (userid <= 1 || tagsTitle.postCount  == 0 ) {
        //Redireccionar

    }
  }
    else if(topicTitle.indexOf('+18')  >= 0) {
      //Contiene la etiqueta +18
      if (userid <= 1 || tagsTitle.postCount  == 0 ) {
        //Redireccionar
      }
    }

    else if(topicTitle.indexOf('+prv')  >= 0) {
      //Contiene la etiqueta +PRV
      if (userid <= 1 || tagsTitle.reputation <= 10  ) {
        //Redireccionar
      }
    }
    else if(topicTitle.indexOf('+nsfw')  >= 0) {
      //Contiene la etiqueta +nsfw
      if (userid <= 1 || tagsTitle.postCount  == 0 ) {
        //Redireccionar
      }
    }
    //Añade a partir de aquí las nuevas etiquetas adicionales
    
    //Fin de las etiquetas adicionales
    callback(null, postContent);
  };
module.exports = tagsTitle;
