

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
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo,cantidad});
        }

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

function agregarPlatillo(producto) {
    let {platillos} = cliente;

    if (producto.cantidad > 0) {

        //Comprueba si ya esta en el array
        if (platillos.some( articulo => articulo.id === producto.id )) {
            //El articulo ya existe
            const pedidoActualizado = platillos.map(articulo => {
                if ( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            })

            cliente.platillos = [...pedidoActualizado];

        } else {
            //El articulo no existe
            cliente.platillos = [...platillos, producto];
        }
    } else {
        //Borramos el producto
        const lista = platillos.filter(articulo => articulo.id !== producto.id);
        
        cliente.platillos = lista;
    }

}

function mostrarSeccion() {
    const platillos = document.querySelector('#platillos');
    const resumen = document.querySelector('#resumen');

    platillos.classList.remove('d-none');
    resumen.classList.remove('d-none');
}