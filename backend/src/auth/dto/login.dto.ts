import {
  IsEmail,
  IsNotEmpty,
  Matches,
} from 'class-validator';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!.%*?&]{8,20}$/;

export class LoginDto {
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
}