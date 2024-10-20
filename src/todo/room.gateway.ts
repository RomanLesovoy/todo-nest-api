import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
// import { Column } from "./entities/column.entity";
// import { Todo } from "./entities/todo.entity";

interface JoinRoomPayload {
  roomHash: string;
}

// interface RoomUpdatePayload {
//   message: string;
//   action: 'add' | 'remove' | 'update';
//   type: 'column' | 'todo';
//   value: Column | Todo;
//   roomHash: string;
// }

@WebSocketGateway(10000, { cors: true })
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: JoinRoomPayload): void {
    console.log('Client joined room:', payload);
    client.join(payload.roomHash);
    client.emit('joinedRoom', { roomHash: payload.roomHash });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: JoinRoomPayload): void {
    console.log('Client left room:', payload);
    client.leave(payload.roomHash);
    client.emit('leftRoom', { roomHash: payload.roomHash });
  }

  // @SubscribeMessage('sendMessage')
  // handleSendMessage(_: Socket, payload: RoomUpdatePayload): void {
  //   console.log('Message sent:', payload);
  //   this.server.to(payload.roomHash).emit('roomUpdate', payload);
  // }
}
