import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MangaController } from './controllers/app.manga.controller';
import { ServiceController } from './controllers/app.services.controller';
import { SyncController } from './controllers/app.syncs.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, MangaController, ServiceController, SyncController],
  providers: [AppService],
})
export class AppModule {}
