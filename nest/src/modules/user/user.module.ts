import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users } from '../../entities/Users.entity';
import { UserRoles } from '../../entities/UserRoles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([Users, UserRoles])],
  exports: [UserService],
})
export class UserModule {}
