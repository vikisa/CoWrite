import { Module } from '@nestjs/common';
import { CollabGateway } from './collab.gateway';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [CollabGateway, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
