let pagina = 1;

const cita = {

    nombre: '',
    fecha: '',
    hora: '',
    servicios: []

}


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

    //Muestra el resumen de la cita ( o mensaje de error en caso de no pasar la validacion)

    mostrarResumen();

    //Almacena el nombre de la cita en el objeto

    nombreCita();

    //Almacena la fecha en el objeto

    fechaCita();

    //Deshabilitar fecha anterior

    deshabilitarFecha();

    //Almacena la hora 

    horaCita();
}

function botonesPaginador() {

    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {

        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {

        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3 , carga el resumen de la cita

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
        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        console.log(elemento.firstElementChild.nextElementSibling.textContent);
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function eliminarServicio(id) {
    const { servicios } = cita;

    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);
}

function mostrarResumen() {

    //Destructuring
    const { nombre, hora, fecha, servicios } = cita;

    //Seleccionar resumen

    const resumenDiv = document.querySelector('.contenedor-resumen');

    //Limpiar el HTML previo

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if (Object.values(cita).includes('')) {
        const pResumen = document.createElement('P');
        pResumen.textContent = 'Algunos datos están vacios, comprueba el nombre , fecha , hora y reserva de la cita';
        pResumen.classList.add('invalidar-cita');

        //Agregamos a resumen Div el texto 
        resumenDiv.appendChild(pResumen);

        return;
    }

    //Mostrar el resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la cita'

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //Iteramos sobre el array de servicios

    servicios.forEach(servicio => {

        //Aplicamos destructuring

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());


        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);


    });

    console.log(cantidad);
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = ` <span> Total a Pagar : </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);



    console.log(resumenDiv);


}


function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //Validacion de que nombreTexto tiene que tener algo

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');

        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;

        }

    })
}

function mostrarAlerta(mensaje, tipo) {
    //Si tenemos alerta no agregar más.

    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error')
    }

    //Insertar en el formulario

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = "";
            mostrarAlerta('La tienda esta cerrada');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }

    })
}

function deshabilitarFecha() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    //Formato deseado : AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Horas no validas', 'error');
            setTimeout(() => {
                inputHora.value = "";
            }, 3000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }

    })
}