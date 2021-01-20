const shortid = require('shortid');
const fs = require('fs');
const Enlace = require("../models/Enlace");

// Subida de archivos
const multer = require('multer');


exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? (1024 * 1024 * 10) : (1024 * 1024) },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error){
            res.json({ archivo: req.file.filename })
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch(error){
        console.log(error);
    }
}


/* Descarga un archivo */
exports.descargar = async (req, res, next) => {

    // Obtener el enlace
    const enlace = await Enlace.findOne({nombre: req.params.archivo});

    const archivo = __dirname + "/../uploads/" + req.params.archivo;
    res.download(archivo);

    // Si las descargas son iguales a 1 - Borrar la entrada y el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1){
        // Eliminar el archivo
        req.archivo = nombre;

        // Eliminar la entrada de la DB
        await Enlace.findOneAndRemove(enlace.id);

        next();
    } else {
        // Si las descargas son mayores a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();
    }
}
