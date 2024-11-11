import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { loginBodySchema, registerBodySchema } from './auth.request-schema';
import { AllExceptionsFilter } from '../errors/exception-filter';
import validationPipe from '../validation-pipe';
import { SwaggerTags } from '../constants/enums/swagger-tags.enum';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(validationPipe())
  @UseFilters(AllExceptionsFilter)
  @ApiTags(SwaggerTags.AUTH)
  @HttpCode(HttpStatus.OK)
  @ApiBody(loginBodySchema)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UsePipes(validationPipe())
  @UseFilters(AllExceptionsFilter)
  @ApiTags(SwaggerTags.AUTH)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody(registerBodySchema)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.gender,
      registerDto.email,
    );
  }
}
