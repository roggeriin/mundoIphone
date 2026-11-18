import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";
import { agregarAlCarrito } from "./funcionesCarrito.js";

const crearElemento = (etiqueta, clase, texto = "") => {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.classList.add(clase);
  elemento.textContent = texto;
  return elemento;
};

const crearOpcionesAlmacenamiento = (almacenamientos) => {
  const opciones = crearElemento("div", "opciones-almacenamiento");

  almacenamientos.forEach((almacenamiento, indice) => {
    const capacidad = crearElemento("span", "capacidad", almacenamiento.gb);
    capacidad.dataset.precio = almacenamiento.precio;

    if (indice === 0) capacidad.classList.add("activa");
    opciones.append(capacidad);
  });

  return opciones;
};

const crearOpcionesColor = (colores) => {
  const opciones = crearElemento("div", "colores");

  colores.forEach((color, indice) => {
    const swatch = crearElemento("span", "swatch");
    swatch.classList.add(color.claseCss);
    swatch.dataset.img = color.img;
    swatch.dataset.nombre = color.nombre;

    if (indice === 0) swatch.classList.add("activo");
    opciones.append(swatch);
  });

  return opciones;
};

const crearTarjetaProducto = (producto) => {
  const tarjeta = crearElemento("article", "item");
  const foto = crearElemento("img", "foto");
  foto.src = producto.colores[0].img;
  foto.alt = producto.nombre;

  const titulo = crearElemento("h3", "", producto.nombre);
  const descripcion = crearElemento("p", "", producto.descripcion);
  const opcionesAlmacenamiento = crearOpcionesAlmacenamiento(
    producto.almacenamientos,
  );
  const opcionesColor = crearOpcionesColor(producto.colores);
  const precio = crearElemento(
    "div",
    "precio",
    `$${producto.almacenamientos[0].precio}`,
  );
  const boton = crearElemento("button", "btn", "Añadir al Carrito");
  boton.type = "button";

  tarjeta.append(
    foto,
    titulo,
    descripcion,
    opcionesAlmacenamiento,
    opcionesColor,
    precio,
    boton,
  );

  return tarjeta;
};

const asignarEventosTarjetas = (contenedor) => {
  contenedor.querySelectorAll(".capacidad").forEach((capacidad) => {
    capacidad.addEventListener("click", (evento) => {
      const capacidadTocada = evento.currentTarget;
      const tarjeta = capacidadTocada.closest(".item");

      tarjeta
        .querySelectorAll(".capacidad")
        .forEach((opcion) => opcion.classList.remove("activa"));
      capacidadTocada.classList.add("activa");
      tarjeta.querySelector(".precio").textContent =
        `$${capacidadTocada.dataset.precio}`;
    });
  });

  contenedor.querySelectorAll(".swatch").forEach((swatch) => {
    swatch.addEventListener("click", (evento) => {
      const colorTocado = evento.currentTarget;
      const tarjeta = colorTocado.closest(".item");
      const imagenCelular = tarjeta.querySelector(".foto");

      imagenCelular.style.opacity = 0;
      setTimeout(() => {
        imagenCelular.src = colorTocado.dataset.img;
        imagenCelular.style.opacity = 1;
      }, 300);

      tarjeta
        .querySelectorAll(".swatch")
        .forEach((opcion) => opcion.classList.remove("activo"));
      colorTocado.classList.add("activo");
    });
  });

  contenedor.querySelectorAll(".item .btn").forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      const tarjeta = evento.currentTarget.closest(".item");
      const colorActivo = tarjeta.querySelector(".swatch.activo");
      const capacidadActiva = tarjeta.querySelector(".capacidad.activa");
      let nombreColor = "";
      if (colorActivo) {
        nombreColor = ` - ${colorActivo.dataset.nombre}`;
      }

      let nombreCapacidad = "";
      if (capacidadActiva) {
        nombreCapacidad = ` (${capacidadActiva.textContent})`;
      }

      agregarAlCarrito({
        titulo: `${tarjeta.querySelector("h3").textContent}${nombreCapacidad}${nombreColor}`,
        precio: tarjeta.querySelector(".precio").textContent,
        imagen: tarjeta.querySelector(".foto").src,
      });
    });
  });
};

const renderizarProductos = () => {
  const contenedorProductos = document.getElementById("main-productos");
  if (!contenedorProductos) return;

  fetch("data/Iphone.json")
    .then((respuesta) => {
      if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo.");
      return respuesta.json();
    })
    .then((productos) => {
      contenedorProductos.textContent = "";
      productos.forEach((producto) => {
        contenedorProductos.append(crearTarjetaProducto(producto));
      });

      asignarEventosTarjetas(contenedorProductos);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
      const mensaje = crearElemento(
        "p",
        "mensaje-error",
        "No se pudieron cargar los productos. Intentá nuevamente más tarde.",
      );
      contenedorProductos.replaceChildren(mensaje);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  actualizarContador(obtenerCarrito());
  renderizarProductos();
});

window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) actualizarContador(obtenerCarrito());
});
