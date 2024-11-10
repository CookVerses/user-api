import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '../services/logger.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getListOfUsers(): Promise<UserEntity[]> {
    const users = await this.userRepo.find();
    this.logger.log('Fetched list of users');
    return users;
  }
}
