const Usuarios = require('../models/Usuarios');
const enviarEmail = require("../handlers/email");


exports.formCrearCuenta = async (req, res)=> {
    res.render ('crearCuenta', {
        nombrePagina: 'Crear cuenta en Uptask'

    })
}

exports.formIniciarSesion= async (req, res)=> {
    const {error} = res.locals.mensajes;
    res.render ('IniciarSesion', {
        nombrePagina: 'Iniciar Secion en Uptask',
        error
    })
}
exports.crearCuenta=  async (req, res)=> {
    // Leer los datos

    const {email, password}= req.body;
    try {
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmar
        const confirmarUrl= `http://${req.headers.host}/confirmar/${email}`;

        //Crear el obeto de usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta',
        });


        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    }catch (error){
        console.log(error)
        req.flash('error', error.errors.map(error=> error.message));
        //console.log('errror');
        res.render ('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password

        })

    }

}

exports.formRestablecerPassword= (req, res) =>{
    res.render('reestablecer',{
        nombrePagina: 'Restablecer tu Contraseña'
    })
}
// Cambia el estado de una cuenta
exports.confirmarCuenta= async (req,res)=> {
    //res.json(req.params.correo);
    const usuario= await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo=1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}