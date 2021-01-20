// IMPORTAR EXPRESS Y SU ROUTING
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importar el middleware de autenticación
const archivosController = require('../controllers/archivosController'); // Importar el controller


router.post("/",
    auth,
    archivosController.subirArchivo
);


router.get("/:archivo",
    archivosController.descargar,
    archivosController.eliminarArchivo
)


module.exports = router;
