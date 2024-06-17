import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

import { Materials } from '../../entities/Materials.entity';
import { UsersToMaterials } from '../../entities/UsersToMaterials.entity';
import { SocketModule } from '../socket/socket.module';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, ConfigService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Materials,
      UsersToMaterials
    ]),
    SocketModule
  ],
  exports: [MaterialService, ConfigService],
})
export class MaterialModule {}
