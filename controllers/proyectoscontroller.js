const slug = require('slug');
const Proyectos= require('../models/Proyectos');
const Tareas = require('../models/Tareas');

 
exports.proyectosHome= async (req, res) => {

    //console.log(res.locals.usuario);

    const usuarioId = res.locals.usuario.id;

    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('index', {
        nombrePagina:'Proyectos',
        proyectos
    });
}

exports.FormularioProyectos = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos= await Proyectos.findAll();
    res.render('nuevoProyecto', {
         nombrePagina: 'Nuevo Proyecto',
         proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos= await Proyectos.findAll();

    // Enviar a la consola lo que el usuario escriba.
    console.log(req.body); 
    //Validar que tengamos algo en el input
    const {nombre} = req.body;
    let errores= [];
    if(!nombre){
        errores.push({'texto': 'Agregar un Nombre al proyecto'})
    }
    if (errores.length >0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        // No hay errores
        // Insertar en la base de datos
        const usuarioId = res.locals.usuario.id;
        const url= slug(nombre).toLowerCase();
        const proyecto= await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
        
        
    }

}

exports.proyectoPorUrl = async (req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise=  Proyectos.findAll();
    const proyectoPromise=  Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto]= await Promise.all([proyectosPromise, proyectoPromise ]);

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id 
        },
        incluide : [
            {model: Proyectos}

        ]
    });


    if (!proyecto) return next ();

    

    // render a la vista 
    res.render ('tareas', {
        nombrePagina: 'Tareas del proyecto', 
        proyecto,
        proyectos,
        tareas
    })
}


exports.formularioEditar= async (req, res)=>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise=  Proyectos.findAll();
    const proyectoPromise=  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto]= await Promise.all([proyectosPromise, proyectoPromise]);



    // render a la vista 
    res.render('nuevoProyecto' , {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto

    })

}


exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos= await Proyectos.findAll();

    console.log(req.params.id)
    // Enviar a la consola lo que el usuario escriba.
    console.log(req.body); 
    //Validar que tengamos algo en el input
    const {nombre} = req.body;
    let errores= [];
    if(!nombre){
        errores.push({'texto': 'Agregar un Nombre al proyecto'})
    }
    if (errores.length >0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
          
        })
    }else{
        // No hay errores
        // Insertar en la base de datos
        
        await Proyectos.update(
            {nombre: nombre},
            {where: { id: req.params.id}}
            
        ); 
        res.redirect('/');
        
    }

}

exports.EliminarProyecto = async( req, res, next)=> {
    // req contiene la informacion y puede obtenerse con query o params
    //console.log(req.params);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    res.status(200).send('Poyecto Eliminado Correctamente');
} 