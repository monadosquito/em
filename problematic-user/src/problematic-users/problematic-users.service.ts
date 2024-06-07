import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblematicUser } from 'src/problematicUser.entity';

@Injectable()
export class ProblematicUsersService {
    constructor(
        @InjectRepository(ProblematicUser)
        private readonly problematicUserRepo: Repository<ProblematicUser>,
    ) {}

    async freeFromProblems(userId: number): Promise<number> {
        const probUsersCnt = this.problematicUserRepo.countBy({ problems: true })
        this.problematicUserRepo.update({ id: userId }, { problems: false })
        return probUsersCnt
    }
}
