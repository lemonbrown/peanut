import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import Pocketbase from 'pocketbase'
import { CreateMangaRequest } from './Models/Request/CreateManga';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  createManga(@Body() createMangaRequest: CreateMangaRequest): void{

    let createMangaData: FormData;

    let avatar: File = new File([new Blob([createMangaRequest.avatar], {type:'text/plain'})], "avatar.txt", {type: "text/plain"});

    createMangaData.append("avatar", avatar);

    createMangaData.append("title", createMangaRequest.title);
    
  }
}
