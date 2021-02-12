let pagina = 1;

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();

});

function iniciarApp() {
    mostrarServicios();

    //Resalta el div actual segun el tab que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion el tab al que se presiona

    cambiarSeccion();

    //Pagina siguiente

    paginaSiguiente();

    //Pagina anterior

    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion

    botonesPaginador();
}

function botonesPaginador() {

    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {

        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {

        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}



function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
}

function mostrarSeccion() {

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }






    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    //Resalta el tab actual

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);


            //Llamar la función de mostrar seccion

            mostrarSeccion();

            botonesPaginador();

        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;

        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOM Scripting
            //Generar nombre del Servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');


            //Generar precio del Servicio

            const precioServicio = document.createElement('P');
            precioServicio.textContent = ` $ ${precio}`;
            precioServicio.classList.add('precio-servicio');


            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita

            servicioDiv.onclick = seleccionarServicio;





            //Insertar precio y nombre al div de servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);


            //Inyectarlo al HTML

            document.querySelector('#servicios').appendChild(servicioDiv);

        })
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    // console.log(e.target.tagName);

    // const id = e.target.dataset.idServicio;
    // console.log(id);

    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV

    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;

    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
    } else {
        elemento.classList.add('seleccionado');
    }
}