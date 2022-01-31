const passport= require ('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios= require('../models/Usuarios');

// local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            console.log("called from passport")
            try {
                const usuario = await Usuarios.findOne({
                    where: {email: email}
                });
                // El usuario existe, password incorecto
                if (!usuario.verificarPassword(password)){
                    console.log("passowrd incorrecto")
                    return done (null, false, {
                        message: 'Password incorrecto'
                    })
                }
                // El mail existe, y el password correcto
                console.log("usuario correcto")
                return done (null, usuario);

            } catch (error){
                console.log("usuario inexistente")
                // Ese usuario no existe
                return done (null, false, {
                    message: 'Esa cuenta no existe'

                })
            }
            console.log("end of passport initialize")

        }
    )

);

// serializar el usuario

passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
})

// deserealizar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports= passport;