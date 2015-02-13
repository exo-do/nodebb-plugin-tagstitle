"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');

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
    // En realidad no hace falta hookear esta funcion..
    callback(null, postContent);
  };


  tagsTitle.getTopicPrivileges = function (postContent, callback)
  {
    //console.log(postContent);
    
    var topicid = postContent.tid;
    var userid = postContent.uid;

    // Anadir las etiquetas que se quiera
    var etiquetas = ["+hd", "+18", "+nsfw", "+prv"];
    // condiciones para cada etiqueta..
    var condicionesEt = [ ( tagsTitle.postCount < 1 ), // +hd
                          ( tagsTitle.postCount < 1 ), // +18
                          ( tagsTitle.postCount < 1 ), // +nsfw
                          ( tagsTitle.postCount < 1 || tagsTitle.reputation < 10 ) // +prv
                        ];

    if(topicid)
    { // Si es para ver un hilo compruebo si puede acceder
      if(userid)
      { // Si el usuario esta logeado compruebo si puede ver el post segun las etiquetas
        var userdata = User.getUserData(postContent.uid, function(err,getUserData) {
        //Introducimos todos los datos del usuario en tagsTitle
          tagsTitle.postCount = getUserData.postcount;
          tagsTitle.reputation = getUserData.reputation;
        
          var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
            var topicTitle = topicData.title.toLowerCase();

            for(var i=0;i<etiquetas.length;i++)
            {
              if( (topicTitle.indexOf(etiquetas[i]) >= 0) && condicionesEt[i] )
              {
                postContent.read = false;
              }
            }
            
            callback(null, postContent);
            return;
          });
        });
      }
      else
      { // Si no esta logeado, miro si hay etiquetas, y si las hay directmente no entra
        var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
          var topicTitle = topicData.title.toLowerCase();

          for(var i=0;i<etiquetas.length;i++)
          {
            if( (topicTitle.indexOf(etiquetas[i]) >= 0) )
            {
              postContent.read = false;
              break;
            }
          }
          
          callback(null, postContent);
          return;
        });
      }
    }
  };

module.exports = tagsTitle;
