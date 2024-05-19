import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from "../../entities/Users.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private jwtService: JwtService
  ) {}

  async registration(data: any): Promise<Users> {
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

    return await this.jwtService.signAsync({ id: user.id });
  }

  async findOne(condition: any) {
    return await this.userRepository.findOne({
      where: condition
    });
  }
}