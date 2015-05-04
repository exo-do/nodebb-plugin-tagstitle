"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var db = module.parent.require('./database');
var Tags = module.parent.require('./topics/tags'),
    async = require('async');;

var tagsTitle = {};


// Usamos javascript para limpiar el error por defecto y poner solamente nuestro error
// con lo que nos interesa
tagsTitle.mostrarError = [  "<script>$('.alert.alert-danger').html('",
                            "');</script>" ];

// Anadir las etiquetas que se quiera (Solo etiquetas con restriccion para no entrar al hilo)
tagsTitle.etiquetasConRestriccion = ["+hd", "+18", "+nsfw", "+nsfl", "+gore","+prv"];

// condiciones para cada etiqueta.. (Deben indicarse en cada funcion en las que se usen para que tengan efecto)
tagsTitle.condicionesEt = [];

// Mensajes de error para cada etiqueta
tagsTitle.mensajeError = [  "<b>+hd</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+18</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+nsfw</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
					           "<b>+nsfl</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+gore</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+prv</b><br> Para ver este hilo debes tener mas de 100 mensajes publicados y estar registrado antes de que se crease este hilo" ];


// Etiquetas sin restriccion de acceso
// Para estas etiquetas no hay que poner ningun mensaje de error de acceso ni condiciones!
tagsTitle.etiquetasSinRestriccion = ["TemaSerio", "Plataforma", "Peña", "Tutorial", "Noticia", "Review", "Debate", "Encuesta", "Info", "Duda", "Chollo", "Importante"];



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

  tagsTitle.getTopicPrivileges = function (postContent, callback)
  {
    db.getSetMembers('topic:' + postContent.tid + ':tags', function(err,tags){
      // obtenemos los tags de nodebb para este topic
      // Compatibilidad con etiquetas de nodebb y etiquetas en el titulo
      //console.log(tags);
      var tagsStr = "";
      for(var i=0;i<tags.length;i++)
      { // Creamos un string con todas las tags
        tagsStr = tagsStr + "["+tags[i]+"]";
      }
    
      var topicid = postContent.tid;
      var userid = postContent.uid;

      if(topicid)
      { // Si es para ver un hilo compruebo si puede acceder
        if(userid)
        { // Si el usuario esta logeado compruebo si puede ver el post segun las etiquetas
          User.isAdministrator(userid, function(err,isAdmin) {
            if(isAdmin)
            { // Si es admin, lo dejo entrar
              return callback(null, postContent); 
            }
            
            var userdata = User.getUserData(userid, function(err,getUserData) {
              if(err)
              {
                return callback(err, postContent);
              }
              // console.log(getUserData);
              //Introducimos todos los datos del usuario en tagsTitle
              tagsTitle.postCount = getUserData.postcount;
              tagsTitle.reputation = getUserData.reputation;
              
              var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
                //console.log(topicData);
                if(err || !topicData)
                {
                  return callback(err, postContent);
                }
                // console.log(topicData);

                // condiciones para cada etiqueta con restricciones..
                tagsTitle.condicionesEt = [ ( tagsTitle.postCount < 1 ), // +hd
                                    ( tagsTitle.postCount < 1 ), // +18
                                    ( tagsTitle.postCount < 1 ), // +nsfw
                                    ( tagsTitle.postCount < 1 ), // +nsfl
                                    ( tagsTitle.postCount < 1 ), // +gore
                                    ( tagsTitle.postCount < 100 || (getUserData.joindate > topicData.timestamp) ) // +prv
                                  ];
                
                var topicTitle = topicData.title.toLowerCase();

                for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
                {
                  if( ( (topicTitle.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) || (tagsStr.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) ) && tagsTitle.condicionesEt[i] )
                  {
                    postContent.read = false;
                    callback(new Error(tagsTitle.mostrarError[0]+tagsTitle.mensajeError[i]+tagsTitle.mostrarError[1]), postContent);
                    return;
                  }
                }
                // Si llego aqui es que puede ver el hilo
                callback(null, postContent);
                return;
              });// Fin buscar topic
            }); // Fin buscar User
          }); // fin is admin
        }
        else
        { // Si no esta logeado, miro si hay etiquetas, y si las hay directmente no entra
          var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
            if(err || !topicData)
            {
              return callback(err, postContent);
            }

            var topicTitle = topicData.title.toLowerCase();

            for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
            {
              if( ( (topicTitle.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) || (tagsStr.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) ) )
              {
                postContent.read = false;
                callback(new Error(tagsTitle.mostrarError[0]+tagsTitle.mensajeError[i]+tagsTitle.mostrarError[1]), postContent);
                return;
              }
            }
            // Si llego aqui es que puede ver el hilo
            callback(null, postContent);
            return;
          }); // Fin buscar topic
        }
      }
    }); // Fin buscar tag en db
  };

  tagsTitle.topicSaved = function(topicData) {
    // Me viene tid y title -> Puedo modificar en la db las tags y anadirlas!

    var tid = topicData.tid;
    var titleOk = topicData.title;
    var title = topicData.title.toLowerCase().replace(/ /g, ""); // Quitamos espacios, EJ: tema serio = temaserio

    db.getSetMembers('topic:' + tid + ':tags', function(err,tags){
      // obtenemos los tags de nodebb para este topic
      var tagsToAdd = tags;
      var tagsStr = "";
      for(var i=0;i<tags.length;i++)
      { // Creamos un string con todas las tags que ya tiene
        tagsStr = tagsStr + "["+tags[i]+"]";
      }

      // Etiquetas con restricciones
      for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
      { 
        var actTagCapitalizada = tagsTitle.etiquetasConRestriccion[i];
        var actTag = tagsTitle.etiquetasConRestriccion[i].toLowerCase();
        var actTagCorchetes = "[" + actTagCapitalizada + "]";
        if( (title.indexOf(actTag) >= 0) && (tagsStr.indexOf(actTag) < 0) )
        { // Si en el titulo hay un tag y en los tags de node no, lo anado
          tagsToAdd.push(actTag);
          var re = new RegExp(regexFilter(actTag), 'ig');
          titleOk = titleOk.replace(re, actTagCapitalizada);
        }
        if(title.indexOf(actTag) < 0 && (tagsStr.indexOf(actTag) > -1) )
        {
          titleOk = titleOk + " " + actTagCapitalizada;
        }
      }

      // Etiquetas sin restricciones
      for(var i=0;i<tagsTitle.etiquetasSinRestriccion.length;i++)
      { 
        var actTagCapitalizada = tagsTitle.etiquetasSinRestriccion[i];
        var actTag = tagsTitle.etiquetasSinRestriccion[i].toLowerCase();
        var actTagCorchetes = "[" + actTagCapitalizada + "]";
        if( (title.indexOf(actTagCorchetes.toLowerCase()) >= 0) && (tagsStr.indexOf(actTag) < 0) )
        { // Si en el titulo hay un tag y en los tags de node no, lo anado
          tagsToAdd.push(actTag); // Reemplazando los [] para evitar problemas
          var re = new RegExp(regexFilter(actTag), 'ig');
          titleOk = titleOk.replace(re, actTagCapitalizada);
        }
        if(title.indexOf(actTagCorchetes.toLowerCase()) < 0 && (tagsStr.indexOf(actTag) > -1) )
        {
          titleOk =  actTagCorchetes + " " + titleOk;
        }
      }

      // Anadimos las tags que tengamos que anadir
      Topic.updateTags(tid, tagsToAdd, function(err, rr){
        Topic.setTopicField(tid, "title", titleOk);
      });
    });

  };

  var regexFilter = function(str)
  {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  };

  tagsTitle.canWatchTopic = function(uid, tid, callback){
    db.getSetMembers('topic:' + tid + ':tags', function(err,tags){
      // obtenemos los tags de nodebb para este topic
      // Compatibilidad con etiquetas de nodebb y etiquetas en el titulo
      //console.log(tags);
      var tagsStr = "";
      for(var i=0;i<tags.length;i++)
      { // Creamos un string con todas las tags
        tagsStr = tagsStr + "["+tags[i]+"]";
      }
    
      var topicid = tid;
      var userid = uid;
      var postContent = {};

      if(topicid)
      { // Si es para ver un hilo compruebo si puede acceder
        if(userid)
        { // Si el usuario esta logeado compruebo si puede ver el post segun las etiquetas
          var userdata = User.getUserData(userid, function(err,getUserData) {
            if(err)
            {
              return callback("error", false);
            }
          //Introducimos todos los datos del usuario en tagsTitle
            tagsTitle.postCount = getUserData.postcount;
            tagsTitle.reputation = getUserData.reputation;

            // condiciones para cada etiqueta con restricciones..
            tagsTitle.condicionesEt = [ ( tagsTitle.postCount < 1 ), // +hd
                                  ( tagsTitle.postCount < 1 ), // +18
                                  ( tagsTitle.postCount < 1 ), // +nsfw
                  ( tagsTitle.postCount < 1 ), // +nsfl
                                  ( tagsTitle.postCount < 1 ), // +gore
                                  ( tagsTitle.postCount < 100 ) // +prv
                                ];
            
            var topicData = Topic.getTopicData(tid, function(err,topicData) {
              //console.log(topicData);
              if(err || !topicData)
              {
                return callback("error", false);
              }
              
              var topicTitle = topicData.title.toLowerCase();

              for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
              {
                if( ( (topicTitle.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) || (tagsStr.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) ) && tagsTitle.condicionesEt[i] )
                {
                  return callback("error", false);
                }
              }
              // Si llego aqui es que puede ver el hilo
              return callback(null, true);
            });// Fin buscar topic
          }); // Fin buscar User
        }
        else
        { // Si no esta logeado, miro si hay etiquetas, y si las hay directmente no entra
          var topicData = Topic.getTopicData(tid, function(err,topicData) {
            var topicTitle = topicData.title.toLowerCase();

            for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
            {
              if( ( (topicTitle.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) || (tagsStr.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) ) )
              {
                postContent.read = false;
                return callback("error", false);
              }
            }
            // Si llego aqui es que puede ver el hilo
            return callback(null, true);
          }); // Fin buscar topic
        }
      }
    }); // Fin buscar tag en db
  };


module.exports = tagsTitle;
