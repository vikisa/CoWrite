import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from 'class-validator';

export class FilterAuthDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty({ message: 'An username is required' })
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsNotEmpty({ message: 'A password is required' })
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsNotEmpty({ message: 'An email is required' })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty({ message: 'A firstname is required' })
  firstname: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty({ message: 'A lastname is required' })
  lastname: string;

  @IsNumber()
  @IsNotEmpty({ message: 'A role is required' })
  role: number;
}
