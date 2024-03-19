import { IsEmail, IsNotEmpty,  IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { DeviceDto } from './device.dto';

export class LoginDto extends DeviceDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @MaxLength(255)
    @MinLength(3)
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @IsString()
    // @IsPhoneNumber('VI' || 'GB' || 'US')
    @IsOptional()
    phone: string;

    @MinLength(6)
    @IsString()
    @IsNotEmpty()
    password: string;



}
// function IsOneOfFieldsNotEmpty(fields: string[], validationOptions?: ValidationOptions) {
//     return function (object: Object, propertyName: string) {
//         registerDecorator({
//             name: 'isOneOfFieldsNotEmpty',
//             target: object.constructor,
//             propertyName: propertyName,
//             constraints: [fields],
//             options: validationOptions,
//             validator: {
//                 validate(args: ValidationArguments) {
//                     const nonEmptyFields = fields.filter(field => (args.object as Record<string, any>)[field]);
//                     return nonEmptyFields.length === 1;
//                 }
//             }

//         });
//     };
// }