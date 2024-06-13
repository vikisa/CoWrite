import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { UserRoles } from '../../entities/UserRoles.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(data: any): Promise<Users> {
    return this.userRepository.save(data);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'username',
        'password',
        'email',
        'firstname',
        'lastname',
        'role',
      ],
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('User not authorized');
    }

    const tokenData = {
      userId: user.id,
      userLogin: user.username,
    };

    return this.jwtService.sign(tokenData);
  }

  async findOne(condition: any) {
    return await this.userRepository.findOne({
      where: condition,
      relations: ['roles'],
    });
  }

  async getRoles() {
    const roles = await this.userRolesRepository.find({
      where: { id: Not(1) },
    });
    if (!roles) throw new NotFoundException('Роли не найдены');

    return roles;
  }
}
