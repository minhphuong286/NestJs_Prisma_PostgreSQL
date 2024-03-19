import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { PostgresqlPrismaModule } from 'src/providers/postgresql-prisma/postgresql-prisma.module';

@Module({
    imports: [PostgresqlPrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
