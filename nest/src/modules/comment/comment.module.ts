import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [SocketModule, ConfigModule, UserModule],
})
export class CommentModule {}
