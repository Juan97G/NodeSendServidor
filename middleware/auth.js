const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(authHeader){
        // Obtener le Token
        const token = authHeader.split(' ')[1];

        try {
            // Comprobar la veracidad del token
            const usuario = jwt.verify(token, process.env.SECRETA);

            req.usuario = usuario;
        } catch(error){
            console.log('JWT no válido')
            console.log(error);
        }
    }

    return next();
}
