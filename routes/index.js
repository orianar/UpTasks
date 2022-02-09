const express= require('express');
const router = express.Router();

//inportar express validator
const {body}= require ('express-validator');

// Importar controlador 
const proyectoscontroller = require
( '../controllers/proyectoscontroller');
const tareasController= require
('../controllers/tareasController');
const usuariosController= require
('../controllers/usuariosController');
const authController= require ('../controllers/authController');

module.exports = function(){
   // ruta para el home
    router.get('/',
        authController.usuarioAutenticado,
        proyectoscontroller.proyectosHome
    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectoscontroller.FormularioProyectos
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoscontroller.nuevoProyecto);


    //listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectoscontroller.proyectoPorUrl
    );
    

    // Actualizar el proyecto
    router.get('/proyectos/editar/:id',
        authController.usuarioAutenticado,
        proyectoscontroller.formularioEditar
    );
    router.post('/proyectos/editar/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoscontroller.actualizarProyecto);

    // Eminar proyecto 
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectoscontroller.EliminarProyecto
    );

    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    // Actualizar Tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar Tarea
    router.delete ('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar Sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);


    // Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // restablecer contraseña

    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);

    return router;
}


