import { BadRequestException, Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AppService } from '../app.service';
import Pocketbase from 'pocketbase'
import { CreateMangaRequest } from '../Models/Request/CreateManga';
import { dataURItoBlob } from 'src/utils/dataUriHelper';
import { ConfigService } from '@nestjs/config';
import { AddChapterRequest } from 'src/Models/Request/AddChapter';

@Controller("manga")
export class MangaController {

    pb: Pocketbase;

  constructor(private readonly appService: AppService, private configService: ConfigService) {
    this.pb = appService.getPocketBase();
  }

  @Post()
  async createManga(@Headers() headers: Record<string, string>, @Body() createMangaRequest: CreateMangaRequest): Promise<any>{

    let result: any;

    let apiKey: string = headers["x-api-key"];

    if(apiKey.length > 0){

        try{

            let appRecord  = await this.pb.collection("app_accounts").getFirstListItem('apikey="' + apiKey + '"');

            if(appRecord.permissions == "all"){

                let createMangaData: FormData = new FormData();

                let avatar: Blob = dataURItoBlob(createMangaRequest.avatar);

                createMangaData.append("avatar", avatar);

                createMangaData.append("title", createMangaRequest.title);

                result = await this.pb.collection("mangas").create(createMangaData);
            }
            else{

                throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
            }
        }catch(exception){

            throw new HttpException("Unable to authenticate", HttpStatus.BAD_REQUEST);
        }
    }
    else{

        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    return result;
  }
  
  @Post(":id/service/:serviceId/chapters")
  async addChapter(@Headers() headers: Record<string, string>, @Param() params:any, @Body() addChapterRequest: AddChapterRequest): Promise<any>{

    let apiKey: string = headers["x-api-key"];

    let result: any;

    if(apiKey.length > 0){

        try{

            let service  = await this.pb.collection("services").getFirstListItem('apikey="' + apiKey + '"');

            if(service.id != params.serviceId){
                
                throw new BadRequestException("Unable to find service");
            }

            let duplicate: Boolean = false;

            try{

                let chapter = await this.pb.collection("chapters").getFirstListItem(`
                    serviceId="${service.id}" 
                    && name="${addChapterRequest.name}"
                    && number="${addChapterRequest.number}" 
                    && mangaId="${params.id}" 
                    && alternateName="${addChapterRequest.alternateName ?? ''}"
                `);

                //getFirstListItem throws exception if not found, otherwise it did find a duplicate
                duplicate = true;

            }
            catch(exception){

            }

            if(!duplicate){

                result = await this.pb.collection("chapters").create({
                    name: addChapterRequest.name, 
                    url: addChapterRequest.url,
                    number: addChapterRequest.number,
                    serviceId: service.id,
                    mangaId: params.id
                })

            }else{

                throw new BadRequestException("Cannot upload duplicate chapters");
            }
        }
        catch(exception){
            throw exception;
        }
    }
    
    return result;
  }


}
