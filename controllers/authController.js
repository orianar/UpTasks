const passport = require ('passport');

const Usuarios = require('../models/Usuarios');
const {enviarToken} = require("./authController");

const crypto = require('crypto');

// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'

});


// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado= (req, res, next) => {

    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }


    // Simo esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')

}

// funcion para cerrar sesion
exports.cerrarSesion= (req, res)=> {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');// al cerrar sesion nos lleva a login

    })

}

//Genera un token si el usuario es valido
exports.enviarToken= async (req, res) =>{
    //verificar que el usuario existe
    const {email}= req.body
    const usuario= await Usuarios.findOne({where:{ email}});

    // Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');

    }
    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion= Date.now()+ 3600000;
    //console.log(expiracion);

    // Guardarlos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl= `http://${req.headers.host}/restablecer/${usuario.token}`;
    console.log(resetUrl);

}
exports.resetPassword= async (req, res)=>{
    console.log(req.params.token);
    const usuario= await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });

    console.log(`resetPassword: ${usuario}`);
}