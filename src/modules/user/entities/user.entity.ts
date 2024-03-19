import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

// export class UserEntity implements User {
//     id!: number;
//     email!: string;
//     name!: string;
//     phone!: string;
//     isDeleted!: boolean;
//     isVerified!: boolean;
//     image!: string;

//     createdAt!: Date;
//     updatedAt!: Date;
// }
export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    id: number;
    firstname: string;
    lastname: string;
    fullname: string;
    username: string;
    email: string;
    phone: string;

    @Exclude()
    password: string;

    isDeleted: boolean;
    isVerified: boolean;
    image: string;

    createdAt: Date;
    updatedAt: Date;
}