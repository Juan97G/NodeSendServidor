// Importar el modelo
const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');  // Importar bcrypt para hashear los password
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const { validationResult } = require('express-validator'); // Trae los errores en caso de que existan en la validación


exports.autenticarUsuario = async (req, res, next) => {

    // Validar que no hayan errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Buscar el usuario para ver si está registrado
    /* Destructuring al req.body para  validar */
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({email});

    if(!usuario){
        res.status(401).json({msg: 'El usuario no existe'});
        return next();
    }

    // Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)){
        /* Crear un JWT */
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre
        }, process.env.SECRETA, {
            expiresIn: '8h'
        });

        res.json({token});
    } else {
        res.status(401).json({msg: 'El password es incorrecto'});
        return next();
    }
}


exports.usuarioAutenticado = (req, res, next) => {

    res.json({ usuario: req.usuario });
}
