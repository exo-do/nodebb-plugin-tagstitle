# NodeBB Tags Title Plugin

Este plugin otorga la funcionalidad de atribuir características especiales a los temas creados por los usuarios mediante la escritura de una serie de tags concretos. Por ejemplo, para hacer un post privado podemos escribir +HD, para un post no apto para el trabajo podemos escribir +NSFW

Acepta mayúsculas, minúsculas y combinaciones de ambas. Las etiquetas incluidas por el momento son:

+HD : Usuario registrado y con 1 mensaje o más
+18 : Usuario registrado y con 1 mensaje o más
+NSFW : Usuario registrado y con 1 mensaje o más
+PRV : Usuario registrado y con una reputación de 10 punto o más.


##Funcionamiento y compatibilidad

El plugin está funcionando correctamente en la rama de NodeBB 0.6.X.

El plugin hace uso de elementos del core de NodeBB, concretamente "user.js", "topics.js" y "db.js"

Se comprueba si un usuario tiene acceso al topic segun las condiciones de la etiqueta. Si no cumple los requisitos, se pone a falso el privilegio de lectura.

Ademas se pueden añadir otras etiquetas que no tengas restriccion (temaserio, plataforma..) y automaticamente se añadiran a las etiquetas nativas de nodebb (tambien las etiquetas con restricciones se añadiran automaticamente si solamente las pones en el nombre del topic)

- Compatible con la API


## Instalación
    
    Crea la carpeta "nodebb-plugin-tagstitle", introduce los archivos e introduce la carpeta  dentro de "node_modules"
    Ejecuta en la terminal "npm install"

## Problemas conocidos y características pendientes

- Fijar las etiquetas como se quiera

##Como añadir una nueva etiqueta al plugin

Para añadir una nueva etiqueta al plugin:

En el fichero "library.js", añade la etiqueta en el array "etiquetas" y su condicion en el array "condicionesEt". La etiqueta y sus condiciones deben coincidir en la misma posicion. Si la etiqueta es tercera en el array de etiquetas su condicion(es) deben ser tercera(s) en el de condiciones.

Tambien debe indicarse el correspondiente mensaje de error en el array de mensajes de error.

Las etiquetas sin restricciones no necesitan ningun mensaje de error ni condiciones.
