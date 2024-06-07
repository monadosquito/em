import { Test, TestingModule } from '@nestjs/testing';
import { ProblematicUsersService } from './problematic-users.service';

describe('ProblematicUsersService', () => {
  let service: ProblematicUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProblematicUsersService],
    }).compile();

    service = module.get<ProblematicUsersService>(ProblematicUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
