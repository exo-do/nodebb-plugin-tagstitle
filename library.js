"use strict";

var User = module.parent.require('./user');
var Topic = module.parent.require('./topics');
var db = module.parent.require('./database');
var Tags = module.parent.require('./topics/tags');

var tagsTitle = {};


// Usamos javascript para limpiar el error por defecto y poner solamente nuestro error
// con lo que nos interesa
tagsTitle.mostrarError = [  "<script>$('.alert.alert-danger').html('",
                            "');</script>" ];

// Anadir las etiquetas que se quiera (Solo etiquetas con restriccion para no entrar al hilo)
tagsTitle.etiquetasConRestriccion = ["+hd", "+18", "+nsfw", "+prv"];

// condiciones para cada etiqueta.. (Deben indicarse en cada funcion en las que se usen para que tengan efecto)
tagsTitle.condicionesEt = [];

// Mensajes de error para cada etiqueta
tagsTitle.mensajeError = [  "<b>+hd</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+18</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+nsfw</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado",
                      "<b>+prv</b><br> Para ver este hilo debes tener al menos 1 mensaje publicado y tener mas de 10 puntos de reputacion" ];


// Etiquetas sin restriccion de acceso
// Para estas etiquetas no hay que poner ningun mensaje de error de acceso ni condiciones!
tagsTitle.etiquetasSinRestriccion = ["[temaserio]", "[plataforma]", "[gore]"];



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

    // condiciones para cada etiqueta con restricciones..
    tagsTitle.condicionesEt = [ ( tagsTitle.postCount < 1 ), // +hd
                          ( tagsTitle.postCount < 1 ), // +18
                          ( tagsTitle.postCount < 1 ), // +nsfw
                          ( tagsTitle.postCount < 1 || tagsTitle.reputation < 10 ) // +prv
                        ];


    db.getSetMembers('topic:' + postContent.tid + ':tags', function(err,tags){
      // obtenemos los tags de nodebb para este topic
      // Compatibilidad con etiquetas de nodebb y etiquetas en el titulo
      console.log(tags);
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
          var userdata = User.getUserData(userid, function(err,getUserData) {
          //Introducimos todos los datos del usuario en tagsTitle
            tagsTitle.postCount = getUserData.postcount;
            tagsTitle.reputation = getUserData.reputation;
            
            var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
              //console.log(topicData);
              
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
        }
        else
        { // Si no esta logeado, miro si hay etiquetas, y si las hay directmente no entra
          var topicData = Topic.getTopicData(postContent.tid, function(err,topicData) {
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

  tagsTitle.topicSaved = function(topicData, callback) {
    // Me viene tid y title -> Puedo modificar en la db las tags y anadirlas!

    var tid = topicData.tid;
    var title = topicData.title.toLowerCase();

    db.getSetMembers('topic:' + tid + ':tags', function(err,tags){
      // obtenemos los tags de nodebb para este topic
      console.log(tags);
      var tagsToAdd = [];
      var tagsStr = "";
      for(var i=0;i<tags.length;i++)
      { // Creamos un string con todas las tags que ya tiene
        tagsStr = tagsStr + "["+tags[i]+"]";
      }
      // console.log("tagsStr: "+tagsStr);

      // Etiquetas con restricciones
      for(var i=0;i<tagsTitle.etiquetasConRestriccion.length;i++)
      {
        if( (title.indexOf(tagsTitle.etiquetasConRestriccion[i]) >= 0) && (tagsStr.indexOf(tagsTitle.etiquetasConRestriccion[i]) < 0) )
        { // Si en el titulo hay un tag y en los tags de node no, lo anado
          tagsToAdd.push(tagsTitle.etiquetasConRestriccion[i]);
        }
      }

      // Etiquetas sin restricciones
      for(var i=0;i<tagsTitle.etiquetasSinRestriccion.length;i++)
      {
        if( (title.indexOf(tagsTitle.etiquetasSinRestriccion[i]) >= 0) && (tagsStr.indexOf(tagsTitle.etiquetasSinRestriccion[i]) < 0) )
        { // Si en el titulo hay un tag y en los tags de node no, lo anado
          tagsToAdd.push(tagsTitle.etiquetasSinRestriccion[i].replace(/\[|\]/g, "")); // Reemplazando los [] para evitar problemas
        }
      }

      // Anadimos las tags que tengamos que anadir
      Topic.createTags(tagsToAdd, tid, topicData.timestamp);
    });



  };

module.exports = tagsTitle;
