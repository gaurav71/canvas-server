import { Server } from 'http'
import socketIO, { Socket, Server as SocketServer } from 'socket.io'

const events = {
  CONNECTED: 'CONNECTED',
  JOIN_CONVAS_ROOM: 'JOIN_CONVAS_ROOM',
  CANVAS_SHAPE_CHANGE: 'CANVAS_SHAPE_CHANGE',
  SHAPE_UPDATED: 'SHAPE_UPDATED'
} as const

const initializeSocketEvents = (httpServer: Server) => {

  const io = socketIO(httpServer)
  let socket = (null as any) as Socket

  io.on("connection", (socketConnection) => {
    console.log("connected")
    socket = socketConnection
    socket.emit(events.CONNECTED, "socket connection open")
    socket.on(events.JOIN_CONVAS_ROOM, joinCanvasRoom)
    socket.on(events.CANVAS_SHAPE_CHANGE, canvasShapeChange)
  })

  const joinCanvasRoom = (id: string) => {
    console.log(`canvas room ${id} joined`)
    socket.join(id)
  }

  const canvasShapeChange = (data: any) => {
    console.log(data)
    const { shape, canvasId } = data
    socket.to(canvasId).emit(events.SHAPE_UPDATED, shape)
  }

}

export default initializeSocketEvents

