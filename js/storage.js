const KEY = "carritoMundoIphone";

export const guardarCarrito = (carrito) => {
  localStorage.setItem(KEY, JSON.stringify(carrito));
};

export const obtenerCarrito = () => {
  try {
    const carrito = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(carrito)) {
      return carrito;
    }

    return [];
  } catch {
    return [];
  }
};

export const vaciarCarritoStorage = () => {
  localStorage.removeItem(KEY);
};
