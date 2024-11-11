import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '../services/logger.service';
import { UserEntity, DEFAULT_SELECTED_FIELDS } from './user.entity';
import { transformSelectFields } from '../helpers/transform-select-fields';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getListOfUsers(): Promise<{ users: UserEntity[] }> {
    const relations = ['subscriptions'];

    const users = await this.userRepo.find({
      select: transformSelectFields(DEFAULT_SELECTED_FIELDS),
      relations,
    });
    this.logger.log('Fetched list of users');
    return { users };
  }
  async getUserById(id: string): Promise<{ user: UserEntity }> {
    const relations = ['subscriptions'];
    const user = await this.userRepo.findOneOrFail({
      where: { id },
      select: transformSelectFields(DEFAULT_SELECTED_FIELDS),
      relations,
    });
    this.logger.log('Fetched user by id');
    return { user };
  }
}
