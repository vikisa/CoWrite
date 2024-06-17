import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/socket',
  cors: true,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor() {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('addComment')
  async addComment(editingId: string, payload: object) {
    this.server.emit('new-comment', { editingId, ...payload });
  }

  @SubscribeMessage('changeHeader')
  async changeHeader(editingId: string, header: string) {
    this.server.emit('change-header', { editingId, header });
  }

  @SubscribeMessage('addEditor')
  async addEditor(editingId: string, editor: object) {
    this.server.emit('add-editor', { editingId, editor });
  }
}
