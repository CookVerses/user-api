import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { config } from '../config';
import { UserEntity } from '../user/user.entity';
import { JwtPayload } from '../constants/types/jwt-payload.type';
import { Logger } from '../services/logger.service';
import { ApiError } from '../errors/exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async signIn(username: string, pass: string): Promise<{ token: string }> {
    this.logger.log({
      username,
      pass,
      message: '[login] User login',
    });
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      this.logger.log({
        username,
        message: '[login] User does not exist',
      });
      throw new ApiError('FORBIDDEN', 'User does not exist');
    }

    if (user.password !== pass) {
      this.logger.log({
        username,
        message: '[login] Invalid password',
      });
      throw new ApiError('FORBIDDEN', 'Invalid password');
    }

    this.logger.log({
      user,
      message: '[login] Create jwt token for user',
    });

    const jwtPayload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return { token: this.jwtService.sign(jwtPayload) };
  }
}
