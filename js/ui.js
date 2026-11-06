export const actualizarContador = (carrito) => {
  const badge = document.getElementById("contador-carrito");
  if (badge) {
    badge.innerText = carrito.length;
    // Mantenemos tu lógica de ocultar la burbuja si está vacía
    if (carrito.length > 0) {
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }
};

export const mostrarMensaje = (mensaje) => {
  let toast = document.getElementById("toast-agregado");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-agregado";
    toast.className = "toast-notificacion";
    toast.innerHTML = '<i class="fas fa-check-circle"></i> <span></span>';
    document.body.appendChild(toast);
  }

  const texto = toast.querySelector("span");
  if (texto) texto.textContent = mensaje;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 3000);
};

export const mostrarToast = () => mostrarMensaje("¡Agregado al carrito!");
