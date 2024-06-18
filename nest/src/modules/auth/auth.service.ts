import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { UserRoles } from '../../entities/UserRoles.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(data: any) {
    return this.userRepository.save(data);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findUser({ username: username }, [
      'id',
      'username',
      'password',
      'email',
    ]);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('User not authorized');
    }

    const tokenData = {
      id: user.id,
      userId: user.id,
      userLogin: user.username,
    };

    return this.jwtService.sign(tokenData);
  }
}
