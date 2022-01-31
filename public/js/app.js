import proyectos from './modulos/proyectos';
//console.log('hola');

import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';

window.addEventListener('DOMContentLoaded', () => {
    //console.log("inside DOMContentLoaded")
    actualizarAvance();

})


