import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { Not, Repository} from 'typeorm';
import { UserRoles } from '../../entities/UserRoles.entity';
import {DEFAULT_USER_RELATION} from "../../constants/user";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async getRoles() {
    const roles = await this.userRolesRepository.find({
      where: { id: Not(1) },
    });
    if (!roles) throw new NotFoundException('Роли не найдены');

    return roles;
  }

  async findUser(condition: any, columns?) {
    const select = columns ? columns : DEFAULT_USER_RELATION;

    return await this.userRepository.findOne({
      select: select,
      where: condition,
      relations: ['roles'],
    });
  }
}
