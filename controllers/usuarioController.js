// Importar el modelo
const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');  // Importar bcrypt para hashear los password
const { validationResult } = require('express-validator'); // Trae los errores en caso de que existan en la validación


exports.nuevoUsuario = async (req, res) => {

    // Mostrar mensajes de error en caso de que existan
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Validar si el usuario ya estuvo registrado
    const { email, password } = req.body;

    let usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({msg: 'El usuario ya se encuentra registrado'});
    }

    usuario = new Usuario(req.body);

    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        res.json({msg: 'Usuario creado correctamente'});
    } catch(error){
        console.log(error);
    }
}
