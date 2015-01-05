"use strict";
var User = module.parent.require('./user');

var tagsTitle = {};
	tagsTitle.getTopic = function (postContent, callback) {

    //Obtenemos los datos del usuario

		var userid = postContent.uid;
    var userdata = User.getUserData(userid, function(err,getUserData) {
       //Introducimos todos los datos del usuario en tagsTitle
       tagsTitle.postCount = getUserData['postcount'];
       tagsTitle.reputation = getUserData['reputation'];
    });

  //Metemos en una variable el título en minúscula

 	var topicTitle = postContent['title'].toLowerCase();

  //Comprobamos si hay etiquetas insertadas por el usuario en el título

    if(topicTitle.indexOf('hd')  >= 0) {
      //Contiene la etiqueta +HD
      if (userid > 0 & tagsTitle.postCount  > 0 ) {
      //No hacemos nada
});
      }
      else {
      //Redireccionar

      }
    }
    else if(topicTitle.indexOf('18')  >= 0) {
      //Contiene la etiqueta +18
      if (userid > 0 & tagsTitle.postCount  > 0 ) {
      //No hacemos nada

      }
      else {
      //Redireccionar
      }
    }

    else if(topicTitle.indexOf('prv')  >= 0) {
      //Contiene la etiqueta +PRV
            if (userid > 0 & tagsTitle.reputation > 10  ) {
      //No hacemos nada

      }
      else {
      //Redireccionar
      }
    }
    else if(topicTitle.indexOf('nsfw')  >= 0) {
      //Contiene la etiqueta +nsfw
            if (userid > 0 & tagsTitle.postCount  > 0 ) {
      //No hacemos nada

      }
      else {
      //Redireccionar
      }
    }
    else {
      //No contiene nada
    }
  //Dejamos los datos tal cual están
  console.log(tagsTitle.postCount);
	postContent = postContent;
	callback(null, postContent);
	};

module.exports = tagsTitle;
