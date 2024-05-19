import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "./entities/Users.entity";
import {UserRoles} from "./entities/UserRoles.entity";
import {AuthModule} from './modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        database: config.get('database.database'),
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        entities: [
          Users,
          UserRoles
        ],
        synchronize: true,
      }),
    }),
    AuthModule
  ],
})
export class AppModule {}
