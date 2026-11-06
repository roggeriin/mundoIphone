import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";
import { agregarAlCarrito } from "./funcionesCarrito.js";
import { arrayProductos } from "./database.js";

const renderizarProductos = () => {
  const mainProductos = document.getElementById("main-productos");
  if (!mainProductos) return;

  mainProductos.innerHTML = ""; // Limpiamos por seguridad

  // Recorremos la base de datos armando tus tarjetas personalizadas
  arrayProductos.forEach((producto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("item");

    // HTML dinámico de tus capacidades
    let htmlCapacidades = '<div class="opciones-almacenamiento">';
    producto.almacenamientos.forEach((cap, index) => {
      let claseActiva = index === 0 ? "activa" : "";
      htmlCapacidades += `<span class="capacidad ${claseActiva}" data-precio="${cap.precio}">${cap.gb}</span>`;
    });
    htmlCapacidades += "</div>";

    // HTML dinámico de tus colores
    let htmlColores = '<div class="colores">';
    producto.colores.forEach((color, index) => {
      let claseActivo = index === 0 ? "activo" : "";
      htmlColores += `<span class="swatch ${claseActivo} ${color.claseCss}" data-img="${color.img}" data-nombre="${color.nombre}"></span>`;
    });
    htmlColores += "</div>";

    const precioInicial = producto.almacenamientos[0].precio;
    const imagenInicial = producto.colores[0].img;

    tarjeta.innerHTML = `
      <img src="${imagenInicial}" alt="${producto.nombre}" class="foto" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      ${htmlCapacidades}
      ${htmlColores}
      <div class="precio">$${precioInicial}</div>
      <button class="btn">Añadir al Carrito</button>
    `;

    mainProductos.appendChild(tarjeta);
  });

  asignarEventosTarjetas();
};

const asignarEventosTarjetas = () => {
  // A. Evento de capacidades (Actualización de Precio)
  const pildoras = document.querySelectorAll(".capacidad");
  pildoras.forEach((pildora) => {
    pildora.addEventListener("click", (evento) => {
      const pildoraTocada = evento.target;
      const tarjeta = pildoraTocada.closest(".item");

      tarjeta
        .querySelectorAll(".capacidad")
        .forEach((p) => p.classList.remove("activa"));
      pildoraTocada.classList.add("activa");

      const nuevoPrecio = pildoraTocada.getAttribute("data-precio");
      if (nuevoPrecio) {
        tarjeta.querySelector(".precio").innerText = "$" + nuevoPrecio;
      }
    });
  });

  // B. Evento de colores (Transición suave de la foto)
  const swatches = document.querySelectorAll(".swatch");
  swatches.forEach((swatch) => {
    swatch.addEventListener("click", (evento) => {
      const circulitoTocado = evento.target;
      const tarjeta = circulitoTocado.closest(".item");

      const imagenCelular = tarjeta.querySelector(".foto");
      const nuevaImagen = circulitoTocado.getAttribute("data-img");

      imagenCelular.style.opacity = 0;
      setTimeout(() => {
        imagenCelular.src = nuevaImagen;
        imagenCelular.style.opacity = 1;
      }, 300);

      tarjeta
        .querySelectorAll(".swatch")
        .forEach((c) => c.classList.remove("activo"));
      circulitoTocado.classList.add("activo");
    });
  });

  // C. Evento para Añadir al Carrito
  const botonesAgregar = document.querySelectorAll(".item .btn");
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      const tarjeta = evento.target.closest(".item");

      const swatchActivo = tarjeta.querySelector(".swatch.activo");
      let colorElegido = swatchActivo
        ? " - " + swatchActivo.getAttribute("data-nombre")
        : "";

      const capacidadActiva = tarjeta.querySelector(".capacidad.activa");
      let capacidadElegida = capacidadActiva
        ? " (" + capacidadActiva.innerText + ")"
        : "";

      const productoFormateado = {
        titulo:
          tarjeta.querySelector("h3").innerText +
          capacidadElegida +
          colorElegido,
        precio: tarjeta.querySelector(".precio").innerText,
        imagen: tarjeta.querySelector(".foto").src,
      };

      agregarAlCarrito(productoFormateado);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const carrito = obtenerCarrito();
  actualizarContador(carrito);
  renderizarProductos();
});

// TU FIX: Solución para los gestos del celular (Back/Forward Cache)
window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) {
    const carrito = obtenerCarrito();
    actualizarContador(carrito);
  }
});
