import { Controller, Get, Post, Body, Res, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { FilterAuthDto } from './dto/filter-auth.dto';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() filterAuthDto: FilterAuthDto) {
    const { username, password, email, firstname, lastname, role } =
      filterAuthDto;
    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await this.authService.register({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      role,
    });
    delete user.password;

    return user;
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return await this.authService.login(username, password);
  }

  @Post('user')
  async user(@Body('token') token: string) {
    try {
      const data = await this.jwtService.verifyAsync(token);

      if (!data) {
        throw new UnauthorizedException('User not authorized');
      }

      const user = await this.authService.findOne({ id: data['id'] });
      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new UnauthorizedException('User not authorized');
    }
  }

  @Get('roles')
  async roles() {
    return await this.authService.getRoles();
  }
}
