export const actualizarContador = (carrito) => {
  const badge = document.getElementById("contador-carrito");
  if (!badge) return;

  badge.textContent = carrito.length;
  if (carrito.length > 0) {
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
};

export const mostrarMensaje = (mensaje, icono = "success") => {
  return Swal.fire({
    title: mensaje,
    icon: icono,
    confirmButtonText: "Entendido",
    customClass: {
      confirmButton: "swal-boton-principal",
    },
  });
};

export const confirmarAccion = (
  titulo,
  texto,
  textoConfirmar,
  icono = "warning",
) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: textoConfirmar,
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "swal-boton-peligro",
      cancelButton: "swal-boton-cancelar",
    },
    reverseButtons: true,
  });
};

export const mostrarToast = (mensaje, icono = "info") => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
};
