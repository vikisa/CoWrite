import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users.entity';
import { Materials } from './entities/Materials.entity';
import { UserRoles } from './entities/UserRoles.entity';
import { AuthModule } from './modules/auth/auth.module';
import { MaterialModule } from './modules/material/material.module';
import { SocketModule } from './modules/socket/socket.module';
import { CollabModule } from './modules/collab/collab.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CommentModule } from './modules/comment/comment.module';

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
        entities: [Users, UserRoles, Materials],
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('redis.host'),
          port: +config.get('redis.port'),
          db: 1,
        },
      }),
    }),
    AuthModule,
    MaterialModule,
    SocketModule,
    CollabModule,
    CommentModule,
  ],
})
export class AppModule {}
