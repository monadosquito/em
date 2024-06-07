import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblematicUser } from 'src/problematicUser.entity';


const genStr = (n: number) => Array(10).fill(n).join('')


@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(ProblematicUser)
        private readonly problematicUserRepo: Repository<ProblematicUser>,
    ) {}

    async freeFromProblems() {
        await this.problematicUserRepo.clear()
        for (let i=0; i < 1010; i++) {
            const str = genStr(i)
            const age = Math.round(Math.random() * 100)
            const u = this.problematicUserRepo.create({
                firstName: str,
                lastName: str,
                age,
                problems: true,
            })
            await this.problematicUserRepo.save(u)
        }
    }
}
