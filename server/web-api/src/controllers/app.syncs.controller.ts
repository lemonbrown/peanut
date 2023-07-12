import { BadRequestException, Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AppService } from '../app.service';
import Pocketbase from 'pocketbase'
import { CreateMangaRequest } from '../Models/Request/CreateManga';
import { dataURItoBlob } from 'src/utils/dataUriHelper';
import { ConfigService } from '@nestjs/config';
import { AddChapterRequest } from 'src/Models/Request/AddChapter';

@Controller("sync")
export class SyncController {

    pb: Pocketbase;

  constructor(private readonly appService: AppService, private configService: ConfigService) {
    this.pb = appService.getPocketBase();
  }

  @Get()
  async getAll(@Headers() headers: Record<string, string>): Promise<any>{

    let result: any;

    let apiKey: string = headers["x-api-key"];

    if(apiKey){

        try{

            let appRecord  = await this.pb.collection("app_accounts").getFirstListItem('apikey="' + apiKey + '"');

            if(appRecord.permissions == "all"){

                result = await this.pb.collection("syncs").getFullList({
                    expand: "series"
                });
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
  

}
