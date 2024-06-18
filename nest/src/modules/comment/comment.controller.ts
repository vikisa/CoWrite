import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { SocketGateway } from '../socket/socket.gateway';
import { UserService } from '../user/user.service';

@Controller('api/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    @InjectRedis() private readonly redis: Redis,
    private config: ConfigService,
    private readonly socket: SocketGateway,
  ) {}

  @Get(':editingId')
  async getCommentsByEditingId(
    @Request() req,
    @Param('editingId') editingId: string,
  ) {
    const result = [];
    const keys: string[] = await this.redis.keys(
      `*material:comments-${editingId}-*`,
    );

    if (keys && !keys.length) return [];

    await this.redis.mget(keys).then(async (values) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i].replace('material:comments-', '');
        const regexp = /(.{16})-(.{10})-([0-9]+)-([0-9]+)/;
        const keyValues = key.match(regexp);

        if (values[i]) {
          result.push(
            await this.getComment(
              editingId,
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
    const user = await this.userService.findUser({ id: Number(userId) }, [
      'firstname',
      'lastname',
    ]);

    return {
      editingId: editingId,
      blockId: blockId,
      userId: userId,
      timestamp: timestamp,
      text: JSON.parse(commentText),
      userData: {
        id: userId,
        name: `${user.lastname} ${user.firstname}`,
      },
    };
  }
}
