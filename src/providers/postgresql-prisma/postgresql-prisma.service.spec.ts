import { Test, TestingModule } from '@nestjs/testing';
import { PostgresqlPrismaService } from './postgresql-prisma.service';

describe('PostgresqlPrismaService', () => {
  let service: PostgresqlPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresqlPrismaService],
    }).compile();

    service = module.get<PostgresqlPrismaService>(PostgresqlPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
