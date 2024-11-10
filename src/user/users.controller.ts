import { Controller, Get, UseFilters, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AllExceptionsFilter } from '../errors/exception-filter';
import validationPipe from '../validation-pipe';
import { SwaggerTags } from '../constants/enums/swagger-tags.enum';
import { UsersService } from './users.service';

@UsePipes(validationPipe())
@UseFilters(AllExceptionsFilter)
@ApiTags(SwaggerTags.USERS)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  getUsers() {
    return this.usersService.getListOfUsers();
  }
}
