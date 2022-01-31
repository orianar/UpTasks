const Usuarios = require('../models/Usuarios');


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
        res.redirect('/iniciar-secion');
    }catch (error){
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