const obtenerCarritoGuardado = () => {
  try {
    const carrito = JSON.parse(localStorage.getItem("carritoMundoIphone") || "[]");
    if (Array.isArray(carrito)) {
      return carrito;
    }

    return [];
  } catch {
    return [];
  }
};

const actualizarContador = () => {
  const badge = document.getElementById("contador-carrito");
  if (!badge) return;

  const cantidad = obtenerCarritoGuardado().length;
  badge.innerText = cantidad;
  if (cantidad > 0) {
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", actualizarContador);
window.addEventListener("pageshow", actualizarContador);
