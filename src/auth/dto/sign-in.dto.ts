import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsNotEmpty({ message: 'Missing username' })
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty({ message: 'Missing password' })
  @IsString()
  @ApiProperty()
  password: string;
}
