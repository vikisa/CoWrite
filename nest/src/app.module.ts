import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import configuration from './config/configuration';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "./entities/Users.entity";
import {UserRoles} from "./entities/UserRoles.entity";
import {AuthModule} from './modules/auth/auth.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'cowrite',
      entities: [
        Users,
        UserRoles
      ],
      synchronize: true,
    }),
    AuthModule
  ],
})
export class AppModule {}
