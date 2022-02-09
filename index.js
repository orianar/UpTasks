const express= require('express');
const routes= require('./routes');
const path = require('path');
const bodyParser= require('body-parser');
const flash= require('connect-flash');
const session = require ('express-session');
const cookieParser= require('cookie-parser');
const passport = require('./config/passport');


// helpers con algunas funciones
const helpers= require('./helpers');

//Crear la conexion a la BD
const db = require('./config/db');
const { nextTick } = require('process');
const { Console } = require('console');

// Importar el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectando al servidor'))
    .catch(error => console.error(error));


// Crear una app de express
const app= express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug' );

// Habilitar BodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));



// Añadir las carpetas de las vistas
app.set('views', path.join(__dirname, './views'));


// Agregar flash messages
app.use(flash());


app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas sin volversse a autenticar
app.use(session({
    secret:'supersecreto',
    resave: false,
    saveUninitialized:false


}));

app.use(passport.initialize());
app.use(passport.session());


// Pasar var dump a la aplicacion 
app.use((req, res, next)=>{
    //console.log(req.user);
    res.locals.years= 2019;
    res.locals.vardump= helpers.vardump;
    res.locals.mensajes= req.flash();
    res.locals.usuario={...req.user} || null;
    console.log(res.locals.usuario);
    next();
});


// Aprendiendo  Middleware

app.use((req, res, next)=>{
    console.log('Yo soy middleware');
    next();
})



app.use('/', routes() );


app.listen(3000);

