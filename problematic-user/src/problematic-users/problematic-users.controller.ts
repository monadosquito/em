import { Controller, Patch, Param } from '@nestjs/common';
import { ProblematicUsersService } from './problematic-users.service';

@Controller('problematic-users')
export class ProblematicUsersController {
    constructor(
        private readonly problematicUsersService: ProblematicUsersService
    ) {}

    @Patch('/free-from-problems/:userId')
    async freeFromProblems(@Param('userId') userId: number) {
        const probUsersCnt = this.problematicUsersService.freeFromProblems(
            userId
        )
        return probUsersCnt
    }
}
