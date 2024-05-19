import { Controller, Get, Post, Body, Res, Req, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { FilterAuthDto } from "./dto/filter-auth.dto";

import * as bcrypt from 'bcrypt';
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('registration')
  async registration(@Body() filterAuthDto: FilterAuthDto) {
    const { username, password, email, firstname, lastname, role } = filterAuthDto;
    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await this.authService.registration({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      role
    });
    delete user.password;

    return user;
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    response.cookie('jwt', await this.authService.login(username, password), { httpOnly: true });

    return {
      message: 'success'
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException('User not authorized 111');
      }

      const user = await this.authService.findOne({ id: data['id'] });
      const { password, ...result } = user;

      return result;
    }
    catch (e) {
      throw new UnauthorizedException('User not authorized');
    }
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response
  ) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }
}