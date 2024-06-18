import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CommentService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getComment(key: string) {
    return this.redis.get(key);
  }
}
