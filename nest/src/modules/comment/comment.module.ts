import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Users } from '../../entities/Users.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    SocketModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Users
    ]),
  ]
})
export class CommentModule {}
