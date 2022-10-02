

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
        
        cliente.platillos = [...lista];
    }

    limpiarHTML();

    if (cliente.platillos.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }


}

function mostrarSeccion() {
    const platillos = document.querySelector('#platillos');
    const resumen = document.querySelector('#resumen');

    platillos.classList.remove('d-none');
    resumen.classList.remove('d-none');
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('p');
    mesa.textContent = `Mesa: `;
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('p');
    hora.textContent = `Hora: `;
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    const heading = document.createElement('h3');
    heading.textContent = "Platillos consumidos";
    heading.classList.add('my-4', 'text-center');

    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const {platillos} = cliente;
    platillos.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;
        
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioElValor = document.createElement('span');
        precioElValor.classList.add('fw-normal');
        precioElValor.textContent = `${precio}€`;

        //SubTotal valor
        const subTotalEl = document.createElement('p');
        subTotalEl.classList.add('fw-bold');
        subTotalEl.textContent = 'Precio: ';

        const subTotalElValor = document.createElement('span');
        subTotalElValor.classList.add('fw-normal');
        subTotalElValor.textContent = `${precio * cantidad}€`;     
        
        //Boton
        const boton = document.createElement('button');
        boton.classList.add('btn', 'btn-danger');
        boton.textContent = 'ELIMINAR';
        boton.onclick = function() { eliminarPlatillo(this, articulo) };
            

        //agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioElValor);
        subTotalEl.appendChild(subTotalElValor);

        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subTotalEl);
        lista.appendChild(boton);


        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar formulario propinas
    formularioPropinas();


}

function eliminarPlatillo(e,articulo) {
    const contenedor = e.parentElement;

    const resultado = cliente.platillos.filter(producto => articulo.id !== producto.id);

    cliente.platillos = [...resultado];

    limpiarHTML();

    if (cliente.platillos.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }


    //Reset input
    document.querySelector(`#producto-${articulo.id}`).value = 0;

}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
} 

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = "Añade los elementos del pedido";

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = "Propina";

    //Radio button 0$
    const radio0 = document.createElement('input');
    radio0.type = "radio";
    radio0.name = "propina";
    radio0.value = "0";
    radio0.classList.add('form-check-input');
    radio0.onclick = calcularPropina;

    const radio0Label = document.createElement('label');
    radio0Label.textContent = "0%";
    radio0Label.classList.add('form-check-label'); 

    const radio0Div = document.createElement('div');
    radio0Div.classList.add('form-check');

    radio0Div.appendChild(radio0);
    radio0Div.appendChild(radio0Label);


    //Radio button 10$
    const radio10 = document.createElement('input');
    radio10.type = "radio";
    radio10.name = "propina";
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = "10%";
    radio10Label.classList.add('form-check-label'); 

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio button 25$
    const radio25 = document.createElement('input');
    radio25.type = "radio";
    radio25.name = "propina";
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;


    const radio25Label = document.createElement('label');
    radio25Label.textContent = "25%";
    radio25Label.classList.add('form-check-label'); 

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);    

    //Radio button 50$
    const radio50 = document.createElement('input');
    radio50.type = "radio";
    radio50.name = "propina";
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;


    const radio50Label = document.createElement('label');
    radio50Label.textContent = "50%";
    radio50Label.classList.add('form-check-label'); 

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);       


    //Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio0Div);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    formulario.appendChild(divFormulario);

    //Agregar al form
    contenido.appendChild(formulario);
};

function calcularPropina() {
    const { platillos } = cliente;
    let subTotal = 0;

    //Calcula sub total a pagar
    platillos.forEach(articulo => {

        subTotal += articulo.cantidad * articulo.precio;

    });

    //Selecciona la propina
    const propinaSeleccionada = parseInt(document.querySelector('[name="propina"]:checked').value);

    //Calcula la propina
    const propina = ((subTotal * propinaSeleccionada) / 100)

    //Calcula el total a pagar
    const total = propina + subTotal;

    mostrarTotalHTML(subTotal, total, propina);
}

function mostrarTotalHTML(subTotal, total, propina) {

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar','my-5');

    //Sub Total
    const subTotalParrafo = document.createElement('p');
    subTotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subTotalParrafo.textContent = 'Subtotal Consumo: ';

    const subTotalSpan = document.createElement('span');
    subTotalSpan.classList.add('fw-normal');
    subTotalSpan.textContent = `${subTotal}€`;
    
    subTotalParrafo.appendChild(subTotalSpan);

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `${propina}€`;
    
    propinaParrafo.appendChild(propinaSpan);  
    
    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `${total}€`;
    
    totalParrafo.appendChild(totalSpan); 
    
    //Eliminar la busqueda anterior
    const totalPagarDiv = document.querySelector('.total-pagar');
    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }


    divTotales.appendChild(subTotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}