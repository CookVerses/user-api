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
    const users = await this.userRepo.find({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        role: true,
        dateOfBirth: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this.logger.log('Fetched list of users');
    return users;
  }
  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findOneOrFail({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        role: true,
        dateOfBirth: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    this.logger.log('Fetched user by id');
    return user;
  }
}
