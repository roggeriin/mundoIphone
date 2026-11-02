// Leemos el carrito desde la memoria del navegador, o creamos un array vacío
let carrito = JSON.parse(localStorage.getItem("carritoMundoIphone")) || [];

// --- FUNCIÓN DEL CONTADOR ---
function actualizarContador() {
  const badge = document.getElementById("contador-carrito");
  if (badge) {
    badge.innerText = carrito.length;
    if (carrito.length > 0) {
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
}

// --- FUNCIÓN DEL TOAST (NOTIFICACIÓN) ---
function mostrarToast() {
  let toast = document.getElementById("toast-agregado");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-agregado";
    toast.className = "toast-notificacion";
    toast.innerHTML =
      '<i class="fas fa-check-circle"></i> ¡Agregado al carrito!';
    document.body.appendChild(toast);
  }

  toast.classList.add("mostrar");

  setTimeout(function () {
    toast.classList.remove("mostrar");
  }, 3000);
}

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
      '<div style="text-align: center; padding: 40px 0;"><i class="fas fa-shopping-basket" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i><p style="color: #777; margin: 0;">Tu carrito está vacío.</p></div>';
    if (textoSubtotal) textoSubtotal.innerText = "$0.00";
    if (textoTotal) textoTotal.innerText = "$0.00";
    return;
  }

  // Recorremos el carrito
  for (let i = 0; i < carrito.length; i++) {
    let producto = carrito[i];

    let itemVisual = document.createElement("div");
    itemVisual.classList.add("item-carrito");

    // Nos aseguramos de leer correctamente las propiedades del producto guardado
    let tituloItem =
      producto.titulo || producto.nombre || "iPhone Seleccionado";
    let precioItem = producto.precio || "$0.00";
    let imagenItem = producto.imagen || "";

    itemVisual.innerHTML = `
      <img src="${imagenItem}" alt="${tituloItem}" class="foto-carrito" />
      <div class="info-carrito">
        <h3>${tituloItem}</h3>
        <p class="precio-carrito">${precioItem}</p>
      </div>
      <input type="number" value="1" min="1" class="input-cantidad" readonly />
      <button class="btn-borrar" data-index="${i}"><i class="fas fa-trash"></i></button>
    `;

    contenedorCarrito.appendChild(itemVisual);

    // Limpiamos el texto del precio para sumarlo bien matemáticamente
    let precioLimpio = parseFloat(
      precioItem.replace("$", "").replace(/,/g, ""),
    );
    if (!isNaN(precioLimpio)) {
      totalCalculado = totalCalculado + precioLimpio;
    }
  }

  const precioFormateado =
    "$" +
    totalCalculado.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (textoSubtotal) textoSubtotal.innerText = precioFormateado;
  if (textoTotal) textoTotal.innerText = precioFormateado;

  asignarEventosBorrar();
}

function asignarEventosBorrar() {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");

  for (let i = 0; i < botonesBorrar.length; i++) {
    botonesBorrar[i].addEventListener("click", function (evento) {
      let boton = evento.target.closest(".btn-borrar");
      let indice = boton.getAttribute("data-index");

      // Lo borramos del array y actualizamos el almacenamiento local
      carrito.splice(indice, 1);
      localStorage.setItem("carritoMundoIphone", JSON.stringify(carrito));

      actualizarContador();
      renderizarCarrito();
    });
  }
}

// --- CORRECCIÓN PARA EL CACHÉ DEL NAVEGADOR (GESTOS DEL CELULAR) ---
window.addEventListener("pageshow", function () {
  carrito = JSON.parse(localStorage.getItem("carritoMundoIphone")) || [];
  actualizarContador();
  renderizarCarrito();
});
