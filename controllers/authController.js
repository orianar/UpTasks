const passport = require ('passport');

const Usuarios = require('../models/Usuarios');
const {enviarToken} = require("./authController");

const Sequalize= require('sequelize');
const { Op } = require("sequelize");


const crypto = require('crypto');
const {Sequelize} = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const enviarEmail= require('../handlers/email');

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
    //res.redirect(resetUrl);


    // Enviar el correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password',
    });

    // terminar

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}
exports.validarToken= async (req, res)=>{
    console.log(req.params.token);
    const usuario= await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });

    // sino encuentra el usuario
    if (!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    //Formulario para generar Password
    res.render('resetPassword', {
        nombrePagina:'Restablecer Contraseña'
    })




    //res.status(200).send(usuario)
    // console.log(`resetPassword: ${usuario}`);
}
// Cambia el password por uno nuevo
exports.actualizarPassword= async (req, res)=>{
    //console.log(req.params.token);
    //Verifica el token valido pero tambien la expiracion
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe

    //console.log(usuario);

    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/restablecer');
    }

    // hashear el nuevo password

    usuario.password= bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token= null;
    usuario.expiracion= null;
    usuario.password= bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // guardamos el nuevo password

    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');


}
