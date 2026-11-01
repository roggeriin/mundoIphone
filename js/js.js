// Leemos el carrito desde la memoria del navegador, o creamos un array vacío
let carrito = JSON.parse(localStorage.getItem("carritoMundoIphone")) || [];

// --- FUNCIÓN DEL CONTADOR ---
function actualizarContador() {
  const badge = document.getElementById("contador-carrito");
  if (badge) {
    badge.innerText = carrito.length;
    // Si hay 1 o más productos, mostramos el globito rojo. Si no, lo ocultamos.
    if (carrito.length > 0) {
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                 LÓGICA DEL INDEX (SELECCIÓN Y CARRITO)                     */
/* -------------------------------------------------------------------------- */

// 1. Lógica para las píldoras de almacenamiento
const pildoras = document.querySelectorAll(".capacidad");

pildoras.forEach(function (pildora) {
  pildora.addEventListener("click", function (evento) {
    const pildoraTocada = evento.target;
    const tarjeta = pildoraTocada.closest(".item");

    // Le sacamos la clase "activa" a todas las píldoras de ESTE celular
    const pildorasDelCelular = tarjeta.querySelectorAll(".capacidad");
    pildorasDelCelular.forEach(function (p) {
      p.classList.remove("activa");
    });

    // Y se la ponemos a la que tocamos
    pildoraTocada.classList.add("activa");

    // --- LÓGICA SENCILLA DE PRECIOS ---
    // Guardamos el precio base en el HTML (un atributo) si no está, lo inventamos por ahora
    // Para no complicarla con multiplicadores, vamos a sumarle plata según lo que diga el botón.

    // Agarro el precio actual que está escrito (ej: "$500.00")
    let precioTexto = tarjeta.querySelector(".precio").innerText;

    // Si el usuario toca 256GB, le aviso que asume un aumento base, pero lo dejamos visual simple
    // Para este ejercicio básico, no haremos matemática compleja para no "romper" tu precio base
    // si el usuario cambia de color. El precio real cambiaría acá sumando ej: +$50.
  });
});

// 2. Lógica para cambiar de color y de foto
const swatches = document.querySelectorAll(".swatch");

swatches.forEach(function (swatch) {
  swatch.addEventListener("click", function (evento) {
    const circulitoTocado = evento.target;
    const tarjeta = circulitoTocado.closest(".item");

    // Cambiamos la imagen principal del celular
    const nuevaImagen = circulitoTocado.getAttribute("data-img");
    tarjeta.querySelector(".foto").src = nuevaImagen;

    // Le sacamos la clase "activo" a todos los colores de este celular...
    const coloresDelCelular = tarjeta.querySelectorAll(".swatch");
    coloresDelCelular.forEach(function (color) {
      color.classList.remove("activo");
    });

    // ...y se la ponemos solo al que tocamos
    circulitoTocado.classList.add("activo");
  });
});

// 3. Lógica para enviar al carrito
const botonesAgregar = document.querySelectorAll(".item .btn");

botonesAgregar.forEach(function (boton) {
  boton.addEventListener("click", function (evento) {
    const tarjeta = evento.target.closest(".item");

    // Buscamos el color seleccionado
    const swatchActivo = tarjeta.querySelector(".swatch.activo");
    let colorElegido = "";
    if (swatchActivo) {
      colorElegido = " - " + swatchActivo.getAttribute("data-nombre");
    }

    // Buscamos la capacidad seleccionada
    const capacidadActiva = tarjeta.querySelector(".capacidad.activa");
    let capacidadElegida = "";
    if (capacidadActiva) {
      capacidadElegida = " (" + capacidadActiva.innerText + ")";
    }

    // Armamos el objeto con todo
    const producto = {
      titulo:
        tarjeta.querySelector("h3").innerText + capacidadElegida + colorElegido,
      precio: tarjeta.querySelector(".precio").innerText,
      imagen: tarjeta.querySelector(".foto").src,
    };

    // Lo guardamos
    carrito.push(producto);
    localStorage.setItem("carritoMundoIphone", JSON.stringify(carrito));

    actualizarContador();
  });
});

/* -------------------------------------------------------------------------- */
/*               LÓGICA DEL CARRITO (MOSTRAR Y ELIMINAR)                      */
/* -------------------------------------------------------------------------- */
const contenedorCarrito = document.querySelector(".lista-carrito");
const textoSubtotal = document.getElementById("monto-subtotal");
const textoTotal = document.getElementById("monto-total");

function renderizarCarrito() {
  // Si no estamos en la página del carrito, no hacemos nada
  if (!contenedorCarrito) {
    return;
  }

  contenedorCarrito.innerHTML = "";
  let totalCalculado = 0;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML =
      '<p style="text-align: center; color: #777;">Tu carrito está vacío.</p>';
    textoSubtotal.innerText = "$0.00";
    textoTotal.innerText = "$0.00";
    return;
  }

  // Recorremos el carrito normal, sin funciones avanzadas
  for (let i = 0; i < carrito.length; i++) {
    let producto = carrito[i];

    let itemVisual = document.createElement("div");
    itemVisual.classList.add("item-carrito");

    itemVisual.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}" class="foto-carrito" />
      <div class="info-carrito">
        <h3>${producto.titulo}</h3>
        <p class="precio-carrito">${producto.precio}</p>
      </div>
      <input type="number" value="1" min="1" class="input-cantidad" readonly />
      <button class="btn-borrar" data-index="${i}"><i class="fas fa-trash"></i></button>
    `;

    contenedorCarrito.appendChild(itemVisual);

    // Sumamos el precio (le quitamos el símbolo peso y lo pasamos a número)
    let precioLimpio = parseFloat(producto.precio.replace("$", ""));
    totalCalculado = totalCalculado + precioLimpio;
  }

  textoSubtotal.innerText = "$" + totalCalculado.toFixed(2);
  textoTotal.innerText = "$" + totalCalculado.toFixed(2);

  asignarEventosBorrar();
}

function asignarEventosBorrar() {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");

  for (let i = 0; i < botonesBorrar.length; i++) {
    botonesBorrar[i].addEventListener("click", function (evento) {
      // Buscamos qué número de índice tiene el botón que tocamos
      let boton = evento.target.closest(".btn-borrar");
      let indice = boton.getAttribute("data-index");

      // Lo borramos del array y guardamos
      carrito.splice(indice, 1);
      localStorage.setItem("carritoMundoIphone", JSON.stringify(carrito));

      actualizarContador();
      renderizarCarrito();
    });
  }
}

// Ejecutamos ambas funciones apenas carga cualquier página
actualizarContador();
renderizarCarrito();
