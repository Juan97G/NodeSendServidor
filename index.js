// IMPORTAR EXPRESS
const express = require("express");

// Importar funcion para conectar base de datos
const conectarDB = require('./config/db');

// Importar CORS
const cors = require('cors');

// CREAR EL SERVIDOR
const app = express();

// Habilitar carpeta pública para descargas de archivos
app.use( express.static('uploads') );

// Habilitar CORS
app.use(cors());

// Conectar a la base de datos
conectarDB();

// Asignar el puerto de la App
const port = process.env.PORT || 4000;

// Habilitar leer los valores de un body en formato JSON
app.use(express.json());


/****** RUTAS DE LA APP ******/
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));
/****************************/


// Arrancar la App
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})
