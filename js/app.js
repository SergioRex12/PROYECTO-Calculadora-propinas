

let cliente = {
    mesa: -1,
    hora: -1,
    platillos: [] 
}

const categorias = {
    1: "Comida",
    2: "Bebidas",
    3: "Postres"
}




document.addEventListener('DOMContentLoaded',() => {
    document.querySelector('#guardar-cliente').addEventListener('click',verificarOrden);
});

function verificarOrden(e) {
    e.preventDefault();
    const mesa = document.querySelector('#mesa').value; 
    const hora = document.querySelector('#hora').value; 

    // .invalid-feedback
    if (document.querySelector('form .invalid-feedback') !== null) return;

    if (mesa.value === "" || hora.value === "") {
        const alerta = document.createElement('div');
        alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
        alerta.textContent = 'Todos los campos son obligatorios';

        document.querySelector('form').appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
    //Asignar datos
    cliente = {...cliente, mesa, hora}


    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    mostrarSeccion();
    consultarPlatillos();

}

function consultarPlatillos() {
    
    fetch("http://localhost:4000/platillos") 
        .then(resultado => resultado.json())
        .then(resultado => mostrarPlatillos(resultado))

} 

function mostrarPlatillos(platillos) {
    console.log(platillos);

    const zonaPlatillos = document.querySelector('#platillos .contenido'); 

    platillos.forEach(platillo => {

        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');
        
        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.defaultValue = 0;
        inputCantidad.addEventListener('change',selectCantidad);

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        zonaPlatillos.appendChild(row);
        
    });
}

function selectCantidad(e) {
    const cantidad = Number(e.target.value);
    //Pillamos la id del producto
    const id = Number(e.target.id.split('-')[1]);
    const obj = cliente.platillos.filter(e => e.id === id)

    const div = e.target.parentElement.parentElement;
    const nombre = div.querySelector('.col-md-4').textContent;
    const precio = Number(div.querySelector('.fw-bold').textContent.split('$')[1]);


    //Agrega cuando no existe
    if (cantidad === 1) {

        //Si ya existe borramos 1
        if (cliente.platillos.some(i => i.id === id)) {
            cliente.platillos[id - 1].cantidad -= 1; 
            console.log(cliente);
            return;
        };

        cliente.platillos.push({
            id: id,
            nombre: nombre,  
            precio: precio,
            cantidad: 1   
        })

        console.log(cliente);
        console.log("If agrega no existe");
        return;
    }

    //Agrega cuando existe y agregas
    if ((cantidad > 1) && (obj.cantidad < cantidad)) {

        obj.cantidad += 1; 
        console.log(cliente);
        console.log("If agrega existe agrega");

        return;
    } else {
        obj.cantidad -= 1; 
        console.log("If agrega existe borra");
        console.log(cliente);


    }

    //Borra
    if (cantidad === 0) {
        console.log("If borra");

        cliente.platillos = cliente.platillos.filter((item) => item.id !== id)
        console.log(cliente);

    }

}

function mostrarSeccion() {
    const platillos = document.querySelector('#platillos');
    const resumen = document.querySelector('#resumen');

    platillos.classList.remove('d-none');
    resumen.classList.remove('d-none');
}