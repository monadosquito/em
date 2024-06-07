import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service'

async function bootstrap() {
  const initApp = await NestFactory.createApplicationContext(AppModule);
  const seedService = initApp.get(SeedService);

  await seedService.freeFromProblems();
  await initApp.close();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
