import Swal from "sweetalert2";

export const actualizarAvance = () => {
    // seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    console.log(tareas.length)
    if (tareas.length) {
        console.log("inside whatever we want")
        // seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        console.log(tareasCompletas.length)

        // calcular el avanece
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
        // mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if(avance=== 100){
            // Opcional una alerta
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades, has terminado el proyecto',
                'success'
            )
        }



    }

}

