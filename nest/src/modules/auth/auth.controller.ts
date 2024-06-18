import {Controller, Get, Post, Body, UnauthorizedException, Request, Param} from '@nestjs/common';

import { AuthService } from './auth.service';
import { FilterAuthDto } from './dto/filter-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
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

  @Get('user/:token')
  async user(@Request() req, @Param('token') token: string) {
    try {
      const data = await this.jwtService.verifyAsync(token);

      if (!data) {
        throw new UnauthorizedException('User not authorized');
      }

      return await this.userService.findUser({ id: data['id'] }, [
        'id',
        'username',
        'firstname',
        'lastname',
      ]);
    } catch (e) {
      throw new UnauthorizedException('User not authorized');
    }
  }

  @Post('editorToken')
  async getEditorToken(@Body('token') token: string) {
    const data = await this.jwtService.verifyAsync(token);

    if (!data) {
      throw new UnauthorizedException('User not authorized');
    }

    const user = await this.userService.findUser({ id: data['id'] });
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
