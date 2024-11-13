

// This DTO validate the all the field of input values

import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!.%*?&]{8,20}$/;
const passwo = "cutebear777.C!";
console.log(passwordRegEx.test(passwo));


export class CreateUserDto {
  @IsString()
  @MinLength(2, {message: 'Name must have at least 2 characters.'})
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @MinLength(2, {message: 'Name must have at least 2 characters.'})
  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail({}, {message: 'Please provide valid Email.'})
  email:string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `password must contain Minimum 8 and maximum 20 characters,
    at least one uppercase letter,
    one number and
    one special character`,
  })
  password:string;

  @IsString()
  @IsEnum(['admin', 'user'])
  @IsOptional()//This field is optional when the user is creating a new account
  @Transform(({value}) => value || 'user') //Defalut to 'user' if not provided
  role ?: string;


  @IsOptional()
  @IsString()
  currentPassword?:string;
}
