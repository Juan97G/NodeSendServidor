const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importar el middleware de autenticación
const enlacesController = require('../controllers/enlacesController'); // Importar el controller
const { check } = require('express-validator');


router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlace
);


router.get("/",
    enlacesController.todosEnlaces
)


router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
)

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
)


module.exports = router;
