import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { FilterAuthDto } from './dto/filter-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() filterAuthDto: FilterAuthDto) {
    const { username, password, email, firstname, lastname, role } =
      filterAuthDto;
    const hashedPassword = await bcrypt.hash(password, 5);

    return await this.authService.register({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      role,
    });
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

  @Post('editor-token')
  async getEditorToken(@Body('token') token: string) {
    const data = await this.jwtService.verifyAsync(token);

    if (!data) {
      throw new UnauthorizedException('User not authorized');
    }

    const user = await this.authService.findOne({ id: data['id'] });
    const userPayload = {
      id: user.id,
      fullname: `${user.lastname} ${user.firstname}`,
    };
    const userToken = this.jwtService.sign(userPayload);

    const signOptions: JwtSignOptions = {
      secret: this.configService.get('jwt.editor.secret'),
      expiresIn: this.configService.get('jwt.editor.expiresIn'),
    };

    const payload = {
      userToken: userToken,
      editorToken: this.configService.get('editor_token'),
    };

    return this.jwtService.sign(payload, signOptions);
  }
}
