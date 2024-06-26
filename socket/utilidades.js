import { onlineUsers, salas } from "./commons.js";
import { io } from "./socket.js"

export const expressMiddlewareAdapter = (middleware) => async (socket, next) => {
  try{
    console.log("Intento de conexion")
    if (!socket.handshake.headers.authorization)
      socket.handshake.headers.authorization = socket.handshake.auth.token
    await middleware(socket.handshake, {}, next);
  }catch(e){
    next(e);
  }
}

export const createOnEvents = (socket, namespace, handlersObject) => {
  if (!handlersObject) return;
  Object.entries(handlersObject).forEach(([name, handler]) => {
    const evento = `${namespace}:${name}`
    socket.on(`${namespace}:${name}`, handler(socket,evento))
  })
}

export const createOnceEvents = (socket, namespace, handlersObject) => {
  if (!handlersObject) return;
  Object.entries(handlersObject).forEach(([name, handler]) => socket.once(`${namespace}:${name}`, handler(socket)))
}

export const useEvents = (socket, namespace, handlersObject) => {
  if (!handlersObject) return;
  createOnEvents(socket, namespace, handlersObject.onEvents)
  createOnceEvents(socket, namespace, handlersObject.onceEvents)
}

export const salaNoValida = (sala) => !Object.values(salas).includes(sala)


export const unirSalaRol = (socket, rol) => {
  if (salaNoValida(rol)) return;
  socket.join(rol)
}

export const unirAOnline = (socket, idusuario) => {
  socket.join(idusuario)
  if (!onlineUsers.includes(idusuario)) {
    socket.broadcast.emit("cambio-en-online")
    onlineUsers.push(idusuario);
  }
}

export const seDesconecta = async (socket, idusuario) => {
  const sockets = await socket.in(idusuario).fetchSockets();
  const indexSala = onlineUsers.indexOf(idusuario)
  if (sockets.length === 0 && indexSala > -1) {
    console.log("Se deconecto")
    socket.broadcast.emit("cambio-en-online")
    onlineUsers.splice(indexSala,1);
  }
}

// export const obtenerSocket = () => {
//   const roomsMap = io.sockets.adapter.rooms;
//   const rooms = Array.from(roomsMap.entries(), ([sala]) => ( sala ))
//   console.log(rooms)
//   return rooms;
// }

export const verOnlineIds = () => {
  return onlineUsers;
}

export const reqOnline = (usuario) => {
  usuario.online = isOnline(usuario.idusuario)
}

export const isOnline = (idusuario) => {
  console.log("usuario", idusuario, onlineUsers)
  return onlineUsers.includes(idusuario)
}