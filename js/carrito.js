import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";
import { eliminarProducto } from "./funcionesCarrito.js";

const renderizarCarrito = () => {
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  const contenedorCarrito = document.querySelector(".lista-carrito");
  const textoSubtotal = document.getElementById("monto-subtotal");
  const textoTotal = document.getElementById("monto-total");

  if (!contenedorCarrito) return;

  contenedorCarrito.innerHTML = "";
  let totalCalculado = 0;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML =
      '<div style="text-align: center; padding: 40px 0;"><i class="fas fa-shopping-basket" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i><p style="color: #777; margin: 0;">Tu carrito está vacío.</p></div>';
    if (textoSubtotal) textoSubtotal.innerText = "$0.00";
    if (textoTotal) textoTotal.innerText = "$0.00";
    return;
  }

  carrito.forEach((producto, i) => {
    const itemVisual = document.createElement("div");
    itemVisual.classList.add("item-carrito");

    const tituloItem =
      producto.titulo || producto.nombre || "iPhone Seleccionado";
    const precioItem = producto.precio ?? "$0.00";
    const imagenItem = producto.imagen || "";

    const imagen = document.createElement("img");
    imagen.src = imagenItem;
    imagen.alt = tituloItem;
    imagen.classList.add("foto-carrito");

    const info = document.createElement("div");
    info.classList.add("info-carrito");
    const titulo = document.createElement("h3");
    titulo.textContent = tituloItem;
    const precio = document.createElement("p");
    precio.classList.add("precio-carrito");
    precio.textContent = String(precioItem);
    info.append(titulo, precio);

    const cantidad = document.createElement("input");
    cantidad.type = "number";
    cantidad.value = "1";
    cantidad.min = "1";
    cantidad.classList.add("input-cantidad");
    cantidad.readOnly = true;

    const botonBorrar = document.createElement("button");
    botonBorrar.type = "button";
    botonBorrar.classList.add("btn-borrar");
    botonBorrar.dataset.index = String(i);
    botonBorrar.setAttribute("aria-label", `Eliminar ${tituloItem}`);
    botonBorrar.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';

    itemVisual.append(imagen, info, cantidad, botonBorrar);

    contenedorCarrito.appendChild(itemVisual);

    // Acepta precios numéricos o cadenas como "$1,030.00".
    const precioLimpio = Number(String(precioItem).replace(/[$,\s]/g, ""));
    if (Number.isFinite(precioLimpio)) {
      totalCalculado += precioLimpio;
    }
  });

  const precioFormateado =
    "$" +
    totalCalculado.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (textoSubtotal) textoSubtotal.innerText = precioFormateado;
  if (textoTotal) textoTotal.innerText = precioFormateado;

  asignarEventosBorrar();
};

const asignarEventosBorrar = () => {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");
  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      const btn = evento.target.closest(".btn-borrar");
      if (!btn) return;
      const indice = Number(btn.dataset.index);
      if (!Number.isInteger(indice) || indice < 0) return;

      eliminarProducto(indice);
      renderizarCarrito();
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
});

// TU FIX: Solución para los gestos del celular
window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) {
    renderizarCarrito();
  }
});
