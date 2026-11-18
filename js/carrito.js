import { obtenerCarrito } from "./storage.js";
import {
  actualizarContador,
  confirmarAccion,
  mostrarMensaje,
  mostrarToast,
} from "./ui.js";
import { eliminarProducto, vaciarCarrito } from "./funcionesCarrito.js";

const crearMensajeCarritoVacio = () => {
  const mensaje = document.createElement("div");
  mensaje.classList.add("carrito-vacio");

  const icono = document.createElement("i");
  icono.classList.add("fas", "fa-shopping-basket");
  icono.setAttribute("aria-hidden", "true");

  const texto = document.createElement("p");
  texto.textContent = "Tu carrito está vacío.";
  mensaje.append(icono, texto);

  return mensaje;
};

const crearItemCarrito = (producto, indice) => {
  const item = document.createElement("div");
  item.classList.add("item-carrito");

  const titulo = producto.titulo || producto.nombre || "iPhone Seleccionado";
  const precio = String(producto.precio || "$0.00");
  const imagen = document.createElement("img");
  imagen.classList.add("foto-carrito");
  imagen.src = producto.imagen || "";
  imagen.alt = titulo;

  const informacion = document.createElement("div");
  informacion.classList.add("info-carrito");

  const nombre = document.createElement("h3");
  nombre.textContent = titulo;

  const precioTexto = document.createElement("p");
  precioTexto.classList.add("precio-carrito");
  precioTexto.textContent = precio;
  informacion.append(nombre, precioTexto);

  const cantidad = document.createElement("span");
  cantidad.classList.add("cantidad-carrito");
  cantidad.textContent = "1";

  const botonBorrar = document.createElement("button");
  botonBorrar.classList.add("btn-borrar");
  botonBorrar.type = "button";
  botonBorrar.setAttribute("aria-label", `Eliminar ${titulo}`);

  const iconoBorrar = document.createElement("i");
  iconoBorrar.classList.add("fas", "fa-trash");
  iconoBorrar.setAttribute("aria-hidden", "true");
  botonBorrar.append(iconoBorrar);
  botonBorrar.addEventListener("click", async () => {
    const confirmacion = await confirmarAccion(
      "¿Eliminar producto?",
      `Se quitará ${titulo} del carrito.`,
      "Sí, eliminar",
      "warning",
    );

    if (!confirmacion.isConfirmed) return;

    eliminarProducto(indice);
    renderizarCarrito();
    mostrarToast("Producto eliminado del carrito", "warning");
  });

  item.append(imagen, informacion, cantidad, botonBorrar);
  return { item, precio };
};

const renderizarCarrito = () => {
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  const contenedorCarrito = document.querySelector(".lista-carrito");
  const textoSubtotal = document.getElementById("monto-subtotal");
  const textoTotal = document.getElementById("monto-total");

  if (!contenedorCarrito) return;

  contenedorCarrito.textContent = "";

  if (carrito.length === 0) {
    contenedorCarrito.append(crearMensajeCarritoVacio());
    if (textoSubtotal) textoSubtotal.textContent = "$0.00";
    if (textoTotal) textoTotal.textContent = "$0.00";
    return;
  }

  let totalCalculado = 0;
  carrito.forEach((producto, indice) => {
    const { item, precio } = crearItemCarrito(producto, indice);
    contenedorCarrito.append(item);

    const precioLimpio = Number.parseFloat(precio.replace(/[$,]/g, ""));
    if (Number.isFinite(precioLimpio)) totalCalculado += precioLimpio;
  });

  const precioFormateado = `$${totalCalculado.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  if (textoSubtotal) textoSubtotal.textContent = precioFormateado;
  if (textoTotal) textoTotal.textContent = precioFormateado;
};

const asignarEventosAcciones = () => {
  const btnVaciar = document.getElementById("btn-vaciar");
  const btnPagar = document.getElementById("btn-pagar");

  if (btnVaciar) {
    btnVaciar.addEventListener("click", async () => {
      if (obtenerCarrito().length === 0) {
        mostrarMensaje("El carrito ya está vacío.", "info");
        return;
      }

      const confirmacion = await confirmarAccion(
        "¿Vaciar el carrito?",
        "Se eliminarán todos los productos.",
        "Sí, vaciar",
      );

      if (!confirmacion.isConfirmed) return;

      vaciarCarrito();
      renderizarCarrito();
      mostrarToast("Carrito vaciado", "info");
    });
  }

  if (btnPagar) {
    btnPagar.addEventListener("click", async () => {
      if (obtenerCarrito().length === 0) {
        mostrarMensaje(
          "El carrito está vacío. Agregá productos para poder pagar.",
          "info",
        );
        return;
      }

      const elementoTotal = document.getElementById("monto-total");
      let total = "$0.00";
      if (elementoTotal) {
        total = elementoTotal.textContent;
      }
      const confirmacion = await Swal.fire({
        title: "¿Confirmar compra?",
        text: `El total de tu compra es ${total}.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar pago",
        cancelButtonText: "Seguir comprando",
        customClass: {
          confirmButton: "swal-boton-pago",
          cancelButton: "swal-boton-cancelar",
        },
        reverseButtons: true,
      });

      if (!confirmacion.isConfirmed) return;

      vaciarCarrito();
      renderizarCarrito();
      mostrarMensaje("Pago realizado con éxito", "success");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  asignarEventosAcciones();
});

window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) renderizarCarrito();
});
