import { Test, TestingModule } from '@nestjs/testing';
import { ProblematicUsersController } from './problematic-users.controller';

describe('ProblematicUsersController', () => {
  let controller: ProblematicUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblematicUsersController],
    }).compile();

    controller = module.get<ProblematicUsersController>(ProblematicUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
