import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(Number(process.env.PORT), {
  namespace: '/api/v1',
  transports: ['websocket', 'polling'],
  cors: true,
  // path: '/todo'
})
export class RoomGateway {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.rooms.forEach((room) => client.leave(room));
    client.join(room);

    console.log(`Client ${client.id} joined to room ${room}`);
    return { success: true, message: `Joined to room ${room}` };
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
