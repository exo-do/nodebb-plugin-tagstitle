# NodeBB Tags Title Plugin

Este plugin otorga la funcionalidad de atribuir características especiales a los temas creados por los usuarios mediante la escritura de una serie de tags concretos. Por ejemplo, para hacer un post privado podemos escribir +HD, para un post no apto para el trabajo podemos escribir +NSFW

Acepta mayúsculas, minúsculas y combinaciones de ambas. Las etiquetas incluidas por el momento son:

+HD : Usuario registrado y con 1 mensaje o más
+18 : Usuario registrado y con 1 mensaje o más
+NSFW : Usuario registrado y con 1 mensaje o más
+PRV : Usuario registrado y con una reputación de 10 punto o más.


##Funcionamiento y compatibilidad

El plugin está funcionando correctamente en la rama de NodeBB 0.6.X.

El plugin hace uso de elementos del core de NodeBB, concretamente "user.js"

El plugin hace uso de la plantilla topic-error.tpl, que es la que hay que editar y en la que aparecen los errores.

Compatible con la API


## Instalación
    
    Crea la carpeta "nodebb-plugin-tagstitle", introduce los archivos e introduce la carpeta  dentro de "node_modules"
    Ejecuta en la terminal "npm install"

## Problemas conocidos y características pendientes

Todavía hace falta realizar las redirecciones a las rutas definidas del error del topic.

##Como añadir una nueva etiqueta al plugin

Para añadir una nueva etiqueta al plugin copia y pega después de ''//Añade a partir de aquí las nuevas etiquetas adicionales''

El siguiente código:

    else if(topicTitle.indexOf('+etiqueta')  >= 0) {
      //Contiene la etiqueta +etiqueta
      if (userid <= 1 || tagsTitle.postCount  == 0 ) {
        //Redireccionar
      }
    }

Donde el nombre de la etiqueta es el que aparece después de index.Of
