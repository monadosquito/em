import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProblematicUsersController } from './problematic-users/problematic-users.controller';
import { ProblematicUsersService } from './problematic-users/problematic-users.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProblematicUser } from './problematicUser.entity';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'em',
          password: '123',
          database: 'em',
          entities: [ProblematicUser],
          synchronize: true,
    }),
    TypeOrmModule.forFeature([ProblematicUser])
  ],
  controllers: [AppController, ProblematicUsersController],
  providers: [AppService, ProblematicUsersService, SeedService],
})
export class AppModule {}
