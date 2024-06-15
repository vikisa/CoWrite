import {Body, Controller, Get, Param, ParseIntPipe, Post, Request} from '@nestjs/common';
import { CommentService } from './comment.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('api/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    @InjectRedis() private readonly redis: Redis,
    private config: ConfigService,
    private readonly socket: SocketGateway,
  ) {}

  @Get(':id')
  async getCommentsByMaterialId(@Request() req, @Param('id') id: string) {
    const result = [];
    const keys: string[] = await this.redis.keys(`*material:comments-${id}-*`);

    await this.redis.mget(keys).then(async (values) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i].replace('material:comments-', '');
        const regexp = /(.{16})-(.{10})-([0-9]+)-([0-9]+)/;
        const keyValues = key.match(regexp);

        if (values[i]) {
          result.push(
            await this.getComment(
              id,
              keyValues[2],
              Number(keyValues[3]),
              Number(keyValues[4]),
              values[i],
            ),
          );
        }
      }
    });

    return result;
  }

  @Post('comment')
  async addComment(
    @Body('editingId') editingId: string,
    @Body('blockId') blockId: string,
    @Body('userId') userId: number,
    @Body('timestamp') timestamp: number,
    @Body('text') text: string,
  ) {
    if (!(editingId && blockId && userId && timestamp && text)) return;

    const key = `material:comments-${editingId}-${blockId}-${userId}-${timestamp}`;
    await this.redis.set(key, JSON.stringify(text));
    const commentText = await this.commentService.getComment(key);

    await this.socket.addComment(
      editingId,
      await this.getComment(editingId, blockId, userId, timestamp, commentText),
    );
  }

  async getComment(editingId, blockId, userId, timestamp, commentText) {
    const user = await this.commentService.getUserById(userId);
    const lastname = [...user.lastname];
    lastname[0] = lastname[0].toUpperCase();
    const firstname = [...user.firstname];
    firstname[0] = firstname[0].toUpperCase();

    return {
      editingId: editingId,
      blockId: blockId,
      userId: userId,
      timestamp: timestamp,
      text: JSON.parse(commentText),
      userData: {
        id: userId,
        name: `${lastname.join('')} ${firstname.join('')}`,
      },
    };
  }
}
