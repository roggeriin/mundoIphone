const KEY = "carritoMundoIphone"; // Mantenemos tu key para no perder los datos que ya tenías guardados

export const guardarCarrito = (carrito) => {
  localStorage.setItem(KEY, JSON.stringify(carrito));
};

export const obtenerCarrito = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const vaciarCarritoStorage = () => {
  localStorage.removeItem(KEY);
};
