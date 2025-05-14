import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}

export class RegisterDto extends LoginDto {} 
