import { Injectable, NotFoundException } from '@nestjs/common';
import { PostgresqlPrismaService } from 'src/providers/postgresql-prisma/postgresql-prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { CreateUserDto, UpdateUserDto } from '../dto';

export const roundsOfHashing = 10;


@Injectable()
export class UserService {
  constructor(
    private postgresqlPrismaService: PostgresqlPrismaService,
  ) { }
  private paginate = createPaginator({ perPage: 20 });

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    return this.postgresqlPrismaService.user.create({
      data: createUserDto,
    });
  }

  async findAll(page: number | 1) {
    return await this.paginate<User, Prisma.UserFindManyArgs>(
      this.postgresqlPrismaService.user,
      {},
      { page },
    );
  }

  findOne(id: number) {
    return this.postgresqlPrismaService.user.findUnique({ where: { id } });
  }

  async findUnique(uniqueField: string) {
    const user = await this.postgresqlPrismaService.user.findFirst({
      where: {
        OR: [
          { username: uniqueField },
          { email: uniqueField },
          { phone: uniqueField }
        ]
      }
    })
    if (!user) throw new NotFoundException();
    return user;
  }
  // async findUnique(username?: string, email?: string, phone?: string) {
  //   const user = await this.postgresqlPrismaService.user.findFirst({ 
  //     where: { 
  //       OR: [
  //         { username },
  //         { email },
  //         { phone }
  //       ]
  //     } 
  //   })
  //   if (!user) throw new NotFoundException();
  //   return user;
  // }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.postgresqlPrismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.postgresqlPrismaService.user.delete({ where: { id } });
  }
}