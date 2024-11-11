import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity, BASIC_SELECTABLE_FIELDS } from '../user/user.entity';
import { JwtPayload } from '../constants/types/jwt-payload.type';
import { Logger } from '../services/logger.service';
import { ApiError } from '../errors/exceptions';
import { transformSelectFields } from '../helpers/transform-select-fields';
import { UserRole } from '../constants/enums/user-role.enum';
import { Gender } from '../constants/enums/gender.enum';

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
    const user = await this.userRepo.findOne({
      select: transformSelectFields(BASIC_SELECTABLE_FIELDS),
      where: { username },
    });

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

  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: Gender,
    email: string,
  ): Promise<{ message: string }> {
    this.logger.log({
      username,
      message: '[register] New user registration',
    });
    const existingUser = await this.userRepo.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      throw new ApiError('BAD_REQUEST', 'Username or email already exists');
    }

    const role = UserRole.USER;

    const newUser = this.userRepo.create({
      username,
      password,
      firstName,
      lastName,
      gender,
      email,
      role,
    });
    await this.userRepo.save(newUser);

    return {
      message: 'User registered successfully',
    };
  }
}
