import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '../../entities/Users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      select: ['firstname', 'lastname'],
      where: { id: Number(id) },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async getComment(key: string) {
    return this.redis.get(key);
  }
}
