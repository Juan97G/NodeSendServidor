// IMPORTAR EXPRESS Y SU ROUTING
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importar el middleware de autenticación
const authController = require('../controllers/authController'); // Importar el controller
const { check } = require('express-validator');


router.post("/",
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password no puede ir vacío').not().isEmpty()
    ],
    authController.autenticarUsuario
)


router.get("/",
    auth,
    authController.usuarioAutenticado
)


module.exports = router;
