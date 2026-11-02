// Solo se ejecuta si estamos en la página que tiene el contenedor de productos
const mainProductos = document.getElementById("main-productos");

if (mainProductos) {
  // Recorremos el arrayProductos que viene de database.js
  for (const producto of arrayProductos) {
    // 1. Creamos el article (la tarjeta base)
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("item");

    // 2. Armamos el HTML interno (botones de capacidad y colores)
    let htmlCapacidades = '<div class="opciones-almacenamiento">';
    producto.almacenamientos.forEach((cap, index) => {
      let claseActiva = index === 0 ? "activa" : "";
      htmlCapacidades += `<span class="capacidad ${claseActiva}" data-precio="${cap.precio}">${cap.gb}</span>`;
    });
    htmlCapacidades += "</div>";

    let htmlColores = '<div class="colores">';
    producto.colores.forEach((color, index) => {
      let claseActivo = index === 0 ? "activo" : "";
      htmlColores += `<span class="swatch ${claseActivo} ${color.claseCss}" data-img="${color.img}" data-nombre="${color.nombre}"></span>`;
    });
    htmlColores += "</div>";

    const precioInicial = producto.almacenamientos[0].precio;
    const imagenInicial = producto.colores[0].img;

    // 3. Inyectamos todo el HTML dentro de la tarjeta
    tarjeta.innerHTML = `
      <img src="${imagenInicial}" alt="${producto.nombre}" class="foto" />
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      ${htmlCapacidades}
      ${htmlColores}
      <div class="precio">$${precioInicial}</div>
      <button class="btn">Añadir al Carrito</button>
    `;

    // 4. Inyectamos la tarjeta terminada en el div principal del index.html
    mainProductos.appendChild(tarjeta);
  }

  // --- REASIGNAR EVENTOS DESPUÉS DE RENDERIZAR ---

  // A. Evento para píldoras de almacenamiento
  const pildoras = document.querySelectorAll(".capacidad");
  pildoras.forEach(function (pildora) {
    pildora.addEventListener("click", function (evento) {
      const pildoraTocada = evento.target;
      const tarjetaActual = pildoraTocada.closest(".item");

      const pildorasDelCelular = tarjetaActual.querySelectorAll(".capacidad");
      pildorasDelCelular.forEach(function (p) {
        p.classList.remove("activa");
      });

      pildoraTocada.classList.add("activa");

      const nuevoPrecio = pildoraTocada.getAttribute("data-precio");
      if (nuevoPrecio) {
        tarjetaActual.querySelector(".precio").innerText = "$" + nuevoPrecio;
      }
    });
  });

  // B. Evento para colores (con transición suave)
  const swatches = document.querySelectorAll(".swatch");
  swatches.forEach(function (swatch) {
    swatch.addEventListener("click", function (evento) {
      const circulitoTocado = evento.target;
      const tarjetaActual = circulitoTocado.closest(".item");

      const imagenCelular = tarjetaActual.querySelector(".foto");
      const nuevaImagen = circulitoTocado.getAttribute("data-img");

      imagenCelular.style.opacity = 0;

      setTimeout(function () {
        imagenCelular.src = nuevaImagen;
        imagenCelular.style.opacity = 1;
      }, 300);

      const coloresDelCelular = tarjetaActual.querySelectorAll(".swatch");
      coloresDelCelular.forEach(function (color) {
        color.classList.remove("activo");
      });

      circulitoTocado.classList.add("activo");
    });
  });

  // C. Evento para añadir al carrito
  const botonesAgregar = document.querySelectorAll(".item .btn");
  botonesAgregar.forEach(function (boton) {
    boton.addEventListener("click", function (evento) {
      const tarjetaActual = evento.target.closest(".item");

      const swatchActivo = tarjetaActual.querySelector(".swatch.activo");
      let colorElegido = swatchActivo
        ? " - " + swatchActivo.getAttribute("data-nombre")
        : "";

      const capacidadActiva = tarjetaActual.querySelector(".capacidad.activa");
      let capacidadElegida = capacidadActiva
        ? " (" + capacidadActiva.innerText + ")"
        : "";

      const producto = {
        titulo:
          tarjetaActual.querySelector("h3").innerText +
          capacidadElegida +
          colorElegido,
        precio: tarjetaActual.querySelector(".precio").innerText,
        imagen: tarjetaActual.querySelector(".foto").src,
      };

      carrito.push(producto);
      localStorage.setItem("carritoMundoIphone", JSON.stringify(carrito));

      actualizarContador();
      mostrarToast();
    });
  });
}
