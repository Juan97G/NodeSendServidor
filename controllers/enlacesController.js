// Importar el modelo
const Enlace = require('../models/Enlace');
const shortid = require('shortid'); // Importar libreria para generar IDs cortos de los enlaces
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator'); // Trae los errores en caso de que existan en la validación

exports.nuevoEnlace = async (req, res, next) => {

    // Revisar si existen errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // Crear un objeto de enlace
    const {nombre_original, nombre} = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;


    // Si el usuario está autenticado
    if(req.usuario){
        const {password, descargas} = req.body;

        // Asignar el numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // Asignar el password
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        // Asignar el autor
        enlace.autor = req.usuario.id;
    }

    // Almacenar enlace en la Base de datos
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();
    } catch(error){
        console.log(error);
    }
}


// Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces});
    } catch(error){
        console.log(error);
    }
}


// Consulta si el archivo tiene password
exports.tienePassword = async (req, res, next) => {
    // Validar si existe el enlace
    const enlace = await Enlace.findOne({ url: req.params.url });

    if(!enlace){
        res.status(404).json({msg: 'El enlace no existe'});
        return next();
    }

    if(enlace.password){
        return res.json({password: true, enlace: enlace.url});
    }

    next();
}


// Valida si el password enviado es correcto
exports.verificarPassword = async (req, res, next) => {

    const { url } = req.params;
    const { password } = req.body;

    // Consultar el enlace
    const enlace = await Enlace.findOne({url});

    if(bcrypt.compareSync(password, enlace.password)){

        next();
    } else {
        return res.status(401).json({msg: 'Password Incorrecto'});
    }

}


// OBTENER ENLACES
exports.obtenerEnlace = async (req, res, next) => {

    // Validar si existe el enlace
    const enlace = await Enlace.findOne({ url: req.params.url });

    if(!enlace){
        res.status(404).json({msg: 'El enlace no existe'});
        return next();
    }

    // Si el enlace existe
    res.json({ archivo: enlace.nombre, password: false });

    next();
}
