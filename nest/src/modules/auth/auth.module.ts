import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Users } from '../../entities/Users.entity';
import { UserRoles } from '../../entities/UserRoles.entity';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Users,
      UserRoles
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: {
          expiresIn: config.get('jwt.expiresIn'),
        },
      }),
    })
  ],
  exports: [AuthService, ConfigService],
})
export class AuthModule {}
